import { Field, InputType } from '@nestjs/graphql';

import { IsString, Matches, MaxLength } from 'class-validator';

/**
 * Represents the data required to update a user's account in a GraphQL mutation or query.
 * This class integrates GraphQL type definitions and class-validator decorators for input validation.
 */
@InputType({
  description:
    "Required structure to update a user's personal account information in the system.",
})
export class AuthUpdateAccountInput {
  /**
   * The user's biography or brief description.
   *
   * @type {string}
   * @description Biography of the user.
   * @required
   * @validations
   *  - Maximum length of 300 characters.
   *  - Ensures the provided value is of string type.
   */
  @Field({
    description:
      "A brief description or biography of the user detailing their history or interests. It's a text with a maximum of 300 characters.",
  })
  @MaxLength(300, { message: 'The biography cannot exceed 300 characters.' })
  @IsString({ message: 'This field can only be of text type.' })
  public biography!: string;

  /**
   * The user's first name. Used for personalized communication.
   *
   * @type {string}
   * @description First name of the person who owns the user account.
   * @required
   * @validations
   *  - Maximum length of 30 characters.
   *  - Must only contain alphabet characters.
   *  - Ensures the provided value is of string type.
   */
  @Field({
    description:
      "The user's first name, used for personalized communications. It should be a text containing only alphabetical characters and must not exceed 30 characters.",
  })
  @MaxLength(30, { message: 'The first name cannot exceed 30 characters.' })
  @Matches(/^[A-Za-z]+$/, {
    message: 'The first name can only contain text characters.',
  })
  @IsString({ message: 'This field can only be of text type.' })
  public first_name!: string;

  /**
   * The user's last name. Used in conjunction with the first name for full identification.
   *
   * @type {string}
   * @description Last name of the person who owns the user account.
   * @required
   * @validations
   *  - Maximum length of 30 characters.
   *  - Must only contain alphabet characters.
   *  - Ensures the provided value is of string type.
   */
  @Field({
    description:
      "The user's last name, used in conjunction with the first name for full identification. It should be a text containing only alphabetical characters and must not exceed 30 characters.",
  })
  @MaxLength(30, { message: 'The last name cannot exceed 30 characters.' })
  @Matches(/^[A-Za-z]+$/, {
    message: 'The last name can only contain text characters.',
  })
  @IsString({ message: 'This field can only be of text type.' })
  public last_name!: string;

  /**
   * An identifier chosen by the user, used to represent them within the application. This should be unique.
   *
   * @type {string}
   * @description Unique username of the user account.
   * @required
   * @validations
   *  - Maximum length of 30 characters.
   *  - Only allows numbers, letters, and the symbols -_.
   *  - Ensures the provided value is of string type.
   */
  @Field({
    description:
      'A unique identifier chosen by the user to represent themselves within the application. It can contain numbers, letters, and the symbols -_. It must not exceed 30 characters.',
  })
  @MaxLength(30, { message: 'The username cannot exceed 30 characters.' })
  @Matches(/^[A-Za-z0-9_-]+$/, {
    message:
      'The username can only contain numbers, letters, and the symbols -_.',
  })
  @IsString({ message: 'This field can only be of text type.' })
  public username!: string;
}
