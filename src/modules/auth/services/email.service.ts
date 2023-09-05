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
 * `AuthEmailService` is a service class that provides functionality related to
 * user email management in the authentication process. This includes operations
 * like email confirmation, email retrieval, and more.
 *
 * This class collaborates with the `authEmailsRepository` to perform CRUD operations
 * on the `AuthEmailsEntity`, representing the email-related data of the users.
 * It also uses the `EntityManager` to directly perform and manage database operations.
 *
 * The necessary repositories and services are injected into this service through
 * its constructor.
 */
@Injectable()
export class AuthEmailService {
  /**
   * Constructor for the AuthEmailService class.
   *
   * Initializes the class with necessary repositories.
   *
   * @param {EntityRepository<AuthEmailsEntity>} authEmailsRepository - Repository for interacting with email data.
   * @param {EntityManager} em - Entity manager for direct database operations.
   */
  constructor(
    @InjectRepository(AuthEmailsEntity)
    private readonly authEmailsRepository: EntityRepository<AuthEmailsEntity>,

    private readonly em: EntityManager,
  ) {}

  /**
   * Confirms a user's email address.
   *
   * This method performs the following steps:
   * 1. Fetches the email information associated with the provided email address from the database.
   * 2. If no such email record exists, it throws a NotFoundException.
   * 3. If the email is already confirmed, it throws a BadRequestException.
   * 4. Checks if the provided confirmation code matches the stored activation token.
   *    If they don't match, it throws a BadRequestException.
   * 5. If all checks pass, it marks the email as confirmed in the database.
   * 6. Returns the updated email record.
   *
   * @param {AuthConfirmEmailInput} code, email - Object containing the confirmation code and the email address to be confirmed.
   * @returns {Promise<AuthUserEmailObject>} The confirmed email record.
   * @throws {NotFoundException} If no account is found with the provided email address.
   * @throws {BadRequestException} If the email is already confirmed or the activation code is incorrect.
   */
  public async confirm({
    code,
    email,
  }: AuthConfirmEmailInput): Promise<AuthUserEmailObject> {
    // Fetch the email information associated with the provided email address from the database.
    const userEmail = await this.authEmailsRepository.findOne({
      value: email,
    });

    // If the fetched email record is null or undefined, it means the email does not exist. Hence, throw a NotFoundException.
    if (!userEmail) {
      throw new NotFoundException(
        "We couldn't find your user email information.",
      );
    }

    // If the email is already confirmed, throw a BadRequestException.
    if (userEmail.is_confirmed) {
      throw new BadRequestException(
        'The account email has already been confirmed.',
      );
    }

    // Check if the provided confirmation code matches the stored activation token.
    if (code !== userEmail.activation_token) {
      throw new BadRequestException('The activation code is incorrect.');
    }

    // Mark the email as confirmed in the database.
    userEmail.is_confirmed = true;
    await this.em.persistAndFlush(userEmail);

    // Return the updated email record.
    return userEmail;
  }
}
