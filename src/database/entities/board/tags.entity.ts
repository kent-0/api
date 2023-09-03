import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OptionalProps,
  Property,
  Rel,
} from '@mikro-orm/core';

import { BoardTaskEntity } from './task.entity';

import { AuthUserEntity } from '../auth/user.entity';
import { OptionalParentProps, ParentEntity } from '../base.entity';

/**
 * Entity representing tags to assign to tasks.
 */
@Entity({
  comment: 'Tags to assign to tasks.',
  tableName: 'boards_tags',
})
export class BoardTagsEntity extends ParentEntity {
  /**
   * Optional properties that can be set on the entity.
   */
  public [OptionalProps]?: 'color' | OptionalParentProps;

  /**
   * Custom color to display in the tag view.
   */
  @Property({
    check: "color ~* '#[A-Za-z0-9]{1,6}'",
    columnType: 'varchar',
    comment: 'Custom color to display in the tag view.',
    nullable: true,
    type: 'string',
  })
  public color!: string;

  /**
   * Member who created the tag.
   */
  @ManyToOne({
    comment: 'Member who created the tag.',
    entity: () => AuthUserEntity,
  })
  public created_by!: Rel<AuthUserEntity>;

  /**
   * Brief description of what the tag is about.
   */
  @Property({
    columnType: 'varchar',
    comment: 'Brief description of what the tag is about.',
    length: 300,
    nullable: true,
    type: 'string',
  })
  public description!: string;

  /**
   * Name of the tag.
   */
  @Property({
    columnType: 'varchar',
    comment: 'Name of the tag.',
    length: 100,
    type: 'string',
  })
  public name!: string;

  /**
   * Tasks with the assigned tag.
   */
  @ManyToMany(() => BoardTaskEntity, (t) => t.tags, {
    comment: 'Tasks with the assigned tag.',
  })
  public tasks = new Collection<BoardTaskEntity>(this);
}
