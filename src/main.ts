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
      `## 📋 Descripción General
      \nAPI para el sistema de transporte Taxi24 que permite la gestión de conductores, pasajeros, viajes y facturas.
      \n### Características Principales
- Gestión de conductores y vehículos
- Registro y gestión de pasajeros
- Sistema de seguimiento de viajes en tiempo real
- Generación automática de facturas
- Búsqueda de conductores cercanos
\n### Códigos de Estado
- 200: OK - La petición fue exitosa
- 201: Creado - Recurso creado exitosamente
- 400: Solicitud incorrecta - Error en la validación de datos
- 404: No encontrado - El recurso solicitado no existe
- 500: Error del servidor - Ocurrió un error inesperado`
    )
    .setVersion('1.0.0')
    .setContact(
      'Equipo de Soporte',
      'https://taxi24.com/soporte',
      'soporte@taxi24.com'
    )
    .addServer('http://localhost:3000', 'Servidor de Desarrollo')
    .addTag('Conductores', 'Operaciones relacionadas con conductores')
    .addTag('Facturas', 'Operaciones relacionadas con facturas')
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
