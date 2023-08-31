import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';

import { UserEntity } from './database/entities';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    // Extensions
    ConfigModule.forRoot({
      cache: true,
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
        dbName: _configService.getOrThrow<string>('MIKRO_ORM_DB_NAME'),
        driver: PostgreSqlDriver,
        entities: [UserEntity],
        forceEntityConstructor: true,
        host: _configService.getOrThrow<string>('MIKRO_ORM_HOST'),
        migrations: {
          path: './dist/database/migrations',
          pathTs: './srsc/database/migrations',
        },
        password: _configService.getOrThrow<string>('MIKRO_ORM_PASSWORD', {
          infer: true,
        }),
        port: _configService.getOrThrow<number>('MIKRO_ORM_PORT'),
        seeder: {
          path: './dist/database/seeds',
          pathTs: './srsc/database/seeds',
        },
        type: 'postgresql',
        user: _configService.getOrThrow<string>('MIKRO_ORM_USER'),
      }),
    }),

    // App modules
    UserModule,
  ],
})
export class AppModule {}
