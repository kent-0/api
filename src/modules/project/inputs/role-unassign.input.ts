import { Field, InputType } from '@nestjs/graphql';

@InputType({
  description: 'Unassign a project role to a member.',
})
export class UnassignProjectRoleInput {
  @Field(() => String, {
    description:
      'Project member ID. This is different from the user ID itself.',
  })
  public memberId!: string;

  @Field(() => String, {
    description: 'Project to which the role is unassigned.',
  })
  public projectId!: string;

  @Field(() => String, {
    description:
      'ID of the role to unassign. This must exist as a role at the project level.',
  })
  public roleId!: string;
}
