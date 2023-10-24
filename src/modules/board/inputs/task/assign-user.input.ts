import { Field, InputType } from '@nestjs/graphql';

import { IsUUID } from 'class-validator';

/**
 * `BoardTaskUserAssign` Input Type:
 * This input type defines the necessary details required to assign a user (or member)
 * to a specific task on a board. It encapsulates the relevant identifiers to ensure
 * that a task is matched with the right user on the correct board.
 */
@InputType({
  description: 'Input type for assigning a user to a task on a board.',
})
export class BoardTaskUserAssign {
  /**
   * Represents the unique identifier of the board where the target task is located.
   * This helps in narrowing down the context to a specific board.
   */
  @Field({
    description: 'Board where the task is located.',
  })
  @IsUUID(4, {
    message: 'Invalid board id provided. Please provide a valid UUID.',
  })
  public boardId!: string;

  /**
   * Specifies the unique identifier of the member (or user) who will be assigned to the task.
   * This ensures that the right user is linked to the task.
   */
  @Field({
    description: 'Member who will be assigned to the task.',
  })
  @IsUUID(4, {
    message: 'Invalid member id provided. Please provide a valid UUID.',
  })
  public memberId!: string;

  /**
   * The unique identifier of the task that the user will be assigned to.
   * This pinpoints the exact task on the board that needs user assignment.
   */
  @Field({
    description: 'Task to be assigned to the member.',
  })
  @IsUUID(4, {
    message: 'Invalid task id provided. Please provide a valid UUID.',
  })
  public taskId!: string;
}
