import { Field, InputType } from '@nestjs/graphql';

import { ProjectGoalsStatus } from '~/database/enums/status.enum';

import { IsUUID } from 'class-validator';

/**
 * Represents the input structure required to update the details of a specific goal within a project.
 * Each field within this input type provides critical data to ensure that the goal update process is precise and accurate.
 */
@InputType({
  description:
    'Input specifics needed to modify details of a designated project goal.',
})
export class ProjectGoalUpdateInput {
  /**
   * Contains the specific details or objectives that the goal encapsulates.
   * This description is vital for team members to understand the broader context of the goal
   * and to align their efforts accordingly.
   */
  @Field(() => String, {
    description:
      "Detailed objectives or context of the goal. Enables team alignment towards the goal's fulfillment.",
    nullable: true,
  })
  public description?: string;

  /**
   * The unique identifier for the goal. This ID is instrumental in pinpointing
   * the exact goal that needs modification, ensuring that other goals remain untouched.
   */
  @Field(() => String, {
    description:
      'Unique identifier targeting the specific goal intended for update.',
  })
  public goalId!: string;

  /**
   * Serves as a label for the goal. This name can be a brief summary or a title
   * that captures the essence of the goal. It acts as a quick reference point in discussions
   * and when navigating through multiple goals.
   */
  @Field(() => String, {
    description:
      'Label or title encapsulating the essence of the goal, serving as a quick reference.',
    nullable: true,
  })
  public name?: string;

  /**
   * Denotes the unique identifier of the project in which the goal resides.
   * This ID ensures that the system recognizes the correct project context when
   * updating the goal. It adds an extra layer of verification.
   */
  @Field(() => String, {
    description:
      'ID of the project housing the goal. Acts as a verification layer to ensure updates are made in the right context. Must be in valid UUID format.',
  })
  @IsUUID(4, { message: 'The project ID must be a valid UUID.' })
  public projectId!: string;

  /**
   * Specifies the current progression state of the goal. The status can vary from
   * being in planning, in progress, completed, or any other defined state.
   * Tracking this status is vital for project management and understanding the flow of tasks.
   */
  @Field(() => ProjectGoalsStatus, {
    description:
      'Current progression or state of the goal, vital for tracking and project management.',
    nullable: true,
  })
  public status?: ProjectGoalsStatus;
}
