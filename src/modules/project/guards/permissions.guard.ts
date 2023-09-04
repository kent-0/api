import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

import { ProjectEntity, ProjectMembersEntity } from '~/database/entities';
import { JWTPayload } from '~/modules/auth/interfaces/jwt.interface';
import { RequestPermissions } from '~/permissions/decorators/request-permissions.decorator';
import { PermissionManagerService } from '~/permissions/services/manager.service';

interface Args {
  projectId: string;
}

@Injectable()
export class ProjectPermissionsGuard implements CanActivate {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: EntityRepository<ProjectEntity>,
    @InjectRepository(ProjectMembersEntity)
    private readonly membersRepository: EntityRepository<ProjectMembersEntity>,
    private reflector: Reflector,
    private _permissionsManager: PermissionManagerService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const args: Args = ctx.getArgs();
    const userReq: JWTPayload = ctx.getContext().req.user;
    const requiredPermissions = this.reflector.get(
      RequestPermissions,
      ctx.getHandler(),
    );

    const permissionsRequired =
      this._permissionsManager.bulkAdd(requiredPermissions);

    const project = await this.projectRepository.findOne(
      {
        id: args.projectId,
      },
      {
        populate: ['owner'],
      },
    );

    if (!project) return false;
    if (project.owner.id === userReq.sub) return true;

    const member = await this.membersRepository.findOne({
      user: userReq.sub,
    });

    if (!member)
      throw new ForbiddenException(
        'You are not a member or owner of the project to view it.',
      );

    const roles = await project.roles.loadCount();
    if (roles) {
      const memberPermissions = await member.permissions();
      return memberPermissions.has(permissionsRequired.permissions);
    }

    throw new ForbiddenException(
      'Only the project owner can perform actions because there are no member roles available.',
    );
  }
}
