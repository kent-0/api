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
 * `Role Management Successfully Cases` Test Suite:
 * This test suite focuses on validating successful scenarios related to board roles.
 * The primary goal is to ensure that the system correctly handles role-related operations and
 * gives the desired results under valid conditions.
 */
describe('Board - Role successfully cases', () => {
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
   * Test Case: Creating a Role:
   * This test case focuses on the scenario where a new role is created for a board.
   * It ensures that the system correctly creates the role and returns the appropriate details.
   */
  it('should be able to create a role', async () => {
    await RequestContext.createAsync(em, async () => {
      const role = await service.create({
        boardId: board.id,
        name: 'Testing role',
        permissions_denied: BoardPermissionsEnum.TaskView,
        permissions_granted: BoardPermissionsEnum.RoleCreate,
      });

      expect(role).toBeDefined();
      expect(role.name).toEqual('Testing role');
      expect(role.board.id).toEqual(board.id);
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
        boardId: board.id,
        name: 'Testing role',
        permissions_denied: BoardPermissionsEnum.TaskView,
        permissions_granted: BoardPermissionsEnum.RoleCreate,
      });

      const updatedRole = await service.update({
        boardId: board.id,
        name: 'Testing role updated',
        permissions_denied: BoardPermissionsEnum.TaskView,
        permissions_granted: BoardPermissionsEnum.RoleCreate,
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
        boardId: board.id,
        name: 'Testing role',
        permissions_denied: BoardPermissionsEnum.TaskView,
        permissions_granted: BoardPermissionsEnum.RoleCreate,
      });

      const deletedRole = await service.remove({
        boardId: board.id,
        roleId: role.id,
      });

      expect(deletedRole).toBe('The role for board has been removed.');
    });
  });

  /**
   * Test Case: Fetching Roles:
   * Validates that the system can fetch a list of roles associated with a board.
   * It ensures the list is accurate and paginated correctly.
   */
  it('should be able to get all roles', async () => {
    await RequestContext.createAsync(em, async () => {
      const role = await service.create({
        boardId: board.id,
        name: 'Testing role',
        permissions_denied: BoardPermissionsEnum.TaskView,
        permissions_granted: BoardPermissionsEnum.RoleCreate,
      });

      expect(role).toBeDefined();

      const roles = await service.paginate({
        boardId: board.id,
        page: 1,
        size: 10,
      });

      expect(roles).toBeDefined();
      expect(roles.totalItems).toEqual(1);
      expect(roles.hasNextPage).toBe(false);
      expect(roles.hasPreviousPage).toBe(false);
    });
  });

  /**
   * Test Case: Assigning a Role to a Member:
   * This test focuses on the scenario where a role is assigned to a member of a board.
   * The system should correctly associate the member with the role and reflect it in the returned results.
   */
  it('should be able to assign a role to board member', async () => {
    await RequestContext.createAsync(em, async () => {
      const role = await service.create({
        boardId: board.id,
        name: 'Testing role',
        permissions_denied: BoardPermissionsEnum.TaskView,
        permissions_granted: BoardPermissionsEnum.RoleCreate,
      });

      expect(role).toBeDefined();
      expect(role.name).toEqual('Testing role');

      const assignedRole = await service.assign({
        boardId: board.id,
        memberId: member.id,
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
  it('should be able to remove a role from board member', async () => {
    await RequestContext.createAsync(em, async () => {
      const role = await service.create({
        boardId: board.id,
        name: 'Testing role',
        permissions_denied: BoardPermissionsEnum.TaskView,
        permissions_granted: BoardPermissionsEnum.RoleCreate,
      });

      expect(role).toBeDefined();
      expect(role.name).toEqual('Testing role');

      const assignedRole = await service.assign({
        boardId: board.id,
        memberId: member.id,
        roleId: role.id,
      });

      expect(assignedRole).toBeDefined();

      const rolesAssigned = await assignedRole.roles.getItems();
      const roleAssigned = rolesAssigned.find((r) => r.id === role.id);

      expect(roleAssigned).toBeDefined();
      expect(roleAssigned.name).toEqual('Testing role');

      const removedRole = await service.unassign({
        boardId: board.id,
        memberId: member.id,
        roleId: role.id,
      });

      const rolesRemoved = await removedRole.roles.getItems();
      const isRoleRemoved = rolesRemoved.some((r) => r.id === role.id);

      expect(isRoleRemoved).toBe(false);
    });
  });
});
