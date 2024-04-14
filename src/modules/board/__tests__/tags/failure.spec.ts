import { MikroORM, RequestContext } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';

import { ConfigModule } from '@nestjs/config';
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
 * Test suite for the unsuccessful cases of the `BoardTagsService` operations.
 */
describe('Tags - Unsuccessfully cases', async () => {
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
        ConfigModule.forRoot({ envFilePath: '.env.test' }),
        MikroOrmModule.forRoot(TestingMikroORMConfig()),
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

    await RequestContext.create(em, async () => {
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
   * Tests the scenario when trying to add a non-existent tag to a task.
   * Expected behavior: It should throw an error indicating that the tag does not exist.
   */
  it('should not add a tag to a task if no exist', async () => {
    await RequestContext.create(em, async () => {
      await expect(
        service.addToTask({
          boardId: board.id,
          tagId: 'f903e4b6-0bb8-44e2-8652-a31c14351829',
          taskId: task.id,
        }),
      ).rejects.toThrowError(
        'The tag that you are trying to add to a task does not exist.',
      );
    });
  });

  /**
   * Tests the scenario when trying to add a non-existent tag to a task.
   * This test is similar to the previous one, and probably one of them should be removed.
   */
  it('should not add a tag to a task if the tag not exist', async () => {
    await RequestContext.create(em, async () => {
      await expect(
        service.addToTask({
          boardId: board.id,
          tagId: 'f903e4b6-0bb8-44e2-8652-a31c14351829',
          taskId: task.id,
        }),
      ).rejects.toThrowError(
        'The tag that you are trying to add to a task does not exist',
      );
    });
  });

  /**
   * Tests the scenario when trying to delete a non-existent tag.
   * Expected behavior: It should throw an error indicating that the tag does not exist.
   */
  it('should not delete a tag if no exist', async () => {
    await RequestContext.create(em, async () => {
      await expect(
        service.delete({
          boardId: board.id,
          tagId: 'f903e4b6-0bb8-44e2-8652-a31c14351829',
        }),
      ).rejects.toThrowError(
        'The tag that you are trying to delete does not exist.',
      );
    });
  });

  /**
   * Tests the scenario when trying to remove a non-existent tag from a task.
   * Expected behavior: It should throw an error indicating that the tag does not exist.
   */
  it('should not remove a tag to a task if no exist', async () => {
    await RequestContext.create(em, async () => {
      await expect(
        service.removeFromTask({
          boardId: board.id,
          tagId: 'f903e4b6-0bb8-44e2-8652-a31c14351829',
          taskId: task.id,
        }),
      ).rejects.toThrowError(
        'The tag that you are trying to remove from a task does not exist.',
      );
    });
  });

  /**
   * Tests the scenario when trying to remove a non-existent tag from a task.
   * This test is similar to the previous one, and probably one of them should be removed.
   */
  it('should not remove a tag to a task if the tag not exist', async () => {
    await RequestContext.create(em, async () => {
      await expect(
        service.removeFromTask({
          boardId: board.id,
          tagId: 'f903e4b6-0bb8-44e2-8652-a31c14351829',
          taskId: task.id,
        }),
      ).rejects.toThrowError(
        'The tag that you are trying to remove from a task does not exist.',
      );
    });
  });

  /**
   * Tests the scenario when trying to update a non-existent tag.
   * Expected behavior: It should throw an error indicating that the tag does not exist.
   */
  it('should not update a tag if no exist', async () => {
    await RequestContext.create(em, async () => {
      await expect(
        service.update({
          boardId: board.id,
          tagId: 'f903e4b6-0bb8-44e2-8652-a31c14351829',
        }),
      ).rejects.toThrowError(
        'The tag that you are trying to update does not exist.',
      );
    });
  });

  /**
   * Tests the scenario when trying to add a non-existent tag to a task.
   * Expected behavior: It should throw an error indicating that the task does not exist.
   */
  it('should not add a tag to a task that not exist', async () => {
    await RequestContext.create(em, async () => {
      await expect(async () =>
        service.addToTask({
          boardId: board.id,
          tagId: 'f903e4b6-0bb8-44e2-8652-a31c14351829',
          taskId: 'f903e4b6-0bb8-44e2-8652-a31c14351829',
        }),
      ).rejects.toThrowError(
        'The task that you are trying to add a tag to does not exist.',
      );
    });
  });

  /**
   * Tests the scenario when trying to remove a non-existent tag from a task.
   * Expected behavior: It should throw an error indicating that the task does not exist.
   */
  it('should not remove a tag to a task that not exist', async () => {
    await RequestContext.create(em, async () => {
      await expect(async () =>
        service.removeFromTask({
          boardId: board.id,
          tagId: 'f903e4b6-0bb8-44e2-8652-a31c14351829',
          taskId: 'f903e4b6-0bb8-44e2-8652-a31c14351829',
        }),
      ).rejects.toThrowError(
        'The tag that you are trying to remove from a task does not exist.',
      );
    });
  });
});
