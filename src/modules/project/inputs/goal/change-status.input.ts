import { Field, InputType } from '@nestjs/graphql';

import { ProjectGoalsStatus } from '~/database/enums/status.enum';

import { IsUUID } from 'class-validator';

/**
 * Represents the input required to change the status of a project goal.
 *
 * This input type gathers necessary information to identify both the goal
 * and the project it belongs to. Additionally, it specifies the new desired
 * status for the goal.
 */
@InputType({
  description: 'Change current state of the project goal.',
})
export class ProjectGoalChangeStatusInput {
  /**
   * The unique identifier of the goal whose status needs to be changed.
   */
  @Field(() => String, {
    description: 'ID of the goal to change the status.',
  })
  public goalId!: string;

  /**
   * The unique identifier of the project to which the goal belongs.
   *
   * Ensures that the provided ID is a valid UUID format.
   */
  @Field(() => String, {
    description: 'ID of the project where the goal belongs.',
  })
  @IsUUID(4, { message: 'The project ID must be a valid UUID.' })
  public projectId!: string;

  /**
   * The new status that the goal should be updated to.
   *
   * Utilizes the ProjectGoalsStatus enum to ensure a valid status is chosen.
   */
  @Field(() => ProjectGoalsStatus, {
    description: 'Status that will have the goal.',
  })
  public status!: ProjectGoalsStatus;
}
