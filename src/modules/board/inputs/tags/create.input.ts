import { Field, ID, InputType } from '@nestjs/graphql';

import { IsHexColor, IsOptional, IsUUID, MaxLength } from 'class-validator';

/**
 * The `BoardTagsCreateInput` class represents the data input format
 * required to create a new board tag.
 */
@InputType({
  description: 'The input of the create board tag.',
})
export class BoardTagsCreateInput {
  /**
   * The unique identifier of the board to which the tag will belong.
   * It should be in a valid UUID format.
   */
  @Field(() => ID)
  @IsUUID(4, {
    message: 'The board id must be a valid UUID.',
  })
  public boardId!: string;

  /**
   * The color of the tag. This is optional and should be
   * a valid hex color code if provided.
   */
  @Field(() => String, {
    nullable: true,
  })
  @IsHexColor({
    message: 'The color must be a valid hex color code.',
  })
  @IsOptional()
  public color?: string;

  /**
   * An optional description of the tag. If provided,
   * its length should not exceed 300 characters.
   */
  @Field(() => String, {
    nullable: true,
  })
  @MaxLength(300, {
    message: 'The description must be less than or equal to 300 characters.',
  })
  @IsOptional()
  public description?: string;

  /**
   * The name of the tag. This is required and
   * its length should not exceed 100 characters.
   */
  @Field(() => String)
  @MaxLength(100, {
    message: 'The name must be less than or equal to 100 characters.',
  })
  public name!: string;
}
