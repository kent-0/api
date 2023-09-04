import { Field, ID, ObjectType } from '@nestjs/graphql';

import { ProjectMembersObject } from './project-members.object';
// eslint-disable-next-line perfectionist/sort-imports
import { ProjectObject } from './project.object';

/**
 * Represents roles to manage the projects using a bit-based permission system.
 */
@ObjectType({
  description:
    'Entity representing roles to manage the projects using bit-based permission system.',
})
export class ProjectRolesObject {
  /**
   * Unique identifier for the project role.
   */
  @Field(() => ID, { description: 'Unique identifier for the project role.' })
  public id!: string;

  /**
   * Project members who have this role.
   */
  @Field(() => [ProjectMembersObject], {
    description: 'Project members who have this role.',
  })
  public members!: ProjectMembersObject[];

  /**
   * Name representing the role.
   */
  @Field(() => String, { description: 'Name representing the role.' })
  public name!: string;

  /**
   * Role bit-based permissions.
   */
  @Field(() => Number, { description: 'Role bit-based permissions.' })
  public permissions!: number;

  /**
   * Project assigned to the role.
   */
  @Field(() => ProjectObject, { description: 'Project assigned to the role.' })
  public project!: ProjectObject;
}
