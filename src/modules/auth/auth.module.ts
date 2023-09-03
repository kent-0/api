import { MikroOrmModule } from '@mikro-orm/nestjs';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import {
  AuthEmailsEntity,
  AuthPasswordEntity,
  AuthTokensEntity,
  AuthUserEntity,
} from '~/database/entities';
import { AuthPasswordService } from '~/modules/auth/services/password.service';

import { AuthResolver } from './auth.resolver';
import { AuthAccountService } from './services/account.service';
import { AuthEmailService } from './services/email.service';
import { JWTStrategy } from './strategy/jwt.strategy';

/**
 * AuthModule class represents the authentication module of the application.
 * It defines the imports, providers, and configuration related to authentication.
 */
@Module({
  imports: [
    // Import MikroORM module with specified entities
    MikroOrmModule.forFeature({
      entities: [
        AuthTokensEntity,
        AuthUserEntity,
        AuthPasswordEntity,
        AuthEmailsEntity,
      ],
    }),
    // Configure Passport module with JWT strategy as default
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // Configure JWT module with asynchronous factory to create JWT options
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (_configService: ConfigService) => ({
        global: true,
        // Configure JWT secret, audience, and issuer from ConfigService
        secret: _configService.getOrThrow<string>('APP_JWT_TOKEN'),
        signOptions: {
          audience: _configService.getOrThrow<string>('APP_JWT_AUDIENCE'),
          expiresIn: '8h',
          issuer: _configService.getOrThrow<string>('APP_JWT_ISSUER'),
        },
      }),
    }),
  ],
  providers: [
    // Register various services and strategies as providers
    AuthAccountService,
    AuthResolver,
    JWTStrategy,
    AuthPasswordService,
    AuthEmailService,
  ],
})
export class AuthModule {}
