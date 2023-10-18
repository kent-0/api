import { Field, ID, InputType } from '@nestjs/graphql';

/**
 * The `BoardStepCreateInput` class defines the necessary information required to create a new
 * step within a specific project board. Steps in project boards are often used to represent
 * phases or stages of tasks, such as 'To Do', 'In Progress', or 'Done'. Each step can have
 * specific constraints, like a maximum number of tasks.
 *
 * The primary attributes of this class include:
 * 1. `boardId`: Identifies the board where the new step will be created.
 * 2. `description`: Provides a brief explanation about the purpose or significance of the step.
 * 3. `finishStep`: Determines if the step represents the final stage in the task's lifecycle.
 * 4. `max`: Specifies the maximum number of tasks that can reside within the step.
 * 5. `name`: A descriptive name for the step.
 * 6. `position`: The display position of the step within the task row.
 *
 * With these attributes, users can create steps that cater to their specific workflow needs,
 * ensuring that tasks move efficiently from one step to another while adhering to any
 * constraints set by the board administrators.
 */
@InputType({
  description: 'Create a new step on a project board.',
})
export class BoardStepCreateInput {
  /**
   * Unique identifier of the board where the new step will be added. This ensures that
   * the step is associated with the correct board, providing context to the tasks within
   * that step.
   */
  @Field(() => ID, {
    description: 'ID of the board where the step will be created.',
  })
  public boardId!: string;

  /**
   * Provides a concise overview of the step, explaining its role or significance within
   * the task's lifecycle on the board.
   */
  @Field(() => String, {
    description: 'Brief explanation of what the step is about.',
    nullable: true,
  })
  public description?: string;

  /**
   * Specifies the maximum number of tasks that can be contained within this step. This
   * can be useful for steps like 'In Review', where only a limited number of tasks should
   * be reviewed at a time.
   */
  @Field(() => Number, {
    description: 'Maximum number of tasks that can be in the step.',
    nullable: true,
  })
  public max?: number;

  /**
   * Provides a descriptive name for the step, offering clarity on its purpose or stage
   * within the task's lifecycle.
   */
  @Field(() => String, {
    description: 'Name that the step will have.',
  })
  public name!: string;
}
