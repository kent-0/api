import { QueryOrder } from '@mikro-orm/core';

import { Field, InputType } from '@nestjs/graphql';

@InputType({
  isAbstract: true,
})
export abstract class PaginationInput {
  @Field(() => Number, {
    description: 'Page number to use in the pagination.',
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
}
