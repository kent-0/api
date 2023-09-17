import { Field, ID, InputType } from '@nestjs/graphql';

import { IsUUID } from 'class-validator';

/**
 * Represents the input structure required when removing roles associated with a board.
 * This input type is designed for GraphQL operations that involve the removal of a role's association from a board.
 *
 * The structure captures the essential identifiers: the board's ID and the role's ID.
 * These identifiers ensure that the correct role is disassociated within the context of the appropriate board.
 */
@InputType({
  description: 'Input to remove roles for boards.',
})
export class BoardRoleRemoveInput {
  /**
   * The unique identifier of the board from which the targeted role will be removed.
   * This ID ensures that operations are executed on the intended board.
   */
  @Field(() => ID, {
    description: 'Board from which the role will be removed.',
  })
  @IsUUID(4, { message: 'The board ID must be a valid UUID.' })
  public boardId!: string;

  /**
   * Represents the unique identifier of the role intended for removal.
   * This ID is vital as it specifies the exact role on the board that the user aims to remove.
   */
  @Field(() => ID, {
    description: 'ID of the role to remove.',
  })
  @IsUUID(4, { message: 'The role ID must be a valid UUID.' })
  public roleId!: string;
}
