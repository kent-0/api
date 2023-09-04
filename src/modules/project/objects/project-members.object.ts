import { Field, ObjectType } from '@nestjs/graphql';

import { ProjectMemberObject, ProjectObject, ProjectRolesObject } from '.';

/**
 * Represents users invited to projects.
 */
@ObjectType({
  description: 'Object representing users invited to projects.',
})
export class ProjectMembersObject {
  /**
   * Project to which the user is a member.
   */
  @Field(() => ProjectObject, {
    description: 'Project to which the user is a member.',
  })
  public project!: ProjectObject;

  /**
   * User member roles in the project.
   */
  @Field(() => [ProjectRolesObject], {
    description: 'User member roles in the project.',
  })
  public roles!: ProjectRolesObject[];

  /**
   * User member of the project.
   */
  @Field(() => ProjectMemberObject, {
    description: 'User member of the project.',
  })
  public user!: ProjectMemberObject;
}
