import { Field, ObjectType } from '@nestjs/graphql';

import { ProjectMemberMinimalObject } from './minimal/member.object';
import { ProjectMinimalObject } from './minimal/project.object';

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
export class ProjectMemberObject extends ProjectMemberMinimalObject {
  /**
   * The `project` field provides a reference to the project in which the
   * user is a member. This link is essential for understanding the context
   * of the user's membership and for operations that involve the project's
   * details.
   */
  @Field(() => ProjectMinimalObject, {
    description: 'Project to which the user is a member.',
  })
  public project!: ProjectMinimalObject;
}
