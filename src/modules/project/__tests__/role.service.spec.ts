import { MikroORM, RequestContext } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import {
  AuthEmailsEntity,
  AuthPasswordEntity,
  AuthTokensEntity,
  AuthUserEntity,
  ProjectEntity,
  ProjectMembersEntity,
  ProjectRolesEntity,
} from '~/database/entities';
import { AuthModule } from '~/modules/auth/auth.module';
import { AuthAccountService } from '~/modules/auth/services/account.service';
import { ProjectMemberService } from '~/modules/project/services/member.service';
import { ProjectService } from '~/modules/project/services/project.service';
import { ProjectRoleService } from '~/modules/project/services/role.service';
import { ProjectPermissionsEnum } from '~/permissions/enums/project.enum';

import { expect } from 'vitest';

import { TestingMikroORMConfig } from '../../../../mikro-orm.config';

describe('Role management successfully cases', () => {
  let service: ProjectRoleService;
  let accountService: AuthAccountService;
  let projectMemberService: ProjectMemberService;
  let projectService: ProjectService;
  let module: TestingModule;
  let em: EntityManager;
  let orm: MikroORM;
  let project: ProjectEntity;
  let userMember: ProjectMembersEntity;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        MikroOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (_configService: ConfigService) =>
            TestingMikroORMConfig(
              _configService.getOrThrow('MIKRO_ORM_DB_TEST_URL'),
            ),
        }),
        MikroOrmModule.forFeature({
          entities: [
            ProjectMembersEntity,
            AuthUserEntity,
            AuthPasswordEntity,
            AuthTokensEntity,
            AuthEmailsEntity,
            ProjectEntity,
            ProjectRolesEntity,
          ],
        }),
        AuthModule,
      ],
      providers: [ProjectRoleService, ProjectMemberService, ProjectService],
    }).compile();

    service = module.get<ProjectRoleService>(ProjectRoleService);
    orm = module.get<MikroORM>(MikroORM);
    em = module.get<EntityManager>(EntityManager);
    accountService = module.get<AuthAccountService>(AuthAccountService);
    projectService = module.get<ProjectService>(ProjectService);
    projectMemberService =
      module.get<ProjectMemberService>(ProjectMemberService);

    await orm.getSchemaGenerator().refreshDatabase();

    await RequestContext.createAsync(em, async () => {
      const userProjectOwner = await accountService.signUp({
        email: 'sawa@acme.com',
        first_name: 'Sawa',
        last_name: 'Ko',
        password: 'sawako',
        username: 'sawako',
      });

      const userMemberTest = await accountService.signUp({
        email: 'sawa2@acme.com',
        first_name: 'Sawa',
        last_name: 'Ko',
        password: 'sawako',
        username: 'sawako2',
      });

      const projectTest = await projectService.create(
        {
          description: 'Kento testing project',
          name: 'Kento',
        },
        userProjectOwner.id,
      );

      project = await em.findOneOrFail(ProjectEntity, { id: projectTest.id });

      await projectMemberService.add({
        projectId: project.id,
        userId: userMemberTest.id,
      });

      userMember = await em.findOneOrFail(ProjectMembersEntity, {
        user: userMemberTest.id,
      });
    });
  });

  afterAll(async () => {
    await orm.close();
    await module.close();
  });

  it('should be able to create a role', async () => {
    await RequestContext.createAsync(em, async () => {
      const role = await service.create({
        name: 'Testing role',
        permissions: ProjectPermissionsEnum.RoleCreate,
        projectId: project.id,
      });

      expect(role).toBeDefined();
      expect(role.name).toEqual('Testing role');
      expect(role.project.id).toEqual(project.id);
    });
  });

  it('should be able to update a role', async () => {
    await RequestContext.createAsync(em, async () => {
      const role = await service.create({
        name: 'Testing role',
        permissions: ProjectPermissionsEnum.RoleCreate,
        projectId: project.id,
      });

      const updatedRole = await service.update({
        name: 'Testing role updated',
        permissions: ProjectPermissionsEnum.RoleCreate,
        projectId: project.id,
        roleId: role.id,
      });

      expect(updatedRole).toBeDefined();
      expect(updatedRole.name).toEqual('Testing role updated');
    });
  });

  it('should be able to delete a role', async () => {
    await RequestContext.createAsync(em, async () => {
      const role = await service.create({
        name: 'Testing role',
        permissions: ProjectPermissionsEnum.RoleCreate,
        projectId: project.id,
      });

      const deletedRole = await service.remove(role.id);

      expect(deletedRole).toBe('The role for project has been removed.');
    });
  });

  it('should be able to get all roles', async () => {
    await RequestContext.createAsync(em, async () => {
      const roles = await service.paginate({
        page: 1,
        projectId: project.id,
        size: 10,
      });

      expect(roles).toBeDefined();
      expect(roles.totalItems).toEqual(2);
      expect(roles.hasNextPage).toBe(false);
      expect(roles.hasPreviousPage).toBe(false);
    });
  });

  it('should be able to assign a role to project member', async () => {
    await RequestContext.createAsync(em, async () => {
      const role = await service.create({
        name: 'Testing role',
        permissions: ProjectPermissionsEnum.RoleCreate,
        projectId: project.id,
      });

      expect(role).toBeDefined();
      expect(role.name).toEqual('Testing role');

      const assignedRole = await service.assign({
        memberId: userMember.id,
        projectId: project.id,
        roleId: role.id,
      });

      expect(assignedRole).toBeDefined();

      const rolesAssigned = await assignedRole.roles.getItems();
      expect(rolesAssigned.length).toEqual(1);

      const roleAssigned = rolesAssigned.at(0);
      expect(roleAssigned).toBeDefined();
      expect(roleAssigned.name).toEqual('Testing role');
    });
  });

  it('should be able to remove a role from project member', async () => {
    await RequestContext.createAsync(em, async () => {
      const role = await service.create({
        name: 'Testing role',
        permissions: ProjectPermissionsEnum.RoleCreate,
        projectId: project.id,
      });

      expect(role).toBeDefined();
      expect(role.name).toEqual('Testing role');

      const assignedRole = await service.assign({
        memberId: userMember.id,
        projectId: project.id,
        roleId: role.id,
      });

      expect(assignedRole).toBeDefined();

      const rolesAssigned = await assignedRole.roles.getItems();
      const roleAssigned = rolesAssigned.find((r) => r.id === role.id);

      expect(roleAssigned).toBeDefined();
      expect(roleAssigned.name).toEqual('Testing role');

      const removedRole = await service.unassign({
        memberId: userMember.id,
        projectId: project.id,
        roleId: role.id,
      });

      const rolesRemoved = await removedRole.roles.getItems();
      const isRoleRemoved = rolesRemoved.some((r) => r.id === role.id);

      expect(isRoleRemoved).toBe(false);
    });
  });
});
