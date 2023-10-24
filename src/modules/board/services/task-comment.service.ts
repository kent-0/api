import { EntityManager } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { BoardTaskCommentEntity, BoardTaskEntity } from '~/database/entities';
import { CommentsTypes } from '~/database/enums/comments.enum';
import {
  BoardTaskCommentCreateInput,
  BoardTaskCommentDeleteInput,
  BoardTaskCommentReplyInput,
  BoardTaskCommentUpdateInput,
} from '~/modules/board/inputs';
import { BoardTaskMinimalProperties } from '~/modules/board/objects/minimal/task.object';
import { BoardTaskCommentMinimalProperties } from '~/modules/board/objects/minimal/task-comment.object';
import { createFieldPaths } from '~/utils/functions/create-fields-path';

/**
 * `BoardTaskCommentService` Service:
 * This service provides the necessary operations to manage comments for tasks on a board.
 * It encapsulates actions like creating, deleting, replying, and updating comments.
 */
@Injectable()
export class BoardTaskCommentService {
  /**
   * Constructor for the BoardTaskCommentService.
   *
   * @param boardTaskComment - Repository for operations related to the `BoardTaskCommentEntity`.
   * @param boardTaskRepository - Repository for operations related to the `BoardTaskEntity`.
   * @param em - Entity manager for managing database operations in the ORM.
   */
  constructor(
    @InjectRepository(BoardTaskCommentEntity)
    private readonly boardTaskComment: EntityRepository<BoardTaskCommentEntity>,
    @InjectRepository(BoardTaskEntity)
    private readonly boardTaskRepository: EntityRepository<BoardTaskEntity>,
    private readonly em: EntityManager,
  ) {}

  /**
   * Creates a new comment for a specific task on a board.
   * @param input - Contains details like boardId, content of the comment, and taskId.
   * @param userId - Identifier for the user creating the comment.
   * @returns - The newly created comment or throws an exception if task not found.
   */
  public async create(
    { boardId, content, taskId }: BoardTaskCommentCreateInput,
    userId: string,
  ) {
    const task = await this.boardTaskRepository.findOne({
      board: boardId,
      id: taskId,
    });

    if (!task) {
      throw new NotFoundException(
        'The task to add the comment to was not found.',
      );
    }

    const comment = this.boardTaskComment.create({
      author: userId,
      content,
      task,
      type: CommentsTypes.Comment,
    });

    await this.em.persistAndFlush(comment);
    return this.boardTaskComment.findOneOrFail(
      {
        id: comment.id,
      },
      {
        fields: [
          ...BoardTaskCommentMinimalProperties,
          ...createFieldPaths('task', ...BoardTaskMinimalProperties),
        ],
      },
    );
  }

  /**
   * Deletes a comment from a specific task on a board.
   * @param input - Contains details like boardId, commentId, and taskId.
   * @param userId - Identifier for the user deleting the comment.
   * @returns - Success message or throws an exception if task/comment not found.
   */
  public async delete(
    { boardId, commentId, taskId }: BoardTaskCommentDeleteInput,
    userId: string,
  ) {
    const task = await this.boardTaskRepository.findOne({
      board: boardId,
      id: taskId,
    });

    if (!task) {
      throw new NotFoundException(
        'The task to delete the comment to was not found.',
      );
    }

    const comment = await this.boardTaskComment.findOne({
      id: commentId,
    });

    if (!comment) {
      throw new NotFoundException(
        'The comment that you want to delete was not found.',
      );
    }

    if (comment.author.id !== userId) {
      throw new UnauthorizedException(
        'You are not allowed to update this comment because you are not the author.',
      );
    }

    await this.em.removeAndFlush(comment);
    return 'Comment deleted successfully.';
  }

  /**
   * Adds a reply to an existing comment on a task on a board.
   * @param input - Contains details like boardId, commentId, content of the reply, and taskId.
   * @param userId - Identifier for the user creating the reply.
   * @returns - The reply or throws an exception if task/comment not found.
   */
  public async reply(
    { boardId, commentId, content, taskId }: BoardTaskCommentReplyInput,
    userId: string,
  ) {
    const task = await this.boardTaskRepository.findOne({
      board: boardId,
      id: taskId,
    });

    if (!task) {
      throw new NotFoundException(
        'The task to reply the comment to was not found.',
      );
    }

    const comment = await this.boardTaskComment.findOne({
      id: commentId,
    });

    if (!comment) {
      throw new NotFoundException(
        'The comment that you want to reply was not found.',
      );
    }

    const reply = this.boardTaskComment.create({
      author: userId,
      content,
      reply_to: comment,
      type: CommentsTypes.Reply,
    });

    await this.em.persistAndFlush(reply);
    return this.boardTaskComment.findOneOrFail(
      {
        id: reply.id,
      },
      {
        fields: [
          ...BoardTaskCommentMinimalProperties,
          ...createFieldPaths('task', ...BoardTaskMinimalProperties),
        ],
      },
    );
  }

  /**
   * Updates an existing comment on a task on a board.
   * @param input - Contains details like boardId, commentId, content of the comment, and taskId.
   * @param userId - Identifier for the user updating the comment.
   * @returns - The updated comment or throws an exception if task/comment not found or unauthorized update attempt.
   */
  public async update(
    { boardId, commentId, content, taskId }: BoardTaskCommentUpdateInput,
    userId: string,
  ) {
    const task = await this.boardTaskRepository.findOne({
      board: boardId,
      id: taskId,
    });

    if (!task) {
      throw new NotFoundException(
        'The task to add the comment to was not found.',
      );
    }

    const comment = await this.boardTaskComment.findOne({
      id: commentId,
    });

    if (!comment) {
      throw new NotFoundException(
        'The comment that you want to update was not found.',
      );
    }

    if (comment.author.id !== userId) {
      throw new UnauthorizedException(
        'You are not allowed to update this comment because you are not the author.',
      );
    }

    comment.content = content;
    await this.em.persistAndFlush(comment);
    return this.boardTaskComment.findOneOrFail(
      {
        id: comment.id,
      },
      {
        fields: [
          ...BoardTaskCommentMinimalProperties,
          ...createFieldPaths('task', ...BoardTaskMinimalProperties),
        ],
      },
    );
  }
}
