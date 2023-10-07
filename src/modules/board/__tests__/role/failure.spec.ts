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
  BoardEntity,
  BoardMembersEntity,
  BoardRolesEntity,
  ProjectEntity,
  ProjectMembersEntity,
} from '~/database/entities';
import { AuthModule } from '~/modules/auth/auth.module';
import { AuthAccountService } from '~/modules/auth/services/account.service';
import { BoardService } from '~/modules/board/services/board.service';
import { BoardMemberService } from '~/modules/board/services/member.service';
import { BoardRoleService } from '~/modules/board/services/role.service';
import { ProjectService } from '~/modules/project/services/project.service';
import { BoardPermissionsEnum } from '~/permissions/enums/board.enum';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { TestingMikroORMConfig } from '../../../../../mikro-orm.config';

/**
 * `Role Management Unsuccessful Cases` Test Suite:
 * This test suite focuses on validating the unsuccessful scenarios related to board roles.
 * The primary goal is to ensure that the system correctly handles invalid operations or data related
 * to roles and provides appropriate error messages or responses.
 */
describe('Board - Role unsuccessfully cases', async () => {
  let module: TestingModule;
  let service: BoardRoleService;
  let boardService: BoardService;
  let boardMemberService: BoardMemberService;
  let accountService: AuthAccountService;
  let projectService: ProjectService;

  let orm: MikroORM;
  let em: EntityManager;

  let project: ProjectEntity;
  let board: BoardEntity;
  let user: AuthUserEntity;
  let user2: AuthUserEntity;
  let member: BoardMembersEntity;

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
            BoardEntity,
            BoardMembersEntity,
            BoardEntity,
            AuthUserEntity,
            AuthPasswordEntity,
            AuthTokensEntity,
            AuthEmailsEntity,
            ProjectEntity,
            ProjectMembersEntity,
            BoardRolesEntity,
          ],
        }),
        AuthModule,
      ],
      providers: [
        BoardService,
        BoardService,
        BoardRoleService,
        ProjectService,
        BoardMemberService,
      ],
    }).compile();

    service = module.get<BoardRoleService>(BoardRoleService);
    accountService = module.get<AuthAccountService>(AuthAccountService);
    boardService = module.get<BoardService>(BoardService);
    boardMemberService = module.get<BoardMemberService>(BoardMemberService);
    projectService = module.get<ProjectService>(ProjectService);

    orm = module.get<MikroORM>(MikroORM);
    em = module.get<EntityManager>(EntityManager);

    await orm.getSchemaGenerator().refreshDatabase();

    await RequestContext.createAsync(em, async () => {
      const boardUser = await accountService.signUp({
        email: 'sawa@acme.com',
        first_name: 'Sawa',
        last_name: 'Ko',
        password: 'sawako',
        username: 'sawako',
      });

      const boardUser2 = await accountService.signUp({
        email: 'sawa2@acme.com',
        first_name: 'Sawa',
        last_name: 'Ko',
        password: 'sawako',
        username: 'sawako2',
      });

      user = await em.findOneOrFail(AuthUserEntity, { id: boardUser.id });
      user2 = await em.findOneOrFail(AuthUserEntity, { id: boardUser2.id });

      const projectTest = await projectService.create(
        {
          description: 'Kento testing project',
          name: 'Kento',
        },
        user.id,
      );

      project = await em.findOneOrFail(ProjectEntity, { id: projectTest.id });

      const boardTest = await boardService.create(
        {
          description: 'Kento testing board',
          name: 'Kento',
          projectId: project.id,
        },
        boardUser.id,
      );

      const boardMember = await boardMemberService.add({
        boardId: boardTest.id,
        userId: user2.id,
      });

      board = await em.findOneOrFail(BoardEntity, { id: boardTest.id });
      member = await em.findOneOrFail(BoardMembersEntity, {
        id: boardMember.id,
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
          boardId: board.id,
          name: 'Testing role',
          permissions: 0,
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
        boardId: board.id,
        name: 'Testing role',
        permissions: BoardPermissionsEnum.RoleCreate,
      });

      expect(role).toBeDefined();
      expect(role.name).toEqual('Testing role');

      expect(
        service.update({
          boardId: board.id,
          permissions: 0,
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
      expect(
        service.remove({
          boardId: board.id,
          roleId: '8054de11-b6dc-481e-a8c2-90cef8169914',
        }),
      ).rejects.toThrowError('Could not find role to delete.');
    });
  });

  /**
   * Test Case: Assigning Role to Non-existent Member:
   * Tests the system's response when trying to assign a role to a member that does not exist.
   */
  it('should not assign a role to a member that does not exist', async () => {
    await RequestContext.createAsync(em, async () => {
      const role = await service.create({
        boardId: board.id,
        name: 'Testing role',
        permissions: BoardPermissionsEnum.RoleCreate,
      });

      expect(role).toBeDefined();
      expect(role.name).toEqual('Testing role');

      expect(
        service.assign({
          boardId: board.id,
          memberId: '8054de11-b6dc-481e-a8c2-90cef8169914',
          roleId: role.id,
        }),
      ).rejects.toThrowError(
        'No information about the board member was found.',
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
          boardId: board.id,
          memberId: member.id,
          roleId: '8054de11-b6dc-481e-a8c2-90cef8169914',
        }),
      ).rejects.toThrowError(
        'No information was found about the board role to be assigned.',
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
        boardId: board.id,
        name: 'Testing role',
        permissions: BoardPermissionsEnum.RoleCreate,
      });

      expect(role).toBeDefined();
      expect(role.name).toEqual('Testing role');

      const assignedRole = await service.assign({
        boardId: board.id,
        memberId: member.id,
        roleId: role.id,
      });

      expect(assignedRole).toBeDefined();
      expect(assignedRole.user.id).toBe(member.user.id);
      expect(assignedRole.board.id).toBe(board.id);

      const rolesAssigned = await assignedRole.roles.getItems();
      const roleAssigned = rolesAssigned.find((r) => r.id === role.id);

      expect(roleAssigned).toBeDefined();
      expect(roleAssigned.name).toEqual('Testing role');

      expect(
        service.assign({
          boardId: board.id,
          memberId: member.id,
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
        boardId: board.id,
        name: 'Testing role',
        permissions: BoardPermissionsEnum.RoleCreate,
      });

      expect(role).toBeDefined();
      expect(role.name).toEqual('Testing role');

      expect(
        service.unassign({
          boardId: board.id,
          memberId: member.id,
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
        boardId: board.id,
        name: 'Testing role',
        permissions: BoardPermissionsEnum.RoleCreate,
      });

      expect(role).toBeDefined();
      expect(role.name).toEqual('Testing role');

      const assignedRole = await service.assign({
        boardId: board.id,
        memberId: member.id,
        roleId: role.id,
      });

      expect(assignedRole).toBeDefined();
      expect(assignedRole.user.id).toBe(member.user.id);
      expect(assignedRole.board.id).toBe(board.id);

      const rolesAssigned = await assignedRole.roles.getItems();
      const roleAssigned = rolesAssigned.find((r) => r.id === role.id);

      expect(roleAssigned).toBeDefined();
      expect(roleAssigned.name).toEqual('Testing role');

      expect(
        service.unassign({
          boardId: board.id,
          memberId: board.id,
          roleId: role.id,
        }),
      ).rejects.toThrowError(
        'No information about the board member was found.',
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
          boardId: board.id,
          memberId: member.id,
          roleId: '8054de11-b6dc-481e-a8c2-90cef8169914',
        }),
      ).rejects.toThrowError(
        'No information was found about the board role to be assigned.',
      );
    });
  });
});
