# Taxi24 API

API backend para la gestión de usuarios y servicios de Taxi24, desarrollada con **NestJS**, **TypeScript** y **MongoDB** siguiendo Clean Architecture.

---

## Requisitos Previos

- Node.js y npm instalados
- MongoDB en ejecución (local o remoto)
- [NestJS CLI](https://docs.nestjs.com/cli/overview) instalado globalmente:  
  `npm i -g @nestjs/cli`
- (Opcional) Herramienta de administración de MongoDB como Compass o Robo 3T

---

## Instalación

1. Clona el repositorio:
   ```sh
   git clone <url-del-repo>
   cd taxi24-api
   ```

2. Instala las dependencias:
   ```sh
   npm install
   ```

3. Crea un archivo `.env` en la raíz del proyecto y configura la URI de MongoDB:
   ```
   MONGODB_URI=mongodb://localhost/nest
   ```

---

## Inicialización de la Base de Datos

Antes de iniciar la API, puedes ejecutar un script para crear un usuario admin por defecto:

```sh
npm run init:db
```

Este script:
- Se conecta a la base de datos definida en `MONGODB_URI`.
- Crea un usuario admin (`admin@admin.com` / `admin123`) si no existe.

> **Nota:** Para producción, recuerda cambiar la contraseña y hashearla correctamente.

---

## Ejecución del Proyecto

Para iniciar el servidor en modo desarrollo:

```sh
npm run start:dev
```

La API estará disponible en:  
`http://localhost:3000`

---

## Estructura del Proyecto

```
src/
  modules/
    user/
      controllers/
      dtos/
      schemas/
      services/
      user.module.ts
  app.module.ts
scripts/
  init-db.ts
.env
```

---

## Comandos Útiles

- `npm run start:dev` — Inicia el servidor en modo desarrollo
- `npm run init:db` — Inicializa la base de datos con datos por defecto

---

## Notas

- Sigue Clean Architecture para separar lógica de negocio, controladores y servicios.
- Usa variables de entorno para la configuración sensible.
- Personaliza el script de inicialización según tus necesidades.

---

## Licencia

MIT