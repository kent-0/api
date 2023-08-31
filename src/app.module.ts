import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';

import { BaseEntities } from './database/entities/base';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    // Extensions
    ConfigModule.forRoot({
      cache: true,
      envFilePath: '.env.local',
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: join(process.cwd(), 'scheme.graphql'),
      driver: ApolloDriver,
      playground: true,
      sortSchema: true,
    }),
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (_configService: ConfigService) => ({
        autoLoadEntities: true,
        dbName: _configService.get<string>('DB_NAME', { infer: true }),
        driver: PostgreSqlDriver,
        entities: BaseEntities,
        host: _configService.get<string>('DB_HOST', { infer: true }),
        password: _configService.get<string>('DB_PASS', { infer: true }),
        user: _configService.get<string>('DB_USER', { infer: true }),
      }),
    }),

    // App modules
    UserModule,
  ],
})
export class AppModule {}
