import { Entity, OneToOne, Property, Rel } from '@mikro-orm/core';

import { AuthUserEntity } from './user.entity';

@Entity({
  comment: 'Status of emails linked to user accounts.',
  tableName: 'auth_emails',
})
export class AuthEmails {
  @Property({
    comment: 'Mail confirmation token.',
    defaultRaw: 'substr(md5(random()::text), 0, 10)',
    nullable: true,
  })
  public activation_token!: string;

  @Property({
    comment: 'Mail status confirmed or not.',
    type: 'bool',
  })
  public is_confirmed = false;

  @OneToOne({
    comment: 'Relationship to the user assigned to the created email.',
    entity: () => AuthUserEntity,
    onDelete: 'cascade',
  })
  public user!: Rel<AuthUserEntity>;

  @Property({
    check: "email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+[A-Za-z]{2,}$'",
    columnType: 'varchar',
    comment: 'Unique email per user.',
    length: 100,
    type: 'string',
    unique: true,
  })
  public value!: string;
}