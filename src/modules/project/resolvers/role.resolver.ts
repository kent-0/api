import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { JwtAuthGuard } from '~/modules/auth/guards/jwt.guard';
import { ProjectPermissions } from '~/permissions/decorators/request-permissions.decorator';
import { Permissions } from '~/permissions/enums/project.enum';

import { ProjectPermissionsGuard } from '../guards/permissions.guard';
import {
  ProjectRoleAssignInput,
  ProjectRoleCreateInput,
  ProjectRolePaginationInput,
  ProjectRoleUnassignInput,
  ProjectRoleUpdateInput,
} from '../inputs';
import {
  ProjectMemberObject,
  ProjectRoleObject,
  ProjectRolesPaginated,
} from '../objects';
import { ProjectRoleService } from '../services/role.service';

/**
 * `ProjectResolver` handles the GraphQL mutations and queries related to project roles.
 * This includes assigning roles to project members, creating new roles, deleting roles,
 * paginating roles, unassigning roles from members, and updating role details.
 */
@Resolver()
@UsePipes(ValidationPipe)
@UseGuards(JwtAuthGuard, ProjectPermissionsGuard)
export class ProjectRoleResolver {
  /**
   * Initializes the resolver with the necessary service.
   *
   * @param _roleService - Service responsible for role-related operations.
   */
  constructor(private _roleService: ProjectRoleService) {}

  /**
   * Assigns a role to project members.
   * Steps:
   * 1. Calls the role service's assign method to assign the role to the member.
   *
   * @param input - Data containing information on which role to assign and to whom.
   * @returns The updated project member details with the assigned role.
   */
  @Mutation(() => ProjectMemberObject, {
    description: 'Assign project role to members.',
    name: 'projectRoleAssign',
  })
  @ProjectPermissions([Permissions.RoleAssign])
  public assign(@Args('input') input: ProjectRoleAssignInput) {
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
  @Mutation(() => ProjectRoleObject, {
    description: 'Create a new project role.',
    name: 'projectRoleCreate',
  })
  @ProjectPermissions([Permissions.RoleCreate])
  public create(@Args('input') input: ProjectRoleCreateInput) {
    return this._roleService.create(input);
  }

  /**
   * Paginates the roles associated with a project.
   * Steps:
   * 1. Calls the role service's paginate method with provided input to fetch paginated roles.
   *
   * @param input - Pagination input details.
   * @returns A paginated list of project roles.
   */
  @Query(() => ProjectRolesPaginated, {
    description: 'Paginate the roles of a project.',
    name: 'projectRolesPaginate',
  })
  public paginate(@Args('input') input: ProjectRolePaginationInput) {
    return this._roleService.paginate(input);
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
    name: 'projectRoleRemove',
  })
  @ProjectPermissions([Permissions.RoleDelete])
  public remove(@Args('roleId') roleId: string) {
    return this._roleService.remove(roleId);
  }

  /**
   * Removes an assigned role from a project member.
   * Steps:
   * 1. Calls the role service's unassign method to remove the role assignment from the member.
   *
   * @param input - Data containing details of the role assignment to remove.
   * @returns The details of the unassigned role.
   */
  @Mutation(() => ProjectMemberObject, {
    description: 'Unassign a role from a project member.',
    name: 'ProjectRoleUnassign',
  })
  @ProjectPermissions([Permissions.RoleUnassign])
  public unassign(@Args('input') input: ProjectRoleUnassignInput) {
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
  @Mutation(() => ProjectRoleObject, {
    description: 'Update the details of a project role.',
    name: 'ProjectRoleUpdate',
  })
  @ProjectPermissions([Permissions.RoleUpdate])
  public update(@Args('input') input: ProjectRoleUpdateInput) {
    return this._roleService.update(input);
  }
}
