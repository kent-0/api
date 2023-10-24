import { Field, ID, InputType } from '@nestjs/graphql';

import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

/**
 * `BoardTaskCommentCreateInput` Input Type:
 * This input type defines the necessary details required to reply a comment
 * for a specific task on a board. It encapsulates the relevant identifiers and content
 * to ensure that a comment is added to the right task on the correct board.
 */
@InputType({
  description: 'Input to create a board task comment',
})
export class BoardTaskCommentReplyInput {
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
   * The unique identifier of the comment to reply.
   * This pinpoints the exact comment on the task that will be replyd.
   */
  @Field(() => ID, {
    description: 'ID of the comment to reply',
  })
  @IsUUID(4, { message: 'The comment ID must be a valid UUID.' })
  public commentId!: string;

  /**
   * The actual textual content of the comment being reply to the task comment.
   * This encapsulates the user's feedback or note related to the task comment.
   */
  @Field({
    description: 'Content of the comment.',
  })
  @IsString({ message: 'The comment content must be a string.' })
  @MaxLength(1000, {
    message: 'The comment content must not exceed 1000 characters.',
  })
  @MinLength(1, {
    message: 'The comment content must be at least 1 character long.',
  })
  public content!: string;

  /**
   * The unique identifier of the task to which the comment will be replyd.
   * This pinpoints the exact task on the board that will receive the comment.
   */
  @Field(() => ID, {
    description: 'ID of the task of the comment.',
  })
  @IsUUID(4, { message: 'The task ID must be a valid UUID.' })
  public taskId!: string;
}
