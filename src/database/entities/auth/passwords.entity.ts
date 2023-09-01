import {
  Entity,
  OneToOne,
  OptionalProps,
  Property,
  Rel,
} from '@mikro-orm/core';

import { AuthUserEntity } from './user.entity';

import { OptionalParentProps, ParentEntity } from '../base.entity';

@Entity({
  comment: 'Passwords assigned to user accounts.',
  tableName: 'auth_passwords',
})
export class AuthPasswordEntity extends ParentEntity {
  public [OptionalProps]?: OptionalParentProps;

  @Property({
    columnType: 'varchar',
    comment: 'Hash resulting from the password combined with the "salt".',
    length: 100,
    unique: true,
  })
  public password_hash!: string;

  @Property({
    columnType: 'varchar',
    comment: 'Salt used during the hashing process.',
    length: 50,
  })
  public salt!: string;

  @OneToOne({
    comment: 'Relationship to the user assigned to the created password.',
    entity: () => AuthUserEntity,
    onDelete: 'cascade',
  })
  public user!: Rel<AuthUserEntity>;
}
