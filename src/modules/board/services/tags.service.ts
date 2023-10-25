import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';

import { Injectable, NotFoundException } from '@nestjs/common';

import { BoardTagsEntity, BoardTaskEntity } from '~/database/entities';
import { AuthUserMinimalProperties } from '~/modules/auth/objects';
import {
  BoardTagsCreateInput,
  BoardTagsManageTask,
  BoardTagsUpdateInput,
  BoardTaskTagDeleteInput,
} from '~/modules/board/inputs';
import {
  BoardMinimalProperties,
  BoardStepMinimalProperties,
} from '~/modules/board/objects';
import { BoardTagMinimalProperties } from '~/modules/board/objects/minimal/tag.object';
import { BoardTaskMinimalProperties } from '~/modules/board/objects/minimal/task.object';
import { createFieldPaths } from '~/utils/functions/create-fields-path';

/**
 * The `BoardTagsService` class handles all the operations related to board tags.
 * It provides a unified way to create, update, delete, and manage tags within board tasks.
 */
@Injectable()
export class BoardTagsService {
  /**
   * Initializes a new instance of the BoardTagsService.
   *
   * @param boardTagsRepository - The repository to manage board tag entity operations.
   * @param boardTaskRepository - The repository to manage board task entity operations.
   * @param em - The entity manager to manage database transactions.
   */
  constructor(
    @InjectRepository(BoardTagsEntity)
    private readonly boardTagsRepository: EntityRepository<BoardTagsEntity>,
    @InjectRepository(BoardTaskEntity)
    private readonly boardTaskRepository: EntityRepository<BoardTaskEntity>,
    private em: EntityManager,
  ) {}

  /**
   * Associates a tag with a specific board task.
   * This operation will link the provided tag to the given task.
   *
   * @param boardId - The unique identifier of the board.
   * @param tagId - The unique identifier of the tag to be added.
   * @param taskId - The unique identifier of the task to which the tag will be added.
   * @throws NotFoundException - If the task or tag doesn't exist.
   */
  public async addToTask({ boardId, tagId, taskId }: BoardTagsManageTask) {
    const task = await this.boardTaskRepository.findOne(
      {
        board: boardId,
        id: taskId,
      },
      {
        fields: [
          ...BoardTaskMinimalProperties,
          ...createFieldPaths('step', ...BoardStepMinimalProperties),
          ...createFieldPaths('board', ...BoardMinimalProperties),
          ...createFieldPaths('created_by', ...AuthUserMinimalProperties),
          ...createFieldPaths('assigned_to', ...AuthUserMinimalProperties),
        ],
      },
    );

    if (!task) {
      throw new NotFoundException(
        'The task that you are trying to add a tag to does not exist',
      );
    }

    const tag = await this.boardTagsRepository.findOne({
      board: boardId,
      id: tagId,
    });

    if (!tag) {
      throw new NotFoundException(
        'The tag that you are trying to add to a task does not exist',
      );
    }

    task.tags.add(tag);
    await this.em.persistAndFlush(task);
  }

  /**
   * Creates a new tag associated with a specific board.
   *
   * @param boardId - The unique identifier of the board.
   * @param color - The color code representing the tag's appearance.
   * @param description - A brief description of the tag's purpose or context.
   * @param name - The display name of the tag.
   * @param userId - The unique identifier of the user who is creating the tag.
   * @returns - The details of the newly created tag.
   */
  public async create(
    { boardId, color, description, name }: BoardTagsCreateInput,
    userId: string,
  ) {
    const newTag = this.boardTagsRepository.create({
      board: boardId,
      color,
      created_by: userId,
      description,
      name,
    });

    await this.em.persistAndFlush(newTag);
    return this.boardTagsRepository.findOne(
      {
        board: boardId,
        id: newTag.id,
      },
      {
        fields: [
          ...BoardTagMinimalProperties,
          ...createFieldPaths('board', ...BoardMinimalProperties),
          ...createFieldPaths('tasks', ...BoardTaskMinimalProperties),
        ],
      },
    );
  }

  /**
   * Deletes an existing tag from a specific board.
   *
   * @param boardId - The unique identifier of the board.
   * @param tagId - The unique identifier of the tag to be deleted.
   * @returns - A confirmation message indicating the tag has been successfully deleted.
   * @throws NotFoundException - If the tag doesn't exist.
   */
  public async delete({ boardId, tagId }: BoardTaskTagDeleteInput) {
    const tag = await this.boardTagsRepository.findOne({
      board: boardId,
      id: tagId,
    });

    if (!tag) {
      throw new NotFoundException(
        'The tag that you are trying to delete does not exist',
      );
    }

    await this.em.removeAndFlush(tag);
    return 'Tag deleted successfully';
  }

  /**
   * Disassociates a tag from a specific board task.
   * This operation will unlink the provided tag from the given task.
   *
   * @param boardId - The unique identifier of the board.
   * @param tagId - The unique identifier of the tag to be removed.
   * @param taskId - The unique identifier of the task from which the tag will be removed.
   * @throws NotFoundException - If the task or tag doesn't exist.
   */
  public async removeFromTask({ boardId, tagId, taskId }: BoardTagsManageTask) {
    const task = await this.boardTaskRepository.findOne(
      {
        board: boardId,
        id: taskId,
      },
      {
        fields: [
          ...BoardTaskMinimalProperties,
          ...createFieldPaths('step', ...BoardStepMinimalProperties),
          ...createFieldPaths('board', ...BoardMinimalProperties),
          ...createFieldPaths('created_by', ...AuthUserMinimalProperties),
          ...createFieldPaths('assigned_to', ...AuthUserMinimalProperties),
        ],
      },
    );

    if (!task) {
      throw new NotFoundException(
        'The task that you are trying to remove a tag from does not exist',
      );
    }

    const tag = await this.boardTagsRepository.findOne({
      board: boardId,
      id: tagId,
    });

    if (!tag) {
      throw new NotFoundException(
        'The tag that you are trying to remove from a task does not exist',
      );
    }

    task.tags.remove(tag);
    await this.em.persistAndFlush(task);
  }

  /**
   * Updates the details of an existing tag associated with a specific board.
   * Any provided field will be updated in the tag's details, while missing fields will remain unchanged.
   *
   * @param boardId - The unique identifier of the board.
   * @param color - The updated color code representing the tag's appearance.
   * @param description - The updated brief description of the tag's purpose or context.
   * @param name - The updated display name of the tag.
   * @param tagId - The unique identifier of the tag to be updated.
   * @returns - The details of the updated tag.
   * @throws NotFoundException - If the tag doesn't exist.
   */
  public async update({
    boardId,
    color,
    description,
    name,
    tagId,
  }: BoardTagsUpdateInput) {
    const tag = await this.boardTagsRepository.findOne(
      {
        board: boardId,
        id: tagId,
      },
      {
        fields: [
          ...BoardTagMinimalProperties,
          ...createFieldPaths('board', ...BoardMinimalProperties),
          ...createFieldPaths('tasks', ...BoardTaskMinimalProperties),
        ],
      },
    );

    if (!tag) {
      throw new NotFoundException(
        'The tag that you are trying to update does not exist',
      );
    }

    tag.color = color ?? tag.color;
    tag.description = description ?? tag.description;
    tag.name = name ?? tag.name;

    await this.em.persistAndFlush(tag);
    return tag;
  }
}
