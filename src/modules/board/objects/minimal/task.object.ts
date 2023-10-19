import { Field, ID, ObjectType } from '@nestjs/graphql';

import {
  AuthUserMinimalObject,
  AuthUserMinimalProperties,
} from '~/modules/auth/objects';
import { createFieldPaths } from '~/utils/functions/create-fields-path';
import { tuple } from '~/utils/functions/tuple';

/**
 * `BoardTaskMinimalProperties`:
 * A tuple containing the names of essential properties required for representing
 * a minimal view of a task within a board. It is especially useful for filtering
 * or ensuring that these vital properties are always present when dealing with
 * tasks in certain contexts.
 */
export const BoardTaskMinimalProperties = tuple(
  'description',
  'expiration_date',
  'finish_date',
  'name',
  'position',
  'start_date',
  ...createFieldPaths('created_by', ...AuthUserMinimalProperties),
  ...createFieldPaths('assigned_to', ...AuthUserMinimalProperties),
);

/**
 * `BoardTaskMinimalObject`:
 * This object type defines a minimal representation of a task within a board.
 * It includes properties that are crucial for understanding the task's basic
 * details and its progression state, such as its name, description, start and
 * finish dates, position, and expiration date. This minimalistic view can be
 * beneficial when a condensed version of task data is required, without the
 * need for more extensive details.
 */
@ObjectType({
  description: 'Object representing a task step on the board.',
})
export class BoardTaskMinimalObject {
  /**
   * The user to whom the task is assigned. This association helps identify
   * the person responsible for completing the task.
   */
  @Field(() => AuthUserMinimalObject, {
    description: 'The user to whom the task is assigned.',
    nullable: true,
  })
  public assigned_to?: AuthUserMinimalObject;

  /**
   * The user who created the task. This association helps identify the person
   * who initiated the task and is responsible for its completion.
   */
  @Field(() => AuthUserMinimalObject, {
    description: 'The user who created the task.',
  })
  public created_by!: AuthUserMinimalObject;

  /**
   * A descriptive text providing more information about the task.
   * @example "This task is to be completed by the end of the week."
   */
  @Field(() => String, {
    description:
      'A descriptive text providing more information about the task.',
  })
  public description!: string;

  /**
   * The deadline or expiration date set for the task's completion.
   */
  @Field(() => String, {
    description:
      "The deadline or expiration date set for the task's completion.",
    nullable: true,
  })
  public expiration_date?: Date;

  /**
   * The date when the task was marked as finished.
   */
  @Field(() => String, {
    description: 'The date when the task was marked as finished.',
    nullable: true,
  })
  public finish_date?: Date;

  /**
   * The unique identifier of the task.
   */
  @Field(() => ID, {
    description: 'The unique identifier of the task.',
  })
  public id!: string;

  /**
   * A brief title or name assigned to the task.
   * @example "Complete the project proposal."
   */
  @Field(() => String, {
    description: 'A brief title or name assigned to the task.',
  })
  public name!: string;

  /**
   * The position or order of the task within its associated step on the board.
   */
  @Field(() => Number, {
    description:
      'The position or order of the task within its associated step on the board.',
  })
  public position!: number;

  /**
   * The date when the task was initiated or started.
   */
  @Field(() => String, {
    description: 'The date when the task was initiated or started.',
    nullable: true,
  })
  public start_date?: Date;
}
