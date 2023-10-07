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
  ProjectNotesEntity,
  ProjectRolesEntity,
} from '~/database/entities';
import { AuthModule } from '~/modules/auth/auth.module';
import { AuthAccountService } from '~/modules/auth/services/account.service';
import { AuthPasswordService } from '~/modules/auth/services/password.service';
import { ProjectService } from '~/modules/project/services/project.service';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { TestingMikroORMConfig } from '../../../../../mikro-orm.config';

/**
 * Test suite for the Project Management functionalities.
 *
 * This suite ensures that the core project management operations are functioning as expected,
 * covering operations like creation, retrieval, update, and deletion of projects.
 */
describe('Project successfully cases', () => {
  let service: ProjectService;
  let accountService: AuthAccountService;
  let em: EntityManager;
  let orm: MikroORM;
  let module: TestingModule;
  let user: AuthUserEntity;

  /**
   * Setup for each test.
   * Initializes the necessary modules, services, and database configuration.
   * Refreshes the database to ensure each tests starts with a clean state.
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
            ProjectEntity,
            ProjectMembersEntity,
            ProjectRolesEntity,
            ProjectGoalsEntity,
            ProjectNotesEntity,
            AuthUserEntity,
            AuthPasswordEntity,
            AuthTokensEntity,
            AuthEmailsEntity,
          ],
        }),
        AuthModule,
      ],
      providers: [ProjectService, AuthAccountService, AuthPasswordService],
    }).compile();

    accountService = module.get<AuthAccountService>(AuthAccountService);
    service = module.get<ProjectService>(ProjectService);
    orm = module.get<MikroORM>(MikroORM);
    em = module.get<EntityManager>(EntityManager);

    await orm.getSchemaGenerator().refreshDatabase();

    await RequestContext.createAsync(em, async () => {
      const userTest = await accountService.signUp({
        email: 'sawa@acme.com',
        first_name: 'Sawa',
        last_name: 'Ko',
        password: 'sawako',
        username: 'sawako',
      });

      user = await em.findOneOrFail(AuthUserEntity, { id: userTest.id });
    });
  });

  /**
   * Cleanup after test are finished.
   */
  afterEach(async () => {
    await module.close();
  });

  /**
   * Ensures a project can be created with the given details.
   *
   * The test checks the following:
   * - The project is created successfully.
   * - The returned project object has the expected properties.
   * - The owner of the project matches the authenticated user.
   */
  it('should create a project', async () => {
    await RequestContext.createAsync(em, async () => {
      const project = await service.create(
        {
          description: 'Test Project Description',
          name: 'Test Project',
        },
        user.id,
      );

      expect(project).toBeDefined();
      expect(project.id).toBeDefined();
      expect(project.owner).toMatchObject({
        biography: null,
        fullName: user.fullName,
        id: user.id,
        username: user.username,
      });
    });
  });

  /**
   * Verifies that a project can be deleted successfully.
   *
   * The test checks the following:
   * - The project is initially created and exists.
   * - The project is deleted successfully.
   * - Retrieving the deleted project returns a null or throws an error.
   */
  it('should delete a project', async () => {
    await RequestContext.createAsync(em, async () => {
      const project = await service.create(
        {
          description: 'Test Project Description',
          name: 'Test Project',
        },
        user.id,
      );

      expect(project).toBeDefined();
      expect(project.id).toBeDefined();

      const result = await service.delete(project.id, user.id);
      expect(result).toBe('The project has been successfully removed.');

      const deletedProject = await em.findOne(ProjectEntity, {
        id: project.id,
      });

      expect(deletedProject).toBeNull();
    });
  });

  /**
   * Validates that a project, once created, can be retrieved along with its relations.
   *
   * The test ensures:
   * - The project exists in the database after creation.
   * - Retrieving the project brings along its related data (e.g., owner).
   */
  it('should get a project with relations', async () => {
    await RequestContext.createAsync(em, async () => {
      const project = await service.create(
        {
          description: 'Test Project Description',
          name: 'Test Project',
        },
        user.id,
      );

      expect(project).toBeDefined();
      expect(project.id).toBeDefined();

      const result = await service.get(project.id);
      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.owner).toMatchObject({
        biography: null,
        fullName: user.fullName,
        id: user.id,
        username: user.username,
      });
    });
  });

  /**
   * Confirms that specific properties of a project can be updated.
   *
   * The test checks:
   * - The initial state of the project.
   * - The update operation returns a success response.
   * - The properties of the project are updated in the database.
   */
  it('should upddate a project with relations', async () => {
    await RequestContext.createAsync(em, async () => {
      const project = await service.create(
        {
          description: 'Test Project Description',
          name: 'Test Project',
        },
        user.id,
      );

      expect(project).toBeDefined();
      expect(project.id).toBeDefined();
      expect(project.description).toBe('Test Project Description');

      const result = await service.update({
        description: 'Updated description',
        projectId: project.id,
      });

      expect(result.name).toBe('Test Project');
      expect(result.description).toBe('Updated description');
      expect(result.owner.id).toBe(user.id);
    });
  });
});
