import { Field, ID, InputType } from '@nestjs/graphql';

import { IsUUID, Min } from 'class-validator';

/**
 * Represents the data required to move a task to another step.
 * This data is provided by the client when making a request to move a task to another step.
 * It is used by the BoardTaskService to perform the move operation.
 */
@InputType({
  description: 'The data required to move a task to another step.',
})
export class BoardTaskMove {
  /**
   * Represents the unique identifier of the board which houses the task targeted for deletion.
   * This ID ensures that the deletion operation is constrained within the correct board, thereby
   * safeguarding against accidental deletions or alterations in other boards.
   */
  @Field(() => ID, {
    description: 'The ID of the board that the task belongs to.',
  })
  @IsUUID(4, { message: 'The board ID must be a valid UUID.' })
  public boardId!: string;

  /**
   * Represents the new position of the task within the step that it is being moved to.
   * This position is used to determine the order of the tasks within the step, and is
   * constrained to the number of tasks within the step.
   */
  @Field(() => Number, {
    description: 'The new position of the task within the step.',
  })
  @Min(1, { message: 'The task position must be greater than or equal to 1.' })
  public position!: number;

  /**
   * Represents the unique identifier of the step that the task is to be moved to.
   * This ID ensures that the move operation is constrained within the correct step, thereby
   * safeguarding against accidental moves or alterations in other steps.
   */
  @Field(() => ID, {
    description: 'The ID of the step to move the task to.',
  })
  @IsUUID(4, { message: 'The step ID must be a valid UUID.' })
  public stepId!: string;

  /**
   * Specifies the unique identifier of the task that is slated for deletion. This ID acts
   * as a precise pointer to the task entity, ensuring that the exact task intended for deletion
   * is the one that gets removed, thus preventing inadvertent deletions.
   */
  @Field(() => ID, {
    description: 'The ID of the task to delete.',
  })
  @IsUUID(4, { message: 'The task ID must be a valid UUID.' })
  public taskId!: string;
}
