/* eslint-disable @typescript-eslint/no-var-requires */
const { PostgreSqlDriver, defineConfig } = require('@mikro-orm/postgresql');

const { join } = require('path');

exports.default = defineConfig({
  driver: PostgreSqlDriver,
  entities: [join(process.cwd(), 'dist/database/entities/index.js')],
  entitiesTs: [join(process.cwd(), 'src/database/entities/index.ts')],
  forceEntityConstructor: true,
  migrations: {
    path: './dist/database/migrations',
    pathTs: './srsc/database/migrations',
  },
  seeder: {
    path: './dist/database/seeds',
    pathTs: './srsc/database/seeds',
  },
});
