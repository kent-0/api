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

import { AuthResolver } from './resolvers/auth.resolver';
import { AuthAccountService } from './services/account.service';
import { AuthEmailService } from './services/email.service';
import { JWTStrategy } from './strategy/jwt.strategy';

/**
 * The AuthModule is responsible for organizing and orchestrating all authentication related components.
 * It integrates various services, strategies, and entities to handle authentication functionalities.
 */
@Module({
  imports: [
    // MikroORM module to enable interaction with specified entities.
    MikroOrmModule.forFeature({
      entities: [
        AuthTokensEntity,
        AuthUserEntity,
        AuthPasswordEntity,
        AuthEmailsEntity,
      ],
    }),

    // Passport module integration with JWT as the default strategy.
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // JWT module configuration. Asynchronous factory pattern is used to dynamically create JWT options.
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (_configService: ConfigService) => ({
        global: true,
        // Retrieve JWT configurations from environment or other external configurations.
        secret: _configService.getOrThrow<string>('APP_JWT_TOKEN'),
        signOptions: {
          audience: _configService.getOrThrow<string>('APP_JWT_AUDIENCE'),
          expiresIn: '8h',
          issuer: _configService.getOrThrow<string>('APP_JWT_ISSUER'),
        },
      }),
    }),
  ],

  // Define the providers for this module, which includes services and strategies.
  providers: [
    AuthAccountService,
    AuthResolver,
    JWTStrategy,
    AuthPasswordService,
    AuthEmailService,
  ],
})
export class AuthModule {}
