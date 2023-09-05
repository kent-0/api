import { Field, InputType } from '@nestjs/graphql';

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
  description: 'Input required to add a user as a member of a project.',
})
export class AddRemoveProjectMemberInput {
  /**
   * The unique identifier of the project to which the user will be added or removed.
   */
  @Field(() => String, {
    description:
      'The unique identifier of the project to which the user will be added or removed.',
  })
  @IsUUID(4, { message: 'The project ID must be a valid UUID.' })
  public projectId!: string;

  /**
   * The unique identifier of the user to be added as a member or removed from the project.
   */
  @Field(() => String, {
    description:
      'The unique identifier of the user to be added as a member or removed from the project.',
  })
  @IsUUID(4, { message: 'The user ID must be a valid UUID.' })
  public userId!: string;
}
