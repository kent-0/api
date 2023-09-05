import { Field, ObjectType } from '@nestjs/graphql';

import { PaginationObject } from '~/utils/graphql/objects';
import { ToCollections } from '~/utils/types/to-collection';

import { ProjectRolesObject } from './project-roles.object';

@ObjectType({
  description: 'Result of the pagination of roles of a project.',
})
export class ProjectPaginatedProjectRoles extends PaginationObject {
  @Field(() => [ProjectRolesObject], {
    description: 'Roles available in the project.',
  })
  public items!: ToCollections<ProjectRolesObject>[];
}
