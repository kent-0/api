import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';

import { Injectable } from '@nestjs/common';

import { ProjectRolesEntity } from '~/database/entities';
import { ToCollections } from '~/utils/types/to-collection';

import { CreateProjectRoleInput } from '../inputs/role-create.input';
import { ProjectRolesObject } from '../objects';

@Injectable()
export class ProjectRolesService {
  constructor(
    @InjectRepository(ProjectRolesEntity)
    private readonly rolesRepository: EntityRepository<ProjectRolesEntity>,
    private readonly em: EntityManager,
  ) {}

  public async create({
    name,
    permissions,
    projectId,
  }: CreateProjectRoleInput): Promise<ToCollections<ProjectRolesObject>> {
    const role = this.rolesRepository.create({
      name,
      permissions,
      project: projectId,
    });

    await this.em.persistAndFlush(role);
    return role;
  }
}
