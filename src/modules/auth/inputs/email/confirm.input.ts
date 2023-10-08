import { Field, InputType } from '@nestjs/graphql';

import { IsEmail, IsString, MinLength } from 'class-validator';

/**
 * Represents the data required to confirm a user's email address in a GraphQL mutation or query.
 * This class integrates GraphQL type definitions and class-validator decorators.
 */
@InputType({
  description: "Details required to confirm a user's email address.",
})
export class AuthConfirmEmailInput {
  /**
   * The activation code sent to the user's email for verification.
   *
   * @type {string}
   * @description Activation code for email.
   * @required
   */
  @Field({
    description:
      "Activation code sent to the user's email for verification. Must be of text type.",
  })
  @IsString({ message: 'This field can only be of text type.' })
  @MinLength(9, {
    message: 'The activation code must be at least 9 characters long.',
  })
  public code!: string;

  /**
   * The email address the user wishes to confirm.
   *
   * @type {string}
   * @description Email to confirm.
   * @required
   * @validations Ensures valid email format.
   */
  @Field({
    description:
      'Email address the user wishes to confirm. Should be in a valid email format.',
  })
  @IsEmail(
    { allow_ip_domain: false, require_tld: true },
    { message: 'Enter a valid email. For example: acme@example.com' },
  )
  @IsString({ message: 'This field can only be of text type.' })
  public email!: string;
}
