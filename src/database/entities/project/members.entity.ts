import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OptionalProps,
  Rel,
} from '@mikro-orm/core';

import { PermissionManagerService } from '~/permissions/services/manager.service';

import { ProjectEntity } from './project.entity';
import { ProjectRolesEntity } from './roles.entity';

import { AuthUserEntity } from '../auth/user.entity';
import { OptionalParentProps, ParentEntity } from '../base.entity';

/**
 * Entity representing users invited to projects.
 */
@Entity({
  comment: 'Users invited to projects.',
  tableName: 'projects_members',
})
export class ProjectMembersEntity extends ParentEntity {
  /**
   * Optional properties that can be set on the entity.
   */
  public [OptionalProps]?: 'permissions' | OptionalParentProps;

  /**
   * Project to which the user is a member.
   */
  @ManyToOne({
    comment: 'Project to which the user is a member.',
    entity: () => ProjectEntity,
    onDelete: 'cascade',
  })
  public project!: Rel<ProjectEntity>;

  /**
   * User member roles in the project.
   */
  @ManyToMany(() => ProjectRolesEntity, (r) => r.members, {
    comment: 'User member roles in the project.',
    owner: true,
  })
  public roles = new Collection<ProjectRolesEntity>(this);

  /**
   * User member of the project.
   */
  @ManyToOne({
    comment: 'User member of the project.',
    entity: () => AuthUserEntity,
    onDelete: 'cascade',
  })
  public user!: Rel<AuthUserEntity>;

  /**
   * Get and manage permissions for the user member based on their roles.
   */
  public async permissions() {
    // Load roles associated with the user member.
    const roles = await this.roles.loadItems();

    // Extract permissions from roles.
    const permissions = roles.flatMap(({ permissions }) => permissions);

    // Create a new PermissionManagerService instance.
    const manager = new PermissionManagerService();

    // Bulk add permissions to the manager.
    manager.bulkAdd(permissions);

    return manager;
  }
}
