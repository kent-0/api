import { Entity, Enum, Property } from '@mikro-orm/core';

import { ProjectStatus } from '~/database/enums/status.enum';

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
    columnType: 'datetime',
    comment: 'Expected completion date for the project.',
    nullable: true,
  })
  public end_date!: Date;

  @Property({
    comment: "Project's name.",
    length: 50,
    type: 'varchar',
  })
  public name!: string;

  @Property({
    columnType: 'datetime',
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
  public status = ProjectStatus.NotEstablished;
}
