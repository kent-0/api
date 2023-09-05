import { Field, InputType } from '@nestjs/graphql';

import { IsString, MaxLength } from 'class-validator';

@InputType({
  description: 'Create project to manage boards.',
})
export class CreateProjectInput {
  @Field({
    description: 'Brief description of what the project will be about.',
  })
  @IsString({ message: 'The project description must be a text string.' })
  @MaxLength(300, {
    message: 'The project name cannot be longer than 300 characters.',
  })
  public description!: string;

  @Field({
    description: 'Name for the new project.',
  })
  @IsString({ message: 'The project name must be a text string.' })
  @MaxLength(50, {
    message: 'The project name cannot be longer than 50 characters.',
  })
  public name!: string;
}
