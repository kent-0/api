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
 * Entity representing comments made by members on tasks.
 */
@Entity({
  comment: 'Comments made by members on tasks.',
  tableName: 'boards_tasks_comments',
})
export class BoardTaskCommentEntity extends ParentEntity {
  /**
   * Author of the comment.
   */
  @ManyToOne({
    comment: 'Author of the comment.',
    entity: () => AuthUserEntity,
  })
  public author!: Rel<AuthUserEntity>;

  /**
   * Replies to this comment.
   */
  @OneToMany({
    comment: 'Replies to this comment.',
    entity: () => BoardTaskCommentEntity,
    mappedBy: 'reply_to',
  })
  public replies = new Collection<BoardTaskCommentEntity>(this);

  /**
   * Comment to which this comment is replying.
   */
  @ManyToOne({
    comment: 'Comment to which this comment is replying.',
    entity: () => BoardTaskCommentEntity,
    nullable: true,
  })
  public reply_to!: BoardTaskCommentEntity;

  /**
   * Task originating from the comment.
   */
  @ManyToOne({
    comment: 'Task originating from the comment.',
    entity: () => BoardTaskEntity,
  })
  public task!: Rel<BoardTaskEntity>;

  /**
   * Whether the comment is a general comment or a reply to a comment.
   */
  @Enum({
    comment:
      'Whether the comment is a general comment or a reply to a comment.',
    type: 'enum',
  })
  public type!: CommentsTypes;
}
