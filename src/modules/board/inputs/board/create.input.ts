import { Field, ID, InputType } from '@nestjs/graphql';

/**
 * Represents the input structure required to create a new board associated with a specific project.
 * Boards are typically used in project management applications to organize tasks, discussions, or
 * other related items. When creating a board, it's essential to provide a brief description, a name for
 * the board, and the ID of the project to which the board belongs. This class ensures that clients
 * provide all necessary details for board creation when used in a GraphQL mutation.
 */
@InputType({
  description: 'Input to create a board with basic data.',
})
export class BoardCreateInput {
  /**
   * Provides a brief overview or explanation of the board. This helps team members
   * or other stakeholders understand the board's purpose or objective at a glance.
   */
  @Field(() => String, {
    description: 'Brief explanation of what the board will be about.',
  })
  public description!: string;

  /**
   * Represents the name of the board. A clear and concise name can help in quickly
   * identifying the board's objective or theme among a list of other boards.
   */
  @Field(() => String, {
    description: "Board's name.",
  })
  public name!: string;

  /**
   * The unique ID of the project with which this board is associated. This ensures the board
   * is linked to the correct project, keeping the project's boards organized and structured.
   */
  @Field(() => ID, {
    description: 'ID of the project to which the board will be assigned.',
  })
  public projectId!: string;
}
