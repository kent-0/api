import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';

import { ConflictException, NotFoundException } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';

import { BoardStepEntity } from '~/database/entities';
import { ToCollections } from '~/utils/types/to-collection';

import { BoardStepCreateInput, BoardStepRemoveInput } from '../inputs';
import { BoardStepObject } from '../objects';

/**
 * StepService Resolver
 *
 * This service resolver is responsible for handling operations related to board steps in the application.
 * Board steps represent various phases or stages in a project management process, and this resolver provides
 * methods for their CRUD operations.
 *
 */
@Resolver()
export class StepService {
  /**
   * Constructor for the StepService class.
   *
   * @param stepRepository - An instance of the EntityRepository for the BoardStepEntity.
   *                         This repository provides methods to interact with the board steps data in the database.
   * @param em - An instance of the EntityManager.
   *             This manager provides transactional operations to manage database entities.
   */
  constructor(
    @InjectRepository(BoardStepEntity)
    private readonly stepRepository: EntityRepository<BoardStepEntity>,
    private readonly em: EntityManager,
  ) {}

  /**
   * Creates a new step for a specific project board.
   * Steps in a board can be used to represent various phases or stages in a project management process.
   * Each step can have certain attributes, such as whether it's the final step in the board's process flow,
   * or the maximum number of tasks it can hold. This method ensures that only one step is marked as the
   * final step and creates a new step based on the provided parameters.
   *
   * @param {BoardStepCreateInput} boardStepCreateInput - Input object containing the details required to create the new step.
   *
   * @throws {ConflictException} - Throws an exception if trying to create another finishing step when one already exists.
   *
   * @returns {Promise<ToCollections<BoardStepObject>>} - A promise that resolves to the created board step object.
   */
  public async create({
    boardId,
    finishStep,
    max,
    name,
    position,
  }: BoardStepCreateInput): Promise<ToCollections<BoardStepObject>> {
    // Check if the step is intended to be the finishing step in the board's flow.
    if (finishStep) {
      const finishedStep = await this.stepRepository.findOne({
        board: boardId,
        finish_step: true,
      });

      // If a finishing step already exists for the board, throw an error.
      if (finishedStep) {
        throw new ConflictException(
          'You cannot mark another step as the end of the step flow because it already exists.',
        );
      }
    }

    // Create a new board step based on the input parameters.
    const newStep = this.stepRepository.create({
      board: boardId,
      finish_step: finishStep ?? false,
      max,
      name,
      position,
    });

    // Persist the new step in the database and flush the changes.
    await this.em.persistAndFlush(newStep);

    // Return the newly created step.
    return newStep;
  }

  /**
   * Removes a specific step from a board.
   *
   * This function is designed to find and remove a particular step from a board.
   * It first checks if the step exists for the provided board and step IDs.
   * If the step doesn't exist, it throws an error.
   * Otherwise, it proceeds to remove the step from the database.
   *
   * @param {BoardStepRemoveInput} boardStepRemoveInput - Contains the IDs of the board and the step to be removed.
   * @returns {string} - A message indicating the result of the operation.
   * @throws {NotFoundException} - Throws this exception if the step to be removed cannot be found.
   */
  public async remove({
    boardId,
    stepId,
  }: BoardStepRemoveInput): Promise<string> {
    // Try to find the step with the provided board and step IDs.
    const step = await this.stepRepository.findOne({
      board: boardId,
      id: stepId,
    });

    // If the step doesn't exist, throw a NotFoundException.
    if (!step) {
      throw new NotFoundException(
        'Could not find the step to remove from the board.',
      );
    }

    // Remove the step from the database.
    await this.em.removeAndFlush(step);

    // Return a success message.
    return 'The step has been successfully removed.';
  }
}
