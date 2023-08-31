import { defineConfig } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

import { BaseEntities } from './entities/base';

export default defineConfig<PostgreSqlDriver>({
  entities: BaseEntities,
  migrations: {
    path: './dist/database/migrations',
    pathTs: './srsc/database/migrations',
  },
  seeder: {
    path: './dist/database/seeds',
    pathTs: './srsc/database/seeds',
  },
});
