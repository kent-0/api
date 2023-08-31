import { Entity, OneToOne, Property, Rel } from '@mikro-orm/core';

import { ParentEntity } from '../base.entity';
import { UserEntity } from './user.entity';

@Entity({
  comment: 'Passwords assigned to user accounts.',
  tableName: 'auth_passwords',
})
export class PasswordEntity extends ParentEntity {
  @Property({
    columnType: 'varchar',
    comment: 'Hash resulting from the password combined with the "salt".',
    length: 100,
    unique: true,
  })
  public password_hash: string;

  @Property({
    columnType: 'varchar',
    comment: 'Salt used during the hashing process.',
    length: 50,
  })
  public salt: string;

  @OneToOne({
    comment: 'Relationship to the user assigned to the created password.',
    entity: () => UserEntity,
    onDelete: 'cascade',
  })
  public user: Rel<UserEntity>;
}
