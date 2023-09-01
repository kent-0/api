import {
  Entity,
  OneToOne,
  OptionalProps,
  Property,
  Rel,
} from '@mikro-orm/core';

import { AuthPasswordEntity } from './passwords.entity';

import { OptionalParentProps, ParentEntity } from '../base.entity';

@Entity({
  comment: 'Information about all users on the platform.',
  tableName: 'auth_users',
})
export class AuthUserEntity extends ParentEntity {
  public [OptionalProps]?: 'fullName' | 'password' | OptionalParentProps;

  @Property({
    check: "email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+[A-Za-z]{2,}$'",
    columnType: 'varchar',
    comment: 'Unique email per user.',
    length: 100,
    unique: true,
  })
  public email!: string;

  @Property({
    columnType: 'varchar',
    comment: 'First name of the user.',
    hidden: true,
    length: 30,
  })
  public first_name!: string;

  @Property({
    columnType: 'varchar',
    comment: 'Last name of the user.',
    hidden: true,
    length: 30,
  })
  public last_name!: string;

  @OneToOne({
    comment: 'Relationship to the user assigned to the created password.',
    entity: () => AuthPasswordEntity,
    hidden: true,
    nullable: true,
  })
  public password?: Rel<AuthPasswordEntity>;

  @Property({
    check: "username ~ '^[A-Za-z0-9_-]+$'",
    columnType: 'varchar',
    comment: 'Unique user name per user.',
    length: 30,
    unique: true,
  })
  public username!: string;

  @Property({ persist: false })
  public get fullName(): string {
    return `${this.first_name} ${this.last_name}`;
  }
}
