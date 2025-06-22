# API Taxi24

API para el sistema de transporte Taxi24, desarrollada con **NestJS**, **TypeScript** y **MongoDB** siguiendo los principios de Clean Architecture.

## Características Principales

### Gestión de Conductores
- Listar todos los conductores
- Listar conductores disponibles
- Buscar conductores disponibles en un radio de 3km
- Obtener conductor por ID

### Gestión de Pasajeros
- Listar todos los pasajeros
- Obtener pasajero por ID
- Encontrar los 3 conductores más cercanos a la ubicación del pasajero

### Gestión de Viajes
- Crear nuevo viaje (asignar conductor a pasajero)
- Completar viaje
- Listar todos los viajes activos
- Generar factura al completar un viaje

## Requisitos Previos

- Node.js (v16 o superior)
- npm o yarn
- MongoDB (local o Atlas)
- [NestJS CLI](https://docs.nestjs.com/cli/overview) (opcional):
  ```bash
  npm i -g @nestjs/cli
  ```

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone <url-del-repositorio>
   cd taxi24-api
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno:
   Crear un archivo `.env` en la raíz del proyecto con:
   ```
   MONGODB_URI=mongodb://localhost:27017/taxi24
   PORT=3000
   ```

## Iniciar la Aplicación

Modo desarrollo con recarga en caliente:
```bash
npm run start:dev
```

La API estará disponible en:  
`http://localhost:3000`

## Documentación de la API

Una vez iniciado el servidor, accede a la documentación interactiva en:
- Swagger UI: `http://localhost:3000/api`
- Documentación JSON: `http://localhost:3000/api-json`

## Estructura del Proyecto

```
src/
  modules/
    conductor/         # Módulo de conductores
    pasajero/          # Módulo de pasajeros
    viaje/             # Módulo de viajes
    factura/           # Módulo de facturación
  shared/              # Código compartido
  app.module.ts        # Módulo principal
  main.ts              # Punto de entrada
```

## Pruebas

Para ejecutar las pruebas unitarias:
```bash
npm test
```

Para pruebas de integración:
```bash
npm run test:e2e
```

## Comandos Útiles

- `npm run start` - Iniciar en producción
- `npm run start:dev` - Iniciar en desarrollo
- `npm run build` - Compilar proyecto
- `npm run format` - Formatear código
- `npm run lint` - Verificar estilo de código

## Arquitectura

El proyecto sigue los principios de Clean Architecture, separando claramente:
- **Dominio**: Entidades y reglas de negocio
- **Aplicación**: Casos de uso
- **Infraestructura**: Implementaciones concretas
- **Interfaces**: Controladores y DTOs

## Licencia

Este proyecto está bajo la Licencia MIT.

MIT