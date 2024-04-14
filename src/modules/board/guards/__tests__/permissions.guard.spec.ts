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
  BoardEntity,
  BoardMembersEntity,
  BoardRolesEntity,
  ProjectEntity,
  ProjectMembersEntity,
} from '~/database/entities';
import { AuthModule } from '~/modules/auth/auth.module';
import { AuthAccountService } from '~/modules/auth/services/account.service';
import { BoardPermissionsGuard } from '~/modules/board/guards/permissions.guard';
import { BoardService } from '~/modules/board/services/board.service';
import { BoardMemberService } from '~/modules/board/services/member.service';
import { BoardRoleService } from '~/modules/board/services/role.service';
import { ProjectService } from '~/modules/project/services/project.service';
import { BoardPermissionsEnum } from '~/permissions/enums/board.enum';
import { PermissionManagerService } from '~/permissions/services/manager.service';

import { afterEach, beforeEach, describe, expect, it, vitest } from 'vitest';

import { TestingMikroORMConfig } from '../../../../../mikro-orm.config';

/**
 * Test suite for the Board Permissions Guard.
 * This suite tests the functionality of the permissions guard for various scenarios.
 */
describe('Board - Guard - Permissions', () => {
  let module: TestingModule;

  let boardMemberService: BoardMemberService;
  let accountService: AuthAccountService;
  let boardService: BoardService;
  let boardRolesService: BoardRoleService;
  let projectService: ProjectService;

  let board: BoardEntity;
  let userBoardOwner: AuthUserEntity;
  let userMember: AuthUserEntity;
  let boardMember: BoardMembersEntity;

  let em: EntityManager;
  let orm: MikroORM;
  let guard: BoardPermissionsGuard;
  let mockExecutionContext: ExecutionContext;

  const mockReflector = {
    get: vitest.fn().mockReturnValue([BoardPermissionsEnum.TaskAssign]),
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
            BoardMembersEntity,
            AuthUserEntity,
            AuthPasswordEntity,
            AuthTokensEntity,
            AuthEmailsEntity,
            BoardEntity,
            BoardRolesEntity,
            ProjectEntity,
            ProjectMembersEntity,
          ],
        }),
        AuthModule,
      ],
      providers: [
        BoardMemberService,
        BoardService,
        BoardPermissionsGuard,
        PermissionManagerService,
        BoardRoleService,
        ProjectService,
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
    boardService = module.get<BoardService>(BoardService);
    guard = module.get<BoardPermissionsGuard>(BoardPermissionsGuard);
    boardRolesService = module.get<BoardRoleService>(BoardRoleService);
    boardMemberService = module.get<BoardMemberService>(BoardMemberService);
    projectService = module.get<ProjectService>(ProjectService);

    await orm.getSchemaGenerator().refreshDatabase();

    await RequestContext.create(em, async () => {
      const userTest = await accountService.signUp({
        email: 'sawa@acme.com',
        first_name: 'Sawa',
        last_name: 'Ko',
        password: 'sawako',
        username: 'sawako',
      });

      userBoardOwner = await em.findOneOrFail(AuthUserEntity, {
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
      const project = await projectService.create(
        {
          description: 'Kento testing project',
          name: 'Kento',
        },
        userBoardOwner.id,
      );

      const boardTest = await boardService.create(
        {
          description: 'Kento testing board',
          name: 'Kento',
          // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
          projectId: project?.id!,
        },
        userBoardOwner.id,
      );

      board = await em.findOneOrFail(BoardEntity, { id: boardTest.id });

      boardMember = await boardMemberService.add({
        boardId: board.id,
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
            boardId: board.id,
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
   * Test case to ensure that only board owners can execute actions if no roles are set for the board.
   */
  it('should allow only the board owner to execute actions because the board does not have roles', async () => {
    await RequestContext.create(em, async () => {
      await expect(
        guard.canActivate(mockExecutionContext),
      ).rejects.toThrowError(
        'Only the board owner can perform actions because there are no member roles available.',
      );
    });
  });

  /**
   * Test case to ensure the guard denies access if the boardId argument is missing.
   */
  it('should denied because the boardId arg is not found', async () => {
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
      await expect(guard.canActivate(mockExecutionContext)).resolves.toBe(
        false,
      );
    });
  });

  /**
   * Test case to ensure the guard denies access if the provided board ID does not exist.
   */
  it('should denied because the board is not found', async () => {
    mockExecutionContext.getArgs = vitest.fn().mockReturnValue([
      {},
      {
        boardId: '4d9f7b05-213b-45d1-b66f-665b0b0fddd7',
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
      ).rejects.toThrowError('The board does not exist.');
    });
  });

  /**
   * Test case to ensure the guard allows access if the user is the owner of the board.
   */
  it('should pass because the user is the current board owner', async () => {
    mockExecutionContext.getArgs = vitest.fn().mockReturnValue([
      {},
      {
        boardId: board.id,
      },
      {
        req: {
          user: {
            sub: userBoardOwner.id,
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
   * Test case to ensure the guard denies access if the user is not a member or owner of the board.
   */
  it('should be denied because the member is not a board member', async () => {
    mockExecutionContext.getArgs = vitest.fn().mockReturnValue([
      {},
      {
        boardId: board.id,
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
        'You are not a member or owner of the board to view it.',
      );
    });
  });

  /**
   * Test case to ensure the guard denies access if the user does not have the required role permissions.
   */
  it('should be denied because the user does not have the necessary role permissions.', async () => {
    await RequestContext.create(em, async () => {
      const role = await boardRolesService.create({
        boardId: board.id,
        name: 'Manager',
        permissions_denied: BoardPermissionsEnum.RoleCreate,
        permissions_granted: BoardPermissionsEnum.RoleUpdate,
      });

      expect(role).toBeDefined();
      expect(role.id).toBeDefined();

      const assignRole = await boardRolesService.assign({
        boardId: board.id,
        memberId: boardMember.id,
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
      const role = await boardRolesService.create({
        boardId: board.id,
        name: 'Manager',
        permissions_denied: BoardPermissionsEnum.RoleCreate,
        permissions_granted: BoardPermissionsEnum.TaskAssign,
      });

      expect(role).toBeDefined();
      expect(role.id).toBeDefined();

      const assignRole = await boardRolesService.assign({
        boardId: board.id,
        memberId: boardMember.id,
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
      mockReflector.get.mockReturnValue([BoardPermissionsGuard]);

      await expect(guard.canActivate(mockExecutionContext)).resolves.toBe(true);
    });
  });
});
