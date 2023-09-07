import { Field, InputType } from '@nestjs/graphql';

import { IsUUID } from 'class-validator';

/**
 * Represents the input structure required to delete a specific goal associated with a project.
 * This input type ensures that the system gathers the correct identifiers when a user
 * or system process initiates a request to delete a goal using GraphQL mutations.
 */
@InputType({
  description:
    'Input specifics needed to delete a goal from a designated project.',
})
export class ProjectGoalRemoveInput {
  /**
   * The unique identifier for the goal that needs to be deleted.
   *
   * This ID ensures that the correct goal is targeted for deletion. It's crucial
   * to provide the correct ID to prevent unintended deletions.
   */
  @Field(() => String, {
    description:
      "Unique identifier for the goal that is intended for deletion. It's essential to ensure the correct goal is targeted.",
  })
  public goalId!: string;

  /**
   * The ID of the project to which the goal is associated.
   *
   * By specifying this ID, the system can cross-verify that the goal is indeed
   * linked to the mentioned project. This extra layer of verification helps in
   * maintaining data integrity and ensures that goals from other projects are not mistakenly deleted.
   */
  @Field(() => String, {
    description:
      "ID of the project associated with the goal. This helps in cross-verifying the goal's association to maintain data integrity. Must be in valid UUID format.",
  })
  @IsUUID(4, { message: 'The project ID must be a valid UUID.' })
  public projectId!: string;
}
