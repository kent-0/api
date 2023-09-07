import { Field, InputType } from '@nestjs/graphql';

import { IsUUID } from 'class-validator';

/**
 * The UnassignProjectRoleInput class provides a structured format
 * for specifying which project role should be removed from a particular member.
 * By making use of decorators, this class ensures that all provided data
 * (such as the member ID, project ID, and role ID) are valid and formatted correctly.
 *
 * This class aids in unassigning a role from a member within the context of
 * a specific project. This is important to ensure that users have the appropriate
 * permissions in projects and are not mistakenly given access to features or data
 * they shouldn't have.
 */
@InputType({
  description: 'Unassign a project role to a member.',
})
export class UnassignProjectRoleInput {
  /**
   * Represents the unique identifier of the member within the project context.
   * This is different from the general user ID, allowing for more specific
   * assignment and unassignment of roles within projects. By specifying the
   * member ID, the system can determine which user's role needs updating within
   * the project.
   */
  @Field(() => String, {
    description:
      'Project member ID. This is different from the user ID itself.',
  })
  @IsUUID(4, { message: 'The member ID must be a valid UUID.' })
  public memberId!: string;

  /**
   * This field captures the unique identifier of the project from which
   * the role is being unassigned. Specifying the project ID ensures that
   * the role is removed in the correct project context, preventing accidental
   * changes in other projects.
   */
  @Field(() => String, {
    description: 'Project to which the role is unassigned.',
  })
  @IsUUID(4, { message: 'The project ID must be a valid UUID.' })
  public projectId!: string;

  /**
   * Represents the unique identifier of the role that is being unassigned.
   * This ensures that the correct role is being removed, preventing unintended
   * changes to a member's permissions.
   */
  @Field(() => String, {
    description:
      'ID of the role to unassign. This must exist as a role at the project level.',
  })
  @IsUUID(4, { message: 'The role ID must be a valid UUID.' })
  public roleId!: string;
}
