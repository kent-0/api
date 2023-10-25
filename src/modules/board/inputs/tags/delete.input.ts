import { Field, ID, InputType } from '@nestjs/graphql';

import { IsUUID } from 'class-validator';

@InputType({
  description: 'The input when deleting a tag from a board',
})
export class BoardTaskTagDeleteInput {
  @Field(() => ID)
  @IsUUID(4, {
    message: 'The board id must be a valid UUID.',
  })
  public boardId!: string;

  @Field(() => ID)
  @IsUUID(4, {
    message: 'The tag id must be a valid UUID.',
  })
  public tagId!: string;
}
