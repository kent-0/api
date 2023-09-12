import { Field, ID, InputType } from '@nestjs/graphql';

/**
 * `BoardGetInput` defines the shape of the input expected when a user or client
 * wants to retrieve information about a specific board in the system.
 * This input type ensures that clients provide both the board's unique identifier
 * and the project's identifier it belongs to. Both fields are essential to correctly
 * identify the board in the context of a project.
 */
@InputType({
  description: 'Input to get a board.',
})
export class BoardGetInput {
  /**
   * The unique identifier for the board. This is essential for fetching the correct board
   * details from the database. Typically, this would be a UUID that is generated when the
   * board is first created.
   *
   * @type {string}
   * @description ID of the board to retrieve.
   * @required
   */
  @Field(() => ID, {
    description: 'ID of the board to get.',
  })
  public boardId!: string;

  /**
   * The unique identifier for the project to which the board belongs. This is necessary
   * to ensure that the board is being fetched within the context of a specific project.
   * It also ensures that boards with similar IDs across different projects are correctly
   * differentiated.
   *
   * @type {string}
   * @description ID of the project to which the board is associated.
   * @required
   */
  @Field(() => ID, {
    description: 'ID of the project to which the board belongs.',
  })
  public projectId!: string;
}
