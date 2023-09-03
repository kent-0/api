import { Field, InputType } from '@nestjs/graphql';

import { IsEmail, IsString } from 'class-validator';

/**
 * Input type for confirming user email.
 */
@InputType({
  description: 'Confirm user email.',
})
export class AuthConfirmEmailInput {
  /**
   * Activation code for email.
   */
  @Field({
    description: 'Activation code for email.',
  })
  @IsString({
    message: 'This field can only be of text type.',
  })
  public code!: string;

  /**
   * Email to confirm.
   */
  @Field({
    description: 'Email to confirm.',
  })
  @IsEmail(
    { allow_ip_domain: false, require_tld: true },
    {
      message: 'Enter a valid email. For example: acme@example.com',
    },
  )
  @IsString({
    message: 'This field can only be of text type.',
  })
  public email!: string;
}
