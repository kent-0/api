import { Field, ObjectType } from '@nestjs/graphql';

import { BoardMinimalObject } from '~/modules/board/objects/minimal/board.object';
import { BoardTagMinimalObject } from '~/modules/board/objects/minimal/tag.object';
import { BoardTaskMinimalObject } from '~/modules/board/objects/minimal/task.object';

/**
 * The BoardTagObject is a more detailed representation of a board tag, extending from the minimalistic version.
 * Besides the fundamental attributes, it also includes information regarding its relationship with other entities like
 * the board and the tasks it's linked to.
 *
 * This detailed information is vital when there's a need to understand the tag's associations within the system.
 */
@ObjectType({
  description:
    'The object that is returned when a tag is gotten from a board with full details',
})
export class BoardTagObject extends BoardTagMinimalObject {
  /**
   * Reference to the board that this tag is associated with.
   * This helps in determining which board a specific tag belongs to.
   */
  @Field(() => BoardMinimalObject, {
    description: 'The board that the tag belongs to',
  })
  public board!: BoardMinimalObject;

  /**
   * List of all tasks that have been labeled with this tag.
   * This is useful for fetching tasks that have been categorized under a specific tag.
   */
  @Field(() => [BoardTaskMinimalObject], {
    description: 'The tasks that the tag belongs to',
  })
  public tasks!: BoardTaskMinimalObject[];
}
