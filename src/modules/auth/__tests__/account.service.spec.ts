import { MikroORM, RequestContext } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import {
  AuthEmailsEntity,
  AuthPasswordEntity,
  AuthTokensEntity,
  AuthUserEntity,
} from '~/database/entities';
import { AuthAccountService } from '~/modules/auth/services/account.service';
import { AuthPasswordService } from '~/modules/auth/services/password.service';

import { afterEach } from 'vitest';

import { TestingMikroORMConfig } from '../../../../mikro-orm.config';

/**
 * Test suite for the Account Service (`AuthAccountService`).
 *
 * The tests are designed to ensure the core functionalities of the Account Service,
 * focusing on user registration (`signUp`) and user authentication (`signIn`).
 *
 * Before each tests:
 * - A testing module is set up with necessary dependencies and configurations.
 * - Database connection is established with a tests database.
 * - Database schema is refreshed to ensure a clean state.
 *
 * After all tests:
 * - The database connection is closed.
 */
describe('Account', () => {
  let accountService: AuthAccountService;
  let em: EntityManager;
  let orm: MikroORM;
  let module: TestingModule;

  /**
   * Setup for each tests.
   * Initializes the necessary modules, services, and database configuration.
   * Refreshes the database to ensure each tests starts with a clean state.
   */
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
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
    em = module.get<EntityManager>(EntityManager);
    orm = module.get<MikroORM>(MikroORM);

    await orm.getSchemaGenerator().refreshDatabase();
  });

  /**
   * Cleanup after all tests are finished.
   */
  afterEach(async () => {
    await module.close();
  });

  /**
   * Basic tests to ensure the `AuthAccountService` is defined and can be initialized.
   */
  it('should be defined', () => {
    expect(accountService).toBeDefined();
  });

  /**
   * Test the `signUp` method of the `AuthAccountService`.
   * Ensures that a user can be successfully created and the returned user object
   * contains the expected properties and values.
   */
  it('should create an user', async () => {
    await RequestContext.createAsync(em, async () => {
      const user = await accountService.signUp({
        email: 'sawa@acme.com',
        first_name: 'Sawa',
        last_name: 'Ko',
        password: 'sawako',
        username: 'sawako',
      });

      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.email.value).toBe('sawa@acme.com');
      expect(user.username).toBe('sawako');
      expect(user.first_name).toBe('Sawa');
      expect(user.last_name).toBe('Ko');
    });
  });

  /**
   * Test both the `signUp` and `signIn` methods of the `AuthAccountService`.
   * This tests ensures that after a user is registered, they can successfully
   * authenticate and receive a valid session containing access and refresh tokens.
   */
  it('should create a account session', async () => {
    await RequestContext.createAsync(em, async () => {
      const user = await accountService.signUp({
        email: 'sawa@acme.com',
        first_name: 'Sawa',
        last_name: 'Ko',
        password: 'sawako',
        username: 'sawako',
      });

      expect(user).toBeDefined();
      expect(user.id).toBeDefined();

      const session = await accountService.signIn({
        password: 'sawako',
        username: user.username,
      });

      expect(session).toBeDefined();
      expect(session.access_token).toBeDefined();
      expect(session.refresh_token).toBeDefined();
    });
  });

  /**
   * Test case to verify the user update functionality.
   *
   * This tests simulates the process of registering a user and then updating
   * the user's first and last name. The tests ensures that:
   * 1. A user can be successfully registered with initial details.
   * 2. The user's first and last name can be updated to new values.
   * 3. The updated values are correctly reflected in the returned user object.
   */
  it('should update the user first and last name', async () => {
    await RequestContext.createAsync(em, async () => {
      const user = await accountService.signUp({
        email: 'sawa@acme.com',
        first_name: 'Sawa',
        last_name: 'Ko',
        password: 'sawako',
        username: 'sawako',
      });

      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.first_name).toBe('Sawa');
      expect(user.last_name).toBe('Ko');

      const updatedUser = await accountService.update(
        {
          first_name: 'Kaname',
          last_name: 'Sawako',
        },
        user.id,
      );

      expect(updatedUser).toBeDefined();
      expect(updatedUser.first_name).toBe('Kaname');
      expect(updatedUser.last_name).toBe('Sawako');
    });
  });

  /**
   * Test case to verify the user retrieval functionality.
   *
   * This test simulates the process of registering a user and then retrieving
   * the user's information. It ensures that:
   * 1. A user can be successfully registered with the provided details.
   * 2. The registered user's details can be fetched accurately.
   *
   * Key actions tested:
   * - User registration via `accountService.signUp`.
   * - Fetching user information via `accountService.me`.
   */
  it('should get the user private data', async () => {
    await RequestContext.createAsync(em, async () => {
      const user = await accountService.signUp({
        email: 'sawa@acme.com',
        first_name: 'Sawa',
        last_name: 'Ko',
        password: 'sawako',
        username: 'sawako',
      });

      expect(user).toBeDefined();
      expect(user.id).toBeDefined();

      const userData = await accountService.me(user.id);
      expect(userData).toBeDefined();
      expect(userData.id).toBe(user.id);
      expect(userData.email.value).toBe('sawa@acme.com');
    });
  });

  /**
   * Test case to verify the session closure functionality.
   *
   * This test simulates the process of registering a user, initiating a session,
   * and then closing the session. It ensures that:
   * 1. A user session can be successfully initiated after registration.
   * 2. The session can be closed and a confirmation message is received.
   *
   * Key actions tested:
   * - User registration via `accountService.signUp`.
   * - Initiating a session via `accountService.signIn`.
   * - Closing a session via `accountService.logOut`.
   */
  it('should close account session', async () => {
    await RequestContext.createAsync(em, async () => {
      const user = await accountService.signUp({
        email: 'sawa@acme.com',
        first_name: 'Sawa',
        last_name: 'Ko',
        password: 'sawako',
        username: 'sawako',
      });

      expect(user).toBeDefined();
      expect(user.id).toBeDefined();

      const createSession = await accountService.signIn({
        password: 'sawako',
        username: 'sawako',
      });

      const closedSession = await accountService.logOut(
        createSession.access_token,
        user.id,
      );

      expect(closedSession).toBe('Session closed successfully. See you soon.');
    });
  });

  /**
   * Test case to verify the session refresh functionality.
   *
   * This test simulates the process of registering a user, initiating a session,
   * and then refreshing the session. It ensures that:
   * 1. A user session can be successfully initiated after registration.
   * 2. The session can be refreshed to get new access and refresh tokens.
   *
   * Key actions tested:
   * - User registration via `accountService.signUp`.
   * - Initiating a session via `accountService.signIn`.
   * - Refreshing a session via `accountService.refreshSession`.
   */
  it('should refresh account session', async () => {
    await RequestContext.createAsync(em, async () => {
      const user = await accountService.signUp({
        email: 'sawa@acme.com',
        first_name: 'Sawa',
        last_name: 'Ko',
        password: 'sawako',
        username: 'sawako',
      });

      expect(user).toBeDefined();
      expect(user.id).toBeDefined();

      const createSession = await accountService.signIn({
        password: 'sawako',
        username: 'sawako',
      });

      const refreshSession = await accountService.refreshSession(
        createSession.refresh_token,
        user.id,
      );

      expect(refreshSession.access_token).toBeDefined();
      expect(refreshSession.refresh_token).toBeDefined();
    });
  });
});
