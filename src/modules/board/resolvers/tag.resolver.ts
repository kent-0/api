import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { UserToken } from '~/modules/auth/decorators/user.decorator';
import { JwtAuthGuard } from '~/modules/auth/guards/jwt.guard';
import { JWTPayload } from '~/modules/auth/interfaces/jwt.interface';
import { BoardPermissionsGuard } from '~/modules/board/guards/permissions.guard';
import {
  BoardTagsCreateInput,
  BoardTagsManageTask,
  BoardTagsUpdateInput,
  BoardTaskTagDeleteInput,
} from '~/modules/board/inputs';
import { BoardTagObject } from '~/modules/board/objects/tag.object';
import { BoardTagsService } from '~/modules/board/services/tags.service';

/**
 * GraphQL resolver for board tags.
 * This resolver handles all GraphQL queries and mutations related to board tags.
 * It uses the `BoardTagsService` to interact with the underlying data source.
 */
@Resolver()
@UsePipes(ValidationPipe)
@UseGuards(JwtAuthGuard, BoardPermissionsGuard)
export class BoardTagResolver {
  /**
   * Constructs the resolver and injects the `BoardTagsService`.
   * @param _boardTagService Service to handle board tag operations.
   */
  constructor(private _boardTagService: BoardTagsService) {}

  /**
   * Mutation to add a tag to a task.
   * @param input Input data required to add the tag to a task.
   * @returns The updated tag object after being added to the task.
   */
  @Mutation(() => BoardTagObject, {
    description: 'Add a tag to a task.',
  })
  public addToTask(@Args('input') input: BoardTagsManageTask) {
    return this._boardTagService.addToTask(input);
  }

  /**
   * Mutation to create a new tag.
   * @param input Input data required to create a new tag.
   * @param token JWT payload of the authenticated user.
   * @returns The created tag object.
   */
  @Mutation(() => BoardTagObject, {
    description: 'Create a new tag.',
  })
  public create(
    @Args('input') input: BoardTagsCreateInput,
    @UserToken() token: JWTPayload,
  ) {
    return this._boardTagService.create(input, token.sub);
  }

  /**
   * Mutation to delete a tag.
   * @param input Input data required to delete the tag.
   * @returns A confirmation message indicating the result of the deletion.
   */
  @Mutation(() => String, {
    description: 'Delete a tag.',
  })
  public delete(@Args('input') input: BoardTaskTagDeleteInput) {
    return this._boardTagService.delete(input);
  }

  /**
   * Mutation to remove a tag from a task.
   * @param input Input data required to remove the tag from a task.
   * @returns The updated tag object after being removed from the task.
   */
  @Mutation(() => BoardTagObject, {
    description: 'Remove a tag to a task.',
  })
  public removeToTask(@Args('input') input: BoardTagsManageTask) {
    return this._boardTagService.removeFromTask(input);
  }

  /**
   * Mutation to update a tag.
   * @param input Input data required to update the tag.
   * @returns The updated tag object.
   */
  @Mutation(() => BoardTagObject, {
    description: 'Update a tag.',
  })
  public update(@Args('input') input: BoardTagsUpdateInput) {
    return this._boardTagService.update(input);
  }
}
