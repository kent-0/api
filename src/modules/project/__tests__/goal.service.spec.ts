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
  ProjectEntity,
  ProjectGoalsEntity,
  ProjectMembersEntity,
} from '~/database/entities';
import { AuthModule } from '~/modules/auth/auth.module';
import { AuthAccountService } from '~/modules/auth/services/account.service';
import { ProjectGoalService } from '~/modules/project/services/goal.service';
import { ProjectMemberService } from '~/modules/project/services/member.service';
import { ProjectService } from '~/modules/project/services/project.service';

import { TestingMikroORMConfig } from '../../../../mikro-orm.config';

/**
 * `Goals Successful Cases` Test Suite:
 * This test suite focuses on validating the successful scenarios related to project goals.
 * The primary goal is to ensure that the system correctly handles valid operations or data
 * related to goals and provides expected outcomes.
 */
describe('Goals successfully cases', async () => {
  let service: ProjectGoalService;
  let accountService: AuthAccountService;
  let projectMemberService: ProjectMemberService;
  let projectService: ProjectService;
  let module: TestingModule;
  let em: EntityManager;
  let orm: MikroORM;
  let project: ProjectEntity;

  /**
   * Before All Setup:
   * This hook is executed before all the test cases in the suite. Its primary responsibilities include:
   * 1. Compiling and initializing the testing module.
   * 2. Instantiating services for testing.
   * 3. Setting up a clean database state and generating test data.
   */
  beforeAll(async () => {
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
            ProjectMembersEntity,
            AuthUserEntity,
            AuthPasswordEntity,
            AuthTokensEntity,
            AuthEmailsEntity,
            ProjectEntity,
            ProjectGoalsEntity,
          ],
        }),
        AuthModule,
      ],
      providers: [ProjectGoalService, ProjectMemberService, ProjectService],
    }).compile();

    service = module.get<ProjectGoalService>(ProjectGoalService);
    orm = module.get<MikroORM>(MikroORM);
    em = module.get<EntityManager>(EntityManager);
    accountService = module.get<AuthAccountService>(AuthAccountService);
    projectService = module.get<ProjectService>(ProjectService);
    projectMemberService =
      module.get<ProjectMemberService>(ProjectMemberService);

    await orm.getSchemaGenerator().refreshDatabase();

    await RequestContext.createAsync(em, async () => {
      const userProjectOwner = await accountService.signUp({
        email: 'sawa@acme.com',
        first_name: 'Sawa',
        last_name: 'Ko',
        password: 'sawako',
        username: 'sawako',
      });

      const userMemberTest = await accountService.signUp({
        email: 'sawa2@acme.com',
        first_name: 'Sawa',
        last_name: 'Ko',
        password: 'sawako',
        username: 'sawako2',
      });

      const projectTest = await projectService.create(
        {
          description: 'Kento testing project',
          name: 'Kento',
        },
        userProjectOwner.id,
      );

      project = await em.findOneOrFail(ProjectEntity, { id: projectTest.id });

      await projectMemberService.add({
        projectId: project.id,
        userId: userMemberTest.id,
      });
    });
  });

  /**
   * After All Setup:
   * This hook is executed after all the test cases in the suite. Its primary responsibilities include:
   */
  afterAll(async () => {
    await orm.close(true);
  });

  /**
   * After All Cleanup:
   * This hook is executed after all the test cases. It ensures that resources are cleaned up
   * and connections are closed to prevent any potential resource leaks.
   */
  it('should create a goal', async () => {
    await RequestContext.createAsync(em, async () => {
      const goal = await service.create({
        description: 'Kento testing goal',
        name: 'Kento',
        projectId: project.id,
      });

      expect(goal).toBeDefined();
      expect(goal.id).toBeDefined();
      expect(goal.description).toEqual('Kento testing goal');
      expect(goal.name).toEqual('Kento');
    });
  });

  /**
   * Test Case: Goal Update:
   * Validates that an existing goal can be successfully updated with new details.
   * Expected Outcome:
   * - The goal entity should reflect the new details after the update.
   */
  it('should update a goal', async () => {
    await RequestContext.createAsync(em, async () => {
      const goal = await service.create({
        description: 'Kento testing goal',
        name: 'Kento',
        projectId: project.id,
      });

      const updatedGoal = await service.update({
        description: 'Kento testing goal updated',
        goalId: goal.id,
        name: 'Kento updated',
        projectId: project.id,
      });

      expect(updatedGoal).toBeDefined();
      expect(updatedGoal.id).toBeDefined();
      expect(updatedGoal.description).toEqual('Kento testing goal updated');
      expect(updatedGoal.name).toEqual('Kento updated');
    });
  });

  /**
   * Test Case: Goal Deletion:
   * Validates that an existing goal can be successfully deleted from a project.
   * Expected Outcome:
   * - The goal entity should no longer exist in the database.
   * - A confirmation message should be returned indicating successful deletion.
   */
  it('should delete a goal', async () => {
    await RequestContext.createAsync(em, async () => {
      const goal = await service.create({
        description: 'Kento testing goal',
        name: 'Kento',
        projectId: project.id,
      });

      const deletedGoal = await service.delete({
        goalId: goal.id,
        projectId: project.id,
      });

      expect(deletedGoal).toBe('The goal has been successfully removed.');
    });
  });
});

