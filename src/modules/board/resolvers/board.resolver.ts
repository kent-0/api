import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { UserToken } from '~/modules/auth/decorators/user.decorator';
import { JwtAuthGuard } from '~/modules/auth/guards/jwt.guard';
import { JWTPayload } from '~/modules/auth/interfaces/jwt.interface';
import { BoardPermissions } from '~/permissions/decorators/request-permissions.decorator';
import { BoardPermissionsEnum } from '~/permissions/enums/board.enum';
import { ExcludeGuards } from '~/utils/decorators/exclude-guards.decorator';

import { BoardPermissionsGuard } from '../guards/permissions.guard';
import {
  BoardCreateInput,
  BoardRemoveInput,
  BoardUpdateInput,
} from '../inputs';
import { BoardGetInput } from '../inputs/board/get.input';
import { BoardObject } from '../objects';
import { BoardService } from '../services/board.service';

/**
 * GraphQL resolver for board-related operations.
 *
 * This resolver handles GraphQL queries and mutations related to boards within a project.
 * It provides functionalities to create, retrieve, update, and delete boards.
 */
@Resolver()
@UsePipes(ValidationPipe)
@UseGuards(JwtAuthGuard, BoardPermissionsGuard)
export class BoardResolver {
  /**
   * Constructor initializes the resolver with the BoardService to handle board operations.
   *
   * @param _boardService - Service responsible for board-related operations.
   */
  constructor(private _boardService: BoardService) {}

  /**
   * Handles the mutation to create a new board for a specific project.
   *
   * @param input - Contains the data needed to create a new board.
   * @param token - JWT payload of the authenticated user.
   * @returns Newly created board details.
   */
  @Mutation(() => BoardObject, {
    description: 'Create a new board for a project.',
    name: 'boardCreate',
  })
  @ExcludeGuards([BoardPermissionsGuard])
  public create(
    @Args('input') input: BoardCreateInput,
    @UserToken() token: JWTPayload,
  ) {
    return this._boardService.create(input, token.sub);
  }

  /**
   * Handles the query to retrieve a board from a project.
   *
   * @param input - Contains the data needed to identify the board to be retrieved.
   * @returns Details of the specified board.
   */
  @Query(() => BoardObject, {
    description: 'Get a project board.',
    name: 'board',
  })
  public get(@Args('input') input: BoardGetInput) {
    return this._boardService.get(input);
  }

  /**
   * Handles the mutation to delete an existing board from a project.
   *
   * @param input - Contains the data needed to identify the board to be deleted.
   * @returns A message confirming the deletion of the board.
   */
  @Mutation(() => String, {
    description: 'Remove an existing board of a project.',
    name: 'boardRemove',
  })
  @BoardPermissions([BoardPermissionsEnum.BoardUpdate])
  public remove(@Args('input') input: BoardRemoveInput) {
    return this._boardService.remove(input);
  }

  /**
   * Handles the mutation to update an existing board within a project.
   *
   * @param input - Contains the updated data for the board.
   * @returns Updated board details.
   */
  @Mutation(() => BoardObject, {
    description: 'Update an existing board of a project.',
    name: 'boardUpdate',
  })
  @BoardPermissions([BoardPermissionsEnum.BoardUpdate])
  public update(@Args('input') input: BoardUpdateInput) {
    return this._boardService.update(input);
  }
}
