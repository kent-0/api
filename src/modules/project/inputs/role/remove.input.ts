import { Field, ID, InputType } from '@nestjs/graphql';

import { IsUUID } from 'class-validator';

/**
 * Represents the input structure required to remove a specific role from a given project.
 * In the context of a GraphQL mutation, this class ensures that the client provides all the necessary
 * details for the deletion of a role. Each field within this class is crucial to correctly identify
 * the role that needs to be deleted without affecting other data.
 */
@InputType({
  description:
    'Input specifics needed to delete a role from a designated project.',
})
export class ProjectRoleRemoveInput {
  /**
   * The ID of the project to which the role belongs. While the roleId helps identify the role,
   * the projectId assists in verifying the association of the role to a specific project.
   * This double-check ensures data integrity and prevents accidental deletions.
   *
   * @IsUUID() ensures that the provided ID adheres to the UUID format.
   */
  @Field(() => ID, {
    description:
      "ID of the project associated with the role. This helps in cross-verifying the role's association to maintain data integrity. Must be in valid UUID format.",
  })
  @IsUUID(4, { message: 'The project ID must be a valid UUID.' })
  public projectId!: string;

  /**
   * Represents the unique identifier for the role targeted for deletion.
   * This ensures that the exact role intended for removal is correctly identified and deleted.
   */
  @Field(() => ID, {
    description:
      "Unique identifier for the role that is intended for deletion. It's essential to ensure the correct role is targeted.",
  })
  public roleId!: string;
}
