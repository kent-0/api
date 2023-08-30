import { Injectable } from '@nestjs/common';

import type { UserObject } from '../objects/user.object';

@Injectable()
export class UserService {
  public get(): UserObject {
    return {
      username: 'OK',
    };
  }
}
