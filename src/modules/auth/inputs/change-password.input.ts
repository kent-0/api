import { Field, InputType } from '@nestjs/graphql';

@InputType({
  description: 'Change password.',
})
export class AuthChangePasswordInput {
  @Field({
    description: 'Current password of the user account.',
  })
  public currentPassword!: string;

  @Field({
    description: 'New password to use for the user account.',
  })
  public newPassword!: string;
}
