import { Query, Resolver } from '@nestjs/graphql';

import { UserObject } from './objects/user.object';
import { UserService } from './services/user.service';

@Resolver()
export class UserResolver {
  constructor(private _userService: UserService) {}

  @Query(() => UserObject)
  public user() {
    return this._userService.get();
  }
}
