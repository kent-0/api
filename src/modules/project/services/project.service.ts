import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';

import { Injectable } from '@nestjs/common';

import { ProjectEntity } from '~/database/entities/project/project.entity';

import { CreateUpdateProjectInput } from '../inputs/create-update-project.input';

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
  ) /* : Promise<ProjectObject> */ {
    const newProject = this.projectRepository.create({
      description,
      name,
      owner: userId,
    });

    await this.em.persistAndFlush(newProject);
    return newProject;
  }
}
