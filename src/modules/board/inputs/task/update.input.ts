import { Field, ID, InputType } from '@nestjs/graphql';

import { IsDateString, IsString, IsUUID, MaxLength } from 'class-validator';

/**
 * `BoardTaskUpdateInput` serves as a data transfer object, which contains the necessary
 * fields required to perform a task update operation within a specific board. This input type
 * ensures that users can modify various aspects of a task, such as its name, description, and
 * expiration date, while maintaining the context of the specific board and task through their
 * respective identifiers.
 */
@InputType({
  description: 'The input when updating a task.',
})
export class BoardTaskUpdateInput {
  /**
   * Designates the unique identifier of the board containing the task that is targeted for update.
   * Ensuring that this ID is provided safeguards the operation, constraining the update action
   * within the specified board and preventing unintended alterations in other boards.
   */
  @Field(() => ID, {
    description: 'The ID of the board to update.',
  })
  @IsUUID(4, {
    message: 'Invalid board id provided. Please provide a valid UUID.',
  })
  public boardId!: string;

  /**
   * Optionally holds the new description for the task. If provided, the existing description
   * of the task will be replaced with this value, allowing users to modify and elaborate on
   * the details of a task as it evolves.
   */
  @Field(() => String, {
    description: 'The description of the task to update.',
    nullable: true,
  })
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
  public description?: string;

  /**
   * Optionally specifies a new expiration date for the task. This allows users to extend or
   * reduce the timeframe for a task, adapting to shifting timelines and project needs.
   */
  @Field(() => Date, {
    description: 'The expiration date of the task.',
    nullable: true,
  })
  @IsDateString(
    {},
    {
      message: 'The expiration date of the task must be a valid date.',
    },
  )
  public expirationDate?: Date;

  /**
   * Optionally contains the new name for the task. When provided, this value will supersede
   * the existing task name, allowing for adaptability in task labeling and identification
   * throughout its lifecycle.
   */
  @Field(() => String, {
    description: 'The name of the task to update.',
    nullable: true,
  })
  @IsString({
    message: 'The name of the task must be a string.',
  })
  @MaxLength(150, {
    message: 'The name of the task must be no more than 150 characters.',
  })
  @Field(() => String, {
    description: 'The name of the task.',
  })
  public name?: string;

  /**
   * Specifies the unique identifier of the task that is intended to be updated. This ID ensures
   * that the update operation accurately targets the desired task, preventing unintended updates
   * to other tasks and maintaining data integrity.
   */
  @Field(() => ID, {
    description: 'The ID of the task to update.',
  })
  @IsUUID(4, {
    message: 'Invalid task id provided. Please provide a valid UUID.',
  })
  public taskId!: string;
}
