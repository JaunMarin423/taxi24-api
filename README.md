# 🚕 API Taxi24

API para el sistema de transporte Taxi24, desarrollada con **NestJS**, **TypeScript** y **MongoDB** siguiendo los principios de Clean Architecture.

## 🏗️ Estructura del Proyecto

```
src/
├── main.ts                  # Punto de entrada de la aplicación
├── app.module.ts            # Módulo principal
├── common/                  # Utilidades y decoradores comunes
├── modules/
│   ├── conductor/          # Módulo de conductores
│   ├── user/                # Módulo de pasajeros
│   ├── viaje/               # Módulo de viajes
│   └── factura/             # Módulo de facturación
└── shared/                  # Recursos compartidos
    ├── dto/                 # Objetos de Transferencia de Datos
    ├── entities/            # Entidades de la base de datos
    └── interfaces/          # Interfaces y tipos TypeScript
```

## 📋 Características Principales

### 🚗 Gestión de Conductores
- Crear nuevo conductor
- Listar conductores disponibles
- Buscar conductores cercanos
- Obtener conductor por ID

### 👥 Gestión de Pasajeros
- Crear nuevo pasajero
- Listar todos los pasajeros
- Obtener pasajero por ID

### 🚖 Gestión de Viajes
- Crear nuevo viaje
- Listar viajes activos
- Obtener estatus de un viaje
- Iniciar un viaje
- Completar un viaje

### 🧾 Gestión de Facturas
- Listar todas las facturas
- Obtener factura por ID de viaje

## Requisitos Previos

- Node.js (v16 o superior)
- npm o yarn
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

## 📚 Documentación de la API

### Documentación Interactiva
La documentación interactiva de la API está disponible en Swagger UI cuando el servidor está en ejecución:

```
http://localhost:3000/api
```

### Colección de Postman
Hemos preparado una colección de Postman para facilitar las pruebas de la API. Puedes importar el archivo `taxi24-api.postman_collection.json` en tu cliente de Postman para obtener acceso inmediato a todos los endpoints configurados.

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