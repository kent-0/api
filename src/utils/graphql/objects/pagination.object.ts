import { QueryOrder } from '@mikro-orm/core';

import { Field, ID, InputType } from '@nestjs/graphql';

@InputType({
  isAbstract: true,
})
export abstract class Pagination {
  @Field(() => ID, {
    description: 'End cursor to show elements.',
    nullable: true,
  })
  public endCursor!: string;

  @Field(() => Number, {
    description: 'Page number to use in the pagination.',
    nullable: true,
  })
  public page!: number;

  @Field(() => Number, { description: 'Total size of the page.' })
  public size!: number;

  @Field(() => String, {
    description:
      'Sort the elements according to a field of the element. The element field must be at the first level of the object.',
    nullable: true,
  })
  public sortBy?: string;

  @Field(() => QueryOrder, {
    description: 'Direction of how to order the elements.',
    nullable: true,
  })
  public sortOrder?: QueryOrder;

  @Field(() => ID, {
    description: 'Start cursor to show elements.',
    nullable: true,
  })
  public startCursor?: string;
}
