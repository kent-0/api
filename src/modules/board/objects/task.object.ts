import { ObjectType } from '@nestjs/graphql';

import { AuthUserMinimalObject } from '~/modules/auth/objects';
import { BoardMinimalObject } from '~/modules/board/objects/minimal/board.object';
import { BoardStepMinimalObject } from '~/modules/board/objects/minimal/step.object';
import { BoardTaskMinimalObject } from '~/modules/board/objects/minimal/task.object';

/**
 * `BoardTaskObject`:
 * This object type represents a comprehensive view of a task within a board.
 * Building upon the minimal representation from `BoardTaskMinimalObject`, it
 * includes additional properties that provide a more detailed look at the task's
 * associated users, the board it belongs to, the step within that board, and other
 * associated metadata. This detailed view is crucial when a holistic understanding
 * of task data and its relations is required.
 */
@ObjectType({
  description: 'A task on a board.',
})
export class BoardTaskObject extends BoardTaskMinimalObject {
  /**
   * The user to whom the task has been assigned.
   * This person is responsible for the task's completion.
   */
  public assigned_to!: AuthUserMinimalObject;

  /**
   * The board to which the task belongs.
   * It provides context about the overarching project or category the task is a part of.
   */
  public board!: BoardMinimalObject;

  /**
   * A list of comments associated with the task.
   * These comments can provide additional context, updates, or discussions about the task's progress.
   * TODO: Define the 'any' type more explicitly once comments structure is known.
   */
  /*public comments!: any;*/

  /**
   * The user who created or added the task to the board.
   * This information can be useful for traceability and understanding task origins.
   */
  public created_by!: AuthUserMinimalObject;

  /**
   * The step within the board where the task currently resides.
   * It provides context about the task's current phase or progression stage.
   */
  public step!: BoardStepMinimalObject;

  /**
   * A list of tags associated with the task.
   * Tags can provide a quick way to categorize or label tasks based on certain criteria or attributes.
   * TODO: Define the 'any' type more explicitly once tags structure is known.
   */
  /*public tags!: any;*/
}