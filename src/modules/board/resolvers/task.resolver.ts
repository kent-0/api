import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { UserToken } from '~/modules/auth/decorators/user.decorator';
import { JwtAuthGuard } from '~/modules/auth/guards/jwt.guard';
import { JWTPayload } from '~/modules/auth/interfaces/jwt.interface';
import { BoardPermissionsGuard } from '~/modules/board/guards/permissions.guard';
import {
  BoardTaskCreateInput,
  BoardTaskDeleteInput,
  BoardTaskGetInput,
  BoardTaskUpdateInput,
  BoardTaskUserAssign,
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
   * Mutation: Add Children to Task
   * Allows clients to add children to a task on a board.
   * Requires permission to update tasks.
   *
   * @param input - Input data specifying the updates for the task.
   * @param token - JWT payload of the authenticated user.
   *
   * @returns - The created children.
   */
  @Mutation(() => BoardTaskObject, {
    description: 'Add a child to a task',
    name: 'boardTaskAddChildren',
  })
  public async addChildren(
    @Args('input') input: BoardTaskCreateInput,
    @UserToken() token: JWTPayload,
  ) {
    return this._taskService.addChild(input, token.sub);
  }

  /**
   * Mutation: Assign User to Task
   * Allows clients to associate a user with a specific task on a board.
   * Requires permission to update tasks.
   *
   * @param input - Input data for assigning the user to the task.
   *
   * @returns - The updated task object with the user now assigned to it.
   */
  @Mutation(() => BoardTaskObject, {
    description: 'Assign a user to a task',
    name: 'boardTaskAssignUser',
  })
  @BoardPermissions([BoardPermissionsEnum.TaskAssign])
  public assign(@Args('input') input: BoardTaskUserAssign) {
    return this._taskService.assignUser(input);
  }

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
   * Query: Get Task
   * Allows clients to get a task with full details.
   * Requires permission to view tasks.
   *
   * @param input - Input data specifying which task to get.
   */
  @Query(() => BoardTaskObject, {
    description: 'Get a task with full details',
    name: 'boardTask',
  })
  @BoardPermissions([BoardPermissionsEnum.TaskView])
  public get(@Args('input') input: BoardTaskGetInput) {
    return this._taskService.get(input);
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
   * Mutation: Remove Children from Task
   * Allows clients to remove children from a task on a board.
   * Requires permission to update tasks.
   *
   * @param input - Input data specifying the updates for the task.
   *
   * @returns - Confirmation message of the removed children.
   */
  @Mutation(() => BoardTaskObject, {
    description: 'Remove a child from a task',
    name: 'boardTaskRemoveChildren',
  })
  @BoardPermissions([BoardPermissionsEnum.TaskRemove])
  public async removeChildren(@Args('input') input: BoardTaskDeleteInput) {
    return this._taskService.removeChild(input);
  }

  /**
   * Mutation: Unassign User from Task
   * Allows clients to remove the association between a user and a specific task on a board.
   * Requires permission to unassign users from tasks.
   *
   * @param input - Input data for unassigning the user from the task.
   *
   * @returns - The updated task object with no user assigned to it.
   */
  @Mutation(() => BoardTaskObject, {
    description: 'Unassign a user from a task',
    name: 'boardTaskUnAssignUser',
  })
  @BoardPermissions([BoardPermissionsEnum.TaskUnassign])
  public unassign(@Args('input') input: BoardTaskUserAssign) {
    return this._taskService.unAssignUser(input);
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
