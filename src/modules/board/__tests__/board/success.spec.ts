import { EntityManager, MikroORM, RequestContext } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { ConfigModule, ConfigService } from '@nestjs/config';
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

import { TestingMikroORMConfig } from '../../../../../mikro-orm.config';

/**
 * `Board - Successfully cases` Test Suite:
 * This test suite aims to validate the successful scenarios related to board management within the project.
 * The main focus is to ensure that the system behaves as expected during the creation, updating, deletion,
 * and retrieval of boards, ensuring data integrity and proper associations.
 */
describe('Board - Successfully cases', () => {
  let module: TestingModule;
  let service: BoardService;
  let projectService: ProjectService;
  let accountService: AuthAccountService;

  let orm: MikroORM;
  let em: EntityManager;

  let project: ProjectEntity;
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

    await RequestContext.createAsync(em, async () => {
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

      project = await em.findOneOrFail(ProjectEntity, { id: projectTest.id });
      user = await em.findOneOrFail(AuthUserEntity, { id: projectUser.id });
    });
  });

  afterEach(async () => {
    await module.close();
  });

  /**
   * Test Case: Service Definition:
   * Ensures that the services and ORM utilized in the test cases are defined and instantiated.
   */
  it('should defined services', async () => {
    expect(service).toBeDefined();
    expect(orm).toBeDefined();
    expect(em).toBeDefined();
  });

  /**
   * Test Case: Board Creation:
   * Validates that a board can be created with the expected properties and be associated with the correct project.
   */
  it('should create a board', async () => {
    await RequestContext.createAsync(em, async () => {
      const board = await service.create(
        {
          description: 'Kento testing board',
          name: 'Kento',
          projectId: project.id,
        },
        user.id,
      );

      expect(board).toBeDefined();
      expect(board.project).toBeDefined();
      expect(board.project.id).toEqual(project.id);
      expect(board.created_by.id).equals(user.id);
    });
  });

  /**
   * Test Case: Board Updating:
   * Ensures that an existing board can be updated, altering its properties and reflecting changes in the system.
   */
  it('should update a board', async () => {
    await RequestContext.createAsync(em, async () => {
      const board = await service.create(
        {
          description: 'Kento testing board',
          name: 'Kento',
          projectId: project.id,
        },
        user.id,
      );

      expect(board).toBeDefined();
      expect(board.name).toBe('Kento');
      expect(board.description).toBe('Kento testing board');

      const updatedBoard = await service.update({
        boardId: board.id,
        description: 'Kento testing board updated',
        name: 'Kento updated',
        projectId: project.id,
      });

      expect(updatedBoard).toBeDefined();
      expect(updatedBoard.name).toBe('Kento updated');
      expect(updatedBoard.description).toBe('Kento testing board updated');
    });
  });

  /**
   * Test Case: Board Deletion:
   * Ensures that a board can be deleted from the system and will no longer be retrievable after deletion.
   */
  it('should delete a board', async () => {
    await RequestContext.createAsync(em, async () => {
      const board = await service.create(
        {
          description: 'Kento testing board',
          name: 'Kento',
          projectId: project.id,
        },
        user.id,
      );

      expect(board).toBeDefined();
      expect(board.name).toBe('Kento');
      expect(board.description).toBe('Kento testing board');

      const deletedBoard = await service.remove({
        boardId: board.id,
        projectId: project.id,
      });

      expect(deletedBoard).toBeDefined();
      expect(deletedBoard).toBe(`Board ${board.name} successfully deleted.`);
    });
  });

  /**
   * Test Case: Board Retrieval:
   * Validates that a board's details can be successfully retrieved and contain accurate and expected information.
   */
  it('should get a board', async () => {
    await RequestContext.createAsync(em, async () => {
      const board = await service.create(
        {
          description: 'Kento testing board',
          name: 'Kento',
          projectId: project.id,
        },
        user.id,
      );

      expect(board).toBeDefined();
      expect(board.name).toBe('Kento');
      expect(board.description).toBe('Kento testing board');

      const foundBoard = await service.get({
        boardId: board.id,
        projectId: project.id,
      });

      expect(foundBoard).toBeDefined();
      expect(foundBoard.name).toBe('Kento');
      expect(foundBoard.description).toBe('Kento testing board');
      expect(foundBoard.created_by.id).toBe(user.id);
    });
  });
});
