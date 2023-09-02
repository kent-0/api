import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { AuthPasswordService } from '~/modules/auth/services/password.service';

import { UserToken } from './decorators/user.decorator';
import { JwtAuthGuard } from './guards/jwt.guard';
import { AuthChangePasswordInput } from './inputs/change-password.input';
import { AuthConfirmEmailInput } from './inputs/confirm-email.object';
import { AuthSignInInput } from './inputs/sign-in.input';
import { AuthSignUpInput } from './inputs/sign-up.input';
import { AuthUpdateAccountInput } from './inputs/update-account.input';
import { JWTPayload } from './interfaces/jwt.interface';
import { AuthSignInObject } from './objects/sign-in.object';
import { AuthUserEmailObject, AuthUserObject } from './objects/user.object';
import { AuthAccountService } from './services/account.service';
import { AuthEmailService } from './services/email.service';

@Resolver()
@UsePipes(ValidationPipe)
export class AuthResolver {
  constructor(
    private _accountService: AuthAccountService,
    private _passwordService: AuthPasswordService,
    private _emailService: AuthEmailService,
  ) {}

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

  @Mutation(() => AuthUserEmailObject, {
    description: 'Activate the email of the user account.',
  })
  public confirmEmail(@Args('input') input: AuthConfirmEmailInput) {
    return this._emailService.confirm(input);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => String, {
    description: 'Close current user token session.',
  })
  public logOut(@UserToken() token: JWTPayload) {
    return this._accountService.logOut(token.raw, token.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => AuthUserObject, {
    description: 'Current information of the authenticated user.',
  })
  public me(@UserToken() token: JWTPayload) {
    return this._accountService.me(token.sub);
  }

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

  @Mutation(() => AuthSignInObject, {
    description: 'Log in to the user account.',
  })
  public signIn(@Args('input') input: AuthSignInInput) {
    return this._accountService.signIn(input);
  }

  @Mutation(() => AuthUserObject, {
    description: 'Create a user on the platform.',
  })
  public signUp(@Args('input') input: AuthSignUpInput) {
    return this._accountService.signUp(input);
  }

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
