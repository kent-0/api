import {
  Entity,
  ManyToOne,
  OptionalProps,
  Property,
  Rel,
} from '@mikro-orm/core';

import { ProjectEntity } from './project.entity';

import { AuthUserEntity } from '../auth/user.entity';
import { OptionalParentProps, ParentEntity } from '../base.entity';

/**
 * Entity representing notes related to the project.
 */
@Entity({
  comment: 'Notes related to the project.',
  tableName: 'projects_notes',
})
export class ProjectNotesEntity extends ParentEntity {
  /**
   * Optional properties that can be set on the entity.
   */
  public [OptionalProps]?: OptionalParentProps;

  /**
   * Content that describes the title of the note.
   */
  @Property({
    columnType: 'varchar',
    comment: 'Content that describes the title of the note.',
    length: 500,
  })
  public content!: string;

  /**
   * Author of the note.
   */
  @ManyToOne({
    comment: 'Author of the note.',
    entity: () => AuthUserEntity,
    onDelete: 'cascade',
  })
  public created_by!: Rel<AuthUserEntity>;

  /**
   * Project assigned to the note.
   */
  @ManyToOne({
    comment: 'Project assigned to the note.',
    entity: () => ProjectEntity,
    onDelete: 'cascade',
  })
  public project!: Rel<ProjectEntity>;

  /**
   * Title of the note.
   */
  @Property({
    columnType: 'varchar',
    comment: 'Title of the note.',
    length: 100,
  })
  public title!: string;
}
