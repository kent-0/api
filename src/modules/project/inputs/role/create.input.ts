import { Field, InputType } from '@nestjs/graphql';

import { IsNumber, IsString, IsUUID, MaxLength } from 'class-validator';

/**
 * The ProjectCreateRole class provides a structure and validation for the
 * input data when creating a new role for a project. In a role-based access control
 * system, roles are assigned to users and these roles have specific permissions
 * associated with them. This input type aids in the creation of such roles with
 * their associated permissions.
 *
 * The input ensures that the role name adheres to specific length constraints,
 * the permissions are represented in a bit format, and the project ID is a valid
 * UUID. This ensures the integrity and correctness of the data when creating new roles.
 */
@InputType({
  description: 'Input to create roles for projects.',
})
export class ProjectCreateRole {
  /**
   * This field represents the name given to the role. The name serves as an
   * identifier and may be used for display purposes in user interfaces. It
   * aids in distinguishing one role from another.
   */
  @Field(() => String, {
    description: 'Role name.',
  })
  @IsString()
  @MaxLength(50, {
    message: 'The role name must not exceed 50 characters.',
  })
  public name!: string;

  /**
   * The permissions associated with the role are represented as a bit.
   * This provides a compact and efficient way of representing multiple
   * permissions. For instance, each bit in the number could represent a
   * specific permission and the value (0 or 1) indicates whether the role
   * has that permission or not.
   */
  @Field(() => Number, {
    description: 'Role permissions bit.',
  })
  @IsNumber({}, { message: 'Permissions must be in bit format.' })
  public permissions!: number;

  /**
   * This field captures the unique identifier of the project for which
   * the role is being created. This ensures that the role is created
   * in the correct project context and can be used to assign members
   * within that project.
   */
  @Field(() => String, {
    description: 'Project to which the role is assigned.',
  })
  @IsUUID(4, { message: 'The project ID must be a valid UUID.' })
  public projectId!: string;
}
