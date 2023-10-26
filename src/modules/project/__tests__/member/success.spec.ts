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
import { PermissionManagerService } from '~/permissions/services/manager.service';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { TestingMikroORMConfig } from '../../../../../mikro-orm.config';

/**
 * `Member successfully cases` Test Suite:
 * This test suite focuses on validating successful scenarios related to project members.
 * The primary goal is to ensure that the system correctly handles member-related operations and
 * gives the desired results under valid conditions.
 */
describe('Project - Member successfuly cases', () => {
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
   * Cleanup after test are finished.
   */
  afterEach(async () => {
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
      const member = await service.add({
        projectId: project.id,
        userId: userMember.id,
      });

      expect(member.user.id).toBe(userMember.id);
      expect(member.project.id).toEqual(project.id);

      const result = await service.remove({
        projectId: project.id,
        userId: userMember.id,
      });

      expect(result).toBe(
        'The user was successfully removed from the project members.',
      );
    });
  });

  /**
   * Test Case: Getting a Member's Permissions:
   * Check the current user role and permissions for a project.
   */
  it('should get user member permissions', async () => {
    await RequestContext.createAsync(orm.em, async () => {
      const member = await service.add({
        projectId: project.id,
        userId: userMember.id,
      });

      const memberPermissions = await member.permissions();

      expect(member.user.id).toBe(userMember.id);
      expect(member.project.id).toEqual(project.id);
      expect(member.permissions()).toBeDefined();
      expect(memberPermissions).toBeInstanceOf(PermissionManagerService);
      expect(memberPermissions.permissions).toBeTypeOf('number');
    });
  });
});
