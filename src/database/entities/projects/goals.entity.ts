import { Entity, Enum, ManyToOne, Property, Rel } from '@mikro-orm/core';

import { ProjectGoalsStatus } from '~/database/enums/status.enum';

import { ProjectEntity } from './projects.entity';

import { ParentEntity } from '../base.entity';

@Entity({
  comment: 'Goals to be achieved in the project.',
  tableName: 'projects_goals',
})
export class ProjectGoalsEntity extends ParentEntity {
  @Property({
    columnType: 'varchar',
    comment: 'Brief description of the goal to achieve.',
    length: 500,
  })
  public description!: string;

  @Property({
    columnType: 'varchar',
    comment: 'Name of the goal to achieve.',
    length: 100,
  })
  public name!: string;

  @ManyToOne({
    comment: 'Project assigned to the goal.',
    entity: () => ProjectEntity,
    onDelete: 'cascade',
  })
  public project!: Rel<ProjectEntity>;

  @Enum({
    comment: 'Current status of the goal.',
    items: () => ProjectGoalsStatus,
    type: 'enum',
  })
  public status = ProjectGoalsStatus.Planned;
}
