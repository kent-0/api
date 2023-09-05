import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({
  description: 'Result of a pagination of elements.',
  isAbstract: true,
})
export abstract class PaginationObject {
  @Field(() => Boolean, {
    description: 'Indicator if there are more pages following the current one.',
  })
  hasNextPage!: boolean;

  @Field(() => Boolean, {
    description:
      'Indicator of if there are previous pages to the current page.',
  })
  hasPreviousPage!: boolean;

  @Field(() => Number, {
    description: 'Total number of items available to paginate.',
  })
  totalItems!: number;

  @Field(() => Number, {
    description: 'Total number of pages available to paginate.',
  })
  totalPages!: number;
}
