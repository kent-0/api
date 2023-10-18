import { EntityManager } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import { ConflictException, Injectable } from '@nestjs/common';

import { BoardStepEntity, BoardTaskEntity } from '~/database/entities';
import {
  BoardTaskCreateInput,
  BoardTaskDeleteInput,
  BoardTaskUpdateInput,
} from '~/modules/board/inputs';
import { BoardTaskMove } from '~/modules/board/inputs/task/move.input';

@Injectable()
export class BoardTaskService {
  constructor(
    @InjectRepository(BoardTaskEntity)
    private readonly boardTaskRepository: EntityRepository<BoardTaskEntity>,
    @InjectRepository(BoardStepEntity)
    private readonly boardStepRepository: EntityRepository<BoardStepEntity>,
    private readonly em: EntityManager,
  ) {}

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
    return task;
  }

  public async delete({ boardId, taskId }: BoardTaskDeleteInput) {
    const task = await this.boardTaskRepository.findOne({
      board: boardId,
      id: taskId,
    });

    if (!task) {
      throw new ConflictException(
        'The task you are trying to delete does not exist.',
      );
    }

    await this.em.removeAndFlush(task);
    return 'The task has been deleted successfully.';
  }

  public async move({ boardId, position, stepId, taskId }: BoardTaskMove) {
    const step = await this.boardStepRepository.findOne({
      board: boardId,
      id: stepId,
    });

    if (!step) {
      throw new ConflictException(
        'The step you are trying to move the task to does not exist.',
      );
    }

    const task = await this.boardTaskRepository.findOne({
      board: boardId,
      id: taskId,
    });

    if (!task) {
      throw new ConflictException(
        'The task you are trying to move does not exist.',
      );
    }

    const tasks = await step.tasks.loadItems();
    if (tasks.length === 1) {
      throw new ConflictException(
        'There is only one task in this step, it cannot be moved.',
      );
    }

    const taskIndex = tasks.findIndex((t) => t.id === taskId);
    const taskToSwap = tasks[taskIndex + position];

    if (!taskToSwap) {
      throw new ConflictException(
        'The task you are trying to swap does not exist.',
      );
    }

    const taskToSwapPosition = taskToSwap.position;
    const taskPosition = task.position;

    task.position = taskToSwapPosition;
    taskToSwap.position = taskPosition;

    await this.em.persistAndFlush([task, taskToSwap]);
    return task;
  }

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
    return task;
  }
}
