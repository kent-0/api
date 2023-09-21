import type { Config } from 'jest';

export default async (): Promise<Config> => {
  return {
    collectCoverageFrom: ['./src/**/*.ts'],
    moduleFileExtensions: ['json', 'ts', 'js'],
    moduleNameMapper: {
      '^~/(.*)$': '<rootDir>/src/$1',
      '^~/auth/decorator$': '<rootDir>/src/auth/decorators/user.decorator',
      '^~/auth/guard$': '<rootDir>/src/auth/guards/jwt.guard',
      '^~/database/entities$': '<rootDir>/src/database/entities/index',
      '^~/permissions$': '<rootDir>/src/permissions/services/manager.service',
      '^~/permissions/list$': '<rootDir>/src/permissions/enums/index',
    },
    modulePathIgnorePatterns: [
      '<rootDir>/dist/',
      '<rootdir>/node_modules/',
      '<rootDir>/src/database/migrations',
      '<rootDir>/src/test',
    ],
    rootDir: '.',
    testEnvironment: 'node',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest',
    },
  };
};
