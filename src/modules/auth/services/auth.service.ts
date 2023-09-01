import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';

import { BadRequestException, Injectable } from '@nestjs/common';

import { AuthPasswordEntity, AuthUserEntity } from '~/database/entities';

import * as bcrypt from 'bcrypt';

import { AuthSignUpInput } from '../inputs/sign-up.input';
import { AuthUserObject } from '../objects/user.object';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthUserEntity)
    private readonly usersRespository: EntityRepository<AuthUserEntity>,
    @InjectRepository(AuthPasswordEntity)
    private readonly passwordRepository: EntityRepository<AuthPasswordEntity>,
    private readonly em: EntityManager,
  ) {}

  public async signUp({
    email,
    first_name,
    last_name,
    password,
    username,
  }: AuthSignUpInput): Promise<AuthUserObject> {
    const userExist = await this.usersRespository.findOne({
      $or: [{ username }, { email }],
    });

    if (userExist) {
      throw new BadRequestException(
        'An account already exists with that email or username.',
      );
    }

    const user = this.usersRespository.create({
      email,
      first_name,
      last_name,
      username,
    });

    await this.em.persistAndFlush(user);

    const passwordSalt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, passwordSalt);
    const passwordSaved = this.passwordRepository.create({
      password_hash: passwordHash,
      salt: passwordSalt,
      user: user,
    });

    user.password = passwordSaved;
    await this.em.persistAndFlush(user);

    return user;
  }
}
