import { BaseEntity, Entity, PrimaryKey, Property } from '@mikro-orm/core';

export type OptionalParentProps = 'createdAt' | 'id' | 'updatedAt' | 'version';

/**
 * Abstract entity representing the default configuration of all entities.
 */
@Entity({ abstract: true, comment: 'Default configuration of all entities.' })
export abstract class ParentEntity extends BaseEntity<ParentEntity, 'id'> {
  /**
   * Date when the row was created.
   */
  @Property({
    columnType: 'timestamp',
    comment: 'Date when the row was created.',
    type: 'date',
  })
  public createdAt = new Date();

  /**
   * UUID v4 unique to the row.
   * Required postgres extension uuid-ossp.
   * @see https://www.postgresql.org/docs/current/uuid-ossp.html
   */
  @PrimaryKey({
    comment: 'UUID v4 unique to the row.',
    defaultRaw: 'uuid_generate_v4()',
    type: 'uuid',
  })
  public id!: string;

  /**
   * Date when the row was last updated.
   */
  @Property({
    columnType: 'timestamp',
    comment: 'Date when the row was last updated.',
    onUpdate: () => new Date(),
    type: 'date',
  })
  public updatedAt = new Date();

  /**
   * Optimistic Locking transactions.
   */
  @Property({ comment: 'Optimistic Locking transactions.', version: true })
  public version!: number;
}
