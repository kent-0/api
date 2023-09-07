import { Field, InputType } from '@nestjs/graphql';

import { IsEmail, IsString } from 'class-validator';

/**
 * Represents the data required to confirm a user's email address in a GraphQL mutation or query.
 * This class integrates GraphQL type definitions and class-validator decorators.
 */
@InputType({
  description: 'Confirm user email.',
})
export class AuthConfirmEmailInput {
  /**
   * The activation code sent to the user's email for verification.
   *
   * @type {string}
   * @description Activation code for email.
   * @required
   */
  @Field()
  @IsString({ message: 'This field can only be of text type.' })
  public code!: string;

  /**
   * The email address the user wishes to confirm.
   *
   * @type {string}
   * @description Email to confirm.
   * @required
   * @validations Ensures valid email format.
   */
  @Field()
  @IsEmail(
    { allow_ip_domain: false, require_tld: true },
    { message: 'Enter a valid email. For example: acme@example.com' },
  )
  @IsString({ message: 'This field can only be of text type.' })
  public email!: string;
}
