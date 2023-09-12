import { Field, ID, ObjectType } from '@nestjs/graphql';

import { AuthUserMinimalObject } from '~/modules/auth/objects';

import { ProjectRolesMinimalObject } from '.';

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
export class ProjectMembersMinimalObject {
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
  @Field(() => [ProjectRolesMinimalObject], {
    description: 'User member roles in the project.',
  })
  public roles!: ProjectRolesMinimalObject[];

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
