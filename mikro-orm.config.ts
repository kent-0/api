import { PostgreSqlDriver, defineConfig } from '@mikro-orm/postgresql';

/**
 * The MikroORM configuration file defines the settings and options for the MikroORM database integration.
 */
export default defineConfig({
  // Specify the driver to use for database connection (PostgreSQL in this case)
  driver: PostgreSqlDriver,

  // Specify the paths to the compiled JavaScript and TypeScript entity files
  entities: ['./dist/database/entities'],
  entitiesTs: ['./src/database/entities'],

  // Enable entity constructors during hydration (loading data from the database)
  forceEntityConstructor: true,

  // Specify the paths to the migrations and migration TypeScript files
  migrations: {
    path: './dist/database/migrations',
    pathTs: './src/database/migrations',
  },

  // Configure seeders for populating the database with initial data
  seeder: {
    defaultSeeder: 'InitialSeeder', // Specify the default seeder class
    path: './dist/database/seeds', // Specify the path to compiled seeders
    pathTs: './src/database/seeds', // Specify the path to TypeScript seeders
  },
});
