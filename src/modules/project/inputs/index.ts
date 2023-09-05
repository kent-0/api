import { QueryOrder } from '@mikro-orm/core';

import { Field, ID, InputType } from '@nestjs/graphql';

export * from './project-create.input';
export * from './project-update.input';
export * from './role-assign.input';
export * from './role-create.input';
export * from './role-unassign.input';
export * from './role-update.input';

@InputType({
  isAbstract: true,
})
export abstract class Pagination {
  @Field(() => ID, {
    description: 'End cursor to show elements.',
  })
  public endCursor!: string;

  @Field(() => Number, { description: 'Page number to use in the pagination.' })
  public page!: number;

  @Field(() => Number, { description: 'Total size of the page.' })
  public size!: number;

  @Field(() => String, {
    description:
      'Sort the elements according to a field of the element. The element field must be at the first level of the object.',
  })
  public sortBy!: string;

  @Field(() => QueryOrder, {
    description: 'Direction of how to order the elements.',
  })
  public sortOrder!: QueryOrder;

  @Field(() => ID, {
    description: 'Start cursor to show elements.',
  })
  public startCursor!: string;
}
