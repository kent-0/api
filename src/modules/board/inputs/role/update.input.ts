import { Field, ID, InputType } from '@nestjs/graphql';

import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

/**
 * Represents the structured input data required to update a role on a board.
 * This class captures all possible fields that can be updated for a role, while
 * ensuring that mandatory identifiers (like board and role IDs) are provided.
 * Each field in this class, aside from mandatory identifiers, is optional,
 * allowing for flexible updates where only specific fields can be changed.
 */
@InputType({
  description: 'Input to update roles for boards.',
})
export class BoardRoleUpdateInput {
  /**
   * Unique identifier for the board where the role update is to take place.
   * This ensures that the update process is scoped to the correct board.
   *
   * @type {string}
   * @required
   */
  @Field(() => ID, {
    description: 'Board to which the role is unassigned.',
  })
  @IsUUID(4, { message: 'The board ID must be a valid UUID.' })
  public boardId!: string;

  /**
   * New name for the role, if it needs to be changed. This is optional as not
   * all role updates will necessitate a name change.
   *
   * @type {string}
   * @optional
   */
  @Field(() => String, {
    description: 'Role name.',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50, {
    message: 'The role name must not exceed 50 characters.',
  })
  public name?: string;

  /**
   * The permissions associated with the role are represented as a bit.
   * This provides a compact and efficient way of representing multiple
   * permissions. For instance, each bit in the number could represent a
   * specific permission and the value (0 or 1) indicates whether the role
   * has that permission or not.
   */
  @Field(() => Number, {
    description: 'Role permissions bit.',
    nullable: true,
  })
  @IsNumber({}, { message: 'Permissions must be in bit format.' })
  public permissions_denied?: number;

  /**
   * The permissions associated with the role are represented as a bit.
   * This provides a compact and efficient way of representing multiple
   * permissions. For instance, each bit in the number could represent a
   * specific permission and the value (0 or 1) indicates whether the role
   * has that permission or not.
   */
  @Field(() => Number, {
    description: 'Role permissions bit.',
    nullable: true,
  })
  @IsNumber({}, { message: 'Permissions must be in bit format.' })
  public permissions_granted?: number;

  /**
   * Position of the role in the project.
   */
  @Field(() => Number, {
    description: 'Position of the role in the project.',
    nullable: true,
  })
  public position?: number;

  /**
   * Unique identifier for the role that is to be updated.
   * This ensures that the exact role intended for update is targeted.
   *
   * @type {string}
   * @required
   */
  @Field(() => ID, {
    description: 'ID of the role to update.',
  })
  @IsUUID(4, { message: 'The role ID must be a valid UUID.' })
  public roleId!: string;
}
