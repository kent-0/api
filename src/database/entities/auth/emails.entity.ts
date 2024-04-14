import {
  Entity,
  OneToOne,
  OptionalProps,
  Property,
  Rel,
} from '@mikro-orm/core';

import {
  AuthUserEntity,
  type OptionalParentProps,
  ParentEntity,
} from '~/database/entities';

/**
 * Entity representing the status of emails linked to user accounts.
 */
@Entity({
  comment: 'Status of emails linked to user accounts.',
  tableName: 'auth_emails',
})
export class AuthEmailsEntity extends ParentEntity {
  /**
   * Defines the optional properties that can be set on this entity. This includes
   * the activation token, the confirmation status, and any optional properties
   * from the parent entity.
   */
  public [OptionalProps]?:
    | 'activation_token'
    | 'is_confirmed'
    | OptionalParentProps;

  /**
   * Token generated and used to confirm the email address. This token is
   * hidden by default and can be nullable.
   */
  @Property({
    comment: 'Mail confirmation token.',
    defaultRaw: 'substr(md5(random()::text), 0, 10)',
    hidden: true,
    nullable: true,
  })
  public activation_token!: string;

  /**
   * Boolean property that indicates if the email has been confirmed.
   * By default, an email is not confirmed.
   */
  @Property({
    comment: 'Mail status confirmed or not.',
    type: 'bool',
  })
  public is_confirmed = false;

  /**
   * One-to-One relationship with the AuthUserEntity. Represents the user
   * to whom this email belongs. If the email is deleted, the related user
   * will also be deleted (cascade delete).
   */
  @OneToOne({
    comment: 'Relationship to the user assigned to the created email.',
    deleteRule: 'cascade',
    entity: () => AuthUserEntity,
  })
  public user!: Rel<AuthUserEntity>;

  /**
   * Represents the email address of the user. This email is unique across
   * all users and must match a specified email pattern.
   */
  @Property({
    check: "value ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+[A-Za-z]{2,}$'",
    columnType: 'varchar',
    comment: 'Unique email per user.',
    length: 100,
    type: 'string',
    unique: true,
  })
  public value!: string;
}
