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

1. **Build**: `bun run build` - Compila el proyecto
2. **Start**: `bun run start` - Inicia el servidor de producción

### Puerto

La aplicación escucha en el puerto **3000** por defecto. Asegúrate de que tu configuración de Dokploy esté mapeando correctamente este puerto.

### Verificación Local

Para probar el build de producción localmente:

```bash
# Instalar dependencias
bun install

# Construir el proyecto
bun run build

# Iniciar servidor de producción
bun run start
```

La aplicación estará disponible en `http://localhost:3000`

