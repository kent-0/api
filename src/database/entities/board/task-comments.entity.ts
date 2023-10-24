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

import { CommentsTypes } from '~/database/enums/comments.enum';

import {
  AuthUserEntity,
  BoardTaskEntity,
  OptionalParentProps,
  ParentEntity,
} from '..';

/**
 * Entity representing different comments that members can make on tasks.
 * Comments can be standalone or replies to other comments, and each comment is associated
 * with a specific task and author.
 */
@Entity({
  comment: 'Comments made by members on tasks.',
  tableName: 'boards_tasks_comments',
})
export class BoardTaskCommentEntity extends ParentEntity {
  /**
   * Defines the optional properties that can be set on this entity, including reply_to and
   * any optional properties from the parent entity.
   */
  public [OptionalProps]?: 'reply_to' | OptionalParentProps;

  /**
   * Many-to-One relationship with the AuthUserEntity. Indicates the user or member
   * who authored or wrote this specific comment.
   */
  @ManyToOne({
    comment: 'Author of the comment.',
    entity: () => AuthUserEntity,
  })
  public author!: Rel<AuthUserEntity>;

  /**
   * Content of the comment.
   */
  @Property({
    comment: 'Content of the comment.',
    length: 1000,
    type: 'varchar',
  })
  public content!: string;

  /**
   * One-to-Many relationship with the same entity, BoardTaskCommentEntity. Represents
   * all the comments that are direct replies to this specific comment.
   */
  @OneToMany(() => BoardTaskCommentEntity, (comment) => comment.reply_to, {
    comment: 'Replies to this comment.',
    entity: () => BoardTaskCommentEntity,
  })
  public replies = new Collection<BoardTaskCommentEntity>(this);

  /**
   * Many-to-One relationship with the same entity, BoardTaskCommentEntity. If this comment
   * is a reply, this property points to the original comment to which this comment is responding.
   */
  @ManyToOne({
    comment: 'Comment to which this comment is replying.',
    entity: () => BoardTaskCommentEntity,
    nullable: true,
  })
  public reply_to?: BoardTaskCommentEntity;

  /**
   * Many-to-One relationship with the BoardTaskEntity. Indicates the specific task
   * that this comment is associated with.
   */
  @ManyToOne({
    comment: 'Task originating from the comment.',
    entity: () => BoardTaskEntity,
    nullable: true,
  })
  public task?: Rel<BoardTaskEntity>;

  /**
   * Enum property indicating the type of comment. It can be a general comment
   * or a reply to another comment.
   */
  @Enum({
    comment:
      'Whether the comment is a general comment or a reply to a comment.',
    type: 'enum',
  })
  public type!: CommentsTypes;
}
