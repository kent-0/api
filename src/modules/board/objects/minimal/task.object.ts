import { ObjectType } from '@nestjs/graphql';

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
  /** A descriptive text providing more information about the task. */
  public description!: string;

  /** The deadline or expiration date set for the task's completion. */
  public expiration_date!: Date;

  /** The date when the task was marked as finished. */
  public finish_date!: Date;

  /** A brief title or name assigned to the task. */
  public name!: string;

  /** The position or order of the task within its associated step on the board. */
  public position!: number;

  /** The date when the task was initiated or started. */
  public start_date!: Date;
}
