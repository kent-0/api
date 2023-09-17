import { Field, ID, InputType } from '@nestjs/graphql';

import { IsUUID } from 'class-validator';

/**
 * `BoardStepUpdateInput` is an input type designed to encapsulate all the fields required
 * to update an existing step on a project board.
 * It ensures that the necessary data is present and valid before performing the update operation.
 */
@InputType({
  description: 'Update a board step.',
})
export class BoardStepUpdateInput {
  /**
   * Represents the unique identifier for the board on which the step exists.
   * It ensures that the step update is targeted to the correct board.
   */
  @Field(() => ID, {
    description: 'ID of the board where the step is located.',
  })
  @IsUUID(4, { message: 'The board ID must be a valid UUID.' })
  public boardId!: string;

  /**
   * Provides a concise description of the step's purpose or role within the board.
   * Helps users understand the significance or function of this particular step.
   */
  @Field(() => String, {
    description: 'Brief explanation of what the step is about.',
    nullable: true,
  })
  public description?: string;

  /**
   * Indicates if this step is the final stage in a task's lifecycle within the board.
   * If set to true, this could signify the completion or resolution of tasks that reach this step.
   */
  @Field(() => Boolean, {
    description:
      "Determines if the step represents the final stage in the task's lifecycle.",
    nullable: true,
  })
  public finishStep?: boolean;

  /**
   * Specifies the maximum number of tasks that can be present in this step at any given time.
   * Useful for steps that have capacity limits or for implementing WIP (Work In Progress) limits.
   */
  @Field(() => Number, {
    description: 'Maximum number of tasks that can be in the step.',
    nullable: true,
  })
  public max?: number;

  /**
   * Denotes the name of the step. This name is displayed to users and should be descriptive enough
   * to indicate the step's function or stage in the task's lifecycle.
   */
  @Field(() => String, {
    description: 'Name that the step will have.',
    nullable: true,
  })
  public name?: string;

  /**
   * The unique identifier of the step that needs to be updated.
   * This ensures that the correct step is targeted for the update operation.
   */
  @Field(() => String, {
    description: 'ID of the step to update on the board.',
  })
  @IsUUID(4, { message: 'The step ID must be a valid UUID.' })
  public stepId!: string;
}
