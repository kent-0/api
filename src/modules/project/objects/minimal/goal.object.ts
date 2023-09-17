import { Field, ID, ObjectType } from '@nestjs/graphql';

import { ProjectGoalsStatus } from '~/database/enums/status.enum';
import { tuple } from '~/utils/functions/tuple';

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
