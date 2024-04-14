import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

const paths = {
  '~/*': ['./src/*'],
  '~/auth/decorator': ['./src/auth/decorators/user.decorator.js'],
  '~/auth/guard': ['./src/auth/guards/jwt.guard.js'],
  '~/database/entities': ['./src/database/entities/index.js'],
  '~/permissions': ['./src/permissions'],
  '~/permissions/list': ['./src/permissions/enums/index.js'],
};

const aliases = {
  '~/': './src/',
  '~/auth/decorator': './src/auth/decorators/user.decorator',
  '~/auth/guard': './src/auth/guards/jwt.guard',
  '~/database/entities': './src/database/entities/index',
  '~/permissions': './src/permissions',
  '~/permissions/list': './src/permissions/enums/index',
};

const excludePaths = [
  '.eslintrc.js',
  '**/migrations/**',
  '**/mikro-orm-config.ts',
  '**/main.ts',
  '**/resolvers/**',
  '**/inputs/**',
  '**/objects/**',
  '**/*.module.ts',
  '**/decorators/**',
  '**/seeds/**',
  '**/types/**',
  '**/graphql/registers/**',
  '**/jwt.guard.ts',
];

export default defineConfig({
  plugins: [
    swc.vite({
      jsc: {
        baseUrl: process.cwd(),
        parser: {
          dynamicImport: true,
          syntax: 'typescript',
        },
        paths,
      },
      module: {
        type: 'nodenext',
      },
    }),
  ],
  resolve: {
    alias: aliases,
  },
  test: {
    alias: aliases,
    coverage: {
      all: true,
      exclude: excludePaths,
    },
    poolOptions: {
      threads: {
        singleThread: true,
      },
      vmThreads: {
        singleThread: true,
      },
    },
    root: './',
  },
});
