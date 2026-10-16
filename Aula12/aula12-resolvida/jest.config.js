module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js'
  ],
  coverageReporters: ['text', 'text-summary', 'lcov', 'html'],
  verbose: true
};
