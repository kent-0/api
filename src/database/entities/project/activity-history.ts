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

@Entity({
  comment: 'Activity log to audit changes to dashboards and projects.',
  tableName: 'activity_history',
})
export class ActivityHistory extends ParentEntity {
  public [OptionalProps]?: 'reference_id' | OptionalParentProps;

  @ManyToOne({
    comment: 'Board where the activity originated.',
    entity: () => BoardEntity,
    nullable: true,
  })
  public board!: Rel<BoardEntity>;

  @ManyToOne({
    comment: 'Member who performed the action.',
    entity: () => AuthUserEntity,
  })
  public member!: Rel<AuthUserEntity>;

  @ManyToOne({
    comment: 'Project where the activity originated.',
    entity: () => BoardEntity,
  })
  public project!: Rel<ProjectEntity>;

  @Property({
    columnType: 'uuid',
    comment: 'Reference ID of the managed element.',
    nullable: true,
    type: 'text',
  })
  public reference_id!: string;

  @Enum({
    comment: 'Type of action performed in the activity.',
    items: () => ActivityHistoryTypes,
    type: 'enum',
  })
  public type!: ActivityHistoryTypes;
}
