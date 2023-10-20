import { Field, ObjectType } from '@nestjs/graphql';

import { BoardStepWithTasksObject } from '~/modules/board/objects/step.object';
import { ProjectMinimalObject } from '~/modules/project/objects';

import { BoardMinimalObject } from './minimal/board.object';
import { BoardMembersMinimalObject } from './minimal/member.object';
import { BoardRolesMinimalObject } from './minimal/role.object';

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
 * @see ProjectMinimalObject - For details about the minimal representation of a project.
 */
@ObjectType({
  description: 'Object that represents information on a project board.',
})
export class BoardObject extends BoardMinimalObject {
  /**
   * Represents a list of members associated with a board.
   * This field provides a collection of minimal details about each member
   * associated with the board. This is useful for quickly retrieving a list of
   * members without needing the full details of each member.
   *
   * When querying a board, this field can be used to get an overview of all
   * the members who have access to or are collaborating on the board. It can
   * also be useful when managing permissions or roles within the board.
   */
  @Field(() => [BoardMembersMinimalObject], {
    description: 'Basic information about board members.',
  })
  public members!: BoardMembersMinimalObject[];

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

  /**
   * Represents a list of roles defined for a board.
   * Each board can have multiple roles, defining the access level or permissions
   * for members. This field provides a collection of those roles with minimal
   * details.
   *
   * By querying this field, one can understand the different roles available
   * within the board and their associated permissions. This is essential for
   * board administration and security.
   */
  @Field(() => [BoardRolesMinimalObject], {
    description: 'Basic information about board roles.',
  })
  public roles!: BoardRolesMinimalObject[];

  /**
   * Represents a list of steps or stages within a board.
   * In many board-based project management systems, tasks or items move through
   * different steps (like "To Do", "In Progress", "Done"). This field provides
   * a collection of those steps with minimal details.
   *
   * This is crucial for understanding the workflow of the board and the stages
   * tasks will pass through. It also aids users in visualizing the board's
   * structure and flow.
   */
  @Field(() => [BoardStepWithTasksObject], {
    description: 'Basic information about board steps.',
  })
  public steps!: BoardStepWithTasksObject[];
}
