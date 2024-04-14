import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ProjectMembersEntity, ProjectRolesEntity } from '~/database/entities';
import { checkValidPermissions } from '~/permissions/enums/project.enum';
import { createFieldPaths } from '~/utils/functions/create-fields-path';

import {
  ProjectRoleAssignInput,
  ProjectRoleCreateInput,
  ProjectRolePaginationInput,
  ProjectRoleRemoveInput,
  ProjectRoleUnassignInput,
  ProjectRoleUpdateInput,
} from '../inputs';
import {
  ProjectMembersMinimalProperties,
  ProjectMinimalProperties,
  ProjectRolesMinimalProperties,
  ProjectRolesPaginated,
} from '../objects';

/**
 * Service class responsible for managing project roles.
 *
 * This service provides methods to perform operations related to project roles,
 * such as assignment, unassignment, creation, deletion, updating, and pagination.
 */
@Injectable()
export class ProjectRoleService {
  /**
   * Constructs a new instance of the ProjectRolesService.
   *
   * @param {EntityRepository<ProjectRolesEntity>} rolesRepository - Repository for accessing and manipulating project roles.
   * @param {EntityRepository<ProjectMembersEntity>} membersRepository - Repository for accessing and manipulating project members.
   * @param {EntityManager} em - Entity manager for managing database operations.
   */
  constructor(
    @InjectRepository(ProjectRolesEntity)
    private readonly rolesRepository: EntityRepository<ProjectRolesEntity>,
    @InjectRepository(ProjectMembersEntity)
    private readonly membersRepository: EntityRepository<ProjectMembersEntity>,
    private readonly em: EntityManager,
  ) {}

