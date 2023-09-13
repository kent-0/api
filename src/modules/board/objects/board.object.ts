import { Field, ObjectType } from '@nestjs/graphql';

import { AuthUserMinimalObject } from '~/modules/auth/objects';
import { ProjectMinimalObject } from '~/modules/project/objects';

/**
 * The `BoardObject` provides a comprehensive view of a project board, encapsulating
 * both its inherent attributes and its relationship to the overarching project. This
 * class is suitable for scenarios where a more detailed understanding of the board's
 * context within a project is essential.
 *
 * The class offers four primary attributes:
 * 1. `created_by`: Represents the user who created the board. This attribute ensures
 *    traceability and accountability.
 * 2. `description`: A textual overview of the board's intent, providing users with
 *    clarity on its purpose.
 * 3. `name`: The primary identifier for the board.
 * 4. `project`: Represents the project to which the board belongs. This relationship
 *    establishes the board's context within the larger project structure.
 *
 * By encompassing these attributes, `BoardObject` offers a holistic view of the board,
 * making it suitable for detailed board examinations or management tasks.
 *
 * @see AuthUserMinimalObject - For details about the minimal representation of a user.
 * @see ProjectMinimalObject - For details about the minimal representation of a project.
 */
@ObjectType({
  description: 'Object that represents information on a project board.',
})
export class BoardObject {
  /**
   * Represents the creator of the board. The field provides basic information about
   * the user who initiated the board. This relationship offers insights into the
   * board's origin, ensuring that users can trace back its creation to a specific individual.
   */
  @Field(() => AuthUserMinimalObject, {
    description: 'Basic information about the board creator.',
  })
  public created_by!: AuthUserMinimalObject;

  /**
   * Offers a descriptive overview of the board's theme or objective. The description
   * allows users to quickly understand the board's context and its role within the
   * overarching project.
   */
  @Field(() => String, {
    description: 'Brief description that explains what the board is about.',
  })
  public description!: string;

  /**
   * The board's name acts as its main identifier. It's prominently displayed in
   * user interfaces, listings, or when referencing the board in various contexts.
   * The name should be both unique and descriptive to ensure easy identification.
   */
  @Field(() => String, {
    description: "Board's name.",
  })
  public name!: string;

  /**
   * Represents the project to which the board is linked. This relationship establishes
   * the board's placement within the project's hierarchy. It's essential for users
   * to understand how the board contributes to the project's broader goals.
   */
  @Field(() => ProjectMinimalObject, {
    description:
      'Basic information of the project where the board is assigned.',
  })
  public project!: ProjectMinimalObject;
}
