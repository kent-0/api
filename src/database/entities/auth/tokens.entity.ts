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

@Entity({
  comment: 'Access and refresh tokens created in user sessions.',
  tableName: 'auth_tokens',
})
export class AuthTokensEntity extends ParentEntity {
  public [OptionalProps]?: OptionalParentProps;

  @Property({
    columnType: 'varchar',
    comment: 'Name of the device used to generate the token.',
    length: 100,
  })
  public device!: string;

  @Property({
    columnType: 'timestamp',
    comment: 'Token expiration date.',
    type: 'date',
  })
  public expiration!: Date;

  @Property({
    columnType: 'bool',
    comment: 'Token revocation status.',
    type: 'boolean',
  })
  public revoked = false;

  @Enum({ comment: 'Type of token generated.', items: () => TokenType })
  public token_type!: TokenType;

  @Property({
    columnType: 'varchar',
    length: 100,
    type: 'string',
    unique: true,
  })
  public token_value!: string;

  @ManyToOne({
    comment: 'Relationship to the user assigned to the generated token.',
    entity: () => AuthUserEntity,
  })
  public user!: Rel<AuthUserEntity>;
}
