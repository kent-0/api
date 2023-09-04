import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';

import { Injectable, NotFoundException } from '@nestjs/common';

import { ProjectRolesEntity } from '~/database/entities';
import { ToCollections } from '~/utils/types/to-collection';

import { UpdateProjectRoleInput } from '../inputs';
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

  public async delete(roleId: string) {
    const role = await this.rolesRepository.findOne({
      id: roleId,
    });

    if (!role) throw new NotFoundException('Could not find role to delete.');

    await this.em.removeAndFlush(role);
    return 'The role for project has been removed.';
  }

  public async update({
    name,
    permissions,
    roleId,
  }: UpdateProjectRoleInput): Promise<ToCollections<ProjectRolesObject>> {
    const role = await this.rolesRepository.findOne({
      id: roleId,
    });

    if (!role) throw new NotFoundException('Could not find role to update.');

    role.name = name ?? role.name;
    role.permissions = permissions ?? role.permissions;

    await this.em.persistAndFlush(role);
    return role;
  }
}
