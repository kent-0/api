import { Field, InputType } from '@nestjs/graphql';

import { IsUUID } from 'class-validator';

/**
 * This input type is used to facilitate the removal of a specific step from a board.
 * It requires the ID of the board where the step is located and the ID of the step to be removed.
 * Both IDs should be in valid UUID format.
 */
@InputType({
  description: 'Remove a step from a board.',
})
export class BoardStepRemoveInput {
  /**
   * ID of the board where the step is located.
   * This UUID uniquely identifies the board and is used to locate the correct board from which the step should be removed.
   */
  @Field(() => String, {
    description: 'Board where the step is located.',
  })
  @IsUUID(4, { message: 'The board ID must be a valid UUID.' })
  public boardId!: string;

  /**
   * ID of the step to be removed.
   * This UUID uniquely identifies the step that needs to be removed from the specified board.
   */
  @Field(() => String, {
    description: 'ID of the step to remove from the board.',
  })
  @IsUUID(4, { message: 'The step ID must be a valid UUID.' })
  public stepId!: string;
}
