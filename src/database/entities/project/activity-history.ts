import {
  Entity,
  Enum,
  ManyToOne,
  OptionalProps,
  Property,
  Rel,
} from '@mikro-orm/core';

import { ActivityHistoryTypes } from '~/database/enums/activity-history.enum';

import { ProjectEntity } from './project.entity';

import { AuthUserEntity } from '../auth/user.entity';
import { OptionalParentProps, ParentEntity } from '../base.entity';
import { BoardEntity } from '../board/board.entity';

/**
 * Entity that captures and logs the various activities or actions taken by members
 * on boards and projects. This provides an audit trail, offering insights into
 * who did what and when.
 */
@Entity({
  comment: 'Activity log to audit changes to dashboards and projects.',
  tableName: 'activity_history',
})
export class ActivityHistory extends ParentEntity {
  /**
   * Defines optional properties that might be set for this entity. This includes
   * the reference ID of the managed element and any other optional properties
   * from the parent entity.
   */
  public [OptionalProps]?: 'reference_id' | OptionalParentProps;

  /**
   * Many-to-One relationship representing the board where the specific activity
   * or action took place. This is nullable as not all activities might be associated
   * with a board.
   */
  @ManyToOne({
    comment: 'Board where the activity originated.',
    entity: () => BoardEntity,
    nullable: true,
  })
  public board!: Rel<BoardEntity>;

  /**
   * Many-to-One relationship representing the member or user who performed or
   * initiated the specific action or activity.
   */
  @ManyToOne({
    comment: 'Member who performed the action.',
    entity: () => AuthUserEntity,
  })
  public member!: Rel<AuthUserEntity>;

  /**
   * Many-to-One relationship representing the project in which the activity
   * or action originated.
   */
  @ManyToOne({
    comment: 'Project where the activity originated.',
    entity: () => ProjectEntity,
  })
  public project!: Rel<ProjectEntity>;

  /**
   * The unique reference ID of the element or item that was managed or affected
   * by the activity. This could be the ID of a task, comment, tag, etc.
   */
  @Property({
    columnType: 'uuid',
    comment: 'Reference ID of the managed element.',
    nullable: true,
    type: 'text',
  })
  public reference_id!: string;

  /**
   * Enum indicating the type of action or activity that was performed. This
   * provides a clear categorization of activities, such as 'CREATE', 'UPDATE',
   * 'DELETE', etc.
   */
  @Enum({
    comment: 'Type of action performed in the activity.',
    items: () => ActivityHistoryTypes,
    type: 'enum',
  })
  public type!: ActivityHistoryTypes;
}
