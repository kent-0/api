import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';

import { Injectable, NotFoundException } from '@nestjs/common';

import { BoardTagsEntity } from '~/database/entities';
import {
  BoardTagsCreateInput,
  BoardTagsUpdateInput,
  BoardTaskTagDeleteInput,
} from '~/modules/board/inputs';
import { BoardMinimalProperties } from '~/modules/board/objects';
import { BoardTagMinimalProperties } from '~/modules/board/objects/minimal/tag.object';
import { BoardTaskMinimalProperties } from '~/modules/board/objects/minimal/task.object';
import { createFieldPaths } from '~/utils/functions/create-fields-path';

@Injectable()
export class BoardTagsService {
  constructor(
    @InjectRepository(BoardTagsEntity)
    private readonly boardTagsRepository: EntityRepository<BoardTagsEntity>,
    private em: EntityManager,
  ) {}

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
