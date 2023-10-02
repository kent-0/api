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
  ProjectMembersEntity,
  ProjectNotesEntity,
} from '~/database/entities';
import { AuthModule } from '~/modules/auth/auth.module';
import { AuthAccountService } from '~/modules/auth/services/account.service';
import { ProjectNoteService } from '~/modules/project/services/note.service';
import { ProjectService } from '~/modules/project/services/project.service';

import { TestingMikroORMConfig } from '../../../../mikro-orm.config';

/**
 * `Notes Successful Cases` Test Suite:
 * This test suite focuses on validating the successful scenarios related to project notes.
 * The primary note is to ensure that the system correctly handles valid operations or data
 * related to notes and provides expected outcomes.
 */
describe('Notes successfully cases', async () => {
  let service: ProjectNoteService;
  let accountService: AuthAccountService;
  let projectService: ProjectService;
  let module: TestingModule;
  let em: EntityManager;
  let orm: MikroORM;
  let project: ProjectEntity;
  let user: AuthUserEntity;

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
            ProjectNotesEntity,
          ],
        }),
        AuthModule,
      ],
      providers: [ProjectNoteService, ProjectService],
    }).compile();

    service = module.get<ProjectNoteService>(ProjectNoteService);
    orm = module.get<MikroORM>(MikroORM);
    em = module.get<EntityManager>(EntityManager);
    accountService = module.get<AuthAccountService>(AuthAccountService);
    projectService = module.get<ProjectService>(ProjectService);

    await orm.getSchemaGenerator().refreshDatabase();

    await RequestContext.createAsync(em, async () => {
      const userTest = await accountService.signUp({
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
        userTest.id,
      );

      project = await em.findOneOrFail(ProjectEntity, { id: projectTest.id });
      user = await em.findOneOrFail(AuthUserEntity, { id: userTest.id });
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
   * Test Case: Note Creation:
   * Validates that a new note can be successfully created.
   */
  it('should create a note', async () => {
    await RequestContext.createAsync(em, async () => {
      const note = await service.create(
        {
          content: 'Kento testing note',
          projectId: project.id,
          title: 'Kento',
        },
        user.id,
      );

      expect(note).toBeDefined();
      expect(note.id).toBeDefined();
      expect(note.content).toEqual('Kento testing note');
      expect(note.title).toEqual('Kento');
      expect(note.created_by.id).toEqual(user.id);
    });
  });

  /**
   * Test Case: Note Update:
   * Validates that an existing note can be successfully updated with new details.
   * Expected Outcome:
   * - The note entity should reflect the new details after the update.
   */
  it('should update a note', async () => {
    await RequestContext.createAsync(em, async () => {
      const note = await service.create(
        {
          content: 'Kento testing project',
          projectId: project.id,
          title: 'Kento',
        },
        user.id,
      );

      const updatedNote = await service.update(
        {
          content: 'Kento testing note updated',
          noteId: note.id,
          projectId: project.id,
          title: 'Kento updated',
        },
        user.id,
      );

      expect(updatedNote).toBeDefined();
      expect(updatedNote.id).toBeDefined();
      expect(updatedNote.content).toEqual('Kento testing note updated');
      expect(updatedNote.title).toEqual('Kento updated');
      expect(updatedNote.created_by.id).toEqual(user.id);
    });
  });

  /**
   * Test Case: Note Deletion:
   * Validates that an existing note can be successfully deleted from a project.
   * Expected Outcome:
   * - The note entity should no longer exist in the database.
   * - A confirmation message should be returned indicating successful deletion.
   */
  it('should delete a note', async () => {
    await RequestContext.createAsync(em, async () => {
      const note = await service.create(
        {
          content: 'Kento testing project',
          projectId: project.id,
          title: 'Kento',
        },
        user.id,
      );

      const deletedNote = await service.delete(
        {
          noteId: note.id,
          projectId: project.id,
        },
        user.id,
      );

      expect(deletedNote).toBe('The note has been successfully removed.');
    });
  });
});

/**
 * `Notes Unsuccessful Cases` Test Suite:
 * This test suite focuses on validating the unsuccessful scenarios related to project notes.
 * The primary note is to ensure that the system correctly handles invalid operations or data
 * related to notes and provides expected outcomes.
 */
describe('Notes unsuccessfully cases', async () => {
  let service: ProjectNoteService;
  let accountService: AuthAccountService;
  let projectService: ProjectService;
  let module: TestingModule;
  let em: EntityManager;
  let orm: MikroORM;
  let project: ProjectEntity;
  let user: AuthUserEntity;

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
            ProjectNotesEntity,
          ],
        }),
        AuthModule,
      ],
      providers: [ProjectNoteService, ProjectService],
    }).compile();

    service = module.get<ProjectNoteService>(ProjectNoteService);
    orm = module.get<MikroORM>(MikroORM);
    em = module.get<EntityManager>(EntityManager);
    accountService = module.get<AuthAccountService>(AuthAccountService);
    projectService = module.get<ProjectService>(ProjectService);

    await orm.getSchemaGenerator().refreshDatabase();

    await RequestContext.createAsync(em, async () => {
      const userTest = await accountService.signUp({
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
        userTest.id,
      );

      project = await em.findOneOrFail(ProjectEntity, { id: projectTest.id });
      user = await em.findOneOrFail(AuthUserEntity, { id: userTest.id });
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
   * Test Case: Note Update:
   * Validates that a note cannot be updated if the note does not exist.
   */
  it('should not update a note if the note does not exist', async () => {
    await RequestContext.createAsync(em, async () => {
      await expect(
        service.update(
          {
            content: 'Kento testing note',
            noteId: '8054de11-b6dc-481e-a8c2-90cef8169914',
            projectId: project.id,
            title: 'Kento',
          },
          user.id,
        ),
      ).rejects.toThrowError(
        'The project note you are trying to update could not be found.',
      );
    });
  });

  /**
   * Test Case: Note Deletion:
   * Validates that a note cannot be deleted if the note does not exist.
   */
  it('should not delete a note if the note does not exist', async () => {
    await RequestContext.createAsync(em, async () => {
      await expect(
        service.delete(
          {
            noteId: '8054de11-b6dc-481e-a8c2-90cef8169914',
            projectId: project.id,
          },
          user.id,
        ),
      ).rejects.toThrowError(
        'The project note you are trying to delete was not found.',
      );
    });
  });
});
