import { Field, ObjectType } from '@nestjs/graphql';

import { AuthUserMinimalObject } from '~/modules/auth/objects';
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
