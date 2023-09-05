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
 * The `ProjectObject` class serves as a foundational blueprint for representing projects within the application.
 * Projects, in many applications, are a way to organize and manage a collection of tasks, goals, and boards.
 * They are especially prevalent in project management tools, where each project can have different boards (like Kanban),
 * distinct goals, various members, and associated roles. Furthermore, projects can have notes, descriptions, and
 * specific timelines associated with them.
 */
@ObjectType({
  description: 'Object representing projects to manage and group boards.',
})
export class ProjectObject {
  /**
   * The `description` field provides a brief summary of the project. This allows users and stakeholders
   * to quickly understand the purpose and scope of the project.
   */
  @Field({ description: 'Brief description of what the project is about.' })
  public description!: string;

  /**
   * The `end_date` field signifies the expected completion date for the project. This provides a target
   * for teams and ensures that there's a clear understanding of project timelines.
   */
  @Field({
    description: 'Expected completion date for the project.',
    nullable: true,
  })
  public end_date?: Date;

  /**
   * The `goals` field represents the objectives or targets that the project aims to achieve. These goals
   * can be milestones, deliverables, or any other significant achievements.
   */
  @Field(() => [ProjectGoalsObject], {
    description: 'Goals assigned to the project.',
  })
  public goals!: ProjectGoalsObject[];

  /**
   * The `id` field is a unique identifier for each project. This is essential for differentiating between
   * projects and for operations like updating, deleting, or querying specific projects.
   */
  @Field(() => ID, { description: 'Unique identifier for the project.' })
  public id!: string;

  /**
   * The `members` field lists all the users who are part of the project. This includes everyone from
   * team members to stakeholders, each potentially having different roles and permissions.
   */
  @Field(() => [ProjectMembersObject], {
    description: 'Users invited to the project.',
  })
  public members!: ProjectMembersObject[];

  /**
   * The `name` field provides the title or name of the project, allowing users to quickly identify and refer to it.
   */
  @Field({ description: "Project's name." })
  public name!: string;

  /**
   * The `notes` field represents any additional information, thoughts, or remarks associated with the project.
   * This is especially useful for capturing insights, decisions, or any other significant data points.
   */
  @Field(() => [ProjectNotesObject], {
    description: 'Notes assigned to the project.',
  })
  public notes!: ProjectNotesObject[];

  /**
   * The `owner` field specifies the user who created or owns the project. This is crucial for
   * determining accountability and for certain permission-related operations.
   */
  @Field(() => ProjectMemberObject, { description: 'Project owner user.' })
  public owner!: ProjectMemberObject;

  /**
   * The `roles` field lists all the roles available within the project. These roles define what actions members
   * can perform within the project and what permissions they have.
   */
  @Field(() => [ProjectRolesObject], {
    description: 'Roles to manage the project and boards.',
  })
  public roles!: ProjectRolesObject[];

  /**
   * The `start_date` field signifies when the project was initiated or started. This is helpful for tracking
   * the duration and progress of the project.
   */
  @Field({ description: 'Project start date.', nullable: true })
  public start_date?: Date;

  /**
   * The `status` field provides the current state of the project. This could be values like 'In Progress',
   * 'Completed', 'On Hold', etc., giving a quick overview of where the project stands.
   */
  @Field(() => ProjectStatus, { description: 'Current status of the project.' })
  public status!: ProjectStatus;
}
