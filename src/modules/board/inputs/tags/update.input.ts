import { Field, ID, InputType } from '@nestjs/graphql';

import { IsHexColor, IsOptional, IsUUID, MaxLength } from 'class-validator';

/**
 * The `BoardTagsUpdateInput` class represents the input required
 * when attempting to update the properties of a tag associated with a board.
 */
@InputType({
  description: 'The input of the update board tag.',
})
export class BoardTagsUpdateInput {
  /**
   * The unique identifier of the board where the tag resides and where
   * the update operation will be performed. This identifier should be in a valid UUID format.
   */
  @Field(() => ID)
  @IsUUID(4, {
    message: 'The board id must be a valid UUID.',
  })
  public boardId!: string;

  /**
   * The color of the tag, if provided. This color should be in a valid hexadecimal format.
   * This field is optional.
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
   * The description of the tag. If provided, the description should not exceed 300 characters.
   * This field is optional.
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
   * The name of the tag. If provided, the name should not exceed 100 characters.
   * This field is optional.
   */
  @Field(() => String, {
    nullable: true,
  })
  @MaxLength(100, {
    message: 'The name must be less than or equal to 100 characters.',
  })
  @IsOptional()
  public name?: string;

  /**
   * The unique identifier of the tag that will be updated.
   * This identifier should be in a valid UUID format.
   */
  @Field(() => ID)
  @IsUUID(4, {
    message: 'The tag id must be a valid UUID.',
  })
  public tagId!: string;
}
