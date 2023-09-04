import { Field, InputType } from '@nestjs/graphql';

@InputType({
  description: 'Assign a project role to a member.',
})
export class AssignProjectRoleInput {
  @Field(() => String, {
    description:
      'Project member ID. This is different from the user ID itself.',
  })
  public memberId!: string;

  @Field(() => String, {
    description: 'Project to which the role is assigned.',
  })
  public projectId!: string;

  @Field(() => String, {
    description:
      'ID of the role to assign. This must exist as a role at the project level.',
  })
  public roleId!: string;
}
