import { Field, ID, InputType } from '@nestjs/graphql';

/**
 * Represents the necessary input details required to delete a specific board.
 * This input type captures the unique identifiers for both the board and the associated project.
 * Ensuring the presence of both IDs helps in maintaining data integrity and prevents accidental deletions.
 *
 * The `@InputType()` decorator indicates that this class will be used in GraphQL mutations to gather
 * the required information from the client.
 */
@InputType({
  description: 'Input to remove a board.',
})
export class BoardRemoveInput {
  /**
   * Represents the unique identifier of the board that is intended for deletion.
   * This ID is crucial to ensure that the correct board is targeted for deletion.
   *
   * @type {string}
   * @description ID of the board to delete.
   * @required
   */
  @Field(() => ID, {
    description: 'ID of the board to delete.',
  })
  public boardId!: string;

  /**
   * Represents the unique identifier of the project associated with the board.
   * This ID is used for cross-verification purposes to ensure that the board is associated
   * with the specified project. This extra check provides an added layer of safety against
   * unintended deletions.
   *
   * @type {string}
   * @description ID of the project to which the board belongs.
   * @required
   */
  @Field(() => ID, {
    description: 'ID of the project to which the board belongs.',
  })
  public projectId!: string;
}
