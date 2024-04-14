import {
  Entity,
  ManyToOne,
  OptionalProps,
  Property,
  Rel,
} from '@mikro-orm/core';

import {
  AuthUserEntity,
  OptionalParentProps,
  ParentEntity,
  ProjectEntity,
} from '..';

/**
 * The `ProjectNotesEntity` represents a specific note related to a project. Each instance
 * of this entity captures a note's title, its content, the user who authored the note,
 * and the project with which the note is associated.
 *
 * Notes provide an avenue for team members to jot down important information, reminders,
 * or any other context-specific data related to the project.
 */
@Entity({
  comment: 'Notes related to the project.',
  tableName: 'projects_notes',
})
export class ProjectNotesEntity extends ParentEntity {
  /**
   * Optional properties for this entity.
   */
  public [OptionalProps]?: OptionalParentProps;

  /**
   * This property captures the main content or body of the note. It provides a detailed
   * description or context that the note aims to convey.
   */
  @Property({
    columnType: 'varchar',
    comment: 'Content that describes the title of the note.',
    length: 500,
  })
  public content!: string;

  /**
   * Many-to-One relationship indicating the user who authored or created the note.
   * If the user is deleted, the note they authored will also be removed.
   */
  @ManyToOne({
    comment: 'Author of the note.',
    deleteRule: 'cascade',
    entity: () => AuthUserEntity,
  })
  public created_by!: Rel<AuthUserEntity>;

  /**
   * Many-to-One relationship linking the note to a specific project. This establishes
   * the context for the note, indicating which project it pertains to.
   * If the project is deleted, all associated notes will also be removed.
   */
  @ManyToOne({
    comment: 'Project assigned to the note.',
    deleteRule: 'cascade',
    entity: () => ProjectEntity,
  })
  public project!: Rel<ProjectEntity>;

  /**
   * This property represents the heading or subject of the note. It gives a quick
   * overview of what the note is about.
   */
  @Property({
    columnType: 'varchar',
    comment: 'Title of the note.',
    length: 100,
  })
  public title!: string;
}
