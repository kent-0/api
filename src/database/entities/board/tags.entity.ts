import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  Property,
  Rel,
} from '@mikro-orm/core';

import { BoardTaskEntity } from './task.entity';

import { AuthUserEntity } from '../auth/user.entity';
import { ParentEntity } from '../base.entity';

@Entity({
  comment: 'Tags to assign to tasks.',
  tableName: 'boards_tags',
})
export class BoardTagsEntity extends ParentEntity {
  @Property({
    check: "color ~* '#[A-Za-z0-9]{1,6}'",
    columnType: 'varchar',
    comment: 'Custom color to display in the tag view.',
    type: 'string',
  })
  public color!: string;

  @ManyToOne({
    comment: 'Member who created the tag.',
    entity: () => AuthUserEntity,
  })
  public created_by!: Rel<AuthUserEntity>;

  @Property({
    columnType: 'varchar',
    comment: 'Brief description of what the tag is about.',
    length: 300,
    nullable: true,
    type: 'string',
  })
  public description!: string;

  @Property({
    columnType: 'varchar',
    comment: 'Name of the tag.',
    length: 100,
    type: 'string',
  })
  public name!: string;

  @ManyToMany(() => BoardTaskEntity, (t) => t.tags, {
    comment: 'Tasks with the assigned tag.',
  })
  public tasks = new Collection<BoardTaskEntity>(this);
}
