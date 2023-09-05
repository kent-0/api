import { Field, InputType } from '@nestjs/graphql';

import { PaginationInput } from '~/utils/graphql/inputs';

@InputType({
  description: 'Get list of project roles and be able to paginate it.',
})
export class ProjectRolePaginationInput extends PaginationInput {
  @Field(() => String, {
    description: 'Project where the roles to page are.',
  })
  public projectId!: string;
}
