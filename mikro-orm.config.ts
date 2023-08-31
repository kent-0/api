import { PostgreSqlDriver, defineConfig } from '@mikro-orm/postgresql';

export default defineConfig({
  driver: PostgreSqlDriver,
  entities: ['./dist/database/entities'],
  entitiesTs: ['./src/database/entities'],
  forceEntityConstructor: true,
  migrations: {
    path: './dist/database/migrations',
    pathTs: './src/database/migrations',
  },
  seeder: {
    defaultSeeder: 'InitialSeeder',
    path: './dist/database/seeds',
    pathTs: './src/database/seeds',
  },
});
