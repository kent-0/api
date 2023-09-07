import { Field, InputType } from '@nestjs/graphql';

import { IsString, MaxLength } from 'class-validator';

/**
 * This class defines the shape and validation rules for the input data
 * required to create a new project. The input type is primarily used
 * within GraphQL mutations for project creation.
 *
 * It ensures that both the project name and description are strings
 * and that they don't exceed their respective maximum lengths.
 */
@InputType({
  description:
    'Input details necessary for creating a new project that will manage boards.',
})
export class CreateProjectInput {
  /**
   * This field captures a brief description of the project. It provides
   * context about the project's purpose or goals. This description helps
   * team members and other stakeholders understand the project's intent.
   *
   * The description must be a text string and its length should not exceed
   * 300 characters.
   */
  @Field({
    description:
      'A concise summary of the project, providing context on its goals or purpose. Must be a text string and not exceed 300 characters.',
  })
  @IsString({ message: 'The project description must be a text string.' })
  @MaxLength(300, {
    message: 'The project description cannot be longer than 300 characters.',
  })
  public description!: string;

  /**
   * This field represents the name of the project. It acts as a unique identifier
   * for the project within an organization or team. The name should be concise
   * and reflect the project's nature or purpose.
   *
   * The name must be a text string and its length should not exceed 50 characters.
   */
  @Field({
    description:
      'Unique name for the project, reflecting its nature or purpose within an organization or team. Must be a text string and not exceed 50 characters.',
  })
  @IsString({ message: 'The project name must be a text string.' })
  @MaxLength(50, {
    message: 'The project name cannot be longer than 50 characters.',
  })
  public name!: string;
}
