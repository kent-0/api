import { Field, ID, ObjectType } from '@nestjs/graphql';

import {
  AuthUserMinimalObject,
  AuthUserMinimalProperties,
} from '~/modules/auth/objects';
import { createFieldPaths } from '~/utils/functions/create-fields-path';
import { tuple } from '~/utils/functions/tuple';

/* import { BoardObject } from './board.object'; */

/**
 * Represents a tuple containing the minimal set of properties required
 * for a project entity. This not only includes the direct properties of the project
 * but also the fields related to the user who owns the project.
 *
 * The tuple is structured to capture:
 * - The unique identifier for the project (`id`).
 * - A brief description of the project (`description`).
 * - The end date or expected completion date for the project (`end_date`).
 * - The name or title of the project (`name`).
 * - The start or commencement date of the project (`start_date`).
 * - The associated properties of the user (`owner`) who owns the project.
 *   This is achieved using the `createFieldPaths` function, which combines the
 *   base entity ('owner' in this case) with its minimal properties
 *   (from `AuthUserMinimalProperties`).
 *
 * By defining this tuple, it provides a standardized approach to select the essential
 * fields for a project across the application. This ensures consistency,
 * optimizes queries by selecting only necessary fields, and aids in reducing chances
 * of errors.
 *
 * @constant ProjectMinimalProperties
 *
 * @example
 * Assuming the tuple is used to generate a SQL SELECT statement:
 * The fields would be:
 * - 'id'
 * - 'description'
 * - 'end_date'
 * - 'name'
 * - 'start_date'
 * - 'owner.id'
 * - 'owner.first_name'
 * - 'owner.last_name'
 * - 'owner.username'
 */
export const ProjectMinimalProperties = tuple(
  'id',
  'description',
  'end_date',
  'name',
  'start_date',
  ...createFieldPaths('owner', ...AuthUserMinimalProperties),
);

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
