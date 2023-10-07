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
 * `Member unsuccessfully cases` Test Suite:
 * This test suite is focused on scenarios where operations related to board members are expected to fail.
 * The purpose is to ensure that the system correctly handles and responds to incorrect or invalid operations.
 */
describe('Board - Member unsuccessfully cases', () => {
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
   * Ensure that the services required for these tests have been properly initialized.
   */
  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(accountService).toBeDefined();
  });

  /**
   * Test Case: Adding an Existing Member:
   * This test ensures that a user who is already a member of a board cannot be added again.
   * The system should recognize this and throw an appropriate error.
   */
  it('should not be able to add a user who is a member of the board', async () => {
    await RequestContext.createAsync(orm.em, async () => {
      expect(
        async () =>
          await service.add({
            boardId: board.id,
            userId: user.id,
          }),
      ).rejects.toThrowError('This user is already a member of the board.');
    });
  });

  /**
   * Test Case: Removing a Non-member:
   * This test checks the scenario where there's an attempt to remove a user who isn't a member of the board.
   * The system should recognize this situation and throw an appropriate error.
   */
  it('should not be able to remove a user who is not a member of the board', async () => {
    await RequestContext.createAsync(orm.em, async () => {
      expect(
        async () =>
          await service.remove({
            boardId: board.id,
            userId: user2.id,
          }),
      ).rejects.toThrowError('The user is not a member of the board.');
    });
  });

  /**
   * Test Case: Removing the Board member
   * This test checks the scenario where there's an attempt to remove a user who is the board owner.
   */
  it('should not be able to remove the board member because it does not exist', async () => {
    await RequestContext.createAsync(orm.em, async () => {
      expect(
        async () =>
          await service.remove({
            boardId: board.id,
            userId: '8ae7dfea-c95e-42cb-b7e7-82798e484d54',
          }),
      ).rejects.toThrowError('The user is not a member of the board.');
    });
  });
});
