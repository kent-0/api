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
  BoardTaskCommentEntity,
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
import { BoardTaskService } from '~/modules/board/services/task.service';
import { BoardTaskCommentService } from '~/modules/board/services/task-comment.service';
import { ProjectService } from '~/modules/project/services/project.service';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { TestingMikroORMConfig } from '../../../../../mikro-orm.config';

describe('Task / Comments - Unsuccessfully cases', async () => {
  let module: TestingModule;
  let service: BoardTaskCommentService;
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
            BoardTaskCommentEntity,
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
        BoardTaskCommentService,
      ],
    }).compile();

    service = module.get<BoardTaskCommentService>(BoardTaskCommentService);
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

  it('should not create a comment if the task not exist', async () => {
    await RequestContext.createAsync(em, async () => {
      await expect(
        service.create(
          {
            boardId: board.id,
            content: 'Comment content',
            taskId: 'f903e4b6-0bb8-44e2-8652-a31c14351829',
          },
          user.id,
        ),
      ).rejects.toThrowError('The task to add the comment to was not found.');
    });
  });

  it('should not delete a comment if the task not exist', async () => {
    await RequestContext.createAsync(em, async () => {
      await expect(
        service.delete(
          {
            boardId: board.id,
            commentId: 'f903e4b6-0bb8-44e2-8652-a31c14351829',
            taskId: 'f903e4b6-0bb8-44e2-8652-a31c14351829',
          },
          user.id,
        ),
      ).rejects.toThrowError(
        'The task to delete the comment to was not found.',
      );
    });
  });

  it('should not update a comment if the task not exist', async () => {
    await RequestContext.createAsync(em, async () => {
      expect(
        service.update(
          {
            boardId: board.id,
            commentId: 'f903e4b6-0bb8-44e2-8652-a31c14351829',
            content: 'Comment content',
            taskId: 'f903e4b6-0bb8-44e2-8652-a31c14351829',
          },
          user.id,
        ),
      ).rejects.toThrowError('The task to add the comment to was not found.');
    });
  });

  it('should not update a comment if the comment not exist', async () => {
    await RequestContext.createAsync(em, async () => {
      expect(
        service.update(
          {
            boardId: board.id,
            commentId: 'f903e4b6-0bb8-44e2-8652-a31c14351829',
            content: 'Comment content',
            taskId: task.id,
          },
          user.id,
        ),
      ).rejects.toThrowError(
        'The comment that you want to update was not found.',
      );
    });
  });

  it('should not delete a comment if the comment not exist', async () => {
    await RequestContext.createAsync(em, async () => {
      expect(
        service.delete(
          {
            boardId: board.id,
            commentId: 'f903e4b6-0bb8-44e2-8652-a31c14351829',
            taskId: task.id,
          },
          user.id,
        ),
      ).rejects.toThrowError(
        'The comment that you want to delete was not found.',
      );
    });
  });

  it('should not reply to a comment if the task not exist', async () => {
    await RequestContext.createAsync(em, async () => {
      expect(
        service.reply(
          {
            boardId: board.id,
            commentId: 'f903e4b6-0bb8-44e2-8652-a31c14351829',
            content: 'Comment content',
            taskId: 'f903e4b6-0bb8-44e2-8652-a31c14351829',
          },
          user.id,
        ),
      ).rejects.toThrowError('The task to reply the comment to was not found.');
    });
  });

  it('should not reply to a comment if the comment not exist', async () => {
    await RequestContext.createAsync(em, async () => {
      expect(
        service.reply(
          {
            boardId: board.id,
            commentId: 'f903e4b6-0bb8-44e2-8652-a31c14351829',
            content: 'Comment content',
            taskId: task.id,
          },
          user.id,
        ),
      ).rejects.toThrowError(
        'The comment that you want to reply was not found.',
      );
    });
  });

  it('should not update a comment if the user is not the owner', async () => {
    await RequestContext.createAsync(em, async () => {
      const comment = await service.create(
        {
          boardId: board.id,
          content: 'Comment content',
          taskId: task.id,
        },
        user.id,
      );

      await expect(
        service.update(
          {
            boardId: board.id,
            commentId: comment.id,
            content: 'Comment content',
            taskId: task.id,
          },
          'f903e4b6-0bb8-44e2-8652-a31c14351829',
        ),
      ).rejects.toThrowError(
        'You are not allowed to update this comment because you are not the author.',
      );
    });
  });

  it('should not delete a comment if the user is not the owner', async () => {
    await RequestContext.createAsync(em, async () => {
      const comment = await service.create(
        {
          boardId: board.id,
          content: 'Comment content',
          taskId: task.id,
        },
        user.id,
      );

      await expect(
        service.delete(
          {
            boardId: board.id,
            commentId: comment.id,
            taskId: task.id,
          },
          'f903e4b6-0bb8-44e2-8652-a31c14351829',
        ),
      ).rejects.toThrowError(
        'You are not allowed to update this comment because you are not the author.',
      );
    });
  });
});
