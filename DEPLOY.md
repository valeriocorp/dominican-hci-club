# Guía de Despliegue - Dominican HCI Club

## Configuración para Producción

Este proyecto está configurado para desplegarse con Dokploy/Nixpacks.

### Archivos de Configuración

- **`package.json`**: Contiene el comando `start` necesario para ejecutar el servidor en producción
- **`nixpacks.toml`**: Configuración específica para Nixpacks
- **`astro.config.mjs`**: Configurado con adaptador Node.js en modo standalone

### Variables de Entorno Requeridas

Asegúrate de configurar estas variables en tu plataforma de despliegue:

```env
HOST=0.0.0.0
PORT=3000
NODE_ENV=production
```

### Proceso de Despliegue

1. **Setup**: Instala Bun y Node.js
2. **Install**: `bun install --frozen-lockfile` - Instala las dependencias
3. **Build**: `bun run build` - Compila el proyecto
4. **Start**: `bun run start` - Inicia el servidor de producción

### Puerto

La aplicación escucha en el puerto definido por la variable de entorno `PORT` (por defecto **4321**). El comando start acepta variables de entorno para configurar el host y puerto.

### Verificación Local

Para probar el build de producción localmente:

```bash
# Instalar dependencias con Bun
bun install

# Construir el proyecto
bun run build

# Iniciar servidor de producción
bun run start
```

La aplicación estará disponible en `http://localhost:4321` (o el puerto configurado)

