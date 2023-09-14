import { Field, ID, InputType } from '@nestjs/graphql';

import { BoardMinimalObject } from './minimal/board.object';

/**
 * The `BoardStepObject` class represents a distinct step or stage within a project board.
 * Steps are critical components of project boards as they help organize tasks based on
 * their current status or phase. Each step can have attributes that dictate its behavior,
 * such as whether it's the final step in the board's flow or if there's a limit to the
 * number of tasks it can contain.
 *
 * The main attributes of this class include:
 * 1. `board`: References the board to which the step belongs. This association ensures that
 *    the step is contextually relevant to the tasks and workflow of the board.
 * 2. `description`: A brief explanation offering insights about the step's role or significance
 *    within the board.
 * 3. `finish_step`: A flag indicating if this step represents the end of the board's flow.
 *    Tasks reaching this step are considered to be in their final stage.
 * 4. `max`: Specifies a limit on the number of tasks that can reside within the step at any
 *    given time.
 * 5. `name`: A descriptive label for the step.
 * 6. `position`: The display order of the step relative to other steps on the board.
 *
 * By defining steps using this class, users can create a structured flow for their tasks,
 * moving them from one stage to another based on progress, reviews, or other criteria.
 */
@InputType({
  description: 'Steps on a project board.',
})
export class BoardStepObject {
  /**
   * Reference to the board to which the step is associated. This provides a contextual
   * backdrop for tasks within the step, linking them to a specific project or workflow.
   */
  @Field(() => ID, {
    description: 'Board to which the step belongs.',
  })
  public board!: BoardMinimalObject;

  /**
   * Offers a succinct overview of the step's role or purpose within the board, aiding
   * users in understanding its significance.
   */
  @Field(() => String, {
    description: 'Brief explanation of what the step is about.',
  })
  public description?: string;

  /**
   * Indicates if the step is the concluding stage in the board's workflow. Tasks within
   * this step are generally considered completed or finalized.
   */
  @Field(() => Boolean, {
    description:
      "Determines whether the step is the end of the board's step flow.",
  })
  public finish_step!: boolean;

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
}
