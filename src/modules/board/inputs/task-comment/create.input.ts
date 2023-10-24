import { Field, ID, InputType } from '@nestjs/graphql';

import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

/**
 * `BoardTaskCommentCreateInput` Input Type:
 * This input type defines the necessary details required to create a comment
 * for a specific task on a board. It encapsulates the relevant identifiers and content
 * to ensure that a comment is added to the right task on the correct board.
 */
@InputType({
  description: 'Input to create a board task comment',
})
export class BoardTaskCommentCreateInput {
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
   * The actual textual content of the comment being added to the task.
   * This encapsulates the user's feedback or note related to the task.
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
   * The unique identifier of the task to which the comment will be added.
   * This pinpoints the exact task on the board that will receive the comment.
   */
  @Field(() => ID, {
    description: 'ID of the user creating the comment',
  })
  @IsUUID(4, { message: 'The task ID must be a valid UUID.' })
  public taskId!: string;
}
