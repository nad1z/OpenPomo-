module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint', 'import', 'boundaries'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
  ],
  settings: {
    'import/resolver': {
      typescript: { project: './tsconfig.json' },
    },
    'boundaries/elements': [
      { type: 'domain', pattern: 'src/domain/*' },
      { type: 'application', pattern: 'src/application/*' },
      { type: 'infrastructure', pattern: 'src/infrastructure/*' },
      { type: 'presentation', pattern: 'src/presentation/*' },
      { type: 'features', pattern: 'src/features/*' },
      { type: 'shared', pattern: 'src/shared/*' },
    ],
    'boundaries/ignore': ['**/*.test.*', '**/*.spec.*'],
  },
  rules: {
    // Architecture boundary enforcement
    'boundaries/element-types': [
      'error',
      {
        default: 'disallow',
        rules: [
          { from: 'domain', allow: ['shared'] },
          { from: 'application', allow: ['domain', 'shared'] },
          { from: 'infrastructure', allow: ['domain', 'shared'] },
          { from: 'presentation', allow: ['application', 'shared'] },
          { from: 'features', allow: ['presentation', 'application', 'domain', 'shared'] },
          { from: 'shared', allow: [] },
        ],
      },
    ],
    'import/no-cycle': ['error', { maxDepth: 10, ignoreExternal: true }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
  ignorePatterns: ['node_modules/', 'dist/', '.expo/', 'coverage/'],
};
