import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { AuthEmailsEntity } from '~/database/entities';

import { AuthConfirmEmailInput } from '../inputs/confirm-email.object';
import { AuthUserEmailObject } from '../objects/user.object';

@Injectable()
export class AuthEmailService {
  constructor(
    @InjectRepository(AuthEmailsEntity)
    private readonly authEmailsRepository: EntityRepository<AuthEmailsEntity>,
    private readonly em: EntityManager,
  ) {}

  public async confirm({
    code,
    email,
  }: AuthConfirmEmailInput): Promise<AuthUserEmailObject> {
    const userEmail = await this.authEmailsRepository.findOne({
      value: email,
    });

    if (!userEmail) {
      throw new NotFoundException(
        "We couldn't find your user email information.",
      );
    }

    if (userEmail.is_confirmed) {
      throw new BadRequestException(
        'The account email has already been confirmed.',
      );
    }

    if (code !== userEmail.activation_token) {
      throw new BadRequestException('The activation code is incorrect.');
    }

    userEmail.is_confirmed = true;
    await this.em.persistAndFlush(userEmail);

    return userEmail;
  }
}
