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
  BoardStepEntity,
  BoardTagsEntity,
  BoardTaskEntity,
  ProjectEntity,
  ProjectMembersEntity,
} from '~/database/entities';
import { StepType } from '~/database/enums/step.enum';
import { AuthModule } from '~/modules/auth/auth.module';
import { AuthAccountService } from '~/modules/auth/services/account.service';
import { AuthEmailService } from '~/modules/auth/services/email.service';
import { AuthPasswordService } from '~/modules/auth/services/password.service';
import { BoardService } from '~/modules/board/services/board.service';
import { BoardStepService } from '~/modules/board/services/step.service';
import { BoardTagsService } from '~/modules/board/services/tags.service';
import { BoardTaskService } from '~/modules/board/services/task.service';
import { ProjectService } from '~/modules/project/services/project.service';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { TestingMikroORMConfig } from '../../../../../mikro-orm.config';

/**
 * Test suite for the successful operations of the `BoardTagsService`.
 */
describe('Tags - Successfully cases', async () => {
  let module: TestingModule;
  let service: BoardTagsService;
  let boardTaskService: BoardTaskService;
  let stepService: BoardStepService;
  let boardService: BoardService;
  let accountService: AuthAccountService;
  let projectService: ProjectService;

  let orm: MikroORM;
  let em: EntityManager;

  let project: ProjectEntity;
  let board: BoardEntity;
  let user: AuthUserEntity;
  let task: BoardTaskEntity;

  /**
   * Before each test, initialize the necessary entities and objects to be used in the subsequent test cases.
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
            AuthUserEntity,
            AuthPasswordEntity,
            AuthTokensEntity,
            AuthEmailsEntity,
            BoardTaskEntity,
            BoardStepEntity,
            BoardEntity,
            BoardMembersEntity,
            ProjectEntity,
            ProjectMembersEntity,
            BoardTagsEntity,
          ],
        }),
        AuthModule,
      ],
      providers: [
        AuthAccountService,
        BoardTaskService,
        ProjectService,
        BoardStepService,
        BoardService,
        AuthPasswordService,
        AuthEmailService,
        BoardTagsService,
      ],
    }).compile();

    service = module.get<BoardTagsService>(BoardTagsService);
    boardTaskService = module.get<BoardTaskService>(BoardTaskService);
    stepService = module.get<BoardStepService>(BoardStepService);
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

      user = await em.findOneOrFail(AuthUserEntity, { id: boardUser.id });

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

      await stepService.create({
        boardId: board.id,
        description: 'Step description',
        name: 'Step Start',
        type: StepType.START,
      });

      const taskTest = await boardTaskService.create(
        {
          boardId: board.id,
          description: 'Task description',
          name: 'Task Start',
        },
        user.id,
      );

      task = await em.findOneOrFail(BoardTaskEntity, { id: taskTest.id });
    });
  });

  /**
   * Cleanup after test are finished.
   */
  afterEach(async () => {
    await module.close();
  });

  /**
   * Test Case: Service Definition
   * Ensures that the service being tested is correctly instantiated.
   */
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  /**
   * Tests the scenario where a new tag is created.
   * Expected behavior: A new tag should be created and returned with the specified name.
   */
  it('should create a new tag', async () => {
    await RequestContext.createAsync(em, async () => {
      const tag = await service.create(
        {
          boardId: board.id,
          name: 'Tag 1',
        },
        user.id,
      );

      expect(tag).toBeDefined();
      expect(tag.id).toBeDefined();
      expect(tag.name).toBe('Tag 1');
    });
  });

  /**
   * Tests the scenario where a tag is deleted.
   * Expected behavior: The tag should be deleted and a confirmation message should be returned.
   */
  it('should delete a tag', async () => {
    await RequestContext.createAsync(em, async () => {
      const tag = await service.create(
        {
          boardId: board.id,
          name: 'Tag 1',
        },
        user.id,
      );

      const deletedTag = await service.delete({
        boardId: board.id,
        tagId: tag.id,
      });

      expect(deletedTag).toBeDefined();
      expect(deletedTag).toBe('Tag deleted successfully.');
    });
  });

  /**
   * Tests the scenario where an existing tag is updated.
   * Expected behavior: The tag should be updated and returned with the updated name.
   */
  it('should update a tag', async () => {
    await RequestContext.createAsync(em, async () => {
      const tag = await service.create(
        {
          boardId: board.id,
          name: 'Tag 1',
        },
        user.id,
      );

      const updatedTag = await service.update({
        boardId: board.id,
        name: 'Tag 2',
        tagId: tag.id,
      });

      expect(updatedTag).toBeDefined();
      expect(updatedTag.name).toBe('Tag 2');
    });
  });

  /**
   * Tests the scenario where a tag is added to a task.
   * Expected behavior: The tag should be added to the specified task and returned.
   */
  it('should add a tag to a task', async () => {
    await RequestContext.createAsync(em, async () => {
      const tag = await service.create(
        {
          boardId: board.id,
          name: 'Tag 1',
        },
        user.id,
      );

      const updatedTag = await service.addToTask({
        boardId: board.id,
        tagId: tag.id,
        taskId: task.id,
      });

      expect(updatedTag).toBeDefined();
      expect(updatedTag.tasks).toBeDefined();
      expect(updatedTag.tasks.length).toBe(1);
    });
  });

  /**
   * Tests the scenario where a tag is removed from a task.
   * Expected behavior: The tag should be removed from the specified task and returned.
   */
  it('should remove a tag from a task', async () => {
    await RequestContext.createAsync(em, async () => {
      const tag = await service.create(
        {
          boardId: board.id,
          name: 'Tag 1',
        },
        user.id,
      );

      const updatedTag = await service.addToTask({
        boardId: board.id,
        tagId: tag.id,
        taskId: task.id,
      });

      expect(updatedTag).toBeDefined();
      expect(updatedTag.tasks).toBeDefined();
      expect(updatedTag.tasks.length).toBe(1);

      const removedTag = await service.removeFromTask({
        boardId: board.id,
        tagId: tag.id,
        taskId: task.id,
      });

      expect(removedTag).toBeDefined();
      expect(removedTag.tasks).toBeDefined();
      expect(removedTag.tasks.length).toBe(0);
    });
  });
});
