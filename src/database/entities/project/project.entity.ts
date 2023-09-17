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

import {
  AuthUserEntity,
  BoardEntity,
  OptionalParentProps,
  ParentEntity,
  ProjectGoalsEntity,
  ProjectMembersEntity,
  ProjectNotesEntity,
  ProjectRolesEntity,
} from '..';

/**
 * Represents a project entity used to manage and group boards.
 */
@Entity({
  comment: 'Projects to manage and group boards.',
  tableName: 'projects',
})
export class ProjectEntity extends ParentEntity {
  /**
   * Properties that may be optionally set on this entity.
   * These can include boards, end date, goals, members, notes, roles, start date, status, and any properties from the parent entity.
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
   * A collection of boards that are associated with this project.
   */
  @OneToMany(() => BoardEntity, (r) => r.project, {
    comment: 'Boards created for the project.',
  })
  public boards = new Collection<Rel<BoardEntity>>(this);

  /**
   * Provides a brief description outlining the main objectives or theme of the project.
   */
  @Property({
    comment: 'Brief description of what the project is about.',
    length: 300,
    type: 'varchar',
  })
  public description!: string;

  /**
   * The anticipated date when the project is expected to be completed.
   */
  @Property({
    columnType: 'timestamp',
    comment: 'Expected completion date for the project.',
    nullable: true,
  })
  public end_date!: Date;

  /**
   * A collection of goals that have been assigned to this project.
   * Goals outline specific targets or milestones the project aims to achieve.
   */
  @OneToMany(() => ProjectGoalsEntity, (g) => g.project, {
    comment: 'Goals assigned to the project.',
  })
  public goals = new Collection<Rel<ProjectGoalsEntity>>(this);

  /**
   * A collection of users who have been invited to participate or collaborate on this project.
   */
  @OneToMany(() => ProjectMembersEntity, (m) => m.project, {
    comment: 'Users invited to the project.',
  })
  public members = new Collection<Rel<ProjectMembersEntity>>(this);

  /**
   * The official name of the project.
   */
  @Property({
    comment: "Project's name.",
    length: 50,
    type: 'varchar',
  })
  public name!: string;

  /**
   * A collection of notes related to the project.
   * Notes can include additional information, updates, or reminders.
   */
  @OneToMany(() => ProjectNotesEntity, (n) => n.project, {
    comment: 'Notes assigned to the project.',
  })
  public notes = new Collection<Rel<ProjectNotesEntity>>(this);

  /**
   * The user who owns or initiated the project.
   * Important: If the owner user account is deleted, any projects associated with that user will also be removed.
   */
  @ManyToOne({
    comment:
      'Project owner user. If the owner deletes their account, the projects will also be affected.',
    entity: () => AuthUserEntity,
    onDelete: 'cascade',
  })
  public owner!: Rel<AuthUserEntity>;

  /**
   * A collection of roles associated with this project.
   * Roles define the permissions and responsibilities of users within the project and its associated boards.
   */
  @OneToMany(() => ProjectRolesEntity, (r) => r.project, {
    comment: 'Roles to manage the project and boards.',
  })
  public roles = new Collection<Rel<ProjectRolesEntity>>(this);

  /**
   * The date when the project officially begins.
   * This date is typically set when the project transitions from planning to active development or execution.
   */
  @Property({
    columnType: 'timestamp',
    comment:
      'Project start date. By default, it is not set until the project is marked as in progress.',
    nullable: true,
    type: 'date',
  })
  public start_date!: Date;

  /**
   * Reflects the current phase or stage of the project.
   * This can be planned, in progress, completed, etc.
   */
  @Enum({
    comment: 'Current status of the project.',
    items: () => ProjectStatus,
    type: 'enum',
  })
  public status = ProjectStatus.Planned;
}
