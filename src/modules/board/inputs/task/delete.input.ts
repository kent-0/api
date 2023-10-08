import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class BoardTaskDeleteInput {
  @Field(() => ID, {
    description: 'The ID of the board that the task belongs to.',
  })
  public boardId!: string;

  @Field(() => ID, {
    description: 'The ID of the task to delete.',
  })
  public taskId!: string;
}
