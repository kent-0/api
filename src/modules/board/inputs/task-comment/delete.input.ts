import { Field, ID, InputType } from '@nestjs/graphql';

import { IsUUID } from 'class-validator';

/**
 * `BoardTaskCommentCreateInput` Input Type:
 * This input type defines the necessary details required to delete a comment
 * for a specific task on a board. It encapsulates the relevant identifiers and content
 * to ensure that a comment is added to the right task on the correct board.
 */
@InputType({
  description: 'Input to create a board task comment',
})
export class BoardTaskCommentDeleteInput {
  /**
   * Represents the unique identifier of the board where the target task and its comment are located.
   * This helps in narrowing down the context to a specific board.
   */
  @Field(() => ID, {
    description: 'ID of the board to create the task comment in',
  })
  @IsUUID(4, {
    message:
      'The ID of the board to create the task comment in must be a UUID.',
  })
  public boardId!: string;

  /**
   * The unique identifier of the comment to delete.
   * This pinpoints the exact comment on the task that will be deleted.
   */
  @Field(() => ID, {
    description: 'ID of the comment to delete',
  })
  @IsUUID(4, { message: 'The comment ID must be a valid UUID.' })
  public commentId!: string;

  /**
   * The unique identifier of the task to which the comment will be deleted.
   * This pinpoints the exact task on the board that will receive the comment.
   */
  @Field(() => ID, {
    description: 'ID of the task of the comment.',
  })
  @IsUUID(4, { message: 'The task ID must be a valid UUID.' })
  public taskId!: string;
}
