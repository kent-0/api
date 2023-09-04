import { Field, InputType } from '@nestjs/graphql';

@InputType({
  description: 'Create or update project to manage boards.',
})
export class CreateUpdateProjectInput {
  @Field({
    description: 'Brief description of what the project will be about.',
  })
  public description!: string;

  @Field({
    description: 'Name for the new project.',
  })
  public name!: string;
}
