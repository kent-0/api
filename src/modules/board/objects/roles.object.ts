import { Field, ObjectType } from '@nestjs/graphql';

import { BoardMinimalObject } from './minimal/board.object';
import { BoardMembersMinimalObject } from './minimal/member.object';
import { BoardRolesMinimalObject } from './minimal/role.object';

/**
 * The `BoardRolesObject` is an expanded representation of a board's role,
 * detailing not just the role's inherent attributes but also its relationships
 * to both the board and its members. This comprehensive representation is ideal
 * for situations where a detailed understanding of the role's impact and associations
 * within a board is required.
 *
 * The class offers two primary attributes beyond its base (`BoardRolesMinimalObject`):
 * 1. `board`: Represents the board to which the role is assigned. This relationship
 *    solidifies the role's context within the board's structure.
 * 2. `members`: Lists all the board members associated with this role. It provides
 *    insights into which members have been assigned this specific role.
 *
 * By combining these attributes, `BoardRolesObject` provides a holistic view of
 * the board role, making it suitable for detailed role management or analysis tasks.
 *
 * @see BoardRolesMinimalObject - For details about the minimal representation of a board role.
 * @see BoardMinimalObject - For details about the minimal representation of a board.
 * @see BoardMembersMinimalObject - For details about the minimal representation of board members.
 */
@ObjectType({
  description:
    'Object that represents the roles of a board with their relationships.',
})
export class BoardRolesObject extends BoardRolesMinimalObject {
  /**
   * Represents the board to which the role is associated. This relationship
   * clarifies the role's context and its specific placement within the board's
   * hierarchy. It's instrumental in understanding how the role contributes to
   * the board's broader structure and governance.
   */
  @Field(() => BoardMinimalObject, {
    description: 'Board assigned to the role.',
  })
  public board!: BoardMinimalObject;

  /**
   * Lists all members of the board who have been assigned this particular role.
   * This relationship is crucial in understanding the reach and impact of the role
   * within the board, as it directly ties the role to its bearers.
   */
  @Field(() => [BoardMembersMinimalObject], {
    description: 'Board members who have this role.',
  })
  public members!: BoardMembersMinimalObject[];
}
