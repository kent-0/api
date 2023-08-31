/* eslint-disable @typescript-eslint/no-var-requires */
const { PostgreSqlDriver, defineConfig } = require('@mikro-orm/postgresql');
const { TsMorphMetadataProvider } = require('@mikro-orm/reflection');

const { config } = require('dotenv');
const { join } = require('path');

const settings = config({
  path: join(process.cwd(), '.env.local'),
});

exports.default = defineConfig({
  dbName: settings.parsed.MIKRO_ORM_DB_NAME,
  driver: PostgreSqlDriver,
  entities: [join(process.cwd(), 'dist/database/entities/index.js')],
  entitiesTs: [join(process.cwd(), 'src/database/entities/index.ts')],
  forceEntityConstructor: true,
  host: settings.parsed.MIKRO_ORM_HOST,
  metadataProvider: TsMorphMetadataProvider,
  migrations: {
    path: './dist/database/migrations',
    pathTs: './srsc/database/migrations',
  },
  password: settings.parsed.MIKRO_ORM_PASSWORD,
  seeder: {
    path: './dist/database/seeds',
    pathTs: './srsc/database/seeds',
  },
  user: settings.parsed.MIKRO_ORM_USER,
});
