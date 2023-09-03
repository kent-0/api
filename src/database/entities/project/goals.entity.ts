import {
  Entity,
  Enum,
  ManyToOne,
  OptionalProps,
  Property,
  Rel,
} from '@mikro-orm/core';

import { ProjectGoalsStatus } from '~/database/enums/status.enum';

import { ProjectEntity } from './project.entity';

import { OptionalParentProps, ParentEntity } from '../base.entity';

/**
 * Entity representing goals to be achieved in the project.
 */
@Entity({
  comment: 'Goals to be achieved in the project.',
  tableName: 'projects_goals',
})
export class ProjectGoalsEntity extends ParentEntity {
  /**
   * Optional properties that can be set on the entity.
   */
  public [OptionalProps]?: OptionalParentProps;

  /**
   * Brief description of the goal to achieve.
   */
  @Property({
    columnType: 'varchar',
    comment: 'Brief description of the goal to achieve.',
    length: 500,
  })
  public description!: string;

  /**
   * Name of the goal to achieve.
   */
  @Property({
    columnType: 'varchar',
    comment: 'Name of the goal to achieve.',
    length: 100,
  })
  public name!: string;

  /**
   * Project assigned to the goal.
   */
  @ManyToOne({
    comment: 'Project assigned to the goal.',
    entity: () => ProjectEntity,
    onDelete: 'cascade',
  })
  public project!: Rel<ProjectEntity>;

  /**
   * Current status of the goal.
   */
  @Enum({
    comment: 'Current status of the goal.',
    items: () => ProjectGoalsStatus,
    type: 'enum',
  })
  public status = ProjectGoalsStatus.Planned;
}
