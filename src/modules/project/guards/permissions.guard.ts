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

/**
 * Guard to check if the user has the required permissions to access a project.
 */
@Injectable()
export class ProjectPermissionsGuard implements CanActivate {
  /**
   * @param projectRepository An instance of EntityRepository<ProjectEntity> for interacting with the ProjectEntity database entity.
   * @param membersRepository An instance of EntityRepository<ProjectMembersEntity> for interacting with the ProjectMembersEntity database entity.
   * @param reflector An instance of Reflector from @nestjs/core, used to access metadata and decorators in the application.
   * @param _permissionsManager An instance of PermissionManagerService for managing and checking permissions for users.
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
   * Checks if the user has the required permissions to access the project.
   * @param context ExecutionContext containing the request context.
   * @returns Returns a boolean indicating whether the user has access.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const args: { projectId: string } = ctx.getArgs();
    const projectId = deepFindKey<string>(args, 'projectId');

    // Get the user payload from the request context.
    const userReq: JWTPayload = ctx.getContext().req.user;

    // Get the required permissions from the decorator.
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

    // If the project doesn't exist, user cannot access it.
    if (!project) return false;

    // If the user is the owner of the project, they have access.
    if (project.owner.id === userReq.sub) return true;

    // Check if this guard is ignored
    const isExcludeGuard = this.reflector.get(ExcludeGuards, ctx.getHandler());
    if (
      isExcludeGuard &&
      isExcludeGuard.some(
        (guard) => guard.name === ProjectPermissionsGuard.name,
      )
    ) {
      return true;
    }

    // Find the member associated with the user.
    const member = await this.membersRepository.findOne({
      user: userReq.sub,
    });

    // If the user is not a member, they can't access.
    if (!member)
      throw new ForbiddenException(
        'You are not a member or owner of the project to view it.',
      );

    // Load the count of roles associated with the project.
    const roles = await project.roles.loadCount();

    if (roles) {
      // Create an array of required permissions based on decorator.
      const requiredPermissions =
        this._permissionsManager.bulkAdd(requestPermissions);

      // Get the member's permissions.
      const memberPermissions = await member.permissions();

      // Check if the member has the required permissions.
      return memberPermissions.has(requiredPermissions.permissions);
    }

    throw new ForbiddenException(
      'Only the project owner can perform actions because there are no member roles available.',
    );
  }
}
