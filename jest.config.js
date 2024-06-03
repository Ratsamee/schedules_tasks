module.exports = {
    clearMocks: true,
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFilesAfterEnv: ['<rootDir>/__tests__/__mocks__/singleton.ts'],
    roots: ['<rootDir>/__tests__'],
    testPathIgnorePatterns: ['__tests__/__mocks__/'],
    coveragePathIgnorePatterns: ['<rootDir>/__tests__/__mocks__/']
}