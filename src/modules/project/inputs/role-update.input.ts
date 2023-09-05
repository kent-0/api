import { Field, InputType } from '@nestjs/graphql';

import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

/**
 * Input type to update roles for projects.
 */
@InputType({
  description: 'Input to update roles for projects.',
})
export class UpdateProjectRoleInput {
  /**
   * Role name.
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
   * Role permissions bit.
   */
  @Field(() => Number, {
    description: 'Role permissions bit.',
    nullable: true,
  })
  @IsNumber({}, { message: 'Permissions must be in bit format.' })
  @IsOptional()
  public permissions?: number;

  /**
   * Project to which the role is unassigned.
   */
  @Field(() => String, {
    description: 'Project to which the role is unassigned.',
  })
  @IsUUID(4, { message: 'The project ID must be a valid UUID.' })
  public projectId!: string;

  /**
   * ID of the role to update.
   */
  @Field(() => String, {
    description: 'ID of the role to update.',
  })
  @IsUUID(4, { message: 'The role ID must be a valid UUID.' })
  public roleId!: string;
}
