import { Field, ID, ObjectType } from '@nestjs/graphql';

import { ProjectMemberObject, ProjectObject, ProjectRolesObject } from '.';

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
  description: 'Object representing users invited to projects.',
})
export class ProjectMembersObject {
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
   * The `project` field provides a reference to the project in which the
   * user is a member. This link is essential for understanding the context
   * of the user's membership and for operations that involve the project's
   * details.
   */
  @Field(() => ProjectObject, {
    description: 'Project to which the user is a member.',
  })
  public project!: ProjectObject;

  /**
   * A member can have multiple roles within a project. The `roles` field
   * captures all the roles assigned to the member, providing a comprehensive
   * view of their responsibilities and permissions within the project.
   */
  @Field(() => [ProjectRolesObject], {
    description: 'User member roles in the project.',
  })
  public roles!: ProjectRolesObject[];

  /**
   * The `user` field provides detailed information about the member in the
   * context of the project. This includes their personal details and
   * identifiers, facilitating user-specific operations or UI representations.
   */
  @Field(() => ProjectMemberObject, {
    description: 'User member of the project.',
  })
  public user!: ProjectMemberObject;
}
