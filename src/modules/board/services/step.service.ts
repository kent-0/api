import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';

import { ConflictException, NotFoundException } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';

import { BoardStepEntity } from '~/database/entities';
import { ToCollections } from '~/utils/types/to-collection';

import {
  BoardStepCreateInput,
  BoardStepFinishedInput,
  BoardStepRemoveInput,
  BoardStepUpdateInput,
} from '../inputs';
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
   * Marks a specific step on a project board as the "finished" step.
   *
   * The function serves to indicate that a particular step represents the final stage
   * in a task's lifecycle on the specified board. If a step was previously marked as
   * "finished", it will be reverted to its normal state, ensuring that only one step
   * remains marked as "finished" at any given time.
   *
   * @param {BoardStepFinishedInput} params - Input parameters for this function.
   * @param {string} params.boardId - The ID of the board containing the step.
   * @param {string} params.stepId - The ID of the step intended to be marked as "finished."
   *
   * @returns {Promise<BoardStepEntity>} - Returns the updated step after being marked as "finished."
   *
   * @throws {NotFoundException} - Throws an exception if the step intended to be marked
   *                               as "finished" is not found on the specified board.
   */
  public async markAsFinished({
    boardId,
    stepId,
  }: BoardStepFinishedInput): Promise<ToCollections<BoardStepObject>> {
    // Retrieve any step currently marked as "finished" on the board.
    const previousFinishedStep = await this.stepRepository.findOne({
      board: boardId,
      finish_step: true,
    });

    // If such a step exists, revert its "finished" status.
    if (previousFinishedStep) previousFinishedStep.finish_step = false;

    // Fetch the step that is intended to be marked as "finished."
    const newFinishedStep = await this.stepRepository.findOne({
      board: boardId,
      id: stepId,
    });

    // If this step is not found, throw an exception.
    if (!newFinishedStep) {
      throw new NotFoundException(
        'The step was not found on the board to mark as a finished step.',
      );
    }

    // Mark the retrieved step as "finished."
    newFinishedStep.finish_step = true;

    // Save the changes to both steps (if applicable) in the database.
    await this.em.persistAndFlush([previousFinishedStep, newFinishedStep]);

    // Return the step that was marked as "finished."
    return newFinishedStep;
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

  /**
   * This function updates an existing step on a project board.
   *
   * Given the necessary fields for the update, it locates the step using the board and step IDs.
   * If the step is found, it updates the fields and then saves the updated step back to the database.
   *
   * @param boardId - The unique identifier of the board where the step resides.
   * @param description - A brief explanation of the step's purpose or role within the board.
   * @param finishStep - Flag to indicate if this step represents the final stage in a task's lifecycle.
   * @param max - The maximum number of tasks that can be present in this step at any given time.
   * @param name - The name of the step.
   * @param stepId - The unique identifier of the step to be updated.
   *
   * @returns The updated step.
   * @throws NotFoundException if the step to be updated cannot be found.
   */
  public async update({
    boardId,
    description,
    finishStep,
    max,
    name,
    stepId,
  }: BoardStepUpdateInput): Promise<ToCollections<BoardStepObject>> {
    // Try to locate the step in the database using the board and step IDs.
    const step = await this.stepRepository.findOne({
      board: boardId,
      id: stepId,
    });

    // If the step cannot be found, throw an exception.
    if (!step) {
      throw new NotFoundException(
        'Could not find the step to update from the board.',
      );
    }

    // Update the step's fields with the provided values, or leave them unchanged if no new value is provided.
    step.description = description ?? step.description;
    step.finish_step = finishStep ?? step.finish_step;
    step.max = max ?? step.max;
    step.name = name ?? step.name;

    // Save the updated step back to the database.
    await this.em.persistAndFlush(step);

    // Return the updated step.
    return step;
  }
}
