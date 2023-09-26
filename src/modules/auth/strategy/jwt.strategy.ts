// Import necessary modules and dependencies
import { EntityManager } from '@mikro-orm/postgresql';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';

import { AuthTokensEntity } from '~/database/entities';
import { TokenType } from '~/database/enums/token.enum';

import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JWTPayload } from '../interfaces/jwt.interface';

/**
 * `JWTStrategy` class is an implementation of Passport's strategy for JWT authentication.
 * It ensures that incoming requests to the application have a valid JWT token.
 *
 * This strategy performs the following checks:
 * - Ensures that a JWT token is present in the `authorization` header of the request.
 * - Verifies the validity of the provided JWT token.
 * - Checks the token against the database to ensure it's not revoked and is still valid.
 * - Marks the token as revoked if it's expired.
 *
 * If the token passes all checks, the request is authenticated successfully. Otherwise,
 * appropriate exceptions are thrown to indicate the error.
 *
 * @example
 * // Usage in a controller
 * @UseGuards(JwtAuthGuard)
 * myProtectedRoute(@UserToken() user) {...}
 *
 * @extends {PassportStrategy(Strategy)}
 */
@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  /**
   * Initializes the JWT strategy with necessary services and configuration.
   *
   * @param {JwtService} _jwtService - Service for JWT-related operations.
   * @param {EntityManager} em - Entity Manager for database operations.
   * @param {ConfigService} _configService - Service to access configuration values.
   */
  constructor(
    private readonly _jwtService: JwtService,
    private readonly em: EntityManager,
    public readonly _configService: ConfigService,
  ) {
    super({
      audience: _configService.getOrThrow<string>('APP_JWT_AUDIENCE'),
      ignoreExpiration: false,
      issuer: _configService.getOrThrow<string>('APP_JWT_ISSUER'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
      secretOrKey: _configService.getOrThrow<string>('APP_JWT_TOKEN'),
    });
  }

  /**
   * Validates the JWT token. This method is automatically called by the Passport module.
   *
   * @param {Request} request - The incoming HTTP request.
   * @param {JWTPayload} payload - The decoded JWT payload.
   *
   * @returns {Promise<JWTPayload>} - Returns the JWT payload if the token is valid.
   *
   * @throws {UnauthorizedException} - Throws if the token is missing, invalid, revoked, or expired.
   */
  public async validate(
    request: Request,
    payload: JWTPayload,
  ): Promise<JWTPayload> {
    const token = request.headers.authorization?.split(' ')?.[1];
    const currentDate = new Date();

    // Check if token is present in the request
    if (!token) {
      throw new UnauthorizedException(
        'An authentication token is required to use this resource.',
      );
    }

    // Verify if the token is valid
    const isValidToken = await this._jwtService.verifyAsync(token);
    if (!isValidToken) {
      throw new UnauthorizedException('The authentication token is invalid.');
    }

    // Find the token session information in the repository
    const tokenSession = await this.em.fork().findOne(AuthTokensEntity, {
      revoked: false,
      token_type: TokenType.AUTH,
      token_value: token,
      user: payload.sub,
    });

    // Check if token session exists
    if (!tokenSession) {
      throw new UnauthorizedException(
        'Could not find information about your authentication token.',
      );
    }

    // Check if the token session is revoked
    if (tokenSession.revoked) {
      throw new UnauthorizedException(
        'The authentication token has been revoked.',
      );
    }

    // Check if the token session is expired
    if (tokenSession.expiration < currentDate) {
      tokenSession.revoked = true;
      await this.em.persistAndFlush(tokenSession);
      throw new UnauthorizedException('The authentication token has expired.');
    }

    return payload;
  }
}
