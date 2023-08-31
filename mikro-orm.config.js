/* eslint-disable @typescript-eslint/no-var-requires */
const { PostgreSqlDriver, defineConfig } = require('@mikro-orm/postgresql');

exports.default = defineConfig({
  driver: PostgreSqlDriver,
  entities: ['./dist/database/entities'],
  entitiesTs: ['./dist/database/entities'],
  forceEntityConstructor: true,
  migrations: {
    path: './dist/database/migrations',
    pathTs: './srsc/database/migrations',
  },
  seeder: {
    defaultSeeder: 'InitialSeeder',
    path: './dist/database/seeds',
    pathTs: './src/database/seeds',
  },
});
