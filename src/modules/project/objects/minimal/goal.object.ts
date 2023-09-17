import { Field, ID, ObjectType } from '@nestjs/graphql';

import { ProjectGoalsStatus } from '~/database/enums/status.enum';
import { tuple } from '~/utils/functions/tuple';

/**
 * Represents a tuple containing the minimal set of properties required
 * for a project's goals. This tuple is designed to capture the most essential
 * details that define a goal within the context of a project.
 *
 * The tuple is structured to capture:
 * - A brief description of the goal (`description`).
 * - The unique identifier for the goal (`id`).
 * - The name or title of the goal (`name`).
 * - The current status or progress of the goal (`status`).
 *
 * By defining this tuple, it provides a standardized approach to select the essential
 * fields for a project's goals across the application. This ensures consistency,
 * optimizes queries by selecting only necessary fields, and aids in reducing chances
 * of errors.
 *
 * @constant ProjectGoalMinimalProperties
 *
 * @example
 * Assuming the tuple is used to generate a SQL SELECT statement:
 * The fields would be:
 * - 'description'
 * - 'id'
 * - 'name'
 * - 'status'
 */
export const ProjectGoalMinimalProperties = tuple(
  'description',
  'id',
  'name',
  'status',
);

/**
 * The `ProjectGoalsObject` class represents a structured format for goals
 * associated with a specific project. Goals are important milestones or
 * objectives that a project aims to achieve. Each goal is defined by its
 * name, a brief description, its unique identifier, the project it's associated
 * with, and its current status.
 *
 * This class ensures that goals can be represented consistently and
 * can be queried or mutated within a GraphQL API.
 */
@ObjectType({
  description:
    'Object representing the minimal goals data to be achieved in the project.',
})
export class ProjectGoalMinimalObject {
  /**
   * A textual representation of the goal, providing more details or context
   * about what the goal entails.
   */
  @Field(() => String, {
    description: 'Brief description of the goal to achieve.',
  })
  public description!: string;

  /**
   * Every goal within a system should have a unique identifier. This
   * identifier is crucial for operations like querying a specific goal,
   * updating it, or deleting it.
   */
  @Field(() => ID, { description: 'Unique identifier for the project goal.' })
  public id!: string;

  /**
   * The name of the goal serves as a concise label for what the goal
   * represents. For instance, a goal could be named "Increase Monthly Sales".
   */
  @Field(() => String, { description: 'Name of the goal to achieve.' })
  public name!: string;

  /**
   * The status of a goal provides information about its current state. For
   * instance, a goal can be in "Not Started", "In Progress", or "Completed"
   * states. This helps in tracking the progress of goals over time.
   */
  @Field(() => ProjectGoalsStatus, {
    description: 'Current status of the goal.',
  })
  public status!: ProjectGoalsStatus;
}
