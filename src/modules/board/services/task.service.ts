import { EntityManager } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import { ConflictException, Injectable } from '@nestjs/common';

import { BoardStepEntity, BoardTaskEntity } from '~/database/entities';
import { StepType } from '~/database/enums/step.enum';
import { AuthUserMinimalProperties } from '~/modules/auth/objects';
import {
  BoardTaskCreateInput,
  BoardTaskDeleteInput,
  BoardTaskUpdateInput,
} from '~/modules/board/inputs';
import { BoardTaskMoveInput } from '~/modules/board/inputs/task/move.input';
import {
  BoardMinimalProperties,
  BoardStepMinimalProperties,
} from '~/modules/board/objects';
import { createFieldPaths } from '~/utils/functions/create-fields-path';

/**
 * `BoardTaskService`: A service class dedicated to the management of tasks within a board.
 * This service provides functionalities related to the lifecycle and manipulation of
 * tasks, ensuring that they comply with the structural and logical requirements of the board
 * and its associated steps.
 */
@Injectable()
export class BoardTaskService {
  /**
   * Constructs a new instance of the `BoardTaskService` class.
   *
   * @param boardTaskRepository - Repository for accessing and manipulating `BoardTaskEntity`.
   * @param boardStepRepository - Repository for accessing and manipulating `BoardStepEntity`.
   * @param em - The entity manager used for database operations.
   */
  constructor(
    @InjectRepository(BoardTaskEntity)
    private readonly boardTaskRepository: EntityRepository<BoardTaskEntity>,
    @InjectRepository(BoardStepEntity)
    private readonly boardStepRepository: EntityRepository<BoardStepEntity>,
    private readonly em: EntityManager,
  ) {}

  /**
   * `recountTasksPositions`:
   * This method recalculates and updates the position of tasks within a specific step on a board.
   * It's typically called after an operation that might disrupt the order of tasks, such as
   * deleting or moving a task. The method ensures that tasks are sequentially ordered by their
   * position without any gaps.
   *
   * @param boardId - The unique identifier of the board in which the tasks are located.
   * @param stepId - The unique identifier of the step in which the tasks' positions need to be recounted.
   *
   * @returns - This method doesn't return a value. It recalculates the task positions and saves the updated positions to the database.
   */
  private async recountTasksPositions(boardId: string, stepId: string) {
    // Fetch all tasks associated with the given board and step, ordered by their current position.
    const tasks = await this.boardTaskRepository.find(
      {
        board: boardId,
        step: stepId,
      },
      {
        orderBy: {
          position: 'ASC',
        },
      },
    );

    // Reassign the position of each task to ensure they are sequentially ordered.
    for (let i = 0; i < tasks.length; i++) {
      tasks[i].position = i + 1;
    }

    // Persist the updated task positions to the database.
    await this.em.persistAndFlush(tasks);
  }

  /**
   * Creates a new task associated with a specified board.
   * The task is initially assigned to the first step of the board. If the board doesn't have
   * any steps, an exception is thrown.
   *
   * @param boardId - The unique identifier of the board to which the task belongs.
   * @param description - Descriptive text providing more information about the task.
   * @param name - A brief title or name for the task.
   * @param userId - The unique identifier of the user who is creating the task.
   * @returns - The created task entity.
   * @throws {ConflictException} - If the board doesn't have a step to assign the task to.
   */
  public async create(
    { boardId, description, name }: BoardTaskCreateInput,
    userId: string,
  ) {
    const step = await this.boardStepRepository.findOne({
      board: boardId,
      position: 1,
    });

    if (!step) {
      throw new ConflictException(
        'The dashboard must have at least one step in order to create tasks. These tasks are assigned to the first step.',
      );
    }

    const stepsCount = await step.tasks.loadCount();
    const task = this.boardTaskRepository.create({
      board: boardId,
      created_by: userId,
      description,
      name,
      position: stepsCount + 1,
      step,
    });

    await this.em.persistAndFlush(task);

    return await this.boardTaskRepository.findOne(
      {
        board: boardId,
        id: task.id,
      },
      {
        fields: [
          ...createFieldPaths('step', ...BoardStepMinimalProperties),
          ...createFieldPaths('board', ...BoardMinimalProperties),
          ...createFieldPaths('created_by', ...AuthUserMinimalProperties),
          ...createFieldPaths('assigned_to', ...AuthUserMinimalProperties),
        ],
      },
    );
  }

