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

/**
 * Entity representing roles to manage the boards.
 */
@Entity({
  comment:
    'Roles to manage the boards. Role permissions use the bit-based permission system.',
  tableName: 'boards_roles',
})
export class BoardRolesEntity extends ParentEntity {
  /**
   * Optional properties that can be set on the entity.
   */
  public [OptionalProps]?: OptionalParentProps;

  /**
   * Board assigned to the role. Available roles are removed when the board is removed.
   */
  @ManyToOne({
    comment:
      'Board assigned to the role. When the board is removed, its available roles are also removed.',
    entity: () => BoardEntity,
    onDelete: 'cascade',
  })
  public board!: Rel<BoardEntity>;

  /**
   * Board members who have this role.
   */
  @ManyToMany(() => BoardMembersEntity, (m) => m.roles, {
    comment: 'Board members who have this role.',
  })
  public members = new Collection<BoardMembersEntity>(this);

  /**
   * Name representing the role.
   */
  @Property({
    columnType: 'varchar',
    comment: 'Name representing the role.',
    length: 50,
    type: 'string',
  })
  public name!: string;

  /**
   * Role bit-based permissions.
   */
  @Property({
    columnType: 'numeric',
    comment: 'Role bit-based permissions',
    type: 'numeric',
  })
  public permissions!: number;
}
