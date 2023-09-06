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
 * Entity representing boards within a project management system.
 * Each board can have multiple members, associated roles, and specific steps or stages
 * that tasks go through. The board also has a creator and is associated with a specific project.
 */
@Entity({
  comment: 'Task table information.',
  tableName: 'boards',
})
export class BoardEntity extends ParentEntity {
  /**
   * Defines the optional properties that can be set on this entity, which includes
   * any optional properties from the parent entity.
   */
  public [OptionalProps]?: OptionalParentProps;

  /**
   * Many-to-One relationship with the AuthUserEntity. Indicates the user who created
   * the board. If this user is deleted, the board will also be removed.
   */
  @ManyToOne({
    comment:
      'Creator of the board. When the user is deleted, the associated dashboard is also deleted.',
    entity: () => AuthUserEntity,
    onDelete: 'cascade',
  })
  public created_by!: Rel<AuthUserEntity>;

  /**
   * A textual description providing an overview or purpose of the board.
   */
  @Property({
    columnType: 'varchar',
    comment: 'Brief description of the board.',
    length: 500,
  })
  public description!: string;

  /**
   * One-to-Many relationship with the BoardMembersEntity. Represents all the users
   * who have been assigned to this board, either as contributors or viewers.
   */
  @OneToMany(() => BoardMembersEntity, (m) => m.board, {
    comment: 'Users assigned to the board.',
  })
  public members = new Collection<Rel<BoardMembersEntity>>(this);

  /**
   * The name of the board, providing a quick identifier for users.
   */
  @Property({
    columnType: 'varchar',
    comment: 'Name of the board.',
    length: 100,
  })
  public name!: string;

  /**
   * Many-to-One relationship with the ProjectEntity. Represents the project
   * to which this board belongs.
   */
  @ManyToOne({
    comment: 'Project owner of the board.',
    entity: () => ProjectEntity,
  })
  public project!: Rel<ProjectEntity>;

  /**
   * One-to-Many relationship with the BoardRolesEntity. Represents the different roles
   * or permissions that users can have within this board. For example, some users might
   * be administrators, while others are regular members.
   */
  @OneToMany(() => BoardRolesEntity, (r) => r.board, {
    comment: 'Roles to manage the board.',
  })
  public roles = new Collection<Rel<BoardMembersEntity>>(this);

  /**
   * One-to-Many relationship with the BoardStepEntity. Represents the different stages
   * or steps that tasks on this board will go through. For example, a board might have steps
   * like "To Do", "In Progress", and "Completed".
   */
  @OneToMany(() => BoardStepEntity, (s) => s.board, {
    comment: 'Steps that manage the board.',
  })
  public steps = new Collection<Rel<BoardStepEntity>>(this);
}
