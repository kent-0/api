import { Field, ID, InputType } from '@nestjs/graphql';

import { IsUUID } from 'class-validator';

/**
 * This input type is used to represent the necessary details when marking a step on a project board as "finished."
 *
 * In the context of a project board, a "finished" step represents the final stage in a task's lifecycle. This
 * essentially means that any task that reaches this step is considered completed or done. This input type
 * is used to specify which step, on a given board, should be marked as such.
 */
@InputType({
  description:
    'Mark a step on a project board as the final step in the step flow, the finished step.',
})
export class BoardStepFinishedInput {
  /**
   * The unique identifier of the board where the step to be marked as "finished" is located.
   *
   * This is essential to ensure that the step belongs to the right board. It must be in valid UUID format.
   */
  @Field(() => ID, {
    description: 'Board where the step is located.',
  })
  @IsUUID(4, { message: 'The board ID must be a valid UUID.' })
  public boardId!: string;

  /**
   * The unique identifier of the step that will be marked as "finished."
   *
   * This ensures that the correct step is targeted for the update. It must be in valid UUID format.
   */
  @Field(() => ID, {
    description: 'ID of the step to mark as finished step.',
  })
  @IsUUID(4, { message: 'The step ID must be a valid UUID.' })
  public stepId!: string;
}
