import { Field, ID, ObjectType } from '@nestjs/graphql';

import { StepType } from '~/database/enums/step.enum';
import { tuple } from '~/utils/functions/tuple';

export const BoardStepMinimalProperties = tuple(
  'id',
  'description',
  'type',
  'max',
  'name',
  'position',
);

/**
 * Represents a GraphQL object type that provides a minimized view of board steps.
 * This object encapsulates only the most essential attributes about a board step,
 * making it suitable for scenarios where detailed information is not needed.
 *
 * This object is specifically designed to provide a clear and concise representation
 * of a board step's properties. By using this object type, the system ensures
 * efficient data transfer and easier comprehension for users.
 *
 * The properties within this object type include details like:
 * - Description of the step.
 * - Whether the step is the final one.
 * - Maximum number of tasks allowed in the step.
 * - Name of the step.
 * - Step's position on the board.
 */
@ObjectType({
  description:
    'Object that represents the minimum information about board steps.',
})
export class BoardStepMinimalObject {
  /**
   * Offers a succinct overview of the step's role or purpose within the board, aiding
   * users in understanding its significance.
   */
  @Field(() => String, {
    description: 'Brief explanation of what the step is about.',
    nullable: true,
  })
  public description?: string;

  @Field(() => ID, {
    description: 'Unique ID of the step on the board.',
  })
  public id!: string;

  /**
   * Sets a constraint on the number of tasks that can be present within the step. This can
   * be useful for ensuring that certain steps don't become overwhelmed with tasks.
   */
  @Field(() => Number, {
    description: 'Maximum number of tasks that the step can have.',
  })
  public max?: number;

  /**
   * Provides a label for the step, offering clarity and context to users as they move tasks
   * from one step to another.
   */
  @Field(() => String, {
    description: 'Step name.',
  })
  public name!: string;

  /**
   * Specifies the step's position on the board, determining its display order relative to
   * other steps. This attribute is crucial for defining the flow of tasks.
   */
  @Field(() => Number, {
    description: 'Position of the step in the steps column of the board.',
  })
  public position!: number;

  /**
   * Indicates if the step is the concluding stage in the board's workflow. Tasks within
   * this step are generally considered completed or finalized.
   */
  @Field(() => StepType, {
    description:
      "Determines whether the step is the end of the board's step flow.",
    nullable: true,
  })
  public type?: StepType;
}
