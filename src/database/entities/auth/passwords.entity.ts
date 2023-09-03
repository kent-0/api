import {
  Entity,
  OneToOne,
  OptionalProps,
  Property,
  Rel,
} from '@mikro-orm/core';

import { AuthUserEntity } from './user.entity';

import { OptionalParentProps, ParentEntity } from '../base.entity';

/**
 * Entity representing passwords assigned to user accounts.
 */
@Entity({
  comment: 'Passwords assigned to user accounts.',
  tableName: 'auth_passwords',
})
export class AuthPasswordEntity extends ParentEntity {
  /**
   * Optional properties that can be set on the entity.
   */
  public [OptionalProps]?: OptionalParentProps;

  /**
   * Hash resulting from the password combined with the "salt".
   */
  @Property({
    columnType: 'varchar',
    comment: 'Hash resulting from the password combined with the "salt".',
    length: 100,
    type: 'string',
    unique: true,
  })
  public password_hash!: string;

  /**
   * Salt used during the hashing process.
   */
  @Property({
    columnType: 'varchar',
    comment: 'Salt used during the hashing process.',
    length: 50,
    type: 'string',
  })
  public salt!: string;

  /**
   * Relationship to the user assigned to the created password.
   */
  @OneToOne({
    comment: 'Relationship to the user assigned to the created password.',
    entity: () => AuthUserEntity,
    onDelete: 'cascade',
  })
  public user!: Rel<AuthUserEntity>;
}
