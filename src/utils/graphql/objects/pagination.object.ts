import { Field, Int, ObjectType } from '@nestjs/graphql';

/**
 * PaginationObject Class
 *
 * Provides a consistent structure for paginated results in GraphQL. This abstract class
 * should be extended by other ObjectTypes that need to provide paginated data, ensuring
 * a consistent response structure across different queries and mutations.
 *
 * Properties:
 * - hasNextPage: Indicates if subsequent pages exist after the current page.
 * - hasPreviousPage: Indicates if there are pages before the current one.
 * - totalItems: The total number of items across all pages.
 * - totalPages: The total number of available pages.
 *
 * Usage:
 * When creating an ObjectType that returns paginated data, extend this class to inherit the
 * pagination-related fields. It ensures that paginated responses have a standardized format.
 *
 * Example:
 * Imagine you have a `User` entity and you want to paginate the results. You would create a
 * `PaginatedUserResponse` that extends this `PaginationObject` and adds an additional field,
 * say `users`, which would be an array of `User` objects.
 */
@ObjectType({
  description:
    'An abstract base type that provides a consistent structure for paginated query responses. It ensures that pagination metadata is standardized across different GraphQL queries.',
  isAbstract: true,
})
export abstract class PaginationObject {
  /**
   * Indicates if there are more items to fetch in a subsequent request.
   * If true, it suggests that the frontend can make another request to get the next set of items.
   */
  @Field(() => Boolean, {
    description:
      'A flag indicating if there are more items available after the current page.',
  })
  hasNextPage!: boolean;

  /**
   * Indicates if there are items available in previous pages.
   * If true, it suggests that the frontend can make a request to get the previous set of items.
   */
  @Field(() => Boolean, {
    description:
      'A flag indicating if there are items available before the current page.',
  })
  hasPreviousPage!: boolean;

  /**
   * Represents the total count of items available in the dataset.
   * This count isn't necessarily the number of items on the current page but represents all items across all pages.
   */
  @Field(() => Int, {
    description: 'The total count of items available across all pages.',
  })
  totalItems!: number;

  /**
   * Indicates the total number of pages available. This is calculated based on the `totalItems` and the size of each page.
   * For instance, if there are 100 items in total and each page displays 10 items, then there would be 10 total pages.
   */
  @Field(() => Int, {
    description: 'The total number of available pages.',
  })
  totalPages!: number;
}
