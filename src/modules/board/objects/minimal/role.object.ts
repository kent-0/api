import { Field, ID, ObjectType } from '@nestjs/graphql';

/**
 * Represents a concise view of roles associated with a board.
 * This object type provides just the essential details of a role within the context
 * of a board, making it optimal for scenarios where exhaustive role data is unnecessary.
 *
 * For instance, in a UI where a list of roles is displayed in a dropdown or
 * a summary view, this minimalistic representation ensures that only the most
 * relevant data about the role is presented.
 */
@ObjectType({
  description:
    'Object that represents the minimum information about board roles.',
})
export class BoardRolesMinimalObject {
  /**
   * Represents the unique identifier for the role within the board.
   * This can be particularly useful when performing CRUD operations or
   * when mapping roles to users.
   */
  @Field(() => ID, { description: 'Unique identifier for the board role.' })
  public id!: string;

  /**
   * Provides a human-readable representation of the role. This is typically
   * used to display the role name in user interfaces.
   */
  @Field(() => String, { description: 'Name representing the role.' })
  public name!: string;

  /**
   * Bit-based representation of the permissions associated with the role.
   * This approach is efficient for checking multiple permissions at once
   * and is ideal for systems with a variable set of permissions.
   */
  @Field(() => Number, { description: 'Role bit-based permissions.' })
  public permissions!: number;
}
