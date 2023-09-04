import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OptionalProps,
  Property,
  Rel,
} from '@mikro-orm/core';

import { ProjectMembersEntity } from './members.entity';
import { ProjectEntity } from './project.entity';

import { OptionalParentProps, ParentEntity } from '../base.entity';

/**
 * Entity representing roles to manage the projects. Role permissions use the bit-based permission system.
 */
@Entity({
  comment:
    'Roles to manage the projects. Role permissions use the bit-based permission system.',
  tableName: 'projects_roles',
})
export class ProjectRolesEntity extends ParentEntity {
  /**
   * Optional properties that can be set on the entity.
   */
  public [OptionalProps]?: 'members' | OptionalParentProps;

  /**
   * Project members who have this role.
   */
  @ManyToMany(() => ProjectMembersEntity, (m) => m.roles, {
    comment: 'Project members who have this role.',
    inverseJoinColumn: 'member_id',
  })
  public members = new Collection<ProjectMembersEntity>(this);

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

  /**
   * Project assigned to the role. When the project is removed, its available roles are also removed.
   */
  @ManyToOne({
    comment:
      'Project assigned to the role. When the project is removed, its available roles are also removed.',
    entity: () => ProjectEntity,
    onDelete: 'cascade',
  })
  public project!: Rel<ProjectEntity>;
}
