import { Field, InputType } from '@nestjs/graphql';

import { IsEmail, IsString } from 'class-validator';

@InputType({
  description: 'Confirm user email.',
})
export class AuthConfirmEmailInput {
  @Field({
    description: 'Activation code for email.',
  })
  @IsString({
    message: 'This field can only be of text type.',
  })
  public code!: string;

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
