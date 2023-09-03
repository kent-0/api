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

/**
 * Entity representing tasks created for the board.
 */
@Entity({
  comment: 'Tasks created for the board.',
  tableName: 'boards_tasks',
})
export class BoardTaskEntity extends ParentEntity {
  /**
   * Optional properties that can be set on the entity.
   */
  public [OptionalProps]?:
    | 'assigned_to'
    | 'expiration_date'
    | 'finish_date'
    | 'start_date'
    | OptionalParentProps;

  /**
   * Member assigned to the task.
   */
  @ManyToOne({
    comment: 'Member assigned to the task.',
    entity: () => AuthUserEntity,
    nullable: true,
  })
  public assigned_to!: Rel<AuthUserEntity>;

  /**
   * Board on which tasks are assigned.
   */
  @ManyToOne({
    comment: 'Board on which tasks are assigned.',
    entity: () => BoardEntity,
  })
  public board!: Rel<BoardEntity>;

  /**
   * Member feedback on the task.
   */
  @OneToMany(() => BoardTaskCommentEntity, (c) => c.task, {
    comment: 'Member feedback on the task.',
  })
  public comments!: Rel<BoardTaskCommentEntity>;

  /**
   * Member who created the task.
   */
  @ManyToOne({
    comment: 'Member who created the task.',
    entity: () => AuthUserEntity,
  })
  public created_by!: Rel<AuthUserEntity>;

  /**
   * Description about the task, such as how the implementation should work, etc.
   */
  @Property({
    columnType: 'varchar',
    comment:
      'Description about the task, such as how the implementation should work, etc.',
    length: 3000,
    type: 'string',
  })
  public description!: string;

  /**
   * Date on which the task should be finished.
   */
  @Property({
    columnType: 'timestamp',
    comment: 'Date on which the task should be finished.',
    nullable: true,
    type: 'date',
  })
  public expiration_date!: Date;

  /**
   * Date on which the task ends.
   */
  @Property({
    columnType: 'timestamp',
    comment: 'Date on which the task ends.',
    nullable: true,
    type: 'date',
  })
  public finish_date!: Date;

  /**
   * Name of the task.
   */
  @Property({
    columnType: 'varchar',
    comment: 'Name of the task.',
    type: 'string',
  })
  public name!: string;

  /**
   * Task position on the step.
   */
  @Property({
    columnType: 'int',
    comment: 'Task position on the step.',
    type: 'number',
  })
  public position!: number;

  /**
   * Date on which the task began.
   */
  @Property({
    columnType: 'timestamp',
    comment: 'Date on which the task began.',
    nullable: true,
    type: 'date',
  })
  public start_date!: Date;

  /**
   * Step in which the task is assigned.
   */
  @ManyToOne({
    comment: 'Step in which the task is assigned.',
    entity: () => BoardStepEntity,
  })
  public step!: Rel<BoardStepEntity>;

  /**
   * Tags associated with this task.
   */
  @ManyToMany(() => BoardTagsEntity, (t) => t.tasks, {
    comment: 'Tags associated with this task',
    owner: true,
  })
  public tags = new Collection<BoardTagsEntity>(this);
}
