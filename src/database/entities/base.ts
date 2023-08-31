import { BaseEntity, Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ abstract: true, comment: 'Default configuration of all entities.' })
export abstract class ParentEntity extends BaseEntity<ParentEntity, 'uuid'> {
  @Property({
    columnType: 'date',
    comment: 'Date when the row was created.',
    type: 'date',
  })
  public createdAt = new Date();

  @Property({
    columnType: 'date',
    comment: 'Date when the row was last updated.',
    onUpdate: () => new Date(),
    type: 'date',
  })
  public updatedAt = new Date();

  @PrimaryKey({
    columnType: 'text',
    comment: 'UUID v4 unique to the row.',
    defaultRaw: 'uuid_generate_v4()',
    type: 'uuid',
  })
  public uuid: number;

  @Property({ comment: 'Optimistic Locking transactions.', version: true })
  public version: number;
}
