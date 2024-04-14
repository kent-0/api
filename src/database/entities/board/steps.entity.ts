import {
  Collection,
  Entity,
  Enum,
  ManyToOne,
  OneToMany,
  OptionalProps,
  Property,
  Rel,
} from '@mikro-orm/core';

import { StepType } from '~/database/enums/step.enum';

import {
  BoardEntity,
  BoardTaskEntity,
  OptionalParentProps,
  ParentEntity,
} from '..';

/**
 * Entity representing various steps or stages that tasks must go through on a board.
 * Each step can have a set of tasks, and these tasks progress through these steps,
 * representing their lifecycle within the project management system.
 */
@Entity({
  comment: 'Steps to complete per task.',
  tableName: 'boards_steps',
})
export class BoardStepEntity extends ParentEntity {
  /**
   * Defines the optional properties that can be set on this entity, including
   * a description of the step and any optional properties from the parent entity.
   */
  public [OptionalProps]?:
    | 'description'
    | 'finish_step'
    | 'tasks'
    | OptionalParentProps;

  /**
   * Many-to-One relationship with the BoardEntity. Indicates the specific board
   * to which this step belongs. If the board is deleted, all associated steps are also removed.
   */
  @ManyToOne({
    comment: 'Board assigned to the task step.',
    deleteRule: 'cascade',
    entity: () => BoardEntity,
  })
  public board!: Rel<BoardEntity>;

  /**
   * A textual description providing more details or context about this specific step.
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
   * The maximum number of tasks that can be assigned to this step at any given time.
   * This can be used to enforce limits or manage workloads.
   */
  @Property({
    columnType: 'int',
    comment: 'Maximum number of tasks assigned to the step.',
    nullable: true,
    type: 'number',
  })
  public max?: number;

  /**
   * The name of the step, which provides a quick identifier for users.
   */
  @Property({
    columnType: 'varchar',
    comment: 'Name of the step.',
    length: 100,
    type: 'string',
  })
  public name!: string;

  /**
   * The position or order of this step on the board. Lower numbers typically represent
   * earlier stages, while higher numbers represent later stages in a task's lifecycle.
   */
  @Property({
    columnType: 'int',
    comment: 'Step position on the board.',
    type: 'number',
  })
  public position!: number;

  /**
   * One-to-Many relationship with the BoardTaskEntity. Represents all the tasks
   * that are currently in this step or stage on the board.
   */
  @OneToMany(() => BoardTaskEntity, (t) => t.step, {
    comment: 'Tasks assigned to the project step.',
    orderBy: { position: 'ASC' },
  })
  public tasks = new Collection<Rel<BoardTaskEntity>>(this);

  /**
   * The type of step, which indicates whether this is the first or last step on the board.
   */
  @Enum({
    comment: 'If the step is the first or last step in the board.',
    items: () => StepType,
    type: 'enum',
  })
  public type!: StepType;
}
