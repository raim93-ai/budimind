import js from '@eslint/js';
import typescriptEslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  js.configs.recommended,
  ...typescriptEslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        project: ['./tsconfig.json', './apps/*/tsconfig.json', './packages/*/tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      react: { version: '19.2' },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: ['./tsconfig.json', './apps/*/tsconfig.json', './packages/*/tsconfig.json'],
        },
        node: { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      ...reactHooksPlugin.configs.recommended.rules,
    },
  },
  {
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
    languageOptions: {
      globals: { jest: true, vitest: true },
    },
  },
  {
    ignores: [
      'node_modules/',
      'tmp/',
      'psychology-clinic-context/',
      '.uv-python/',
      '.uv-cache/',
      'dist/',
      'build/',
      '.next/',
      '.next/**',
      'apps/**/.next/**',
      'apps/**/next-env.d.ts',
      '*.config.js',
      '*.config.ts',
      'pnpm-lock.yaml',
      '.turbo/',
      '.vercel',
      'localstack-data/',
      '**/__pycache__/',
      '**/*.py[cod]',
      '**/.venv/',
      '**/venv/',
      '**/env/',
      '**/.tox/',
      '**/.mypy_cache/',
      '**/.pytest_cache/',
      '**/htmlcov/',
      '**/.coverage*',
      '**/*.tfstate*',
      '**/.terraform/',
      '**/*.key',
      '**/*.pem',
      '**/*.crt',
      '**/*.p12',
      '**/*.pfx',
      '**/secrets/',
    ],
  },
];
