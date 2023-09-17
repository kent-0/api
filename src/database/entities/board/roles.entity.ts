import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OptionalProps,
  Property,
  Rel,
} from '@mikro-orm/core';

import {
  BoardEntity,
  BoardMembersEntity,
  OptionalParentProps,
  ParentEntity,
} from '..';

/**
 * Entity representing different roles within the board management system.
 * Each role has specific permissions, and these permissions are represented using a bit-based system.
 * Users are assigned roles, and these roles dictate what actions they can perform on a board.
 */
@Entity({
  comment:
    'Roles to manage the boards. Role permissions use the bit-based permission system.',
  tableName: 'boards_roles',
})
export class BoardRolesEntity extends ParentEntity {
  /**
   * Defines the optional properties that can be set on this entity, which includes
   * any optional properties from the parent entity.
   */
  public [OptionalProps]?: OptionalParentProps;

  /**
   * Many-to-One relationship with the BoardEntity. Indicates the specific board
   * to which this role applies. If a board is deleted, all associated roles are also removed.
   */
  @ManyToOne({
    comment:
      'Board assigned to the role. When the board is removed, its available roles are also removed.',
    entity: () => BoardEntity,
    onDelete: 'cascade',
  })
  public board!: Rel<BoardEntity>;

  /**
   * Many-to-Many relationship with the BoardMembersEntity. Represents all the users
   * who have been assigned this specific role on the associated board.
   */
  @ManyToMany(() => BoardMembersEntity, (m) => m.roles, {
    comment: 'Board members who have this role.',
    inverseJoinColumn: 'member_id',
  })
  public members = new Collection<BoardMembersEntity>(this);

  /**
   * The name of the role, which provides a human-readable identifier for the role's purpose or permissions.
   */
  @Property({
    columnType: 'varchar',
    comment: 'Name representing the role.',
    length: 50,
    type: 'string',
  })
  public name!: string;

  /**
   * The bit-based permissions associated with this role. This numeric value is used
   * to determine what actions a user with this role can perform on the board.
   */
  @Property({
    columnType: 'numeric',
    comment: 'Role bit-based permissions',
    type: 'numeric',
  })
  public permissions!: number;
}
