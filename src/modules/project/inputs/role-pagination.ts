import { Field, InputType } from '@nestjs/graphql';

import { PaginationInput } from '~/utils/graphql/inputs';

import { IsUUID } from 'class-validator';

@InputType({
  description: 'Get list of project roles and be able to paginate it.',
})
export class ProjectRolePaginationInput extends PaginationInput {
  @Field(() => String, {
    description: 'Project where the roles to page are.',
  })
  @IsUUID(4, { message: 'The project ID must be a valid UUID.' })
  public projectId!: string;
}
