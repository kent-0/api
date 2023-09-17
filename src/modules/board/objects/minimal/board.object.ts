import { Field, ObjectType } from '@nestjs/graphql';

import {
  AuthUserMinimalObject,
  AuthUserMinimalProperties,
} from '~/modules/auth/objects';
import { createFieldPaths } from '~/utils/functions/create-fields-path';
import { tuple } from '~/utils/functions/tuple';

/**
 * Represents a tuple containing the minimal set of properties required
 * for a board. This tuple is intended to capture not only the direct
 * attributes of a board but also details related to the board's creator.
 *
 * The tuple is structured to capture:
 * - The unique identifier for the board (`id`).
 * - A brief description that provides insights about the board (`description`).
 * - The name of the board (`name`).
 * - The associated properties of the user (`created_by`) who created the board.
 *   This is achieved using the `createFieldPaths` function, which combines the
 *   base entity ('created_by' in this case) with its minimal properties
 *   (from `AuthUserMinimalProperties`).
 *
 * By defining this tuple, it offers a standardized approach to select the essential
 * fields for a board across the application. This ensures data consistency,
 * optimizes data fetching by selecting only necessary fields, and aids in
 * reducing potential errors.
 *
 * @constant BoardMinimalProperties
 *
 * @example
 * Assuming the tuple is used to generate a SQL SELECT statement:
 * The fields would be:
 * - 'id'
 * - 'description'
 * - 'name'
 * - 'created_by.id'
 * - 'created_by.first_name'
 * - 'created_by.last_name'
 * - 'created_by.username'
 */
export const BoardMinimalProperties = tuple(
  'id',
  'description',
  'name',
  ...createFieldPaths('created_by', ...AuthUserMinimalProperties),
);

/**
 * The `BoardMinimalObject` provides a concise view of a project board. It offers
 * the essential details without delving into the complexities of nested relationships
 * or extensive metadata. This minimalistic approach is ideal for scenarios where
 * only high-level board information is required, such as listings or overviews.
 *
 * The class encapsulates three primary attributes:
 * 1. `created_by`: Represents the user who created the board. This relationship
 *    offers a quick insight into the board's origin.
 * 2. `description`: A brief textual overview of the board's purpose or theme,
 *    helping users understand its context at a glance.
 * 3. `name`: The name of the board, serving as its primary identifier in user
 *    interfaces or listings.
 *
 * By offering a focused set of attributes, `BoardMinimalObject` ensures efficiency
 * and clarity, especially in contexts where detailed board information might be
 * overwhelming or unnecessary.
 *
 * @see AuthUserMinimalObject - For details about the minimal representation of a user.
 */
@ObjectType({
  description: 'Object that represents information on a project board.',
})
export class BoardMinimalObject {
  /**
   * Represents the creator of the board. The field provides basic information about
   * the user who initiated the board, ensuring traceability and accountability.
   * It's linked to a minimal user object, which offers the essential details
   * without overwhelming with extensive user metadata.
   */
  @Field(() => AuthUserMinimalObject, {
    description: 'Basic information about the board creator.',
  })
  public created_by!: AuthUserMinimalObject;

  /**
   * Provides a succinct overview of the board's intent or theme. The description
   * is essential for users to understand the board's context, especially when
   * browsing through a list of boards. It should be concise yet informative,
   * giving a clear indication of the board's purpose.
   */
  @Field(() => String, {
    description: 'Brief description that explains what the board is about.',
  })
  public description!: string;

  /**
   * The board's name serves as its primary identifier. It's used prominently
   * in user interfaces, listings, or any context where the board needs to be
   * referenced. The name should be unique and descriptive, ensuring users can
   * easily identify and differentiate it from other boards.
   */
  @Field(() => String, {
    description: "Board's name.",
  })
  public name!: string;
}
