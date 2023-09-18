import { Field, ID, ObjectType } from '@nestjs/graphql';

import { BoardMinimalObject } from './minimal/board.object';
import { BoardStepMinimalObject } from './minimal/step.object';

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
 *
 * By defining steps using this class, users can create a structured flow for their tasks,
 * moving them from one stage to another based on progress, reviews, or other criteria.
 */
@ObjectType({
  description: 'Steps on a project board.',
})
export class BoardStepObject extends BoardStepMinimalObject {
  /**
   * Reference to the board to which the step is associated. This provides a contextual
   * backdrop for tasks within the step, linking them to a specific project or workflow.
   */
  @Field(() => ID, {
    description: 'Board to which the step belongs.',
  })
  public board!: BoardMinimalObject;
}
