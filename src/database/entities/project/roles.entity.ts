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

@Entity({
  comment:
    'Roles to manage the projects. Role permissions use the bit-based permission system.',
  tableName: 'projects_roles',
})
export class ProjectRolesEntity extends ParentEntity {
  public [OptionalProps]?: OptionalParentProps;

  @ManyToMany(() => ProjectMembersEntity, (m) => m.roles, {
    comment: 'Project members who have this role.',
  })
  public members = new Collection<ProjectMembersEntity>(this);

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

  @ManyToOne({
    comment:
      'Project assigned to the role. When the board is removed, its available roles are also removed.',
    entity: () => ProjectEntity,
    onDelete: 'cascade',
  })
  public project!: Rel<ProjectEntity>;
}
