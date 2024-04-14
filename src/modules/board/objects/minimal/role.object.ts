import { Field, ID, ObjectType } from '@nestjs/graphql';

import { tuple } from '~/utils/functions/tuple';

/**
 * Represents a tuple containing the minimal set of properties required
 * for a board's roles. This tuple is designed to capture the fundamental
 * attributes that characterize a role within the context of a board.
 *
 * The tuple is structured to capture:
 * - The unique identifier for the role (`id`).
 * - The name or title of the role (`name`).
 * - The specific permissions associated with the role (`permissions`).
 *
 * By defining this tuple, it provides a standardized approach to select the essential
 * fields for a board's roles across the application. This ensures consistency,
 * optimizes queries by selecting only necessary fields, and aids in reducing chances
 * of errors.
 *
 * @constant BoardRolesMinimalProperties
 *
 * @example
 * Assuming the tuple is used to generate a SQL SELECT statement:
 * The fields would be:
 * - 'id'
 * - 'name'
 * - 'permissions'
 */
export const BoardRolesMinimalProperties = tuple(
  'id',
  'name',
  'permissions_granted',
  'permissions_denied',
  'position',
);

/**
 * Represents a concise view of roles associated with a board.
 * This object type provides just the essential details of a role within the context
 * of a board, making it optimal for scenarios where exhaustive role data is unnecessary.
 *
 * For instance, in a UI where a list of roles is displayed in a dropdown or
 * a summary view, this minimalistic representation ensures that only the most
 * relevant data about the role is presented.
 */
@ObjectType({
  description:
    'Object that represents the minimum information about board roles.',
})
export class BoardRolesMinimalObject {
  /**
   * Represents the unique identifier for the role within the board.
   * This can be particularly useful when performing CRUD operations or
   * when mapping roles to users.
   */
  @Field(() => ID, { description: 'Unique identifier for the board role.' })
  public id!: string;

  /**
   * Provides a human-readable representation of the role. This is typically
   * used to display the role name in user interfaces.
   */
  @Field(() => String, { description: 'Name representing the role.' })
  public name!: string;

  /**
   * The `permissions` field represents the bit-based permission value for the role. Using bits,
   * a role can have a combination of permissions represented as a single integer. This makes it
   * easier and more efficient to manage and verify permissions.
   */
  @Field(() => Number, { description: 'Role bit-based permissions.' })
  public permissions_denied!: number;

  /**
   * The `permissions` field represents the bit-based permission value for the role. Using bits,
   * a role can have a combination of permissions represented as a single integer. This makes it
   * easier and more efficient to manage and verify permissions.
   */
  @Field(() => Number, { description: 'Role bit-based permissions.' })
  public permissions_granted!: number;

  /**
   * The `position` field represents the position of the role in the project.
   */
  @Field(() => Number, { description: 'Role position in the project.' })
  public position!: number;
}
