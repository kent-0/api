import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';

import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ProjectMembersEntity } from '~/database/entities';
import { ProjectEntity } from '~/database/entities/project/project.entity';
import { ToCollections } from '~/utils/types/to-collection';

import { CreateProjectInput, UpdateProjectInput } from '../inputs';
import { ProjectObject } from '../objects/project.object';

/**
 * Service class responsible for managing projects.
 *
 * This service provides methods to perform CRUD operations related to projects,
 * as well as other related functionalities.
 */
@Injectable()
export class ProjectService {
  /**
   * Constructor for the ProjectService class.
   * Initializes the repositories and entity manager for further operations.
   *
   * @param {EntityRepository<ProjectEntity>} projectRepository - Repository for accessing and manipulating projects.
   * @param {EntityRepository<ProjectMembersEntity>} membersRepository - Repository for accessing and manipulating project members.
   * @param {EntityManager} em - Entity manager for managing database operations.
   */
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: EntityRepository<ProjectEntity>,
    @InjectRepository(ProjectMembersEntity)
    private readonly membersRepository: EntityRepository<ProjectMembersEntity>,
    private readonly em: EntityManager,
  ) {}

  /**
   * Creates a new project and assigns the given user as its owner.
   *
   * This method carries out the following steps:
   * 1. Constructs a new project entity using the provided details.
   * 2. Persists the new project to the database.
   * 3. Creates a project member entry for the project owner.
   * 4. Persists the project owner member entry to the database.
   * 5. Returns the newly created project object.
   *
   * @param {Object} params - The parameters for creating a new project.
   * @param {string} params.description - The description of the new project.
   * @param {string} params.name - The name of the new project.
   * @param {string} userId - The ID of the user who will be the owner of the project.
   *
   * @returns {Promise<ToCollections<ProjectObject>>} - Returns the newly created project object.
   */
  public async create(
    { description, name }: CreateProjectInput,
    userId: string,
  ): Promise<ToCollections<ProjectObject>> {
    // Create a new project entity with the provided details.
    const newProject = this.projectRepository.create({
      description,
      name,
      owner: userId,
    });

    // Persist the new project entity to the database.
    await this.em.persistAndFlush(newProject);

    // Create a project member entry for the user, marking them as the owner of the project.
    const ownerMember = this.membersRepository.create({
      project: newProject,
      user: userId,
    });

    // Persist the owner member entry to the database.
    await this.em.persistAndFlush(ownerMember);

    // Return the newly created project object.
    return newProject;
  }

  /**
   * Deletes a project if the requester is the owner.
   *
   * This method carries out the following steps:
   * 1. Fetches the project entity from the database using the provided projectId, populating its owner details.
   * 2. If the project doesn't exist, throws a NotFoundException.
   * 3. Verifies if the requester is the owner of the project. If not, throws a ForbiddenException.
   * 4. If the requester is confirmed as the owner, removes the project entity from the database.
   * 5. Returns a success message indicating the project has been deleted.
   *
   * @param {string} projectId - The ID of the project to be deleted.
   * @param {string} userId - The ID of the user requesting the deletion.
   * @returns {Promise<string>} A success message upon successful deletion.
   * @throws {NotFoundException} If the project is not found.
   * @throws {ForbiddenException} If the requester is not the owner.
   */
  public async delete(projectId: string, userId: string): Promise<string> {
    // Fetch the project entity and its associated owner details from the database using the provided projectId.
    const project = await this.projectRepository.findOne(
      {
        id: projectId,
      },
      {
        populate: ['owner'],
      },
    );

    // If the project doesn't exist, throw a NotFoundException.
    if (!project) {
      throw new NotFoundException(
        'The project you wanted to delete has not been found.',
      );
    }

    // Verify if the requester is the owner of the project. If not, throw a ForbiddenException.
    if (project.owner.id !== userId) {
      throw new ForbiddenException('Only the owner can delete the projects.');
    }

    // Remove the project entity from the database.
    await this.em.removeAndFlush(project);

    // Return a success message.
    return 'The project has been successfully removed.';
  }

  /**
   * Retrieves project details based on the provided project ID.
   *
   * This method carries out the following steps:
   * 1. Fetches the project entity from the database using the provided projectId.
   *    It also populates details of the project's owner, members, roles, and the roles of its members.
   * 2. If the project is not found in the database, throws a NotFoundException.
   * 3. Returns the fetched project details.
   *
   * @param {string} projectId - The ID of the project to be retrieved.
   * @returns {Promise<ToCollections<ProjectObject>>} The requested project details.
   * @throws {NotFoundException} If the project is not found.
   */
  public async get(projectId: string): Promise<ToCollections<ProjectObject>> {
    // Fetch the project entity with its associated entities from the database using the provided projectId.
    const project = await this.projectRepository.findOne(
      {
        id: projectId,
      },
      {
        populate: ['owner', 'members', 'roles', 'members.roles'],
      },
    );

    // If the fetched project entity is null or undefined, it's an indication that the project doesn't exist.
    if (!project) {
      throw new NotFoundException(
        'The project you are trying to view does not exist.',
      );
    }

    // Return the fetched project details.
    return project;
  }

  /**
   * Updates project details based on the provided input.
   *
   * This method carries out the following steps:
   * 1. Fetches the project entity from the database using the provided project ID.
   * 2. If the project doesn't exist, throws a NotFoundException.
   * 3. Updates the project's name and description with the provided values.
   * 4. Persists the changes to the database.
   * 5. Returns the updated project details.
   *
   * @param {UpdateProjectInput} projectData - The input data for updating the project.
   * @returns {Promise<ToCollections<ProjectObject>>} The updated project details.
   * @throws {NotFoundException} If the project is not found.
   */
  public async update({
    description,
    id,
    name,
  }: UpdateProjectInput): Promise<ToCollections<ProjectObject>> {
    // Fetch the project entity using the provided project ID.
    const project = await this.projectRepository.findOne(
      {
        id,
      },
      {
        populate: ['owner'],
      },
    );

    // If the project doesn't exist in the database, throw a NotFoundException.
    if (!project) {
      throw new NotFoundException(
        'The project you wanted to update has not been found.',
      );
    }

    // Update the project's name and description with the provided values.
    project.name = name ?? project.name;
    project.description = description ?? project.description;

    // Persist the changes to the database.
    await this.em.persistAndFlush(project);

    // Return the updated project details.
    return project;
  }
}
