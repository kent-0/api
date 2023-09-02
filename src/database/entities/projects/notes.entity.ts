import { Entity, ManyToOne, Property, Rel } from '@mikro-orm/core';

import { ProjectEntity } from './projects.entity';

import { AuthUserEntity } from '../auth/user.entity';
import { ParentEntity } from '../base.entity';

@Entity({
  comment: 'Notes related to the project.',
  tableName: 'projects_notes',
})
export class ProjectNotesEntity extends ParentEntity {
  @Property({
    columnType: 'varchar',
    comment: 'Content that describes the title of the note.',
    length: 500,
  })
  public content!: string;

  @ManyToOne({
    comment: 'Author of the note.',
    entity: () => AuthUserEntity,
    onDelete: 'cascade',
  })
  public created_by!: Rel<AuthUserEntity>;

  @ManyToOne({
    comment: 'Project assigned to the note.',
    entity: () => ProjectEntity,
    onDelete: 'cascade',
  })
  public project!: Rel<ProjectEntity>;

  @Property({
    columnType: 'varchar',
    comment: 'Title of the note.',
    length: 100,
  })
  public title!: string;
}
