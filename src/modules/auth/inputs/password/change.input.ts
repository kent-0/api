import { Field, InputType } from '@nestjs/graphql';

import { IsString, MinLength } from 'class-validator';

/**
 * The `AuthChangePasswordInput` is an input type for GraphQL, representing the data needed to change a user's password.
 * This class integrates both GraphQL type definitions and class-validator decorators to ensure both type safety
 * in GraphQL operations and validation of input data.
 *
 * When this input type is used in a GraphQL mutation or query, it expects two fields:
 * `currentPassword` and `newPassword`.
 */
@InputType({
  description: "Details needed to modify a user's password.",
})
export class AuthChangePasswordInput {
  /**
   * The `currentPassword` field represents the existing password of the user's account.
   * It is mandatory and must be of type string.
   *
   * @public
   * @property
   * @type {string}
   *
   * @description Current password of the user account.
   */
  @Field({
    description:
      "Existing password of the user's account. Must be of text type.",
  })
  @IsString({
    message: 'This field can only be of text type.',
  })
  public currentPassword!: string;

  /**
   * The `newPassword` field represents the new password the user wishes to set for their account.
   * It is mandatory, must be of type string, and at least 6 characters long.
   *
   * @public
   * @property
   * @type {string}
   *
   * @description New password to use for the user account.
   */
  @Field({
    description:
      "Desired new password for the user's account. Must be of text type and at least 6 characters long.",
  })
  @IsString({
    message: 'This field can only be of text type.',
  })
  @MinLength(6, { message: 'The password must be at least 6 characters.' })
  public newPassword!: string;
}
