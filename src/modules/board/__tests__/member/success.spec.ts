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
  ProjectEntity,
  ProjectMembersEntity,
} from '~/database/entities';
import { AuthModule } from '~/modules/auth/auth.module';
import { AuthAccountService } from '~/modules/auth/services/account.service';
import { BoardService } from '~/modules/board/services/board.service';
import { BoardMemberService } from '~/modules/board/services/member.service';
import { ProjectService } from '~/modules/project/services/project.service';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { TestingMikroORMConfig } from '../../../../../mikro-orm.config';

/**
 * `Member successfully cases` Test Suite:
 * This test suite focuses on validating successful scenarios related to board members.
 * The primary goal is to ensure that the system correctly handles member-related operations and
 * gives the desired results under valid conditions.
 */
describe('Board - Member successfuly cases', () => {
  let module: TestingModule;
  let service: BoardMemberService;
  let boardService: BoardService;
  let accountService: AuthAccountService;
  let projectService: ProjectService;

  let orm: MikroORM;
  let em: EntityManager;

  let project: ProjectEntity;
  let board: BoardEntity;
  let user: AuthUserEntity;
  let user2: AuthUserEntity;

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
          ],
        }),
        AuthModule,
      ],
      providers: [
        BoardService,
        BoardService,
        BoardMemberService,
        ProjectService,
      ],
    }).compile();

    service = module.get<BoardMemberService>(BoardMemberService);
    accountService = module.get<AuthAccountService>(AuthAccountService);
    boardService = module.get<BoardService>(BoardService);
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

      board = await em.findOneOrFail(BoardEntity, { id: boardTest.id });
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
    expect(service).toBeDefined();
    expect(accountService).toBeDefined();
  });

  /**
   * Test Case: Adding a Member:
   * Validates that a userBoardOwner can be successfully added as a member to a board.
   * The system should acknowledge the addition and reflect it in the returned results.
   */
  it('should add a member to a board', async () => {
    await RequestContext.createAsync(orm.em, async () => {
      const member = await service.add({
        boardId: board.id,
        userId: user2.id,
      });

      expect(member.user.id).toBe(user2.id);
      expect(member.board.id).toEqual(board.id);
    });
  });

  /**
   * Test Case: Removing a Member:
   * Checks that a userBoardOwner, who is a member of a board, can be removed successfully.
   * The system should acknowledge the removal and provide a confirmation message.
   */
  it('should remove a member to a board', async () => {
    await RequestContext.createAsync(orm.em, async () => {
      const member = await service.add({
        boardId: board.id,
        userId: user2.id,
      });

      expect(member.user.id).toBe(user2.id);
      expect(member.board.id).toEqual(board.id);

      const result = await service.remove({
        boardId: board.id,
        userId: user2.id,
      });

      expect(result).toBe(
        'The user was successfully removed from the board members.',
      );
    });
  });
});
