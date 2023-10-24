import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import {
  AuthEmailsEntity,
  AuthPasswordEntity,
  AuthTokensEntity,
  AuthUserEntity,
} from '~/database/entities';
import { DeviceTypes } from '~/database/enums/devices.enum';
import { TokenType } from '~/database/enums/token.enum';
import { AuthPasswordService } from '~/modules/auth/services/password.service';
import {
  ProjectMembersMinimalProperties,
  ProjectMinimalProperties,
} from '~/modules/project/objects';
import { createFieldPaths } from '~/utils/functions/create-fields-path';
import { ToCollections } from '~/utils/types/to-collection';

import * as bcrypt from 'bcrypt';

import { AuthSignInInput, AuthSignUpInput } from '../inputs';
import { AuthUpdateAccountInput } from '../inputs/account/update.input';
import { JWTPayload } from '../interfaces/jwt.interface';
import {
  AuthSignInObject,
  AuthUserMinimalProperties,
  AuthUserObject,
} from '../objects';

/**
 * `AuthAccountService` is a service class that provides functionality to manage
 * operations related to user accounts. This includes actions like user registration,
 * authentication, password handling, and token management.
 *
 * This class collaborates with various repositories and services to perform its operations,
 * and they are injected into this service through its constructor.
 */
@Injectable()
export class AuthAccountService {
  /**
   * Constructor for the AuthAccountService class.
   *
   * Initializes the class with necessary repositories and services.
   *
   * @param {EntityRepository<AuthUserEntity>} usersRepository - Repository for interacting with user data.
   * @param {EntityRepository<AuthPasswordEntity>} passwordRepository - Repository for handling password data.
   * @param {EntityRepository<AuthTokensEntity>} tokensRepository - Repository for managing authentication tokens.
   * @param {EntityRepository<AuthEmailsEntity>} authEmailsRepository - Repository for working with email data.
   * @param {EntityManager} em - Entity manager for direct database operations.
   * @param {JwtService} _jwtService - Service for handling JSON Web Token operations.
   * @param {AuthPasswordService} _passwordService - Service for password-related operations.
   */
  constructor(
    @InjectRepository(AuthUserEntity)
    private readonly usersRepository: EntityRepository<AuthUserEntity>,

    @InjectRepository(AuthPasswordEntity)
    private readonly passwordRepository: EntityRepository<AuthPasswordEntity>,

    @InjectRepository(AuthTokensEntity)
    private readonly tokensRepository: EntityRepository<AuthTokensEntity>,

    @InjectRepository(AuthEmailsEntity)
    private readonly authEmailsRepository: EntityRepository<AuthEmailsEntity>,

    private readonly em: EntityManager,

    private readonly _jwtService: JwtService,

    private readonly _passwordService: AuthPasswordService,
  ) {}

  /**
   * Logs out the user by revoking the provided token.
   *
   * This method carries out the following steps:
   * 1. Fetches the token associated with the user session from the database using the provided userToken and userId.
   * 2. If the token doesn't exist, throws a NotFoundException.
   * 3. Sets the token's "revoked" status to true.
   * 4. Persists the changes to the database.
   * 5. Returns a success message indicating the session has been closed.
   *
   * @param userToken - The token associated with the user session.
   * @param userId - The ID of the user whose session should be logged out.
   * @returns A message indicating the status of the logout.
   * @throws NotFoundException if the provided token is not found.
   */
  public async logOut(userToken: string, userId: string): Promise<string> {
    // Fetch the token associated with the user session from the database.
    const token = await this.tokensRepository.findOne({
      token_type: TokenType.AUTH,
      token_value: userToken,
      user: userId,
    });

    // If the token doesn't exist in the database, throw a NotFoundException.
    if (!token) {
      throw new NotFoundException(
        'Your current session information could not be found.',
      );
    }

    // Set the token's "revoked" status to true.
    token.revoked = true;

    // Persist the changes to the database.
    await this.em.persistAndFlush(token);

    // Return a success message.
    return 'Session closed successfully. See you soon.';
  }

  /**
   * Retrieves the user's information based on the provided user ID.
   *
   * This method carries out the following steps:
   * 1. Fetches the user's information from the database using the provided userId. It also populates the user's email.
   * 2. If the user doesn't exist in the database, throws a NotFoundException.
   * 3. Returns the fetched user's information.
   *
   * @param userId - The ID of the user whose information is being retrieved.
   * @returns The user's information.
   * @throws NotFoundException if the user with the provided ID is not found.
   */
  public async me(userId: string): Promise<ToCollections<AuthUserObject>> {
    // Fetch the user's information using the provided userId and populate the user's email.
    const user = await this.usersRepository.findOne(
      {
        id: userId,
      },
      {
        fields: [
          ...AuthUserMinimalProperties,
          ...createFieldPaths('projects', ...ProjectMembersMinimalProperties),
          ...createFieldPaths('projects.project', ...ProjectMinimalProperties),
          'email.value',
          'email.is_confirmed',
        ],
      },
    );

    // If the user doesn't exist in the database, throw a NotFoundException.
    if (!user) {
      throw new NotFoundException(
        'Your user account information could not be obtained.',
      );
    }

    // Return the fetched user's information.
    return user;
  }

