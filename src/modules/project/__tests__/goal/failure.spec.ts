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

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { TestingMikroORMConfig } from '../../../../../mikro-orm.config';

/**
 * `Goals Unsuccessful Cases` Test Suite:
 * This test suite focuses on validating the unsuccessful scenarios related to project goals.
 * The primary goal is to ensure that the system correctly handles invalid operations or data
 * related to goals and provides expected outcomes.
 */
describe('Project - Goals unsuccessfully cases', async () => {
  let service: ProjectGoalService;
  let accountService: AuthAccountService;
  let projectMemberService: ProjectMemberService;
  let projectService: ProjectService;
  let module: TestingModule;
  let em: EntityManager;
  let orm: MikroORM;
  let project: ProjectEntity;

  /**
   * Before Each Setup:
   * This hook is executed before all the test cases in the suite. Its primary responsibilities include:
   * 1. Compiling and initializing the testing module.
   * 2. Instantiating services for testing.
   * 3. Setting up a clean database state and generating test data.
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
   * Cleanup after test are finished.
   */
  afterEach(async () => {
    await module.close();
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
        'The project goal you are trying to delete was not found.',
      );
    });
  });
});
