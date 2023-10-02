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
} from '~/database/entities';
import { AuthModule } from '~/modules/auth/auth.module';
import { AuthAccountService } from '~/modules/auth/services/account.service';
import { ProjectMemberService } from '~/modules/project/services/member.service';
import { ProjectService } from '~/modules/project/services/project.service';

import { TestingMikroORMConfig } from '../../../../mikro-orm.config';

/**
 * `Member successfully cases` Test Suite:
 * This test suite focuses on validating successful scenarios related to project members.
 * The primary goal is to ensure that the system correctly handles member-related operations and
 * gives the desired results under valid conditions.
 */
describe('Member successfuly cases', () => {
  let service: ProjectMemberService;
  let accountService: AuthAccountService;
  let projectService: ProjectService;
  let module: TestingModule;
  let em: EntityManager;
  let orm: MikroORM;
  let project: ProjectEntity;
  let userProjectOwner: AuthUserEntity;
  let userMember: AuthUserEntity;

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
          ],
        }),
        AuthModule,
      ],
      providers: [ProjectMemberService, ProjectService],
    }).compile();

    // After the module is compiled, retrieve and initialize the required services and modules.
    service = module.get<ProjectMemberService>(ProjectMemberService);
    orm = module.get<MikroORM>(MikroORM);
    em = module.get<EntityManager>(EntityManager);
    accountService = module.get<AuthAccountService>(AuthAccountService);
    projectService = module.get<ProjectService>(ProjectService);

    // Database setup: Refresh the database to ensure a clean state before tests.
    await orm.getSchemaGenerator().refreshDatabase();

    // Create test users and a project, which will be used in the subsequent tests.
    await RequestContext.createAsync(em, async () => {
      const userTest = await accountService.signUp({
        email: 'sawa@acme.com',
        first_name: 'Sawa',
        last_name: 'Ko',
        password: 'sawako',
        username: 'sawako',
      });

      userProjectOwner = await em.findOneOrFail(AuthUserEntity, {
        id: userTest.id,
      });

      const userTest2 = await accountService.signUp({
        email: 'sawa2@acme.com',
        first_name: 'Sawa',
        last_name: 'Ko',
        password: 'sawako',
        username: 'sawako2',
      });

      userMember = await em.findOneOrFail(AuthUserEntity, { id: userTest2.id });
    });

    await RequestContext.createAsync(em, async () => {
      const projectTest = await projectService.create(
        {
          description: 'Kento testing project',
          name: 'Kento',
        },
        userProjectOwner.id,
      );

      project = await em.findOneOrFail(ProjectEntity, { id: projectTest.id });
    });
  });

  /**
   * After All Cleanup:
   * This hook is executed after all the test cases. It is responsible for cleaning up resources,
   * such as closing the database connections.
   */
  afterAll(async () => {
    await module.close();
  });

  /**
   * Sanity Check:
   * This test ensures that the required services are properly initialized and are available for testing.
   */
  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(accountService).toBeDefined();
  });

  /**
   * Test Case: Adding a Member:
   * Validates that a userProjectOwner can be successfully added as a member to a project.
   * The system should acknowledge the addition and reflect it in the returned results.
   */
  it('should add a member to a project', async () => {
    await RequestContext.createAsync(orm.em, async () => {
      const member = await service.add({
        projectId: project.id,
        userId: userMember.id,
      });

      expect(member.user.id).toBe(userMember.id);
      expect(member.project.id).toEqual(project.id);
    });
  });

  /**
   * Test Case: Removing a Member:
   * Checks that a userProjectOwner, who is a member of a project, can be removed successfully.
   * The system should acknowledge the removal and provide a confirmation message.
   */
  it('should remove a member to a project', async () => {
    await RequestContext.createAsync(orm.em, async () => {
      const result = await service.remove({
        projectId: project.id,
        userId: userMember.id,
      });

      expect(result).toBe(
        'The user was successfully removed from the project members.',
      );
    });
  });
});

/**
 * `Member unsuccessfully cases` Test Suite:
 * This test suite is focused on scenarios where operations related to project members are expected to fail.
 * The purpose is to ensure that the system correctly handles and responds to incorrect or invalid operations.
 */
