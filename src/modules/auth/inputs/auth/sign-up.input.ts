import { Field, InputType } from '@nestjs/graphql';

import { IsEmail, IsString, Matches, MaxLength } from 'class-validator';

/**
 * Represents the data required to create a new user account in a GraphQL mutation or query.
 * This class integrates GraphQL type definitions and class-validator decorators for input validation.
 */
@InputType({
  description: 'Information needed to create a user account.',
})
export class AuthSignUpInput {
  /**
   * The email address associated with the user's account. This is often used for account-related communications and password resets.
   *
   * @type {string}
   * @description Account login email address.
   * @required
   * @validations
   *  - Ensures the provided value is a valid email format.
   *  - Ensures the provided value is of string type.
   */
  @Field()
  @IsEmail(
    { allow_ip_domain: false, require_tld: true },
    { message: 'Enter a valid email. For example: acme@example.com' },
  )
  @IsString({ message: 'This field can only be of text type.' })
  public email!: string;

  /**
   * The first name of the user. Used for personalized communication.
   *
   * @type {string}
   * @description First name of the person who owns the account.
   * @required
   * @validations
   *  - Maximum length of 30 characters.
   *  - Must only contain alphabet characters.
   *  - Ensures the provided value is of string type.
   */
  @Field()
  @MaxLength(30, { message: 'The first name cannot exceed 30 characters.' })
  @Matches(/^[A-Za-z]+$/, {
    message: 'The first name can only contain text characters.',
  })
  @IsString({ message: 'This field can only be of text type.' })
  public first_name!: string;

  /**
   * The last name of the user. Used in conjunction with the first name for full identification.
   *
   * @type {string}
   * @description Last name of the person who owns the account.
   * @required
   * @validations
   *  - Maximum length of 30 characters.
   *  - Must only contain alphabet characters.
   *  - Ensures the provided value is of string type.
   */
  @Field()
  @MaxLength(30, { message: 'The last name cannot exceed 30 characters.' })
  @Matches(/^[A-Za-z]+$/, {
    message: 'The last name can only contain text characters.',
  })
  @IsString({ message: 'This field can only be of text type.' })
  public last_name!: string;

  /**
   * The password that will be used to secure the user's account. This will be hashed and stored securely.
   *
   * @type {string}
   * @description Account login password.
   * @required
   */
  @Field()
  public password!: string;

  /**
   * An identifier chosen by the user, used to represent them within the application. This should be unique.
   *
   * @type {string}
   * @description Unique user name to interact in the application.
   * @required
   * @validations
   *  - Maximum length of 30 characters.
   *  - Only allows numbers, letters, and the symbols -_.
   *  - Ensures the provided value is of string type.
   */
  @Field()
  @MaxLength(30, { message: 'The username cannot exceed 30 characters.' })
  @Matches(/^[A-Za-z0-9_-]+$/, {
    message:
      'The username can only contain numbers, letters, and the symbols -_.',
  })
  @IsString({ message: 'This field can only be of text type.' })
  public username!: string;
}
