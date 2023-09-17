import { Field, ID, ObjectType } from '@nestjs/graphql';

import { tuple } from '~/utils/functions/tuple';

/**
 * Represents a tuple containing the minimal set of properties required
 * for roles associated with a project. This tuple focuses on capturing
 * the most essential details that define a role within a project's context.
 *
 * The tuple is structured to capture:
 * - The unique identifier for the role (`id`).
 * - The name representing the role (`name`).
 * - The permissions associated with the role, typically represented
 *   as bit-based values (`permissions`).
 *
 * By defining this tuple, it provides a standardized approach to select the essential
 * fields for a project's roles across the application. This ensures consistency,
 * optimizes queries by selecting only necessary fields, and aids in reducing chances
 * of errors.
 *
 * @constant ProjectRolesMinimalProperties
 *
 * @example
 * Assuming the tuple is used to generate a SQL SELECT statement:
 * The fields would be:
 * - 'id'
 * - 'name'
 * - 'permissions'
 */
export const ProjectRolesMinimalProperties = tuple('id', 'name', 'permissions');

/**
 * The `ProjectRolesObject` class serves as a blueprint for defining roles within a project management system.
 * In many applications, especially in project management platforms, roles are fundamental for access control,
 * where different roles can perform different tasks based on their set permissions.
 *
 * This particular implementation utilizes a bit-based permission system, which provides an efficient way
 * to store and manage permissions. Using bits, each role can have a combination of permissions represented
 * as a single integer, making it easy to perform operations like checking, granting, or revoking permissions.
 */
@ObjectType({
  description:
    'Object that represents the minimum information about board roles.',
})
export class ProjectRoleMinimalObject {
  /**
   * The `id` field represents a unique identifier for each role within the system.
   * This ensures that each role can be distinctively identified, especially during operations
   * like assignment, modification, or deletion.
   */
  @Field(() => ID, { description: 'Unique identifier for the project role.' })
  public id!: string;

  /**
   * The `name` field provides a human-readable representation of the role. This is typically
   * used for display purposes and for users to understand the purpose of a given role.
   */
  @Field(() => String, { description: 'Name representing the role.' })
  public name!: string;

  /**
   * The `permissions` field represents the bit-based permission value for the role. Using bits,
   * a role can have a combination of permissions represented as a single integer. This makes it
   * easier and more efficient to manage and verify permissions.
   */
  @Field(() => Number, { description: 'Role bit-based permissions.' })
  public permissions!: number;
}
