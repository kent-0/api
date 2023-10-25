import { Field, ID, InputType } from '@nestjs/graphql';

import { IsUUID } from 'class-validator';

/**
 * The `BoardTaskTagDeleteInput` class represents the input required
 * when attempting to delete a tag from a board.
 */
@InputType({
  description: 'The input when deleting a tag from a board',
})
export class BoardTaskTagDeleteInput {
  /**
   * The unique identifier of the board from which the tag will be deleted.
   * This identifier should be in a valid UUID format.
   */
  @Field(() => ID)
  @IsUUID(4, {
    message: 'The board id must be a valid UUID.',
  })
  public boardId!: string;

  /**
   * The unique identifier of the tag that needs to be deleted.
   * This identifier should also be in a valid UUID format.
   */
  @Field(() => ID)
  @IsUUID(4, {
    message: 'The tag id must be a valid UUID.',
  })
  public tagId!: string;
}
