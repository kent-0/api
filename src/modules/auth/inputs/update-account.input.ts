import { Field, InputType } from '@nestjs/graphql';

import { IsString, Matches, MaxLength } from 'class-validator';

/**
 * Input type for updating the personal information of the user account.
 */
@InputType({
  description: 'Update the personal information of the user account.',
})
export class AuthUpdateAccountInput {
  /**
   * Biography of the user.
   */
  @Field({
    description: 'Biography of the user.',
  })
  @MaxLength(300, {
    message: 'The biography cannot exceed 300 characters.',
  })
  @IsString({
    message: 'This field can only be of text type.',
  })
  public biography!: string;

  /**
   * First name of the person who owns the user account.
   */
  @Field({
    description: 'First name of the person who owns the user account.',
  })
  @MaxLength(30, {
    message: 'The first name cannot exceed 30 characters.',
  })
  @Matches(/^[A-Za-z]+$/, {
    message: 'The first name can only contain text characters.',
  })
  @IsString({
    message: 'This field can only be of text type.',
  })
  public first_name!: string;

  /**
   * Last name of the person who owns the user account.
   */
  @Field({
    description: 'Last name of the person who owns the user account.',
  })
  @MaxLength(30, {
    message: 'The last name cannot exceed 30 characters.',
  })
  @Matches(/^[A-Za-z]+$/, {
    message: 'The last name can only contain text characters.',
  })
  @IsString({
    message: 'This field can only be of text type.',
  })
  public last_name!: string;

  /**
   * Unique username of the user account.
   */
  @Field({
    description: 'Unique username of the user account.',
  })
  @MaxLength(30, {
    message: 'The username cannot exceed 30 characters.',
  })
  @Matches(/^[A-Za-z0-9_-]+$/, {
    message:
      'The username can only contain numbers, letters, and the symbols -_.',
  })
  @IsString({
    message: 'This field can only be of text type.',
  })
  public username!: string;
}
