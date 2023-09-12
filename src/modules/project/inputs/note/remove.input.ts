import { Field, InputType } from '@nestjs/graphql';

import { IsUUID } from 'class-validator';

/**
 * Represents the input structure required to remove a specific note from a given project.
 * In the context of a GraphQL mutation, this class ensures that the client provides all the necessary
 * details for the deletion of a note. Each field within this class is crucial to correctly identify
 * the note that needs to be deleted without affecting other data.
 */
@InputType({
  description:
    'Input specifics needed to delete a note from a designated project.',
})
export class ProjectNoteRemoveInput {
  /**
   * Represents the unique identifier for the note targeted for deletion.
   * This ensures that the exact note intended for removal is correctly identified and deleted.
   */
  @Field(() => String, {
    description:
      "Unique identifier for the note that is intended for deletion. It's essential to ensure the correct note is targeted.",
  })
  public noteId!: string;

  /**
   * The ID of the project to which the note belongs. While the noteId helps identify the note,
   * the projectId assists in verifying the association of the note to a specific project.
   * This double-check ensures data integrity and prevents accidental deletions.
   *
   * @IsUUID() ensures that the provided ID adheres to the UUID format.
   */
  @Field(() => String, {
    description:
      "ID of the project associated with the note. This helps in cross-verifying the note's association to maintain data integrity. Must be in valid UUID format.",
  })
  @IsUUID(4, { message: 'The project ID must be a valid UUID.' })
  public projectId!: string;
}
