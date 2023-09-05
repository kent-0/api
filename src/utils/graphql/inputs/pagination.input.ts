import { QueryOrder } from '@mikro-orm/core';

import { Field, InputType } from '@nestjs/graphql';

import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

@InputType({
  isAbstract: true,
})
export abstract class PaginationInput {
  @Field(() => Number, {
    description: 'Page number to use in the pagination.',
  })
  @IsNumber({}, { message: 'Enter a valid page number.' })
  @Min(1, { message: 'The minimum page number is 1.' })
  public page!: number;

  @Field(() => Number, { description: 'Total size of the page.' })
  @IsNumber({}, { message: 'Enter a valid page size.' })
  @Min(0, { message: 'The minimum page size number is 1.' })
  public size!: number;

  @Field(() => String, {
    description:
      'Sort the elements according to a field of the element. The element field must be at the first level of the object.',
    nullable: true,
  })
  @IsString({ message: 'Please enter a valid order field.' })
  @IsOptional()
  public sortBy?: string;

  @Field(() => QueryOrder, {
    description: 'Direction of how to order the elements.',
    nullable: true,
  })
  @IsEnum(QueryOrder, {
    message: 'You can only select valid types of element ordering.',
  })
  @IsOptional()
  public sortOrder?: QueryOrder;
}
