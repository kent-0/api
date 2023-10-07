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
  ProjectEntity,
  ProjectMembersEntity,
} from '~/database/entities';
import { AuthModule } from '~/modules/auth/auth.module';
import { AuthAccountService } from '~/modules/auth/services/account.service';
import { BoardService } from '~/modules/board/services/board.service';
import { BoardMemberService } from '~/modules/board/services/member.service';
import { BoardStepService } from '~/modules/board/services/step.service';
import { ProjectService } from '~/modules/project/services/project.service';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { TestingMikroORMConfig } from '../../../../../mikro-orm.config';

/**
 * `Board - Step Successfully cases` Test Suite:
 * This test suite focuses on validating the successful scenarios related to board step management within a project.
 * It ensures that steps can be created, updated, deleted, and manipulated (e.g., marked as finished) as expected,
 * while maintaining the integrity of the associated board and project data.
 */
describe('Board - Step Successfully cases', async () => {
  let module: TestingModule;
  let service: BoardStepService;
  let boardService: BoardService;
  let accountService: AuthAccountService;
  let projectService: ProjectService;

  let orm: MikroORM;
  let em: EntityManager;

  let project: ProjectEntity;
  let board: BoardEntity;
  let user: AuthUserEntity;

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
            BoardStepEntity,
          ],
        }),
        AuthModule,
      ],
      providers: [
        BoardService,
        BoardService,
        BoardStepService,
        ProjectService,
        BoardMemberService,
      ],
    }).compile();

    service = module.get<BoardStepService>(BoardStepService);
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
    });
  });

  /**
   * Cleanup after test are finished.
   */
  afterEach(async () => {
    await module.close();
  });

  /**
   * Test Case: Step Creation:
   * Validates that a step can be successfully created and that the relevant data is correctly stored.
   */
  it('should create a step', async () => {
    await RequestContext.createAsync(em, async () => {
      const step = await service.create({
        boardId: board.id,
        description: 'Test Step Description',
        name: 'Test Step',
      });

      expect(step).toBeDefined();
      expect(step.id).toBeDefined();
      expect(step.name).toEqual('Test Step');
    });
  });

  /**
   * Test Case: Step Update:
   * Ensures that a step can be updated and that the updated data is correctly stored.
   */
  it('should update a step', async () => {
    await RequestContext.createAsync(em, async () => {
      const step = await service.create({
        boardId: board.id,
        description: 'Test Step Description',
        name: 'Test Step',
      });

      const updatedStep = await service.update({
        boardId: board.id,
        description: 'Test Step Description',
        name: 'Test Step Updated',
        stepId: step.id,
      });

      expect(updatedStep).toBeDefined();
      expect(updatedStep.id).toBeDefined();
      expect(updatedStep.name).toEqual('Test Step Updated');
    });
  });

  /**
   * Test Case: Step Deletion:
   * Validates that a step can be deleted and that it is removed from the system.
   */
  it('should delete a step', async () => {
    await RequestContext.createAsync(em, async () => {
      const step = await service.create({
        boardId: board.id,
        description: 'Test Step Description',
        name: 'Test Step',
      });

      const deletedStep = await service.remove({
        boardId: board.id,
        stepId: step.id,
      });

      expect(deletedStep).toBeDefined();
      expect(deletedStep).toEqual('The step has been successfully removed.');
    });
  });

  /**
   * Test Case: Step Marked as Finished:
   * Ensures that a step can be marked as finished and that this status is correctly updated in the system.
   */
  it('should mark as finished a step', async () => {
    await RequestContext.createAsync(em, async () => {
      const step = await service.create({
        boardId: board.id,
        description: 'Test Step Description',
        name: 'Test Step',
      });

      await service.create({
        boardId: board.id,
        description: 'Test Step Description',
        name: 'Test Step',
      });

      const finishedStep = await service.markAsFinished({
        boardId: board.id,
        stepId: step.id,
      });

      expect(finishedStep).toBeDefined();
      expect(finishedStep.finish_step).toBe(true);
    });
  });

  /**
   * Test Case: Managing Multiple Finished Steps:
   * Validates that when a new step is marked as finished, the previous one is unmarked, maintaining
   * that only one step is marked as finished at a time in the system.
   */
  it('should mark a new step as finished and unmark the previous one', async () => {
    await RequestContext.createAsync(em, async () => {
      const step = await service.create({
        boardId: board.id,
        description: 'Test Step Description',
        name: 'Test Step',
      });

      const toFinishedStep = await service.create({
        boardId: board.id,
        description: 'Test Step Description',
        name: 'Test Step',
      });

      const finishedStep = await service.markAsFinished({
        boardId: board.id,
        stepId: step.id,
      });

      expect(finishedStep).toBeDefined();
      expect(finishedStep.finish_step).toBe(true);

      const finishedOtherStep = await service.markAsFinished({
        boardId: board.id,
        stepId: toFinishedStep.id,
      });

      expect(finishedOtherStep).toBeDefined();
      expect(finishedOtherStep.finish_step).toBe(true);

      const steps = await em.find(BoardStepEntity, { board: board.id });

      expect(steps).toBeDefined();
      expect(steps.length).toBe(2);

      const previousStepFinished = steps.find(
        (step) => step.id === finishedStep.id,
      );

      expect(previousStepFinished).toBeDefined();
      expect(previousStepFinished!.finish_step).toBe(false);

      const previousStepUnfinished = steps.find(
        (step) => step.id === finishedOtherStep.id,
      );

      expect(previousStepUnfinished).toBeDefined();
      expect(previousStepUnfinished!.finish_step).toBe(true);
    });
  });

  /**
   * Test Case: Moving Step Position:
   * Verifies that a step can be moved to a different position in the order of steps,
   * ensuring the reordering is accurately reflected in the system, and all steps maintain a unique position.
   */
  it('should move a step from position in order', async () => {
    await RequestContext.createAsync(em, async () => {
      await service.create({
        boardId: board.id,
        description: 'Test Step Description',
        name: 'Test Step to move with position 3',
      });

      await service.create({
        boardId: board.id,
        description: 'Test Step Description',
        name: 'Test Step',
      });

      await service.create({
        boardId: board.id,
        description: 'Test Step Description',
        name: 'Test Step to move with position 1',
      });

      const stepFinished = await service.create({
        boardId: board.id,
        description: 'Test Step Description',
        name: 'Test Step',
      });

      await service.markAsFinished({
        boardId: board.id,
        stepId: stepFinished.id,
      });

      const steps = await em.find(BoardStepEntity, { board: board.id });

      expect(steps).toBeDefined();
      expect(steps.length).toBe(4);
      expect(steps[0].position).toBe(1);
      expect(steps[1].position).toBe(2);
      expect(steps[2].position).toBe(3);
      expect(steps[3].position).toBe(4);

      await service.move({
        boardId: board.id,
        position: 3,
        stepId: steps[0].id,
      });

      const stepsAfterMove = await em.find(BoardStepEntity, {
        board: board.id,
      });

      expect(stepsAfterMove).toBeDefined();

      const stepMoved = stepsAfterMove.find((step) => step.id === steps[0].id);

      expect(stepMoved).toBeDefined();
      expect(stepMoved!.position).toBe(3);

      const stepMoved2 = stepsAfterMove.find((step) => step.id === steps[2].id);
      expect(stepMoved2).toBeDefined();
      expect(stepMoved2!.position).toBe(1);
    });
  });

  /**
   * Test Case: Moving Step to Last Position Upon Finishing:
   * Validates that when a step is marked as finished, it is automatically moved to the last position in the order of steps.
   * This ensures that the UI or logical flow that leverages the step order will present or handle finished steps accurately.
   */
  it('should move the step to the last position if the step is marked as finished', async () => {
    await RequestContext.createAsync(em, async () => {
      const stepFinished = await service.create({
        boardId: board.id,
        description: 'This step should be moved to the last position',
        name: 'Test Step finished',
      });

      await service.create({
        boardId: board.id,
        description: 'Test Step Description',
        name: 'Test Step',
      });

      await service.create({
        boardId: board.id,
        description: 'Test Step Description',
        name: 'Test Step',
      });

      await service.create({
        boardId: board.id,
        description: 'Test Step Description',
        name: 'Test Step',
      });

      const steps = await em.find(BoardStepEntity, { board: board.id });
      expect(steps).toBeDefined();
      expect(steps.length).toBe(4);
      expect(steps[0].position).toBe(1);
      expect(steps[1].position).toBe(2);
      expect(steps[2].position).toBe(3);
      expect(steps[3].position).toBe(4);

      await service.markAsFinished({
        boardId: board.id,
        stepId: stepFinished.id,
      });

      const stepsAfterMove = await em.find(BoardStepEntity, {
        board: board.id,
      });

      expect(stepsAfterMove).toBeDefined();

      const stepMoved = stepsAfterMove.find(
        (step) => step.id === stepFinished.id,
      );

      expect(stepMoved).toBeDefined();
      expect(stepMoved!.position).toBe(4);

      const stepMoved2 = stepsAfterMove.find((step) => step.id === steps[3].id);
      expect(stepMoved2).toBeDefined();
      expect(stepMoved2!.position).toBe(1);
    });
  });

  /**
   * Test Case: Avoiding Unnecessary Movement Upon Finishing:
   * Ensures that marking a step as finished does not change its position if it is already in the last position.
   * This test case is crucial to avoid unnecessary database writes and ensure efficient operation,
   * especially in scenarios where the steps may not need to be re-ordered upon finishing.
   */
  it('should not move positions if the step marked as finished is already in the last position', async () => {
    await RequestContext.createAsync(em, async () => {
      await service.create({
        boardId: board.id,
        description: 'This step should be moved to the last position',
        name: 'Test Step finished',
      });

      const stepFinished = await service.create({
        boardId: board.id,
        description: 'Test Step Description',
        name: 'Test Step',
      });

      const steps = await em.find(BoardStepEntity, { board: board.id });
      expect(steps).toBeDefined();
      expect(steps.length).toBe(2);
      expect(steps[0].position).toBe(1);
      expect(steps[1].position).toBe(2);

      await service.markAsFinished({
        boardId: board.id,
        stepId: stepFinished.id,
      });

      const stepsAfterMove = await em.find(BoardStepEntity, {
        board: board.id,
      });

      expect(stepsAfterMove).toBeDefined();

      const stepMoved = stepsAfterMove.find(
        (step) => step.id === stepFinished.id,
      );

      expect(stepMoved).toBeDefined();
      expect(stepMoved!.position).toBe(2);

      const stepMoved2 = stepsAfterMove.find((step) => step.id === steps[0].id);
      expect(stepMoved2).toBeDefined();
      expect(stepMoved2!.position).toBe(1);
    });
  });
});
