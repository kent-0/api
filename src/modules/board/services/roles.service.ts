import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { BoardMembersEntity, BoardRolesEntity } from '~/database/entities';
import { checkValidPermissions } from '~/permissions/enums/project.enum';
import { ToCollections } from '~/utils/types/to-collection';

import {
  BoardRoleAssignInput,
  BoardRoleCreate,
  BoardRolePaginationInput,
  BoardRoleUnassignInput,
  BoardRoleUpdateInput,
} from '../inputs';
import {
  BoardMembersObject,
  BoardPaginatedBoardRoles,
  BoardRolesObject,
} from '../objects';

/**
 * Service class responsible for managing board roles.
 *
 * This service provides methods to perform operations related to board roles,
 * such as assignment, unassignment, creation, deletion, updating, and pagination.
 */
@Injectable()
export class BoardRolesService {
  /**
   * Constructs a new instance of the BoardRolesService.
   *
   * @param {EntityRepository<BoardRolesEntity>} rolesRepository - Repository for accessing and manipulating board roles.
   * @param {EntityRepository<BoardMembersEntity>} membersRepository - Repository for accessing and manipulating board members.
   * @param {EntityManager} em - Entity manager for managing database operations.
   */
  constructor(
    @InjectRepository(BoardRolesEntity)
    private readonly rolesRepository: EntityRepository<BoardRolesEntity>,
    @InjectRepository(BoardMembersEntity)
    private readonly membersRepository: EntityRepository<BoardMembersEntity>,
    private readonly em: EntityManager,
  ) {}

  /**
   * Assigns a role to a board member.
   *
   * @param {Object} params - The parameters for assigning roles.
   * @param {string} params.memberId - The ID of the member.
   * @param {string} params.boardId - The ID of the board.
   * @param {string} params.roleId - The ID of the role to be assigned.
   *
   * @returns {Promise<ToCollections<BoardMembersObject>>} - Returns the updated member object.
   *
   * @throws {NotFoundException} - Throws an exception if the role or member is not found.
   * @throws {ConflictException} - Throws an exception if the member already has the role assigned.
   */
  public async assign({
    boardId,
    memberId,
    roleId,
  }: BoardRoleAssignInput): Promise<ToCollections<BoardMembersObject>> {
    // Fetch the specified role for the provided board.
    const role = await this.rolesRepository.findOne({
      board: boardId,
      id: roleId,
    });

    // Fetch the member by their ID, and populate associated roles and user details.
    const member = await this.membersRepository.findOne(
      {
        id: memberId,
      },
      {
        populate: ['roles', 'user'],
      },
    );

    // Check if the role exists; if not, throw an exception.
    if (!role) {
      throw new NotFoundException(
        'No information was found about the board role to be assigned.',
      );
    }

    // Check if the member exists; if not, throw an exception.
    if (!member) {
      throw new NotFoundException(
        'No information about the board member was found.',
      );
    }

    // Load roles associated with the member.
    const memberRoles = await member.roles.loadItems();

    // Check if the member already has the specified role; if so, throw a conflict exception.
    if (memberRoles.some(({ id }) => id === roleId)) {
      throw new ConflictException(
        'The member you want to assign the role to already has it.',
      );
    }

    // Assign the role to the member.
    member.roles.add(role);

    // Persist changes to the database.
    await this.em.persistAndFlush(member);

    // Return the updated member object.
    return member;
  }

  /**
   * Creates a new board role.
   *
   * This method carries out the following steps:
   * 1. Constructs a new role object with the provided details.
   * 2. Persists the new role to the database.
   * 3. Returns the newly created role object.
   *
   * @param {Object} params - The parameters for creating a new board role.
   * @param {string} params.name - The name of the new role.
   * @param {Array<string>} params.permissions - A list of permissions associated with the role.
   * @param {string} params.boardId - The ID of the board the role belongs to.
   *
   * @returns {Promise<ToCollections<BoardRolesObject>>} - Returns the newly created role object.
   */
  public async create({
    boardId,
    name,
    permissions,
  }: BoardRoleCreate): Promise<ToCollections<BoardRolesObject>> {
    // Create a new role object with the provided details.
    const role = this.rolesRepository.create({
      board: boardId,
      name,
      permissions,
    });

    // Check if the permissions are valid for the type of role.
    if (!checkValidPermissions(permissions)) {
      throw new ConflictException(
        'It seems that the permissions you have entered are invalid. Make sure to enter only valid permissions for the type of role created.',
      );
    }

    // Persist the new role to the database.
    await this.em.persistAndFlush(role);

    // Return the newly created role object.
    return role;
  }

  /**
   * Deletes a board role by its ID.
   *
   * This method performs the following steps:
   * 1. Fetches the role using the provided ID.
   * 2. If the role does not exist, throws a NotFoundException.
   * 3. Removes the role from the database.
   * 4. Returns a confirmation message indicating the role has been removed.
   *
   * @param {string} roleId - The ID of the role to be deleted.
   *
   * @returns {Promise<string>} - Returns a confirmation message indicating successful deletion.
   *
   * @throws {NotFoundException} - Throws this exception if the specified role is not found.
   */
  public async delete(roleId: string): Promise<string> {
    // Fetch the role using the provided ID.
    const role = await this.rolesRepository.findOne({
      id: roleId,
    });

    // If the role does not exist, throw an exception.
    if (!role) throw new NotFoundException('Could not find role to delete.');

    // Remove the role from the database.
    await this.em.removeAndFlush(role);

    // Return a confirmation message.
    return 'The role for board has been removed.';
  }

