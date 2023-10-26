import { MikroORM, RequestContext } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import {
  AuthEmailsEntity,
  AuthPasswordEntity,
  AuthTokensEntity,
  AuthUserEntity,
} from '~/database/entities';
import { AuthModule } from '~/modules/auth/auth.module';
import { AuthAccountService } from '~/modules/auth/services/account.service';
import { AuthEmailService } from '~/modules/auth/services/email.service';
import { AuthPasswordService } from '~/modules/auth/services/password.service';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { TestingMikroORMConfig } from '../../../../../mikro-orm.config';

describe('Auth - Email - Successfully cases', () => {
  let emailService: AuthEmailService;
  let accountService: AuthAccountService;
  let em: EntityManager;
  let orm: MikroORM;
  let module: TestingModule;
  let user: AuthUserEntity;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        MikroOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (_configService: ConfigService) =>
            TestingMikroORMConfig(
              _configService.getOrThrow('MIKRO_ORM_DB_TEST_URL'),
            ),
        }),
        MikroOrmModule.forFeature({
          entities: [
            AuthTokensEntity,
            AuthUserEntity,
            AuthPasswordEntity,
            AuthEmailsEntity,
          ],
        }),
        AuthModule,
      ],
      providers: [AuthEmailService, AuthAccountService, AuthPasswordService],
    }).compile();

    emailService = module.get<AuthEmailService>(AuthEmailService);
    accountService = module.get<AuthAccountService>(AuthAccountService);
    em = module.get<EntityManager>(EntityManager);
    orm = module.get<MikroORM>(MikroORM);

    await orm.getSchemaGenerator().refreshDatabase();

    await RequestContext.createAsync(em, async () => {
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

  /**
   * Cleanup after test are finished.
   */
  afterEach(async () => {
    await module.close();
  });

  /**
   * Basic tests to ensure the `AuthAccountService` and `user` is defined and can be initialized.
   */
  it('should be defined accountService, and User testing', () => {
    expect(accountService).toBeDefined();
    expect(emailService).toBeDefined();
    expect(user).toBeDefined();
  });

  /**
   * Test to ensure that the user email address can be confirmed.
   */
  it('should confirm user email address', async () => {
    await RequestContext.createAsync(em, async () => {
      const userEmail = await em.findOneOrFail(
        AuthUserEntity,
        {
          id: user.id,
        },
        {
          populate: ['email'],
        },
      );

      const email = await emailService.confirm({
        code: userEmail.email.activation_token,
        email: userEmail.email.value,
      });

      expect(email).toBeDefined();
      expect(email.is_confirmed).toBe(true);
    });
  });
});
