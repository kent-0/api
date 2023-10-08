import { Field, ID, InputType } from '@nestjs/graphql';

import { IsArray, IsString, IsUUID, MaxLength } from 'class-validator';

/**
 * This input type furnishes all requisite fields that allow users to update
 * specific attributes of an existing task within a board. Each field in the class
 * represents a specific attribute of the task that can be altered, ensuring that users
 * can modify tasks to reflect the most accurate and up-to-date information.
 */
@InputType({
  description:
    'The input used to update details of an existing task on a board.',
})
export class BoardTaskUpdateInput {
  /**
   * Supplies detailed context or instructions regarding the task, ensuring that
   * all individuals involved have clear understanding and expectations.
   *
   * Note: Ensure descriptions are clear and to the point to avoid any ambiguity.
   */
  @Field(() => String, {
    description: 'The updated description for the task.',
  })
  @IsString({ message: 'The task description must be a string.' })
  @MaxLength(3000, {
    message: 'The task description must be no more than 3000 characters.',
  })
  public description?: string;

  /**
   * Provides a concise, descriptive name for the task, facilitating easy
   * identification and reference amongst a list of tasks.
   *
   * Note: Keep task names brief yet descriptive to ensure clarity in task management.
   */
  @Field(() => String, {
    description: 'The updated name for the task.',
  })
  @IsString({ message: 'The task name must be a string.' })
  @MaxLength(150, {
    message: 'The task name must be no more than 150 characters.',
  })
  public name!: string;

  /**
   * Contains an array of string tags that aid in categorizing and organizing tasks.
   * Utilizing tags can facilitate efficient task filtering and searching within the board.
   *
   * Note: Ensure tags are relevant and commonly used terms to maximize utility.
   */
  @Field(() => [String], {
    description: 'An array of updated tags associated with the task.',
  })
  @IsArray({ message: 'The tags must be provided as an array.' })
  public tags!: string[];

  /**
   * Denotes the unique identifier of the task intended to be updated.
   * It ensures that modifications are applied to the correct task within the system.
   */
  @Field(() => ID, {
    description: 'The unique identifier of the task to be updated.',
  })
  @IsUUID(4, { message: 'The task ID must be a valid UUID.' })
  public taskId!: string;
}
