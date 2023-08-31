import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  Property,
  Rel,
} from '@mikro-orm/core';

import { ParentEntity } from '../base.entity';
import { BoardEntity } from './board.entity';
import { BoardMembersEntity } from './members.entity';

@Entity({
  comment:
    'Roles to manage the boards. Role permissions use the bit-based permission system.',
  tableName: 'boards_roles',
})
export class BoardRolesEntity extends ParentEntity {
  @ManyToOne({
    comment:
      'Board assigned to the role. When the board is removed, its available roles are also removed.',
    entity: () => BoardEntity,
    onDelete: 'cascade',
  })
  public board: Rel<BoardEntity>;

  @ManyToMany(() => BoardMembersEntity, (member) => member.roles, {
    comment: 'Board members who have this role.',
  })
  public members = new Collection<BoardMembersEntity>(this);

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