  /**
   * Reorders the roles of a project.
   *
   * @param projectId - The ID of the board whose roles are to be reordered.
   * @private
   */
  private async recountRolesPositions(projectId: string) {
    // Fetch all tasks associated with the given board and step, ordered by their current position.
    const tasks = await this.rolesRepository.find(
      {
        project: projectId,
      },
      {
        orderBy: {
          position: 'ASC',
          updatedAt: 'DESC',
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
   * Assigns a role to a project member.
   *
   * @param {Object} params - The parameters for assigning roles.
   * @param {string} params.memberId - The ID of the member.
   * @param {string} params.projectId - The ID of the project.
   * @param {string} params.roleId - The ID of the role to be assigned.
   *
   * @returns - Returns the updated member object.
   *
   * @throws {NotFoundException} - Throws an exception if the role or member is not found.
   * @throws {ConflictException} - Throws an exception if the member already has the role assigned.
   */
  public async assign({ memberId, projectId, roleId }: ProjectRoleAssignInput) {
    // Fetch the specified role for the provided project.
    const role = await this.rolesRepository.findOne({
      id: roleId,
      project: projectId,
    });

    // Fetch the member by their ID, and populate associated roles and user details.
    const member = await this.membersRepository.findOne(
      {
        id: memberId,
        project: projectId,
      },
      {
        fields: [
          ...ProjectMembersMinimalProperties,
          ...createFieldPaths('project', ...ProjectMinimalProperties),
          ...createFieldPaths('roles', ...ProjectRolesMinimalProperties),
        ],
      },
    );

    // Check if the role exists; if not, throw an exception.
    if (!role) {
      throw new NotFoundException(
        'No information was found about the project role to be assigned.',
      );
    }

    // Check if the member exists; if not, throw an exception.
    if (!member) {
      throw new NotFoundException(
        'No information about the project member was found.',
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
   * Creates a new project role.
   *
   * This method carries out the following steps:
   * 0. Fetches the roles count of the project.
   * 1. Constructs a new role object with the provided details.
   * 2. Persists the new role to the database.
   * 3. Returns the newly created role object.
   *
   * @param {Object} params - The parameters for creating a new project role.
   * @param {string} params.name - The name of the new role.
   * @param {number} params.permissions_denied - The permissions denied for the role.
   * @param {number} params.permissions_granted - The permissions granted for the role.
   * @param {string} params.projectId - The ID of the project the role belongs to.
   *
   * @returns - Returns the newly created role object.
   */
  public async create({
    name,
    permissions_denied,
    permissions_granted,
    position,
    projectId,
  }: ProjectRoleCreateInput) {
    // Fetch roles count of the project.
    const rolesCount = await this.rolesRepository.count({
      project: projectId,
    });

    // Create a new role object with the provided details.
    const role = this.rolesRepository.create({
      name,
      permissions_denied,
      permissions_granted,
      position: position ?? rolesCount + 1,
      project: projectId,
    });

    // Check if the permissions are valid for the type of role.
    if (
      !checkValidPermissions(permissions_denied) ||
      !checkValidPermissions(permissions_granted)
    ) {
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
   * Paginates and returns a list of project roles for a specific project.
   *
   * This method performs the following steps:
   * 1. Constructs the order by criteria if both `sortBy` and `sortOrder` are provided.
   * 2. Fetches the paginated roles based on the provided criteria.
   * 3. Calculates the total number of pages.
   * 4. Returns the paginated roles, along with metadata about the pagination.
   *
   * @param {Object} params - The parameters for paginating project roles.
   * @param {number} params.page - The current page number (1-indexed).
   * @param {string} params.projectId - The ID of the project whose roles are to be fetched.
   * @param {number} params.size - The number of roles per page.
   * @param {string} [params.sortBy] - The field to sort by (optional).
   * @param {'ASC' | 'DESC'} [params.sortOrder] - The sort order (optional).
   *
   * @returns {Promise<ProjectRolesPaginated>} - Returns the paginated roles and associated metadata.
   */
  public async paginate({
    page,
    projectId,
    size,
    sortBy,
    sortOrder,
  }: ProjectRolePaginationInput): Promise<ProjectRolesPaginated> {
    // Constructs the order by criteria if both `sortBy` and `sortOrder` are provided.
    let orderBy = {};
    if (sortBy && sortOrder) orderBy = { [sortBy]: sortOrder };

    // Fetches the paginated roles based on the provided criteria.
    const [projectRolesPaginated, total] =
      await this.rolesRepository.findAndCount(
        {
          project: projectId,
        },
        {
          fields: [
            ...ProjectRolesMinimalProperties,
            ...createFieldPaths('members', ...ProjectMembersMinimalProperties),
            ...createFieldPaths(
              'members.roles',
              ...ProjectRolesMinimalProperties,
              ...createFieldPaths('project', ...ProjectMinimalProperties),
            ),
            ...createFieldPaths('project', ...ProjectMinimalProperties),
          ],
          limit: size,
          offset: (page - 1) * size,
          orderBy,
        },
      );

    // Calculates the total number of pages.
    const totalPages = Math.ceil(total / size);

    // Returns the paginated roles, along with metadata about the pagination.
    return {
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1 && page <= totalPages,
      items: projectRolesPaginated,
      totalItems: total,
      totalPages,
    };
  }

  /**
   * Deletes a project role by its ID.
   *
   * This method performs the following steps:
   * 1. Fetches the role using the provided ID.
   * 2. If the role does not exist, throws a NotFoundException.
   * 3. Removes the role from the database.
   * 4. Returns a confirmation message indicating the role has been removed.
   *
   * @param {ProjectRoleRemoveInput} params - The parameters for removing a project role.
   *
   * @returns {Promise<string>} - Returns a confirmation message indicating successful deletion.
   *
   * @throws {NotFoundException} - Throws this exception if the specified role is not found.
   */
  public async remove({
    projectId,
    roleId,
  }: ProjectRoleRemoveInput): Promise<string> {
    // Fetch the role using the provided ID.
    const role = await this.rolesRepository.findOne({
      id: roleId,
      project: projectId,
    });

    // If the role does not exist, throw an exception.
    if (!role) throw new NotFoundException('Could not find role to delete.');

    // Remove the role from the database.
    await this.em.removeAndFlush(role);

    // Return a confirmation message.
    return 'The role for project has been removed.';
  }

  /**
   * Unassigns a role from a project member.
   *
   * This method carries out the following steps:
   * 1. Fetches the specified role for the given project.
   * 2. Fetches the member by their ID and populates their roles and user details.
   * 3. Checks if the specified role and member exist; if not, throws appropriate exceptions.
   * 4. Verifies if the member has the specified role; if not, throws a conflict exception.
   * 5. Removes the role from the member and persists the changes.
   * 6. Returns the updated member object after role removal.
   *
   * @param {Object} params - The parameters for unassigning roles.
   * @param {string} params.memberId - The ID of the member from whom the role will be removed.
   * @param {string} params.projectId - The ID of the project the role belongs to.
   * @param {string} params.roleId - The ID of the role to be removed.
   *
   * @returns - Returns the updated member object after role removal.
   *
   * @throws {NotFoundException} - Throws this exception in two scenarios:
   *                               1. If the specified role is not found for the project.
   *                               2. If the specified member is not found.
   * @throws {ConflictException} - Throws this exception if the member doesn't have the specified role assigned.
   */
  public async unassign({
    memberId,
    projectId,
    roleId,
  }: ProjectRoleUnassignInput) {
    // Fetch the specified role for the provided project.
    const role = await this.rolesRepository.findOne({
      id: roleId,
      project: projectId,
    });

    // Fetch the member by their ID, and populate associated roles and user details.
    const member = await this.membersRepository.findOne(
      {
        id: memberId,
      },
      {
        fields: [
          ...ProjectMembersMinimalProperties,
          ...createFieldPaths('project', ...ProjectMinimalProperties),
        ],
      },
    );

    // If the role does not exist, throw an exception.
    if (!role) {
      throw new NotFoundException(
        'No information was found about the project role to be assigned.',
      );
    }

    // If the member does not exist, throw an exception.
    if (!member) {
      throw new NotFoundException(
        'No information about the project member was found.',
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
   * Updates the details of a project role.
   *
   * This method performs the following steps:
   * 1. Fetches the role using the provided ID.
   * 2. If the role does not exist, throws a NotFoundException.
   * 3. Updates the role's name and permissions if provided.
   * 4. Check if the permissions are valid for the type of role.
   * 5. Persists the updated role to the database.
   * 6. Returns the updated role object.
   *
   * @param {Object} params - The parameters for updating a project role.
   * @param {string} params.name - The new name for the role (optional).
   * @param {number} params.permissions_granted - The new permissions granted for the role (optional).
   * @param {number} params.permissions_denied - The new permissions denied for the role (optional).
   * @param {string} params.roleId - The ID of the role to be updated.
   *
   * @returns - Returns the updated role object.
   *
   * @throws {NotFoundException} - Throws this exception if the specified role is not found.
   */
  public async update({
    name,
    permissions_denied,
    permissions_granted,
    position,
    projectId,
    roleId,
  }: ProjectRoleUpdateInput) {
    // Fetch the role using the provided ID.
    const role = await this.rolesRepository.findOne(
      {
        id: roleId,
        project: projectId,
      },
      {
        fields: [
          ...ProjectRolesMinimalProperties,
          ...createFieldPaths('project', ...ProjectMinimalProperties),
          ...createFieldPaths('members', ...ProjectMembersMinimalProperties),
          ...createFieldPaths('members.project', ...ProjectMinimalProperties),
        ],
      },
    );

    // If the role does not exist, throw an exception.
    if (!role) throw new NotFoundException('Could not find role to update.');

    if (permissions_denied !== undefined) {
      if (!checkValidPermissions(permissions_denied)) {
        throw new ConflictException(
          'It seems that the denied permissions you have entered are invalid. Make sure to enter only valid permissions for the type of role updated.',
        );
      }

      role.permissions_denied = permissions_denied;
    }

    if (permissions_granted !== undefined) {
      if (!checkValidPermissions(permissions_granted)) {
        throw new ConflictException(
          'It seems that the granted permissions you have entered are invalid. Make sure to enter only valid permissions for the type of role updated.',
        );
      }

      role.permissions_denied = permissions_granted;
    }

    // Update the role's name and permissions if provided.
    role.name = name ?? role.name;
    role.position = position ?? role.position;

    // Persist the updated role to the database.
    await this.em.persistAndFlush(role);
    await this.recountRolesPositions(projectId);

    // Return the updated role object.
    return role;
  }
}
