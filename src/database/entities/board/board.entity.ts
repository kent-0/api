import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  OptionalProps,
  Property,
  Rel,
} from '@mikro-orm/core';

import { BoardMembersEntity } from './members.entity';
import { BoardRolesEntity } from './roles.entity';
import { BoardStepsEntity } from './steps.entity';

import { AuthUserEntity } from '../auth/user.entity';
import { OptionalParentProps, ParentEntity } from '../base.entity';
import { ProjectEntity } from '../project/project.entity';

@Entity({
  comment: 'Task table information.',
  tableName: 'boards',
})
export class BoardEntity extends ParentEntity {
  public [OptionalProps]?: OptionalParentProps;

  @ManyToOne({
    comment:
      'Creator of the board. When the user is deleted, the associated dashboard is also deleted.',
    entity: () => AuthUserEntity,
    onDelete: 'cascade',
  })
  public created_by!: Rel<AuthUserEntity>;

  @Property({
    columnType: 'varchar',
    comment: 'Brief description of the board.',
    length: 500,
  })
  public description!: string;

  @OneToMany(() => BoardMembersEntity, (m) => m.board, {
    comment: 'Users assigned to the board.',
  })
  public members = new Collection<BoardMembersEntity>(this);

  @Property({
    columnType: 'varchar',
    comment: 'Name of the board.',
    length: 100,
  })
  public name!: string;

  @ManyToOne({
    comment: 'Project owner of the board.',
    entity: () => ProjectEntity,
  })
  public project!: Rel<ProjectEntity>;

  @OneToMany(() => BoardRolesEntity, (r) => r.board, {
    comment: 'Roles to manage the board.',
  })
  public roles = new Collection<BoardRolesEntity>(this);

  @OneToMany(() => BoardStepsEntity, (s) => s.board, {
    comment: 'Steps manage the board.',
  })
  public steps = new Collection<BoardStepsEntity>(this);
}
