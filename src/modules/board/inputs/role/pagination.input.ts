import { Field, InputType } from '@nestjs/graphql';

import { PaginationInput } from '~/utils/graphql/inputs';

import { IsUUID } from 'class-validator';

/**
 * Represents the structured input data required to paginate board roles.
 * This class extends the `PaginationInput` which provides basic pagination parameters
 * such as page number and page size. By extending this base class, the `BoardRolePaginationInput`
 * ensures that in addition to these pagination parameters, the specific board identifier is also
 * provided, ensuring that roles are paginated within the correct board context.
 */
@InputType({
  description: 'Get list of board roles and be able to paginate it.',
})
export class BoardRolePaginationInput extends PaginationInput {
  /**
   * Unique identifier for the board whose roles are to be paginated.
   * This ensures that the paginated roles are fetched only for the specified board,
   * providing a focused and relevant subset of roles to the user.
   *
   * @type {string}
   * @required
   */
  @Field(() => String, {
    description: 'Project where the roles to page are.',
  })
  @IsUUID(4, { message: 'The project ID must be a valid UUID.' })
  public boardId!: string;
}
