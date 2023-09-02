import { Entity, Enum, ManyToOne, Rel } from '@mikro-orm/core';

import { CommentsTypes } from '~/database/enums/comments.enum';

import { BoardTaskEntity } from './task.entity';

import { AuthUserEntity } from '../auth/user.entity';
import { ParentEntity } from '../base.entity';

@Entity({
  tableName: 'boards_tasks_comments',
})
export class BoardTaskCommentEntity extends ParentEntity {
  @ManyToOne({
    comment: 'Author of the comment.',
    entity: () => AuthUserEntity,
  })
  public author!: Rel<AuthUserEntity>;

  @ManyToOne({
    comment: 'Task originating from the comment.',
    entity: () => BoardTaskEntity,
  })
  public task!: Rel<BoardTaskEntity>;

  @Enum({
    comment:
      'Whether the comment is a general comment or a reply to a comment.',
    type: 'enum',
  })
  public type!: CommentsTypes;
}
