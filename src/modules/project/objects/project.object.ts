import { Field, ObjectType } from '@nestjs/graphql';

import { ProjectStatus } from '~/database/enums/status.enum';

import {
  ProjectGoalsMinimalObject,
  ProjectMembersMinimalObject,
  ProjectRolesMinimalObject,
} from '.';
import { ProjectMinimalNotesObject } from './notes-minimal.object';
import { ProjectMinimalObject } from './project-minimal.object';

/**
 * The `ProjectObject` class serves as a foundational blueprint for representing projects within the application.
 * Projects, in many applications, are a way to organize and manage a collection of tasks, goals, and boards.
 * They are especially prevalent in project management tools, where each project can have different boards (like Kanban),
 * distinct goals, various members, and associated roles. Furthermore, projects can have notes, descriptions, and
 * specific timelines associated with them.
 */
@ObjectType({
  description: 'Object that represents the complete data of a project.',
})
export class ProjectObject extends ProjectMinimalObject {
  /**
   * The `goals` field represents the objectives or targets that the project aims to achieve. These goals
   * can be milestones, deliverables, or any other significant achievements.
   */
  @Field(() => [ProjectGoalsMinimalObject], {
    description: 'Goals assigned to the project.',
  })
  public goals!: ProjectGoalsMinimalObject[];

  /**
   * The `members` field lists all the users who are part of the project. This includes everyone from
   * team members to stakeholders, each potentially having different roles and permissions.
   */
  @Field(() => [ProjectMembersMinimalObject], {
    description: 'Users invited to the project.',
  })
  public members!: ProjectMembersMinimalObject[];

  /**
   * The `notes` field represents any additional information, thoughts, or remarks associated with the project.
   * This is especially useful for capturing insights, decisions, or any other significant data points.
   */
  @Field(() => [ProjectMinimalNotesObject], {
    description: 'Notes assigned to the project.',
  })
  public notes!: ProjectMinimalNotesObject[];

  /**
   * The `roles` field lists all the roles available within the project. These roles define what actions members
   * can perform within the project and what permissions they have.
   */
  @Field(() => [ProjectRolesMinimalObject], {
    description: 'Roles to manage the project and boards.',
  })
  public roles!: ProjectRolesMinimalObject[];

  /**
   * The `status` field provides the current state of the project. This could be values like 'In Progress',
   * 'Completed', 'On Hold', etc., giving a quick overview of where the project stands.
   */
  @Field(() => ProjectStatus, { description: 'Current status of the project.' })
  public status!: ProjectStatus;
}
