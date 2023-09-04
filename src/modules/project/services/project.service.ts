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
 * Service responsible for handling project-related operations.
 */
@Injectable()
export class ProjectService {
  /**
   * Constructor for the ProjectService class.
   * @param {EntityRepository<ProjectEntity>} projectRepository - Repository for ProjectEntity.
   * @param {EntityRepository<ProjectMembersEntity>} membersRepository - Repository for ProjectMembersEntity.
   * @param {EntityManager} em - Entity manager for database operations.
   */
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: EntityRepository<ProjectEntity>,
    @InjectRepository(ProjectMembersEntity)
    private readonly membersRepository: EntityRepository<ProjectMembersEntity>,
    private readonly em: EntityManager,
  ) {}

  /**
   * Creates a new project and assigns the owner as a member.
   * @param {CreateProjectInput} projectData - The input data for creating the project.
   * @param {string} userId - The ID of the user creating the project.
   * @returns {Promise<ToCollections<ProjectObject>>} The newly created project.
   */
  public async create(
    { description, name }: CreateProjectInput,
    userId: string,
  ): Promise<ToCollections<ProjectObject>> {
    // Create a new project entity
    const newProject = this.projectRepository.create({
      description,
      name,
      owner: userId,
    });

    // Persist the new project entity
    await this.em.persistAndFlush(newProject);

    // Create a project member entry for the owner
    const ownerMember = this.membersRepository.create({
      project: newProject,
      user: userId,
    });

    // Persist the owner member entry
    await this.em.persistAndFlush(ownerMember);

    return newProject;
  }

  /**
   * Deletes a project if the requester is the owner.
   * @param {string} projectId - The ID of the project to be deleted.
   * @param {string} userId - The ID of the user requesting the deletion.
   * @returns {Promise<string>} A success message upon successful deletion.
   * @throws {NotFoundException} If the project is not found.
   * @throws {ForbiddenException} If the requester is not the owner.
   */
  public async delete(projectId: string, userId: string): Promise<string> {
    // Find the project entity to be deleted
    const project = await this.projectRepository.findOne(
      {
        id: projectId,
      },
      {
        populate: ['owner'],
      },
    );

    if (!project) {
      throw new NotFoundException(
        'The project you wanted to delete has not been found.',
      );
    }

    // Check if the requester is the owner
    if (project.owner.id !== userId) {
      throw new ForbiddenException('Only the owner can delete the projects.');
    }

    // Remove and flush the project entity
    await this.em.removeAndFlush(project);

    return 'The project has been successfully removed.';
  }

  /**
   * Retrieves project details based on the provided ID and user ID.
   * @param {string} projectId - The ID of the project to be retrieved.
   * @param {string} userId - The ID of the user requesting the project details.
   * @returns {Promise<ToCollections<ProjectObject>>} The requested project details.
   * @throws {NotFoundException} If the project is not found.
   * @throws {ForbiddenException} If the requester is not a member or owner of the project.
   */
  public async get(projectId: string): Promise<ToCollections<ProjectObject>> {
    // Find the project entity and populate related entities
    const project = await this.projectRepository.findOne(
      {
        id: projectId,
      },
      {
        populate: ['owner', 'members', 'roles', 'members.roles'],
      },
    );

    if (!project) {
      throw new NotFoundException(
        'The project you are trying to view does not exist.',
      );
    }

    return project;
  }

  /**
   * Updates project details based on the provided input.
   * @param {UpdateProjectInput} projectData - The input data for updating the project.
   * @returns {Promise<ToCollections<ProjectObject>>} The updated project details.
   * @throws {NotFoundException} If the project is not found.
   */
  public async update({
    description,
    id,
    name,
  }: UpdateProjectInput): Promise<ToCollections<ProjectObject>> {
    // Find the project entity to be updated
    const project = await this.projectRepository.findOne(
      {
        id,
      },
      {
        populate: ['owner'],
      },
    );

    if (!project)
      throw new NotFoundException(
        'The project you wanted to update has not been found.',
      );

    // Update project details
    project.name = name;
    project.description = description;

    // Persist and flush the updated project entity
    await this.em.persistAndFlush(project);

    return project;
  }
}
