import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { UserToken } from '~/modules/auth/decorators/user.decorator';
import { JwtAuthGuard } from '~/modules/auth/guards/jwt.guard';
import { JWTPayload } from '~/modules/auth/interfaces/jwt.interface';
import { ProjectPermissions } from '~/permissions/decorators/request-permissions.decorator';
import { Permissions } from '~/permissions/enums/project.enum';
import { ExcludeGuards } from '~/utils/decorators/exclude-guards.decorator';

import { ProjectPermissionsGuard } from '../guards/permissions.guard';
import { ProjectCreateInput, ProjectUpdateInput } from '../inputs';
import { ProjectObject } from '../objects';
import { ProjectService } from '../services/project.service';

/**
 * Resolver class for managing project-related GraphQL operations.
 *
 * This resolver handles GraphQL mutations and queries related to creating, deleting, updating, and fetching projects.
 * It's generally protected by JWT authentication and specific project permissions, except for the `ProjectCreate` mutation.
 *
 * @UsePipes(ValidationPipe) - Ensures that the incoming data is validated against the defined DTOs.
 * @UseGuards(JwtAuthGuard, ProjectPermissionsGuard) - Protects most resolver methods using JWT authentication and project-specific permissions.
 */
@Resolver()
@UsePipes(ValidationPipe)
@UseGuards(JwtAuthGuard, ProjectPermissionsGuard)
export class ProjectResolver {
  /**
   * Initializes the resolver with the necessary services.
   *
   * @param _projectService - Service responsible for project-related operations.
   */
  constructor(private _projectService: ProjectService) {}

  /**
   * Creates a new project.
   * This method bypasses the `ProjectPermissionsGuard` and solely relies on JWT authentication.
   *
   * @param input - Data containing details about the new project.
   * @param token - JWT payload providing authenticated user details.
   * @returns Details of the newly created project.
   */
  @Mutation(() => ProjectObject, {
    description: 'Create a new project.',
    name: 'projectCreate',
  })
  @ExcludeGuards([ProjectPermissionsGuard])
  public create(
    @Args('input') input: ProjectCreateInput,
    @UserToken() token: JWTPayload,
  ) {
    return this._projectService.create(input, token.sub);
  }

  /**
   * Deletes a specified project based on the given project ID.
   *
   * @param projectId - ID of the project to delete.
   * @param token - JWT payload providing authenticated user details.
   * @returns A confirmation message indicating successful deletion.
   */
  @Mutation(() => String, {
    description: 'Delete a project.',
    name: 'projectDelete',
  })
  public delete(
    @Args('projectId') projectId: string,
    @UserToken() token: JWTPayload,
  ) {
    return this._projectService.delete(projectId, token.sub);
  }

  /**
   * Fetches and returns details of a specified project based on the given project ID.
   *
   * @param projectId - ID of the project to retrieve.
   * @returns Details of the specified project.
   */
  @Query(() => ProjectObject, {
    description: 'Get a project.',
    name: 'project',
  })
  public get(@Args('projectId') projectId: string) {
    return this._projectService.get(projectId);
  }

  /**
   * Updates and returns the details of a specified project.
   * This mutation requires specific project update permissions.
   *
   * @param input - Data containing updated project details.
   * @returns Updated details of the project.
   */
  @Mutation(() => ProjectObject, {
    description: 'Update the details of a project.',
    name: 'projectUpdate',
  })
  @ProjectPermissions([Permissions.ProjectUpdate])
  public update(@Args('input') input: ProjectUpdateInput) {
    return this._projectService.update(input);
  }
}
