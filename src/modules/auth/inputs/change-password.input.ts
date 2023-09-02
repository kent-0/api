import { Field, InputType } from '@nestjs/graphql';

import { IsString, MinLength } from 'class-validator';

@InputType({
  description: 'Change password.',
})
export class AuthChangePasswordInput {
  @Field({
    description: 'Current password of the user account.',
  })
  @IsString({
    message: 'This field can only be of text type.',
  })
  public currentPassword!: string;

  @Field({
    description: 'New password to use for the user account.',
  })
  @IsString({
    message: 'This field can only be of text type.',
  })
  @MinLength(6, { message: 'The password must be at least 6 characters.' })
  public newPassword!: string;
}
