import { Field, InputType } from '@nestjs/graphql';

import { IsNumber, IsString, IsUUID, MaxLength } from 'class-validator';

@InputType({
  description: 'Input to create roles for projects.',
})
export class CreateProjectRoleInput {
  @Field(() => String, {
    description: 'Role name.',
  })
  @IsString()
  @MaxLength(50, {
    message: 'The role name must not exceed 50 characters.',
  })
  public name!: string;

  @Field(() => Number, {
    description: 'Role permissions bit.',
  })
  @IsNumber({}, { message: 'Permissions must be in bit format.' })
  public permissions!: number;

  @Field(() => String, {
    description: 'Project to which the role is assigned.',
  })
  @IsUUID(4, { message: 'The project ID must be a valid UUID.' })
  public projectId!: string;
}
