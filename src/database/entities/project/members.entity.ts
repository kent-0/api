import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OptionalProps,
  Rel,
} from '@mikro-orm/core';

import {
  AuthUserEntity,
  OptionalParentProps,
  ParentEntity,
  ProjectEntity,
  ProjectRolesEntity,
} from '~/database/entities';
import { PermissionManagerService } from '~/permissions/services/manager.service';

/**
 * The `ProjectMembersEntity` entity captures the relationship between a user and a project.
 * Each instance represents a user who has been invited to participate in a specific project.
 * The user's roles within that project are also captured, which will determine their
 * permissions and capabilities within the project.
 */
@Entity({
  comment: 'Users invited to projects.',
  tableName: 'projects_members',
})
export class ProjectMembersEntity extends ParentEntity {
  /**
   * Optional properties that can be set for this entity. The permissions are derived
   * from the roles and might not be directly stored within the entity.
   */
  public [OptionalProps]?: 'permissions' | OptionalParentProps;

  /**
   * Many-to-One relationship representing the project to which the user has been invited.
   * If the project is deleted, all associated memberships will be removed.
   */
  @ManyToOne({
    comment: 'Project to which the user is a member.',
    deleteRule: 'cascade',
    entity: () => ProjectEntity,
  })
  public project!: Rel<ProjectEntity>;

  /**
   * Many-to-Many relationship capturing the roles assigned to the user within the project.
   * Each role can have associated permissions that define what the user can and cannot do.
   */
  @ManyToMany(() => ProjectRolesEntity, (r) => r.members, {
    comment: 'User member roles in the project.',
    owner: true,
  })
  public roles = new Collection<ProjectRolesEntity>(this);

  /**
   * Many-to-One relationship linking the user to the membership record.
   * If the user is deleted, their membership records across projects will also be removed.
   */
  @ManyToOne({
    comment: 'User member of the project.',
    deleteRule: 'cascade',
    entity: () => AuthUserEntity,
  })
  public user!: Rel<AuthUserEntity>;

  /**
   * This method allows retrieving and managing the permissions associated with the
   * user's roles in the project. It first loads the roles, extracts the permissions,
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
