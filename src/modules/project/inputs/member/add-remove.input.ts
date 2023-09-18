import { Field, ID, InputType } from '@nestjs/graphql';

import { IsUUID } from 'class-validator';

/**
 * AddRemoveProjectMemberInput Class
 *
 * Represents the input required to add a user as a member of a project or remove them from a project.
 *
 * Properties:
 * - projectId: The unique identifier of the project to which the user will be added or removed.
 * - userId: The unique identifier of the user to be added as a member or removed from the project.
 *
 * Usage:
 * This class is used as an input type for GraphQL mutations that add or remove users as members of a project.
 * It ensures that the provided project and user IDs are valid UUIDs before processing the mutation.
 */
@InputType({
  description:
    'Input details necessary to either add or remove a user from a specific project.',
})
export class ProjectMemberAddRemoveInput {
  /**
   * The unique identifier of the project to which the user will be added or removed.
   */
  @Field(() => ID, {
    description:
      'Unique ID of the project where the user is to be added or removed. Must be in valid UUID format.',
  })
  @IsUUID(4, { message: 'The project ID must be a valid UUID.' })
  public projectId!: string;

  /**
   * The unique identifier of the user to be added as a member or removed from the project.
   */
  @Field(() => ID, {
    description:
      'Unique ID of the user who is being added to or removed from the specified project. Must be in valid UUID format.',
  })
  @IsUUID(4, { message: 'The user ID must be a valid UUID.' })
  public userId!: string;
}