  /**
   * Paginates and returns a list of board roles for a specific board.
   *
   * This method performs the following steps:
   * 1. Constructs the order by criteria if both `sortBy` and `sortOrder` are provided.
   * 2. Fetches the paginated roles based on the provided criteria.
   * 3. Calculates the total number of pages.
   * 4. Returns the paginated roles, along with metadata about the pagination.
   *
   * @param {Object} params - The parameters for paginating board roles.
   * @param {number} params.page - The current page number (1-indexed).
   * @param {string} params.boardId - The ID of the board whose roles are to be fetched.
   * @param {number} params.size - The number of roles per page.
   * @param {string} [params.sortBy] - The field to sort by (optional).
   * @param {'ASC' | 'DESC'} [params.sortOrder] - The sort order (optional).
   *
   * @returns {Promise<BoardPaginatedBoardRoles>} - Returns the paginated roles and associated metadata.
   */
  public async paginate({
    boardId,
    page,
    size,
    sortBy,
    sortOrder,
  }: BoardRolePaginationInput): Promise<BoardPaginatedBoardRoles> {
    // Constructs the order by criteria if both `sortBy` and `sortOrder` are provided.
    let orderBy = {};
    if (sortBy && sortOrder) orderBy = { [sortBy]: sortOrder };

    // Fetches the paginated roles based on the provided criteria.
    const [boardRolesPaginated, total] =
      await this.rolesRepository.findAndCount(
        {
          board: boardId,
        },
        {
          limit: size,
          offset: (page - 1) * size,
          orderBy,
          populate: ['members', 'board'],
        },
      );

    // Calculates the total number of pages.
    const totalPages = Math.ceil(total / size);

    // Returns the paginated roles, along with metadata about the pagination.
    return {
      hasNextPage: page < totalPages,
      hasPreviousPage: page !== 0,
      items: boardRolesPaginated,
      totalItems: total,
      totalPages,
    };
  }

  /**
   * Unassigns a role from a board member.
   *
   * This method carries out the following steps:
   * 1. Fetches the specified role for the given board.
   * 2. Fetches the member by their ID and populates their roles and user details.
   * 3. Checks if the specified role and member exist; if not, throws appropriate exceptions.
   * 4. Verifies if the member has the specified role; if not, throws a conflict exception.
   * 5. Removes the role from the member and persists the changes.
   * 6. Returns the updated member object after role removal.
   *
   * @param {Object} params - The parameters for unassigning roles.
   * @param {string} params.memberId - The ID of the member from whom the role will be removed.
   * @param {string} params.boardId - The ID of the board the role belongs to.
   * @param {string} params.roleId - The ID of the role to be removed.
   *
   * @returns {Promise<ToCollections<BoardMembersObject>>} - Returns the updated member object after role removal.
   *
   * @throws {NotFoundException} - Throws this exception in two scenarios:
   *                               1. If the specified role is not found for the board.
   *                               2. If the specified member is not found.
   * @throws {ConflictException} - Throws this exception if the member doesn't have the specified role assigned.
   */
  public async unassign({
    boardId,
    memberId,
    roleId,
  }: BoardRoleUnassignInput): Promise<ToCollections<BoardMembersObject>> {
    // Fetch the specified role for the provided board.
    const role = await this.rolesRepository.findOne({
      board: boardId,
      id: roleId,
    });

    // Fetch the member by their ID, and populate associated roles and user details.
    const member = await this.membersRepository.findOne(
      {
        id: memberId,
      },
      {
        populate: ['roles', 'user'],
      },
    );

    // If the role does not exist, throw an exception.
    if (!role) {
      throw new NotFoundException(
        'No information was found about the board role to be assigned.',
      );
    }

    // If the member does not exist, throw an exception.
    if (!member) {
      throw new NotFoundException(
        'No information about the board member was found.',
      );
    }

    // Load roles associated with the member.
    const memberRoles = await member.roles.loadItems();

    // Check if the member doesn't have the specified role; if so, throw a conflict exception.
    if (!memberRoles.some(({ id }) => id === roleId)) {
      throw new ConflictException(
        'The member does not have the role you are trying to remove.',
      );
    }

    // Remove the role from the member.
    member.roles.remove(role);

    // Persist changes to the database.
    await this.em.persistAndFlush(member);

    // Return the updated member object.
    return member;
  }

  /**
   * Updates the details of a board role.
   *
   * This method performs the following steps:
   * 1. Fetches the role using the provided ID.
   * 2. If the role does not exist, throws a NotFoundException.
   * 3. Updates the role's name and permissions if provided.
   * 4. Persists the updated role to the database.
   * 5. Returns the updated role object.
   *
   * @param {Object} params - The parameters for updating a board role.
   * @param {string} params.name - The new name for the role (optional).
   * @param {Array<string>} params.permissions - The new list of permissions for the role (optional).
   * @param {string} params.roleId - The ID of the role to be updated.
   *
   * @returns {Promise<ToCollections<BoardRolesObject>>} - Returns the updated role object.
   *
   * @throws {NotFoundException} - Throws this exception if the specified role is not found.
   */
  public async update({
    name,
    permissions,
    roleId,
  }: BoardRoleUpdateInput): Promise<ToCollections<BoardRolesObject>> {
    // Fetch the role using the provided ID.
    const role = await this.rolesRepository.findOne({
      id: roleId,
    });

    // If the role does not exist, throw an exception.
    if (!role) throw new NotFoundException('Could not find role to update.');

    // Update the role's name and permissions if provided.
    role.name = name ?? role.name;
    role.permissions = permissions ?? role.permissions;

    // Persist the updated role to the database.
    await this.em.persistAndFlush(role);

    // Return the updated role object.
    return role;
  }
}
