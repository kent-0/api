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

  public move() {}

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
