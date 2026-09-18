# Rutas Día UTP

Sistema web para la gestión de eventos Día UTP de UTP Lima Norte.

## Objetivo

Digitalizar y mejorar la gestión de:

- eventos Día UTP;
- mentores;
- alumnos y asistencia;
- buses;
- grupos de recorrido;
- laboratorios;
- incidencias;
- recorridos dinámicos en tiempo real;
- reportes e históricos.

## Arquitectura

El proyecto está dividido en servicios independientes:

- `backend/`: Spring Boot + Java
- `frontend/`: React + Vite
- `infra/`: infraestructura local y despliegue
- `docs/`: documentación del proyecto

## Tecnologías principales

### Backend
- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA
- WebSocket + STOMP
- MySQL
- Maven

### Frontend
- React
- Vite
- Bootstrap
- Axios
- STOMP.js

### Infraestructura
- Docker
- Docker Compose
- Azure
- GitHub

## Desarrollo

Backend:

```text
http://localhost:8080





## Desarrollo local

### 1. Base de datos

Desde `infra`:

```bash
docker compose -f docker-compose.dev.yml up -d

MySQL queda disponible en:

Host: localhost
Puerto: 3307
2. Backend

Abrir la carpeta backend en IntelliJ IDEA.

Ejecutar:

RutasDiaUtpApplication

Backend:

http://localhost:8080

Health:

http://localhost:8080/actuator/health
3. Frontend

Desde frontend:

npm install
npm run dev

Frontend:

http://localhost:5173
Comunicación en tiempo real

El proyecto utiliza:

WebSocket
STOMP

Endpoint:

/ws

Prefijo cliente → servidor:

/app

Prefijo servidor → clientes:

/topic
Estructura
RutasDiaUTP/
├── backend/
├── frontend/
├── infra/
└── docs/

El backend y frontend son servicios independientes.

Identidad visual

La interfaz utiliza principalmente:

rojo;
negro;
blanco.

Los demás colores se reservan para representar estados operativos.

Estado actual

Bloque 0 completado:

repositorio configurado;
Spring Boot configurado;
MySQL en Docker;
Flyway configurado;
React + Vite configurado;
comunicación HTTP frontend/backend;
comunicación WebSocket + STOMP;
estructura modular inicial;
Docker para frontend;
Docker para backend.

---

# Commit 09 — cierre del Bloque 0

```cmd
git add README.md



## Bloque 1 - Usuarios y seguridad

El sistema implementa autenticación y autorización basada en JWT.

### Roles

- ADMINISTRADOR
- MENTOR

### Mentor

El mentor puede:

- registrarse con correo institucional `@utp.edu.pe`;
- iniciar sesión;
- cerrar sesión;
- cambiar su contraseña;
- recuperar su contraseña;
- acceder únicamente a funcionalidades autorizadas para su rol.

### Administrador

El administrador puede:

- iniciar sesión;
- cambiar y recuperar su contraseña;
- consultar mentores;
- inhabilitar y reactivar mentores;
- consultar administradores;
- crear administradores;
- editar administradores;
- inhabilitar y reactivar administradores.

Los usuarios no se eliminan físicamente para conservar
el historial relacionado con eventos y operaciones.

### Contraseñas

Las contraseñas se almacenan mediante `PasswordEncoder`
con BCrypt.

Al cambiar o restablecer una contraseña se incrementa
la versión de seguridad del usuario, invalidando JWT
emitidos anteriormente.

### Recuperación de contraseña

En desarrollo:

```text
app.mail.enabled=false