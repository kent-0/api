import { Field, ID, ObjectType } from '@nestjs/graphql';

import {
  AuthUserMinimalObject,
  AuthUserMinimalProperties,
} from '~/modules/auth/objects';
import { createFieldPaths } from '~/utils/functions/create-fields-path';
import { tuple } from '~/utils/functions/tuple';

import {
  BoardRolesMinimalObject,
  BoardRolesMinimalProperties,
} from './role.object';

/**
 * Represents a tuple containing the minimal set of properties required
 * for a board's members. This tuple is designed to not only capture the
 * direct properties of a board member but also the attributes related
 * to their roles and user details.
 *
 * The tuple is structured to capture:
 * - The unique identifier for the board member (`id`).
 * - The associated properties of the roles (`roles`) assigned to the board member.
 *   This is achieved using the `createFieldPaths` function, which combines the
 *   base entity ('roles' in this case) with its minimal properties
 *   (from `BoardRolesMinimalProperties`).
 * - The associated properties of the user (`user`) who is the member of the board.
 *   Again, this is achieved using the `createFieldPaths` function combined with
 *   `AuthUserMinimalProperties`.
 *
 * By defining this tuple, it provides a standardized approach to select the essential
 * fields for a board's members across the application. This ensures consistency,
 * optimizes queries by selecting only necessary fields, and aids in reducing chances
 * of errors.
 *
 * @constant BoardMembersMinimalProperties
 *
 * @example
 * Assuming the tuple is used to generate a SQL SELECT statement:
 * The fields would be:
 * - 'id'
 * - 'roles.id'
 * - 'roles.name'
 * - 'roles.permissions'
 * - 'user.id'
 * - 'user.first_name'
 * - 'user.last_name'
 * - 'user.username'
 */
export const BoardMembersMinimalProperties = tuple(
  'id',
  ...createFieldPaths('roles', BoardRolesMinimalProperties),
  ...createFieldPaths('user', AuthUserMinimalProperties),
);

/**
 * Represents a minimalistic view of members associated with a board.
 * This object type is optimized for scenarios where only essential member details
 * are needed, such as listing members without overwhelming the client with excessive data.
 * Each board member will have an ID, a list of roles, and a minimal user profile.
 */
@ObjectType({
  description: 'Object representing the minimal users invited data to boards.',
})
export class BoardMembersMinimalObject {
  /**
   * A unique identifier for the member within the context of the board.
   * This ID helps differentiate members, especially in scenarios where actions
   * need to be performed on individual members, such as updating roles or removing members.
   *
   * @type {string}
   * @required
   */
  @Field(() => ID, {
    description: 'Member ID inside the board',
  })
  public id!: string;

  /**
   * A list of roles associated with the board member. Each role provides
   * specific permissions that dictate what actions the member can perform within the board.
   * This list can be used to display role assignments and make decisions on permission checks.
   *
   * @type {BoardRolesMinimalObject[]}
   * @required
   */
  @Field(() => [BoardRolesMinimalObject], {
    description: 'User member roles in the board.',
  })
  public roles!: BoardRolesMinimalObject[];

  /**
   * A minimalistic view of the user's profile associated with the board member.
   * This includes core identification details but omits in-depth profile data.
   * Useful for displaying member names or avatars without fetching full user profiles.
   *
   * @type {AuthUserMinimalObject}
   * @required
   */
  @Field(() => AuthUserMinimalObject, {
    description: 'User member of the board.',
  })
  public user!: AuthUserMinimalObject;
}
