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

/**
 * `Role Management Successfully Cases` Test Suite:
 * This test suite focuses on validating successful scenarios related to project roles.
 * The primary goal is to ensure that the system correctly handles role-related operations and
 * gives the desired results under valid conditions.
 */
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

  /**
   * Before All Setup:
   * This hook is executed before all the test cases in the suite. Its primary responsibilities include:
   * 1. Compiling and initializing the testing module.
   * 2. Instantiating services for testing.
   * 3. Setting up a clean database state and generating test data.
   */
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

  /**
   * After All Cleanup:
   * This hook is executed after all the test cases. It ensures that resources are cleaned up and
   * connections are closed to avoid any memory leaks or open connections.
   */
  afterAll(async () => {
    await orm.close();
    await module.close();
  });

  /**
   * Test Case: Creating a Role:
   * This test case focuses on the scenario where a new role is created for a project.
   * It ensures that the system correctly creates the role and returns the appropriate details.
   */
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

  /**
   * Test Case: Updating a Role:
   * Validates the scenario where an existing role's attributes are updated.
   * It ensures that the updated attributes are correctly reflected in the system.
   */
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

  /**
   * Test Case: Deleting a Role:
   * This test case ensures that a role can be successfully deleted from the system
   * and that it no longer exists after the deletion process.
   */
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

  /**
   * Test Case: Fetching Roles:
   * Validates that the system can fetch a list of roles associated with a project.
   * It ensures the list is accurate and paginated correctly.
   */
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

  /**
   * Test Case: Assigning a Role to a Member:
   * This test focuses on the scenario where a role is assigned to a member of a project.
   * The system should correctly associate the member with the role and reflect it in the returned results.
   */
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

  /**
   * Test Case: Removing a Role from a Member:
   * Validates the scenario where a role is unassigned or removed from a member.
   * The system should correctly dissociate the role from the member and ensure the member no longer holds that role.
   */
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

/**
 * `Role Management Unsuccessful Cases` Test Suite:
 * This test suite focuses on validating the unsuccessful scenarios related to project roles.
 * The primary goal is to ensure that the system correctly handles invalid operations or data related
 * to roles and provides appropriate error messages or responses.
 */
describe('Role management unsuccessfully cases', async () => {
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
   * Before All Setup:
   * This hook is executed before all the test cases in the suite. Its primary responsibilities include:
   * 1. Compiling and initializing the testing module.
   * 2. Instantiating services for testing.
   * 3. Setting up a clean database state and generating test data.
   */
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

  /**
   * After All Cleanup:
   * This hook is executed after all the test cases. It ensures that resources are cleaned up and
   */
  afterAll(async () => {
    await orm.close();
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
   * Test Case: Redundant Role Assignment:
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
   * Test Case: Unassigning Non-existent Role:
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
