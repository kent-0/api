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

import * as bcrypt from 'bcrypt';

import { AuthSignInInput, AuthSignUpInput } from '../inputs';
import { AuthUpdateAccountInput } from '../inputs/update-account.input';
import { JWTPayload } from '../interfaces/jwt.interface';
import { AuthSignInObject, AuthUserObject } from '../objects';

/**
 * AuthAccountService class is responsible for managing user account-related operations.
 * It interacts with the database to handle user registration, authentication, and more.
 */
@Injectable()
export class AuthAccountService {
  constructor(
    // Inject the repository for AuthUserEntity to interact with user data
    @InjectRepository(AuthUserEntity)
    private readonly usersRespository: EntityRepository<AuthUserEntity>,

    // Inject the repository for AuthPasswordEntity to interact with password data
    @InjectRepository(AuthPasswordEntity)
    private readonly passwordRepository: EntityRepository<AuthPasswordEntity>,

    // Inject the repository for AuthTokensEntity to interact with authentication tokens data
    @InjectRepository(AuthTokensEntity)
    private readonly tokensRepository: EntityRepository<AuthTokensEntity>,

    // Inject the repository for AuthEmailsEntity to interact with email data
    @InjectRepository(AuthEmailsEntity)
    private readonly authEmailsRepository: EntityRepository<AuthEmailsEntity>,

    // EntityManager instance to manage database operations
    private readonly em: EntityManager,

    // JwtService instance to handle JWT operations
    private readonly _jwtService: JwtService,

    // AuthPasswordService instance to handle password-related operations
    private readonly _passwordService: AuthPasswordService,
  ) {}

  /**
   * Logs out the user by revoking the provided token.
   *
   * @param userToken - The token associated with the user session.
   * @param userId - The ID of the user whose session should be logged out.
   * @returns A message indicating the status of the logout.
   * @throws NotFoundException if the provided token is not found.
   */
  public async logOut(userToken: string, userId: string): Promise<string> {
    // Find the token associated with the user session
    const token = await this.tokensRepository.findOne({
      token_type: TokenType.AUTH,
      token_value: userToken,
      user: userId,
    });

    // If token not found, throw an exception
    if (!token) {
      throw new NotFoundException(
        'Your current session information could not be found.',
      );
    }

    // Revoke the token and update it in the database
    token.revoked = true;
    await this.em.persistAndFlush(token);

    // Return a success message
    return 'Session closed successfully. See you soon.';
  }

  /**
   * Retrieves the user's information based on the provided user ID.
   *
   * @param userId - The ID of the user whose information is being retrieved.
   * @returns The user's information.
   * @throws NotFoundException if the user with the provided ID is not found.
   */
  public async me(userId: string): Promise<AuthUserObject> {
    // Find the user's information using the provided user ID
    const user = await this.usersRespository.findOne(
      {
        id: userId,
      },
      {
        populate: ['email'],
      },
    );

    // If user not found, throw an exception
    if (!user) {
      throw new NotFoundException(
        'Your user account information could not be obtained.',
      );
    }

    // Return the user's information
    return user;
  }

