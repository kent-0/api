import { EntityManager, MikroORM, RequestContext } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { ConfigModule } from '@nestjs/config';
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
import { ProjectService } from '~/modules/project/services/project.service';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { TestingMikroORMConfig } from '../../../../../mikro-orm.config';

/**
 * `Board - Unsuccessfully cases` Test Suite:
 * This test suite aims to validate the unsuccessful scenarios related to board management within the project.
 * The main objective is to ensure that the system behaves as expected during invalid operations such as trying
 * to retrieve, update, or delete non-existent boards, maintaining data integrity and providing relevant error messages.
 */
describe('Board - Unsuccessfully cases', () => {
  let module: TestingModule;
  let service: BoardService;
  let projectService: ProjectService;
  let accountService: AuthAccountService;

  let orm: MikroORM;
  let em: EntityManager;

  let project: ProjectEntity;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath: '.env.test' }),
        MikroOrmModule.forRoot(TestingMikroORMConfig()),
        MikroOrmModule.forFeature({
          entities: [
            BoardEntity,
            BoardMembersEntity,
            ProjectEntity,
            ProjectMembersEntity,
            AuthUserEntity,
            AuthPasswordEntity,
            AuthTokensEntity,
            AuthEmailsEntity,
          ],
        }),
        AuthModule,
      ],
      providers: [BoardService, ProjectService],
    }).compile();

    service = module.get<BoardService>(BoardService);
    accountService = module.get<AuthAccountService>(AuthAccountService);
    projectService = module.get<ProjectService>(ProjectService);

    orm = module.get<MikroORM>(MikroORM);
    em = module.get<EntityManager>(EntityManager);

    await orm.getSchemaGenerator().refreshDatabase();

    await RequestContext.create(em, async () => {
      const projectUser = await accountService.signUp({
        email: 'sawa@acme.com',
        first_name: 'Sawa',
        last_name: 'Ko',
        password: 'sawako',
        username: 'sawako',
      });

      const projectTest = await projectService.create(
        {
          description: 'Kento testing project',
          name: 'Kento',
        },
        projectUser.id,
      );

      project = await em.findOneOrFail(ProjectEntity, { id: projectTest?.id });
    });
  });

  /**
   * Cleanup after test are finished.
   */
  afterEach(async () => {
    await module.close();
  });

  /**
   * Test Case: Board Retrieval Failure:
   * Validates that the system provides an appropriate error message when trying to retrieve a board that does not exist.
   */
  it('should has error because the board is not found', () => {
    RequestContext.create(em, async () => {
      expect(async () =>
        service.get({
          boardId: '30e8b06e-1542-4253-b88d-738d910bbe68',
          projectId: project.id,
        }),
      ).rejects.toThrowError(
        'The board you are trying to get could not be found.',
      );
    });
  });

  /**
   * Test Case: Board Deletion Failure:
   * Ensures that an error message is provided when attempting to delete a board that cannot be found in the system.
   */
  it('should has error because the board to delete is not found', () => {
    RequestContext.create(em, async () => {
      expect(async () =>
        service.remove({
          boardId: '30e8b06e-1542-4253-b88d-738d910bbe68',
          projectId: project.id,
        }),
      ).rejects.toThrowError(
        'The board you are trying to delete could not be found.',
      );
    });
  });

  /**
   * Test Case: Board Update Failure:
   * Validates that the system handles attempts to update non-existent boards by providing a relevant error message.
   */
  it('should has error because the board to update is not found', () => {
    RequestContext.create(em, async () => {
      expect(async () =>
        service.update({
          boardId: '30e8b06e-1542-4253-b88d-738d910bbe68',
          description: 'Kento testing board',
          name: 'Kento',
          projectId: project.id,
        }),
      ).rejects.toThrowError(
        'The board you are trying to update could not be found.',
      );
    });
  });

  /**
   * Test Case: Board Creation Failure:
   * Ensures that the system handles attempts to create boards in non-existent projects by providing a relevant error message.
   */
  it('should has error because the project to create the board is not found', () => {
    RequestContext.create(em, async () => {
      expect(async () =>
        service.create(
          {
            description: 'Kento testing board',
            name: 'Kento',
            projectId: '30e8b06e-1542-4253-b88d-738d910bbe68',
          },
          '30e8b06e-1542-4253-b88d-738d910bbe68',
        ),
      ).rejects.toThrowError(
        'The project you are trying to create a board for could not be found.',
      );
    });
  });
});
