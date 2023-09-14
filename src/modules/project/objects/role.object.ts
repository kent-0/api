import { Field, ObjectType } from '@nestjs/graphql';

import {
  ProjectMemberObject,
  ProjectMinimalObject,
  ProjectRoleMinimalObject,
} from '.';

/**
 * The `ProjectRolesObject` class serves as a blueprint for defining roles within a project management system.
 * In many applications, especially in project management platforms, roles are fundamental for access control,
 * where different roles can perform different tasks based on their set permissions.
 *
 * This particular implementation utilizes a bit-based permission system, which provides an efficient way
 * to store and manage permissions. Using bits, each role can have a combination of permissions represented
 * as a single integer, making it easy to perform operations like checking, granting, or revoking permissions.
 */
@ObjectType({
  description:
    'Object that represents the roles of a board with their relationships.',
})
export class ProjectRoleObject extends ProjectRoleMinimalObject {
  /**
   * The `members` field provides a list of all project members that are assigned this role.
   * This is crucial for understanding the distribution of roles within a project and identifying
   * which members have been granted specific permissions.
   */
  @Field(() => [ProjectMemberObject], {
    description: 'Project members who have this role.',
  })
  public members!: ProjectMemberObject[];

  /**
   * The `project` field denotes the specific project to which the role is assigned. Roles in
   * project management systems are often project-specific, meaning that the same role might
   * have different permissions in different projects.
   */
  @Field(() => ProjectMinimalObject, {
    description: 'Project assigned to the role.',
  })
  public project!: ProjectMinimalObject;
}
