import { Field, InputType } from '@nestjs/graphql';

import { IsString } from 'class-validator';

/**
 * Represents the data required to log in to a user's account in a GraphQL mutation or query.
 * This class integrates GraphQL type definitions and class-validator decorators.
 */
@InputType({
  description: 'Data required for user account authentication.',
})
export class AuthSignInInput {
  /**
   * The password associated with the user's account. This is required to authenticate and access the account.
   *
   * @type {string}
   * @description Account access password.
   * @required
   * @validations Ensures the provided value is of string type.
   */
  @Field({
    description: 'Account password required for authentication.',
  })
  @IsString({ message: 'This field can only be of text type.' })
  public password!: string;

  /**
   * The unique identifier for a user, used along with the password to authenticate the user.
   *
   * @type {string}
   * @description Unique username of the user account.
   * @required
   * @validations Ensures the provided value is of string type.
   */
  @Field({
    description: 'Unique identifier used for user authentication.',
  })
  @IsString({ message: 'This field can only be of text type.' })
  public username!: string;
}
