// Import necessary modules and dependencies
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';

import { AuthTokensEntity } from '~/database/entities';
import { TokenType } from '~/database/enums/token.enum';

import { Request } from 'express';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';

import { JWTPayload } from '../interfaces/jwt.interface';

/**
 * JWTStrategy class implements PassportStrategy for JWT authentication.
 * This strategy validates JWT tokens, checks their validity, expiration,
 * and revocation status before allowing access to protected resources.
 */
@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  /**
   * Constructs an instance of JWTStrategy.
   * @param tokensRepository Injected repository for AuthTokensEntity.
   * @param _jwtService Injected JwtService instance for JWT operations.
   * @param em Injected EntityManager for database operations.
   * @param _configService Injected ConfigService for accessing configuration values.
   */
  constructor(
    @InjectRepository(AuthTokensEntity)
    private readonly tokensRepository: EntityRepository<AuthTokensEntity>,
    private readonly _jwtService: JwtService,
    private readonly em: EntityManager,
    public readonly _configService: ConfigService,
  ) {
    super({
      // Configure JWT Strategy options using values from ConfigService
      audience: _configService.getOrThrow<string>('APP_JWT_AUDIENCE'),
      ignoreExpiration: false,
      issuer: _configService.getOrThrow<string>('APP_JWT_ISSUER'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
      secretOrKey: _configService.getOrThrow<string>('APP_JWT_TOKEN'),
    } as StrategyOptions);
  }

  /**
   * Validates the JWT token and checks its validity, expiration, and revocation status.
   * @param request The HTTP request object.
   * @param payload The decoded JWT payload.
   * @returns The validated JWT payload.
   * @throws UnauthorizedException if the token is missing, invalid, revoked, or expired.
   */
  public async validate(request: Request, payload: JWTPayload) {
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
    const tokenSession = await this.tokensRepository.findOne({
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
