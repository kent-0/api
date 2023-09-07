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
  description: 'Input details to modify the status of a specific project goal.',
})
export class ProjectGoalChangeStatusInput {
  /**
   * The unique identifier of the goal whose status needs to be changed.
   */
  @Field(() => String, {
    description:
      'Unique ID of the goal for which the status needs modification.',
  })
  public goalId!: string;

  /**
   * The unique identifier of the project to which the goal belongs.
   *
   * Ensures that the provided ID is a valid UUID format.
   */
  @Field(() => String, {
    description:
      'Unique ID of the project associated with the goal. Should be in valid UUID format.',
  })
  @IsUUID(4, { message: 'The project ID must be a valid UUID.' })
  public projectId!: string;

  /**
   * The new status that the goal should be updated to.
   *
   * Utilizes the ProjectGoalsStatus enum to ensure a valid status is chosen.
   */
  @Field(() => ProjectGoalsStatus, {
    description:
      'The desired new status for the goal, chosen from the ProjectGoalsStatus enum.',
  })
  public status!: ProjectGoalsStatus;
}
