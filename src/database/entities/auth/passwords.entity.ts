import {
  Entity,
  OneToOne,
  OptionalProps,
  Property,
  Rel,
} from '@mikro-orm/core';

import { AuthUserEntity, OptionalParentProps, ParentEntity } from '..';

/**
 * Entity representing the hashed passwords and their associated salts for user accounts.
 */
@Entity({
  comment: 'Passwords assigned to user accounts.',
  tableName: 'auth_passwords',
})
export class AuthPasswordEntity extends ParentEntity {
  /**
   * Defines the optional properties that can be set on this entity. This includes
   * any optional properties from the parent entity.
   */
  public [OptionalProps]?: OptionalParentProps;

  /**
   * The hashed version of the user's password. This hash is produced by combining
   * the user's raw password with a unique salt. Ensures the secure storage of passwords.
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
   * Unique salt used in conjunction with the user's raw password to produce the password_hash.
   * A different salt should be used for each user's password to ensure security.
   */
  @Property({
    columnType: 'varchar',
    comment: 'Salt used during the hashing process.',
    length: 50,
    type: 'string',
  })
  public salt!: string;

  /**
   * One-to-One relationship with the AuthUserEntity. Represents the user
   * to whom this password belongs. If the password is deleted, the related user
   * will also be deleted (cascade delete).
   */
  @OneToOne({
    comment: 'Relationship to the user assigned to the created password.',
    deleteRule: 'cascade',
    entity: () => AuthUserEntity,
  })
  public user!: Rel<AuthUserEntity>;
}
