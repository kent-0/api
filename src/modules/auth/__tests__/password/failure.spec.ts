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
import { AuthPasswordService } from '~/modules/auth/services/password.service';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { TestingMikroORMConfig } from '../../../../../mikro-orm.config';

/**
 * Test suite focused on verifying the behavior of the password-related functionalities
 * under various negative or edge case scenarios.
 *
 * The aim is to ensure that the application behaves predictably and gracefully even
 * when presented with invalid or unexpected input. This includes scenarios like attempting
 * to change the password for a non-existent user, or providing an incorrect current password
 * during a password change operation.
 *
 * The setup for each test ensures a clean environment by:
 * - Compiling the required testing modules and services.
 * - Refreshing the database to its initial state.
 * - Creating a default test user for operations.
 *
 * Each test case within this suite is designed to simulate a specific unsatisfactory
 * scenario and validate the system's response to it.
 */
describe('Auth - Password - Unsuccessfully cases', async () => {
  let passwordService: AuthPasswordService;
  let accountService: AuthAccountService;
  let em: EntityManager;
  let orm: MikroORM;
  let module: TestingModule;
  let user: AuthUserEntity;

  /**
   * Ensures the required setup before each test:
   * 1. Compiles the testing module with the necessary providers and services.
   * 2. Refreshes the database to ensure a clean state.
   * 3. Creates a default test user and session.
   */
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
      providers: [AuthPasswordService, AuthAccountService],
    }).compile();

    passwordService = module.get<AuthPasswordService>(AuthPasswordService);
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
   * Basic tests to ensure the `AuthAccountService`, `JWTService`, and `user` is defined and can be initialized.
   */
  it('should be defined accountService, and User testing', () => {
    expect(accountService).toBeDefined();
    expect(user).toBeDefined();
  });

  /**
   * Tests the scenario where an invalid user tries to change the password.
   * It should appropriately handle and throw an error.
   */
  it('should has invalid user', async () => {
    await RequestContext.create(em, async () => {
      expect(
        async () =>
          await passwordService.change(
            { currentPassword: 'sawako', newPassword: 'sawa' },
            '8054de11-b6dc-481e-a8c2-90cef8169914',
          ),
      ).rejects.toThrowError(
        'Something happened and your user information could not be obtained.',
      );
    });
  });

  /**
   * Tests the scenario where an incorrect current password is provided during the change operation.
   * This should result in an error being thrown.
   */
  it('should has invalid current password', async () => {
    await RequestContext.create(em, async () => {
      expect(
        async () =>
          await passwordService.change(
            { currentPassword: 'sawa', newPassword: 'sawa' },
            user.id,
          ),
      ).rejects.toThrowError('The current password is incorrect.');
    });
  });

  /**
   * If the password details are not found, throw a NotFoundException.
   */
  it('should has invalid password', async () => {
    await RequestContext.create(em, async () => {
      await em.removeAndFlush(user.password!);

      expect(
        async () =>
          await passwordService.change(
            { currentPassword: 'sawako', newPassword: 'sawa' },
            user.id,
          ),
      ).rejects.toThrowError(
        'Something happened and your password information could not be obtained.',
      );
    });
  });
});
