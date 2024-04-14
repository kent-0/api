import { BaseEntity, Entity, PrimaryKey, Property } from '@mikro-orm/core';

/**
 * Represents a set of properties that are commonly found in the base entity.
 *
 * Entities in the system typically inherit from a base entity. This base entity
 * often includes a set of standard properties like `createdAt`, `updatedAt`, etc.
 * There might be scenarios where we want to make these properties optional when extending
 * or interacting with derived entities. The `OptionalParentProps` type is specifically
 * created for this purpose, allowing these common properties to be marked as optional
 * in derived entities or in certain operations.
 *
 * @type {OptionalParentProps}
 *
 * @property {string} 'createdAt' - Represents the date and time when the entity was created.
 * @property {string} 'id' - The unique identifier of the entity.
 * @property {string} 'updatedAt' - Represents the last date and time when the entity was updated.
 * @property {string} 'version' - Indicates the version of the entity, useful for concurrency control.
 */
export type OptionalParentProps = 'createdAt' | 'id' | 'updatedAt' | 'version';

/**
 * Represents a base entity that provides foundational properties and configurations for other entities.
 * This is an abstract class, and serves as a parent for all other entities in the system.
 * It includes common properties like ID, creation and update timestamps, and a version for optimistic locking.
 */
@Entity({ abstract: true, comment: 'Default configuration of all entities.' })
export abstract class ParentEntity extends BaseEntity {
  /**
   * Timestamp indicating when the entity was first created in the database.
   * Automatically set to the current date and time when the entity is instantiated.
   */
  @Property({
    columnType: 'timestamp',
    comment: 'Date when the row was created.',
    type: 'date',
  })
  public createdAt = new Date();

  /**
   * A unique identifier (UUID v4) for the entity.
   * This ID is auto-generated using the uuid-ossp extension from PostgreSQL.
   * @link https://www.postgresql.org/docs/current/uuid-ossp.html
   */
  @PrimaryKey({
    comment: 'UUID v4 unique to the row.',
    defaultRaw: 'uuid_generate_v4()',
    type: 'uuid',
  })
  public id!: string;

  /**
   * Timestamp indicating the last time the entity was updated in the database.
   * Automatically updated to the current date and time whenever the entity is modified.
   */
  @Property({
    columnType: 'timestamp',
    comment: 'Date when the row was last updated.',
    onUpdate: () => new Date(),
    type: 'date',
  })
  public updatedAt = new Date();

  /**
   * Version number for the entity, used for optimistic locking.
   * This helps to ensure that changes are not overwritten by concurrent transactions.
   * The version is automatically incremented each time the entity is updated.
   */
  @Property({ comment: 'Optimistic Locking transactions.', version: true })
  public version!: number;
}
