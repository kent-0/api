import { Field, InputType } from '@nestjs/graphql';

import { IsString, MaxLength } from 'class-validator';

/**
 * Input type for creating a new project.
 */
@InputType({
  description: 'Create project to manage boards.',
})
export class CreateProjectInput {
  /**
   * Brief description of what the project will be about.
   */
  @Field({
    description: 'Brief description of what the project will be about.',
  })
  @IsString({ message: 'The project description must be a text string.' })
  @MaxLength(300, {
    message: 'The project description cannot be longer than 300 characters.',
  })
  public description!: string;

  /**
   * Name for the new project.
   */
  @Field({
    description: 'Name for the new project.',
  })
  @IsString({ message: 'The project name must be a text string.' })
  @MaxLength(50, {
    message: 'The project name cannot be longer than 50 characters.',
  })
  public name!: string;
}
