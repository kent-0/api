import type { Config } from 'jest';

export default async (): Promise<Config> => {
  return {
    collectCoverageFrom: ['**/*.(t|j)s'],
    moduleFileExtensions: ['js', 'json', 'ts'],
    moduleNameMapper: {
      '^~/(.*)$': '<rootDir>/src/$1',
      '^~/auth/decorator$': '<rootDir>/src/auth/decorators/user.decorator',
      '^~/auth/guard$': '<rootDir>/src/auth/guards/jwt.guard',
      '^~/database/entities$': '<rootDir>/src/database/entities/index',
      '^~/permissions$': '<rootDir>/src/permissions/services/manager.service',
      '^~/permissions/list$': '<rootDir>/src/permissions/enums/index',
    },
    rootDir: '.',
    testEnvironment: 'node',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest',
    },
  };
};
