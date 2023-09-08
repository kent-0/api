import {
  Collection,
  Entity,
  OneToMany,
  OneToOne,
  OptionalProps,
  Property,
  Rel,
} from '@mikro-orm/core';

import { AuthEmailsEntity } from './emails.entity';
import { AuthPasswordEntity } from './passwords.entity';

import { OptionalParentProps, ParentEntity } from '../base.entity';
import { ProjectMembersEntity } from '../project/members.entity';

/**
 * Entity representing individual user profiles within the platform.
 * This encompasses the user's personal details, associated email, password, and other relevant data.
 */
@Entity({
  comment: 'Information about all users on the platform.',
  tableName: 'auth_users',
})
export class AuthUserEntity extends ParentEntity {
  /**
   * Defines the optional properties that can be set on this entity. These include
   * the user's biography, email, full name, password, and any optional properties from the parent entity.
   */
  public [OptionalProps]?:
    | 'biography'
    | 'email'
    | 'fullName'
    | 'password'
    | OptionalParentProps;

  /**
   * Brief description or biography about the user. This can provide other users
   * or systems an overview of this particular user's background or interests.
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
   * One-to-One relationship with the AuthEmailsEntity. Represents the primary
   * email address associated with this user account.
   */
  @OneToOne({
    comment: 'Relationship to the email assigned to the user.',
    entity: () => AuthEmailsEntity,
    hidden: true,
    nullable: true,
  })
  public email!: Rel<AuthEmailsEntity>;

  /**
   * The user's first name, which is a part of their full identity.
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
   * The user's last name, completing their full identity alongside the first name.
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
   * One-to-One relationship with the AuthPasswordEntity. Represents the hashed password
   * associated with this user account, ensuring secure authentication.
   */
  @OneToOne({
    comment: 'Relationship to the password assigned to the user.',
    entity: () => AuthPasswordEntity,
    hidden: true,
    nullable: true,
  })
  public password?: Rel<AuthPasswordEntity>;

  /**
   * Represents a one-to-many relationship between the user and the projects they are a member of.
   *
   * This relationship indicates that a single user can be a member of multiple projects, but each project member entity
   * represents a single membership of a user in a particular project.
   */
  @OneToMany(() => ProjectMembersEntity, (m) => m.user, {
    comment: 'Projects in which the user is a member.',
  })
  public projects = new Collection<ProjectMembersEntity>(this);

  /**
   * A unique identifier chosen by the user. This is typically used for logging in, mentioning
   * the user on the platform, or other platform-specific interactions.
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
   * A computed property that combines the user's first and last name.
   * This provides a convenient way to retrieve the user's full name without
   * having to concatenate the two individual properties every time.
   */
  @Property({ persist: false })
  public get fullName(): string {
    return `${this.first_name} ${this.last_name}`;
  }
}
