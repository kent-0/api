import { Field, ID, InputType } from '@nestjs/graphql';

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
  @Field(() => ID, {
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
   * The permissions associated with the role are represented as a bit.
   * This provides a compact and efficient way of representing multiple
   * permissions. For instance, each bit in the number could represent a
   * specific permission and the value (0 or 1) indicates whether the role
   * has that permission or not.
   */
  @Field(() => Number, {
    description: 'Role permissions bit.',
  })
  @IsNumber({}, { message: 'Permissions must be in bit format.' })
  public permissions_denied!: number;

  /**
   * The permissions associated with the role are represented as a bit.
   * This provides a compact and efficient way of representing multiple
   * permissions. For instance, each bit in the number could represent a
   * specific permission and the value (0 or 1) indicates whether the role
   * has that permission or not.
   */
  @Field(() => Number, {
    description: 'Role permissions bit.',
  })
  @IsNumber({}, { message: 'Permissions must be in bit format.' })
  public permissions_granted!: number;

  /**
   * Position of the role in the project.
   */
  @Field(() => Number, {
    description: 'Position of the role in the project.',
    nullable: true,
  })
  public position?: number;
}