describe('Member unsuccessfully cases', () => {
  let service: ProjectMemberService;
  let accountService: AuthAccountService;
  let projectService: ProjectService;
  let module: TestingModule;
  let em: EntityManager;
  let orm: MikroORM;
  let project: ProjectEntity;
  let user: AuthUserEntity;
  let user2: AuthUserEntity;

  /**
   * Before All Setup:
   * This hook runs before all test cases in this suite. It's responsible for:
   * 1. Setting up the testing module.
   * 2. Initializing service instances.
   * 3. Setting up the test data.
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
          ],
        }),
        AuthModule,
      ],
      providers: [ProjectMemberService, ProjectService],
    }).compile();

    // After the module is compiled, retrieve and initialize the required services and modules.
    service = module.get<ProjectMemberService>(ProjectMemberService);
    orm = module.get<MikroORM>(MikroORM);
    em = module.get<EntityManager>(EntityManager);
    accountService = module.get<AuthAccountService>(AuthAccountService);
    projectService = module.get<ProjectService>(ProjectService);

    // Database setup: Refresh the database to ensure a clean state before tests.
    await orm.getSchemaGenerator().refreshDatabase();

    // Create test users and a project, which will be used in the subsequent tests.
    await RequestContext.createAsync(em, async () => {
      const userTest = await accountService.signUp({
        email: 'sawa@acme.com',
        first_name: 'Sawa',
        last_name: 'Ko',
        password: 'sawako',
        username: 'sawako',
      });

      user = await em.findOneOrFail(AuthUserEntity, { id: userTest.id });

      const userTest2 = await accountService.signUp({
        email: 'sawa2@acme.com',
        first_name: 'Sawa',
        last_name: 'Ko',
        password: 'sawako',
        username: 'sawako2',
      });

      user2 = await em.findOneOrFail(AuthUserEntity, { id: userTest2.id });
    });

    await RequestContext.createAsync(em, async () => {
      const projectTest = await projectService.create(
        {
          description: 'Kento testing project',
          name: 'Kento',
        },
        user.id,
      );

      project = await em.findOneOrFail(ProjectEntity, { id: projectTest.id });
    });
  });

  /**
   * After All Cleanup:
   * This hook runs after all test cases have been executed. It performs cleanup operations
   * like closing connections, freeing resources, etc.
   */
  afterAll(async () => {
    await module.close();
  });

  /**
   * Sanity Check:
   * Ensure that the services required for these tests have been properly initialized.
   */
  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(accountService).toBeDefined();
  });

  /**
   * Test Case: Adding an Existing Member:
   * This test ensures that a user who is already a member of a project cannot be added again.
   * The system should recognize this and throw an appropriate error.
   */
  it('should not be able to add a user who is a member of the project', async () => {
    await RequestContext.createAsync(orm.em, async () => {
      expect(
        async () =>
          await service.add({
            projectId: project.id,
            userId: user.id,
          }),
      ).rejects.toThrowError('This user is already a member of the project.');
    });
  });

  /**
   * Test Case: Removing a Non-member:
   * This test checks the scenario where there's an attempt to remove a user who isn't a member of the project.
   * The system should recognize this situation and throw an appropriate error.
   */
  it('should not be able to remove a user who is not a member of the project', async () => {
    await RequestContext.createAsync(orm.em, async () => {
      expect(
        async () =>
          await service.remove({
            projectId: project.id,
            userId: user2.id,
          }),
      ).rejects.toThrowError('The user is not a member of the project.');
    });
  });

  /**
   * Test Case: Removing Project Creator:
   * A project's creator (or owner) should not be removable from the project.
   * This test checks this constraint and ensures that the system throws an error if such an attempt is made.
   */
  it('should not be able to remove the creator of the project as a member of the project.', async () => {
    await RequestContext.createAsync(orm.em, async () => {
      expect(
        async () =>
          await service.remove({
            projectId: project.id,
            userId: user.id,
          }),
      ).rejects.toThrowError(
        'You cannot remove the project member who acts as the project owner.',
      );
    });
  });
});
