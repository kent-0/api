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

describe('Board - Step Unsuccessfully cases', async () => {
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

  it('should has error because the step to remove it doest not exist', async () => {
    await RequestContext.createAsync(em, async () => {
      expect(async () =>
        service.remove({
          boardId: board.id,
          stepId: '8054de11-b6dc-481e-a8c2-90cef8169914',
        }),
      ).rejects.toThrowError(
        'Could not find the step to remove from the board.',
      );
    });
  });

  it('should has error because the step to update it doest not exist', async () => {
    await RequestContext.createAsync(em, async () => {
      expect(async () =>
        service.update({
          boardId: board.id,
          name: 'Kento',
          stepId: '8054de11-b6dc-481e-a8c2-90cef8169914',
        }),
      ).rejects.toThrowError(
        'Could not find the step to update from the board.',
      );
    });
  });

  it('should has error because the step to mark as finished it doest not exist', async () => {
    await RequestContext.createAsync(em, async () => {
      expect(async () =>
        service.markAsFinished({
          boardId: board.id,
          stepId: '8054de11-b6dc-481e-a8c2-90cef8169914',
        }),
      ).rejects.toThrowError(
        'The step was not found on the board to mark as a finished step.',
      );
    });
  });

  it('should has error because not exist a column with this id', async () => {
    await RequestContext.createAsync(em, async () => {
      expect(async () =>
        service.move({
          boardId: board.id,
          position: 1,
          stepId: '8054de11-b6dc-481e-a8c2-90cef8169914',
        }),
      ).rejects.toThrowError('Could not find the step to move from the board.');
    });
  });

  it('should has error because the finished step cannot be moved', async () => {
    await RequestContext.createAsync(em, async () => {
      const step = await service.create({
        boardId: board.id,
        description: 'Kento testing step',
        name: 'Kento',
      });

      await service.markAsFinished({
        boardId: board.id,
        stepId: step.id,
      });

      expect(async () =>
        service.move({
          boardId: board.id,
          position: 1,
          stepId: step.id,
        }),
      ).rejects.toThrowError(
        'You are trying to move a column to the position of the finished column. This column cannot be moved.',
      );
    });
  });

  it('should has error because the step to move it doest not exist', async () => {
    await RequestContext.createAsync(em, async () => {
      expect(async () =>
        service.move({
          boardId: board.id,
          position: 1,
          stepId: '8054de11-b6dc-481e-a8c2-90cef8169914',
        }),
      ).rejects.toThrowError('Could not find the step to move from the board.');
    });
  });

  it('should has error because not exist a column in the position to be replaced', async () => {
    await RequestContext.createAsync(em, async () => {
      const step = await service.create({
        boardId: board.id,
        description: 'Kento testing step',
        name: 'Kento',
      });

      expect(async () =>
        service.move({
          boardId: board.id,
          position: 5,
          stepId: step.id,
        }),
      ).rejects.toThrowError(
        'You are trying to move the column to a position that is not on the board.',
      );
    });
  });
});
