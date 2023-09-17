import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';

import { ConflictException, Injectable } from '@nestjs/common';

import { BoardMembersEntity } from '~/database/entities';
import { ToCollections } from '~/utils/types/to-collection';

import { AddRemoveBoardMemberInput } from '../inputs';
import { BoardMembersObject } from '../objects';

/**
 * Provides methods to manage board members, including adding and removing members from boards.
 * This service interacts with the database using MikroORM's entity repository and EntityManager.
 */
@Injectable()
export class BoardMemberService {
  constructor(
    @InjectRepository(BoardMembersEntity)
    private readonly membersRepository: EntityRepository<BoardMembersEntity>,
    private readonly em: EntityManager,
  ) {}

  /**
   * Add a User as a Board Member
   *
   * Adds a user as a member to the specified board. Checks if the user is already a member,
   * and if not, creates a new board member entity and associates it with the board and user.
   * Returns the newly created board member object.
   *
   * @param input - The input containing the board ID and user ID.
   * @returns The newly created board member object.
   * @throws ConflictException if the user is already a member of the board.
   */
  public async add({
    boardId,
    userId,
  }: AddRemoveBoardMemberInput): Promise<ToCollections<BoardMembersObject>> {
    // Check if the user is already a member of the board.
    const currentMember = await this.membersRepository.findOne({
      board: boardId,
      user: userId,
    });

    if (currentMember) {
      throw new ConflictException(
        'This user is already a member of the board.',
      );
    }

    // Create a new board member entity and associate it with the board and user.
    const newMember = this.membersRepository.create({
      board: boardId,
      user: userId,
    });

    // Persist the new member entity in the database.
    await this.em.persistAndFlush(newMember);
    return newMember;
  }

  /**
   * Remove a Board Member
   *
   * Removes a user from the specified board members. Checks if the user is a member,
   * and if yes, removes the board member entity. Throws an exception if the user is
   * the board owner or not a member of the board.
   *
   * @param input - The input containing the board ID and user ID.
   * @returns A success message indicating the user was removed from the board members.
   * @throws ConflictException if the user is not a member of the board or is the board owner.
   */
  public async remove({
    boardId,
    userId,
  }: AddRemoveBoardMemberInput): Promise<string> {
    // Find the board member entity for the specified board and user.
    const member = await this.membersRepository.findOne({
      board: boardId,
      user: userId,
    });

    // If the user is not a board member, throw an exception.
    if (!member) {
      throw new ConflictException('The user is not a member of the board.');
    }

    // Remove the board member entity from the database.
    await this.em.removeAndFlush(member);
    return 'The user was successfully removed from the board members.';
  }
}
