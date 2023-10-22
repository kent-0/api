import { Field, ID, InputType } from '@nestjs/graphql';

import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

/**
 * `BoardTaskCreateInput`: A data transfer object designed to encapsulate the necessary
 * attributes required for task creation within a specific board. By providing structured
 * input, it ensures that tasks are created with coherent and valid data, facilitating
 * clear and concise task management within the board's context.
 */
@InputType({
  description: 'The input when creating a task.',
})
export class BoardTaskCreateInput {
  /**
   * Represents the unique identifier of the board to which the new task will belong.
   * Ensuring that the `boardId` is accurate and valid safeguards against misplacement
   * of tasks and maintains the structural integrity of the board’s task management.
   */
  @IsUUID(4)
  @Field(() => ID, {
    description: 'The ID of the board to which this task belongs.',
  })
  public boardId!: string;

  /**
   * Represents the unique identifier of the task to which the new task will be a child of.
   * Ensuring that the `child_of` is accurate and valid safeguards against misplacement
   * of tasks and maintains the structural integrity of the board’s task management.
   */
  @IsOptional()
  @IsUUID(4, {
    message:
      'The ID of the task to which this task is a child of must be a UUID.',
  })
  @Field(() => ID, {
    description: 'The ID of the task to which this task is a child of.',
    nullable: true,
  })
  public child_of?: string;

  /**
   * Holds a textual description of the task, providing detailed information or instructions
   * pertaining to the task. Adhering to a maximum length of 3000 characters ensures
   * descriptions remain concise while still allowing ample space for detailed information.
   */
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

  /**
   * Contains the name of the task, serving as a primary identifier and brief descriptor
   * of the task. The name is constrained to a maximum of 150 characters, ensuring clarity
   * and readability while still allowing for descriptive labeling.
   */
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
}
