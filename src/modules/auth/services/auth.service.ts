import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';

import { Injectable } from '@nestjs/common';

import { AuthTokensEntity } from '~/database/entities';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthTokensEntity)
    private readonly tokensRepository: EntityRepository<AuthTokensEntity>,
  ) {}
}
