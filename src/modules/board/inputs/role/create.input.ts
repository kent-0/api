import { Field, InputType } from '@nestjs/graphql';

import { IsNumber, IsString, IsUUID, MaxLength } from 'class-validator';

/**
 * Represents the structured input data required to create a new role for a board.
 * This class provides a structured way to pass necessary data during GraphQL mutations
 * that deal with creating roles for boards. It ensures that the board identifier, role name,
 * and permissions are provided in the correct format and context.
 */
@InputType({
  description: 'Input to create roles for boards.',
})
export class BoardRoleCreateInput {
  /**
   * Unique identifier for the board where the new role will be created.
   * This ensures that the new role is being created within the correct board context.
   *
   * @type {string}
   * @required
   */
  @Field(() => String, {
    description: 'Board to which the role is assigned.',
  })
  @IsUUID(4, { message: 'The board ID must be a valid UUID.' })
  public boardId!: string;

  /**
   * Descriptive name for the role being created. This name helps users understand
   * the purpose or set of permissions associated with this role.
   *
   * @type {string}
   * @required
   * @maxLength 50
   */
  @Field(() => String, {
    description: 'Role name.',
  })
  @IsString()
  @MaxLength(50, {
    message: 'The role name must not exceed 50 characters.',
  })
  public name!: string;

  /**
   * Represents the permissions associated with the role in a bit format.
   * Each bit represents a specific permission or a set of permissions.
   * This format helps in efficiently storing and checking role permissions.
   *
   * @type {number}
   * @required
   */
  @Field(() => Number, {
    description: 'Role permissions bit.',
  })
  @IsNumber({}, { message: 'Permissions must be in bit format.' })
  public permissions!: number;
}
