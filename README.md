# Events API

API robusta y escalable construida con **NestJS** para la gestión de eventos, usuarios y tickets. Incluye autenticación segura, control de acceso basado en roles (RBAC) e integración con Prisma ORM.

## 🚀 Tecnologías

- **Framework:** [NestJS](https://nestjs.com/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Base de Datos:** PostgreSQL
- **Autenticación:** Passport JWT (Access & Refresh Tokens)
- **Validación:** Class-validator & Class-transformer
- **Seguridad:** Bcrypt para hashing de contraseñas

## 🛠️ Instalación

1.  **Clonar el repositorio:**
    ```bash
    git clone <repository-url>
    cd events-api
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno:**
    Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example`:
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/events_db?schema=public"
    JWT_SECRET="your_access_token_secret"
    JWT_REFRESH_SECRET="your_refresh_token_secret"
    PORT=3000
    ```

4.  **Sincronizar la base de datos (Prisma):**
    ```bash
    npx prisma migrate dev
    npx prisma generate
    ```

## 🏃 Ejecución

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

## 📖 Documentación de la API

Todos los endpoints tienen el prefijo global: `/api/v1`

### Autenticación (`/api/v1/auth`)
| Método | Ruta | Descripción |
| :--- | :--- | :--- |
| `POST` | `/register` | Registrar un nuevo usuario |
| `POST` | `/login` | Iniciar sesión y obtener tokens |
| `POST` | `/logout` | Invalidar el refresh token (Protegido) |
| `POST` | `/refresh` | Obtener nuevo access token usando el refresh token |

### Usuarios (`/api/v1/users`)
| Método | Ruta | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Admin | Listar todos los usuarios |
| `GET` | `/me` | User/Admin | Obtener perfil del usuario autenticado |
| `PATCH` | `/me` | User/Admin | Actualizar perfil propio |
| `GET` | `/:id` | Admin | Obtener un usuario por ID |
| `PATCH` | `/:id` | Admin | Actualizar un usuario por ID |
| `DELETE` | `/:id` | Admin | Eliminar un usuario |

### Eventos (`/api/v1/events`)
| Método | Ruta | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/` | Organizer/Admin | Crear un nuevo evento |
| `GET` | `/` | Público | Listar todos los eventos |
| `GET` | `/:id` | Público | Ver detalle de un evento |
| `PATCH` | `/:id` | Owner/Admin | Actualizar un evento |
| `DELETE` | `/:id` | Owner/Admin | Eliminar un evento |

## 📂 Estructura del Proyecto

```text
src/
├── auth/           # Lógica de autenticación y estrategias JWT
├── users/          # Gestión de usuarios y perfiles
├── prisma/         # Configuración y servicio de Prisma
├── common/         # Decoradores, guards y utilidades compartidas
├── app.module.ts   # Módulo raíz de la aplicación
└── main.ts         # Punto de entrada y configuración global
```

## 🛡️ Seguridad y Roles

La aplicación utiliza **JWT** para la sesiones. Se manejan tres roles principales definidos en el esquema de Prisma:
- `USER`: Permisos básicos para gestionar su propio perfil y eventos.
- `ORGANIZER`: Capacidad para crear y gestionar eventos.
- `ADMIN`: Control total sobre usuarios y el sistema.
