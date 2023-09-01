import { MikroOrmModule } from '@mikro-orm/nestjs';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthTokensEntity, AuthUserEntity } from '~/database/entities';

import { AuthResolver } from './auth.resolver';
import { AuthService } from './services/auth.service';
import { JWTStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [AuthTokensEntity, AuthUserEntity] }),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (_configService: ConfigService) => ({
        global: true,
        secret: _configService.getOrThrow<string>('APP_JWT_TOKEN'),
        signOptions: {
          audience: _configService.getOrThrow<string>('APP_JWT_AUDIENCE'),
          expiresIn: '8h',
          issuer: _configService.getOrThrow<string>('APP_JWT_ISSUER'),
        },
      }),
    }),
  ],
  providers: [AuthService, AuthResolver, JWTStrategy],
})
export class AuthModule {}
