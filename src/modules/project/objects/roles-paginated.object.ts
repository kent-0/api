import { Field, ObjectType } from '@nestjs/graphql';

import { PaginationObject } from '~/utils/graphql/objects';
import { ToCollections } from '~/utils/types/to-collection';

import { ProjectRolesObject } from './roles.object';

/**
 * The `ProjectPaginatedProjectRoles` class provides a structure for paginated
 * results of project roles within a project management system. In many applications,
 * especially those dealing with potentially large datasets, pagination is essential
 * for performance reasons and improved user experience. By splitting results into
 * pages, the system can efficiently manage and display data.
 *
 * This class extends the `PaginationObject`, which likely encapsulates common
 * pagination metadata such as the current page, total number of items, and items
 * per page. The extension ensures that `ProjectPaginatedProjectRoles` inherits
 * these essential pagination properties.
 */
@ObjectType({
  description: 'Result of the pagination of roles of a project.',
})
export class ProjectPaginatedProjectRoles extends PaginationObject {
  /**
   * The `items` field represents the actual list of roles within the current
   * page of the paginated result. Each item in this list corresponds to a
   * specific role available within a project.
   *
   * Utilizing the `ProjectRolesObject` ensures that each role adheres to a
   * consistent structure and includes all necessary metadata about the role.
   *
   * The type `ToCollections<ProjectRolesObject>[]` suggests that this field
   * might transform or wrap each `ProjectRolesObject` into another structure
   * or collection, possibly for additional metadata or context.
   */
  @Field(() => [ProjectRolesObject], {
    description: 'Roles available in the project.',
  })
  public items!: ToCollections<ProjectRolesObject>[];
}
