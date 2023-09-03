import { Field, ObjectType } from '@nestjs/graphql';

/**
 * Object type representing access and refresh tokens for the user account.
 * These tokens will be available until they expire or are renewed.
 */
@ObjectType({
  description:
    'Access and refresh token for the user account. They will be available until they expire or are renewed.',
})
export class AuthSignInObject {
  /**
   * Access token.
   */
  @Field({
    description: 'Access token.',
  })
  public access_token!: string;

  /**
   * Refresh token.
   */
  @Field({
    description: 'Refresh token.',
  })
  public refresh_token?: string;
}
