import { Field, InputType } from '@nestjs/graphql';

import { IsNumber, IsString, IsUUID, MaxLength } from 'class-validator';

@InputType({
  description: 'Input to update roles for projects.',
})
export class UpdateProjectRoleInput {
  @Field(() => String, {
    description: 'Role name.',
    nullable: true,
  })
  @IsString()
  @MaxLength(50, {
    message: 'The role name must not exceed 50 characters.',
  })
  public name?: string;

  @Field(() => Number, {
    description: 'Role permissions bit.',
    nullable: true,
  })
  @IsNumber({}, { message: 'Permissions must be in bit format.' })
  public permissions?: number;

  @Field(() => String, {
    description: 'ID of the role to update.',
  })
  @IsUUID(4, { message: 'The role ID must be a valid UUID.' })
  public roleId!: string;
}
