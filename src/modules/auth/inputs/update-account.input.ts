import { Field, InputType } from '@nestjs/graphql';

@InputType({
  description: 'Update the personal information of the user account.',
})
export class AuthUpdateAccountInput {
  @Field({
    description: 'First name of the person who owns the user account.',
  })
  public first_name!: string;

  @Field({
    description: 'Last name of the person who owns the user account.',
  })
  public last_name!: string;

  @Field({
    description: 'Unique username of the user account.',
  })
  public username!: string;
}
