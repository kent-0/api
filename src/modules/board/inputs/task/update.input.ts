import { Field, ID, InputType } from '@nestjs/graphql';

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
  public description?: string;

  /**
   * Optionally specifies a new expiration date for the task. This allows users to extend or
   * reduce the timeframe for a task, adapting to shifting timelines and project needs.
   */
  @Field(() => Date, {
    description: 'The expiration date of the task.',
    nullable: true,
  })
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
  public name?: string;

  /**
   * Specifies the unique identifier of the task that is intended to be updated. This ID ensures
   * that the update operation accurately targets the desired task, preventing unintended updates
   * to other tasks and maintaining data integrity.
   */
  @Field(() => ID, {
    description: 'The ID of the task to update.',
  })
  public taskId!: string;
}
