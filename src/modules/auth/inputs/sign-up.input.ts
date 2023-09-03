import { Field, InputType } from '@nestjs/graphql';

import { IsEmail, IsString, Matches, MaxLength } from 'class-validator';

/**
 * Input type for creating a user account.
 */
@InputType({
  description: 'Information needed to create a user account.',
})
export class AuthSignUpInput {
  /**
   * Account login email address.
   */
  @Field({
    description: 'Account login email address.',
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

  /**
   * First name of the person who owns the account.
   */
  @Field({
    description: 'First name of the person who owns the account.',
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
   * Last name of the person who owns the account.
   */
  @Field({
    description: 'Last name of the person who owns the account.',
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
   * Account login password.
   */
  @Field({
    description: 'Account login password.',
  })
  public password!: string;

  /**
   * Unique user name to interact in the application.
   */
  @Field({
    description: 'Unique user name to interact in the application.',
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
