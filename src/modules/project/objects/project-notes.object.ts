import { Field, ID, ObjectType } from '@nestjs/graphql';

import { AuthUserObject } from '~/modules/auth/objects/user.object';

import { ProjectObject } from '.';

/**
 * Represents notes associated with a project.
 */
@ObjectType({
  description: 'Object representing notes associated with a project.',
})
export class ProjectNotesObject {
  /**
   * Content that describes the title of the note.
   */
  @Field(() => String, {
    description: 'Content that describes the title of the note.',
  })
  public content!: string;

  /**
   * Author of the note.
   */
  @Field(() => AuthUserObject, { description: 'Author of the note.' })
  public created_by!: AuthUserObject;

  /**
   * Unique identifier for the project note.
   */
  @Field(() => ID, { description: 'Unique identifier for the project note.' })
  public id!: string;

  /**
   * Project assigned to the note.
   */
  @Field(() => ProjectObject, { description: 'Project assigned to the note.' })
  public project!: ProjectObject;

  /**
   * Title of the note.
   */
  @Field(() => String, { description: 'Title of the note.' })
  public title!: string;
}
