import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { JwtAuthGuard } from '~/modules/auth/guards/jwt.guard';
import { ProjectPermissions } from '~/permissions/decorators/request-permissions.decorator';
import { Permissions } from '~/permissions/enums/project.enum';

import { ProjectPermissionsGuard } from '../guards/permissions.guard';
import {
  ProjectGoalCreateInput,
  ProjectGoalRemoveInput,
  ProjectGoalUpdateInput,
} from '../inputs';
import { ProjectGoalsObject } from '../objects';
import { ProjectGoalService } from '../services/goal.service';

/**
 * Resolver class for managing project goal-related GraphQL operations.
 *
 * This resolver handles GraphQL mutations related to creating, deleting, and updating project goals.
 * The resolver is generally protected by JWT authentication and specific project permissions.
 *
 * @UsePipes(ValidationPipe) - Ensures that the incoming data is validated against the defined DTOs.
 * @UseGuards(JwtAuthGuard, ProjectPermissionsGuard) - Protects resolver methods using JWT authentication and project-specific permissions.
 */
@Resolver()
@UsePipes(ValidationPipe)
@UseGuards(JwtAuthGuard, ProjectPermissionsGuard)
export class ProjectGoalResolver {
  /**
   * Initializes the resolver with the necessary services.
   *
   * @param _projectGoalsService - Service responsible for project goal-related operations.
   */
  constructor(private _projectGoalsService: ProjectGoalService) {}

  /**
   * Creates a new project goal.
   *
   * @param input - Data containing details about the new project goal.
   * @returns Details of the newly created project goal.
   */
  @Mutation(() => ProjectGoalsObject, {
    description: 'Create a new project goal.',
    name: 'projectGoalCreate',
  })
  @ProjectPermissions([Permissions.GoalCreate])
  public create(@Args('input') input: ProjectGoalCreateInput) {
    return this._projectGoalsService.create(input);
  }

  /**
   * Deletes a specified project goal based on the given input data.
   *
   * @param input - Data containing details of the project goal to delete.
   * @returns A message confirming successful deletion or details of the deleted goal.
   */
  @Mutation(() => String, {
    description: 'Delete a project goal.',
    name: 'projectGoalDelete',
  })
  @ProjectPermissions([Permissions.GoalRemove])
  public delete(@Args('input') input: ProjectGoalRemoveInput) {
    return this._projectGoalsService.delete(input);
  }

  /**
   * Updates and returns the details of a specified project goal.
   *
   * @param input - Data containing updated project goal details.
   * @returns Updated details of the project goal.
   */
  @Mutation(() => ProjectGoalsObject, {
    description: 'Update a project goal.',
    name: 'projectGoalUpdate',
  })
  @ProjectPermissions([Permissions.GoalUpdate])
  public update(@Args('input') input: ProjectGoalUpdateInput) {
    return this._projectGoalsService.update(input);
  }
}
