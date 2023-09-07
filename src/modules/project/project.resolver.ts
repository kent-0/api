import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { ProjectPermissions } from '~/permissions/decorators/request-permissions.decorator';
import { Permissions } from '~/permissions/enums/project.enum';
import { ExcludeGuards } from '~/utils/decorators/exclude-guards.decorator';

import { ProjectPermissionsGuard } from './guards/permissions.guard';
import {
  AddRemoveProjectMemberInput,
  AssignProjectRoleInput,
  CreateProjectInput,
  CreateProjectRoleInput,
  ProjectRolePaginationInput,
  UnassignProjectRoleInput,
  UpdateProjectInput,
  UpdateProjectRoleInput,
} from './inputs';
import {
  ProjectMembersObject,
  ProjectObject,
  ProjectPaginatedProjectRoles,
  ProjectRolesObject,
} from './objects';
import { ProjectMembersService } from './services/members.service';
import { ProjectService } from './services/project.service';
import { ProjectRolesService } from './services/roles.service';

import { UserToken } from '../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { JWTPayload } from '../auth/interfaces/jwt.interface';

/**
 * The `ProjectResolver` class is a NestJS GraphQL resolver responsible for handling
 * GraphQL queries and mutations related to projects. This resolver implements various
 * methods to manage project functionalities such as creation, updates, role assignments,
 * and more.
 *
 * It uses the `ValidationPipe` to ensure that incoming data adheres to the expected schema,
 * and the `JwtAuthGuard` and `ProjectPermissionsGuard` to ensure that only authenticated
 * users with the correct permissions can access certain functionalities.
 */
@Resolver()
@UsePipes(ValidationPipe)
@UseGuards(JwtAuthGuard, ProjectPermissionsGuard)
export class ProjectResolver {
  constructor(
    private _projectService: ProjectService,
    private _roleService: ProjectRolesService,
    private _memberServie: ProjectMembersService,
  ) {}

  @Mutation(() => ProjectMembersObject, {
    description: 'Add a user as a member of a project.',
  })
  @ProjectPermissions([Permissions.AddMember])
  public addProjectMember(@Args('input') input: AddRemoveProjectMemberInput) {
    return this._memberServie.add(input);
  }

  /**
   * Assigns a role to project members.
   * Requires permission to assign roles.
   *
   * @param input - Data containing information on which role to assign and to whom.
   * @returns The updated project member details with the assigned role.
   */
  @Mutation(() => ProjectMembersObject, {
    description: 'Assign project role to members.',
  })
  @ProjectPermissions([Permissions.AssignRole])
  public assignRole(@Args('input') input: AssignProjectRoleInput) {
    return this._roleService.assign(input);
  }

  /**
   * Creates a new project.
   * This mutation doesn't require the `ProjectPermissionsGuard`.
   *
   * @param input - Data containing information about the new project.
   * @param token - Decoded JWT token containing user information.
   * @returns The created project details.
   */
  @Mutation(() => ProjectObject, {
    description: 'Create a new project.',
  })
  @ExcludeGuards([ProjectPermissionsGuard])
  public createProject(
    @Args('input') input: CreateProjectInput,
    @UserToken() token: JWTPayload,
  ) {
    return this._projectService.create(input, token.sub);
  }

  /**
   * Creates a new role for a project.
   * Requires permission to create roles.
   *
   * @param input - Data containing information about the new role.
   * @returns The created role details.
   */
  @Mutation(() => ProjectRolesObject, {
    description: 'Create a new project role.',
  })
  @ProjectPermissions([Permissions.CreateRole])
  public createRole(@Args('input') input: CreateProjectRoleInput) {
    return this._roleService.create(input);
  }

  /**
   * Deletes a specified project.
   *
   * @param projectId - The ID of the project to delete.
   * @param token - Decoded JWT token containing user information.
   * @returns A message confirming the deletion.
   */
  @Mutation(() => String, {
    description: 'Delete a project.',
  })
  public deleteProject(
    @Args('projectId') projectId: string,
    @UserToken() token: JWTPayload,
  ) {
    return this._projectService.delete(projectId, token.sub);
  }

  /**
   * Deletes a specified role from a project.
   * Requires permission to delete roles.
   *
   * @param roleId - The ID of the role to delete.
   * @returns A message confirming the deletion.
   */
  @Mutation(() => String, {
    description: 'Delete a project role.',
  })
  @ProjectPermissions([Permissions.DeleteRole])
  public deleteRole(@Args('roleId') roleId: string) {
    return this._roleService.delete(roleId);
  }

  /**
   * Retrieves details of a specified project.
   *
   * @param projectId - The ID of the project to retrieve.
   * @returns The details of the specified project.
   */
  @Query(() => ProjectObject, {
    description: 'Get a project.',
  })
  public getProject(@Args('projectId') projectId: string) {
    return this._projectService.get(projectId);
  }

  /**
   * Paginates the roles associated with a project.
   *
   * @param input - Pagination input details.
   * @returns A paginated list of project roles.
   */
  @Query(() => ProjectPaginatedProjectRoles, {
    description: 'Paginate the roles of a project.',
  })
  public projectRoles(@Args('input') input: ProjectRolePaginationInput) {
    return this._roleService.paginate(input);
  }

  @Mutation(() => ProjectMembersObject, {
    description: 'Add a user as a member of a project.',
  })
  @ProjectPermissions([Permissions.AddMember])
  public removeProjectMember(
    @Args('input') input: AddRemoveProjectMemberInput,
  ) {
    return this._memberServie.remove(input);
  }

  /**
   * Removes an assigned role from a project member.
   * Requires permission to unassign roles.
   *
   * @param input - Data containing details of the role assignment to remove.
   * @returns The details of the unassigned role.
   */
  @Mutation(() => ProjectMembersObject, {
    description: 'Unassign a role from a project member.',
  })
  @ProjectPermissions([Permissions.UnassignRole])
  public unassignRole(@Args('input') input: UnassignProjectRoleInput) {
    return this._roleService.unassign(input);
  }

  /**
   * Updates the details of a specified project.
   * Requires permission to update projects.
   *
   * @param input - Data containing updated project details.
   * @returns The updated project details.
   */
  @Mutation(() => ProjectObject, {
    description: 'Update the details of a project.',
  })
  @ProjectPermissions([Permissions.UpdateProject])
  public updateProject(@Args('input') input: UpdateProjectInput) {
    return this._projectService.update(input);
  }

  /**
   * Updates the details of a specified project role.
   * Requires permission to update roles.
   *
   * @param input - Data containing updated role details.
   * @returns The updated role details.
   */
  @Mutation(() => ProjectRolesObject, {
    description: 'Update the details of a project role.',
  })
  @ProjectPermissions([Permissions.UpdateRole])
  public updateRole(@Args('input') input: UpdateProjectRoleInput) {
    return this._roleService.update(input);
  }
}
