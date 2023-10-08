import { EntityManager } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import { ConflictException, Injectable } from '@nestjs/common';

import { BoardStepEntity, BoardTaskEntity } from '~/database/entities';
import { BoardTaskCreateInput } from '~/modules/board/inputs/task/create.input';

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
    { boardId, description, name, tags }: BoardTaskCreateInput,
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
      tags,
    });

    await this.em.persistAndFlush(task);
    return task;
  }
}
