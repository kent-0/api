import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { AuthPasswordService } from '~/modules/auth/services/password.service';

import { UserToken } from '../decorators/user.decorator';
import { JwtAuthGuard } from '../guards/jwt.guard';
import {
  AuthChangePasswordInput,
  AuthConfirmEmailInput,
  AuthSignInInput,
  AuthSignUpInput,
} from '../inputs';
import { JWTPayload } from '../interfaces/jwt.interface';
import {
  AuthSignInObject,
  AuthUserEmailObject,
  AuthUserObject,
} from '../objects';
import { AuthAccountService } from '../services/account.service';
import { AuthEmailService } from '../services/email.service';

/**
 * The AuthResolver class manages the GraphQL API endpoints related to authentication.
 * It acts as a bridge between the API and the services that handle authentication logic.
 * By providing clear, concise, and descriptive resolver methods, it allows the clients
 * to interact seamlessly with the application's authentication system.
 */
@Resolver()
@UsePipes(ValidationPipe)
export class AuthResolver {
  /**
   * Constructor initializes the resolver with the necessary services.
   *
   * @param _accountService - Service responsible for account-based operations.
   * @param _passwordService - Service responsible for password-related operations.
   * @param _emailService - Service responsible for email-related operations.
   */
  constructor(
    private _accountService: AuthAccountService,
    private _passwordService: AuthPasswordService,
    private _emailService: AuthEmailService,
  ) {}

  /**
   * This resolver method allows authenticated users to change their password.
   *
   * @param input - Contains current and new password data.
   * @param token - JWT payload for the authenticated user.
   * @returns A string message indicating the status of the password change.
   */
  @UseGuards(JwtAuthGuard)
  @Mutation(() => String, {
    description:
      'Allows the authenticated user to change their current password. Ensures security by requiring the user to provide the current password before updating.',
  })
  public changePassword(
    @Args('input') input: AuthChangePasswordInput,
    @UserToken() token: JWTPayload,
  ) {
    return this._passwordService.change(input, token.sub);
  }

  /**
   * This resolver method is for users to confirm their email address
   * using the activation code they received during sign up.
   *
   * @param input - Contains activation code and email to be confirmed.
   * @returns Email confirmation status and the email address.
   */
  @Mutation(() => AuthUserEmailObject, {
    description:
      'Allows users to confirm their email after registration. An essential step to ensure the authenticity of the user’s email.',
  })
  public confirmEmail(@Args('input') input: AuthConfirmEmailInput) {
    return this._emailService.confirm(input);
  }

  /**
   * Logs out the user by invalidating the current token session, ensuring the user needs to re-authenticate to get access again.
   *
   * @param token - JWT payload of the authenticated user.
   * @returns A message indicating successful logout.
   */
  @UseGuards(JwtAuthGuard)
  @Mutation(() => String, {
    description:
      'Ensures a user’s session is terminated and requires re-authentication for subsequent access.',
  })
  public logOut(@UserToken() token: JWTPayload) {
    return this._accountService.logOut(token.raw, token.sub);
  }

  /**
   * Provides a new access token for authenticated users, prolonging their authenticated session.
   *
   * @param refreshToken - Token that allows users to get a new access token.
   * @param token - JWT payload of the authenticated user.
   * @returns New access token and refresh token.
   */
  @Mutation(() => AuthSignInObject, {
    description:
      'Ensures that an authenticated user can prolong their session without needing to re-enter credentials.',
  })
  public refreshSession(@Args('refresh_token') refreshToken: string) {
    return this._accountService.refreshSession(refreshToken);
  }

  /**
   * Authenticates users based on their credentials and provides JWT tokens for future requests.
   *
   * @param input - Contains user's credentials.
   * @returns Authenticated session details including access and refresh tokens.
   */
  @Mutation(() => AuthSignInObject, {
    description:
      'Facilitates user authentication and initiates a secure session by providing necessary tokens.',
  })
  public signIn(@Args('input') input: AuthSignInInput) {
    return this._accountService.signIn(input);
  }

  /**
   * Allows new users to register on the platform.
   *
   * @param input - Contains user's registration details.
   * @returns The newly created user's account details.
   */
  @Mutation(() => AuthUserObject, {
    description:
      'Handles new user registrations, ensuring a smooth onboarding process.',
  })
  public signUp(@Args('input') input: AuthSignUpInput) {
    return this._accountService.signUp(input);
  }
}
