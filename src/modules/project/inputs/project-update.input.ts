import { Field, InputType } from '@nestjs/graphql';

import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

/**
 * This class defines the shape and validation rules for the input data
 * required to update an existing project. The input type is primarily used
 * within GraphQL mutations for project updates.
 *
 * The class ensures that the project name and description, if provided,
 * are strings and that they don't exceed their respective maximum lengths.
 * Moreover, the project ID is mandatory and should be a valid UUID.
 */
@InputType({
  description: 'Update project of boards.',
})
export class UpdateProjectInput {
  /**
   * This field captures an updated brief description of the project.
   * It should provide context about the project's purpose or goals.
   * This updated description can help realign team members and
   * stakeholders with the project's evolving intent.
   *
   * The description, if provided, must be a text string and its
   * length should not exceed 300 characters.
   */
  @Field({
    description: 'Brief description of what the project will be about.',
    nullable: true,
  })
  @IsOptional()
  @IsString({ message: 'The project description must be a text string.' })
  @MaxLength(300, {
    message: 'The project description cannot be longer than 300 characters.',
  })
  public description?: string;

  /**
   * This field represents the unique identifier of the project that
   * needs to be updated. It's mandatory for locating the project
   * within the database and applying the necessary changes.
   *
   * The ID must be a valid UUID.
   */
  @Field({
    description: 'ID of the project.',
  })
  @IsUUID(4, { message: 'The project ID must be a valid UUID.' })
  public id!: string;

  /**
   * This field captures the updated name of the project. Like the
   * initial project name, this should be concise and reflective
   * of the project's nature or purpose.
   *
   * The name, if provided, must be a text string and its length
   * should not exceed 50 characters.
   */
  @Field({
    description: 'Name for the new project.',
    nullable: true,
  })
  @IsOptional()
  @IsString({ message: 'The project name must be a text string.' })
  @MaxLength(50, {
    message: 'The project name cannot be longer than 50 characters.',
  })
  public name?: string;
}
