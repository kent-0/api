import { Field, InputType } from '@nestjs/graphql';

import { IsUUID } from 'class-validator';

/**
 * Input type for assigning a project role to a member.
 */
@InputType({
  description: 'Assign a project role to a member.',
})
export class AssignProjectRoleInput {
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
   * Project to which the role is assigned.
   */
  @Field(() => String, {
    description: 'Project to which the role is assigned.',
  })
  @IsUUID(4, { message: 'The project ID must be a valid UUID.' })
  public projectId!: string;

  /**
   * ID of the role to assign. This must exist as a role at the project level.
   */
  @Field(() => String, {
    description:
      'ID of the role to assign. This must exist as a role at the project level.',
  })
  @IsUUID(4, { message: 'The role ID must be a valid UUID.' })
  public roleId!: string;
}
