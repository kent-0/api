import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

import { BoardEntity, BoardMembersEntity } from '~/database/entities';
import { JWTPayload } from '~/modules/auth/interfaces/jwt.interface';
import { BoardPermissions } from '~/permissions/decorators/request-permissions.decorator';
import { PermissionManagerService } from '~/permissions/services/manager.service';
import { ExcludeGuards } from '~/utils/decorators/exclude-guards.decorator';
import { deepFindKey } from '~/utils/functions/deep-find';

@Injectable()
export class BoardPermissionsGuard implements CanActivate {
  /**
   * Constructs the guard with necessary dependencies.
   */
  constructor(
    @InjectRepository(BoardEntity)
    private readonly boardRepository: EntityRepository<BoardEntity>,
    @InjectRepository(BoardMembersEntity)
    private readonly membersRepository: EntityRepository<BoardMembersEntity>,
    private reflector: Reflector,
    private _permissionsManager: PermissionManagerService,
  ) {}

  /**
   * Determines if the user can activate (or access) the route or resolver based on their permissions.
   *
   * @param context - The ExecutionContext instance, which provides metadata about the ongoing request.
   * @returns A boolean indicating whether the user can proceed (true) or not (false).
   */
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const args: { boardId: string } = ctx.getArgs();
    const boardId = deepFindKey<string>(args, 'boardId');

    // Extract the user payload from the incoming request.
    const userReq: JWTPayload = ctx.getContext().req.user;

    // Retrieve the permissions that are required for the current route or resolver.
    const requestPermissions = this.reflector.get(
      BoardPermissions,
      ctx.getHandler(),
    );

    // Determine if the current guard should be excluded for the route or resolver.
    const isExcludeGuard = this.reflector.get(ExcludeGuards, ctx.getHandler());
    if (
      isExcludeGuard &&
      isExcludeGuard.some((guard) => guard.name === BoardPermissionsGuard.name)
    ) {
      return true;
    }

    // Retrieve the board based on the provided boardId.
    const board = await this.boardRepository.findOne(
      {
        id: boardId,
      },
      {
        populate: ['project.owner.id'],
      },
    );

    // If the board doesn't exist, deny access.
    if (!board) throw new NotFoundException('The board does not exist.');

    // If the user is the board's owner, grant access.
    if (board.project.owner.id === userReq.sub) return true;

    // Find the board's associated member.
    const member = await this.membersRepository.findOne({
      user: userReq.sub,
    });

    // If the user isn't a member, deny access and provide a specific reason.
    if (!member) {
      throw new ForbiddenException(
        'You are not a member or owner of the board to view it.',
      );
    }

    // Retrieve the count of roles related to the board.
    const roles = await board.roles.loadCount();

    if (roles) {
      // Identify the permissions needed for the current route or resolver.
      const requiredPermissions =
        this._permissionsManager.bulkAdd(requestPermissions);

      // Fetch the member's permissions.
      const memberPermissions = await member.permissions();

      // Check if the member's permissions match the required permissions.
      return memberPermissions.has(requiredPermissions.permissions);
    }

    // If no roles are associated with the board, only the project can take actions.
    throw new ForbiddenException(
      'Only the project owner can perform actions because there are no member roles available.',
    );
  }
}
