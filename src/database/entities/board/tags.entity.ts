import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OptionalProps,
  Property,
  Rel,
} from '@mikro-orm/core';

import {
  AuthUserEntity,
  BoardEntity,
  BoardTaskEntity,
  OptionalParentProps,
  ParentEntity,
} from '..';

/**
 * Entity representing different tags or labels that can be assigned to tasks within a board.
 * Tags are used to categorize or highlight specific tasks, making it easier to manage and identify them.
 */
@Entity({
  comment: 'Tags to assign to tasks.',
  tableName: 'boards_tags',
})
export class BoardTagsEntity extends ParentEntity {
  /**
   * Defines the optional properties that can be set on this entity, including
   * a custom color for the tag and any optional properties from the parent entity.
   */
  public [OptionalProps]?: OptionalParentProps;

  /**
   * Many-to-One relationship indicating the board in which this tag resides.
   */
  @ManyToOne({
    comment: 'Board on which tasks are assigned.',
    entity: () => BoardEntity,
  })
  public board!: Rel<BoardEntity>;

  /**
   * An optional color associated with this tag, which provides a visual cue when displayed
   * on tasks. The color is expected to be in a standard hex format.
   */
  @Property({
    check: "color ~* '#[A-Za-z0-9]{1,6}'",
    columnType: 'varchar',
    comment: 'Custom color to display in the tag view.',
    nullable: true,
    type: 'string',
  })
  public color?: string;

  /**
   * Many-to-One relationship with the AuthUserEntity. Indicates the user or member
   * who created or introduced this specific tag.
   */
  @ManyToOne({
    comment: 'Member who created the tag.',
    entity: () => AuthUserEntity,
  })
  public created_by!: Rel<AuthUserEntity>;

  /**
   * A textual description providing more details or context about this specific tag.
   */
  @Property({
    columnType: 'varchar',
    comment: 'Brief description of what the tag is about.',
    length: 300,
    nullable: true,
    type: 'string',
  })
  public description?: string;

  /**
   * The name of the tag, which provides a quick identifier for users.
   */
  @Property({
    columnType: 'varchar',
    comment: 'Name of the tag.',
    length: 100,
    type: 'string',
  })
  public name!: string;

  /**
   * Many-to-Many relationship with the BoardTaskEntity. Represents all the tasks
   * that have been assigned this specific tag.
   */
  @ManyToMany(() => BoardTaskEntity, (t) => t.tags, {
    comment: 'Tasks with the assigned tag.',
  })
  public tasks = new Collection<BoardTaskEntity>(this);
}
