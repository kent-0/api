import { Field, ObjectType } from '@nestjs/graphql';

import { PaginationObject } from '~/utils/graphql/objects';

import { BoardRolesObject } from './roles.object';

/**
 * Represents a paginated view of roles associated with a specific board.
 * This object type is designed to provide paginated access to board roles,
 * allowing clients to retrieve a subset of roles based on pagination criteria
 * such as offset and limit. Pagination is an essential feature for UIs that
 * might need to display a large number of roles, making it feasible to break
 * down the list into smaller chunks.
 *
 * The class extends `PaginationObject` which presumably provides generic
 * pagination details such as total counts, current page number, etc. The
 * `items` property specifically holds the paginated list of board roles.
 */
@ObjectType({
  description: 'Result of the pagination of roles of a board.',
})
export class BoardRolesPaginated extends PaginationObject {
  /**
   * Represents a list of board roles as a result of the pagination query.
   * This is an array of `BoardRolesObject` items, each detailing a specific
   * role on the board. The number of items in this array will be dictated by
   * the pagination criteria, ensuring that it contains a subset of the total
   * roles available on the board.
   */
  @Field(() => [BoardRolesObject], {
    description: 'Roles available in the board.',
  })
  public items!: ToCollections<BoardRolesObject>[];
}
