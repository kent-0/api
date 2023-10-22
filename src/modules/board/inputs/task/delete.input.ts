import { Optional } from '@nestjs/common';
import { Field, ID, InputType } from '@nestjs/graphql';

import { IsUUID } from 'class-validator';

/**
 * This input type encompasses the essential identifiers required to perform a task deletion
 * operation within a specific board. By providing a focused set of fields, it enables users
 * to specify exactly which task needs to be deleted, while also ensuring that the deletion
 * occurs within the appropriate board context to maintain data integrity.
 */
@InputType({
  description: 'Input necessary to delete a task from a specific board.',
})
export class BoardTaskDeleteInput {
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
   * Represents the unique identifier of the task that is slated for deletion. This ID acts
   * as a precise pointer to the task entity, ensuring that the exact task intended for deletion
   * is the one that gets removed, thus preventing inadvertent deletions.
   */
  @IsUUID(4)
  @Optional()
  @Field(() => ID, {
    description: 'The ID of the task to which this task is a child of.',
  })
  public child_of?: string;

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
