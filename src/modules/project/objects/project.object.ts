import { Field, ID, ObjectType } from '@nestjs/graphql';

import { ProjectStatus } from '~/database/enums/status.enum';

import {
  ProjectGoalsObject,
  ProjectMembersObject,
  ProjectNotesObject,
  ProjectRolesObject,
} from '.';
import { ProjectMemberObject } from './project-member.object';

/* import { BoardObject } from './board.object'; */

/**
 * Represents projects to manage and group boards.
 */
@ObjectType({
  description: 'Object representing projects to manage and group boards.',
})
export class ProjectObject {
  /* @Field(() => [BoardObject], {
    description: 'Boards created for the project.',
  })
  public boards!: BoardObject[]; */

  /**
   * Brief description of what the project is about.
   */
  @Field({ description: 'Brief description of what the project is about.' })
  public description!: string;

  /**
   * Expected completion date for the project.
   */
  @Field({
    description: 'Expected completion date for the project.',
    nullable: true,
  })
  public end_date?: Date;

  /**
   * Goals assigned to the project.
   */
  @Field(() => [ProjectGoalsObject], {
    description: 'Goals assigned to the project.',
  })
  public goals!: ProjectGoalsObject[];

  /**
   * Unique identifier for the project.
   */
  @Field(() => ID, { description: 'Unique identifier for the project.' })
  public id!: string;

  /**
   * Users invited to the project.
   */
  @Field(() => [ProjectMembersObject], {
    description: 'Users invited to the project.',
  })
  public members!: ProjectMembersObject[];

  /**
   * Project's name.
   */
  @Field({ description: "Project's name." })
  public name!: string;

  /**
   * Notes assigned to the project.
   */
  @Field(() => [ProjectNotesObject], {
    description: 'Notes assigned to the project.',
  })
  public notes!: ProjectNotesObject[];

  /**
   * Project owner user.
   */
  @Field(() => ProjectMemberObject, { description: 'Project owner user.' })
  public owner!: ProjectMemberObject;

  /**
   * Roles to manage the project and boards.
   */
  @Field(() => [ProjectRolesObject], {
    description: 'Roles to manage the project and boards.',
  })
  public roles!: ProjectRolesObject[];

  /**
   * Project start date.
   */
  @Field({ description: 'Project start date.', nullable: true })
  public start_date?: Date;

  /**
   * Current status of the project.
   */
  @Field(() => ProjectStatus, { description: 'Current status of the project.' })
  public status!: ProjectStatus;
}
