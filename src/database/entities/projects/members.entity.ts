import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OptionalProps,
  Rel,
} from '@mikro-orm/core';

import { ProjectEntity } from './projects.entity';
import { BoardRolesEntity } from './roles.entity';

import { AuthUserEntity } from '../auth/user.entity';
import { OptionalParentProps, ParentEntity } from '../base.entity';

@Entity({
  comment: 'Users invited to projects.',
  tableName: 'project_members',
})
export class ProjectMembersEntity extends ParentEntity {
  public [OptionalProps]?: OptionalParentProps;

  @ManyToOne({
    comment: 'Board to which the user is a member.',
    entity: () => ProjectEntity,
  })
  public project!: Rel<ProjectEntity>;

  @ManyToMany(() => BoardRolesEntity, (role) => role.members, {
    comment: 'User member roles in the board.',
    owner: true,
  })
  public roles = new Collection<BoardRolesEntity>(this);

  @ManyToOne({
    comment: 'User member of the board.',
    entity: () => AuthUserEntity,
  })
  public user!: Rel<AuthUserEntity>;
}
