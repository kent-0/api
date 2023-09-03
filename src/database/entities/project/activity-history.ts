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
 * Entity representing activity log to audit changes to dashboards and projects.
 */
@Entity({
  comment: 'Activity log to audit changes to dashboards and projects.',
  tableName: 'activity_history',
})
export class ActivityHistory extends ParentEntity {
  /**
   * Optional properties that can be set on the entity.
   */
  public [OptionalProps]?: 'reference_id' | OptionalParentProps;

  /**
   * Board where the activity originated.
   */
  @ManyToOne({
    comment: 'Board where the activity originated.',
    entity: () => BoardEntity,
    nullable: true,
  })
  public board!: Rel<BoardEntity>;

  /**
   * Member who performed the action.
   */
  @ManyToOne({
    comment: 'Member who performed the action.',
    entity: () => AuthUserEntity,
  })
  public member!: Rel<AuthUserEntity>;

  /**
   * Project where the activity originated.
   */
  @ManyToOne({
    comment: 'Project where the activity originated.',
    entity: () => ProjectEntity,
  })
  public project!: Rel<ProjectEntity>;

  /**
   * Reference ID of the managed element.
   */
  @Property({
    columnType: 'uuid',
    comment: 'Reference ID of the managed element.',
    nullable: true,
    type: 'text',
  })
  public reference_id!: string;

  /**
   * Type of action performed in the activity.
   */
  @Enum({
    comment: 'Type of action performed in the activity.',
    items: () => ActivityHistoryTypes,
    type: 'enum',
  })
  public type!: ActivityHistoryTypes;
}
