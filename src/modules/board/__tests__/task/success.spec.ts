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
 * Test Suite: Task - Successfully cases
 * This suite aims to test the primary operations around tasks in the system, ensuring the correct functionality of task creation, updating, deleting, and other relevant operations.
 */
describe('Task - Successfully cases', async () => {
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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a task', async () => {
    await RequestContext.createAsync(em, async () => {
      const task = await service.create(
        {
          boardId: board.id,
          description: 'Task description',
          name: 'Task name',
        },
        user.id,
      );

      expect(task).toBeDefined();
      expect(task.id).toBeDefined();
      expect(task.step).toBeDefined();
      expect(task.name).toBe('Task name');
      expect(task.description).toBe('Task description');
      expect(task.step?.id).toBe(stepStart.id);
    });
  });

  /**
   * Test Case: Service Definition
   * Ensures that the service being tested is correctly instantiated.
   */
  it('should update a task', async () => {
    await RequestContext.createAsync(em, async () => {
      const task = await service.create(
        {
          boardId: board.id,
          description: 'Task description',
          name: 'Task name',
        },
        user.id,
      );

      const updatedTask = await service.update({
        boardId: board.id,
        description: 'Task description updated',
        name: 'Task name updated',
        taskId: task.id,
      });

      expect(updatedTask).toBeDefined();
      expect(updatedTask.id).toBeDefined();
      expect(updatedTask.step).toBeDefined();
      expect(updatedTask.name).toBe('Task name updated');
      expect(updatedTask.description).toBe('Task description updated');
      expect(updatedTask.step?.id).toBe(stepStart.id);
    });
  });

  /**
   * Test Case: Create Task
   * Ensures that a task can be successfully created.
   */
  it('should delete a task', async () => {
    await RequestContext.createAsync(em, async () => {
      const task = await service.create(
        {
          boardId: board.id,
          description: 'Task description',
          name: 'Task name',
        },
        user.id,
      );

      const stepBeforeUpdate = await boardService.get({
        boardId: board.id,
        projectId: project.id,
      });

      expect(stepBeforeUpdate).toBeDefined();
      expect(stepBeforeUpdate.steps).toBeDefined();
      expect(stepBeforeUpdate.steps.length).toBe(3);
      expect(stepBeforeUpdate.steps[0].tasks.length).toBe(1);

      await service.delete({
        boardId: board.id,
        taskId: task.id,
      });

      const stepAfterUpdate = await boardService.get({
        boardId: board.id,
        projectId: project.id,
      });

      expect(stepAfterUpdate).toBeDefined();
      expect(stepAfterUpdate.steps).toBeDefined();
      expect(stepAfterUpdate.steps.length).toBe(3);
      expect(stepAfterUpdate.steps[0].tasks.length).toBe(0);
    });
  });

  /**
   * Test Case: Move Task to Another Step
   * Tests the ability to move a task from one step to another within a board.
   */
  it('should move a task to another step', async () => {
    await RequestContext.createAsync(em, async () => {
      const task = await service.create(
        {
          boardId: board.id,
          description: 'Task description',
          name: 'Task name',
        },
        user.id,
      );

      expect(task).toBeDefined();
      expect(task.id).toBeDefined();
      expect(task.step).toBeDefined();
      expect(task.step?.id).toBe(stepStart.id);

      const updatedTask = await service.move({
        boardId: board.id,
        position: 1,
        stepId: stepTask.id,
        taskId: task.id,
      });

      expect(updatedTask).toBeDefined();
      expect(updatedTask.id).toBeDefined();
      expect(updatedTask.step).toBeDefined();
      expect(updatedTask.name).toBe('Task name');
      expect(updatedTask.description).toBe('Task description');
      expect(updatedTask.step?.id).toBe(stepTask.id);
    });
  });

  /**
   * Test Case: Move Task Position Within Same Step
   * Verifies that a task's position can be adjusted within the same step.
   */
  it('should move a task to another step position', async () => {
    await RequestContext.createAsync(em, async () => {
      const task = await service.create(
        {
          boardId: board.id,
          description: 'Task description',
          name: 'Task to be moved',
        },
        user.id,
      );

      expect(task).toBeDefined();
      expect(task.id).toBeDefined();

      await service.create(
        {
          boardId: board.id,
          description: 'Task description',
          name: 'Task name',
        },
        user.id,
      );

      await service.create(
        {
          boardId: board.id,
          description: 'Task description',
          name: 'Task to be replaced',
        },
        user.id,
      );

      const stepBeforeUpdate = await boardService.get({
        boardId: board.id,
        projectId: project.id,
      });

      expect(stepBeforeUpdate).toBeDefined();
      expect(stepBeforeUpdate.steps).toBeDefined();
      expect(stepBeforeUpdate.steps.length).toBe(3);
      expect(stepBeforeUpdate.steps[0].tasks.length).toBe(3);
      expect(stepBeforeUpdate.steps[0].tasks[0].position).toBe(1);

      const updatedTask = await service.move({
        boardId: board.id,
        position: 3,
        stepId: stepStart.id,
        taskId: task.id,
      });

      expect(updatedTask).toBeDefined();
      expect(updatedTask.id).toBeDefined();
      expect(updatedTask.step).toBeDefined();

      const stepAfterUpdate = await boardService.get({
        boardId: board.id,
        projectId: project.id,
      });

      expect(stepAfterUpdate).toBeDefined();
      expect(stepAfterUpdate.steps).toBeDefined();
      expect(stepAfterUpdate.steps.length).toBe(3);
      expect(stepBeforeUpdate.steps[0].tasks[2].name).toBe(task.name);
    });
  });

  /**
   * Test Case: Move Task Across Steps and Adjust Position
   * Tests the ability to move a task to a different step and adjust its position simultaneously.
   */
  it('should move a task to another step and position', async () => {
    await RequestContext.createAsync(em, async () => {
      const task = await service.create(
        {
          boardId: board.id,
          description: 'Task description',
          name: 'Task to be moved',
        },
        user.id,
      );

      expect(task).toBeDefined();
      expect(task.id).toBeDefined();

      await service.create(
        {
          boardId: board.id,
          description: 'Task description',
          name: 'Task name',
        },
        user.id,
      );

      const taskMoved = await service.create(
        {
          boardId: board.id,
          description: 'Task description',
          name: 'Task moved',
        },
        user.id,
      );

      expect(taskMoved).toBeDefined();
      expect(taskMoved.id).toBeDefined();

      await service.move({
        boardId: board.id,
        position: 1,
        stepId: stepTask.id,
        taskId: task.id,
      });

      const stepBeforeUpdate = await boardService.get({
        boardId: board.id,
        projectId: project.id,
      });

      expect(stepBeforeUpdate).toBeDefined();
      expect(stepBeforeUpdate.steps).toBeDefined();
      expect(stepBeforeUpdate.steps.length).toBe(3);
      expect(stepBeforeUpdate.steps[0].tasks.length).toBe(2);
      expect(stepBeforeUpdate.steps[0].tasks[0].position).toBe(1);
      expect(stepBeforeUpdate.steps[1].tasks.length).toBe(1);

      await service.move({
        boardId: board.id,
        position: 1,
        stepId: stepTask.id,
        taskId: taskMoved.id,
      });

      const stepAfterUpdate = await boardService.get({
        boardId: board.id,
        projectId: project.id,
      });

      expect(stepAfterUpdate).toBeDefined();
      expect(stepAfterUpdate.steps).toBeDefined();
      expect(stepAfterUpdate.steps.length).toBe(3);
      expect(stepBeforeUpdate.steps[1].tasks[0].name).toBe(taskMoved.name);
      expect(stepBeforeUpdate.steps[1].tasks[1].name).toBe(task.name);
    });
  });

  /**
   * Test Case: Assign User to Task
   * Verifies that a user can be successfully assigned to a task.
   */
  it('should assign a user to a task', async () => {
    await RequestContext.createAsync(em, async () => {
      const task = await service.create(
        {
          boardId: board.id,
          description: 'Task description',
          name: 'Task name',
        },
        user.id,
      );

      expect(task).toBeDefined();
      expect(task.id).toBeDefined();
      expect(board.members).toBeDefined();
      expect(board.members.length).toBe(1);

      const assignedTask = await service.assignUser({
        boardId: board.id,
        memberId: board.members[0].id,
        taskId: task.id,
      });

      expect(assignedTask).toBeDefined();
      expect(assignedTask.id).toBeDefined();
      expect(assignedTask.assigned_to).toBeDefined();
      expect(assignedTask.assigned_to?.id).toBe(user.id);
    });
  });

  /**
   * Test Case: Unassign User from Task
   * Ensures that a user can be successfully unassigned from a task.
   */
  it('should unassign a user to a task', async () => {
    await RequestContext.createAsync(em, async () => {
      const task = await service.create(
        {
          boardId: board.id,
          description: 'Task description',
          name: 'Task name',
        },
        user.id,
      );

      expect(task).toBeDefined();
      expect(task.id).toBeDefined();
      expect(board.members).toBeDefined();
      expect(board.members.length).toBe(1);

      const assignedTask = await service.assignUser({
        boardId: board.id,
        memberId: board.members[0].id,
        taskId: task.id,
      });

      expect(assignedTask).toBeDefined();
      expect(assignedTask.id).toBeDefined();
      expect(assignedTask.assigned_to).toBeDefined();
      expect(assignedTask.assigned_to?.id).toBe(user.id);

      const unassignedTask = await service.unAssignUser({
        boardId: board.id,
        memberId: board.members[0].id,
        taskId: task.id,
      });

      expect(unassignedTask).toBeDefined();
      expect(unassignedTask.id).toBeDefined();
      expect(unassignedTask.assigned_to).toBeNull();
    });
  });

  /**
   * Test Case: Set Start Date on Task Move
   * Tests that a start date is correctly set when a task is moved to a different step.
   */
  it('should set start date when a task is moved to another step', async () => {
    await RequestContext.createAsync(em, async () => {
      const task = await service.create(
        {
          boardId: board.id,
          description: 'Task description',
          name: 'Task name',
        },
        user.id,
      );

      expect(task).toBeDefined();
      expect(task.id).toBeDefined();
      expect(task.start_date).toBeUndefined();

      const updatedTask = await service.move({
        boardId: board.id,
        position: 1,
        stepId: stepTask.id,
        taskId: task.id,
      });

      expect(updatedTask).toBeDefined();
      expect(updatedTask.id).toBeDefined();
      expect(updatedTask.start_date).toBeDefined();
    });
  });

  /**
   * Test Case: Set Finish Date on Task Move to Finish Step
   * Verifies that a finish date is set when a task is moved to a finish step.
   */
  it('should set finish date when a task is moved to finish step', async () => {
    await RequestContext.createAsync(em, async () => {
      const task = await service.create(
        {
          boardId: board.id,
          description: 'Task description',
          name: 'Task name',
        },
        user.id,
      );

      expect(task).toBeDefined();
      expect(task.id).toBeDefined();
      expect(task.finish_date).toBeUndefined();

      await service.assignUser({
        boardId: board.id,
        memberId: board.members[0].id,
        taskId: task.id,
      });

      const updatedTask = await service.move({
        boardId: board.id,
        position: 1,
        stepId: stepFinish.id,
        taskId: task.id,
      });

      expect(updatedTask).toBeDefined();
      expect(updatedTask.id).toBeDefined();
      expect(updatedTask.finish_date).toBeDefined();
    });
  });

  /**
   * Test Case: Add Child Task to Parent Task
   * Ensures that a child task can be successfully added to a parent task.
   */
  it('should add a child task to a task', async () => {
    await RequestContext.createAsync(em, async () => {
      const parentTask = await service.create(
        {
          boardId: board.id,
          description: 'Parent Task description',
          name: 'Parent Task name',
        },
        user.id,
      );

      expect(parentTask).toBeDefined();
      expect(parentTask.id).toBeDefined();

      const childTask = await service.addChild({
        boardId: board.id,
        child_of: parentTask.id,
        description: 'Child Task description',
        name: 'Child Task name',
      });

      expect(childTask).toBeDefined();
      expect(childTask.id).toBeDefined();
      expect(childTask.parent).toBeDefined();
      expect(childTask.parent?.id).toBe(parentTask.id);

      const parentTaskWithChildren = await service.get({
        boardId: board.id,
        taskId: parentTask.id,
      });

      expect(parentTaskWithChildren).toBeDefined();
      expect(parentTaskWithChildren?.id).toBeDefined();
      expect(parentTaskWithChildren?.childrens).toBeDefined();
      expect(parentTaskWithChildren?.childrens.length).toBe(1);
    });
  });

  /**
   * Test Case: Remove Child Task from Parent Task
   * Tests the ability to remove a child task from its parent task.
   */
  it('should remove a child task to a task', async () => {
    await RequestContext.createAsync(em, async () => {
      const parentTask = await service.create(
        {
          boardId: board.id,
          description: 'Parent Task description',
          name: 'Parent Task name',
        },
        user.id,
      );

      expect(parentTask).toBeDefined();
      expect(parentTask.id).toBeDefined();

      const childTask = await service.addChild({
        boardId: board.id,
        child_of: parentTask.id,
        description: 'Child Task description',
        name: 'Child Task name',
      });

      expect(childTask).toBeDefined();
      expect(childTask.id).toBeDefined();
      expect(childTask.parent).toBeDefined();
      expect(childTask.parent?.id).toBe(parentTask.id);

      const parentTaskWithChildren = await service.get({
        boardId: board.id,
        taskId: parentTask.id,
      });

      expect(parentTaskWithChildren).toBeDefined();
      expect(parentTaskWithChildren?.id).toBeDefined();
      expect(parentTaskWithChildren?.childrens).toBeDefined();
      expect(parentTaskWithChildren?.childrens.length).toBe(1);

      await service.removeChild({
        boardId: board.id,
        child_of: parentTask.id,
        taskId: childTask.id,
      });

      const parentTaskWithoutChildren = await service.get({
        boardId: board.id,
        taskId: parentTask.id,
      });

      expect(parentTaskWithoutChildren).toBeDefined();
      expect(parentTaskWithoutChildren?.id).toBeDefined();
      expect(parentTaskWithoutChildren?.childrens).toBeDefined();
      expect(parentTaskWithoutChildren?.childrens.length).toBe(0);
    });
  });
});
