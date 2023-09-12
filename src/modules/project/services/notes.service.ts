import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';

import { Injectable, NotFoundException } from '@nestjs/common';

import { ProjectNotesEntity } from '~/database/entities';
import { ToCollections } from '~/utils/types/to-collection';

import {
  ProjectNoteCreateInput,
  ProjectNoteRemoveInput,
  ProjectNoteUpdateInput,
} from '../inputs';
import { ProjectNotesObject } from '../objects';

/**
 * Service class responsible for handling operations related to project notes.
 * This service provides methods to create, update, delete, and manage project notes.
 */
@Injectable()
export class ProjectNotesService {
  /**
   * Constructor for the ProjectNotesService class.
   *
   * @param notesRepository - Repository for managing operations on ProjectNotesEntity.
   * It provides database actions like save, delete, and query project notes.
   * @param em - EntityManager instance for handling bulk database operations.
   * It is useful for operations like persisting multiple changes at once.
   */
  constructor(
    @InjectRepository(ProjectNotesEntity)
    private readonly notesRepository: EntityRepository<ProjectNotesEntity>,
    private readonly em: EntityManager,
  ) {}

  /**
   * Creates a new project note.
   *
   * Steps:
   * 1. Create a new instance of the project note using the provided details (content, title, and projectId).
   * 2. Persist the new project note instance to the database and flush the changes.
   * 3. Return the newly created project note.
   *
   * @param content - Detailed explanation of the note to be achieved in the project.
   * @param title - Special title given to the project note to differentiate it.
   * @param projectId - The unique identifier of the project to which the new note will belong.
   *
   * @returns The newly created project note.
   */
  public async create(
    { content, projectId, title }: ProjectNoteCreateInput,
    userId: string,
  ): Promise<ToCollections<ProjectNotesObject>> {
    const projectNote = this.notesRepository.create({
      content,
      created_by: userId,
      project: projectId,
      title,
    });

    await this.em.persistAndFlush(projectNote);
    return projectNote;
  }

  /**
   * Deletes an existing project note.
   *
   * Steps:
   * 1. Fetch the project note using provided note and project IDs.
   * 2. Check if the project note exists. If not, throw a NotFoundException.
   * 3. Remove the found project note from the database.
   * 4. Return a success message.
   *
   * @param noteId - The unique identifier of the note to be deleted.
   * @param projectId - The unique identifier of the project associated with the note.
   *
   * @returns A success message confirming the note has been deleted.
   *
   * @throws {NotFoundException} If the project note cannot be found.
   */
  public async delete(
    { noteId, projectId }: ProjectNoteRemoveInput,
    userId: string,
  ): Promise<string> {
    // Fetch the project note using provided note and project IDs.
    const projectNote = await this.notesRepository.findOne({
      created_by: userId,
      id: noteId,
      project: projectId,
    });

    // Check if the project note exists. If not, throw a NotFoundException.
    if (!projectNote) {
      throw new NotFoundException(
        'The project note you are trying to delete was not found.',
      );
    }

    // Remove the found project note from the database.
    await this.em.removeAndFlush(projectNote);

    // Return a success message.
    return 'The note has been successfully removed.';
  }

  /**
   * Updates an existing project note with new values.
   *
   * Steps:
   * 1. Fetch the project note using provided note and project IDs.
   * 2. Check if the project note exists. If not, throw a NotFoundException.
   * 3. Update the properties of the project note with the new values.
   * 4. Save the updated project note back to the database.
   * 5. Return the updated project note.
   *
   * @param content - New content or details about the note.
   * @param noteId - The unique identifier of the note to be updated.
   * @param title - New title for the note.
   * @param projectId - The unique identifier of the project associated with the note.
   * @param status - New status to set for the note.
   *
   * @returns The updated project note.
   *
   * @throws {NotFoundException} If the project note cannot be found.
   */
  public async update(
    { content, noteId, projectId, title }: ProjectNoteUpdateInput,
    userId: string,
  ): Promise<ToCollections<ProjectNotesObject>> {
    // Fetch the project note using provided note and project IDs.
    const projectNote = await this.notesRepository.findOne({
      created_by: userId,
      id: noteId,
      project: projectId,
    });

    // Check if the project note exists. If not, throw a NotFoundException.
    if (!projectNote) {
      throw new NotFoundException(
        'The project note you are trying to update could not be found.',
      );
    }

    // Update the properties of the project note with the new values.
    projectNote.content = content;
    projectNote.title = title;

    // Save the updated project note back to the database.
    await this.em.persistAndFlush(projectNote);

    // Return the updated project note.
    return projectNote;
  }
}
