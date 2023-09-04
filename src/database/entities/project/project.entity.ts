import {
  Collection,
  Entity,
  Enum,
  ManyToOne,
  OneToMany,
  OptionalProps,
  Property,
  Rel,
} from '@mikro-orm/core';

import { ProjectStatus } from '~/database/enums/status.enum';

import { ProjectGoalsEntity } from './goals.entity';
import { ProjectMembersEntity } from './members.entity';
import { ProjectNotesEntity } from './notes.entity';
import { ProjectRolesEntity } from './roles.entity';

import { AuthUserEntity } from '../auth/user.entity';
import { OptionalParentProps, ParentEntity } from '../base.entity';
import { BoardEntity } from '../board/board.entity';

/**
 * Entity representing projects to manage and group boards.
 */
@Entity({
  comment: 'Projects to manage and group boards.',
  tableName: 'projects',
})
export class ProjectEntity extends ParentEntity {
  /**
   * Optional properties that can be set on the entity.
   */
  public [OptionalProps]?:
    | 'boards'
    | 'end_date'
    | 'goals'
    | 'members'
    | 'notes'
    | 'roles'
    | 'start_date'
    | 'status'
    | OptionalParentProps;

  /**
   * Boards created for the project.
   */
  @OneToMany(() => BoardEntity, (r) => r.project, {
    comment: 'Boards created for the project.',
  })
  public boards = new Collection<BoardEntity>(this);

  /**
   * Brief description of what the project is about.
   */
  @Property({
    comment: 'Brief description of what the project is about.',
    length: 300,
    type: 'varchar',
  })
  public description!: string;

  /**
   * Expected completion date for the project.
   */
  @Property({
    columnType: 'timestamp',
    comment: 'Expected completion date for the project.',
    nullable: true,
  })
  public end_date!: Date;

  /**
   * Goals assigned to the project.
   */
  @OneToMany(() => ProjectGoalsEntity, (g) => g.project, {
    comment: 'Goals assigned to the project.',
  })
  public goals!: Rel<ProjectGoalsEntity>;

  /**
   * Users invited to the project.
   */
  @OneToMany(() => ProjectMembersEntity, (m) => m.project, {
    comment: 'Users invited to the project.',
  })
  public members = new Collection<ProjectMembersEntity>(this);

  /**
   * Project's name.
   */
  @Property({
    comment: "Project's name.",
    length: 50,
    type: 'varchar',
  })
  public name!: string;

  /**
   * Notes assigned to the project.
   */
  @OneToMany(() => ProjectNotesEntity, (n) => n.project, {
    comment: 'Notes assigned to the project.',
  })
  public notes!: Rel<ProjectNotesEntity>;

  /**
   * Project owner user. If the owner deletes their account, the projects will also be affected.
   */
  @ManyToOne({
    comment:
      'Project owner user. If the owner deletes their account, the projects will also be affected.',
    entity: () => AuthUserEntity,
    onDelete: 'cascade',
  })
  public owner!: Rel<AuthUserEntity>;

  /**
   * Roles to manage the project and boards.
   */
  @OneToMany(() => ProjectRolesEntity, (r) => r.project, {
    comment: 'Roles to manage the project and boards.',
  })
  public roles = new Collection<ProjectRolesEntity>(this);

  /**
   * Project start date. By default, it is not set until the project is marked as in progress.
   */
  @Property({
    columnType: 'timestamp',
    comment:
      'Project start date. By default, it is not set until the project is marked as in progress.',
    type: 'date',
  })
  public start_date!: Date;

  /**
   * Current status of the project.
   */
  @Enum({
    comment: 'Current status of the project.',
    items: () => ProjectStatus,
    type: 'enum',
  })
  public status = ProjectStatus.Planned;
}
