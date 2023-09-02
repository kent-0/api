import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OptionalProps,
  Rel,
} from '@mikro-orm/core';

import { ProjectEntity } from './project.entity';
import { ProjectRolesEntity } from './roles.entity';

import { AuthUserEntity } from '../auth/user.entity';
import { OptionalParentProps, ParentEntity } from '../base.entity';

@Entity({
  comment: 'Users invited to projects.',
  tableName: 'projects_members',
})
export class ProjectMembersEntity extends ParentEntity {
  public [OptionalProps]?: OptionalParentProps;

  @ManyToOne({
    comment: 'Board to which the user is a member.',
    entity: () => ProjectEntity,
    onDelete: 'cascade',
  })
  public project!: Rel<ProjectEntity>;

  @ManyToMany(() => ProjectRolesEntity, (r) => r.members, {
    comment: 'User member roles in the board.',
    owner: true,
  })
  public roles = new Collection<ProjectRolesEntity>(this);

  @ManyToOne({
    comment: 'User member of the board.',
    entity: () => AuthUserEntity,
    onDelete: 'cascade',
  })
  public user!: Rel<AuthUserEntity>;
}
