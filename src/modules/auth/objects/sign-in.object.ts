import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({
  description:
    'Access and refresh token for the user account. They will be available until they expire or are renewed.',
})
export class AuthSignInObject {
  @Field({
    description: 'Access token.',
  })
  public access_token!: string;

  @Field({
    description: 'Refresh token.',
  })
  public refresh_token?: string;
}
