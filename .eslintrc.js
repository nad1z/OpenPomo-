module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    // Note: 'project' omitted intentionally — type-aware linting is slow and
    // none of the rules below require type information.
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
    // Use '**' (recursive) patterns so every file in a layer is classified.
    // 'composition' must come BEFORE 'infrastructure' so the container dir
    // is matched as the composition root, not as a generic infra file.
    'boundaries/elements': [
      { type: 'domain',         pattern: 'src/domain/**' },
      { type: 'application',    pattern: 'src/application/**' },
      { type: 'composition',    pattern: 'src/infrastructure/container/**' },
      { type: 'infrastructure', pattern: 'src/infrastructure/**' },
      { type: 'presentation',   pattern: 'src/presentation/**' },
      { type: 'features',       pattern: 'src/features/**' },
      { type: 'shared',         pattern: 'src/shared/**' },
    ],
    'boundaries/ignore': ['**/*.test.*', '**/*.spec.*'],
  },
  rules: {
    // ── Architecture boundary enforcement ─────────────────────────────────
    // Rules: lower layers must not import from higher layers.
    // Same-layer imports are always allowed (domain services import entities, etc.)
    'boundaries/element-types': [
      'error',
      {
        default: 'disallow',
        rules: [
          // Domain: pure — imports only other domain files or shared utilities
          { from: 'domain',         allow: ['domain', 'shared'] },
          // Application: orchestrates domain use-cases
          { from: 'application',    allow: ['application', 'domain', 'shared'] },
          // Composition root (DI container): wires all non-UI layers together
          { from: 'composition',    allow: ['domain', 'application', 'infrastructure', 'shared'] },
          // Infrastructure: implements domain interfaces; never imports UI
          { from: 'infrastructure', allow: ['infrastructure', 'domain', 'shared'] },
          // Presentation: UI + Zustand stores; accesses domain for types,
          // composition for DI, application for orchestration
          { from: 'presentation',   allow: ['presentation', 'application', 'composition', 'domain', 'shared'] },
          // Feature screens: vertical slices — same access as presentation
          { from: 'features',       allow: ['features', 'presentation', 'application', 'composition', 'domain', 'shared'] },
          // Shared: zero external layer imports (pure utilities/constants)
          { from: 'shared',         allow: ['shared'] },
        ],
      },
    ],
    'import/no-cycle': ['error', { maxDepth: 10, ignoreExternal: true }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-require-imports': 'warn',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
  ignorePatterns: ['node_modules/', 'dist/', '.expo/', 'coverage/'],
};
