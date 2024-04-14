import { MikroORM, RequestContext } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';

import { ExecutionContext } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
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
import { ProjectPermissionsGuard } from '~/modules/project/guards/permissions.guard';
import { ProjectMemberService } from '~/modules/project/services/member.service';
import { ProjectService } from '~/modules/project/services/project.service';
import { ProjectRoleService } from '~/modules/project/services/role.service';
import { ProjectPermissionsEnum } from '~/permissions/enums/project.enum';
import { PermissionManagerService } from '~/permissions/services/manager.service';

import { afterEach, beforeEach, describe, expect, it, vitest } from 'vitest';

import { TestingMikroORMConfig } from '../../../../../mikro-orm.config';

/**
 * Test suite for the Project Permissions Guard.
 * This suite tests the functionality of the permissions guard for various scenarios.
 */
describe('Project - Guard - Permissions', () => {
  let module: TestingModule;

  let projectMemberService: ProjectMemberService;
  let accountService: AuthAccountService;
  let projectService: ProjectService;
  let projectRolesService: ProjectRoleService;

  let project: ProjectEntity;
  let userProjectOwner: AuthUserEntity;
  let userMember: AuthUserEntity;
  let projectMember: ProjectMembersEntity;

  let em: EntityManager;
  let orm: MikroORM;
  let guard: ProjectPermissionsGuard;
  let mockExecutionContext: ExecutionContext;

  const mockReflector = {
    get: vitest.fn().mockReturnValue([ProjectPermissionsEnum.GoalCreate]),
  };

  /**
   * Before each test case, initialize the services, modules, and entities.
   * This ensures a fresh state for each test.
   */
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath: '.env.test' }),
        MikroOrmModule.forRoot(TestingMikroORMConfig()),
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
      providers: [
        ProjectMemberService,
        ProjectService,
        ProjectPermissionsGuard,
        PermissionManagerService,
        ProjectRoleService,
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    }).compile();

    // After the module is compiled, retrieve and initialize the required services and modules.
    orm = module.get<MikroORM>(MikroORM);
    em = module.get<EntityManager>(EntityManager);
    accountService = module.get<AuthAccountService>(AuthAccountService);
    projectService = module.get<ProjectService>(ProjectService);
    guard = module.get<ProjectPermissionsGuard>(ProjectPermissionsGuard);
    projectRolesService = module.get<ProjectRoleService>(ProjectRoleService);
    projectMemberService =
      module.get<ProjectMemberService>(ProjectMemberService);

    await orm.getSchemaGenerator().refreshDatabase();

    await RequestContext.create(em, async () => {
      const userTest = await accountService.signUp({
        email: 'sawa@acme.com',
        first_name: 'Sawa',
        last_name: 'Ko',
        password: 'sawako',
        username: 'sawako',
      });

      userProjectOwner = await em.findOneOrFail(AuthUserEntity, {
        id: userTest.id,
      });

      const userTest2 = await accountService.signUp({
        email: 'sawa2@acme.com',
        first_name: 'Sawa',
        last_name: 'Ko',
        password: 'sawako',
        username: 'sawako2',
      });

      userMember = await em.findOneOrFail(AuthUserEntity, { id: userTest2.id });
    });

    await RequestContext.create(em, async () => {
      const projectTest = await projectService.create(
        {
          description: 'Kento testing project',
          name: 'Kento',
        },
        userProjectOwner.id,
      );

      project = await em.findOneOrFail(ProjectEntity, { id: projectTest.id });

      projectMember = await projectMemberService.add({
        projectId: project.id,
        userId: userMember.id,
      });

      const mockRequest = {
        user: {
          sub: userMember.id,
        },
      };

      mockExecutionContext = {
        getArgByIndex: vitest.fn().mockReturnValue({}),
        getArgs: vitest.fn().mockReturnValue([
          {},
          {
            projectId: project.id,
          },
          {
            req: mockRequest,
          },
          {},
          {},
        ]),
        getClass: vitest.fn().mockReturnValue('Test'),
        getHandler: vitest.fn().mockReturnValue('query'),
        getType: vitest.fn().mockReturnValue('graphql'),
        switchToHttp: vitest.fn().mockReturnThis(),
        switchToRpc: vitest.fn().mockReturnThis(),
        switchToWs: vitest.fn().mockReturnThis(),
      };
    });
  });

  /**
   * Cleanup after test are finished.
   */
  afterEach(async () => {
    await module.close();
  });

  /**
   * Sanity Check:
   * This test ensures that the required services are properly initialized and are available for testing.
   */
  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  /**
   * Test case to ensure that only project owners can execute actions if no roles are set for the project.
   */
  it('should allow only the project owner to execute actions because the project does not have roles', async () => {
    await RequestContext.create(em, async () => {
      await expect(
        guard.canActivate(mockExecutionContext),
      ).rejects.toThrowError(
        'Only the project owner can perform actions because there are no member roles available.',
      );
    });
  });

  /**
   * Test case to ensure the guard denies access if the projectId argument is missing.
   */
  it('should denied because the projectId arg is not found', async () => {
    mockExecutionContext.getArgs = vitest.fn().mockReturnValue([
      {},
      {},
      {
        req: {
          user: {
            sub: userMember.id,
          },
        },
      },
      {},
      {},
    ]);

    await RequestContext.create(em, async () => {
      expect(guard.canActivate(mockExecutionContext)).resolves.toBe(false);
    });
  });

  /**
   * Test case to ensure the guard denies access if the provided project ID does not exist.
   */
  it('should denied because the project is not found', async () => {
    mockExecutionContext.getArgs = vitest.fn().mockReturnValue([
      {},
      {
        projectId: '4d9f7b05-213b-45d1-b66f-665b0b0fddd7',
      },
      {
        req: {
          user: {
            sub: userMember.id,
          },
        },
      },
      {},
      {},
    ]);

    await RequestContext.create(em, async () => {
      await expect(
        guard.canActivate(mockExecutionContext),
      ).rejects.toThrowError('The project does not exist.');
    });
  });

  /**
   * Test case to ensure the guard allows access if the user is the owner of the project.
   */
  it('should pass because the user is the current project owner', async () => {
    mockExecutionContext.getArgs = vitest.fn().mockReturnValue([
      {},
      {
        projectId: project.id,
      },
      {
        req: {
          user: {
            sub: userProjectOwner.id,
          },
        },
      },
      {},
      {},
    ]);

    await RequestContext.create(em, async () => {
      await expect(guard.canActivate(mockExecutionContext)).resolves.toBe(true);
    });
  });

  /**
   * Test case to ensure the guard denies access if the user is not a member or owner of the project.
   */
  it('should be denied because the member is not a project member', async () => {
    mockExecutionContext.getArgs = vitest.fn().mockReturnValue([
      {},
      {
        projectId: project.id,
      },
      {
        req: {
          user: {
            sub: '4d9f7b05-213b-45d1-b66f-665b0b0fddd7',
          },
        },
      },
      {},
      {},
    ]);

    await RequestContext.create(em, async () => {
      await expect(
        guard.canActivate(mockExecutionContext),
      ).rejects.toThrowError(
        'You are not a member or owner of the project to view it.',
      );
    });
  });

  /**
   * Test case to ensure the guard denies access if the user does not have the required role permissions.
   */
  it('should be denied because the user does not have the necessary role permissions.', async () => {
    await RequestContext.create(em, async () => {
      const role = await projectRolesService.create({
        name: 'Manager',
        permissions_denied: ProjectPermissionsEnum.RoleCreate,
        permissions_granted: ProjectPermissionsEnum.RoleUpdate,
        projectId: project.id,
      });

      expect(role).toBeDefined();
      expect(role.id).toBeDefined();

      const assignRole = await projectRolesService.assign({
        memberId: projectMember.id,
        projectId: project.id,
        roleId: role.id,
      });

      expect(assignRole).toBeDefined();
      expect(assignRole.id).toBeDefined();

      await expect(guard.canActivate(mockExecutionContext)).resolves.toBe(
        false,
      );
    });
  });

  /**
   * Test case to ensure the guard allows access if the user has the required role permissions.
   */
  it('should be pass because the user have the necessary role permissions.', async () => {
    await RequestContext.create(em, async () => {
      const role = await projectRolesService.create({
        name: 'Manager',
        permissions_denied: ProjectPermissionsEnum.RoleCreate,
        permissions_granted: ProjectPermissionsEnum.GoalCreate,
        projectId: project.id,
      });

      expect(role).toBeDefined();
      expect(role.id).toBeDefined();

      const assignRole = await projectRolesService.assign({
        memberId: projectMember.id,
        projectId: project.id,
        roleId: role.id,
      });

      expect(assignRole).toBeDefined();
      expect(assignRole.id).toBeDefined();

      await expect(guard.canActivate(mockExecutionContext)).resolves.toBe(true);
    });
  });

  /**
   * Test case to ensure the guard allows access if the user has the required role permissions.
   */
  it('should pass because the ExcludeGuards is passed', async () => {
    await RequestContext.create(em, async () => {
      mockReflector.get.mockReturnValue([ProjectPermissionsGuard]);

      await expect(guard.canActivate(mockExecutionContext)).resolves.toBe(true);
    });
  });
});
