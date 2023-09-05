import { Collection } from '@mikro-orm/core';

/**
 * ToCollections Type
 *
 * This type transforms properties of a given type T. It traverses the properties
 * of T and transforms arrays into MikroORM Collection instances, while
 * recursively transforming nested objects as well.
 *
 * Usage:
 * This type is typically used to transform properties of entities when using
 * MikroORM to work with databases. It helps convert arrays into Collection
 * instances that can be used for querying and manipulating data.
 */
export type ToCollections<T> = {
  /**
   * Transform each property in T according to its type.
   *
   * - If the property is an array, it is transformed into a Collection.
   * - If the property is an object, it is recursively transformed.
   * - If the property is neither an array nor an object, it remains unchanged.
   */
  [K in keyof T]: T[K] extends Array<unknown>
    ? Collection<any, any> // Transform array into MikroORM Collection
    : T[K] extends object
    ? ToCollections<T[K]> // Recursively transform nested object
    : T[K]; // Keep other types unchanged
};
