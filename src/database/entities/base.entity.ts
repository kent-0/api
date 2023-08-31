import { BaseEntity, Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ abstract: true, comment: 'Default configuration of all entities.' })
export abstract class ParentEntity extends BaseEntity<ParentEntity, 'id'> {
  @Property({
    columnType: 'timestamp',
    comment: 'Date when the row was created.',
    type: 'date',
  })
  public createdAt = new Date();

  /**
   * Required postgres extension
   * uuid-ossp
   * @see https://www.postgresql.org/docs/current/uuid-ossp.html
   */
  @PrimaryKey({
    comment: 'UUID v4 unique to the row.',
    defaultRaw: 'uuid_generate_v4()',
    type: 'uuid',
  })
  public id: number;

  @Property({
    columnType: 'timestamp',
    comment: 'Date when the row was last updated.',
    onUpdate: () => new Date(),
    type: 'date',
  })
  public updatedAt = new Date();

  @Property({ comment: 'Optimistic Locking transactions.', version: true })
  public version: number;
}
