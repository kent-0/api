import {
  Entity,
  ManyToOne,
  OneToMany,
  OptionalProps,
  Property,
  Rel,
} from '@mikro-orm/core';

import { BoardEntity } from './board.entity';
import { BoardTaskEntity } from './task.entity';

import { OptionalParentProps, ParentEntity } from '../base.entity';

/**
 * Entity representing steps to complete per task.
 */
@Entity({
  comment: 'Steps to complete per task.',
  tableName: 'boards_steps',
})
export class BoardStepEntity extends ParentEntity {
  /**
   * Optional properties that can be set on the entity.
   */
  public [OptionalProps]?: 'description' | OptionalParentProps;

  /**
   * Board assigned to the task step.
   */
  @ManyToOne({
    comment: 'Board assigned to the task step.',
    entity: () => BoardEntity,
    onDelete: 'cascade',
  })
  public board!: Rel<BoardEntity>;

  /**
   * Brief description of what the step is about.
   */
  @Property({
    columnType: 'varchar',
    comment: 'Brief description of what the step is about.',
    length: 300,
    nullable: true,
    type: 'string',
  })
  public description!: string;

  /**
   * Maximum number of tasks assigned to the step.
   */
  @Property({
    columnType: 'int',
    comment: 'Maximum number of tasks assigned to the step.',
    type: 'number',
  })
  public max!: number;

  /**
   * Name of the step.
   */
  @Property({
    columnType: 'varchar',
    comment: 'Name of the step.',
    length: 100,
    type: 'string',
  })
  public name!: string;

  /**
   * Step position on the board.
   */
  @Property({
    columnType: 'int',
    comment: 'Step position on the board.',
    type: 'number',
  })
  public position!: number;

  /**
   * Tasks assigned to the project step.
   */
  @OneToMany(() => BoardTaskEntity, (t) => t.step, {
    comment: 'Tasks assigned to the project step.',
  })
  public tasks!: Rel<BoardTaskEntity>;
}
