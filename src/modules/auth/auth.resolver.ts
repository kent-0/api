import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { AuthSignUpInput } from './inputs/sign-up.input';
import { AuthService } from './services/auth.service';

import { AuthUserObject } from '../user/objects/user.object';

@Resolver()
export class AuthResolver {
  constructor(private _authService: AuthService) {}

  @Mutation(() => AuthUserObject, {
    description: 'Create a user on the platform.',
  })
  public signUp(@Args('input') input: AuthSignUpInput) {
    return this._authService.signUp(input);
  }
}
