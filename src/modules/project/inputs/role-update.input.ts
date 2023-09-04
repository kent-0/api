import { Field, InputType } from '@nestjs/graphql';

@InputType({
  description: 'Input to update roles for projects.',
})
export class UpdateProjectRoleInput {
  @Field(() => String, {
    description: 'Role name.',
    nullable: true,
  })
  public name?: string;

  @Field(() => Number, {
    description: 'Role permissions bit.',
    nullable: true,
  })
  public permissions?: number;

  @Field(() => String, {
    description: 'ID of the role to update.',
  })
  public roleId!: string;
}
