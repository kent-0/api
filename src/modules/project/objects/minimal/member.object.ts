import { Field, ID, ObjectType } from '@nestjs/graphql';

import {
  AuthUserMinimalObject,
  AuthUserMinimalProperties,
} from '~/modules/auth/objects';
import { createFieldPaths } from '~/utils/functions/create-fields-path';
import { tuple } from '~/utils/functions/tuple';

import {
  ProjectRoleMinimalObject,
  ProjectRolesMinimalProperties,
} from './role.object';

/**
 * Represents a tuple containing the minimal set of properties required
 * for members associated with a project. This includes the direct properties
 * of the project member as well as the fields related to the roles the member
 * has and the user details.
 *
 * The tuple is structured to capture:
 * - The unique identifier for the project member (`id`).
 * - The associated properties of the roles (`roles`) assigned to the project member.
 *   This is achieved using the `createFieldPaths` function, which combines the
 *   base entity ('roles' in this case) with its minimal properties
 *   (from `ProjectRolesMinimalProperties`).
 * - The associated properties of the user (`user`) which represents the project member.
 *   This is achieved using the `createFieldPaths` function, which combines the
 *   base entity ('user' in this case) with its minimal properties
 *   (from `AuthUserMinimalProperties`).
 *
 * By defining this tuple, it provides a standardized approach to select the essential
 * fields for a project's members across the application. This ensures consistency,
 * optimizes queries by selecting only necessary fields, and aids in reducing chances
 * of errors.
 *
 * @constant ProjectMembersMinimalProperties
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
export const ProjectMembersMinimalProperties = tuple(
  'id',
  ...createFieldPaths('roles', ...ProjectRolesMinimalProperties),
  ...createFieldPaths('user', ...AuthUserMinimalProperties),
);

/**
 * The `ProjectMembersObject` class defines a structured representation of
 * a user's membership within a project. Within a project management system,
 * users can be invited to join projects, and this class captures details
 * about their membership, including their roles and relationship with the
 * project.
 *
 * This class serves as a blueprint for how membership data is presented
 * and interacted with in a GraphQL API, ensuring consistent and meaningful
 * data interactions.
 */
@ObjectType({
  description:
    'Object representing the minimal users invited data to projects.',
})
export class ProjectMemberMinimalObject {
  /**
   * The unique identifier for a member within a specific project. This
   * ID is crucial for operations like updating membership details,
   * assigning roles, or referencing them in relational data structures
   * within the project context.
   */
  @Field(() => ID, {
    description: 'Member ID inside the project',
  })
  public id!: string;

  /**
   * A member can have multiple roles within a project. The `roles` field
   * captures all the roles assigned to the member, providing a comprehensive
   * view of their responsibilities and permissions within the project.
   */
  @Field(() => [ProjectRoleMinimalObject], {
    description: 'User member roles in the project.',
  })
  public roles!: ProjectRoleMinimalObject[];

  /**
   * The `user` field provides detailed information about the member in the
   * context of the project. This includes their personal details and
   * identifiers, facilitating user-specific operations or UI representations.
   */
  @Field(() => AuthUserMinimalObject, {
    description: 'User member of the project.',
  })
  public user!: AuthUserMinimalObject;
}
