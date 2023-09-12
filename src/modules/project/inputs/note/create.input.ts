import { Field, InputType } from '@nestjs/graphql';

import { IsUUID } from 'class-validator';

/**
 * Represents the input structure required to create a new note associated with a specific project.
 * When creating a note, it's crucial to provide a comprehensive description, a unique identifier or name,
 * and the project's ID to which this note is linked. This class, when used in a GraphQL mutation,
 * ensures that the client provides all the necessary details for the creation of the note.
 */
@InputType({
  description:
    'Input details required to add a new note to a specific project.',
})
export class ProjectNoteCreateInput {
  /**
   * Represents the detailed description of the note. This field ensures that every note created
   * has comprehensive information outlining its purpose, significance, and the expected outcomes.
   */
  @Field(() => String, {
    description:
      "Comprehensive textual content that outlines the note's objective, importance, and anticipated outcomes.",
  })
  public content!: string;

  /**
   * The ID of the project with which the note is associated. This ensures that the note is linked
   * to the correct project, maintaining a structured relation between projects and their notes.
   *
   * @IsUUID() ensures that the provided ID adheres to the UUID format.
   */
  @Field(() => String, {
    description:
      'ID of the project to which this note pertains. Must be in valid UUID format.',
  })
  @IsUUID(4, { message: 'The project ID must be a valid UUID.' })
  public projectId!: string;

  /**
   * Represents a unique identifier or name for the note. This name provides a quick reference point
   * for the note and can be used for easy identification among a list of other notes.
   */
  @Field(() => String, {
    description:
      'Unique identifier for the note, offering a quick overview of its intent.',
  })
  public title!: string;
}
