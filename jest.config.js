/** @type {import('jest').Config} */
const config = {
  projects: [
    // Node environment for lib tests
    {
      displayName: 'lib',
      preset: 'ts-jest',
      testEnvironment: 'node',
      roots: ['<rootDir>/__tests__/lib'],
      testMatch: ['**/*.test.ts'],
      transform: {
        '^.+\\.tsx?$': [
          'ts-jest',
          {
            tsconfig: {
              module: 'commonjs',
              moduleResolution: 'node',
              esModuleInterop: true,
              strict: true,
              skipLibCheck: true,
              resolveJsonModule: true,
            },
          },
        ],
      },
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
      },
      setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    },
    // jsdom environment for component tests
    {
      displayName: 'components',
      preset: 'ts-jest',
      testEnvironment: 'jsdom',
      roots: ['<rootDir>/__tests__/components'],
      testMatch: ['**/*.test.tsx'],
      transform: {
        '^.+\\.tsx?$': [
          'ts-jest',
          {
            tsconfig: {
              module: 'commonjs',
              moduleResolution: 'node',
              esModuleInterop: true,
              strict: true,
              skipLibCheck: true,
              resolveJsonModule: true,
              jsx: 'react-jsx',
            },
          },
        ],
      },
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
      },
      setupFilesAfterEnv: ['<rootDir>/jest.setup.ts', '<rootDir>/jest.setup.components.tsx'],
    },
  ],
  collectCoverageFrom: [
    'lib/transformations/**/*.ts',
    'components/**/*.tsx',
    '!lib/transformations/index.ts',
    '!components/**/index.ts',
    '!**/*.d.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      functions: 90,
      lines: 80,
      statements: 80,
    },
  },
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  verbose: true,
};

module.exports = config;
