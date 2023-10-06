import { LoadStrategy } from '@mikro-orm/core';
import { PostgreSqlDriver, defineConfig } from '@mikro-orm/postgresql';

/**
 * The MikroORM configuration file defines the settings and options for the MikroORM database integration.
 */
export default defineConfig({
  // Specify the driver to use for database connection (PostgreSQL in this case)
  driver: PostgreSqlDriver,

  // Extra config
  ensureDatabase: true,

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

/**
 * Generates a __tests__ configuration for MikroORM tailored for PostgreSQL.
 *
 * This function returns a MikroORM configuration that's designed for testing purposes
 * with a PostgreSQL database. It allows the caller to specify the database URL, ensuring
 * flexibility in choosing different databases or schemas for various __tests__ scenarios.
 *
 * Features:
 * - Configurable database connection via `dbUrl` parameter.
 * - Utilizes the PostgreSQL driver for MikroORM.
 * - Forces the usage of entity constructors. This ensures that entity hooks and methods
 *   are always available during testing, providing a more realistic testing environment.
 *
 * Usage:
 * Call this function with the desired PostgreSQL database URL to get a MikroORM
 * configuration ready for testing.
 *
 * @function TestingMikroORMConfig
 * @param {string} clientUrl - The PostgreSQL database connection string.
 *
 * @example
 * const testConfig = testingMikroORMConfig('postgres://localhost:5432/test_db');
 */
export const TestingMikroORMConfig = (clientUrl: string) =>
  defineConfig({
    // @ts-expect-error - This is a valid option, but the type definition is missing it.
    autoLoadEntities: true,
    clientUrl,
    debug: true,
    discovery: {
      // Disable entity discovery to prevent the test suite from trying to load
      checkDuplicateEntities: false,
    },
    driver: PostgreSqlDriver,
    ensureDatabase: true,
    forceEntityConstructor: true,
    loadStrategy: LoadStrategy.JOINED,
  });
