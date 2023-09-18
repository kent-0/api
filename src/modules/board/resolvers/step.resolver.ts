import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Mutation, Resolver } from '@nestjs/graphql';

import { JwtAuthGuard } from '~/modules/auth/guards/jwt.guard';
import { BoardPermissions } from '~/permissions/decorators/request-permissions.decorator';
import { Permissions } from '~/permissions/enums/board.enum';

import { BoardPermissionsGuard } from '../guards/permissions.guard';
import {
  BoardStepCreateInput,
  BoardStepFinishedInput,
  BoardStepMoveInput,
  BoardStepRemoveInput,
  BoardStepUpdateInput,
} from '../inputs';
import { BoardStepObject } from '../objects';
import { BoardStepService } from '../services/step.service';

/**
 * Resolver class for operations related to board steps.
 *
 * This class provides GraphQL endpoints to handle mutations related to steps on a board.
 * It includes operations like creating, marking as finished, moving, removing, and updating steps.
 *
 * Decorators:
 * @Resolver() - Indicates that this class is a GraphQL resolver.
 * @UsePipes(ValidationPipe) - Ensures the data is validated before hitting the methods.
 * @UseGuards(JwtAuthGuard, BoardPermissionsGuard) - Ensures that only authenticated users
 * with the right board permissions can access the mutations.
 */
@Resolver()
@UsePipes(ValidationPipe)
@UseGuards(JwtAuthGuard, BoardPermissionsGuard)
export class BoardStepResolver {
  constructor(private _stepService: BoardStepService) {}

  /**
   * Creates a new task step on a board.
   * @param {BoardStepCreateInput} input - Parameters required to create a new step.
   * @returns The newly created step.
   */
  @Mutation(() => BoardStepObject, {
    description: 'Create a new task step on the board.',
    name: 'boardStepCreate',
  })
  @BoardPermissions([Permissions.StepCreate])
  public create(input: BoardStepCreateInput) {
    return this._stepService.create(input);
  }

  /**
   * Marks a task step as the final step in the step flow.
   * @param {BoardStepFinishedInput} input - Parameters required to mark a step as finished.
   * @returns The updated step.
   */
  @Mutation(() => BoardStepObject, {
    description: 'Mark a task step as the final step in the step flow.',
    name: 'boardStepMarkAsFinished',
  })
  @BoardPermissions([Permissions.StepUpdate])
  public markAsFinished(input: BoardStepFinishedInput) {
    return this._stepService.markAsFinished(input);
  }

  /**
   * Moves the position of a task step on a board.
   * @param {BoardStepMoveInput} input - Parameters required to move a step to a new position.
   * @returns The updated step.
   */
  @Mutation(() => BoardStepObject, {
    description: 'Move a task step on the board.',
    name: 'boardStepMove',
  })
  @BoardPermissions([Permissions.StepUpdate])
  public move(input: BoardStepMoveInput) {
    return this._stepService.move(input);
  }

  /**
   * Removes a task step from a board.
   * @param {BoardStepRemoveInput} input - Parameters required to remove a step from a board.
   * @returns A message indicating the step has been removed.
   */
  @Mutation(() => String, {
    description: 'Remove a task step from the board.',
    name: 'boardStepRemove',
  })
  @BoardPermissions([Permissions.StepRemove])
  public remove(input: BoardStepRemoveInput) {
    return this._stepService.remove(input);
  }

  /**
   * Updates a task step on a board.
   * @param {BoardStepUpdateInput} input - Parameters required to update a step on a board.
   * @returns The updated step.
   */
  @Mutation(() => BoardStepObject, {
    description: 'Update a task step from the board.',
    name: 'boardStepUpdate',
  })
  @BoardPermissions([Permissions.StepUpdate])
  public update(input: BoardStepUpdateInput) {
    return this._stepService.update(input);
  }
}
