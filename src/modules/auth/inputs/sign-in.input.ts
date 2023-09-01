import { Field, InputType } from '@nestjs/graphql';

@InputType({
  description: 'Data to log in to the user account.',
})
export class AuthSignInInput {
  @Field({
    description: 'Account access password.',
  })
  public password!: string;

  @Field({
    description: 'Unique username of the user account.',
  })
  public username!: string;
}
