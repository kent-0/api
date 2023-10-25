import { Field, ObjectType } from '@nestjs/graphql';

import { AuthUserMinimalObject } from '~/modules/auth/objects';
import { BoardMinimalObject } from '~/modules/board/objects/minimal/board.object';
import { BoardStepMinimalObject } from '~/modules/board/objects/minimal/step.object';
import { BoardTagMinimalObject } from '~/modules/board/objects/minimal/tag.object';
import { BoardTaskMinimalObject } from '~/modules/board/objects/minimal/task.object';
import { BoardTaskCommentMinimalObject } from '~/modules/board/objects/minimal/task-comment.object';

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
  description: 'A task on a step board.',
})
export class BoardTaskObject extends BoardTaskMinimalObject {
  /**
   * The user to whom the task has been assigned.
   * This person is responsible for the task's completion.
   */
  @Field(() => AuthUserMinimalObject, {
    description: 'The user to whom the task has been assigned.',
    nullable: true,
  })
  public assigned_to!: AuthUserMinimalObject;

  /**
   * The board to which the task belongs.
   * It provides context about the overarching project or category the task is a part of.
   */
  @Field(() => BoardMinimalObject, {
    description: 'The board to which the task belongs.',
  })
  public board!: BoardMinimalObject;

  /**
   * A list of child tasks of the current task.
   * This is used to create sub-tasks or child tasks within a task.
   */
  @Field(() => [BoardTaskMinimalObject], {
    description: 'A list of child tasks of the current task.',
  })
  public childrens!: BoardTaskMinimalObject[];

  /**
   * A list of comments associated with the task.
   * These comments can provide additional context, updates, or discussions about the task's progress.
   */
  @Field(() => [BoardTaskCommentMinimalObject], {
    description: 'A list of comments associated with the task.',
  })
  public comments!: BoardTaskCommentMinimalObject[];

  /**
   * The user who created or added the task to the board.
   * This information can be useful for traceability and understanding task origins.
   */
  @Field(() => AuthUserMinimalObject, {
    description: 'The user who created or added the task to the board.',
  })
  public created_by!: AuthUserMinimalObject;

  /**
   * The parent task of the current task.
   * This is used to create sub-tasks or child tasks within a task.
   */
  @Field(() => BoardTaskMinimalObject, {
    description: 'The parent task of the current task.',
    nullable: true,
  })
  public parent?: BoardTaskMinimalObject;

  /**
   * The step within the board where the task currently resides.
   * It provides context about the task's current phase or progression stage.
   */
  @Field(() => BoardStepMinimalObject, {
    description: 'The step within the board where the task currently resides.',
    nullable: true,
  })
  public step?: BoardStepMinimalObject;

  /**
   * A list of tags associated with the task.
   * Tags can provide a quick way to categorize or label tasks based on certain criteria or attributes.
   */
  @Field(() => [BoardTagMinimalObject], {
    description: 'A list of tags associated with the task.',
  })
  public tags!: BoardTagMinimalObject[];
}
