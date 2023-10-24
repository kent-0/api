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

describe('Task / Comments - Successfully cases', async () => {
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

  it('should create a comment in a task', async () => {
    await RequestContext.createAsync(em, async () => {
      const comment = await service.create(
        {
          boardId: board.id,
          content: 'This is a comment',
          taskId: task.id,
        },
        user.id,
      );

      expect(comment).toBeDefined();
      expect(comment.content).toBe('This is a comment');
      expect(comment.task).toBeDefined();
      expect(comment.task?.id).toBe(task.id);

      const taskWithComment = await boardTaskService.get({
        boardId: board.id,
        taskId: task.id,
      });

      expect(taskWithComment.comments).toBeDefined();
      expect(taskWithComment.comments.length).toBe(1);
      expect(taskWithComment.comments[0].content).toBe('This is a comment');
    });
  });

  it('should create a reply to a comment in a task', async () => {
    await RequestContext.createAsync(em, async () => {
      const comment = await service.create(
        {
          boardId: board.id,
          content: 'This is a comment',
          taskId: task.id,
        },
        user.id,
      );

      expect(comment).toBeDefined();
      expect(comment.content).toBe('This is a comment');
      expect(comment.task).toBeDefined();
      expect(comment.task?.id).toBe(task.id);

      const reply = await service.reply(
        {
          boardId: board.id,
          commentId: comment.id,
          content: 'This is a reply',
          taskId: task.id,
        },
        user.id,
      );

      expect(reply).toBeDefined();
      expect(reply.content).toBe('This is a reply');
      expect(reply.task?.id).toBeUndefined();
      expect(reply.reply_to).toBeDefined();
      expect(reply.reply_to?.id).toBe(comment.id);

      const taskWithComment = await boardTaskService.get({
        boardId: board.id,
        taskId: task.id,
      });

      expect(taskWithComment.comments).toBeDefined();
      expect(taskWithComment.comments.length).toBe(1);
      expect(taskWithComment.comments[0].content).toBe('This is a comment');
      expect(taskWithComment.comments[0].replies).toBeDefined();
      expect(taskWithComment.comments[0].replies.length).toBe(1);
      expect(taskWithComment.comments[0].replies[0].content).toBe(
        'This is a reply',
      );
    });
  });

  it('should delete a comment in a task', async () => {
    await RequestContext.createAsync(em, async () => {
      const comment = await service.create(
        {
          boardId: board.id,
          content: 'This is a comment',
          taskId: task.id,
        },
        user.id,
      );

      expect(comment).toBeDefined();
      expect(comment.content).toBe('This is a comment');
      expect(comment.task).toBeDefined();
      expect(comment.task?.id).toBe(task.id);

      const taskWithComment = await boardTaskService.get({
        boardId: board.id,
        taskId: task.id,
      });

      expect(taskWithComment.comments).toBeDefined();
      expect(taskWithComment.comments.length).toBe(1);
      expect(taskWithComment.comments[0].content).toBe('This is a comment');

      const deletedComment = await service.delete(
        {
          boardId: board.id,
          commentId: comment.id,
          taskId: task.id,
        },
        user.id,
      );

      expect(deletedComment).toBe('Comment deleted successfully.');

      const taskWithNoComment = await boardTaskService.get({
        boardId: board.id,
        taskId: task.id,
      });

      expect(taskWithNoComment.comments).toBeDefined();
      expect(taskWithNoComment.comments.length).toBe(0);
    });
  });

  it('should delete a reply to a comment in a task', async () => {
    await RequestContext.createAsync(em, async () => {
      const comment = await service.create(
        {
          boardId: board.id,
          content: 'This is a comment',
          taskId: task.id,
        },
        user.id,
      );

      expect(comment).toBeDefined();
      expect(comment.content).toBe('This is a comment');
      expect(comment.task).toBeDefined();
      expect(comment.task?.id).toBe(task.id);

      const reply = await service.reply(
        {
          boardId: board.id,
          commentId: comment.id,
          content: 'This is a reply',
          taskId: task.id,
        },
        user.id,
      );

      expect(reply).toBeDefined();
      expect(reply.content).toBe('This is a reply');
      expect(reply.task?.id).toBeUndefined();
      expect(reply.reply_to).toBeDefined();
      expect(reply.reply_to?.id).toBe(comment.id);

      const taskWithComment = await boardTaskService.get({
        boardId: board.id,
        taskId: task.id,
      });

      expect(taskWithComment.comments).toBeDefined();
      expect(taskWithComment.comments.length).toBe(1);
      expect(taskWithComment.comments[0].content).toBe('This is a comment');
      expect(taskWithComment.comments[0].replies).toBeDefined();
      expect(taskWithComment.comments[0].replies.length).toBe(1);
      expect(taskWithComment.comments[0].replies[0].content).toBe(
        'This is a reply',
      );

      const deletedReply = await service.delete(
        {
          boardId: board.id,
          commentId: reply.id,
          taskId: task.id,
        },
        user.id,
      );

      expect(deletedReply).toBe('Comment deleted successfully.');

      const taskWithNoComment = await boardTaskService.get({
        boardId: board.id,
        taskId: task.id,
      });

      expect(taskWithNoComment.comments).toBeDefined();
      expect(taskWithNoComment.comments.length).toBe(1);
      expect(taskWithNoComment.comments[0].content).toBe('This is a comment');
      expect(taskWithNoComment.comments[0].replies).toBeDefined();
      expect(taskWithNoComment.comments[0].replies.length).toBe(0);
    });
  });

  it('should update a comment in a task', async () => {
    await RequestContext.createAsync(em, async () => {
      const comment = await service.create(
        {
          boardId: board.id,
          content: 'This is a comment',
          taskId: task.id,
        },
        user.id,
      );

      expect(comment).toBeDefined();
      expect(comment.content).toBe('This is a comment');
      expect(comment.task).toBeDefined();
      expect(comment.task?.id).toBe(task.id);

      const taskWithComment = await boardTaskService.get({
        boardId: board.id,
        taskId: task.id,
      });

      expect(taskWithComment.comments).toBeDefined();
      expect(taskWithComment.comments.length).toBe(1);
      expect(taskWithComment.comments[0].content).toBe('This is a comment');

      const updatedComment = await service.update(
        {
          boardId: board.id,
          commentId: comment.id,
          content: 'This is an updated comment',
          taskId: task.id,
        },
        user.id,
      );

      expect(updatedComment).toBeDefined();
      expect(updatedComment.content).toBe('This is an updated comment');
      expect(updatedComment.task).toBeDefined();
      expect(updatedComment.task?.id).toBe(task.id);

      const taskWithUpdatedComment = await boardTaskService.get({
        boardId: board.id,
        taskId: task.id,
      });

      expect(taskWithUpdatedComment.comments).toBeDefined();
      expect(taskWithUpdatedComment.comments.length).toBe(1);
      expect(taskWithUpdatedComment.comments[0].content).toBe(
        'This is an updated comment',
      );
    });
  });

  it('should update a reply to a comment in a task', async () => {
    await RequestContext.createAsync(em, async () => {
      const comment = await service.create(
        {
          boardId: board.id,
          content: 'This is a comment',
          taskId: task.id,
        },
        user.id,
      );

      expect(comment).toBeDefined();
      expect(comment.content).toBe('This is a comment');
      expect(comment.task).toBeDefined();
      expect(comment.task?.id).toBe(task.id);

      const reply = await service.reply(
        {
          boardId: board.id,
          commentId: comment.id,
          content: 'This is a reply',
          taskId: task.id,
        },
        user.id,
      );

      expect(reply).toBeDefined();
      expect(reply.content).toBe('This is a reply');
      expect(reply.task?.id).toBeUndefined();
      expect(reply.reply_to).toBeDefined();
      expect(reply.reply_to?.id).toBe(comment.id);

      const updatedReply = await service.update(
        {
          boardId: board.id,
          commentId: reply.id,
          content: 'This is an updated reply comment',
          taskId: task.id,
        },
        user.id,
      );

      expect(updatedReply).toBeDefined();
      expect(updatedReply.content).toBe('This is an updated reply comment');

      const taskWithComment = await boardTaskService.get({
        boardId: board.id,
        taskId: task.id,
      });

      expect(taskWithComment.comments).toBeDefined();
      expect(taskWithComment.comments.length).toBe(1);
      expect(taskWithComment.comments[0].content).toBe('This is a comment');
      expect(taskWithComment.comments[0].replies).toBeDefined();
      expect(taskWithComment.comments[0].replies.length).toBe(1);
      expect(taskWithComment.comments[0].replies[0].content).toBe(
        'This is an updated reply comment',
      );
    });
  });
});
