import { MikroORM } from '@mikro-orm/core';
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
import { AuthPasswordService } from '~/modules/auth/services/password.service';

import { expect } from 'vitest';

import { TestingMikroORMConfig } from '../../../../mikro-orm.config';

/**
 * Test suite for the password-related functionalities in the application.
 *
 * This suite focuses on ensuring that the core operations related to password management
 * are functioning as intended. It includes tests for changing passwords, validating users,
 * and ensuring that incorrect passwords are handled appropriately.
 *
 * The setup for this suite involves:
 * 1. Instantiating the necessary services.
 * 2. Setting up a mock database environment for isolated testing.
 * 3. Creating a sample user to be used throughout the test cases.
 */
describe('Password', () => {
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
   * 3. Creates a default test user.
   */
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
      providers: [AuthPasswordService, AuthAccountService],
    }).compile();

    passwordService = module.get<AuthPasswordService>(AuthPasswordService);
    accountService = module.get<AuthAccountService>(AuthAccountService);
    em = module.get<EntityManager>(EntityManager);
    orm = module.get<MikroORM>(MikroORM);

    await orm.getSchemaGenerator().refreshDatabase();

    const userTest = await accountService.signUp({
      email: 'sawa@acme.com',
      first_name: 'Sawa',
      last_name: 'Ko',
      password: 'sawako',
      username: 'sawako',
    });

    user = await em.findOneOrFail(AuthUserEntity, { id: userTest.id });
  });

  /**
   * Cleans up resources after all tests have been executed.
   * This includes closing the ORM connection and the testing module.
   */
  afterEach(async () => {
    await orm.close();
    await module.close();
  });

  /**
   * Checks if the password service has been initialized correctly.
   */
  it('should be defined', () => {
    expect(passwordService).toBeDefined();
  });

  /**
   * Validates that the password change operation works as expected.
   */
  it('should change password correcly', async () => {
    const isChangedPassword = await passwordService.change(
      { currentPassword: 'sawako', newPassword: 'sawa' },
      user.id,
    );

    expect(isChangedPassword).toBe('Password updated correctly.');
  });

  /**
   * Tests the scenario where an invalid user tries to change the password.
   * It should appropriately handle and throw an error.
   */
  it('should has invalid user', async () => {
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

  /**
   * Tests the scenario where an incorrect current password is provided during the change operation.
   * This should result in an error being thrown.
   */
  it('should has invalid current password', async () => {
    expect(
      async () =>
        await passwordService.change(
          { currentPassword: 'sawa', newPassword: 'sawa' },
          user.id,
        ),
    ).rejects.toThrowError('The current password is incorrect.');
  });
});
