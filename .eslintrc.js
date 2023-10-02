module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'perfectionist',
    'unused-imports',
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:perfectionist/recommended-natural',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: [
    '.eslintrc.js',
    'dist',
    'src/database/migrations',
    'src/database/seeds',
  ],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-member-accessibility': [
      'error',
      {
        overrides: { constructors: 'no-public' },
      },
    ],
    'perfectionist/sort-imports': [
      'error',
      {
        type: 'natural',
        order: 'asc',
        'internal-pattern': ['~/**'],
        'newlines-between': 'always',
        groups: [
          'builtin',
          'mikro-orm',
          'nestjs',
          'internal',
          'internal-type',
          'external',
          'external-type',
          'parent',
          'siblings',
        ],
        'custom-groups': {
          value: {
            nestjs: '@nestjs/**',
            'mikro-orm': '@mikro-orm/**',
          },
        },
      },
    ],
  },
};
