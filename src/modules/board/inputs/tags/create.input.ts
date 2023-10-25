import { Field, ID, InputType } from '@nestjs/graphql';

import { IsHexColor, IsOptional, IsUUID, MaxLength } from 'class-validator';

@InputType({
  description: 'The input of the create board tag.',
})
export class BoardTagsCreateInput {
  @Field(() => ID)
  @IsUUID(4, {
    message: 'The board id must be a valid UUID.',
  })
  public boardId!: string;

  @Field(() => String, {
    nullable: true,
  })
  @IsHexColor({
    message: 'The color must be a valid hex color code.',
  })
  @IsOptional()
  public color?: string;

  @Field(() => String, {
    nullable: true,
  })
  @MaxLength(300, {
    message: 'The description must be less than or equal to 300 characters.',
  })
  @IsOptional()
  public description?: string;

  @Field(() => String)
  @MaxLength(100, {
    message: 'The name must be less than or equal to 100 characters.',
  })
  public name!: string;
}