/**
 * `Goals Unsuccessful Cases` Test Suite:
 * This test suite focuses on validating the unsuccessful scenarios related to project goals.
 * The primary goal is to ensure that the system correctly handles invalid operations or data
 * related to goals and provides expected outcomes.
 */
describe('Goals unsuccessfully cases', async () => {
  let service: ProjectGoalService;
  let accountService: AuthAccountService;
  let projectMemberService: ProjectMemberService;
  let projectService: ProjectService;
  let module: TestingModule;
  let em: EntityManager;
  let orm: MikroORM;
  let project: ProjectEntity;

  /**
   * Before All Setup:
   * This hook is executed before all the test cases in the suite. Its primary responsibilities include:
   * 1. Compiling and initializing the testing module.
   * 2. Instantiating services for testing.
   * 3. Setting up a clean database state and generating test data.
   */
  beforeAll(async () => {
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
            ProjectMembersEntity,
            AuthUserEntity,
            AuthPasswordEntity,
            AuthTokensEntity,
            AuthEmailsEntity,
            ProjectEntity,
            ProjectGoalsEntity,
          ],
        }),
        AuthModule,
      ],
      providers: [ProjectGoalService, ProjectMemberService, ProjectService],
    }).compile();

    service = module.get<ProjectGoalService>(ProjectGoalService);
    orm = module.get<MikroORM>(MikroORM);
    em = module.get<EntityManager>(EntityManager);
    accountService = module.get<AuthAccountService>(AuthAccountService);
    projectService = module.get<ProjectService>(ProjectService);
    projectMemberService =
      module.get<ProjectMemberService>(ProjectMemberService);

    await orm.getSchemaGenerator().refreshDatabase();

    await RequestContext.createAsync(em, async () => {
      const userProjectOwner = await accountService.signUp({
        email: 'sawa@acme.com',
        first_name: 'Sawa',
        last_name: 'Ko',
        password: 'sawako',
        username: 'sawako',
      });

      const userMemberTest = await accountService.signUp({
        email: 'sawa2@acme.com',
        first_name: 'Sawa',
        last_name: 'Ko',
        password: 'sawako',
        username: 'sawako2',
      });

      const projectTest = await projectService.create(
        {
          description: 'Kento testing project',
          name: 'Kento',
        },
        userProjectOwner.id,
      );

      project = await em.findOneOrFail(ProjectEntity, { id: projectTest.id });

      await projectMemberService.add({
        projectId: project.id,
        userId: userMemberTest.id,
      });
    });
  });

  /**
   * After All Setup:
   * This hook is executed after all the test cases in the suite. Its primary responsibilities include:
   */
  afterAll(async () => {
    await orm.close(true);
  });

  /**
   * Test Case: Goal Update:
   * Validates that a goal cannot be updated if the goal does not exist.
   */
  it('should not update a goal if the goal does not exist', async () => {
    await RequestContext.createAsync(em, async () => {
      await expect(
        service.update({
          description: 'Kento testing goal',
          goalId: '8054de11-b6dc-481e-a8c2-90cef8169914',
          name: 'Kento',
          projectId: project.id,
        }),
      ).rejects.toThrowError(
        'The project goal you are trying to update could not be found.',
      );
    });
  });

  /**
   * Test Case: Goal Deletion:
   * Validates that a goal cannot be deleted if the goal does not exist.
   */
  it('should not delete a goal if the goal does not exist', async () => {
    await RequestContext.createAsync(em, async () => {
      await expect(
        service.delete({
          goalId: '8054de11-b6dc-481e-a8c2-90cef8169914',
          projectId: project.id,
        }),
      ).rejects.toThrowError(
        'The project goal you are trying to delete could not be found.',
      );
    });
  });
});
