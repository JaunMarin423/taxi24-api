# 🚕 API Taxi24

API para el sistema de transporte Taxi24, desarrollada con **NestJS**, **TypeScript** y **MongoDB** siguiendo los principios de Clean Architecture.

[![NestJS](https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=Swagger&logoColor=white)](https://swagger.io/)

## 📋 Características Principales

- ✅ **Gestión de Conductores**: Registro, búsqueda y gestión de conductores
- 👥 **Gestión de Pasajeros**: Registro y gestión de usuarios pasajeros
- 🚖 **Sistema de Viajes**: Creación y seguimiento de viajes en tiempo real
- 📊 **Facturación**: Generación automática de facturas
- 🔍 **Búsqueda Avanzada**: Encuentra conductores cercanos en un radio de 3km
- 🔐 **Autenticación JWT**: Seguridad robusta con JSON Web Tokens
- 📚 **Documentación Interactiva**: Documentación completa con Swagger UI
- 🧪 **Cobertura de Pruebas**: Pruebas unitarias y de integración

## 🚀 Comenzando

### Requisitos Previos

- Node.js (v18 o superior)
- npm (v9 o superior) o yarn
- MongoDB (local o Atlas)
- [NestJS CLI](https://docs.nestjs.com/cli/overview) (opcional):
  ```bash
  npm i -g @nestjs/cli
  ```

### 🛠️ Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/taxi24-api.git
   cd taxi24-api
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno:
   Crear un archivo `.env` en la raíz del proyecto con:
   ```env
   # Configuración de la aplicación
   PORT=3000
   NODE_ENV=development
   
   # Base de datos
   MONGODB_URI=mongodb://localhost:27017/taxi24
   
   # JWT
   JWT_SECRET=tu_clave_secreta
   JWT_EXPIRES_IN=1d
   ```

4. Iniciar la aplicación:
   ```bash
   # Modo desarrollo
   npm run start:dev
   
   # Modo producción
   npm run build
   npm run start:prod
   ```

## 🏗️ Estructura del Proyecto

```
taxi24-api/
├── src/
│   ├── main.ts                  # Punto de entrada de la aplicación
│   ├── app.module.ts            # Módulo principal
│   ├── common/                  # Utilidades y decoradores comunes
│   ├── config/                  # Configuraciones de la aplicación
│   ├── modules/                 # Módulos de la aplicación
│   │   ├── auth/               # Autenticación y autorización
│   │   ├── conductor/          # Módulo de conductores
│   │   ├── user/               # Módulo de pasajeros
│   │   ├── viaje/              # Módulo de viajes
│   │   └── factura/            # Módulo de facturación
│   └── shared/                 # Recursos compartidos
│       ├── dto/                # Objetos de Transferencia de Datos
│       ├── entities/           # Entidades de la base de datos
│       └── interfaces/         # Interfaces y tipos TypeScript
├── test/                       # Pruebas automatizadas
├── .env.example               # Ejemplo de variables de entorno
├── .eslintrc.js               # Configuración de ESLint
├── .prettierrc                # Configuración de Prettier
├── jest.config.js             # Configuración de Jest
├── nest-cli.json              # Configuración de NestJS CLI
├── package.json               # Dependencias y scripts
└── tsconfig.json              # Configuración de TypeScript
```

## 📚 Documentación de la API

La documentación completa de la API está disponible en formato Swagger UI cuando la aplicación está en ejecución:

- **URL de Desarrollo**: http://localhost:3000/api
- **URL de Producción**: https://api.taxi24.com/api

### 🔐 Autenticación

La API utiliza autenticación JWT. Para autenticarse:

1. Realiza una petición POST a `/auth/login` con tus credenciales
2. Usa el token recibido en el encabezado `Authorization: Bearer <token>`

### 📝 Ejemplos de Uso

#### Crear un nuevo pasajero

```http
POST /users
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "contraseñaSegura123",
  "telefono": "+1234567890",
  "ubicacion": {
    "type": "Point",
    "coordinates": [-74.5, 40]
  }
}
```

#### Buscar conductores cercanos

```http
GET /conductores/cercanos?latitud=40.7128&longitud=-74.0060&radio=3000
Authorization: Bearer tu_token_jwt
```

#### Crear un nuevo viaje

```http
POST /viajes
Content-Type: application/json
Authorization: Bearer tu_token_jwt

{
  "pasajeroId": "507f1f77bcf86cd799439011",
  "origen": {
    "type": "Point",
    "coordinates": [-74.0060, 40.7128]
  },
  "destino": {
    "type": "Point",
    "coordinates": [-74.0150, 40.7050]
  }
}
```

## 🛠️ Desarrollo

### Variables de Entorno

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `PORT` | Puerto de la aplicación | 3000 |
| `NODE_ENV` | Entorno de ejecución | development |
| `MONGODB_URI` | URL de conexión a MongoDB | mongodb://localhost:27017/taxi24 |
| `JWT_SECRET` | Clave secreta para JWT | - |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token | 1d |

### Comandos Útiles

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run start:dev

# Construir para producción
npm run build

# Ejecutar pruebas
npm test

# Ejecutar pruebas con cobertura
npm run test:cov

# Ejecutar linter
npm run lint

# Formatear código
npm run format
```

## 🧪 Pruebas

El proyecto incluye pruebas unitarias, de integración y pruebas E2E para garantizar la calidad del código.

### Ejecutar Pruebas

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo watch
npm test -- --watch

# Ejecutar pruebas con cobertura
npm run test:cov

# Ejecutar pruebas E2E
npm run test:e2e
```

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor, sigue estos pasos:

1. Haz un Fork del proyecto
2. Crea una rama para tu característica (`git checkout -b feature/AmazingFeature`)
3. Haz commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Haz push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## ✉️ Contacto

- **Email**: soporte@taxi24.com
- **Sitio Web**: https://taxi24.com
- **Documentación**: https://docs.taxi24.com

## Requisitos Previos

- Node.js (v18 o superior)
- npm (v9 o superior) o yarn
- MongoDB (local o Atlas)
- [NestJS CLI](https://docs.nestjs.com/cli/overview) (opcional):
  ```bash
  npm i -g @nestjs/cli
  ```

## 🛠️ Instalación

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

## 🚀 Iniciar la Aplicación

Modo desarrollo con recarga en caliente:
```bash
npm run start:dev
```

La API estará disponible en:  
`http://localhost:3000`

## 🧪 Ejecución de Pruebas

El proyecto incluye pruebas unitarias, de integración y pruebas E2E para garantizar la calidad del código. La configuración de pruebas utiliza Jest con soporte para TypeScript.

### Configuración de Pruebas

El proyecto incluye los siguientes archivos de configuración de Jest:
- `jest.config.js` - Configuración principal de Jest
- `jest-e2e.json` - Configuración para pruebas E2E
- `jest.setup.js` - Configuración global de pruebas
- `jest.global-setup.js` - Configuración de entorno para pruebas
- `jest.global-teardown.js` - Limpieza después de las pruebas

### Comandos de Prueba

Para ejecutar todas las pruebas del proyecto:

```bash
npm test
```

Para ejecutar pruebas con cobertura de código:
```bash
npm test -- --coverage
```

Para ejecutar pruebas específicas (ej: solo controladores):
```bash
npm test -- "**/*.controller.spec.ts"
```

### Ejecutar Pruebas con Cobertura

Para ejecutar las pruebas y generar un informe de cobertura:

```bash
npm test -- --coverage
```

Este comando generará un informe detallado en la consola y creará una carpeta `coverage` con informes en varios formatos.

### Ver el Informe de Cobertura

Después de ejecutar las pruebas con cobertura, puedes ver un informe detallado de la siguiente manera:

1. **En la consola**: El resumen de cobertura se muestra directamente en la terminal.

2. **Informe HTML**: Abre el archivo `coverage/lcov-report/index.html` en tu navegador para ver un informe interactivo:
   ```bash
   start coverage/lcov-report/index.html  # En Windows
   open coverage/lcov-report/index.html   # En macOS
   xdg-open coverage/lcov-report/index.html  # En Linux
   ```

### Estructura de las Pruebas

Las pruebas están organizadas siguiendo la estructura del proyecto:

```
test/
├── conductor/                 # Pruebas del módulo de conductores
│   └── conductor.service.spec.ts
├── domain/                    # Pruebas de casos de uso
│   └── use-cases/
│       ├── crear-viaje.use-case.spec.ts
│       └── obtener-conductores-cercanos.use-case.spec.ts
├── facturas/                  # Pruebas del módulo de facturas
│   └── facturas.controller.spec.ts
├── shared/                    # Pruebas de utilidades compartidas
│   └── pipes/
│       └── object-id-or-uuid.pipe.spec.ts
└── viajes/                    # Pruebas del módulo de viajes
    └── viajes.controller.spec.ts
```

### Ejecutar un Archivo de Prueba Específico

Para ejecutar un archivo de prueba específico:

```bash
npx jest test/ruta/al/archivo-de-prueba.spec.ts
```

### Ejecutar Pruebas en Modo Watch

Para ejecutar las pruebas en modo watch (útil durante el desarrollo):

```bash
npm test -- --watch
```

### Umbrales de Cobertura

El proyecto incluye umbrales mínimos de cobertura configurados. Si la cobertura cae por debajo de estos umbrales, las pruebas fallarán:

- Declaraciones (Statements): 80%
- Ramas (Branches): 80%
- Funciones (Functions): 80%
- Líneas (Lines): 80%

Estos umbrales se pueden ajustar en el archivo `jest.config.js` si es necesario.

## 📚 Documentación de la API

### 📚 Documentación de la API

La documentación interactiva de la API está disponible en:
```
http://localhost:3000/api
```

### Características de la Documentación

- Documentación interactiva generada con Swagger/OpenAPI
- Esquemas de solicitud/respuesta
- Códigos de estado HTTP
- Ejemplos de solicitudes
- Filtrado y búsqueda de endpoints

### Estructura de la API

La API sigue los principios RESTful y está organizada en los siguientes grupos de endpoints:

- **Conductores**: Gestión de conductores y disponibilidad
- **Viajes**: Creación, seguimiento y finalización de viajes
- **Facturas**: Generación y consulta de facturas
- **Pasajeros**: Gestión de usuarios pasajeros

### Colección de Postman

Hemos preparado una colección de Postman para facilitar las pruebas de la API. Puedes importar el archivo `taxi24-api.postman_collection.json` en tu cliente de Postman para obtener acceso inmediato a todos los endpoints configurados.

### Códigos de Estado

La API utiliza los siguientes códigos de estado HTTP:

- `200 OK`: La solicitud se ha completado con éxito
- `201 Created`: Recurso creado exitosamente
- `400 Bad Request`: Error en la validación de datos
- `401 Unauthorized`: Autenticación requerida
- `403 Forbidden`: Permisos insuficientes
- `404 Not Found`: Recurso no encontrado
- `500 Internal Server Error`: Error del servidor

### Ejemplo de Uso

```http
GET /api/conductores/disponibles HTTP/1.1
Host: localhost:3000
Accept: application/json
```

```json
{
  "statusCode": 200,
  "message": "Conductores disponibles obtenidos exitosamente",
  "data": [
    {
      "id": "60d5ec9f3000000000000001",
      "nombre": "Juan Pérez",
      "email": "juan@example.com",
      "disponible": true,
      "ubicacion": {
        "type": "Point",
        "coordinates": [-74.5, 40.0]
      }
    }
  ]
}
```

#### Cómo importar la colección:
1. Abre Postman
2. Haz clic en "Import" en la esquina superior izquierda
3. Selecciona el archivo `taxi24-api.postman_collection.json`
4. Haz clic en "Import"

La colección incluye ejemplos de solicitud para todos los endpoints principales, organizados por categorías (Conductores, Viajes, Usuarios, Facturas).

## 🚀 Estructura de la API

### Modelos de Datos

#### Conductor
```typescript
{
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  licencia: string;
  disponible: boolean;
  ubicacion: {
    type: 'Point';
    coordinates: [number, number];
  };
  vehiculo: {
    placa: string;
    modelo: string;
    color: string;
  };
}
```

#### Pasajero
```typescript
{
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  ubicacion: {
    type: 'Point';
    coordinates: [number, number];
  };
}
```

#### Viaje
```typescript
{
  id: string;
  conductorId: string;
  pasajeroId: string;
  estado: 'solicitado' | 'en_curso' | 'completado' | 'cancelado';
  origen: {
    type: 'Point';
    coordinates: [number, number];
  };
  destino: {
    type: 'Point';
    coordinates: [number, number];
  };
  fechaInicio: Date;
  fechaFin?: Date;
  costo?: number;
}
```

## 🚀 Endpoints Principales

### Conductores

#### Crear un conductor
```http
POST /conductores
```
**Cuerpo de la petición:**
```json
{
    "nombre": "Juliana López",
    "email": "juliana@example.com",
    "telefono": "+1234567890",
    "licencia": "LIC12345678",
    "disponible": false,
    "ubicacion": {
        "type": "Point",
        "coordinates": [-74.5, 40]
    },
    "vehiculo": {
        "placa": "ABC123",
        "modelo": "Nissan Corolla",
        "color": "Rojo"
    }
}
```

#### Listar todos los conductores
```http
GET /conductores
```

#### Obtener conductor por ID
```http
GET /conductores/:id
```

#### Listar conductores disponibles
```http
GET /conductores/disponibles
```

#### Buscar conductores cercanos
```http
GET /conductores/cercanos?lat=40&lng=-74.5&distancia=3000
```

### Pasajeros

#### Crear un nuevo pasajero
```http
POST /users
```
**Cuerpo de la petición:**
```json
{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "password123",
    "telefono": "+1234567890",
    "ubicacion": {
        "type": "Point",
        "coordinates": [-74.006, 40.7128]
    }
}
```

#### Listar todos los pasajeros
```http
GET /users
```

#### Obtener pasajero por ID
```http
GET /users/:id
```

### Viajes

#### Crear un viaje
```http
POST /viajes
```
**Cuerpo de la petición:**
```json
{
    "pasajeroId": "ID_DEL_PASAJERO",
    "conductorId": "ID_DEL_CONDUCTOR",
    "origen": {
        "latitud": 4.710989,
        "longitud": -74.072092
    },
    "destino": {
        "latitud": 4.710989,
        "longitud": -74.072092
    }
}
```

#### Listar viajes activos
```http
GET /viajes/activos
```

#### Obtener estatus de un viaje
```http
GET /viajes/:id
```

#### Iniciar un viaje
```http
PATCH /viajes/:id/iniciar
```
**Cuerpo de la petición:**
```json
{
    "conductorId": "ID_DEL_CONDUCTOR"
}
```

#### Completar un viaje
```http
PATCH /viajes/:id/completar
```
**Cuerpo de la petición:**
```json
{
    "distanciaKm": 5.3,
    "duracionMinutos": 15
}
```

### Facturas

#### Listar todas las facturas
```http
GET /facturas
```

#### Obtener factura por ID de viaje
```http
GET /facturas/viaje/:id
```

## 🏗️ Estructura del Proyecto

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