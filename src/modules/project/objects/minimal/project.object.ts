import { Field, ID, ObjectType } from '@nestjs/graphql';

import { AuthUserMinimalObject } from '~/modules/auth/objects';

/* import { BoardObject } from './board.object'; */

/**
 * The `ProjectObject` class serves as a foundational blueprint for representing projects within the application.
 * Projects, in many applications, are a way to organize and manage a collection of tasks, goals, and boards.
 * They are especially prevalent in project management tools, where each project can have different boards (like Kanban),
 * distinct goals, various members, and associated roles. Furthermore, projects can have notes, descriptions, and
 * specific timelines associated with them.
 */
@ObjectType({
  description: 'Object that contains the basic information of a project.',
})
export class ProjectMinimalObject {
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
   * The `id` field is a unique identifier for each project. This is essential for differentiating between
   * projects and for operations like updating, deleting, or querying specific projects.
   */
  @Field(() => ID, { description: 'Unique identifier for the project.' })
  public id!: string;

  /**
   * The `name` field provides the title or name of the project, allowing users to quickly identify and refer to it.
   */
  @Field({ description: "Project's name." })
  public name!: string;

  /**
   * The `owner` field specifies the user who created or owns the project. This is crucial for
   * determining accountability and for certain permission-related operations.
   */
  @Field(() => AuthUserMinimalObject, { description: 'Project owner user.' })
  public owner!: AuthUserMinimalObject;

  /**
   * The `start_date` field signifies when the project was initiated or started. This is helpful for tracking
   * the duration and progress of the project.
   */
  @Field({ description: 'Project start date.', nullable: true })
  public start_date?: Date;
}
