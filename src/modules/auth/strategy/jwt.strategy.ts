import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy, type StrategyOptions } from 'passport-jwt';

import { AuthTokensEntity } from '../../../database/entities';
import { TokenType } from '../../../database/enums/token.enum';
import { JWTPayload } from '../interfaces/jwt.interface';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(AuthTokensEntity)
    private readonly tokensRepository: EntityRepository<AuthTokensEntity>,
    private readonly _jwtService: JwtService,
    public readonly _configService: ConfigService,
  ) {
    super({
      audience: _configService.getOrThrow<string>('APP_JWT_AUDIENCE'),
      ignoreExpiration: false,
      issuer: _configService.getOrThrow<string>('APP_JWT_ISSUER'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
      secretOrKey: _configService.getOrThrow<string>('APP_JWT_TOKEN'),
    } as StrategyOptions);
  }

  public async validate(request: Request, payload: JWTPayload) {
    const token = request.headers.authorization?.split(' ')?.[1];
    const currentDate = new Date();

    if (!token) throw new UnauthorizedException();

    const isValidToken = await this._jwtService.verifyAsync(token);
    if (!isValidToken) throw new UnauthorizedException();

    const tokenSession = await this.tokensRepository.findOne({
      token_type: TokenType.AUTH,
      token_value: token,
      user: payload.sub,
    });

    if (!tokenSession) throw new UnauthorizedException();
    if (tokenSession.revoked) throw new UnauthorizedException();
    if (tokenSession.expiration < currentDate)
      throw new UnauthorizedException();

    return payload;
  }
}
