import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ProjectMembersEntity, ProjectRolesEntity } from '~/database/entities';
import { ToCollections } from '~/utils/types/to-collection';

import { UpdateProjectRoleInput } from '../inputs';
import { AssignProjectRoleInput } from '../inputs/role-assign.input';
import { CreateProjectRoleInput } from '../inputs/role-create.input';
import { ProjectMembersObject, ProjectRolesObject } from '../objects';

@Injectable()
export class ProjectRolesService {
  constructor(
    @InjectRepository(ProjectRolesEntity)
    private readonly rolesRepository: EntityRepository<ProjectRolesEntity>,
    @InjectRepository(ProjectMembersEntity)
    private readonly membersRepository: EntityRepository<ProjectMembersEntity>,
    private readonly em: EntityManager,
  ) {}

  public async assignRole({
    memberId,
    projectId,
    roleId,
  }: AssignProjectRoleInput): Promise<ToCollections<ProjectMembersObject>> {
    const role = await this.rolesRepository.findOne({
      id: roleId,
      project: projectId,
    });

    const member = await this.membersRepository.findOne(
      {
        id: memberId,
      },
      {
        populate: ['roles', 'user'],
      },
    );

    if (!role) {
      throw new NotFoundException(
        'No information was found about the project role to be assigned.',
      );
    }

    if (!member) {
      throw new NotFoundException(
        'No information about the project member was found.',
      );
    }

    const memberRoles = await member.roles.loadItems();
    if (memberRoles.some(({ id }) => id === roleId)) {
      throw new ConflictException(
        'The member you want to assign the role to already has it.',
      );
    }

    member.roles.add(role);
    await this.em.persistAndFlush(member);

    return member;
  }

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
