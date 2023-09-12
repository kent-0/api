import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { JwtAuthGuard } from '~/modules/auth/guards/jwt.guard';
import { ProjectPermissions } from '~/permissions/decorators/request-permissions.decorator';
import { Permissions } from '~/permissions/enums/project.enum';

import { ProjectPermissionsGuard } from '../guards/permissions.guard';
import {
  AssignProjectRoleInput,
  ProjectCreateRole,
  ProjectRolePaginationInput,
  UnassignProjectRoleInput,
  UpdateProjectRoleInput,
} from '../inputs';
import {
  ProjectMembersObject,
  ProjectPaginatedProjectRoles,
  ProjectRolesObject,
} from '../objects';
import { ProjectRolesService } from '../services/roles.service';

/**
 * `ProjectResolver` handles the GraphQL mutations and queries related to project roles.
 * This includes assigning roles to project members, creating new roles, deleting roles,
 * paginating roles, unassigning roles from members, and updating role details.
 */
@Resolver()
@UsePipes(ValidationPipe)
@UseGuards(JwtAuthGuard, ProjectPermissionsGuard)
export class ProjectRolesResolver {
  /**
   * Initializes the resolver with the necessary service.
   *
   * @param _roleService - Service responsible for role-related operations.
   */
  constructor(private _roleService: ProjectRolesService) {}

  /**
   * Assigns a role to project members.
   * Steps:
   * 1. Calls the role service's assign method to assign the role to the member.
   *
   * @param input - Data containing information on which role to assign and to whom.
   * @returns The updated project member details with the assigned role.
   */
  @Mutation(() => ProjectMembersObject, {
    description: 'Assign project role to members.',
    name: 'projectRoleAssign',
  })
  @ProjectPermissions([Permissions.AssignRole])
  public assign(@Args('input') input: AssignProjectRoleInput) {
    return this._roleService.assign(input);
  }

  /**
   * Creates a new role for a project.
   * Steps:
   * 1. Calls the role service's create method with provided input to generate a new role.
   *
   * @param input - Data containing information about the new role.
   * @returns The created role details.
   */
  @Mutation(() => ProjectRolesObject, {
    description: 'Create a new project role.',
    name: 'projectCreateRole',
  })
  @ProjectPermissions([Permissions.CreateRole])
  public create(@Args('input') input: ProjectCreateRole) {
    return this._roleService.create(input);
  }

  /**
   * Deletes a specified role from a project.
   * Steps:
   * 1. Calls the role service's delete method with provided roleId to remove the role.
   *
   * @param roleId - The ID of the role to delete.
   * @returns A message confirming the deletion.
   */
  @Mutation(() => String, {
    description: 'Delete a project role.',
    name: 'deleteProjectRole',
  })
  @ProjectPermissions([Permissions.DeleteRole])
  public delete(@Args('roleId') roleId: string) {
    return this._roleService.delete(roleId);
  }

  /**
   * Paginates the roles associated with a project.
   * Steps:
   * 1. Calls the role service's paginate method with provided input to fetch paginated roles.
   *
   * @param input - Pagination input details.
   * @returns A paginated list of project roles.
   */
  @Query(() => ProjectPaginatedProjectRoles, {
    description: 'Paginate the roles of a project.',
    name: 'paginateProjectRoles',
  })
  public paginate(@Args('input') input: ProjectRolePaginationInput) {
    return this._roleService.paginate(input);
  }

  /**
   * Removes an assigned role from a project member.
   * Steps:
   * 1. Calls the role service's unassign method to remove the role assignment from the member.
   *
   * @param input - Data containing details of the role assignment to remove.
   * @returns The details of the unassigned role.
   */
  @Mutation(() => ProjectMembersObject, {
    description: 'Unassign a role from a project member.',
    name: 'unassignProjectRole',
  })
  @ProjectPermissions([Permissions.UnassignRole])
  public unassign(@Args('input') input: UnassignProjectRoleInput) {
    return this._roleService.unassign(input);
  }

  /**
   * Updates the details of a specified project role.
   * Steps:
   * 1. Calls the role service's update method with provided input to modify the role details.
   *
   * @param input - Data containing updated role details.
   * @returns The updated role details.
   */
  @Mutation(() => ProjectRolesObject, {
    description: 'Update the details of a project role.',
    name: 'updateProjectRole',
  })
  @ProjectPermissions([Permissions.UpdateRole])
  public update(@Args('input') input: UpdateProjectRoleInput) {
    return this._roleService.update(input);
  }
}
