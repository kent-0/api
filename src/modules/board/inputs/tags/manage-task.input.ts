import { Field, ID, InputType } from '@nestjs/graphql';

import { IsUUID } from 'class-validator';

/**
 * The `BoardTagsManageTask` class represents the input required
 * when attempting to manage a tag associated with a task on a board.
 */
@InputType({
  description: 'The input when manage a tag from a task board',
})
export class BoardTagsManageTask {
  /**
   * The unique identifier of the board where the task resides and where
   * the tag management operation will be performed. This identifier
   * should be in a valid UUID format.
   */
  @Field(() => ID)
  @IsUUID(4, {
    message: 'The board id must be a valid UUID.',
  })
  public boardId!: string;

  /**
   * The unique identifier of the tag that will be managed (e.g., added to or removed from
   * a task). This identifier should also be in a valid UUID format.
   */
  @Field(() => ID)
  @IsUUID(4, {
    message: 'The tag id must be a valid UUID.',
  })
  public tagId!: string;

  /**
   * The unique identifier of the task to which the tag management operation
   * will apply. This identifier should be in a valid UUID format.
   */
  @Field(() => ID, {
    description: 'ID of the user creating the comment',
  })
  @IsUUID(4, { message: 'The task ID must be a valid UUID.' })
  public taskId!: string;
}
