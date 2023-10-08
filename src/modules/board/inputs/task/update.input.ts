import { Field, ID, InputType } from '@nestjs/graphql';

@InputType({
  description: 'The input when updating a task.',
})
export class BoardTaskUpdateInput {
  @Field(() => ID, {
    description: 'The ID of the board to update.',
  })
  public boardId!: string;

  @Field(() => String, {
    description: 'The description of the task to update.',
  })
  public description?: string;

  @Field(() => Date, {
    description: 'The expiration date of the task.',
  })
  public expirationDate?: Date;

  @Field(() => String, {
    description: 'The name of the task to update.',
  })
  public name?: string;

  @Field(() => ID, {
    description: 'The ID of the task to update.',
  })
  public taskId!: string;
}
