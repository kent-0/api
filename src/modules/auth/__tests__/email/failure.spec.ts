import { MikroORM, RequestContext } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';

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

describe('Auth - Email - Unsuccessfully cases', () => {
  let emailService: AuthEmailService;
  let accountService: AuthAccountService;
  let em: EntityManager;
  let orm: MikroORM;
  let module: TestingModule;
  let user: AuthUserEntity;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        MikroOrmModule.forRoot(TestingMikroORMConfig()),
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
   * Test to check if the email not exists.
   */
  it('should not confirm if the email not exists', async () => {
    await RequestContext.create(em, async () => {
      await expect(
        emailService.confirm({
          code: '123456',
          email: '12345',
        }),
      ).rejects.toThrowError("We couldn't find your user email information.");
    });
  });

  /**
   * Test to check if the email is already confirmed.
   */
  it('should not confirm if the email is already confirmed', async () => {
    await RequestContext.create(em, async () => {
      const userEmail = await em.findOneOrFail(
        AuthUserEntity,
        {
          id: user.id,
        },
        {
          populate: ['email'],
        },
      );

      await emailService.confirm({
        code: userEmail.email.activation_token,
        email: userEmail.email.value,
      });

      await expect(
        emailService.confirm({
          code: userEmail.email.activation_token,
          email: userEmail.email.value,
        }),
      ).rejects.toThrowError('The account email has already been confirmed.');
    });
  });

  /**
   * Test to check if the activation token is invalid.
   */
  it('should not confirm if the activation token is invalid', async () => {
    await RequestContext.create(em, async () => {
      const userEmail = await em.findOneOrFail(
        AuthUserEntity,
        {
          id: user.id,
        },
        {
          populate: ['email'],
        },
      );

      await expect(
        emailService.confirm({
          code: '123456',
          email: userEmail.email.value,
        }),
      ).rejects.toThrowError('The activation code is incorrect.');
    });
  });
});
