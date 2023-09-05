import { Field, InputType } from '@nestjs/graphql';

import { IsUUID } from 'class-validator';

/**
 * The AssignProjectRoleInput class defines the shape and validation rules for the
 * input data required when assigning a role to a member within a project. The input type
 * is primarily used within GraphQL mutations to manage role assignments.
 *
 * The class ensures that the provided IDs for the member, project, and role are all
 * valid UUIDs. This ensures the correct linking of members to roles within the scope
 * of a particular project.
 */
@InputType({
  description: 'Assign a project role to a member.',
})
export class AssignProjectRoleInput {
  /**
   * This field represents the unique identifier of a project member.
   * It's important to note that this ID is specific to the member's
   * association with a particular project and is not the same as the user's
   * global ID. It's used to uniquely identify the member within the project.
   */
  @Field(() => String, {
    description:
      'Project member ID. This is different from the user ID itself.',
  })
  @IsUUID(4, { message: 'The member ID must be a valid UUID.' })
  public memberId!: string;

  /**
   * This field represents the unique identifier of the project in which
   * the role will be assigned to the member. It is used to ensure that
   * the member and the role are associated within the correct project context.
   */
  @Field(() => String, {
    description: 'Project to which the role is assigned.',
  })
  @IsUUID(4, { message: 'The project ID must be a valid UUID.' })
  public projectId!: string;

  /**
   * This field captures the unique identifier of the role that will be
   * assigned to the member. This ID should correspond to a valid role
   * that exists at the project level. It ensures that the member is
   * granted the correct set of permissions and responsibilities.
   */
  @Field(() => String, {
    description:
      'ID of the role to assign. This must exist as a role at the project level.',
  })
  @IsUUID(4, { message: 'The role ID must be a valid UUID.' })
  public roleId!: string;
}
