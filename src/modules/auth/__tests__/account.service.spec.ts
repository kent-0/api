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

import { expect } from 'vitest';

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
describe('Auth - Account - Successful use cases', () => {
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
   * Cleanup after test are finished.
   */
  afterEach(async () => {
    await module.close();
  });

  /**
   * Basic tests to ensure the `AuthAccountService` is defined and can be initialized.
   */
  it('should be defined accountService', () => {
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
describe('Auth - Account - Cases of unsatisfactory uses', () => {
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
    await RequestContext.createAsync(em, async () => {
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
    await RequestContext.createAsync(em, async () => {
      await expect(
        accountService.logOut('invalid-token', user.id),
      ).rejects.toThrow('Your current session information could not be found.');
    });
  });

  /**
   * Validates the system's response when attempting to fetch details of a non-existent user.
   */
  it('should has error because the user in the token does not exist.', async () => {
    await RequestContext.createAsync(em, async () => {
      await expect(
        accountService.me('8054de11-b6dc-481e-a8c2-90cef8169914'),
      ).rejects.toThrow('Your user account information could not be obtained.');
    });
  });

  /**
   * Checks the system's response when provided with a non-existent refresh token.
   */
  it('should has error because the refresh token does not exist.', async () => {
    await RequestContext.createAsync(em, async () => {
      await expect(
        accountService.refreshSession('invalid-token', user.id),
      ).rejects.toThrow('No information found for that session refresh token.');
    });
  });

  /**
   * Validates the system's handling of an expired refresh token.
   */
  it('should has error because the refresh token is not valid.', async () => {
    await RequestContext.createAsync(em, async () => {
      const refreshTokenData = await em.findOneOrFail(AuthTokensEntity, {
        token_type: TokenType.REFRESH,
        token_value: refreshToken,
      });

      refreshTokenData.token_value = await jwtService.signAsync(
        { sub: user.id },
        { expiresIn: '0s' },
      );

      await em.persistAndFlush(refreshTokenData);

      await RequestContext.createAsync(em, async () => {
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
    await RequestContext.createAsync(em, async () => {
      const refreshTokenData = await em.findOneOrFail(AuthTokensEntity, {
        token_type: TokenType.REFRESH,
        token_value: refreshToken,
      });

      refreshTokenData.revoked = true;

      await em.persistAndFlush(refreshTokenData);

      await RequestContext.createAsync(em, async () => {
        await expect(
          accountService.refreshSession(refreshTokenData.token_value, user.id),
        ).rejects.toThrow('The refresh token has been revoked.');
      });
    });
  });

  it('should has error because has invalid account crendentials (username).', async () => {
    await RequestContext.createAsync(em, async () => {
      await expect(
        accountService.signIn({ password: 'sawako', username: 'sawak0' }),
      ).rejects.toThrow('No account found with that username.');
    });
  });

  it('should has error because has invalid account crendentials (password).', async () => {
    await RequestContext.createAsync(em, async () => {
      await expect(
        accountService.signIn({ password: 'sawak0', username: 'sawako' }),
      ).rejects.toThrow('An incorrect password has been entered.');
    });
  });

  it('should have error because there is already a user with that username.', async () => {
    await RequestContext.createAsync(em, async () => {
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
    await RequestContext.createAsync(em, async () => {
      await expect(
        accountService.update(
          { username: 'sawak0' },
          '8054de11-b6dc-481e-a8c2-90cef8169914',
        ),
      ).rejects.toThrow('Your account information could not be obtained.');
    });
  });

  it('should have error because user wants to update his username to an existing one', async () => {
    await RequestContext.createAsync(em, async () => {
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
