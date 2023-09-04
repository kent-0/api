import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';

import { Injectable, NotFoundException } from '@nestjs/common';

import { ProjectEntity } from '~/database/entities/project/project.entity';
import { ToCollection } from '~/utils/types/to-collection';

import { CreateProjectInput, UpdateProjectInput } from '../inputs';
import { ProjectObject } from '../objects/project.object';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: EntityRepository<ProjectEntity>,
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
    return newProject;
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
