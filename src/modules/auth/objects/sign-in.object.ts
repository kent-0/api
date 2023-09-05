import { Field, ObjectType } from '@nestjs/graphql';

/**
 * Represents the response structure when a user signs in. The response includes
 * both an access token (which provides short-lived access to user resources) and
 * an optional refresh token (which can be used to obtain a new access token when
 * the current one expires).
 *
 * This class is also decorated with GraphQL decorators to allow it to be used
 * as a return type in GraphQL queries or mutations related to authentication.
 */
@ObjectType({
  description:
    'Represents both the access and (optionally) refresh tokens provided to the user upon authentication. ' +
    'The access token grants the user access to specific resources, while the refresh token can be used ' +
    'to get a new access token once the current one expires.',
})
export class AuthSignInObject {
  /**
   * Represents the access token given to the user upon successful authentication.
   * This token is typically short-lived and grants the user access to specific resources
   * (like their user profile, posts, etc.). Once it expires, the user either needs to
   * re-authenticate or use a refresh token to obtain a new access token.
   *
   * @type {string}
   * @description The JWT (JSON Web Token) that can be used to authenticate subsequent requests.
   * @required
   */
  @Field({
    description:
      'The JWT (JSON Web Token) used for authenticating the user in subsequent requests.',
  })
  public access_token!: string;

  /**
   * Represents an optional refresh token. When provided, this token can be used to obtain
   * a new access token once the current one expires, without requiring the user to re-enter
   * their credentials. This ensures a smoother user experience, especially in situations where
   * the user might be in the middle of a task when their access token expires.
   *
   * @type {string | undefined}
   * @description A token that can be used to get a new access token without re-authenticating.
   * @optional
   */
  @Field({
    description:
      'A token, which when provided, can be used to renew the access token without needing the user to sign in again.',
    nullable: true,
  })
  public refresh_token?: string;
}
