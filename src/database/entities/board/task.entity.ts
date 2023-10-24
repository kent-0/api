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

import {
  AuthUserEntity,
  BoardEntity,
  BoardStepEntity,
  BoardTagsEntity,
  BoardTaskCommentEntity,
  OptionalParentProps,
  ParentEntity,
} from '..';

/**
 * Entity representing individual tasks that are created and managed within a board.
 * Each task has various attributes, such as an assigned member, associated comments,
 * a description, and more, which help in tracking and managing the progress of the task.
 */
@Entity({
  comment: 'Tasks created for the board.',
  tableName: 'boards_tasks',
})
export class BoardTaskEntity extends ParentEntity {
  /**
   * Defines the optional properties that can be set on this entity, including
   * the member assigned to it, its expiration, start, and finish dates, as well as
   * any optional properties from the parent entity.
   */
  public [OptionalProps]?:
    | 'assigned_to'
    | 'comments'
    | 'expiration_date'
    | 'finish_date'
    | 'start_date'
    | OptionalParentProps;

  /**
   * Many-to-One relationship indicating the member or user who is currently
   * assigned to work on this task.
   */
  @ManyToOne({
    comment: 'Member assigned to the task.',
    entity: () => AuthUserEntity,
    nullable: true,
  })
  public assigned_to!: Rel<AuthUserEntity> | null;

  /**
   * Many-to-One relationship indicating the board in which this task resides.
   */
  @ManyToOne({
    comment: 'Board on which tasks are assigned.',
    entity: () => BoardEntity,
  })
  public board!: Rel<BoardEntity>;

  /**
   * One-to-Many relationship representing all child tasks or sub-tasks of this task.
   * This is used to create sub-tasks or child tasks within a task.
   */
  @OneToMany(() => BoardTaskEntity, (c) => c.parent, {
    comment: "Children's of the task.",
  })
  public childrens = new Collection<BoardTaskEntity>(this);

  /**
   * One-to-Many relationship representing all comments or feedback from members
   * related to this task.
   */
  @OneToMany(() => BoardTaskCommentEntity, (c) => c.task, {
    comment: 'Member feedback on the task.',
    orderBy: { createdAt: 'ASC' },
  })
  public comments = new Collection<BoardTaskCommentEntity>(this);

  /**
   * Many-to-One relationship indicating the member or user who created this task.
   */
  @ManyToOne({
    comment: 'Member who created the task.',
    entity: () => AuthUserEntity,
  })
  public created_by!: Rel<AuthUserEntity>;

  /**
   * A detailed description of the task, providing insights into its requirements,
   * expected outcomes, and any other pertinent details.
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
   * The date by which this task is expected to be completed.
   */
  @Property({
    columnType: 'timestamp',
    comment: 'Date on which the task should be finished.',
    nullable: true,
    type: 'date',
  })
  public expiration_date!: Date;

  /**
   * The actual date on which this task was completed or concluded.
   */
  @Property({
    columnType: 'timestamp',
    comment: 'Date on which the task ends.',
    nullable: true,
    type: 'date',
  })
  public finish_date!: Date;

  /**
   * The title or name of the task, providing a quick summary or identifier.
   */
  @Property({
    columnType: 'varchar',
    comment: 'Name of the task.',
    length: 150,
    type: 'string',
  })
  public name!: string;

  /**
   * Many-to-One relationship indicating the parent task of this task.
   * This is used to create sub-tasks or child tasks within a task.
   */
  @ManyToOne({
    comment: 'Parent task.',
    entity: () => BoardTaskEntity,
    nullable: true,
  })
  public parent?: Rel<BoardTaskEntity>;

  /**
   * The position or order of this task within its assigned step on the board.
   */
  @Property({
    columnType: 'int',
    comment: 'Task position on the step.',
    type: 'number',
  })
  public position!: number;

  /**
   * The date on which work on this task was started.
   */
  @Property({
    columnType: 'timestamp',
    comment: 'Date on which the task began.',
    nullable: true,
    type: 'date',
  })
  public start_date!: Date;

  /**
   * Many-to-One relationship indicating the step or phase within the board
   * where this task is currently positioned.
   */
  @ManyToOne({
    comment: 'Step in which the task is assigned.',
    entity: () => BoardStepEntity,
    nullable: true,
  })
  public step?: Rel<BoardStepEntity>;

  /**
   * Many-to-Many relationship representing all the tags or labels associated
   * with this task, which help in categorizing or highlighting specific tasks.
   */
  @ManyToMany(() => BoardTagsEntity, (t) => t.tasks, {
    comment: 'Tags associated with this task',
    owner: true,
  })
  public tags = new Collection<BoardTagsEntity>(this);
}
