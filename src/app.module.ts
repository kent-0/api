import { join } from 'path';

import { LoadStrategy, colors } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';

import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConsoleLogger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';

import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

import { AuthModule } from './modules/auth/auth.module';
import { BoardModule } from './modules/board/board.module';
import { ProjectModule } from './modules/project/project.module';
import './utils/graphql/registers/enum.register';

/**
 * AppModule class represents the main module of the application, where various configurations
 * and dependencies are imported and combined to create the overall application.
 */
@Module({
  imports: [
    // Extensions
    // ConfigModule for loading configuration settings
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),

    // GraphQLModule for setting up the GraphQL API
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: join(process.cwd(), 'scheme.graphql'),
      context: ({ connection, req }) =>
        connection ? { req: connection.context } : { req },
      driver: ApolloDriver,
      formatError: (error) => ({
        extensions: {
          code: error.extensions?.code,
          originalError: error.extensions?.originalError,
          stacktrace:
            process.env.NODE_ENV !== 'production'
              ? error.extensions?.stacktrace
              : undefined,
          status: error.extensions?.status,
        },
        message:
          (error.extensions?.originalError as { message?: string[] })
            .message?.[0] || error.message,
      }),
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      sortSchema: true,
    }),

    // MikroOrmModule for setting up the MikroORM database connection
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (_configService: ConfigService) => ({
        autoLoadEntities: true,
        dbName: _configService.getOrThrow<string>('MIKRO_ORM_DB_NAME'),
        debug: true,
        driver: PostgreSqlDriver,
        forceEntityConstructor: true,
        highlighter: new SqlHighlighter(),
        host: _configService.getOrThrow<string>('MIKRO_ORM_HOST'),
        loadStrategy: LoadStrategy.JOINED,
        logger: (msg) =>
          new ConsoleLogger().log(`${colors.yellow('[Database]')} ${msg}`),
        migrations: {
          path: './dist/database/migrations',
          pathTs: './srsc/database/migrations',
        },
        password: _configService.getOrThrow<string>('MIKRO_ORM_PASSWORD'),
        port: _configService.getOrThrow<number>('MIKRO_ORM_PORT'),
        seeder: {
          path: './dist/database/seeds',
          pathTs: './src/database/seeds',
        },
        user: _configService.getOrThrow<string>('MIKRO_ORM_USER'),
      }),
    }),

    // App modules
    AuthModule,
    ProjectModule,
    BoardModule,
  ],
})
export class AppModule {}
