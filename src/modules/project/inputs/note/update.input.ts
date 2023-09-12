import { Field, InputType } from '@nestjs/graphql';

import { IsUUID } from 'class-validator';

/**
 * Represents the input structure required to update the details of a specific note within a project.
 * Each field within this input type provides critical data to ensure that the note update process is precise and accurate.
 */
@InputType({
  description:
    'Input specifics needed to modify details of a designated project note.',
})
export class ProjectNoteUpdateInput {
  /**
   * Contains the specific details or objectives that the note encapsulates.
   * This description is vital for team members to understand the broader context of the note
   * and to align their efforts accordingly.
   */
  @Field(() => String, {
    description:
      "Detailed objectives or context of the note. Enables team alignment towards the note's fulfillment.",
  })
  public content!: string;

  /**
   * The unique identifier for the note. This ID is instrumental in pinpointing
   * the exact note that needs modification, ensuring that other notes remain untouched.
   */
  @Field(() => String, {
    description:
      'Unique identifier targeting the specific note intended for update.',
  })
  public noteId!: string;

  /**
   * Denotes the unique identifier of the project in which the note resides.
   * This ID ensures that the system recognizes the correct project context when
   * updating the note. It adds an extra layer of verification.
   */
  @Field(() => String, {
    description:
      'ID of the project housing the note. Acts as a verification layer to ensure updates are made in the right context. Must be in valid UUID format.',
  })
  @IsUUID(4, { message: 'The project ID must be a valid UUID.' })
  public projectId!: string;

  /**
   * Serves as a label for the note. This name can be a brief summary or a title
   * that captures the essence of the note. It acts as a quick reference point in discussions
   * and when navigating through multiple notes.
   */
  @Field(() => String, {
    description:
      'Label or title encapsulating the essence of the note, serving as a quick reference.',
  })
  public title!: string;
}