  /**
   * Refreshes the user's session by verifying the refresh token and generating a new access token.
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
    // Find the refresh token associated with the user session
    const refreshToken = await this.tokensRepository.findOne({
      token_type: TokenType.REFRESH,
      token_value: token,
      user: userId,
    });

    // If refresh token not found, throw an exception
    if (!refreshToken) {
      throw new NotFoundException(
        'No information found for that session refresh token.',
      );
    }

    // If refresh token is revoked, throw an exception
    if (refreshToken.revoked) {
      throw new NotFoundException('The refresh token has been revoked.');
    }

    // Verify the validity of the refresh token
    const refreshTokenValid = await this._jwtService.verifyAsync(
      refreshToken.token_value,
    );

    // If refresh token is not valid, revoke it and throw an exception
    if (!refreshTokenValid) {
      refreshToken.revoked = true;
      await this.em.persistAndFlush(refreshToken);
      throw new UnauthorizedException(
        'The refresh token has expired, please log in again.',
      );
    }

    // Calculate token expiration time (8 hours)
    const tokenExp = Date.now() + 288e5;

    // Create payload for new access token
    const tokenPayload: Omit<JWTPayload, 'raw'> = {
      iat: Date.now(),
      sub: userId,
    };

    // Sign the new access token
    const tokenAuth = await this._jwtService.signAsync(tokenPayload);

    // Create and persist the new access token
    const tokenAuthCreated = this.tokensRepository.create({
      device: DeviceTypes.NotFound,
      expiration: new Date(tokenExp),
      revoked: false,
      token_type: TokenType.AUTH,
      token_value: tokenAuth,
      user: userId,
    });
    await this.em.persistAndFlush(tokenAuthCreated);

    // Return the new access token and the provided refresh token
    return {
      access_token: tokenAuthCreated.token_value,
      refresh_token: refreshToken.token_value,
    };
  }

  /**
   * Signs in a user by verifying their credentials and generating access and refresh tokens.
   *
   * @param signInInput - An object containing the user's username and password.
   * @returns An object containing the generated access and refresh tokens.
   * @throws UnauthorizedException if no account is found with the provided username or if the password is incorrect.
   */
  public async signIn({
    password,
    username,
  }: AuthSignInInput): Promise<AuthSignInObject> {
    // Find the user by their username and populate the password relationship
    const user = await this.usersRespository.findOne(
      {
        username,
      },
      {
        populate: ['password'],
      },
    );

    if (!user) {
      throw new UnauthorizedException('No account found with that username.');
    }

    // Compare the provided password with the stored password hash
    const isMatchPassword = await bcrypt.compare(
      password,
      user.password!.password_hash,
    );

    if (!isMatchPassword) {
      throw new UnauthorizedException(
        'An incorrect password has been entered.',
      );
    }

    // Calculate token expiration time
    const tokenExp = Date.now() + 288e5;

    // Create payload for access and refresh tokens
    const tokenPayload: Omit<JWTPayload, 'raw'> = {
      iat: Date.now(),
      sub: user.id,
    };

    // Generate access token
    const tokenAuth = await this._jwtService.signAsync(tokenPayload);
    const tokenAuthCreated = this.tokensRepository.create({
      device: DeviceTypes.NotFound,
      expiration: new Date(tokenExp),
      revoked: false,
      token_type: TokenType.AUTH,
      token_value: tokenAuth,
      user,
    });

    // Generate refresh token
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

    // Persist the generated tokens
    await this.em.persistAndFlush([tokenAuthCreated, tokenRefreshCreated]);

    return {
      access_token: tokenAuthCreated.token_value,
      refresh_token: tokenRefreshCreated.token_value,
    };
  }

  /**
   * Creates a new user account with the provided information.
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
  }: AuthSignUpInput): Promise<AuthUserObject> {
    // Check if a user with the same username or email already exists
    const userExist = await this.usersRespository.findOne({
      $or: [{ username }, { email: { value: email } }],
    });

    if (userExist) {
      throw new BadRequestException(
        'An account already exists with that email or username.',
      );
    }

    // Check if the email is already registered
    const isEmailRegistered = await this.authEmailsRepository.findOne({
      value: email,
    });

    if (isEmailRegistered) {
      throw new BadRequestException(
        'There is already a registered user with that email.',
      );
    }

    // Create a new user entity with the provided details
    const user = this.usersRespository.create({
      first_name,
      last_name,
      username,
    });

    // Persist the new user entity
    await this.em.persistAndFlush(user);

    // Generate a password hash and salt
    const passwordHashed = await this._passwordService.generate(password);

    // Create a new user password entity
    const userPassword = this.passwordRepository.create({
      password_hash: passwordHashed.hash,
      salt: passwordHashed.salt,
      user,
    });

    // Associate the password entity with the user
    user.password = userPassword;

    // Create a new user email entity
    const userEmail = this.authEmailsRepository.create({
      user,
      value: email,
    });

    // Associate the email entity with the user
    user.email = userEmail;

    // Persist the password, email,and user entities
    await this.em.persistAndFlush([userEmail, userPassword, user]);

    return user;
  }

  /**
   * Updates the account information of a user.
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
  ): Promise<AuthUserObject> {
    // Find the user by their userId and populate the email relationship
    const user = await this.usersRespository.findOne(
      {
        id: userId,
      },
      {
        populate: ['email'],
      },
    );

    if (!user) {
      throw new NotFoundException(
        'Your account information could not be obtained.',
      );
    }

    // Check if the selected username is already in use by another user
    const usernameExist = await this.usersRespository.findOne({
      username,
    });

    if (usernameExist && usernameExist.id !== userId) {
      throw new BadRequestException(
        "You can't select that username because another user already has it.",
      );
    }

    // Update the user's account information
    user.username = username;
    user.first_name = first_name;
    user.last_name = last_name;
    user.biography = biography;

    // Persist the updated user account information
    await this.em.persistAndFlush(user);
    return user;
  }
}
