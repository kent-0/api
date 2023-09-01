import { Field, InputType } from '@nestjs/graphql';

@InputType({
  description: 'Information needed to create a user account.',
})
export class AuthSignUpInput {
  @Field({
    description: 'Account login email address.',
  })
  public email!: string;

  @Field({
    description: 'First name of the person who owns the account.',
  })
  public first_name!: string;

  @Field({
    description: 'Last name of the person who owns the account.',
  })
  public last_name!: string;

  @Field({
    description: 'Account login password.',
  })
  public password!: string;

  @Field({
    description: 'Unique user name to interact in the application.',
  })
  public username!: string;
}
