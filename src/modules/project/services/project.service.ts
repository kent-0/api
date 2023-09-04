import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';

import { Injectable } from '@nestjs/common';

import { ProjectEntity } from '~/database/entities/project/project.entity';
import { ToCollection } from '~/utils/types/to-collection';

import { CreateUpdateProjectInput } from '../inputs/create-update-project.input';
import { ProjectObject } from '../objects/project.object';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: EntityRepository<ProjectEntity>,
    private readonly em: EntityManager,
  ) {}

  public async create(
    { description, name }: CreateUpdateProjectInput,
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
}
