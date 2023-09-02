import { Entity, ManyToOne, Property, Rel } from '@mikro-orm/core';

import { BoardEntity } from './board.entity';

import { ParentEntity } from '../base.entity';

@Entity({
  comment: 'Steps to complete per task.',
  tableName: 'boards_steps',
})
export class BoardStepsEntity extends ParentEntity {
  @ManyToOne({
    comment: 'Board assigned to the task step.',
    entity: () => BoardEntity,
    onDelete: 'cascade',
  })
  public board!: Rel<BoardEntity>;

  @Property({
    columnType: 'varchar',
    comment: 'Brief description of what the step is about.',
    length: 300,
    nullable: true,
    type: 'string',
  })
  public description!: string;

  @Property({
    columnType: 'int',
    comment: 'Maximum number of tasks assigned to the step.',
    type: 'number',
  })
  public max!: number;

  @Property({
    columnType: 'varchar',
    comment: 'Name of the step.',
    length: 100,
    type: 'string',
  })
  public name!: string;

  @Property({
    columnType: 'int',
    comment: 'Step position on the board.',
    type: 'number',
  })
  public position!: number;
}
