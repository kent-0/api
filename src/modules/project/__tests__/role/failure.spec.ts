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

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { TestingMikroORMConfig } from '../../../../../mikro-orm.config';

/**
 * `Role Management Unsuccessful Cases` Test Suite:
 * This test suite focuses on validating the unsuccessful scenarios related to project roles.
 * The primary goal is to ensure that the system correctly handles invalid operations or data related
 * to roles and provides appropriate error messages or responses.
 */
describe('Project - Role unsuccessfully cases', async () => {
  let service: ProjectRoleService;
  let accountService: AuthAccountService;
  let projectMemberService: ProjectMemberService;
  let projectService: ProjectService;
  let module: TestingModule;
  let em: EntityManager;
  let orm: MikroORM;
  let project: ProjectEntity;
  let userMember: ProjectMembersEntity;

  /**
   * Before Each Setup:
   * This hook is executed before all the test cases in the suite. Its primary responsibilities include:
   * 1. Compiling and initializing the testing module.
   * 2. Instantiating services for testing.
   * 3. Setting up a clean database state and generating test data.
   */
  beforeEach(async () => {
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

  /**
   * Cleanup after test are finished.
   */
  afterEach(async () => {
    await module.close();
  });

  /**
   * Test Case: Invalid Role Creation:
   * Validates the scenario where a role is attempted to be created with an invalid permissions bit.
   * The system should detect this invalid input and respond with an appropriate error message.
   */
  it('should not create a role with invalid permissions bit', async () => {
    await RequestContext.createAsync(em, async () => {
      expect(
        service.create({
          name: 'Testing role',
          permissions: 0,
          projectId: project.id,
        }),
      ).rejects.toThrowError(
        'It seems that the permissions you have entered are invalid. Make sure to enter only valid permissions for the type of role created.',
      );
    });
  });

  /**
   * Test Case: Invalid Role Update:
   * Validates the scenario where a role is attempted to be updated with an invalid permissions bit.
   * The system should detect this invalid input and respond with an appropriate error message.
   */
  it('should not update a role with invalid permissions bit', async () => {
    await RequestContext.createAsync(em, async () => {
      const role = await service.create({
        name: 'Testing role',
        permissions: ProjectPermissionsEnum.RoleCreate,
        projectId: project.id,
      });

      expect(role).toBeDefined();
      expect(role.name).toEqual('Testing role');

      expect(
        service.update({
          permissions: 0,
          projectId: project.id,
          roleId: role.id,
        }),
      ).rejects.toThrowError(
        'It seems that the permissions you have entered are invalid. Make sure to enter only valid permissions for the type of role updated.',
      );
    });
  });

  /**
   * Test Case: Deleting Non-existent Role:
   * Ensures that the system detects and rejects attempts to delete a role that does not exist.
   */
  it('should not delete a role that does not exist', async () => {
    await RequestContext.createAsync(em, async () => {
      expect(service.remove(project.id)).rejects.toThrowError(
        'Could not find role to delete.',
      );
    });
  });

  /**
   * Test Case: Assigning Role to Non-existent Member:
   * Tests the system's response when trying to assign a role to a member that does not exist.
   */
  it('should not assign a role to a member that does not exist', async () => {
    await RequestContext.createAsync(em, async () => {
      const role = await service.create({
        name: 'Testing role',
        permissions: ProjectPermissionsEnum.RoleCreate,
        projectId: project.id,
      });

      expect(role).toBeDefined();
      expect(role.name).toEqual('Testing role');

      expect(
        service.assign({
          memberId: '8054de11-b6dc-481e-a8c2-90cef8169914',
          projectId: project.id,
          roleId: role.id,
        }),
      ).rejects.toThrowError(
        'No information about the project member was found.',
      );
    });
  });

  /**
   * Test Case: Assigning Non-existent Role:
   * Validates the system's response when attempting to assign a role that doesn't exist to a member.
   */
  it('should not assign a role that does not exist', async () => {
    await RequestContext.createAsync(em, async () => {
      expect(
        service.assign({
          memberId: userMember.id,
          projectId: project.id,
          roleId: '8054de11-b6dc-481e-a8c2-90cef8169914',
        }),
      ).rejects.toThrowError(
        'No information was found about the project role to be assigned.',
      );
    });
  });

  /**
   * Test Case: Assign role to member that already has the role:
   * Ensures that the system correctly detects and rejects an attempt to assign a role to a member
   * who already has that role.
   */
  it('should not assign a role to a member that already has the role', async () => {
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
      expect(assignedRole.user.id).toBe(userMember.user.id);
      expect(assignedRole.project.id).toBe(project.id);

      const rolesAssigned = await assignedRole.roles.getItems();
      const roleAssigned = rolesAssigned.find((r) => r.id === role.id);

      expect(roleAssigned).toBeDefined();
      expect(roleAssigned.name).toEqual('Testing role');

      expect(
        service.assign({
          memberId: userMember.id,
          projectId: project.id,
          roleId: role.id,
        }),
      ).rejects.toThrowError(
        'The member you want to assign the role to already has it.',
      );
    });
  });

  /**
   * Test Case: Unassigning role to member that not has the role:
   * Ensures that the system correctly detects and rejects an attempt to assign a role to a member
   * who already has that role.
   */
  it('should not unassign a role to a member that not has the role', async () => {
    await RequestContext.createAsync(em, async () => {
      const role = await service.create({
        name: 'Testing role',
        permissions: ProjectPermissionsEnum.RoleCreate,
        projectId: project.id,
      });

      expect(role).toBeDefined();
      expect(role.name).toEqual('Testing role');

      expect(
        service.unassign({
          memberId: userMember.id,
          projectId: project.id,
          roleId: role.id,
        }),
      ).rejects.toThrowError(
        'The member does not have the role you are trying to remove.',
      );
    });
  });

  /**
   * Test Case: Invalid Role Unassignment:
   * Tests the system's behavior when attempting to unassign a role from a member who doesn't have it.
   */
  it('should not unassigned a role from a member that dont have the role', async () => {
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
      expect(assignedRole.user.id).toBe(userMember.user.id);
      expect(assignedRole.project.id).toBe(project.id);

      const rolesAssigned = await assignedRole.roles.getItems();
      const roleAssigned = rolesAssigned.find((r) => r.id === role.id);

      expect(roleAssigned).toBeDefined();
      expect(roleAssigned.name).toEqual('Testing role');

      expect(
        service.unassign({
          memberId: project.id,
          projectId: project.id,
          roleId: role.id,
        }),
      ).rejects.toThrowError(
        'No information about the project member was found.',
      );
    });
  });

  /**
   * Test Case: Unassigned Non-existent Role:
   * Ensures that the system rejects an attempt to unassign a role that doesn't exist from a member.
   */
  it('should not unassigned a role that does not exist', async () => {
    await RequestContext.createAsync(em, async () => {
      expect(
        service.unassign({
          memberId: userMember.id,
          projectId: project.id,
          roleId: '8054de11-b6dc-481e-a8c2-90cef8169914',
        }),
      ).rejects.toThrowError(
        'No information was found about the project role to be assigned.',
      );
    });
  });
});
