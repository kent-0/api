import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';

import { Injectable, NotFoundException } from '@nestjs/common';

import { BoardEntity, BoardMembersEntity } from '~/database/entities';
import { ToCollections } from '~/utils/types/to-collection';

import {
  BoardCreateInput,
  BoardDeleteInput,
  BoardUpdateInput,
} from '../inputs';
import { BoardGetInput } from '../inputs/board/get.input';
import { BoardObject } from '../objects';

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
   * @returns {Promise<ToCollections<BoardObject>>} The created board entity.
   */
  public async create(
    { description, name, projectId }: BoardCreateInput,
    userId: string,
  ): Promise<ToCollections<BoardObject>> {
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

  /**
   * Asynchronously deletes a specific board from the database.
   *
   * Steps:
   * 1. Attempt to find the board in the database using the provided boardId and projectId.
   * 2. If the board is not found, throw a NotFoundException.
   * 3. If the board is found, proceed to delete it from the database.
   * 4. Return a confirmation message indicating successful deletion.
   *
   * @param {BoardDeleteInput} input - Contains the unique identifiers for the board and the associated project.
   * @property {string} boardId - The unique identifier of the board to be deleted.
   * @property {string} projectId - The unique identifier of the project associated with the board.
   *
   * @throws {NotFoundException} - Indicates that the board to be deleted was not found in the database.
   *
   * @returns {Promise<string>} - A promise that resolves to a confirmation message indicating successful deletion.
   */
  public async delete({
    boardId,
    projectId,
  }: BoardDeleteInput): Promise<string> {
    // Attempt to find the board based on the provided boardId and projectId.
    const board = await this.boardRepository.findOne(
      {
        id: boardId,
        project: projectId,
      },
      {
        fields: ['created_by.id'],
      },
    );

    // If the board is not found, throw a NotFoundException.
    if (!board) {
      throw new NotFoundException(
        'The board you are trying to delete could not be found.',
      );
    }

    // If the board is found, remove it from the database and flush the changes.
    await this.em.removeAndFlush(board);

    // Return a confirmation message indicating successful deletion.
    return `Board ${board.name} successfully deleted.`;
  }

  /**
   * Retrieves a specific board from the system based on the provided board ID.
   * This function performs a detailed query, not only fetching the board's basic details but also
   * associated information about the creator of the board and the project to which the board belongs.
   *
   * Steps:
   * 1. Execute a repository query to find a board matching the provided board ID.
   * 2. If the board is not found, throw a NotFoundException.
   * 3. If found, return the board details.
   *
   * @param boardId - The unique identifier (typically a UUID) of the board to be retrieved.
   *
   * @returns Promise<ToCollections<BoardObject>> - Returns the board's details wrapped in a promise.
   * This includes board properties, creator's details, and associated project's details.
   *
   * @throws NotFoundException - If the board with the specified ID does not exist in the database.
   */
  public async get({
    boardId,
    projectId,
  }: BoardGetInput): Promise<ToCollections<BoardObject>> {
    // Step 1: Query the board repository to find the specified board.
    const board = await this.boardRepository.findOne(
      {
        id: boardId,
        project: projectId,
      },
      {
        fields: [
          'created_by.id',
          'created_by.username',
          'created_by.first_name',
          'created_by.last_name',
          'project.description',
          'project.end_date',
          'project.owner.id',
          'project.owner.username',
          'project.owner.first_name',
          'project.owner.last_name',
          'project.start_date',
          'project.id',
          'project.name',
        ],
      },
    );

    // Step 2: Check if the board was found. If not, throw an exception.
    if (!board) {
      throw new NotFoundException(
        'The board you are trying to get could not be found.',
      );
    }

    // Step 3: Return the board details.
    return board;
  }

  /**
   * Updates the details of an existing board in the system.
   *
   * This function is responsible for modifying the details of a board based on the user's input.
   * It ensures that the board belongs to the specified project and then proceeds to update the fields.
   * Only the board's name and description can be updated. If the board cannot be found, an exception
   * is thrown to alert the user.
   *
   * Steps:
   * 1. Query the database to retrieve the board with the specified `boardId` and `projectId`,
   *    along with specific fields related to its creator and associated project.
   * 2. Check if the board exists. If not, throw a `NotFoundException`.
   * 3. Update the board's name and description based on the provided input.
   *    If no new value is provided for a particular field, retain its current value.
   * 4. Persist the updated board to the database.
   * 5. Return the updated board.
   *
   * @param boardId - The unique identifier of the board to be updated.
   * @param description - The new description for the board.
   * @param name - The new name for the board.
   *
   * @returns The updated board entity.
   *
   * @throws NotFoundException if the board cannot be found.
   */
  public async update({ boardId, description, name }: BoardUpdateInput) {
    const board = await this.boardRepository.findOne(
      {
        id: boardId,
      },
      {
        fields: [
          'created_by.id',
          'created_by.username',
          'created_by.first_name',
          'created_by.last_name',
          'project.description',
          'project.end_date',
          'project.owner.id',
          'project.owner.username',
          'project.owner.first_name',
          'project.owner.last_name',
          'project.start_date',
          'project.id',
          'project.name',
        ],
      },
    );

    if (!board) {
      throw new NotFoundException(
        'The board you are trying to update could not be found.',
      );
    }

    board.name = name ?? board.name;
    board.description = description ?? board.description;

    await this.em.persistAndFlush(board);

    return board;
  }
}
