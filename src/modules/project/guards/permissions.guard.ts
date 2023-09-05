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
import { ProjectPermissions } from '~/permissions/decorators/request-permissions.decorator';
import { PermissionManagerService } from '~/permissions/services/manager.service';
import { ExcludeGuards } from '~/utils/decorators/exclude-guards.decorator';
import { deepFindKey } from '~/utils/functions/deep-find';

@Injectable()
export class ProjectPermissionsGuard implements CanActivate {
  /**
   * Constructs the guard with necessary dependencies.
   */
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: EntityRepository<ProjectEntity>,
    @InjectRepository(ProjectMembersEntity)
    private readonly membersRepository: EntityRepository<ProjectMembersEntity>,
    private reflector: Reflector,
    private _permissionsManager: PermissionManagerService,
  ) {}

  /**
   * Determines if the user can activate (or access) the route or resolver based on their permissions.
   *
   * @param context - The ExecutionContext instance, which provides metadata about the ongoing request.
   * @returns A boolean indicating whether the user can proceed (true) or not (false).
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const args: { projectId: string } = ctx.getArgs();
    const projectId = deepFindKey<string>(args, 'projectId');

    // Extract the user payload from the incoming request.
    const userReq: JWTPayload = ctx.getContext().req.user;

    // Retrieve the permissions that are required for the current route or resolver.
    const requestPermissions = this.reflector.get(
      ProjectPermissions,
      ctx.getHandler(),
    );

    // Retrieve the project based on the provided projectId.
    const project = await this.projectRepository.findOne(
      {
        id: projectId,
      },
      {
        populate: ['owner'],
      },
    );

    // If the project doesn't exist, deny access.
    if (!project) return false;

    // If the user is the project's owner, grant access.
    if (project.owner.id === userReq.sub) return true;

    // Determine if the current guard should be excluded for the route or resolver.
    const isExcludeGuard = this.reflector.get(ExcludeGuards, ctx.getHandler());
    if (
      isExcludeGuard &&
      isExcludeGuard.some(
        (guard) => guard.name === ProjectPermissionsGuard.name,
      )
    ) {
      return true;
    }

    // Find the project's associated member.
    const member = await this.membersRepository.findOne({
      user: userReq.sub,
    });

    // If the user isn't a member, deny access and provide a specific reason.
    if (!member)
      throw new ForbiddenException(
        'You are not a member or owner of the project to view it.',
      );

    // Retrieve the count of roles related to the project.
    const roles = await project.roles.loadCount();

    if (roles) {
      // Identify the permissions needed for the current route or resolver.
      const requiredPermissions =
        this._permissionsManager.bulkAdd(requestPermissions);

      // Fetch the member's permissions.
      const memberPermissions = await member.permissions();

      // Check if the member's permissions match the required permissions.
      return memberPermissions.has(requiredPermissions.permissions);
    }

    // If no roles are associated with the project, only the owner can take actions.
    throw new ForbiddenException(
      'Only the project owner can perform actions because there are no member roles available.',
    );
  }
}
