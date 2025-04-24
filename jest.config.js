/** @type {import('jest').Config} */
const config ={
    collectCoverage: true,
    verbose: true,
    coverageReporters: ['text', 'clover', 'json', 'lcov'],
    testEnvironment: 'jsdom'
}
module.exports = config