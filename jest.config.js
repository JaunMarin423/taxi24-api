const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');
const path = require('path');
const fs = require('fs');

// Function to get all test files
const getTestFiles = () => {
  const testFiles = [];
  
  function findTestFiles(directory) {
    const files = fs.readdirSync(directory);
    
    files.forEach(file => {
      const fullPath = path.join(directory, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        findTestFiles(fullPath);
      } else if (file.endsWith('.spec.ts')) {
        testFiles.push(fullPath);
      }
    });
  }
  
  findTestFiles(path.join(__dirname, 'test'));
  return testFiles;
};

// Function to get source files that have tests
const getSourceFilesWithTests = () => {
  const testFiles = getTestFiles();
  const srcDir = path.join(__dirname, 'src');
  const sourceFiles = [];
  
  testFiles.forEach(testFile => {
    // Convert test file path to source file path
    let srcFile = testFile
      .replace(/[\\/]test[\\/]/, path.sep + 'src' + path.sep)
      .replace(/\.spec\.ts$/, '.ts');
    
    // Only include files that exist and are within src directory
    if (fs.existsSync(srcFile) && srcFile.startsWith(srcDir)) {
      sourceFiles.push(path.relative(process.cwd(), srcFile));
    }
  });
  
  return sourceFiles;
};

// Get the source files that have tests
const sourceFilesWithTests = getSourceFilesWithTests();

module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverage: true,
  collectCoverageFrom: sourceFilesWithTests.length > 0 ? sourceFilesWithTests : ['**/*.ts'],
  coverageDirectory: './coverage',
  coverageReporters: ['text', 'text-summary'],
  coverageThreshold: {
    global: {
      statements: 0,
      branches: 0,
      functions: 0,
      lines: 0,
    },
  },
  testEnvironment: 'node',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  setupFilesAfterEnv: ['<rootDir>/test/test-setup.ts'],
  coveragePathIgnorePatterns: [
    '/node_modules/'
  ],
};
