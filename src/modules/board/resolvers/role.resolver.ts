import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { JwtAuthGuard } from '~/modules/auth/guards/jwt.guard';
import { BoardPermissions } from '~/permissions/decorators/request-permissions.decorator';
import { Permissions } from '~/permissions/enums/board.enum';

import { BoardPermissionsGuard } from '../guards/permissions.guard';
import {
  BoardRoleAssignInput,
  BoardRoleCreateInput,
  BoardRolePaginationInput,
  BoardRoleUnassignInput,
  BoardRoleUpdateInput,
} from '../inputs';
import {
  BoardMembersObject,
  BoardPaginatedBoardRoles,
  BoardRolesObject,
} from '../objects';
import { BoardRolesService } from '../services/roles.service';

/**
 * `BoardResolver` handles the GraphQL mutations and queries related to board roles.
 * This includes assigning roles to board members, creating new roles, deleting roles,
 * paginating roles, unassigning roles from members, and updating role details.
 */
@Resolver()
@UsePipes(ValidationPipe)
@UseGuards(JwtAuthGuard, BoardPermissionsGuard)
export class BoardRolesResolver {
  /**
   * Initializes the resolver with the necessary service.
   *
   * @param _roleService - Service responsible for role-related operations.
   */
  constructor(private _roleService: BoardRolesService) {}

  /**
   * Assigns a role to board members.
   * Steps:
   * 1. Calls the role service's assign method to assign the role to the member.
   *
   * @param input - Data containing information on which role to assign and to whom.
   * @returns The updated board member details with the assigned role.
   */
  @Mutation(() => BoardMembersObject, {
    description: 'Assign board role to members.',
    name: 'boardRoleAssign',
  })
  @BoardPermissions([Permissions.RoleAssign])
  public assign(@Args('input') input: BoardRoleAssignInput) {
    return this._roleService.assign(input);
  }

  /**
   * Creates a new role for a board.
   * Steps:
   * 1. Calls the role service's create method with provided input to generate a new role.
   *
   * @param input - Data containing information about the new role.
   * @returns The created role details.
   */
  @Mutation(() => BoardRolesObject, {
    description: 'Create a new board role.',
    name: 'boardCreateRole',
  })
  @BoardPermissions([Permissions.RoleCreate])
  public create(@Args('input') input: BoardRoleCreateInput) {
    return this._roleService.create(input);
  }

  /**
   * Deletes a specified role from a board.
   * Steps:
   * 1. Calls the role service's delete method with provided roleId to remove the role.
   *
   * @param roleId - The ID of the role to delete.
   * @returns A message confirming the deletion.
   */
  @Mutation(() => String, {
    description: 'Delete a board role.',
    name: 'deleteBoardRole',
  })
  @BoardPermissions([Permissions.RoleDelete])
  public delete(@Args('roleId') roleId: string) {
    return this._roleService.delete(roleId);
  }

  /**
   * Paginates the roles associated with a board.
   * Steps:
   * 1. Calls the role service's paginate method with provided input to fetch paginated roles.
   *
   * @param input - Pagination input details.
   * @returns A paginated list of board roles.
   */
  @Query(() => BoardPaginatedBoardRoles, {
    description: 'Paginate the roles of a board.',
    name: 'paginateBoardRoles',
  })
  public paginate(@Args('input') input: BoardRolePaginationInput) {
    return this._roleService.paginate(input);
  }

  /**
   * Removes an assigned role from a board member.
   * Steps:
   * 1. Calls the role service's unassign method to remove the role assignment from the member.
   *
   * @param input - Data containing details of the role assignment to remove.
   * @returns The details of the unassigned role.
   */
  @Mutation(() => BoardMembersObject, {
    description: 'Unassign a role from a board member.',
    name: 'unassignBoardRole',
  })
  @BoardPermissions([Permissions.RoleUnassign])
  public unassign(@Args('input') input: BoardRoleUnassignInput) {
    return this._roleService.unassign(input);
  }

  /**
   * Updates the details of a specified board role.
   * Steps:
   * 1. Calls the role service's update method with provided input to modify the role details.
   *
   * @param input - Data containing updated role details.
   * @returns The updated role details.
   */
  @Mutation(() => BoardRolesObject, {
    description: 'Update the details of a board role.',
    name: 'updateBoardRole',
  })
  @BoardPermissions([Permissions.RoleUpdate])
  public update(@Args('input') input: BoardRoleUpdateInput) {
    return this._roleService.update(input);
  }
}
