import { Field, InputType } from '@nestjs/graphql';

import { IsUUID } from 'class-validator';

/**
 * Represents the structured data required to assign a role to a board member.
 * This class provides a structured way to pass necessary data during GraphQL mutations
 * that deal with assigning roles to board members. It ensures that the board, member,
 * and role identifiers are provided in the correct format and context.
 */
@InputType({
  description: 'Assign a role to a member of a board.',
})
export class BoardRoleAssignInput {
  /**
   * Unique identifier for the board where the role will be assigned.
   * This ensures that the role is being assigned within the correct board context.
   *
   * @type {string}
   * @required
   */
  @Field(() => String, {
    description: 'Board to which the role is assigned.',
  })
  @IsUUID(4, { message: 'The board ID must be a valid UUID.' })
  public boardId!: string;

  /**
   * Represents the unique identifier for a board member.
   * It's important to note that this is distinct from a user's general ID.
   * This identifier represents a member's association with a specific board.
   * It ensures that the role is being assigned to the right member within the board's context.
   *
   * @type {string}
   * @required
   */
  @Field(() => String, {
    description: 'Board member ID. This is different from the user ID itself.',
  })
  @IsUUID(4, { message: 'The member ID must be a valid UUID.' })
  public memberId!: string;

  /**
   * Unique identifier for the role that is intended to be assigned.
   * This ensures that the role being assigned exists at the board level
   * and is appropriate for the given context.
   *
   * @type {string}
   * @required
   */
  @Field(() => String, {
    description:
      'ID of the role to assign. This must exist as a role at the board level.',
  })
  @IsUUID(4, { message: 'The role ID must be a valid UUID.' })
  public roleId!: string;
}
