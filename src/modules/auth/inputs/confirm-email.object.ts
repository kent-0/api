import { Field, InputType } from '@nestjs/graphql';

@InputType({
  description: 'Confirm user email.',
})
export class AuthConfirmEmailInput {
  @Field({
    description: 'Activation code for email.',
  })
  public code!: string;

  @Field({
    description: 'Email to confirm.',
  })
  public email!: string;
}
