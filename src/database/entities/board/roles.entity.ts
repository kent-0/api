import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OptionalProps,
  Property,
  Rel,
} from '@mikro-orm/core';

import { BoardEntity } from './board.entity';
import { BoardMembersEntity } from './members.entity';

import { OptionalParentProps, ParentEntity } from '../base.entity';

@Entity({
  comment:
    'Roles to manage the boards. Role permissions use the bit-based permission system.',
  tableName: 'boards_roles',
})
export class BoardRolesEntity extends ParentEntity {
  public [OptionalProps]?: OptionalParentProps;

  @ManyToOne({
    comment:
      'Board assigned to the role. When the board is removed, its available roles are also removed.',
    entity: () => BoardEntity,
    onDelete: 'cascade',
  })
  public board!: Rel<BoardEntity>;

  @ManyToMany(() => BoardMembersEntity, (m) => m.roles, {
    comment: 'Board members who have this role.',
  })
  public members = new Collection<BoardMembersEntity>(this);

  @Property({
    columnType: 'varchar',
    comment: 'Name representing the role.',
    length: 50,
    type: 'string',
  })
  public name!: string;

  @Property({
    columnType: 'numeric',
    comment: 'Role bit-based permissions',
    type: 'numeric',
  })
  public permissions!: number;
}
