import { Field, ID, InputType } from '@nestjs/graphql';

import { PaginationInput } from '~/utils/graphql/inputs';

import { IsUUID } from 'class-validator';

/**
 * The ProjectRolePaginationInput class provides a structured and validated format
 * for requesting a paginated list of roles associated with a specific project.
 * It extends the PaginationInput class, which means it inherits properties that
 * control pagination such as the number of items per page and the current page number.
 *
 * By extending PaginationInput, this class can be used to conveniently retrieve
 * a subset of project roles, making it efficient to display them in user interfaces
 * that support pagination.
 *
 * The input ensures that the project ID is a valid UUID, ensuring that roles are
 * retrieved for an existing and valid project.
 */
@InputType({
  description: 'Get list of project roles and be able to paginate it.',
})
export class ProjectRolePaginationInput extends PaginationInput {
  /**
   * This field captures the unique identifier of the project for which
   * the roles are being paginated. By specifying the project ID, the
   * system can fetch roles that are specifically associated with that
   * particular project. This ensures that the paginated results are
   * relevant and confined to the given project context.
   */
  @Field(() => ID, {
    description: 'Project where the roles to page are.',
  })
  @IsUUID(4, { message: 'The project ID must be a valid UUID.' })
  public projectId!: string;
}
