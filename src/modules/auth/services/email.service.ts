import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { AuthEmailsEntity } from '~/database/entities';

import { AuthConfirmEmailInput } from '../inputs';
import { AuthUserEmailObject } from '../objects';

/**
 * AuthEmailService class is responsible for managing user email-related operations.
 * It interacts with the database to handle email confirmation and related tasks.
 */
@Injectable()
export class AuthEmailService {
  constructor(
    // Inject the repository for AuthEmailsEntity to interact with email data
    @InjectRepository(AuthEmailsEntity)
    private readonly authEmailsRepository: EntityRepository<AuthEmailsEntity>,

    // EntityManager instance to manage database operations
    private readonly em: EntityManager,
  ) {}

  /**
   * Confirms a user's email address using the provided activation code.
   *
   * @param confirmInput - An object containing the activation code and email.
   * @returns The confirmed user email information.
   * @throws NotFoundException if no user email information is found with the provided email.
   * @throws BadRequestException if the account email has already been confirmed or if the activation code is incorrect.
   */
  public async confirm({
    code,
    email,
  }: AuthConfirmEmailInput): Promise<AuthUserEmailObject> {
    // Find the user email information by the provided email
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

    // Mark the user's email as confirmed
    userEmail.is_confirmed = true;
    await this.em.persistAndFlush(userEmail);

    return userEmail;
  }
}
