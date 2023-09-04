import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';

import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ProjectMembersEntity } from '~/database/entities';
import { ProjectEntity } from '~/database/entities/project/project.entity';
import { ToCollection } from '~/utils/types/to-collection';

import { CreateProjectInput, UpdateProjectInput } from '../inputs';
import { ProjectObject } from '../objects/project.object';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: EntityRepository<ProjectEntity>,
    @InjectRepository(ProjectMembersEntity)
    private readonly membersRepository: EntityRepository<ProjectMembersEntity>,
    private readonly em: EntityManager,
  ) {}

  public async create(
    { description, name }: CreateProjectInput,
    userId: string,
  ): Promise<ToCollection<ProjectObject>> {
    const newProject = this.projectRepository.create({
      description,
      name,
      owner: userId,
    });

    await this.em.persistAndFlush(newProject);

    const ownerMember = this.membersRepository.create({
      project: newProject,
      user: userId,
    });

    await this.em.persistAndFlush(ownerMember);
    return newProject;
  }

  public async delete(projectId: string, userId: string): Promise<string> {
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

    if (project.owner.id !== userId) {
      throw new ForbiddenException('Only the owner can delete the projects.');
    }

    await this.em.removeAndFlush(project);
    return 'The project has been successfully removed.';
  }

  public async get(
    projectId: string,
    userId: string,
  ): Promise<ToCollection<ProjectObject>> {
    const project = await this.projectRepository.findOne(
      {
        id: projectId,
      },
      {
        populate: ['owner', 'members'],
      },
    );

    if (!project) {
      throw new NotFoundException(
        'The project you are trying to view does not exist.',
      );
    }

    // TODO: Missing roles
    const members = await project.members.loadItems({ populate: ['user'] });

    if (
      members.length &&
      project.owner.id !== userId &&
      !members.some(({ id }) => id === userId)
    ) {
      throw new ForbiddenException(
        'You are not a member or owner of the project to view it.',
      );
    }

    return project;
  }

  public async update({
    description,
    id,
    name,
  }: UpdateProjectInput): Promise<ToCollection<ProjectObject>> {
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

    project.name = name;
    project.description = description;

    await this.em.persistAndFlush(project);
    return project;
  }
}
