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
import { BoardStepEntity } from './steps.entity';

import { AuthUserEntity } from '../auth/user.entity';
import { OptionalParentProps, ParentEntity } from '../base.entity';
import { ProjectEntity } from '../project/project.entity';

/**
 * Entity containing information about tasks and boards.
 */
@Entity({
  comment: 'Task table information.',
  tableName: 'boards',
})
export class BoardEntity extends ParentEntity {
  /**
   * Optional properties that can be set on the entity.
   */
  public [OptionalProps]?: OptionalParentProps;

  /**
   * Creator of the board. Associated dashboard is also deleted when the user is deleted.
   */
  @ManyToOne({
    comment:
      'Creator of the board. When the user is deleted, the associated dashboard is also deleted.',
    entity: () => AuthUserEntity,
    onDelete: 'cascade',
  })
  public created_by!: Rel<AuthUserEntity>;

  /**
   * Brief description of the board.
   */
  @Property({
    columnType: 'varchar',
    comment: 'Brief description of the board.',
    length: 500,
  })
  public description!: string;

  /**
   * Users assigned to the board.
   */
  @OneToMany(() => BoardMembersEntity, (m) => m.board, {
    comment: 'Users assigned to the board.',
  })
  public members = new Collection<Rel<BoardMembersEntity>>(this);

  /**
   * Name of the board.
   */
  @Property({
    columnType: 'varchar',
    comment: 'Name of the board.',
    length: 100,
  })
  public name!: string;

  /**
   * Project owner of the board.
   */
  @ManyToOne({
    comment: 'Project owner of the board.',
    entity: () => ProjectEntity,
  })
  public project!: Rel<ProjectEntity>;

  /**
   * Roles to manage the board.
   */
  @OneToMany(() => BoardRolesEntity, (r) => r.board, {
    comment: 'Roles to manage the board.',
  })
  public roles = new Collection<Rel<BoardMembersEntity>>(this);

  /**
   * Steps that manage the board.
   */
  @OneToMany(() => BoardStepEntity, (s) => s.board, {
    comment: 'Steps that manage the board.',
  })
  public steps = new Collection<Rel<BoardStepEntity>>(this);
}
