import { Field, InputType } from '@nestjs/graphql';

import { IsUUID } from 'class-validator';

/**
 * Represents the input structure required to create a new goal for a specific project.
 * This input type is designed to collect essential details about the goal, ensuring
 * that the necessary information is available when creating a new goal in the system
 * using GraphQL mutations.
 */
@InputType({
  description: 'Create a new goal in the project.',
})
export class ProjectGoalCreateInput {
  /**
   * The textual content that describes the goal in detail.
   *
   * By providing a clear and comprehensive description, team members can understand the
   * objective of the goal, its importance, and the outcomes expected upon its completion.
   */
  @Field(() => String, {
    description: 'Content of the goal to be achieved in the project.',
  })
  public description!: string;

  /**
   * A unique identifier for the goal, making it easier to refer to in discussions,
   * reports, and other project-related activities. The name should be chosen such
   * that it gives a quick insight into the goal's purpose.
   */
  @Field(() => String, {
    description: 'Special name to differentiate this goal.',
  })
  public name!: string;

  /**
   * The ID of the project to which this goal will be associated.
   *
   * It's crucial to specify this ID correctly to ensure that the goal gets added to the
   * right project. The provided ID must adhere to the UUID format for system consistency.
   */
  @Field(() => String, {
    description:
      'The unique identifier of the project to which the goal will be added.',
  })
  @IsUUID(4, { message: 'The project ID must be a valid UUID.' })
  public projectId!: string;
}
