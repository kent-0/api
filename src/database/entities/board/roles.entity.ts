import { Entity, ManyToOne, Property, Rel } from '@mikro-orm/core';

import { ParentEntity } from '../base.entity';
import { BoardEntity } from './board.entity';

@Entity({
  comment:
    'Roles to manage the boards. Role permissions use the bit-based permission system.',
  tableName: 'board_roles',
})
export class RolesEntity extends ParentEntity {
  @ManyToOne({
    comment:
      'Board assigned to the role. When the board is removed, its available roles are also removed.',
    entity: () => BoardEntity,
    onDelete: 'cascade',
  })
  public board: Rel<BoardEntity>;

  @Property({
    columnType: 'varchar',
    comment: 'Name representing the role.',
    length: 50,
    type: 'string',
  })
  public name: string;

  @Property({
    columnType: 'numeric',
    comment: 'Role bit-based permissions',
    type: 'numeric',
  })
  public permissions: number;
}
