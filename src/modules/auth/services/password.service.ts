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

import { AuthChangePasswordInput } from '../inputs';

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
   * This method provides functionality to change the password of an authenticated user.
   * It verifies the current password and, if correct, updates the password with the new value.
   *
   * The process includes:
   * 1. Fetching the user details based on the provided user ID.
   * 2. Verifying the provided current password against the stored hashed password.
   * 3. If the current password is correct, hashing the new password and updating the stored value.
   *
   * This method uses bcrypt for password hashing and comparison.
   *
   * @param {AuthChangePasswordInput} changePasswordInput - Contains the current and new passwords.
   * @param {string} userId - The ID of the authenticated user.
   *
   * @returns {Promise<string>} A success message when the password is changed successfully.
   *
   * @throws {NotFoundException} If the user's details or password information are not found in the database.
   * @throws {UnauthorizedException} If the provided current password does not match the stored password.
   */
  public async change(
    { currentPassword, newPassword }: AuthChangePasswordInput,
    userId: string,
  ): Promise<string> {
    // Fetch the user's details using the provided user ID. Also, populate the related 'password' field.
    const user = await this.usersRespository.findOne(
      {
        id: userId,
      },
      {
        populate: ['password'],
      },
    );

    // If the user's details are not found, throw a NotFoundException.
    if (!user) {
      throw new NotFoundException(
        'Something happened and your user information could not be obtained.',
      );
    }

    // Fetch the stored password details for the user.
    const password = await this.passwordRepository.findOne({
      id: user.password?.id,
    });

    // If the password details are not found, throw a NotFoundException.
    if (!password) {
      throw new NotFoundException(
        'Something happened and your password information could not be obtained.',
      );
    }

    // Compare the provided current password against the stored hashed password using bcrypt.
    const comparePassword = await bcrypt.compare(
      currentPassword,
      password.password_hash,
    );

    // If the passwords don't match, throw an UnauthorizedException.
    if (!comparePassword) {
      throw new UnauthorizedException('The current password is incorrect.');
    }

    // Hash the new password and store the hashed value and salt.
    const hashedPassword = await this.generate(newPassword);
    password.password_hash = hashedPassword.hash;
    password.salt = hashedPassword.salt;

    // Persist the updated password details in the database.
    await this.em.persistAndFlush(password);

    // Return a success message.
    return 'Password updated correctly.';
  }

  /**
   * This method provides functionality to generate a password hash and associated salt.
   * The purpose of hashing a password before storing it is to enhance security.
   * If someone gains access to the database, they won't be able to see the actual passwords.
   * Instead, they'll see the hash which, when properly generated, cannot be reversed to reveal the original password.
   * The salt, a random data string, is added to the password before hashing to ensure that two identical passwords
   * will produce different hashes.
   *
   * The process includes:
   * 1. Generating a unique salt using bcrypt.
   * 2. Using this salt to hash the provided password.
   * 3. Returning both the hashed password and the salt.
   *
   * @param {string} password - The clear-text password that needs to be hashed.
   *
   * @returns {Promise<{ hash: string, salt: string }>} An object containing the hashed password and its associated salt.
   */
  public async generate(
    password: string,
  ): Promise<{ hash: string; salt: string }> {
    // Generate a unique salt using bcrypt. This will be used to hash the password.
    const passwordSalt = await bcrypt.genSalt();

    // Use the generated salt to hash the provided password.
    const passwordHash = await bcrypt.hash(password, passwordSalt);

    // Return both the hashed password and the salt.
    return {
      hash: passwordHash,
      salt: passwordSalt,
    };
  }
}
