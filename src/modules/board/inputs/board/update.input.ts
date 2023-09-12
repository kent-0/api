import { Field, ID, InputType } from '@nestjs/graphql';

/**
 * `BoardUpdateInput` is a GraphQL input type that captures the necessary data
 * for updating an existing board's details on the platform.
 *
 * It includes details such as the board's unique identifier, its name,
 * a brief description of its purpose, and the project it belongs to.
 * This input type is primarily used in GraphQL mutations when a user
 * wants to modify the details of a specific board.
 */
@InputType({
  description: 'Input to update an existing board with new data.',
})
export class BoardUpdateInput {
  /**
   * Represents the unique identifier of the board that is intended for
   * updating. This ensures that the correct board is targeted for changes.
   *
   * @type {string}
   * @description The unique identifier for the board.
   * @required
   */
  @Field(() => ID, {
    description: 'ID of the board to update.',
  })
  public boardId!: string;

  /**
   * Provides a brief description about the board, outlining its
   * objectives, importance, or any other relevant details.
   *
   * @type {string}
   * @description A brief explanation of the board's purpose.
   */
  @Field(() => String, {
    description: 'Brief explanation of what the board will be about.',
    nullable: true,
  })
  public description?: string;

  /**
   * Represents the name of the board. This is a short, recognizable title
   * that gives users a quick idea of the board's intent or theme.
   *
   * @type {string}
   * @description The title or name of the board.
   */
  @Field(() => String, {
    description: "Board's name.",
    nullable: true,
  })
  public name?: string;
}