  /**
   * Refreshes the user's session by verifying the refresh token and generating a new access token.
   *
   * This method carries out the following steps:
   * 1. Fetches the refresh token associated with the user's session from the database.
   * 2. If the refresh token doesn't exist or has been revoked, throws a NotFoundException.
   * 3. Verifies the validity of the fetched refresh token.
   * 4. If the refresh token is invalid or expired, revokes it and throws an UnauthorizedException.
   * 5. Generates a new access token with a validity of 8 hours.
   * 6. Persists the new access token to the database.
   * 7. Returns an object containing the new access token and the provided refresh token.
   *
   * @param token - The refresh token associated with the user's session.
   * @param userId - The ID of the user whose session is being refreshed.
   * @returns An object containing the new access token and the provided refresh token.
   * @throws NotFoundException if the refresh token is not found or revoked.
   * @throws UnauthorizedException if the refresh token is expired or invalid.
   */
  public async refreshSession(
    token: string,
    userId: string,
  ): Promise<AuthSignInObject> {
    // Fetch the refresh token associated with the user's session.
    const refreshToken = await this.tokensRepository.findOne({
      token_type: TokenType.REFRESH,
      token_value: token,
      user: userId,
    });

    // If the refresh token doesn't exist or has been revoked, throw the appropriate exception.
    if (!refreshToken) {
      throw new NotFoundException(
        'No information found for that session refresh token.',
      );
    }
    if (refreshToken.revoked) {
      throw new NotFoundException('The refresh token has been revoked.');
    }

    // Verify the validity of the fetched refresh token.
    const refreshTokenValid = await this._jwtService
      .verifyAsync(refreshToken.token_value)
      .catch(() => false);

    // If the refresh token is invalid or expired, revoke it and throw an UnauthorizedException.
    if (!refreshTokenValid) {
      refreshToken.revoked = true;
      await this.em.persistAndFlush(refreshToken);
      throw new UnauthorizedException(
        'The refresh token has expired, please log in again.',
      );
    }

    // Calculate the expiration time for the new access token.
    const tokenExp = Date.now() + 288e5;

    // Create the payload for the new access token.
    const tokenPayload: Omit<JWTPayload, 'raw'> = {
      iat: Date.now(),
      sub: userId,
    };

    // Sign the new access token.
    const tokenAuth = await this._jwtService.signAsync(tokenPayload);

    // Persist the new access token to the database.
    const tokenAuthCreated = this.tokensRepository.create({
      device: DeviceTypes.NotFound,
      expiration: new Date(tokenExp),
      revoked: false,
      token_type: TokenType.AUTH,
      token_value: tokenAuth,
      user: userId,
    });
    await this.em.persistAndFlush(tokenAuthCreated);

    // Return the new access token and the provided refresh token.
    return {
      access_token: tokenAuthCreated.token_value,
      refresh_token: refreshToken.token_value,
    };
  }

  /**
   * Signs in a user by verifying their credentials and generating access and refresh tokens.
   *
   * This method carries out the following steps:
   * 1. Fetches the user's information from the database using the provided username.
   * 2. If the user doesn't exist, throws an UnauthorizedException.
   * 3. Compares the provided password with the stored password hash.
   * 4. If the passwords don't match, throws an UnauthorizedException.
   * 5. Generates an access token with a validity of 8 hours.
   * 6. Generates a refresh token with a validity of 14 days.
   * 7. Persists the generated tokens to the database.
   * 8. Returns an object containing both tokens.
   *
   * @param signInInput - An object containing the user's username and password.
   * @returns An object containing the generated access and refresh tokens.
   * @throws UnauthorizedException if no account is found with the provided username or if the password is incorrect.
   */
  public async signIn({
    password,
    username,
  }: AuthSignInInput): Promise<AuthSignInObject> {
    // Fetch the user's information using the provided username.
    const user = await this.usersRepository.findOne(
      {
        username,
      },
      {
        populate: ['password'],
      },
    );

    // If the user doesn't exist in the database, throw an UnauthorizedException.
    if (!user) {
      throw new UnauthorizedException('No account found with that username.');
    }

    // Compare the provided password with the stored password hash.
    // noinspection ES6RedundantAwait
    const isMatchPassword = await bcrypt.compare(
      password,
      user.password!.password_hash,
    );

    // If the passwords don't match, throw an UnauthorizedException.
    if (!isMatchPassword) {
      throw new UnauthorizedException(
        'An incorrect password has been entered.',
      );
    }

    // Calculate the expiration time for the access token.
    const tokenExp = Date.now() + 288e5;

    // Create the payload for the tokens.
    const tokenPayload: Omit<JWTPayload, 'raw'> = {
      iat: Date.now(),
      sub: user.id,
    };

    // Generate the access token.
    const tokenAuth = await this._jwtService.signAsync(tokenPayload);
    const tokenAuthCreated = this.tokensRepository.create({
      device: DeviceTypes.NotFound,
      expiration: new Date(tokenExp),
      revoked: false,
      token_type: TokenType.AUTH,
      token_value: tokenAuth,
      user,
    });

    // Generate the refresh token with a validity of 14 days.
    const tokenRefresh = await this._jwtService.signAsync(tokenPayload, {
      expiresIn: '14d',
    });
    const tokenRefreshCreated = this.tokensRepository.create({
      device: DeviceTypes.NotFound,
      expiration: new Date(tokenExp),
      revoked: false,
      token_type: TokenType.REFRESH,
      token_value: tokenRefresh,
      user,
    });

    // Persist the generated tokens to the database.
    await this.em.persistAndFlush([tokenAuthCreated, tokenRefreshCreated]);

    // Return an object containing both tokens.
    return {
      access_token: tokenAuthCreated.token_value,
      refresh_token: tokenRefreshCreated.token_value,
    };
  }

