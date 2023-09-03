import {
  Entity,
  Enum,
  ManyToOne,
  OptionalProps,
  Property,
  Rel,
} from '@mikro-orm/core';

import { AuthUserEntity } from './user.entity';

import { TokenType } from '../../enums/token.enum';
import { OptionalParentProps, ParentEntity } from '../base.entity';

/**
 * Entity representing access and refresh tokens created in user sessions.
 */
@Entity({
  comment: 'Access and refresh tokens created in user sessions.',
  tableName: 'auth_tokens',
})
export class AuthTokensEntity extends ParentEntity {
  /**
   * Optional properties that can be set on the entity.
   */
  public [OptionalProps]?: OptionalParentProps;

  /**
   * Name of the device used to generate the token.
   */
  @Property({
    columnType: 'varchar',
    comment: 'Name of the device used to generate the token.',
    length: 100,
    type: 'string',
  })
  public device!: string;

  /**
   * Token expiration date.
   */
  @Property({
    columnType: 'timestamp',
    comment: 'Token expiration date.',
    type: 'date',
  })
  public expiration!: Date;

  /**
   * Token revocation status.
   */
  @Property({
    columnType: 'bool',
    comment: 'Token revocation status.',
    type: 'boolean',
  })
  public revoked = false;

  /**
   * Type of token generated.
   */
  @Enum({
    comment: 'Type of token generated.',
    items: () => TokenType,
    type: 'enum',
  })
  public token_type!: TokenType;

  /**
   * Value of the token.
   */
  @Property({
    columnType: 'varchar',
    length: 100,
    type: 'string',
    unique: true,
  })
  public token_value!: string;

  /**
   * Relationship to the user assigned to the generated token.
   */
  @ManyToOne({
    comment: 'Relationship to the user assigned to the generated token.',
    entity: () => AuthUserEntity,
  })
  public user!: Rel<AuthUserEntity>;
}
