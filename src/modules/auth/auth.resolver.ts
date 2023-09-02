import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { PasswordService } from '~/modules/auth/services/password.service';

import { UserToken } from './decorators/user.decorator';
import { JwtAuthGuard } from './guards/jwt.guard';
import { AuthChangePasswordInput } from './inputs/change-password.input';
import { AuthSignInInput } from './inputs/sign-in.input';
import { AuthSignUpInput } from './inputs/sign-up.input';
import { JWTPayload } from './interfaces/jwt.interface';
import { AuthSignInObject } from './objects/sign-in.object';
import { AuthUserObject } from './objects/user.object';
import { AuthService } from './services/auth.service';

@Resolver()
export class AuthResolver {
  constructor(
    private _authService: AuthService,
    private _passwordService: PasswordService,
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

  @UseGuards(JwtAuthGuard)
  @Mutation(() => String, {
    description: 'Close current user token session.',
  })
  public logOut(@UserToken() token: JWTPayload) {
    return this._authService.logOut(token.raw, token.sub);
  }

  @Mutation(() => AuthSignInObject, {
    description: 'Log in to the user account.',
  })
  public signIn(@Args('input') input: AuthSignInInput) {
    return this._authService.signIn(input);
  }

  @Mutation(() => AuthUserObject, {
    description: 'Create a user on the platform.',
  })
  public signUp(@Args('input') input: AuthSignUpInput) {
    return this._authService.signUp(input);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => AuthUserObject, {
    description: 'Current information of the authenticated user.',
  })
  public user(@UserToken() token: JWTPayload) {
    return this._authService.user(token.sub);
  }
}
