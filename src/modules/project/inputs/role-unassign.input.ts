import { Field, InputType } from '@nestjs/graphql';

import { IsUUID } from 'class-validator';

/**
 * Input type to unassign a project role from a member.
 */
@InputType({
  description: 'Unassign a project role to a member.',
})
export class UnassignProjectRoleInput {
  /**
   * Project member ID. This is different from the user ID itself.
   */
  @Field(() => String, {
    description:
      'Project member ID. This is different from the user ID itself.',
  })
  @IsUUID(4, { message: 'The member ID must be a valid UUID.' })
  public memberId!: string;

  /**
   * Project to which the role is unassigned.
   */
  @Field(() => String, {
    description: 'Project to which the role is unassigned.',
  })
  @IsUUID(4, { message: 'The project ID must be a valid UUID.' })
  public projectId!: string;

  /**
   * ID of the role to unassign. This must exist as a role at the project level.
   */
  @Field(() => String, {
    description:
      'ID of the role to unassign. This must exist as a role at the project level.',
  })
  @IsUUID(4, { message: 'The role ID must be a valid UUID.' })
  public roleId!: string;
}
