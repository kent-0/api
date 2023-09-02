import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';

import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthPasswordEntity, AuthUserEntity } from '~/entities';

import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  constructor(
    @InjectRepository(AuthPasswordEntity)
    private readonly passwordRepository: EntityRepository<AuthPasswordEntity>,
    @InjectRepository(AuthUserEntity)
    private readonly usersRespository: EntityRepository<AuthUserEntity>,
    private readonly em: EntityManager,
  ) {}

  public async change(
    currentPassword: string,
    newPassword: string,
    userId: string,
  ) {
    const user = await this.usersRespository.findOne(
      {
        id: userId,
      },
      {
        populate: ['password'],
      },
    );

    if (!user) {
      throw new NotFoundException(
        'Something happened and your user information could not be obtained.',
      );
    }

    const password = await this.passwordRepository.findOne({
      id: user.password?.id,
    });

    if (!password) {
      throw new NotFoundException(
        'Something happened and your password information could not be obtained.',
      );
    }

    const comparePassword = await bcrypt.compare(
      currentPassword,
      password.password_hash,
    );

    if (!comparePassword) {
      throw new UnauthorizedException('The current password is incorrect.');
    }

    const hashedPassword = await this.generate(newPassword);
    password.password_hash = hashedPassword.hash;
    password.salt = hashedPassword.salt;

    await this.em.persistAndFlush(password);

    return 'Password updated correctly.';
  }

  public async generate(password: string) {
    const passwordSalt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, passwordSalt);

    return {
      hash: passwordHash,
      salt: passwordSalt,
    };
  }
}
