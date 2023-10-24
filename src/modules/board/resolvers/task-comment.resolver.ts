import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { UserToken } from '~/modules/auth/decorators/user.decorator';
import { JwtAuthGuard } from '~/modules/auth/guards/jwt.guard';
import { JWTPayload } from '~/modules/auth/interfaces/jwt.interface';
import { BoardPermissionsGuard } from '~/modules/board/guards/permissions.guard';
import {
  BoardTaskCommentCreateInput,
  BoardTaskCommentDeleteInput,
  BoardTaskCommentReplyInput,
  BoardTaskCommentUpdateInput,
} from '~/modules/board/inputs';
import { BoardTaskCommentObject } from '~/modules/board/objects/task-comment.object';
import { BoardTaskCommentService } from '~/modules/board/services/task-comment.service';
import { BoardPermissions } from '~/permissions/decorators/request-permissions.decorator';
import { BoardPermissionsEnum } from '~/permissions/enums/board.enum';

/**
 * The BoardTaskCommentResolver class provides GraphQL endpoints (mutations) to
 * manage comments on board tasks. This includes functionalities such as creating,
 * deleting, replying to, and updating comments.
 */
@Resolver()
@UsePipes(ValidationPipe)
@UseGuards(JwtAuthGuard, BoardPermissionsGuard)
export class BoardTaskCommentResolver {
  /**
   * Constructs an instance of the BoardTaskCommentResolver class.
   * @param boardTaskCommentService - An injected instance of the BoardTaskCommentService.
   */
  constructor(private boardTaskCommentService: BoardTaskCommentService) {}

  /**
   * Creates a new comment on a board task.
   *
   * @param input - Data required to create a new comment.
   * @param token - JWT payload of the currently authenticated user.
   * @returns The created board task comment.
   */
  @Mutation(() => BoardTaskCommentObject, {
    description: 'Create a new comment on a task.',
    name: 'boardTaskCommentCreate',
  })
  @BoardPermissions([
    BoardPermissionsEnum.TaskCreate,
    BoardPermissionsEnum.TaskView,
    BoardPermissionsEnum.TaskCommentCreate,
  ])
  public create(
    @Args('input') input: BoardTaskCommentCreateInput,
    @UserToken() token: JWTPayload,
  ) {
    return this.boardTaskCommentService.create(input, token.sub);
  }

  /**
   * Removes a comment from a board task.
   *
   * @param input - Data specifying which comment to delete.
   * @param token - JWT payload of the currently authenticated user.
   * @returns The removed board task comment.
   */
  @Mutation(() => BoardTaskCommentObject, {
    description: 'Remove a comment from a task.',
    name: 'boardTaskCommentRemove',
  })
  @BoardPermissions([BoardPermissionsEnum.TaskView])
  public remove(
    @Args('input') input: BoardTaskCommentDeleteInput,
    @UserToken() token: JWTPayload,
  ) {
    return this.boardTaskCommentService.delete(input, token.sub);
  }

  /**
   * Adds a reply to an existing comment on a board task.
   *
   * @param input - Data required to reply to a comment.
   * @param token - JWT payload of the currently authenticated user.
   * @returns The created reply comment.
   *
   * @decorator Mutation() - Registers the method as a GraphQL mutation.
   * @decorator BoardPermissions() - Ensures user has permissions to view tasks and create comments on tasks.
   */
  @Mutation(() => BoardTaskCommentObject, {
    description: 'Reply to a comment on a task.',
    name: 'boardTaskCommentReply',
  })
  @BoardPermissions([
    BoardPermissionsEnum.TaskView,
    BoardPermissionsEnum.TaskCommentCreate,
  ])
  public reply(
    @Args('input') input: BoardTaskCommentReplyInput,
    @UserToken() token: JWTPayload,
  ) {
    return this.boardTaskCommentService.reply(input, token.sub);
  }

  /**
   * Updates an existing comment on a board task.
   *
   * @param input - Data required to update a comment.
   * @param token - JWT payload of the currently authenticated user.
   * @returns The updated board task comment.
   */
  @Mutation(() => BoardTaskCommentObject, {
    description: 'Update a comment on a task.',
    name: 'boardTaskCommentUpdate',
  })
  @BoardPermissions([
    BoardPermissionsEnum.TaskView,
    BoardPermissionsEnum.TaskCommentCreate,
  ])
  public update(
    @Args('input') input: BoardTaskCommentUpdateInput,
    @UserToken() token: JWTPayload,
  ) {
    return this.boardTaskCommentService.update(input, token.sub);
  }
}
