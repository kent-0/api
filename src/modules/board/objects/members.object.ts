import { Field, ObjectType } from '@nestjs/graphql';

import { BoardMinimalObject } from './board-minimal.object';
import { BoardMembersMinimalObject } from './members-minimal.object';

/**
 * The `BoardsMembersObject` class provides a comprehensive representation of a board member
 * within a specific board context. While the base class (`BoardMembersMinimalObject`)
 * offers essential details about the member, this extended representation also includes
 * the specific board to which the user belongs. This relationship allows for clearer
 * understanding and management of board members.
 *
 * The primary attribute introduced in this class is:
 * 1. `board`: Denotes the board to which the user is a member. This relationship
 *    provides clarity regarding the user's board-specific membership, allowing for
 *    better member management within a board context.
 *
 * By combining the base attributes with the `board` relationship, `BoardsMembersObject`
 * offers a holistic view of a board member's association, making it ideal for
 * member management or analysis tasks within a board.
 *
 * @see BoardMembersMinimalObject - For details about the minimal representation of a board member.
 * @see BoardMinimalObject - For details about the minimal representation of a board.
 */
@ObjectType({
  description: 'Object representing users invited to boards.',
})
export class BoardMembersObject extends BoardMembersMinimalObject {
  /**
   * Represents the specific board to which the user is associated as a member.
   * This relationship offers clarity on the user's membership context, highlighting
   * their role and association within the board's structure. It's instrumental in
   * understanding the user's placement and contribution within the board.
   */
  @Field(() => BoardMinimalObject, {
    description: 'Board to which the user is a member.',
  })
  public board!: BoardMinimalObject;
}
