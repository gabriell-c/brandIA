// Jest config - minimal, no transform needed
const path = require('path');

module.exports = {
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': path.resolve('<rootDir>', 'src/$1'),
  },
  testMatch: ['<rootDir>/src/**/*.test.js'],
  transform: {},
  moduleFileExtensions: ['js', 'json'],
};