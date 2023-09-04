import { Field, ID, ObjectType } from '@nestjs/graphql';

import { ProjectMemberObject, ProjectObject, ProjectRolesObject } from '.';

/**
 * Represents users invited to projects.
 */
@ObjectType({
  description: 'Object representing users invited to projects.',
})
export class ProjectMembersObject {
  /**
   * Member ID inside the project
   */
  @Field(() => ID, {
    description: 'Member ID inside the project',
  })
  public id!: string;

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
