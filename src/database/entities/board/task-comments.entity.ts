import {
  Collection,
  Entity,
  Enum,
  ManyToOne,
  OneToMany,
  Rel,
} from '@mikro-orm/core';

import { CommentsTypes } from '~/database/enums/comments.enum';

import { BoardTaskEntity } from './task.entity';

import { AuthUserEntity } from '../auth/user.entity';
import { ParentEntity } from '../base.entity';

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
   * Many-to-One relationship with the AuthUserEntity. Indicates the user or member
   * who authored or wrote this specific comment.
   */
  @ManyToOne({
    comment: 'Author of the comment.',
    entity: () => AuthUserEntity,
  })
  public author!: Rel<AuthUserEntity>;

  /**
   * One-to-Many relationship with the same entity, BoardTaskCommentEntity. Represents
   * all the comments that are direct replies to this specific comment.
   */
  @OneToMany({
    comment: 'Replies to this comment.',
    entity: () => BoardTaskCommentEntity,
    mappedBy: 'reply_to',
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
  public reply_to!: BoardTaskCommentEntity;

  /**
   * Many-to-One relationship with the BoardTaskEntity. Indicates the specific task
   * that this comment is associated with.
   */
  @ManyToOne({
    comment: 'Task originating from the comment.',
    entity: () => BoardTaskEntity,
  })
  public task!: Rel<BoardTaskEntity>;

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
