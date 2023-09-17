import { Field, ID, ObjectType } from '@nestjs/graphql';

import {
  AuthUserMinimalObject,
  AuthUserMinimalProperties,
} from '~/modules/auth/objects';
import { createFieldPaths } from '~/utils/functions/create-fields-path';
import { tuple } from '~/utils/functions/tuple';

/**
 * Represents a tuple containing the minimal set of properties required
 * for a project's notes. This not only includes the direct properties of the note
 * but also the fields related to the user who created the note.
 *
 * The tuple is structured to capture:
 * - The unique identifier for the note (`id`).
 * - The title of the note (`title`).
 * - The content or body of the note (`content`).
 * - The associated properties of the user (`created_by`) who authored the note.
 *   This is achieved using the `createFieldPaths` function, which combines the
 *   base entity ('created_by' in this case) with its minimal properties
 *   (from `AuthUserMinimalProperties`).
 *
 * By defining this tuple, it provides a standardized approach to select the essential
 * fields for a project's notes across the application. This ensures consistency,
 * optimizes queries by selecting only necessary fields, and aids in reducing chances
 * of errors.
 *
 * @constant ProjectNotesMinimalProperties
 *
 * @example
 * Assuming the tuple is used to generate a SQL SELECT statement:
 * The fields would be:
 * - 'id'
 * - 'title'
 * - 'content'
 * - 'created_by.id'
 * - 'created_by.first_name'
 * - 'created_by.last_name'
 * - 'created_by.username'
 */
export const ProjectNotesMinimalProperties = tuple(
  'id',
  'title',
  'content',
  ...createFieldPaths('created_by', ...AuthUserMinimalProperties),
);

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
export class ProjectNoteMinimalObject {
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
