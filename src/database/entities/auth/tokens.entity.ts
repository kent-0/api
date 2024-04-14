import {
  Entity,
  Enum,
  ManyToOne,
  OptionalProps,
  Property,
  Rel,
} from '@mikro-orm/core';

import {
  AuthUserEntity,
  type OptionalParentProps,
  ParentEntity,
} from '~/database/entities';
import { TokenType } from '~/database/enums/token.enum';

/**
 * Entity representing the authentication tokens. These tokens can be of various types,
 * such as access or refresh tokens, and are created during user sessions for authentication and authorization purposes.
 */
@Entity({
  comment: 'Access and refresh tokens created in user sessions.',
  tableName: 'auth_tokens',
})
export class AuthTokensEntity extends ParentEntity {
  /**
   * Defines the optional properties that can be set on this entity, which includes
   * any optional properties from the parent entity.
   */
  public [OptionalProps]?: OptionalParentProps;

  /**
   * Denotes the device name from which the token request was initiated.
   * This is useful for tracking and managing sessions across different devices.
   */
  @Property({
    columnType: 'varchar',
    comment: 'Name of the device used to generate the token.',
    length: 100,
    type: 'string',
  })
  public device!: string;

  /**
   * The expiration date and time of the token. After this timestamp,
   * the token will no longer be valid.
   */
  @Property({
    columnType: 'timestamp',
    comment: 'Token expiration date.',
    type: 'date',
  })
  public expiration!: Date;

  /**
   * Indicates whether the token has been revoked manually or programmatically.
   * A revoked token cannot be used for authentication.
   */
  @Property({
    columnType: 'bool',
    comment: 'Token revocation status.',
    type: 'boolean',
  })
  public revoked = false;

  /**
   * Specifies the type of token, which can be an access token, refresh token, etc.
   * The possible types are defined in the TokenType enum.
   */
  @Enum({
    comment: 'Type of token generated.',
    items: () => TokenType,
    type: 'enum',
  })
  public token_type!: TokenType;

  /**
   * The actual value of the token, which is sent in requests for authentication and authorization.
   */
  @Property({
    columnType: 'varchar',
    comment:
      'The actual value of the token, which is sent in requests for authentication and authorization.',
    length: 100,
    type: 'string',
    unique: true,
  })
  public token_value!: string;

  /**
   * Many-to-One relationship with the AuthUserEntity. Represents the user
   * to whom this token was issued. Each user can have multiple tokens,
   * but each token is associated with only one user.
   */
  @ManyToOne({
    comment: 'Relationship to the user assigned to the generated token.',
    entity: () => AuthUserEntity,
  })
  public user!: Rel<AuthUserEntity>;
}
