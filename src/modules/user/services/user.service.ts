import { Injectable } from '@nestjs/common';

import type { AuthUserObject } from '../objects/user.object';

@Injectable()
export class UserService {
  public get(): AuthUserObject {
    return {
      username: 'OK',
    };
  }
}
