import { Field, InputType } from '@nestjs/graphql';

import { IsString, IsUUID, MaxLength } from 'class-validator';

@InputType({
  description: 'Update project of boards.',
})
export class UpdateProjectInput {
  @Field({
    description: 'Brief description of what the project will be about.',
  })
  @IsString({ message: 'The project description must be a text string.' })
  @MaxLength(300, {
    message: 'The project name cannot be longer than 300 characters.',
  })
  public description!: string;

  @Field({
    description: 'ID of the project.',
  })
  @IsUUID(4, { message: 'The project ID must be a valid UUID.' })
  public id!: string;

  @Field({
    description: 'Name for the new project.',
  })
  @IsString({ message: 'The project name must be a text string.' })
  @MaxLength(50, {
    message: 'The project name cannot be longer than 50 characters.',
  })
  public name!: string;
}
