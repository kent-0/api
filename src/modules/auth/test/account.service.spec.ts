import { EntityManager, MikroORM } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';

import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';

import {
  AuthEmailsEntity,
  AuthPasswordEntity,
  AuthTokensEntity,
  AuthUserEntity,
} from '~/database/entities';

import { AuthAccountService } from '../services/account.service';
import { AuthPasswordService } from '../services/password.service';

const mockRepository = {
  findOne: jest.fn(),
  // ... otros métodos según sea necesario
};

const mockJwtService = {
  // ... métodos y propiedades mockeadas
};

const mockPasswordService = {
  // ... métodos y propiedades mockeadas
};

describe('Auth', () => {
  let service: AuthAccountService;
  let orm: MikroORM;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthAccountService,
        {
          provide: getRepositoryToken(AuthUserEntity),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(AuthPasswordEntity),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(AuthTokensEntity),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(AuthEmailsEntity),
          useValue: mockRepository,
        },
        {
          provide: EntityManager,
          useValue: MikroORM.init({}).then((orm) => orm.em),
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: AuthPasswordService,
          useValue: mockPasswordService,
        },
      ],
    }).compile();

    service = module.get<AuthAccountService>(AuthAccountService);
    orm = await MikroORM.init({});
    service;
    orm;
  });
});
