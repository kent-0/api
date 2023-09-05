import { QueryOrder } from '@mikro-orm/core';

import { Field, InputType, Int } from '@nestjs/graphql';

import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

/**
 * `PaginationInput` serves as a standardized structure for paginating and sorting query results in GraphQL.
 * This abstract class should be extended in other specific input types for queries that require pagination.
 *
 * @description Provides properties and validation for pagination and sorting.
 */
@InputType({
  description:
    'Base input for pagination parameters. Useful for standardizing pagination across queries.',
  isAbstract: true,
})
export abstract class PaginationInput {
  /**
   * @description Represents the specific page number to retrieve. Page numbering starts from 1.
   * @example If you want to retrieve the third page of results, set this value to 3.
   * @type {number}
   */
  @Field(() => Int)
  @IsNumber({}, { message: 'The page number should be a valid number.' })
  @Min(1, { message: 'The page number should be at least 1.' })
  public page!: number;

  /**
   * @description Defines the number of items to retrieve per page.
   * @example If you want 20 items per page, set this value to 20.
   * @type {number}
   */
  @Field(() => Int)
  @IsNumber({}, { message: 'The page size should be a valid number.' })
  @Min(0, { message: 'The page size should be at least 1.' })
  public size!: number;

  /**
   * @description Specifies the field by which the results should be sorted. Must be a top-level field name of the returned object.
   * @example If you're querying a list of users and want to sort by 'lastName', set this value to 'lastName'.
   * @type {string}
   */
  @Field(() => String, { nullable: true })
  @IsString({ message: 'The sorting field should be a valid string.' })
  @IsOptional()
  public sortBy?: string;

  /**
   * @description Dictates the direction in which results should be sorted. Can be either `ASC` (ascending) or `DESC` (descending).
   * @example If you want the results in ascending order, set this value to `ASC`.
   * @type {QueryOrder}
   */
  @Field(() => QueryOrder, { nullable: true })
  @IsEnum(QueryOrder, {
    message: 'The sorting order should either be ASC or DESC.',
  })
  @IsOptional()
  public sortOrder?: QueryOrder;
}
