import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OptionalProps,
  Rel,
} from '@mikro-orm/core';

import { PermissionManagerService } from '~/permissions/services/manager.service';

import {
  AuthUserEntity,
  BoardEntity,
  BoardRolesEntity,
  OptionalParentProps,
  ParentEntity,
} from '..';

/**
 * Entity representing the association between users and boards within a board management system.
 * Each association indicates that a user is a member of a specific board and can have one or more
 * roles within that board.
 */
@Entity({
  comment: 'Users assigned to boards.',
  tableName: 'boards_members',
})
export class BoardMembersEntity extends ParentEntity {
  /**
   * Defines the optional properties that can be set on this entity, which includes
   * any optional properties from the parent entity.
   */
  public [OptionalProps]?: OptionalParentProps;

  /**
   * Many-to-One relationship with the BoardEntity. Indicates the specific board
   * to which this user has been assigned.
   */
  @ManyToOne({
    comment: 'Board to which the user is a member.',
    deleteRule: 'cascade',
    entity: () => BoardEntity,
  })
  public board!: Rel<BoardEntity>;

  /**
   * Many-to-Many relationship with the BoardRolesEntity. Represents all the roles
   * or permissions that this user has on the associated board. For example, the user
   * might be an administrator or a regular member.
   */
  @ManyToMany(() => BoardRolesEntity, (r) => r.members, {
    comment: 'User member roles in the board.',
    joinColumn: 'role_id',
    owner: true,
  })
  public roles = new Collection<BoardRolesEntity>(this);

  /**
   * Many-to-One relationship with the AuthUserEntity. Represents the specific user
   * who is a member of the associated board.
   */
  @ManyToOne({
    comment: 'User member of the board.',
    entity: () => AuthUserEntity,
  })
  public user!: Rel<AuthUserEntity>;

  /**
   * This method allows retrieving and managing the permissions associated with the
   * user's roles in the board. It first loads the roles, extracts the permissions,
   * and then uses the `PermissionManagerService` to manage and query these permissions.
   *
   * @returns PermissionManagerService instance loaded with the user's permissions.
   */
  public async permissions() {
    const roles = await this.roles.loadItems();
    const manager = new PermissionManagerService();
    const rolesSorted = roles.sort((a, b) => b.position - a.position);

    for (const role of rolesSorted) {
      manager.add(role.permissions_granted);
      manager.remove(role.permissions_denied);
    }

    return manager;
  }
}
