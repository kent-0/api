import { Field, ID, InputType } from '@nestjs/graphql';

import { IsUUID } from 'class-validator';

/**
 * This input type defines the necessary details required to move or reorder
 * the position of a specific step within a board. The primary intention behind
 * this class is to facilitate the reordering or rearrangement of steps on a board.
 */
@InputType({
  description: 'Move column positions one step of a board.',
})
export class BoardStepMoveInput {
  /**
   * Represents the unique identifier of the board in which the targeted step is located.
   * This ensures that operations are performed within the context of the correct board.
   */
  @Field(() => ID, {
    description: 'Board where the step is located.',
  })
  @IsUUID(4, { message: 'The board ID must be a valid UUID.' })
  public boardId!: string;

  /**
   * Specifies the new position where the step will be placed on the board. This allows
   * for precise control over the ordering of steps, ensuring that they can be organized
   * in a manner that suits the user's workflow.
   */
  @Field(() => Number, {
    description: 'Position in which the step will now be on the board.',
  })
  public position!: number;

  /**
   * The unique identifier of the step that is intended to be moved or reordered.
   * This ID is crucial as it pinpoints the exact step on the board that the user
   * wants to rearrange.
   */
  @Field(() => ID, {
    description: 'ID of the step which will move position on the board.',
  })
  @IsUUID(4, { message: 'The step ID must be a valid UUID.' })
  public stepId!: string;
}
