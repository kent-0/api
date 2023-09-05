import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ProjectMembersEntity, ProjectRolesEntity } from '~/database/entities';
import { ToCollections } from '~/utils/types/to-collection';

import {
  AssignProjectRoleInput,
  CreateProjectRoleInput,
  UnassignProjectRoleInput,
  UpdateProjectRoleInput,
} from '../inputs';
import { ProjectRolePaginationInput } from '../inputs/role-pagination';
import {
  ProjectMembersObject,
  ProjectPaginatedProjectRoles,
  ProjectRolesObject,
} from '../objects';

@Injectable()
export class ProjectRolesService {
  constructor(
    @InjectRepository(ProjectRolesEntity)
    private readonly rolesRepository: EntityRepository<ProjectRolesEntity>,
    @InjectRepository(ProjectMembersEntity)
    private readonly membersRepository: EntityRepository<ProjectMembersEntity>,
    private readonly em: EntityManager,
  ) {}

  public async assign({
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

  public async paginate({
    page,
    projectId,
    size,
    sortBy,
    sortOrder,
  }: ProjectRolePaginationInput): Promise<ProjectPaginatedProjectRoles> {
    let orderBy = {};
    if (sortBy && sortOrder) orderBy = { [sortBy]: sortOrder };

    const [projectRolesPaginated, total] =
      await this.rolesRepository.findAndCount(
        {
          project: projectId,
        },
        {
          limit: size,
          offset: (page - 1) * size,
          orderBy,
          populate: ['members', 'project'],
        },
      );

    const totalPages = Math.ceil(total / size);

    return {
      hasNextPage: page < totalPages,
      hasPreviousPage: page !== 0,
      items: projectRolesPaginated,
      totalItems: total,
      totalPages,
    };
  }

  public async unassing({
    memberId,
    projectId,
    roleId,
  }: UnassignProjectRoleInput): Promise<ToCollections<ProjectMembersObject>> {
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
    if (!memberRoles.some(({ id }) => id === roleId)) {
      throw new ConflictException(
        'The member does not have the role you are trying to remove.',
      );
    }

    member.roles.remove(role);
    await this.em.persistAndFlush(member);

    return member;
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
