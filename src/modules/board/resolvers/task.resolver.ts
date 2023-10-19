import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { UserToken } from '~/modules/auth/decorators/user.decorator';
import { JwtAuthGuard } from '~/modules/auth/guards/jwt.guard';
import { JWTPayload } from '~/modules/auth/interfaces/jwt.interface';
import { BoardPermissionsGuard } from '~/modules/board/guards/permissions.guard';
import {
  BoardTaskCreateInput,
  BoardTaskDeleteInput,
  BoardTaskUpdateInput,
} from '~/modules/board/inputs';
import { BoardTaskMoveInput } from '~/modules/board/inputs/task/move.input';
import { BoardTaskObject } from '~/modules/board/objects/task.object';
import { BoardTaskService } from '~/modules/board/services/task.service';
import { BoardPermissions } from '~/permissions/decorators/request-permissions.decorator';
import { BoardPermissionsEnum } from '~/permissions/enums/board.enum';

/**
 * `BoardStepResolver`:
 * This resolver is responsible for handling GraphQL mutations related to tasks on a board.
 * It integrates various permissions and validation mechanisms to ensure the integrity and security
 * of the operations. The resolver works closely with the `BoardTaskService` to perform
 * the necessary CRUD operations on tasks.
 */
@Resolver()
@UsePipes(ValidationPipe)
@UseGuards(JwtAuthGuard, BoardPermissionsGuard)
export class BoardTaskResolver {
  /**
   * Constructor:
   * Initializes the resolver with a reference to the `BoardTaskService`.
   * @param _taskService - An instance of the `BoardTaskService`.
   */
  constructor(private _taskService: BoardTaskService) {}

  /**
   * Mutation: Create Task
   * Allows clients to create a new task on a board.
   * Requires permission to create tasks.
   * @param input - Input data for creating the task.
   * @param token - JWT payload of the authenticated user.
   * @returns - The newly created task.
   */
  @Mutation(() => BoardTaskObject, {
    description: 'Create a new task',
    name: 'boardTaskCreate',
  })
  @BoardPermissions([BoardPermissionsEnum.TaskCreate])
  public create(
    @Args('input') input: BoardTaskCreateInput,
    @UserToken() token: JWTPayload,
  ) {
    return this._taskService.create(input, token.sub);
  }

  /**
   * Mutation: Move Task
   * Allows clients to move a task from one step to another within a board.
   * Requires permission to update tasks.
   * @param input - Input data specifying the task movement details.
   * @returns - The moved task.
   */
  @Mutation(() => BoardTaskObject, {
    description: 'Move a task from one step to another and update the position',
    name: 'boardTaskMove',
  })
  @BoardPermissions([BoardPermissionsEnum.TaskUpdate])
  public move(@Args('input') input: BoardTaskMoveInput) {
    return this._taskService.move(input);
  }

  /**
   * Mutation: Remove Task
   * Allows clients to remove a task from a board.
   * Requires permission to remove tasks.
   * @param input - Input data specifying which task to remove.
   * @returns - The removed task message.
   */
  @Mutation(() => String, {
    description: 'Delete a task',
    name: 'boardTaskDelete',
  })
  @BoardPermissions([BoardPermissionsEnum.TaskRemove])
  public remove(@Args('input') input: BoardTaskDeleteInput) {
    return this._taskService.delete(input);
  }

  /**
   * Mutation: Update Task
   * Allows clients to update the details of a task on a board.
   * Requires permission to update tasks.
   * @param input - Input data specifying the updates for the task.
   * @returns - The updated task.
   */
  @Mutation(() => BoardTaskObject, {
    description: 'Update a task',
    name: 'boardTaskUpdate',
  })
  @BoardPermissions([BoardPermissionsEnum.TaskUpdate])
  public update(@Args('input') input: BoardTaskUpdateInput) {
    return this._taskService.update(input);
  }
}