  /**
   * Deletes a specific task from a board.
   *
   * @param boardId - The unique identifier of the board from which the task should be deleted.
   * @param taskId - The unique identifier of the task to be deleted.
   * @returns - A confirmation message indicating the task's successful deletion.
   * @throws {ConflictException} - If the task to be deleted doesn't exist.
   */
  public async delete({ boardId, taskId }: BoardTaskDeleteInput) {
    const task = await this.boardTaskRepository.findOne(
      {
        board: boardId,
        id: taskId,
      },
      {
        populate: ['step'],
      },
    );

    if (!task) {
      throw new ConflictException(
        'The task you are trying to delete does not exist.',
      );
    }

    await this.em.removeAndFlush(task);
    await this.recountTasksPositions(boardId, task.step.id);

    return 'The task has been deleted successfully.';
  }

  /**
   * Moves a task to a different position or step within a board.
   *
   * @param boardId - The unique identifier of the board containing the task.
   * @param position - The desired new position for the task within the step.
   * @param stepId - The unique identifier of the step to which the task should be moved.
   * @param taskId - The unique identifier of the task to be moved.
   * @returns - The task entity after its position has been updated.
   * @throws {ConflictException} - If the target step doesn't exist, or if there are issues moving the task.
   */
  public async move({ boardId, position, stepId, taskId }: BoardTaskMoveInput) {
    const step = await this.boardStepRepository.findOne({
      board: boardId,
      id: stepId,
    });

    if (!step) {
      throw new ConflictException(
        'The step you are trying to move the task to does not exist.',
      );
    }

    const task = await this.boardTaskRepository.findOne(
      {
        board: boardId,
        id: taskId,
      },
      {
        populate: ['step', 'assigned_to'],
      },
    );

    if (!task) {
      throw new ConflictException(
        'The task you are trying to move does not exist.',
      );
    }

    if (task.finish_date) {
      throw new ConflictException(
        'The task you are trying to move has already been finished.',
      );
    }

    if (step.type === StepType.FINISH && !task.assigned_to) {
      throw new ConflictException(
        'The task you are trying to move does not have an assigned user.',
      );
    }

    const tasksCount = await step.tasks.loadCount();
    if (step.max && tasksCount + 1 >= step.max) {
      throw new ConflictException(
        'The step you are trying to move the task to is full.',
      );
    }

    if (step.id === task.step.id) {
      const replacementTask = await this.boardTaskRepository.findOne({
        board: boardId,
        position,
        step,
      });

      if (!replacementTask) {
        throw new ConflictException(
          'The task you are trying to replace does not exist.',
        );
      }

      const previousStep = task.step;

      replacementTask.position = task.position;
      task.position = position;
      task.step = step;

      await this.em.persistAndFlush([task, replacementTask]);
      await this.recountTasksPositions(boardId, previousStep.id);
    }

    if (step.id !== task.step.id && tasksCount > 0) {
      const replacementTask = await this.boardTaskRepository.findOne({
        board: boardId,
        position,
        step,
      });

      if (!replacementTask && position > tasksCount + 1) {
        throw new ConflictException(
          'The task you are trying to replace does not exist.',
        );
      }

      const previousStep = task.step;

      task.position = position;
      task.step = step;

      if (replacementTask) {
        replacementTask.position = task.position + 1;
        await this.em.persistAndFlush(replacementTask);
      }

      await this.em.persistAndFlush(task);
      await this.recountTasksPositions(boardId, stepId);
      await this.recountTasksPositions(boardId, previousStep.id);
    }

    if (step.id !== task.step.id && tasksCount === 0) {
      const previousStep = task.step;

      task.position = 1;
      task.step = step;

      await this.recountTasksPositions(boardId, previousStep.id);
      await this.em.persistAndFlush(task);
    }

    return task;
  }

  /**
   * Updates specific properties of a task.
   *
   * @param boardId - The unique identifier of the board containing the task.
   * @param description - The updated descriptive text for the task.
   * @param expirationDate - The updated deadline or expiration date for the task.
   * @param name - The updated title or name for the task.
   * @param taskId - The unique identifier of the task to be updated.
   * @returns - The updated task entity.
   * @throws {ConflictException} - If the task to be updated doesn't exist.
   */
  public async update({
    boardId,
    description,
    expirationDate,
    name,
    taskId,
  }: BoardTaskUpdateInput) {
    const task = await this.boardTaskRepository.findOne({
      board: boardId,
      id: taskId,
    });

    if (!task) {
      throw new ConflictException(
        'The task you are trying to update does not exist.',
      );
    }

    task.description = description ?? task.description;
    task.expiration_date = expirationDate ?? task.expiration_date;
    task.name = name ?? task.name;

    await this.em.persistAndFlush(task);
    return await this.boardTaskRepository.findOne(
      {
        board: boardId,
        id: task.id,
      },
      {
        fields: [
          ...createFieldPaths('step', ...BoardStepMinimalProperties),
          ...createFieldPaths('board', ...BoardMinimalProperties),
          ...createFieldPaths('created_by', ...AuthUserMinimalProperties),
          ...createFieldPaths('assigned_to', ...AuthUserMinimalProperties),
        ],
      },
    );
  }
}
