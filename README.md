
# Visor TV - Backend

## Descripción

El **Visor TV** es un sistema que permite gestionar pantallas y su contenido de forma modular, pensado para administradores y operadores que puedan crear y editar pantallas con distintos componentes, como widgets de clima, cámaras de seguridad y carruseles de información. Este repositorio contiene el backend de la aplicación, que se encarga de manejar las API necesarias para la gestión de usuarios y pantallas.

## Arquitectura

Este proyecto sigue una **arquitectura modular** que organiza el código según su responsabilidad dentro de la aplicación. Las principales carpetas y su propósito son las siguientes:

- **Controllers**: Maneja las solicitudes HTTP y la lógica que responde a las rutas.
- **Models**: Define los esquemas y estructuras de los datos que interactúan con MongoDB.
- **Routes**: Define los endpoints de la API y los controladores asociados.
- **Services**: Contiene la lógica de negocio que es usada por los controladores.
- **Config**: Configuración general del proyecto, como la conexión a la base de datos y variables de entorno.
- **Utils**: Funciones auxiliares y utilidades que pueden ser reutilizadas en varias partes del proyecto.

## Tecnologías

El backend está desarrollado con las siguientes tecnologías:

- **Node.js** con **Express** como framework principal.
- **MongoDB** como base de datos, utilizando **Mongoose** para la modelización de datos.
- **TypeScript** para garantizar un desarrollo tipado y escalable.
- **Nodemon** para reiniciar automáticamente el servidor durante el desarrollo.
  
## Configuración e instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/visor-tv-backend.git
cd visor-tv-backend
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto con las siguientes variables de entorno:

```
MONGO_URI=
PORT=3000
JWT_SECRET=
```

### 4. Correr el proyecto en desarrollo
```bash
npm run dev
```

El servidor se ejecutará en el puerto 3000 o el que definas en el archivo `.env`.

## Scripts de npm

- `npm run dev`: Inicia el servidor en modo de desarrollo con **Nodemon**.
- `npm run build`: Compila el proyecto.
- `npm run start`: Inicia el servidor en producción.

## Licencia

Este proyecto está licenciado bajo los términos de la licencia MIT.
