import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';

import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthPasswordEntity, AuthUserEntity } from '~/database/entities';

import * as bcrypt from 'bcrypt';

import { AuthChangePasswordInput } from '../inputs/change-password.input';

/**
 * AuthPasswordService class is responsible for managing user password-related operations.
 * It interacts with the database to handle password creation, verification, and related tasks.
 */
@Injectable()
export class AuthPasswordService {
  constructor(
    // Inject the repository for AuthPasswordEntity to interact with password data
    @InjectRepository(AuthPasswordEntity)
    private readonly passwordRepository: EntityRepository<AuthPasswordEntity>,

    // Inject the repository for AuthUserEntity to interact with user data
    @InjectRepository(AuthUserEntity)
    private readonly usersRespository: EntityRepository<AuthUserEntity>,

    // EntityManager instance to manage database operations
    private readonly em: EntityManager,
  ) {}

  /**
   * Changes the password of the authenticated user.
   *
   * @param changePasswordInput - An object containing the current and new passwords.
   * @param userId - The ID of the authenticated user.
   * @returns A success message indicating that the password was updated.
   * @throws NotFoundException if the user or password information could not be obtained.
   * @throws UnauthorizedException if the current password is incorrect.
   */
  public async change(
    { currentPassword, newPassword }: AuthChangePasswordInput,
    userId: string,
  ): Promise<string> {
    // Find the user by their ID
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

    // Find the password information associated with the user
    const password = await this.passwordRepository.findOne({
      id: user.password?.id,
    });

    if (!password) {
      throw new NotFoundException(
        'Something happened and your password information could not be obtained.',
      );
    }

    // Compare the current password with the stored password hash
    const comparePassword = await bcrypt.compare(
      currentPassword,
      password.password_hash,
    );

    if (!comparePassword) {
      throw new UnauthorizedException('The current password is incorrect.');
    }

    // Generate a new hash and salt for the new password
    const hashedPassword = await this.generate(newPassword);
    password.password_hash = hashedPassword.hash;
    password.salt = hashedPassword.salt;

    // Update the password information
    await this.em.persistAndFlush(password);

    return 'Password updated correctly.';
  }

  /**
   * Generates a password hash and salt for the provided password.
   *
   * @param password - The password to generate the hash and salt for.
   * @returns An object containing the password hash and salt.
   */
  public async generate(password: string) {
    // Generate a salt
    const passwordSalt = await bcrypt.genSalt();

    // Hash the password using the generated salt
    const passwordHash = await bcrypt.hash(password, passwordSalt);

    return {
      hash: passwordHash,
      salt: passwordSalt,
    };
  }
}
