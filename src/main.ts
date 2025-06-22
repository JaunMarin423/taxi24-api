import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { resolve, join } from 'path';
import { config } from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

// Load environment variables
config({ path: resolve(__dirname, '../.env') });

// Configure path aliases
import { register } from 'tsconfig-paths';
import * as fs from 'fs';

const tsConfigPath = join(process.cwd(), 'tsconfig.json');
const tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, 'utf8'));

const baseUrl = tsConfig.compilerOptions.baseUrl || './';
const paths = tsConfig.compilerOptions.paths;

register({
  baseUrl,
  paths: Object.keys(paths).reduce<Record<string, string[]>>(
    (aliases, alias) => ({
      ...aliases,
      [alias]: paths[alias].map((p: string) => resolve(baseUrl, p)),
    }),
    {},
  ),
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('🚕 API Taxi24')
    .setDescription(
      'API para el sistema de transporte Taxi24. Esta documentación describe todos los endpoints disponibles para interactuar con el sistema.'
    )
    .setVersion('1.0')
    .setContact(
      'Equipo Taxi24',
      'https://taxi24.com',
      'soporte@taxi24.com'
    )
    .addServer('http://localhost:3000', 'Servidor de Desarrollo')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingrese el token JWT',
        in: 'header',
      },
      'access-token',
    )
    .addTag('conductores', 'Operaciones relacionadas con conductores')
    .addTag('viajes', 'Operaciones relacionadas con viajes')
    .addTag('usuarios', 'Operaciones relacionadas con usuarios')
    .addTag('facturacion', 'Operaciones relacionadas con facturación')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  });

  SwaggerModule.setup('api', app, document, {
    explorer: true,
    swaggerOptions: {
      filter: true,
      showRequestDuration: true,
      persistAuthorization: true,
      docExpansion: 'none',
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      defaultModelsExpandDepth: -1,
    },
    customSiteTitle: 'API Taxi24 - Documentación',
    customCss: `
      .topbar { background-color: #1a237e !important; }
      .swagger-ui .info .title { color: #1a237e; }
      .swagger-ui .btn.authorize { background-color: #1a237e; }
    `,
    customfavIcon: 'https://taxi24.com/favicon.ico',
  });

  // Habilita el uso de ValidationPipe globalmente
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
