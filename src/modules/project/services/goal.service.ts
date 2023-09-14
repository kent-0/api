import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';

import { Injectable, NotFoundException } from '@nestjs/common';

import { ProjectGoalsEntity } from '~/database/entities';
import { ToCollections } from '~/utils/types/to-collection';

import {
  ProjectGoalCreateInput,
  ProjectGoalRemoveInput,
  ProjectGoalUpdateInput,
} from '../inputs';
import { ProjectGoalsObject } from '../objects';

/**
 * Service class responsible for handling operations related to project goals.
 * This service provides methods to create, update, delete, and manage project goals.
 */
@Injectable()
export class ProjectGoalService {
  /**
   * Constructor for the ProjectGoalsService class.
   *
   * @param goalsRepository - Repository for managing operations on ProjectGoalsEntity.
   * It provides database actions like save, delete, and query project goals.
   * @param em - EntityManager instance for handling bulk database operations.
   * It is useful for operations like persisting multiple changes at once.
   */
  constructor(
    @InjectRepository(ProjectGoalsEntity)
    private readonly goalsRepository: EntityRepository<ProjectGoalsEntity>,
    private readonly em: EntityManager,
  ) {}

  /**
   * Creates a new project goal.
   *
   * Steps:
   * 1. Create a new instance of the project goal using the provided details (description, name, and projectId).
   * 2. Persist the new project goal instance to the database and flush the changes.
   * 3. Return the newly created project goal.
   *
   * @param description - Detailed explanation of the goal to be achieved in the project.
   * @param name - Special name given to the project goal to differentiate it.
   * @param projectId - The unique identifier of the project to which the new goal will belong.
   *
   * @returns The newly created project goal.
   */
  public async create({
    description,
    name,
    projectId,
  }: ProjectGoalCreateInput): Promise<ToCollections<ProjectGoalsObject>> {
    const projectGoal = this.goalsRepository.create({
      description,
      name,
      project: projectId,
    });

    await this.em.persistAndFlush(projectGoal);
    return projectGoal;
  }

  /**
   * Deletes an existing project goal.
   *
   * Steps:
   * 1. Fetch the project goal using provided goal and project IDs.
   * 2. Check if the project goal exists. If not, throw a NotFoundException.
   * 3. Remove the found project goal from the database.
   * 4. Return a success message.
   *
   * @param goalId - The unique identifier of the goal to be deleted.
   * @param projectId - The unique identifier of the project associated with the goal.
   *
   * @returns A success message confirming the goal has been deleted.
   *
   * @throws {NotFoundException} If the project goal cannot be found.
   */
  public async delete({
    goalId,
    projectId,
  }: ProjectGoalRemoveInput): Promise<string> {
    // Fetch the project goal using provided goal and project IDs.
    const projectGoal = await this.goalsRepository.findOne({
      id: goalId,
      project: projectId,
    });

    // Check if the project goal exists. If not, throw a NotFoundException.
    if (!projectGoal) {
      throw new NotFoundException(
        'The project goal you are trying to delete was not found.',
      );
    }

    // Remove the found project goal from the database.
    await this.em.removeAndFlush(projectGoal);

    // Return a success message.
    return 'The goal has been successfully removed.';
  }

  /**
   * Updates an existing project goal with new values.
   *
   * Steps:
   * 1. Fetch the project goal using provided goal and project IDs.
   * 2. Check if the project goal exists. If not, throw a NotFoundException.
   * 3. Update the properties of the project goal with the new values.
   * 4. Save the updated project goal back to the database.
   * 5. Return the updated project goal.
   *
   * @param description - New content or details about the goal.
   * @param goalId - The unique identifier of the goal to be updated.
   * @param name - New name for the goal.
   * @param projectId - The unique identifier of the project associated with the goal.
   * @param status - New status to set for the goal.
   *
   * @returns The updated project goal.
   *
   * @throws {NotFoundException} If the project goal cannot be found.
   */
  public async update({
    description,
    goalId,
    name,
    projectId,
    status,
  }: ProjectGoalUpdateInput): Promise<ToCollections<ProjectGoalsObject>> {
    // Fetch the project goal using provided goal and project IDs.
    const projectGoal = await this.goalsRepository.findOne({
      id: goalId,
      project: projectId,
    });

    // Check if the project goal exists. If not, throw a NotFoundException.
    if (!projectGoal) {
      throw new NotFoundException(
        'The project goal you are trying to update could not be found.',
      );
    }

    // Update the properties of the project goal with the new values.
    projectGoal.name = name ?? projectGoal.name;
    projectGoal.description = description ?? projectGoal.description;
    projectGoal.status = status ?? projectGoal.status;

    // Save the updated project goal back to the database.
    await this.em.persistAndFlush(projectGoal);

    // Return the updated project goal.
    return projectGoal;
  }
}
