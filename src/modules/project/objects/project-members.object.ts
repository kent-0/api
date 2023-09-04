import { Field, ObjectType } from '@nestjs/graphql';

import { AuthUserObject } from '~/modules/auth/objects/user.object';

import { ProjectObject, ProjectRolesObject } from '.';

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
  @Field(() => AuthUserObject, { description: 'User member of the project.' })
  public user!: AuthUserObject;
}
