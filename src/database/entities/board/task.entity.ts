import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OptionalProps,
  Property,
  Rel,
} from '@mikro-orm/core';

import { BoardEntity } from './board.entity';
import { BoardStepEntity } from './steps.entity';
import { BoardTagsEntity } from './tags.entity';
import { BoardTaskCommentEntity } from './task-comments.entity';

import { AuthUserEntity } from '../auth/user.entity';
import { OptionalParentProps, ParentEntity } from '../base.entity';

@Entity({
  comment: 'Tasks created for the board.',
  tableName: 'boards_tasks',
})
export class BoardTaskEntity extends ParentEntity {
  public [OptionalProps]?:
    | 'assigned_to'
    | 'expiration_date'
    | 'finish_date'
    | 'start_date'
    | OptionalParentProps;

  @ManyToOne({
    comment: 'Member assigned to the task.',
    entity: () => AuthUserEntity,
    nullable: true,
  })
  public assigned_to!: Rel<AuthUserEntity>;

  @ManyToOne({
    comment: 'Board on which tasks are assigned.',
    entity: () => BoardEntity,
  })
  public board!: Rel<BoardEntity>;

  @OneToMany(() => BoardTaskCommentEntity, (c) => c.task, {
    comment: 'Member feedback on the task.',
  })
  public comments!: Rel<BoardTaskCommentEntity>;

  @ManyToOne({
    comment: 'Member who created the task.',
    entity: () => AuthUserEntity,
  })
  public created_by!: Rel<AuthUserEntity>;

  @Property({
    columnType: 'varchar',
    comment:
      'Description about the task, such as how the implementation should work, etc.',
    length: 3000,
    type: 'string',
  })
  public description!: string;

  @Property({
    columnType: 'timestamp',
    comment: 'Date on which the task should be finished.',
    nullable: true,
    type: 'date',
  })
  public expiration_date!: Date;

  @Property({
    columnType: 'timestamp',
    comment: 'Date on which the task end.',
    nullable: true,
    type: 'date',
  })
  public finish_date!: Date;

  @Property({
    columnType: 'varchar',
    comment: 'Name of the task.',
    type: 'string',
  })
  public name!: string;

  @Property({
    columnType: 'int',
    comment: 'Task position on the step.',
    type: 'number',
  })
  public position!: number;

  @Property({
    columnType: 'timestamp',
    comment: 'Date on which the task began.',
    nullable: true,
    type: 'date',
  })
  public start_date!: Date;

  @ManyToOne({
    comment: 'Step in which the task is assigned.',
    entity: () => BoardStepEntity,
  })
  public step!: Rel<BoardStepEntity>;

  @ManyToMany(() => BoardTagsEntity, (t) => t.tasks, {
    comment: 'Tags with this task',
    owner: true,
  })
  public tags = new Collection<BoardTagsEntity>(this);
}
