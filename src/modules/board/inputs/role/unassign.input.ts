import { Field, ID, InputType } from '@nestjs/graphql';

import { IsUUID } from 'class-validator';

/**
 * Represents the structured input data required to unassign a role from a member on a board.
 * This class captures essential identifiers, including the board, member, and role, to facilitate
 * the accurate and specific removal of a role assignment. By using this structured input, the system
 * can ensure that the correct member-role relationship is targeted for unassignment within the
 * context of the specified board.
 */
@InputType({
  description: 'Unassign a board role to a member.',
})
export class BoardRoleUnassignInput {
  /**
   * Unique identifier for the board from which a role is to be unassigned.
   * This ensures the unassignment process is scoped to the correct board.
   *
   * @type {string}
   * @required
   */
  @Field(() => ID, {
    description: 'Board to which the role is unassigned.',
  })
  @IsUUID(4, { message: 'The board ID must be a valid UUID.' })
  public boardId!: string;

  /**
   * Unique identifier for the member whose role is to be unassigned on the board.
   * This ID distinguishes the member from other users, ensuring the right individual
   * is targeted for role unassignment.
   *
   * @type {string}
   * @required
   */
  @Field(() => ID, {
    description: 'Board member ID. This is different from the user ID itself.',
  })
  @IsUUID(4, { message: 'The member ID must be a valid UUID.' })
  public memberId!: string;

  /**
   * Unique identifier for the role to be unassigned.
   * This ensures that the exact role is unassigned from the member, preserving any other roles
   * they might have on the board.
   *
   * @type {string}
   * @required
   */
  @Field(() => ID, {
    description:
      'ID of the role to unassign. This must exist as a role at the board level.',
  })
  @IsUUID(4, { message: 'The role ID must be a valid UUID.' })
  public roleId!: string;
}
