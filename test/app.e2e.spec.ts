import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Logger } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { ConfigModule } from '@nestjs/config';

describe('App (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  const logger = new Logger('E2E Test');

  beforeAll(async () => {
    try {
      logger.log('Starting test setup...');
      
      moduleFixture = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env.test',
          }),
          AppModule,
        ],
      }).compile();

      app = moduleFixture.createNestApplication();
      app.useLogger(['error', 'warn', 'log', 'debug', 'verbose']);
      
      await app.init();
      await app.listen(0); // Use a random available port
      
      logger.log('Test setup completed');
    } catch (error) {
      logger.error('Error during test setup', error);
      throw error;
    }
  });

  afterAll(async () => {
    try {
      logger.log('Starting test teardown...');
      if (app) {
        await app.close();
      }
      if (moduleFixture) {
        await moduleFixture.close();
      }
      logger.log('Test teardown completed');
    } catch (error) {
      logger.error('Error during test teardown', error);
      throw error;
    }
  });

  describe('Health Check', () => {
    it('should return 200 for health check endpoint', async () => {
      try {
        const response = await request(app.getHttpServer())
          .get('/health')
          .expect(200);
          
        expect(response.body.status).toBe('ok');
      } catch (error) {
        logger.error('Health check test failed', error);
        throw error;
      }
    });
  });

  describe('Passengers', () => {
    it('GET /users should return 200 and an array of passengers', async () => {
      try {
        const response = await request(app.getHttpServer())
          .get('/users')
          .expect(200);
          
        expect(Array.isArray(response.body)).toBe(true);
      } catch (error) {
        logger.error('Passengers test failed', error);
        throw error;
      }
    });
  });
});
