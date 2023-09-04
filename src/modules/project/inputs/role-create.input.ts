import { Field, InputType } from '@nestjs/graphql';

@InputType({
  description: 'Input to create roles for projects.',
})
export class CreateProjectRoleInput {
  @Field(() => String, {
    description: 'Role name.',
  })
  public name!: string;

  @Field(() => Number, {
    description: 'Role permissions bit.',
  })
  public permissions!: number;

  @Field(() => String, {
    description: 'Project to which the role is assigned.',
  })
  public projectId!: string;
}
