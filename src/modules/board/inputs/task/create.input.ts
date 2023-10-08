import { Field, ID, InputType } from '@nestjs/graphql';

import { IsArray, IsString, IsUUID, MaxLength } from 'class-validator';

@InputType({
  description: 'The input when creating a task.',
})
export class BoardTaskCreateInput {
  @IsUUID(4)
  @Field(() => ID, {
    description: 'The ID of the board to which this task belongs.',
  })
  public boardId!: string;

  @IsString({
    message: 'The description of the task must be a string.',
  })
  @MaxLength(3000, {
    message:
      'The description of the task must be no more than 3000 characters.',
  })
  @Field(() => String, {
    description: 'The description of the task.',
  })
  public description!: string;

  @IsString({
    message: 'The name of the task must be a string.',
  })
  @MaxLength(150, {
    message: 'The name of the task must be no more than 150 characters.',
  })
  @Field(() => String, {
    description: 'The name of the task.',
  })
  public name!: string;

  @IsArray({
    message: 'The tags associated with this task must be an array of strings.',
  })
  @Field(() => [String], {
    description: 'The tags associated with this task.',
  })
  public tags!: string[];
}
