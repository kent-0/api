import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';

import { ConflictException, Injectable } from '@nestjs/common';

import { ProjectMembersEntity } from '~/database/entities';
import { ToCollections } from '~/utils/types/to-collection';

import { ProjectMemberAddRemoveInput } from '../inputs';
import { ProjectMemberObject } from '../objects';

/**
 * Provides methods to manage project members, including adding and removing members from projects.
 * This service interacts with the database using MikroORM's entity repository and EntityManager.
 */
@Injectable()
export class ProjectMemberService {
  constructor(
    @InjectRepository(ProjectMembersEntity)
    private readonly membersRepository: EntityRepository<ProjectMembersEntity>,
    private readonly em: EntityManager,
  ) {}

  /**
   * Add a User as a Project Member
   *
   * Adds a user as a member to the specified project. Checks if the user is already a member,
   * and if not, creates a new project member entity and associates it with the project and user.
   * Returns the newly created project member object.
   *
   * @param input - The input containing the project ID and user ID.
   * @returns The newly created project member object.
   * @throws ConflictException if the user is already a member of the project.
   */
  public async add({
    projectId,
    userId,
  }: ProjectMemberAddRemoveInput): Promise<ToCollections<ProjectMemberObject>> {
    // Check if the user is already a member of the project.
    const currentMember = await this.membersRepository.findOne({
      project: projectId,
      user: userId,
    });

    if (currentMember) {
      throw new ConflictException(
        'This user is already a member of the project.',
      );
    }

    // Create a new project member entity and associate it with the project and user.
    const newMember = this.membersRepository.create({
      project: projectId,
      user: userId,
    });

    // Persist the new member entity in the database.
    await this.em.persistAndFlush(newMember);
    return newMember;
  }

  /**
   * Remove a Project Member
   *
   * Removes a user from the specified project members. Checks if the user is a member,
   * and if yes, removes the project member entity. Throws an exception if the user is
   * the project owner or not a member of the project.
   *
   * @param input - The input containing the project ID and user ID.
   * @returns A success message indicating the user was removed from the project members.
   * @throws ConflictException if the user is not a member of the project or is the project owner.
   */
  public async remove({
    projectId,
    userId,
  }: ProjectMemberAddRemoveInput): Promise<string> {
    // Find the project member entity for the specified project and user.
    const member = await this.membersRepository.findOne(
      {
        project: projectId,
        user: userId,
      },
      {
        fields: ['project.owner.id'],
      },
    );

    // If the user is not a project member, throw an exception.
    if (!member) {
      throw new ConflictException('The user is not a member of the project.');
    }

    // If the user is the project owner, throw an exception.
    if (userId === member.project.owner.id) {
      throw new ConflictException(
        'You cannot remove the project member who acts as the project owner.',
      );
    }

    // Remove the project member entity from the database.
    await this.em.removeAndFlush(member);
    return 'The user was successfully removed from the project members.';
  }
}
