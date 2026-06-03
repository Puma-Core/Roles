# Obel Roles API

API de roles, permisos y usuarios construida con **Fastify 5** + **Prisma 7** + **SQLite**.

El proyecto fue creado usando [opencode-ai](https://opencode.ai), un agente CLI para ingeniería de software asistida.

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Fastify 5 |
| ORM | Prisma 7 con SQLite |
| Lenguaje | TypeScript 6 |
| Tests unitarios | Jest + jest-mock-extended |
| Tests integración | node:test (nativo) |

Se eligió Fastify para explorar un framework diferente al tradicional, y Prisma como alternativa a Sequelize para variar el stack tecnológico y evaluar la flexibilidad del desarrollo asistido por IA.

## Requisitos

- Node.js 24+
- npm

## Ejecutar desde el host

```bash
npm install
npm run dev
```

Esto ejecuta el pipeline completo: generar Prisma Client → aplicar migraciones → cargar datos de prueba → iniciar servidor con hot-reload en `http://localhost:3012`. La documentación Swagger está disponible en `http://localhost:3012/docs`.

## Ejecutar con Docker Compose

```bash
docker compose up -d
```

El contenedor ejecuta automáticamente el pipeline de base de datos y expone el puerto configurado (por defecto `3012`). También puede desarrollarse directamente dentro del contenedor para mayor precisión con el entorno productivo.

## Scripts disponibles

| Script | Descripción |
|---|---|
| `npm run dev` | DB setup + servidor con watch |
| `npm start` | DB setup + servidor |
| `npm test` | Tests unitarios |
| `npm run db:setup` | Generar cliente + migrar + seed |
| `npm run db:seed` | Cargar datos de prueba |
| `npm run db:migrate` | Aplicar migraciones pendientes |

## Estructura

```
app/
  domains/            # Modelos de dominio
  endpoints/          # Rutas Fastify + schemas JSON
  infraestructure/    # Repositorios (PrismaRepository + BaseRepository)
  integrations/       # Cliente Prisma, config, plugins
  services/           # Casos de uso
tests/
  unitTests/
    mocks/            # Mocks con jest-mock-extended
    app/              # Tests unitarios de repositorios y servicios
  integration/        # Tests de integración (node:test)
scripts/
  seed.ts             # Carga de datos de prueba
```

## Endpoints

Todos los endpoints son públicos, excepto `/api/users/me` y `/api/tokens/refresh` que requieren autenticación JWT.

- `GET/POST /api/roles`
- `GET/PATCH/DELETE /api/roles/:id`
- `GET/POST /api/users`
- `GET/PATCH/DELETE /api/users/:id`
- `GET/POST /api/permissions`
- `GET/PATCH/DELETE /api/permissions/:id`
- `GET/POST /api/operations`
- `GET/PATCH/DELETE /api/operations/:id`
- `POST /api/tokens/login`
- `POST /api/tokens/refresh`
- `GET /api/users/me`

## Datos de prueba

Tres usuarios precargados con contraseña `Password123!`:

| Usuario | Contraseña |
|---|---|
| ana.ventas | Password123! |
| bruno.comercial | Password123! |
| carla.vendedora | Password123! |

## Notas

- Para modificar los roles de un usuario debe hacerse desde el endpoint `/api/users`, pero no es posible cambiar los atributos `roles` mediante PUT. Cada PUT solo aplica a la entidad que se manipula en el endpoint.
- Los repositorios tienen tests unitarios obligatorios. Los tests de integración usan `node:test` (librería nativa), ya que originalmente no se contempló Jest para ese propósito.
