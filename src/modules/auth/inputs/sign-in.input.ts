import { Field, InputType } from '@nestjs/graphql';

import { IsEmail, IsString } from 'class-validator';

/**
 * Input type for logging in to the user account.
 */
@InputType({
  description: 'Data to log in to the user account.',
})
export class AuthSignInInput {
  /**
   * Account access password.
   */
  @Field({
    description: 'Account access password.',
  })
  @IsString({
    message: 'This field can only be of text type.',
  })
  public password!: string;

  /**
   * Unique username of the user account.
   */
  @Field({
    description: 'Unique username of the user account.',
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
  public username!: string;
}
