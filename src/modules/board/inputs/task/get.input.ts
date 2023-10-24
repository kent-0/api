import { Field, ID, InputType } from '@nestjs/graphql';

import { IsUUID } from 'class-validator';

/**
 * This class represents the structure required to query a specific task on a board.
 * It expects both the board's identifier and the task's identifier to precisely fetch the desired task.
 */
@InputType({
  description: 'Input type to fetch a specific task on a board',
})
export class BoardTaskGetInput {
  /**
   * Represents the unique identifier of the board on which the targeted task is located.
   * This ensures that operations are performed within the context of the correct board.
   */
  @Field(() => ID, {
    description:
      'The unique identifier of the board on which the targeted task is located',
  })
  @IsUUID(4, {
    message: 'The board id is not a valid UUID',
  })
  public boardId!: string;

  /**
   * The unique identifier of the task that is intended to be queried.
   * This ID is crucial as it pinpoints the exact task on the board that the user wants to fetch.
   */
  @Field(() => ID, {
    description:
      'The unique identifier of the task that is intended to be queried',
  })
  @IsUUID(4, {
    message: 'The task id is not a valid UUID',
  })
  public taskId!: string;
}
