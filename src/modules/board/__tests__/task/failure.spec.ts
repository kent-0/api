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
import { ProjectService } from '~/modules/project/services/project.service';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { TestingMikroORMConfig } from '../../../../../mikro-orm.config';

/**
 * This test suite is focused on the various unsuccessful cases/scenarios that might occur
 * when interacting with the `BoardTaskService`. It's designed to ensure that the system
 * behaves as expected when encountering errors or edge cases.
 */
describe('Task - Unsuccessfully cases', async () => {
  let module: TestingModule;
  let service: BoardTaskService;
  let stepService: BoardStepService;
  let boardService: BoardService;
  let accountService: AuthAccountService;
  let projectService: ProjectService;

  let orm: MikroORM;
  let em: EntityManager;

  let project: ProjectEntity;
  let board: BoardEntity;
  let stepStart: BoardStepEntity;
  let stepTask: BoardStepEntity;
  let stepFinish: BoardStepEntity;
  let user: AuthUserEntity;

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
      ],
    }).compile();

    service = module.get<BoardTaskService>(BoardTaskService);
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

      const boardStepTestStart = await stepService.create({
        boardId: board.id,
        description: 'Step description',
        name: 'Step Start',
        type: StepType.START,
      });

      const boardStepTaskTest = await stepService.create({
        boardId: board.id,
        description: 'Step description',
        name: 'Step Task',
        type: StepType.TASK,
      });

      const boardStepTestFinish = await stepService.create({
        boardId: board.id,
        description: 'Step description',
        name: 'Step Finish',
        type: StepType.FINISH,
      });

      stepStart = await em.findOneOrFail(BoardStepEntity, {
        id: boardStepTestStart.id,
      });

      stepTask = await em.findOneOrFail(BoardStepEntity, {
        id: boardStepTaskTest.id,
      });

      stepFinish = await em.findOneOrFail(BoardStepEntity, {
        id: boardStepTestFinish.id,
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
   * Test Case: Service Definition
   * Ensures that the service being tested is correctly instantiated.
   */
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  /**
   * This test checks if a task cannot be created when the board has no steps.
   */
  it('should not create a task because the board has no steps created', async () => {
    await RequestContext.createAsync(em, async () => {
      await stepService.remove({
        boardId: board.id,
        stepId: stepStart.id,
      });

      await stepService.remove({
        boardId: board.id,
        stepId: stepTask.id,
      });

      await stepService.remove({
        boardId: board.id,
        stepId: stepFinish.id,
      });

      await expect(
        service.create(
          {
            boardId: board.id,
            description: 'Task description',
            name: 'Task',
          },
          user.id,
        ),
      ).rejects.toThrowError(
        'The dashboard must have at least one step in order to create tasks. These tasks are assigned to the first step.',
      );
    });
  });

  /**
   * This test ensures that a task cannot be deleted if it's already marked as finished.
   */
  it('should not delete a task if the task does not exist', async () => {
    await RequestContext.createAsync(em, async () => {
      await expect(
        service.delete({
          boardId: board.id,
          taskId: 'f903e4b6-0bb8-44e2-8652-a31c14351829',
        }),
      ).rejects.toThrowError(
        'The task you are trying to delete does not exist.',
      );
    });
  });

  /**
   * This test ensures that a task cannot be deleted if it's already marked as finished.
   */
  it('should not delete a task if the task is finished', async () => {
    await RequestContext.createAsync(em, async () => {
      const task = await service.create(
        {
          boardId: board.id,
          description: 'Task description',
          name: 'Task',
        },
        user.id,
      );

      await service.assignUser({
        boardId: board.id,
        memberId: board.members[0].id,
        taskId: task.id,
      });

      await service.move({
        boardId: board.id,
        position: 1,
        stepId: stepFinish.id,
        taskId: task.id,
      });

      await expect(
        service.delete({
          boardId: board.id,
          taskId: task.id,
        }),
      ).rejects.toThrowError(
        'The task you are trying to delete has already been finished.',
      );
    });
  });

  /**
   * This test checks the case where trying to delete a task that is a child
   * of another task should result in an error if the child task doesn't have
   * a step assigned.
   */
  it('should not delete a task if is a child of another task', async () => {
    await RequestContext.createAsync(em, async () => {
      const task = await service.create(
        {
          boardId: board.id,
          description: 'Task description',
          name: 'Task',
        },
        user.id,
      );

      await service.assignUser({
        boardId: board.id,
        memberId: board.members[0].id,
        taskId: task.id,
      });

      await service.move({
        boardId: board.id,
        position: 1,
        stepId: stepTask.id,
        taskId: task.id,
      });

      const taskChild = await service.addChild({
        boardId: board.id,
        child_of: task.id,
        description: 'Task description',
        name: 'Task Child',
      });

      await expect(
        service.delete({
          boardId: board.id,
          taskId: taskChild.id,
        }),
      ).rejects.toThrowError(
        'The task you are trying to delete does not have a step.',
      );
    });
  });

  /**
   * This test ensures that fetching a non-existing task should result in an error.
   */
  it('should not get a task if the task does not exist', async () => {
    await RequestContext.createAsync(em, async () => {
      await expect(
        service.get({
          boardId: board.id,
          taskId: 'f903e4b6-0bb8-44e2-8652-a31c14351829',
        }),
      ).rejects.toThrowError(
        'The task you are trying to fetch does not exist.',
      );
    });
  });

  /**
   * This test verifies that an error is thrown when trying to move a task to a non-existing step.
   */
  it('should not move a task if the step does not exist', async () => {
    await RequestContext.createAsync(em, async () => {
      const task = await service.create(
        {
          boardId: board.id,
          description: 'Task description',
          name: 'Task',
        },
        user.id,
      );

      await expect(
        service.move({
          boardId: board.id,
          position: 1,
          stepId: 'f903e4b6-0bb8-44e2-8652-a31c14351829',
          taskId: task.id,
        }),
      ).rejects.toThrowError(
        'The step you are trying to move the task to does not exist.',
      );
    });
  });

  /**
   * This test checks if an error is thrown when attempting to move a non-existing task.
   */
  it('should not move a task if the task does not exist', async () => {
    await RequestContext.createAsync(em, async () => {
      await expect(
        service.move({
          boardId: board.id,
          position: 1,
          stepId: stepTask.id,
          taskId: 'f903e4b6-0bb8-44e2-8652-a31c14351829',
        }),
      ).rejects.toThrowError('The task you are trying to move does not exist.');
    });
  });

  /**
   * This test ensures that a task that's already finished can't be moved to another step.
   */
  it('should not move a task if the task is finished', async () => {
    await RequestContext.createAsync(em, async () => {
      const task = await service.create(
        {
          boardId: board.id,
          description: 'Task description',
          name: 'Task',
        },
        user.id,
      );

      await service.assignUser({
        boardId: board.id,
        memberId: board.members[0].id,
        taskId: task.id,
      });

      await service.move({
        boardId: board.id,
        position: 1,
        stepId: stepFinish.id,
        taskId: task.id,
      });

      await expect(
        service.move({
          boardId: board.id,
          position: 1,
          stepId: stepTask.id,
          taskId: task.id,
        }),
      ).rejects.toThrowError(
        'The task you are trying to move has already been finished.',
      );
    });
  });

  /**
   * This test ensures tasks without assigned users cannot be moved to finish steps.
   */
  it('should not move a task to finish step if the task not has a user assigned', async () => {
    await RequestContext.createAsync(em, async () => {
      const task = await service.create(
        {
          boardId: board.id,
          description: 'Task description',
          name: 'Task',
        },
        user.id,
      );

      await expect(
        service.move({
          boardId: board.id,
          position: 1,
          stepId: stepFinish.id,
          taskId: task.id,
        }),
      ).rejects.toThrowError(
        'The task you are trying to move does not have an assigned user.',
      );
    });
  });

  /**
   * This test checks that an error is thrown when trying to move a task to a step that's already full.
   */
  it('should not move a task if the step is full', async () => {
    await RequestContext.createAsync(em, async () => {
      const task1 = await service.create(
        {
          boardId: board.id,
          description: 'Task description',
          name: 'Task 1',
        },
        user.id,
      );

      const task2 = await service.create(
        {
          boardId: board.id,
          description: 'Task description',
          name: 'Task 2',
        },
        user.id,
      );

      await service.assignUser({
        boardId: board.id,
        memberId: board.members[0].id,
        taskId: task1.id,
      });

      await service.assignUser({
        boardId: board.id,
        memberId: board.members[0].id,
        taskId: task2.id,
      });

      const stepFully = await stepService.create({
        boardId: board.id,
        description: 'Step description',
        max: 1,
        name: 'Step Fully',
        type: StepType.TASK,
      });

      await service.move({
        boardId: board.id,
        position: 1,
        stepId: stepFully.id,
        taskId: task1.id,
      });

      await expect(
        service.move({
          boardId: board.id,
          position: 2,
          stepId: stepFully.id,
          taskId: task2.id,
        }),
      ).rejects.toThrowError(
        'The step you are trying to move the task to is full.',
      );
    });
  });

  /**
   * This test verifies that an error is thrown when trying to move a task to an invalid position within its current step.
   */
  it('should not move a task if the position to be replaced is not valid in the current step', async () => {
    await RequestContext.createAsync(em, async () => {
      const task1 = await service.create(
        {
          boardId: board.id,
          description: 'Task description',
          name: 'Task 1',
        },
        user.id,
      );

      const task2 = await service.create(
        {
          boardId: board.id,
          description: 'Task description',
          name: 'Task 2',
        },
        user.id,
      );

      await service.assignUser({
        boardId: board.id,
        memberId: board.members[0].id,
        taskId: task1.id,
      });

      await service.assignUser({
        boardId: board.id,
        memberId: board.members[0].id,
        taskId: task2.id,
      });

      const step = await stepService.create({
        boardId: board.id,
        description: 'Step description',
        name: 'Step with invalid position',
        type: StepType.TASK,
      });

      await service.move({
        boardId: board.id,
        position: 1,
        stepId: step.id,
        taskId: task1.id,
      });

      await expect(
        service.move({
          boardId: board.id,
          position: 5,
          stepId: step.id,
          taskId: task2.id,
        }),
      ).rejects.toThrowError(
        'The task you are trying to replace does not exist.',
      );
    });
  });

  /**
   * This test ensures that an error is thrown when trying to recount children's positions
   * for a non-existing task.
   */
  it('should not recount task childrens if the task does not exist', async () => {
    await RequestContext.createAsync(em, async () => {
      expect(async () =>
        service.recountTaskChildrensPositions(
          board.id,
          'f903e4b6-0bb8-44e2-8652-a31c14351829',
        ),
      ).rejects.toThrowError(
        'The task you are trying to update does not exist.',
      );
    });
  });

  /**
   * This test ensures that an error is thrown when trying to remove a child task
   * whose parent task doesn't exist.
   */
  it('should not remove child task if the parent task does not exist', async () => {
    await RequestContext.createAsync(em, async () => {
      const task = await service.create(
        {
          boardId: board.id,
          description: 'Task description',
          name: 'Task',
        },
        user.id,
      );

      expect(async () =>
        service.removeChild({
          boardId: board.id,
          child_of: 'f903e4b6-0bb8-44e2-8652-a31c14351829',
          taskId: task.id,
        }),
      ).rejects.toThrowError(
        'The parent task you are trying to assign does not exist.',
      );
    });
  });

  /**
   * This test ensures that an error is thrown when trying to delete a child task
   * that doesn't exist, even if a valid parent task ID is provided.
   */
  it('should not remove task child if the child task does not exist', async () => {
    await RequestContext.createAsync(em, async () => {
      const task = await service.create(
        {
          boardId: board.id,
          description: 'Task description',
          name: 'Task',
        },
        user.id,
      );

      expect(async () =>
        service.removeChild({
          boardId: board.id,
          child_of: task.id,
          taskId: 'f903e4b6-0bb8-44e2-8652-a31c14351829',
        }),
      ).rejects.toThrowError(
        'The task you are trying to delete does not exist.',
      );
    });
  });

  /**
   * This test verifies that unassigning a user from a non-existing task results in an error.
   */
  it('should not unassign a user from a task if the task does not exist', async () => {
    await RequestContext.createAsync(em, async () => {
      expect(async () =>
        service.unAssignUser({
          boardId: board.id,
          memberId: board.members[0].id,
          taskId: 'f903e4b6-0bb8-44e2-8652-a31c14351829',
        }),
      ).rejects.toThrowError(
        'The task you are trying to unassign does not exist.',
      );
    });
  });

  /**
   * This test checks if trying to unassign a user from a task that's already finished
   * results in an error.
   */
  it('should not unassing a user from a finished task', async () => {
    await RequestContext.createAsync(em, async () => {
      const task = await service.create(
        {
          boardId: board.id,
          description: 'Task description',
          name: 'Task',
        },
        user.id,
      );

      await service.assignUser({
        boardId: board.id,
        memberId: board.members[0].id,
        taskId: task.id,
      });

      await service.move({
        boardId: board.id,
        position: 1,
        stepId: stepFinish.id,
        taskId: task.id,
      });

      expect(async () =>
        service.unAssignUser({
          boardId: board.id,
          memberId: board.members[0].id,
          taskId: task.id,
        }),
      ).rejects.toThrowError(
        'The task you are trying to unassign has already been finished.',
      );
    });
  });

  /**
   * This test ensures that an error is thrown when trying to unassign a user
   * from a task which the user isn't assigned to.
   */
  it('should not unassing a user from a task if the user is not assigned to the task', async () => {
    await RequestContext.createAsync(em, async () => {
      const task = await service.create(
        {
          boardId: board.id,
          description: 'Task description',
          name: 'Task',
        },
        user.id,
      );

      expect(async () =>
        service.unAssignUser({
          boardId: board.id,
          memberId: board.members[0].id,
          taskId: task.id,
        }),
      ).rejects.toThrowError(
        'The task you are trying to unassign does not have an assigned user.',
      );
    });
  });

  /**
   * This test verifies that unassigning a non-existing member from a valid task results in an error.
   */
  it('should not unassign a member to a task if the member does not exist', async () => {
    await RequestContext.createAsync(em, async () => {
      const task = await service.create(
        {
          boardId: board.id,
          description: 'Task description',
          name: 'Task',
        },
        user.id,
      );

      await service.assignUser({
        boardId: board.id,
        memberId: board.members[0].id,
        taskId: task.id,
      });

      expect(async () =>
        service.unAssignUser({
          boardId: board.id,
          memberId: 'f903e4b6-0bb8-44e2-8652-a31c14351829',
          taskId: task.id,
        }),
      ).rejects.toThrowError(
        'The member you are trying to unassign does not exist.',
      );
    });
  });

  /**
   * This test checks that updating a non-existing task results in an error.
   */
  it('should not update a task if the task does not exist', async () => {
    await RequestContext.createAsync(em, async () => {
      expect(async () =>
        service.update({
          boardId: board.id,
          description: 'Task description',
          name: 'Task',
          taskId: 'f903e4b6-0bb8-44e2-8652-a31c14351829',
        }),
      ).rejects.toThrowError(
        'The task you are trying to update does not exist.',
      );
    });
  });

  /**
   * This test ensures that trying to replace a task's position with a position
   * that doesn't exist in the current step results in an error.
   */
  it('should not replace a position that doest not exist in the current step', async () => {
    await RequestContext.createAsync(em, async () => {
      const task = await service.create(
        {
          boardId: board.id,
          description: 'Task description',
          name: 'Task 1',
        },
        user.id,
      );

      await service.create(
        {
          boardId: board.id,
          description: 'Task description',
          name: 'Task 2',
        },
        user.id,
      );

      expect(async () =>
        service.move({
          boardId: board.id,
          position: 5,
          stepId: stepStart.id,
          taskId: task.id,
        }),
      ).rejects.toThrowError(
        'The task you are trying to replace does not exist.',
      );
    });
  });

  /**
   * This test verifies that an error is thrown when trying to move a task
   * that doesn't have a step assigned.
   */
  it('should not move a task if the task not has a step assigned', async () => {
    await RequestContext.createAsync(em, async () => {
      const task = await service.create(
        {
          boardId: board.id,
          description: 'Task description',
          name: 'Task 1',
        },
        user.id,
      );

      const child = await service.addChild({
        boardId: board.id,
        child_of: task.id,
        description: 'Task description',
        name: 'Task 2',
      });

      expect(async () =>
        service.move({
          boardId: board.id,
          position: 5,
          stepId: stepStart.id,
          taskId: child.id,
        }),
      ).rejects.toThrowError(
        'The task you are trying to move does not have a step.',
      );
    });
  });

  /**
   * This test ensures that assigning a user to a non-existing task results in an error.
   */
  it('should not assign a user to a task if the task does not exist', async () => {
    await RequestContext.createAsync(em, async () => {
      expect(async () =>
        service.assignUser({
          boardId: board.id,
          memberId: board.members[0].id,
          taskId: 'f903e4b6-0bb8-44e2-8652-a31c14351829',
        }),
      ).rejects.toThrowError(
        'The task you are trying to assign does not exist.',
      );
    });
  });

  /**
   * This test checks if assigning a user to a task that's already marked as finished
   * results in an error.
   */
  it('should not assign a user to a task if the task is finished', async () => {
    await RequestContext.createAsync(em, async () => {
      const task = await service.create(
        {
          boardId: board.id,
          description: 'Task description',
          name: 'Task 1',
        },
        user.id,
      );

      await service.assignUser({
        boardId: board.id,
        memberId: board.members[0].id,
        taskId: task.id,
      });

      await service.move({
        boardId: board.id,
        position: 1,
        stepId: stepFinish.id,
        taskId: task.id,
      });

      expect(async () =>
        service.assignUser({
          boardId: board.id,
          memberId: board.members[0].id,
          taskId: task.id,
        }),
      ).rejects.toThrowError(
        'The task you are trying to assign has already been finished.',
      );
    });
  });

  /**
   * This test ensures that assigning a non-existing member to a valid task results in an error.
   */
  it('should not assign a user to a task if the member does not exist', async () => {
    await RequestContext.createAsync(em, async () => {
      const task = await service.create(
        {
          boardId: board.id,
          description: 'Task description',
          name: 'Task',
        },
        user.id,
      );

      expect(async () =>
        service.assignUser({
          boardId: board.id,
          memberId: 'f903e4b6-0bb8-44e2-8652-a31c14351829',
          taskId: task.id,
        }),
      ).rejects.toThrowError(
        'The member you are trying to assign does not exist.',
      );
    });
  });

  /**
   * This test verifies that an error is thrown when trying to add a child task
   * without providing a parent task ID.
   */
  it('should not assign a user to a task if the task is already assigned to another member', async () => {
    await RequestContext.createAsync(em, async () => {
      const task1 = await service.create(
        {
          boardId: board.id,
          description: 'Task description',
          name: 'Task 1',
        },
        user.id,
      );

      await service.assignUser({
        boardId: board.id,
        memberId: board.members[0].id,
        taskId: task1.id,
      });

      expect(async () =>
        service.assignUser({
          boardId: board.id,
          memberId: board.members[0].id,
          taskId: task1.id,
        }),
      ).rejects.toThrowError(
        'The task you are trying to assign already has an assigned user.',
      );
    });
  });

  /**
   * This test checks that trying to add a child to a non-existing parent task results in an error.
   */
  it('should not add child to a task if the parent tasks id is not present', async () => {
    await RequestContext.createAsync(em, async () => {
      expect(async () =>
        service.addChild({
          boardId: board.id,
          description: 'Task description',
          name: 'Task',
        }),
      ).rejects.toThrowError('The child task must have a parent task.');
    });
  });

  /**
   * This test checks that trying to add a child to a non-existing parent task results in an error.
   */
  it('should not add child to a task if the parent task does not exist', async () => {
    await RequestContext.createAsync(em, async () => {
      expect(async () =>
        service.addChild({
          boardId: board.id,
          child_of: 'f903e4b6-0bb8-44e2-8652-a31c14351829',
          description: 'Task description',
          name: 'Task',
        }),
      ).rejects.toThrowError(
        'The parent task you are trying to assign does not exist.',
      );
    });
  });
});