  /**
   * Creates a new user account with the provided information.
   *
   * This method carries out the following steps:
   * 1. Checks if a user with the same username or email already exists in the database.
   * 2. If such a user exists, throws a BadRequestException.
   * 3. Checks if the provided email is already registered in the database.
   * 4. If the email is registered, throws a BadRequestException.
   * 5. Constructs a new user entity using the provided registration details.
   * 6. Generates a password hash and salt using the provided password.
   * 7. Creates a new user password entity and associates it with the user.
   * 8. Creates a new user email entity and associates it with the user.
   * 9. Persists the user, user password, and user email entities to the database.
   * 10. Returns the created user account.
   *
   * @param signUpInput - An object containing user registration details.
   * @returns The created user account.
   * @throws BadRequestException if an account with the same email or username already exists.
   */
  public async signUp({
    email,
    first_name,
    last_name,
    password,
    username,
  }: AuthSignUpInput): Promise<ToCollections<AuthUserObject>> {
    // Check if a user with the same username or email already exists in the database.
    const userExist = await this.usersRepository.findOne({
      $or: [{ username }, { email: { value: email } }],
    });

    // If such a user exists, throw a BadRequestException.
    if (userExist) {
      throw new BadRequestException(
        'An account already exists with that email or username.',
      );
    }

    // Construct a new user entity using the provided registration details.
    const user = this.usersRepository.create({
      first_name,
      last_name,
      username,
    });

    // Persist the new user entity to the database.
    await this.em.persistAndFlush(user);

    // Generate a password hash and salt using the provided password.
    const passwordHashed = await this._passwordService.generate(password);

    // Create a new user password entity.
    const userPassword = this.passwordRepository.create({
      password_hash: passwordHashed.hash,
      salt: passwordHashed.salt,
      user,
    });

    // Associate the user password entity with the user.
    user.password = userPassword;

    // Create a new user email entity.
    const userEmail = this.authEmailsRepository.create({
      user,
      value: email,
    });

    // Associate the user email entity with the user.
    user.email = userEmail;

    // Persist the user, user password, and user email entities to the database.
    await this.em.persistAndFlush([userEmail, userPassword, user]);

    // Return the created user account.
    return user;
  }

  /**
   * Updates the account information of a user.
   *
   * This method carries out the following steps:
   * 1. Fetches the user's information from the database using the provided userId.
   * 2. If such a user doesn't exist, throws a NotFoundException.
   * 3. Checks if the provided username is already associated with another account.
   * 4. If the username is taken by another user, throws a BadRequestException.
   * 5. Updates the user's account details with the provided input.
   * 6. Persists the updated user information to the database.
   * 7. Returns the updated user account.
   *
   * @param updateInput - An object containing the updated user information.
   * @param userId - The ID of the user whose account information will be updated.
   * @returns The updated user account information.
   * @throws NotFoundException if no account is found with the provided userId.
   * @throws BadRequestException if the selected username is already in use by another user.
   */
  public async update(
    { biography, first_name, last_name, username }: AuthUpdateAccountInput,
    userId: string,
  ): Promise<ToCollections<AuthUserObject>> {
    // Fetch the user's information from the database using the provided userId.
    const user = await this.usersRepository.findOne(
      {
        id: userId,
      },
      {
        populate: ['email'],
      },
    );

    // If the fetched user entity is null or undefined, it means the user does not exist. Hence, throw a NotFoundException.
    if (!user) {
      throw new NotFoundException(
        'Your account information could not be obtained.',
      );
    }

    // Check if the provided username is already associated with another user account.
    const usernameExist = await this.usersRepository.findOne({
      username,
    });

    // If the username is taken by another user and doesn't match the current userId, throw a BadRequestException.
    if (usernameExist && usernameExist.id !== userId) {
      throw new BadRequestException(
        "You can't select that username because another user already has it.",
      );
    }

    // Update the user's account details with the provided input.
    user.username = username ?? user.username;
    user.first_name = first_name ?? user.first_name;
    user.last_name = last_name ?? user.last_name;
    user.biography = biography ?? user.biography;

    // Persist the updated user information to the database.
    await this.em.persistAndFlush(user);

    // Return the updated user account.
    return user;
  }
}
