import { Field, ID, InputType } from '@nestjs/graphql';

import { IsUUID } from 'class-validator';

@InputType({
  description: 'The input when manage a tag from a task board',
})
export class BoardTagsManageTask {
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

  @Field(() => ID, {
    description: 'ID of the user creating the comment',
  })
  @IsUUID(4, { message: 'The task ID must be a valid UUID.' })
  public taskId!: string;
}
