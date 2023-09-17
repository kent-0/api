import { Join } from '../types/union';

/**
 * Utility function to create an array of dot-separated paths by joining a base string
 * with an array of field strings. This can be particularly useful when constructing paths
 * for deeply nested properties or database column references.
 *
 * @function createFieldPaths
 *
 * @template Base - The type parameter representing the base string.
 * @template Fields - A type parameter representing a tuple or array of strings.
 *
 * @param {Base} base - The base string that will be prefixed to each field.
 * @param {...Fields} fields - A variadic list of field strings to be suffixed to the base.
 *
 * @returns {Join<Base, (typeof fields)[number]>[]} - An array of dot-separated paths.
 *
 * @example
 * const paths = createFieldPaths('user', 'id', 'name');
 * // Returns: ['user.id', 'user.name']
 */
export const createFieldPaths = <Base extends string, Fields extends string[]>(
  base: Base,
  ...fields: Fields
): Join<Base, (typeof fields)[number]>[] =>
  fields.map((field) => `${base}.${field}` as Join<Base, typeof field>);
