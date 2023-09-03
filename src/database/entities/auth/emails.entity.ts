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
 * Entity representing the status of emails linked to user accounts.
 */
@Entity({
  comment: 'Status of emails linked to user accounts.',
  tableName: 'auth_emails',
})
export class AuthEmailsEntity extends ParentEntity {
  /**
   * Optional properties that can be set on the entity.
   */
  public [OptionalProps]?:
    | 'activation_token'
    | 'is_confirmed'
    | OptionalParentProps;

  /**
   * Token used for mail confirmation.
   */
  @Property({
    comment: 'Mail confirmation token.',
    defaultRaw: 'substr(md5(random()::text), 0, 10)',
    hidden: true,
    nullable: true,
  })
  public activation_token!: string;

  /**
   * Indicates whether the email is confirmed or not.
   */
  @Property({
    comment: 'Mail status confirmed or not.',
    type: 'bool',
  })
  public is_confirmed = false;

  /**
   * Relationship to the user assigned to the created email.
   */
  @OneToOne({
    comment: 'Relationship to the user assigned to the created email.',
    entity: () => AuthUserEntity,
    onDelete: 'cascade',
  })
  public user!: Rel<AuthUserEntity>;

  /**
   * Unique email per user.
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
