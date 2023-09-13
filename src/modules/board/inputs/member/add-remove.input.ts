import { Field, InputType } from '@nestjs/graphql';

import { IsUUID } from 'class-validator';

/**
 * `AddRemoveBoardMemberInput` is an input type designed to hold the necessary information
 * when performing operations to add or remove a user from a board within a specific project.
 * This class ensures that the correct board, user, and project are targeted in these operations.
 *
 * Decorators like `@Field` make the properties available for GraphQL operations,
 * while decorators like `@IsUUID` validate the format of the data.
 */
@InputType({
  description:
    'Input details necessary to either add or remove a user from a specific project.',
})
export class AddRemoveBoardMemberInput {
  /**
   * Represents the unique identifier of the board in question.
   * This ID ensures that the targeted board is correctly identified in the operation.
   */
  @Field(() => String, {
    description: 'Id of the board to which the user will be a member.',
  })
  @IsUUID(4, { message: 'The board ID must be a valid UUID.' })
  public boardId!: string;

  /**
   * Represents the unique identifier of the user who is the subject of the operation,
   * either being added to or removed from the board within the specified project.
   */
  @Field(() => String, {
    description:
      'ID of the project in which the board to be managed is located.',
  })
  @IsUUID(4, { message: 'The user ID must be a valid UUID.' })
  public userId!: string;
}
