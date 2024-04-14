import { MikroORM, RequestContext } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';

import {
  AuthEmailsEntity,
  AuthPasswordEntity,
  AuthTokensEntity,
  AuthUserEntity,
} from '~/database/entities';
import { TokenType } from '~/database/enums/token.enum';
import { JWTPayload } from '~/modules/auth/interfaces/jwt.interface';
import { AuthAccountService } from '~/modules/auth/services/account.service';
import { AuthPasswordService } from '~/modules/auth/services/password.service';

import { Request } from 'express';
import { beforeEach, describe, expect, it } from 'vitest';

import { TestingMikroORMConfig } from '../../../../../mikro-orm.config';
import { JWTStrategy } from '../jwt.strategy';

describe('JWT Strategy', () => {
  let jwtStrategy: JWTStrategy;
  let jwtService: JwtService;
  let accountService: AuthAccountService;

  let em: EntityManager;
  let orm: MikroORM;

  let user: AuthUserEntity;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath: '.env.test' }),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (_configService: ConfigService) => ({
            global: true,
            // Retrieve JWT configurations from environment or other external configurations.
            secret: _configService.getOrThrow<string>('APP_JWT_TOKEN'),
            signOptions: {
              audience: _configService.getOrThrow<string>('APP_JWT_AUDIENCE'),
              expiresIn: '8h',
              issuer: _configService.getOrThrow<string>('APP_JWT_ISSUER'),
            },
          }),
        }),
        MikroOrmModule.forRoot(TestingMikroORMConfig()),
        MikroOrmModule.forFeature({
          entities: [
            AuthTokensEntity,
            AuthUserEntity,
            AuthPasswordEntity,
            AuthEmailsEntity,
          ],
        }),
      ],
      providers: [JWTStrategy, AuthAccountService, AuthPasswordService],
    }).compile();

    jwtStrategy = moduleRef.get<JWTStrategy>(JWTStrategy);
    jwtService = moduleRef.get<JwtService>(JwtService);
    em = moduleRef.get<EntityManager>(EntityManager);
    orm = moduleRef.get<MikroORM>(MikroORM);
    accountService = moduleRef.get<AuthAccountService>(AuthAccountService);

    await orm.getSchemaGenerator().refreshDatabase();

    await RequestContext.create(em, async () => {
      const userTest = await accountService.signUp({
        email: 'sawa@acme.com',
        first_name: 'Sawa',
        last_name: 'Ko',
        password: 'sawako',
        username: 'sawako',
      });

      user = await em.findOneOrFail(AuthUserEntity, { id: userTest.id });
    });
  });

  it('should defined', () => {
    expect(jwtStrategy).toBeDefined();
  });

  it('should be able to validate if a JWT token is present', async () => {
    const mockRequest: Partial<Request> = {
      headers: {},
    };

    const mockPayload: JWTPayload = {
      raw: '',
      sub: '',
    };

    await expect(
      jwtStrategy.validate(mockRequest as unknown as Request, mockPayload),
    ).rejects.toThrowError(
      'An authentication token is required to use this resource.',
    );
  });

  it('should be able to validate a JWT token', async () => {
    const mockRequest: Partial<Request> = {
      headers: {
        authorization: `Bearer ${jwtService.sign(
          {
            raw: '123',
            sub: '123',
          },
          {
            secret: '1234',
          },
        )}`,
      },
    };

    const mockPayload: JWTPayload = {
      raw: '123',
      sub: '123',
    };

    await expect(
      jwtStrategy.validate(mockRequest as unknown as Request, mockPayload),
    ).rejects.toThrowError('The authentication token is invalid.');
  });

  it('should be able to check token session', async () => {
    await RequestContext.create(em, async () => {
      const token = await jwtService.signAsync({
        sub: user.id,
      });

      const mockRequest: Partial<Request> = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };

      const mockPayload: JWTPayload = {
        raw: '123',
        sub: user.id,
      };

      await expect(
        jwtStrategy.validate(mockRequest as unknown as Request, mockPayload),
      ).rejects.toThrowError(
        'Could not find information about your authentication token.',
      );
    });
  });

  it('should check if the token session is revoked', async () => {
    await RequestContext.create(em, async () => {
      const signIn = await accountService.signIn({
        password: 'sawako',
        username: user.username,
      });

      const mockRequest: Partial<Request> = {
        headers: {
          authorization: `Bearer ${signIn.access_token}`,
        },
      };

      const mockPayload: JWTPayload = {
        raw: signIn.access_token,
        sub: user.id,
      };

      const tokenSession = await em.findOneOrFail(AuthTokensEntity, {
        revoked: false,
        token_type: TokenType.AUTH,
        token_value: signIn.access_token,
        user: user.id,
      });

      tokenSession.revoked = true;
      await em.persistAndFlush(tokenSession);

      await expect(
        jwtStrategy.validate(mockRequest as unknown as Request, mockPayload),
      ).rejects.toThrowError('The authentication token has been revoked.');
    });
  });

  it('should check if the token is expired', async () => {
    await RequestContext.create(em, async () => {
      const signIn = await accountService.signIn({
        password: 'sawako',
        username: user.username,
      });

      const mockRequest: Partial<Request> = {
        headers: {
          authorization: `Bearer ${signIn.access_token}`,
        },
      };

      const mockPayload: JWTPayload = {
        raw: signIn.access_token,
        sub: user.id,
      };

      const tokenSession = await em.findOneOrFail(AuthTokensEntity, {
        token_value: signIn.access_token,
      });

      tokenSession.expiration = new Date(new Date().setFullYear(2022));
      await em.persistAndFlush(tokenSession);

      await expect(
        jwtStrategy.validate(mockRequest as unknown as Request, mockPayload),
      ).rejects.toThrowError('The authentication token has expired.');
    });
  });

  it('should check that the payload is received', async () => {
    await RequestContext.create(em, async () => {
      const signIn = await accountService.signIn({
        password: 'sawako',
        username: user.username,
      });

      const mockRequest: Partial<Request> = {
        headers: {
          authorization: `Bearer ${signIn.access_token}`,
        },
      };

      const mockPayload: JWTPayload = {
        raw: signIn.access_token,
        sub: user.id,
      };

      await expect(
        jwtStrategy.validate(mockRequest as unknown as Request, mockPayload),
      ).resolves.toEqual(mockPayload);
    });
  });
});
