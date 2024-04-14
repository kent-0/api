import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OptionalProps,
  Property,
  Rel,
} from '@mikro-orm/core';

import { type OptionalParentProps, ParentEntity } from '../parent.entity';

import { ProjectMembersEntity } from './members.entity';
import { ProjectEntity } from './project.entity';

/**
 * Represents a role within a project. Roles define the permissions and responsibilities of project members.
 * The permissions associated with roles utilize a bit-based permission system.
 */
@Entity({
  comment:
    'Roles to manage the projects. Role permissions use the bit-based permission system.',
  tableName: 'projects_roles',
})
export class ProjectRolesEntity extends ParentEntity {
  /**
   * List of optional properties that can be set for this entity.
   * These can include members and any properties inherited from the parent entity.
   */
  public [OptionalProps]?: 'members' | OptionalParentProps;

  /**
   * Collection of project members associated with this particular role.
   * A member can have multiple roles and a role can be associated with multiple members.
   */
  @ManyToMany(() => ProjectMembersEntity, (m) => m.roles, {
    comment: 'Project members who have this role.',
  })
  public members = new Collection<ProjectMembersEntity>(this);

  /**
   * Descriptive name for the role, which indicates its purpose or function within the project.
   */
  @Property({
    columnType: 'varchar',
    comment: 'Name representing the role.',
    length: 50,
    type: 'string',
  })
  public name!: string;

  /**
   * Bit-based permissions that are denied to this role.
   * Each bit in this numeric value represents a specific permission, allowing for efficient representation and checking of multiple permissions.
   */
  @Property({
    columnType: 'numeric',
    comment: 'Role bit-based permissions that are denied.',
    type: 'numeric',
  })
  public permissions_denied!: number;

  /**
   * Bit-based permissions associated with this role.
   * Each bit in this numeric value represents a specific permission, allowing for efficient representation and checking of multiple permissions.
   */
  @Property({
    columnType: 'numeric',
    comment: 'Role bit-based permissions',
    type: 'numeric',
  })
  public permissions_granted!: number;

  /**
   * Position of the role in the project.
   */
  @Property({
    columnType: 'numeric',
    comment: 'Position of the role in the project.',
    type: 'numeric',
  })
  public position!: number;

  /**
   * The specific project that this role is associated with.
   * If the project is deleted, all roles associated with that project will also be removed due to the cascade delete.
   */
  @ManyToOne({
    comment:
      'Project assigned to the role. When the project is removed, its available roles are also removed.',
    deleteRule: 'cascade',
    entity: () => ProjectEntity,
  })
  public project!: Rel<ProjectEntity>;
}
