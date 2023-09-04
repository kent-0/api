import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { AuthPasswordService } from '~/modules/auth/services/password.service';

import { UserToken } from './decorators/user.decorator';
import { JwtAuthGuard } from './guards/jwt.guard';
import {
  AuthChangePasswordInput,
  AuthConfirmEmailInput,
  AuthSignInInput,
  AuthSignUpInput,
} from './inputs';
import { AuthUpdateAccountInput } from './inputs/update-account.input';
import { JWTPayload } from './interfaces/jwt.interface';
import {
  AuthSignInObject,
  AuthUserEmailObject,
  AuthUserObject,
} from './objects';
import { AuthAccountService } from './services/account.service';
import { AuthEmailService } from './services/email.service';

/**
 * AuthResolver class defines GraphQL resolver methods for authentication related operations.
 * It uses various guards and pipes to handle authentication, validation, and authorization.
 */
@Resolver()
@UsePipes(ValidationPipe)
export class AuthResolver {
  constructor(
    private _accountService: AuthAccountService,
    private _passwordService: AuthPasswordService,
    private _emailService: AuthEmailService,
  ) {}

  /**
   * Change the current user's password.
   * Requires authentication using JWTAuthGuard.
   *
   * @param input - An object containing the current and new passwords.
   * @param token - Decoded JWT payload obtained from the token.
   * @returns A success message indicating that the password was updated.
   */
  @UseGuards(JwtAuthGuard)
  @Mutation(() => String, {
    description: 'Change the user current password.',
  })
  public changePassword(
    @Args('input') input: AuthChangePasswordInput,
    @UserToken() token: JWTPayload,
  ) {
    return this._passwordService.change(input, token.sub);
  }

  /**
   * Activate the email of the user account.
   *
   * @param input - An object containing the activation code and email.
   * @returns The confirmed user email information.
   */
  @Mutation(() => AuthUserEmailObject, {
    description: 'Activate the email of the user account.',
  })
  public confirmEmail(@Args('input') input: AuthConfirmEmailInput) {
    return this._emailService.confirm(input);
  }

  /**
   * Log out the current user's token session.
   * Requires authentication using JWTAuthGuard.
   *
   * @param token - Decoded JWT payload obtained from the token.
   * @returns A message indicating the status of the logout.
   */
  @UseGuards(JwtAuthGuard)
  @Mutation(() => String, {
    description: 'Close current user token session.',
  })
  public logOut(@UserToken() token: JWTPayload) {
    return this._accountService.logOut(token.raw, token.sub);
  }

  /**
   * Get the current information of the authenticated user.
   * Requires authentication using JWTAuthGuard.
   *
   * @param token - Decoded JWT payload obtained from the token.
   * @returns The user's information.
   */
  @UseGuards(JwtAuthGuard)
  @Query(() => AuthUserObject, {
    description: 'Current information of the authenticated user.',
  })
  public me(@UserToken() token: JWTPayload) {
    return this._accountService.me(token.sub);
  }

  /**
   * Refresh the access token using the refresh token.
   * Requires authentication using JWTAuthGuard.
   *
   * @param refreshToken - Refresh token associated with the user's session.
   * @param token - Decoded JWT payload obtained from the token.
   * @returns An object containing the new access token and the provided refresh token.
   */
  @UseGuards(JwtAuthGuard)
  @Mutation(() => AuthSignInObject, {
    description: 'Refresh access token with refresh token.',
  })
  public refreshSession(
    @Args('refresh_token') refreshToken: string,
    @UserToken() token: JWTPayload,
  ) {
    return this._accountService.refreshSession(refreshToken, token.sub);
  }

  /**
   * Log in to the user account.
   *
   * @param input - An object containing the user's username and password.
   * @returns An object containing the generated access and refresh tokens.
   */
  @Mutation(() => AuthSignInObject, {
    description: 'Log in to the user account.',
  })
  public signIn(@Args('input') input: AuthSignInInput) {
    return this._accountService.signIn(input);
  }

  /**
   * Create a user on the platform.
   *
   * @param input - An object containing user registration details.
   * @returns The created user account.
   */
  @Mutation(() => AuthUserObject, {
    description: 'Create a user on the platform.',
  })
  public signUp(@Args('input') input: AuthSignUpInput) {
    return this._accountService.signUp(input);
  }

  /**
   * Change the username of the current user.
   * Requires authentication using JWTAuthGuard.
   *
   * @param input - An object containing the updated user information.
   * @param token - Decoded JWT payload obtained from the token.
   * @returns The updated user account information.
   */
  @UseGuards(JwtAuthGuard)
  @Mutation(() => AuthUserObject, {
    description: 'Change username of the current user.',
  })
  public update(
    @Args('input') input: AuthUpdateAccountInput,
    @UserToken() token: JWTPayload,
  ) {
    return this._accountService.update(input, token.sub);
  }
}
