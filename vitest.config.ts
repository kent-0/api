import * as process from 'process';

import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    // This is required to build the test files with SWC
    swc.vite({
      jsc: {
        baseUrl: process.cwd(),
        parser: {
          dynamicImport: true,
          syntax: 'typescript',
        },
        paths: {
          '~/*': ['./src/*'],
          '~/auth/decorator': ['./src/auth/decorators/user.decorator.js'],
          '~/auth/guard': ['./src/auth/guards/jwt.guard.js'],
          '~/database/entities': ['./src/database/entities/index.js'],
          '~/permissions': ['./src/permissions/services/manager.service.js'],
          '~/permissions/list': ['./src/permissions/enums/index.js'],
        },
      },
      module: {
        type: 'es6',
      },
    }),
  ],
  resolve: {
    alias: {
      '~/': './src/',
      '~/auth/decorator': './src/auth/decorators/user.decorator',
      '~/auth/guard': './src/auth/guards/jwt.guard',
      '~/database/entities': './src/database/entities/index',
      '~/permissions': './src/permissions/services/manager.service',
      '~/permissions/list': './src/permissions/enums/index',
    },
  },
  test: {
    alias: {
      '~/': './src/',
      '~/auth/decorator': './src/auth/decorators/user.decorator',
      '~/auth/guard': './src/auth/guards/jwt.guard',
      '~/database/entities': './src/database/entities/index',
      '~/permissions': './src/permissions/services/manager.service',
      '~/permissions/list': './src/permissions/enums/index',
    },
    coverage: {
      all: true,
      exclude: [
        '**/migrations/**',
        '.eslintrc.js',
        'mikro-orm-config.ts',
        'main.ts',
        'app.module.ts',
      ],
    },
    root: './',
    singleThread: true,
  },
});
