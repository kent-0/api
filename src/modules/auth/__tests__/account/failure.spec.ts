import { MikroORM, RequestContext } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import {
  AuthEmailsEntity,
  AuthPasswordEntity,
  AuthTokensEntity,
  AuthUserEntity,
} from '~/database/entities';
import { TokenType } from '~/database/enums/token.enum';
import { AuthAccountService } from '~/modules/auth/services/account.service';
import { AuthPasswordService } from '~/modules/auth/services/password.service';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { TestingMikroORMConfig } from '../../../../../mikro-orm.config';

/**
 * Test suite for the account-related functionalities in the application, focusing on cases
 * where the expected outcome is a failure or error.
 *
 * The main aim of this suite is to validate that the application correctly handles and responds to
 * unsatisfactory scenarios. These scenarios include invalid session tokens, non-existent users,
 * missing refresh tokens, and expired refresh tokens.
 *
 * The setup for the tests involves:
 * 1. Instantiating the necessary modules, services, and database configurations.
 * 2. Refreshing the database to start from a clean state.
 * 3. Creating a sample user and capturing its session details.
 */
describe('Auth - Account - Unsuccessfully cases', () => {
  let accountService: AuthAccountService;
  let em: EntityManager;
  let orm: MikroORM;
  let module: TestingModule;
  let user: AuthUserEntity;
  let refreshToken: string;
  let jwtService: JwtService;

  /**
   * Setup for each tests.
   * Initializes the necessary modules, services, and database configuration.
   * Refreshes the database to ensure each tests starts with a clean state.
   */
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath: '.env.test' }),
        MikroOrmModule.forRoot(TestingMikroORMConfig()),
        MikroOrmModule.forFeature({
          entities: [
            AuthTokensEntity,
            AuthUserEntity,
            AuthPasswordEntity,
            AuthEmailsEntity,
          ],
        }),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (_configService: ConfigService) => ({
            secret: _configService.getOrThrow<string>('APP_JWT_TOKEN'),
            signOptions: {
              audience: _configService.getOrThrow<string>('APP_JWT_AUDIENCE'),
              expiresIn: '8h',
              issuer: _configService.getOrThrow<string>('APP_JWT_ISSUER'),
            },
          }),
        }),
      ],
      providers: [AuthAccountService, AuthPasswordService],
    }).compile();

    accountService = module.get<AuthAccountService>(AuthAccountService);
    jwtService = module.get<JwtService>(JwtService);
    em = module.get<EntityManager>(EntityManager);
    orm = module.get<MikroORM>(MikroORM);

    /**
     * Initializes the database and sets up a fresh environment for each test.
     *
     * 1. Refreshes the entire database to ensure that every test runs with a clean slate.
     * 2. Creates a new user account with given details using the account service.
     * 3. Fetches and stores the user entity based on the signup response for further testing.
     * 4. Signs in with the created user account to obtain a session, capturing the provided refresh token.
     *
     * This setup ensures a consistent and isolated environment for each test, making the test outcomes reliable.
     */
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

      const data = await accountService.signIn({
        password: 'sawako',
        username: userTest.username,
      });

      refreshToken = data.refresh_token;
    });
  });

  /**
   * Cleanup after test are finished.
   */
  afterEach(async () => {
    await module.close();
  });

  /**
   * Basic tests to ensure the `AuthAccountService`, `user` and `JWTService` is defined and can be initialized.
   */
  it('should be defined accountService, JWTService, and User testing', () => {
    expect(accountService).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(user).toBeDefined();
  });

  /**
   * Validates that the system correctly identifies and responds to an invalid session token.
   */
  it('should has error because the session token is invalid.', async () => {
    await RequestContext.create(em, async () => {
      await expect(
        accountService.logOut('invalid-token', user.id),
      ).rejects.toThrow('Your current session information could not be found.');
    });
  });

  /**
   * Validates the system's response when attempting to fetch details of a non-existent user.
   */
  it('should has error because the user in the token does not exist.', async () => {
    await RequestContext.create(em, async () => {
      await expect(
        accountService.me('8054de11-b6dc-481e-a8c2-90cef8169914'),
      ).rejects.toThrow('Your user account information could not be obtained.');
    });
  });

  /**
   * Checks the system's response when provided with a non-existent refresh token.
   */
  it('should has error because the refresh token does not exist.', async () => {
    await RequestContext.create(em, async () => {
      await expect(
        accountService.refreshSession('invalid-token', user.id),
      ).rejects.toThrow('No information found for that session refresh token.');
    });
  });

  /**
   * Validates the system's handling of an expired refresh token.
   */
  it('should has error because the refresh token is not valid.', async () => {
    await RequestContext.create(em, async () => {
      const refreshTokenData = await em.findOneOrFail(AuthTokensEntity, {
        token_type: TokenType.REFRESH,
        token_value: refreshToken,
      });

      refreshTokenData.token_value = await jwtService.signAsync(
        { sub: user.id },
        { expiresIn: '0s' },
      );

      await em.persistAndFlush(refreshTokenData);

      await RequestContext.create(em, async () => {
        await expect(
          accountService.refreshSession(refreshTokenData.token_value, user.id),
        ).rejects.toThrow(
          'The refresh token has expired, please log in again.',
        );
      });
    });
  });

  /**
   * Validates the system's handling of an revoked refresh token.
   */
  it('should has error because the refresh token is expired.', async () => {
    await RequestContext.create(em, async () => {
      const refreshTokenData = await em.findOneOrFail(AuthTokensEntity, {
        token_type: TokenType.REFRESH,
        token_value: refreshToken,
      });

      refreshTokenData.revoked = true;

      await em.persistAndFlush(refreshTokenData);

      await RequestContext.create(em, async () => {
        await expect(
          accountService.refreshSession(refreshTokenData.token_value, user.id),
        ).rejects.toThrow('The refresh token has been revoked.');
      });
    });
  });

  it('should has error because has invalid account crendentials (username).', async () => {
    await RequestContext.create(em, async () => {
      await expect(
        accountService.signIn({ password: 'sawako', username: 'sawak0' }),
      ).rejects.toThrow('No account found with that username.');
    });
  });

  it('should has error because has invalid account crendentials (password).', async () => {
    await RequestContext.create(em, async () => {
      await expect(
        accountService.signIn({ password: 'sawak0', username: 'sawako' }),
      ).rejects.toThrow('An incorrect password has been entered.');
    });
  });

  it('should have error because there is already a user with that username.', async () => {
    await RequestContext.create(em, async () => {
      await expect(
        accountService.signUp({
          email: 'sawa@acme.com',
          first_name: 'Sawa',
          last_name: 'Ko',
          password: 'sawako',
          username: 'sawako',
        }),
      ).rejects.toThrow(
        'An account already exists with that email or username.',
      );
    });
  });

  it('should have error because it could not obtain user information to be updated', async () => {
    await RequestContext.create(em, async () => {
      await expect(
        accountService.update(
          { username: 'sawak0' },
          '8054de11-b6dc-481e-a8c2-90cef8169914',
        ),
      ).rejects.toThrow('Your account information could not be obtained.');
    });
  });

  it('should have error because user wants to update his username to an existing one', async () => {
    await RequestContext.create(em, async () => {
      const newUser = await accountService.signUp({
        email: 'kana@acme.com',
        first_name: 'Sawa',
        last_name: 'Ko',
        password: 'sawako',
        username: 'sawak0',
      });

      expect(newUser).toBeDefined();

      await expect(
        accountService.update({ username: 'sawak0' }, user.id),
      ).rejects.toThrow(
        "You can't select that username because another user already has it.",
      );
    });
  });
});
