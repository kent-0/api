import { MikroOrmModule } from '@mikro-orm/nestjs';
import { SqliteDriver } from '@mikro-orm/sqlite';

import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';

import {
  AuthEmailsEntity,
  AuthPasswordEntity,
  AuthTokensEntity,
  AuthUserEntity,
} from '~/database/entities';
import { AuthAccountService } from '~/modules/auth/services/account.service';
import { AuthPasswordService } from '~/modules/auth/services/password.service';

describe('Account', () => {
  let accountService: AuthAccountService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        MikroOrmModule.forRoot({
          dbName: ':memory:',
          driver: SqliteDriver,
        }),
        MikroOrmModule.forFeature({
          entities: [
            AuthTokensEntity,
            AuthUserEntity,
            AuthPasswordEntity,
            AuthEmailsEntity,
          ],
        }),
      ],
      providers: [AuthAccountService, AuthPasswordService, JwtService],
    }).compile();

    accountService = module.get<AuthAccountService>(AuthAccountService);
  });

  it('should be defined', () => {
    expect(accountService).toBeDefined();
  });
});
