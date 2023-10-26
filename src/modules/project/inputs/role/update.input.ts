import { Field, ID, InputType } from '@nestjs/graphql';

import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

/**
 * The `UpdateProjectRoleInput` class provides a structured format for the
 * input data required to update a role within a specific project. It allows
 * for the updating of role name and permissions, while also specifying
 * the project context and the specific role to be updated.
 *
 * This class is important to ensure that updates to roles are done with
 * precision, maintaining data integrity and ensuring that users' permissions
 * within projects are accurately represented.
 */
@InputType({
  description: 'Input to update roles for projects.',
})
export class ProjectRoleUpdateInput {
  /**
   * Represents the name of the role that is to be updated.
   * It's an optional field, meaning that if not provided, the role's name
   * remains unchanged.
   */
  @Field(() => String, {
    description: 'Role name.',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50, {
    message: 'The role name must not exceed 50 characters.',
  })
  public name?: string;

  /**
   * The permissions associated with the role are represented as a bit.
   * This provides a compact and efficient way of representing multiple
   * permissions. For instance, each bit in the number could represent a
   * specific permission and the value (0 or 1) indicates whether the role
   * has that permission or not.
   */
  @Field(() => Number, {
    description: 'Role permissions bit.',
    nullable: true,
  })
  @IsNumber({}, { message: 'Permissions must be in bit format.' })
  public permissions_denied?: number;

  /**
   * The permissions associated with the role are represented as a bit.
   * This provides a compact and efficient way of representing multiple
   * permissions. For instance, each bit in the number could represent a
   * specific permission and the value (0 or 1) indicates whether the role
   * has that permission or not.
   */
  @Field(() => Number, {
    description: 'Role permissions bit.',
    nullable: true,
  })
  @IsNumber({}, { message: 'Permissions must be in bit format.' })
  public permissions_granted?: number;

  /**
   * Position of the role in the project.
   */
  @Field(() => Number, {
    description: 'Position of the role in the project.',
    nullable: true,
  })
  public position?: number;

  /**
   * Specifies the unique identifier of the project in which the role exists.
   * This ensures that the role update is executed in the correct project context.
   */
  @Field(() => ID, {
    description: 'Project to which the role is unassigned.',
  })
  @IsUUID(4, { message: 'The project ID must be a valid UUID.' })
  public projectId!: string;

  /**
   * This field captures the unique identifier of the role to be updated.
   * By specifying the role ID, it ensures that the correct role is updated
   * and prevents unintended changes to other roles.
   */
  @Field(() => ID, {
    description: 'ID of the role to update.',
  })
  @IsUUID(4, { message: 'The role ID must be a valid UUID.' })
  public roleId!: string;
}
