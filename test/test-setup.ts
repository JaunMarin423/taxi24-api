import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

// Extend the global type
declare global {
  // eslint-disable-next-line no-var
  var __APP__: INestApplication | undefined;
}

beforeAll(async () => {
  // Any global test setup can go here
});

afterAll(async () => {
  // Cleanup after all tests
  if (global.__APP__) {
    await global.__APP__.close();
  }
});
