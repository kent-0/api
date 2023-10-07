import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';

import { Injectable, NotFoundException } from '@nestjs/common';

import { BoardStepEntity } from '~/database/entities';
import { createFieldPaths } from '~/utils/functions/create-fields-path';
import { ToCollections } from '~/utils/types/to-collection';

import {
  BoardStepCreateInput,
  BoardStepFinishedInput,
  BoardStepMoveInput,
  BoardStepRemoveInput,
  BoardStepUpdateInput,
} from '../inputs';
import {
  BoardMinimalProperties,
  BoardStepMinimalProperties,
  BoardStepObject,
} from '../objects';

/**
 * This service resolver is responsible for handling operations related to board steps in the application.
 * Board steps represent various phases or stages in a project management process, and this resolver provides
 * methods for their CRUD operations.
 *
 */
@Injectable()
export class BoardStepService {
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
   * Method to create a new step on a given board.
   *
   * This method is responsible for creating a new step on a specific board.
   * The new step's position is determined by the number of existing steps on
   * the board, ensuring the new step is appended at the end. By doing so, we ensure
   * that the new step's position is always the next available position on the board.
   *
   * @param {BoardStepCreateInput} params - Input parameters that contain:
   *   - `boardId`: ID of the board where the new step will be created.
   *   - `max`: Maximum number of tasks that can be in the new step.
   *   - `name`: Name that the new step will have.
   * @returns {Promise<BoardStepObject>} - The newly created step.
   *
   * @throws Will throw an error if saving the new step to the database fails.
   */
  public async create({
    boardId,
    max,
    name,
  }: BoardStepCreateInput): Promise<ToCollections<BoardStepObject>> {
    // Fetch all the steps associated with the given board.
    const boardSteps = await this.stepRepository.find({
      board: boardId,
    });

    // Construct a new step object with the given parameters and the calculated position.
    const newStep = this.stepRepository.create({
      board: boardId,
      max,
      name,
      position: boardSteps.length + 1, // Determine the position by counting existing steps.
    });

    // Save the newly created step to the database.
    await this.em.persistAndFlush(newStep);

    // Return the new step.
    return newStep;
  }

  /**
   * Marks a specific step on a project board as the "finished" step.
   *
   * The function serves to indicate that a particular step represents the final stage
   * in a task's lifecycle on the specified board. If a step was previously marked as
   * "finished", it will be reverted to its normal state, ensuring that only one-step
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
    // Count the number of steps on the board.
    const boardStepsCount = await this.stepRepository.count({
      board: boardId,
    });

    // If the board has no steps, throw an exception.
    if (boardStepsCount === 1) {
      throw new NotFoundException(
        'The board has no other steps to mark as finished.',
      );
    }

    // Retrieve any step currently marked as "finished" on the board.
    const previousFinishedStep = await this.stepRepository.findOne({
      board: boardId,
      finish_step: true,
    });

    // Fetch the step that is intended to be marked as "finished."
    const newFinishedStep = await this.stepRepository.findOne(
      {
        board: boardId,
        id: stepId,
      },
      {
        fields: [
          ...BoardStepMinimalProperties,
          ...createFieldPaths('board', ...BoardMinimalProperties),
        ],
      },
    );

    // If this step is not found, throw an exception.
    if (!newFinishedStep) {
      throw new NotFoundException(
        'The step was not found on the board to mark as a finished step.',
      );
    }

    // Mark the retrieved step as "finished."
    newFinishedStep.finish_step = true;

    // If such a step exists, revert its "finished" status and "position" and save the changes.
    if (previousFinishedStep) {
      previousFinishedStep.finish_step = false;

      // Replace steps positions
      const tempPosition = newFinishedStep.position;

      newFinishedStep.position = previousFinishedStep.position;
      previousFinishedStep.position = tempPosition;

      await this.em.persistAndFlush(previousFinishedStep);
    } else {
      // Move the step to the last position on the board.
      newFinishedStep.position = boardStepsCount;
    }

    // Save the changes in the database.
    await this.em.persistAndFlush(newFinishedStep);

    // Return the step that was marked as "finished."
    return newFinishedStep;
  }

  /**
   * Move or reorder the position of a specific step within a board.
   *
   * This function is designed to rearrange the order of steps on a board, ensuring that
   * the board's layout suits the user's workflow. It performs a swap between the targeted
   * step and another step that currently occupies the desired position.
   *
   * @param {BoardStepMoveInput} input - Contains the details required for moving a step.
   * @returns {Promise<BoardStepObject>} - Returns the moved step.
   * @throws {NotFoundException} - Throws an exception if the targeted step or the replacement
   * step position is not found.
   */
  public async move({
    boardId,
    position,
    stepId,
  }: BoardStepMoveInput): Promise<ToCollections<BoardStepObject>> {
    const boardStepsCount = await this.stepRepository.count({
      board: boardId,
    });

    // If the board has no steps, throw an exception.
    if (boardStepsCount === 1) {
      throw new NotFoundException(
        'The board has no other steps to move positions.',
      );
    }

    // Retrieve the step intended to be moved.
    const step = await this.stepRepository.findOne(
      {
        board: boardId,
        id: stepId,
      },
      {
        fields: [
          ...BoardStepMinimalProperties,
          ...createFieldPaths('board', ...BoardMinimalProperties),
        ],
      },
    );

    // If the step is not found, throw an exception.
    if (!step) {
      throw new NotFoundException(
        'Could not find the step to move from the board.',
      );
    }

    // Retrieve the step currently occupying the desired position.
    const positionReplaceStep = await this.stepRepository.findOne({
      board: boardId,
      position,
    });

    // If the replacement position doesn't have a step, throw an exception.
    if (!positionReplaceStep) {
      throw new NotFoundException(
        'You are trying to move the column to a position that is not on the board.',
      );
    }

    if (positionReplaceStep.finish_step) {
      throw new NotFoundException(
        'You are trying to move a column to the position of the finished column. This column cannot be moved.',
      );
    }

    // Swap positions between the targeted step and the replacement step.
    const tempPosition = step.position;

    step.position = positionReplaceStep.position;
    positionReplaceStep.position = tempPosition;

    // Persist the changes to the database.
    await this.em.persistAndFlush([positionReplaceStep, step]);

    // Return the step that has been moved.
    return step;
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
    const step = await this.stepRepository.findOne(
      {
        board: boardId,
        id: stepId,
      },
      {
        fields: [
          ...BoardStepMinimalProperties,
          ...createFieldPaths('board', ...BoardMinimalProperties),
        ],
      },
    );

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
