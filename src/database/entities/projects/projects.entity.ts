import {
  Collection,
  Entity,
  Enum,
  ManyToOne,
  OneToMany,
  Property,
  Rel,
} from '@mikro-orm/core';

import { ProjectStatus } from '~/database/enums/status.enum';

import { ProjectGoalsEntity } from './goals.entity';
import { ProjectMembersEntity } from './members.entity';
import { ProjectRolesEntity } from './roles.entity';

import { AuthUserEntity } from '../auth/user.entity';
import { ParentEntity } from '../base.entity';

@Entity({
  comment: 'Projects to manage and group boards.',
  tableName: 'projects',
})
export class ProjectEntity extends ParentEntity {
  @Property({
    comment: 'Brief description of what the project is about.',
    length: 300,
    type: 'varchar',
  })
  public description!: string;

  @Property({
    columnType: 'timestamp',
    comment: 'Expected completion date for the project.',
    nullable: true,
  })
  public end_date!: Date;

  @OneToMany(() => ProjectGoalsEntity, (g) => g.project, {
    comment: 'Goals assigned to the project.',
  })
  public goals!: Rel<ProjectGoalsEntity>;

  @OneToMany(() => ProjectMembersEntity, (m) => m.project, {
    comment: 'Users invited to the project.',
  })
  public members = new Collection<ProjectMembersEntity>(this);

  @Property({
    comment: "Project's name.",
    length: 50,
    type: 'varchar',
  })
  public name!: string;

  @ManyToOne({
    comment:
      'Project owner user. If the owner deletes his account, the projects will also be affected.',
    entity: () => AuthUserEntity,
    onDelete: 'cascade',
  })
  public owner!: Rel<AuthUserEntity>;

  @OneToMany(() => ProjectRolesEntity, (r) => r.project, {
    comment: 'Roles to manage the project and boards.',
  })
  public roles = new Collection<ProjectRolesEntity>(this);

  @Property({
    columnType: 'timestamp',
    comment:
      'Project start date. By default it is not set until the project is marked as in progress.',
    type: 'date',
  })
  public start_date!: Date;

  @Enum({
    comment: 'Current status of the project.',
    items: () => ProjectStatus,
    type: 'enum',
  })
  public status = ProjectStatus.Planned;
}
