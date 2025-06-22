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
      \nAPI para el sistema de transporte Taxi24 que permite la gestión de conductores, pasajeros, viajes y facturas, siguiendo los principios de Clean Architecture.
      
      ### 🔧 Características Principales
      - Gestión completa de conductores y vehículos
      - Registro y gestión de pasajeros
      - Sistema de seguimiento de viajes en tiempo real
      - Generación automática de facturas
      - Búsqueda de conductores cercanos (hasta 3km de radio)
      - Documentación interactiva con Swagger
      
      ### 🛠️ Tecnologías Utilizadas
      - **Backend**: NestJS con TypeScript
      - **Base de Datos**: MongoDB con Mongoose
      - **Documentación**: Swagger/OpenAPI
      - **Testing**: Jest con cobertura de código
      
      ### 📊 Códigos de Estado
      | Código | Descripción |
      |--------|-------------|
      | 200 | OK - La petición fue exitosa |
      | 201 | Creado - Recurso creado exitosamente |
      | 400 | Solicitud incorrecta - Error en la validación de datos |
      | 403 | Prohibido - No tiene permisos para acceder al recurso |
      | 404 | No encontrado - El recurso solicitado no existe |
      | 500 | Error del servidor - Ocurrió un error inesperado |
      
      ### 📚 Documentación Adicional
      - [Guía de inicio rápido](#)
      - [Referencia de la API](#)
      - [Ejemplos de código](#)`
    )
    .setVersion('1.1.0')
    .setContact(
      'Equipo de Soporte Taxi24',
      'https://taxi24.com/soporte',
      'soporte@taxi24.com'
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer('http://localhost:3000', 'Servidor de Desarrollo')
    .addServer('https://api.taxi24.com', 'Producción')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingrese el token JWT',
        in: 'header',
      },
      'JWT-auth', // This name here is important for matching up with @ApiBearerAuth()
    )
    .addTag('Conductores', 'Operaciones relacionadas con conductores y vehículos')
    .addTag('Viajes', 'Gestión de viajes y seguimiento en tiempo real')
    .addTag('Facturas', 'Generación y consulta de facturas')
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
