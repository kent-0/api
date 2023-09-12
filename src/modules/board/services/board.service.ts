import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';

import { Injectable } from '@nestjs/common';

import { BoardEntity, BoardMembersEntity } from '~/database/entities';

import { BoardCreateInput } from '../inputs';

/**
 * Provides essential services related to board management within the application.
 * This service allows for operations like creating new boards, adding members to a board,
 * updating board details, and other related functions.
 *
 * The `BoardService` class interacts with the database through MikroORM's EntityRepository
 * to perform CRUD operations on the `BoardEntity` and `BoardMembersEntity`.
 */
@Injectable()
export class BoardService {
  /**
   * Initializes a new instance of the BoardService.
   *
   * @param boardRepository - Repository for CRUD operations on the BoardEntity.
   * @param boardMembersRepository - Repository for CRUD operations on the BoardMembersEntity.
   * @param em - EntityManager for handling database transactions.
   */
  constructor(
    @InjectRepository(BoardEntity)
    private readonly boardRepository: EntityRepository<BoardEntity>,
    @InjectRepository(BoardMembersEntity)
    private readonly boardMembersRepository: EntityRepository<BoardMembersEntity>,
    private readonly em: EntityManager,
  ) {}

  /**
   * Creates a new board associated with a specific project and adds the creator as its first member.
   *
   * Steps:
   * 1. Create a new board using the provided details.
   * 2. Save the board to the database.
   * 3. Add the creator (user) as the first member of the board.
   * 4. Save the new board member to the database.
   *
   * @param {BoardCreateInput} description, name, projectId - Input data to create a new board.
   * @param {string} userId - ID of the user creating the board.
   * @returns {Promise<BoardEntity>} The created board entity.
   */
  public async create(
    { description, name, projectId }: BoardCreateInput,
    userId: string,
  ): Promise<BoardEntity> {
    // Step 1: Create a new board entity instance.
    const newBoard = this.boardRepository.create({
      created_by: userId,
      description,
      name,
      project: projectId,
    });

    // Step 2: Persist the new board to the database.
    await this.em.persistAndFlush(newBoard);

    // Step 3: Create a new board member entity instance.
    const newMember = this.boardMembersRepository.create({
      board: newBoard.id,
      user: userId,
    });

    // Step 4: Persist the new board member to the database.
    await this.em.persistAndFlush(newMember);

    return newBoard;
  }
}
