import { Field, ObjectType } from '@nestjs/graphql';

import { BoardTaskMinimalObject } from '~/modules/board/objects/minimal/task.object';
import { BoardTaskCommentMinimalObject } from '~/modules/board/objects/minimal/task-comment.object';

@ObjectType({
  description: 'Object representing a comment on a task with full details.',
})
export class BoardTaskCommentObject extends BoardTaskCommentMinimalObject {
  /**
   * The task to which the comment belongs.
   * This provides context about the task the comment is associated with.
   */
  @Field(() => BoardTaskMinimalObject, {
    description: 'The task to which the comment belongs.',
    nullable: true,
  })
  public task?: BoardTaskMinimalObject;
}
