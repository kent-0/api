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
 * This entity captures the goals set for a specific project. Each goal
 * is defined by its name and description. Additionally, the current status
 * of the goal (e.g., Planned, In Progress, Completed) is tracked to provide
 * insights into the progress towards achieving that goal.
 */
@Entity({
  comment: 'Goals to be achieved in the project.',
  tableName: 'projects_goals',
})
export class ProjectGoalsEntity extends ParentEntity {
  /**
   * Defines optional properties that might be set for this entity.
   * This inherits any optional properties from the parent entity.
   */
  public [OptionalProps]?: OptionalParentProps;

  /**
   * Provides a brief description of the goal, giving more details
   * about what the goal aims to achieve or how it aligns with the
   * project's objectives.
   */
  @Property({
    columnType: 'varchar',
    comment: 'Brief description of the goal to achieve.',
    length: 500,
  })
  public description!: string;

  /**
   * Defines the name or title of the goal, which succinctly describes
   * the aim or objective.
   */
  @Property({
    columnType: 'varchar',
    comment: 'Name of the goal to achieve.',
    length: 100,
  })
  public name!: string;

  /**
   * Many-to-One relationship representing the project to which
   * this specific goal is associated. When the project is deleted,
   * all its associated goals are also deleted.
   */
  @ManyToOne({
    comment: 'Project assigned to the goal.',
    entity: () => ProjectEntity,
    onDelete: 'cascade',
  })
  public project!: Rel<ProjectEntity>;

  /**
   * Tracks the current status of the goal, allowing team members
   * and stakeholders to understand the progress being made towards
   * achieving this goal. This status can be 'Planned', 'In Progress',
   * 'Completed', etc.
   */
  @Enum({
    comment: 'Current status of the goal.',
    items: () => ProjectGoalsStatus,
    type: 'enum',
  })
  public status = ProjectGoalsStatus.Planned;
}
