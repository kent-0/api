import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { UserToken } from '../decorators/user.decorator';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { AuthUpdateAccountInput } from '../inputs/account/update.input';
import { JWTPayload } from '../interfaces/jwt.interface';
import { AuthUserObject } from '../objects';
import { AuthAccountService } from '../services/account.service';

/**
 * Resolver class for handling authentication related operations.
 * Allows users to view and update their account details.
 */
@Resolver()
@UsePipes(ValidationPipe)
export class AuthUserResolver {
  /**
   * Constructor initializes the resolver with the necessary services.
   *
   * @param _accountService - Service responsible for account-based operations.
   */
  constructor(private _accountService: AuthAccountService) {}

  /**
   * Queries the user's account details based on the JWT token.
   *
   * Steps:
   * 1. Extracts the user ID from the JWT token.
   * 2. Calls the account service to fetch the user's account details based on the extracted user ID.
   *
   * @param token - JWT payload of the authenticated user.
   * @returns User's detailed account information.
   */
  @UseGuards(JwtAuthGuard)
  @Query(() => AuthUserObject, {
    description:
      'Provides detailed information of the authenticated user, allowing them to view their current account state.',
    name: 'accountMe',
  })
  public me(@UserToken() token: JWTPayload) {
    return this._accountService.me(token.sub);
  }

  /**
   * Updates the user's personal details.
   *
   * Steps:
   * 1. Extracts the user ID from the JWT token.
   * 2. Calls the account service to update the user's details based on the input and extracted user ID.
   *
   * @param input - Contains updated user information.
   * @param token - JWT payload of the authenticated user.
   * @returns The updated user's account details.
   */
  @UseGuards(JwtAuthGuard)
  @Mutation(() => AuthUserObject, {
    description:
      'Allows users to update personal details ensuring their profile remains current.',
    name: 'accountUpdate',
  })
  public update(
    @Args('input') input: AuthUpdateAccountInput,
    @UserToken() token: JWTPayload,
  ) {
    return this._accountService.update(input, token.sub);
  }
}
