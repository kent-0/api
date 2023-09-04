import { Field, InputType } from '@nestjs/graphql';

@InputType({
  description: 'Update project of boards.',
})
export class UpdateProjectInput {
  @Field({
    description: 'Brief description of what the project will be about.',
  })
  public description!: string;

  @Field({
    description: 'ID of the project.',
  })
  public id!: string;

  @Field({
    description: 'Name for the new project.',
  })
  public name!: string;
}
