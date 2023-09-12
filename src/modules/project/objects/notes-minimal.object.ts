import { Field, ID, ObjectType } from '@nestjs/graphql';

import { AuthUserMinimalObject } from '~/modules/auth/objects';

/**
 * The `ProjectNotesObject` class encapsulates the structure and metadata
 * of notes within a project management system. In the context of project
 * management, notes often serve as documentation, reminders, or annotations
 * about various aspects of a project. They help capture valuable insights,
 * decisions, or observations that could be referenced in the future.
 *
 * The class is designed to represent and interact with these notes in a
 * GraphQL API, ensuring that the data is presented in a consistent and
 * meaningful way.
 */
@ObjectType({
  description:
    'Object representing minimal notes data associated with a project.',
})
export class ProjectMinimalNotesObject {
  /**
   * The `content` field captures the main body of the note. It provides
   * comprehensive details or explanations regarding the topic or subject
   * mentioned in the note's title.
   */
  @Field(() => String, {
    description: 'Content that describes the title of the note.',
  })
  public content!: string;

  /**
   * The `created_by` field denotes the author of the note. By referencing
   * the user who created the note, the system can maintain accountability
   * and provide context about the source of the information.
   */
  @Field(() => AuthUserMinimalObject, {
    description: 'Author of the note.',
  })
  public created_by!: AuthUserMinimalObject;

  /**
   * The `id` field serves as a unique identifier for the note within the
   * system. This ID facilitates operations like updating, referencing, or
   * deleting the note.
   */
  @Field(() => ID, { description: 'Unique identifier for the project note.' })
  public id!: string;

  /**
   * The `title` field gives a concise name or headline to the note. It
   * serves as a quick reference to the topic or subject the note discusses.
   */
  @Field(() => String, { description: 'Title of the note.' })
  public title!: string;
}
