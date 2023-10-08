import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import { Injectable } from '@nestjs/common';

import { BoardTaskEntity } from '~/database/entities';
import { BoardTaskCreateInput } from '~/modules/board/inputs/task/create.input';

@Injectable()
export class BoardTaskService {
  constructor(
    @InjectRepository(BoardTaskEntity)
    private readonly boardTaskRepository: EntityRepository<BoardTaskEntity>,
  ) {}

  public create({}: BoardTaskCreateInput) {
    return this.boardTaskRepository.findAll();
  }
}
