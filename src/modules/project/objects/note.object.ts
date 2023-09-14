import { Field, ObjectType } from '@nestjs/graphql';

import { ProjectMinimalObject, ProjectNoteMinimalObject } from '.';

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
  description: 'Object representing notes associated with a project.',
})
export class ProjectNoteObject extends ProjectNoteMinimalObject {
  /**
   * The `project` field links the note to a specific project. Associating
   * a note with a project ensures that the note's context is clear and that
   * it can be easily found or referenced within the scope of that project.
   */
  @Field(() => ProjectMinimalObject, {
    description: 'Project assigned to the note.',
  })
  public project!: ProjectMinimalObject;
}
