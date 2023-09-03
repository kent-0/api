import {
  Entity,
  OneToOne,
  OptionalProps,
  Property,
  Rel,
} from '@mikro-orm/core';

import { AuthEmailsEntity } from './emails.entity';
import { AuthPasswordEntity } from './passwords.entity';

import { OptionalParentProps, ParentEntity } from '../base.entity';

/**
 * Entity containing information about all users on the platform.
 */
@Entity({
  comment: 'Information about all users on the platform.',
  tableName: 'auth_users',
})
export class AuthUserEntity extends ParentEntity {
  /**
   * Optional properties that can be set on the entity.
   */
  public [OptionalProps]?:
    | 'biography'
    | 'email'
    | 'fullName'
    | 'password'
    | OptionalParentProps;

  /**
   * Biography of the user account.
   */
  @Property({
    columnType: 'varchar',
    comment: 'Biography of the user account.',
    length: 300,
    nullable: true,
    type: 'string',
  })
  public biography!: string;

  /**
   * Relationship to the email assigned to the user.
   */
  @OneToOne({
    comment: 'Relationship to the email assigned to the user.',
    entity: () => AuthEmailsEntity,
    hidden: true,
    nullable: true,
  })
  public email!: Rel<AuthEmailsEntity>;

  /**
   * First name of the user.
   */
  @Property({
    columnType: 'varchar',
    comment: 'First name of the user.',
    hidden: true,
    length: 30,
    type: 'string',
  })
  public first_name!: string;

  /**
   * Last name of the user.
   */
  @Property({
    columnType: 'varchar',
    comment: 'Last name of the user.',
    hidden: true,
    length: 30,
    type: 'string',
  })
  public last_name!: string;

  /**
   * Relationship to the password assigned to the user.
   */
  @OneToOne({
    comment: 'Relationship to the password assigned to the user.',
    entity: () => AuthPasswordEntity,
    hidden: true,
    nullable: true,
  })
  public password?: Rel<AuthPasswordEntity>;

  /**
   * Unique username per user.
   */
  @Property({
    check: "username ~* '^[A-Za-z0-9_-]+$'",
    columnType: 'varchar',
    comment: 'Unique username per user.',
    length: 30,
    type: 'string',
    unique: true,
  })
  public username!: string;

  /**
   * Virtual property to get the full name of the user.
   */
  @Property({ persist: false })
  public get fullName(): string {
    return `${this.first_name} ${this.last_name}`;
  }
}
