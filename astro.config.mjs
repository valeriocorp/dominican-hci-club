// @ts-check
import { defineConfig, envField } from 'astro/config';
import { loadEnv } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

import node from '@astrojs/node';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Determinar modo de ejecución
const mode = process.argv.includes('--mode')
  ? process.argv[process.argv.indexOf('--mode') + 1]
  : process.env.NODE_ENV === 'production'
    ? 'production'
    : 'development';

// Cargar variables de entorno
const env = loadEnv(mode, process.cwd(), '');

// https://astro.build/config
export default defineConfig({
  integrations: [react()],

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src")
      }
    }
  },

  output: 'server',

  adapter: node({
    mode: 'standalone'
  }),

  env: {
    schema: {
      // Backend larimar (variable secreta de servidor - solo usar en actions/middleware)
      SERVER_URL: envField.string({
        access: "secret",
        context: "server",
      }),
      // Clave secreta para firma de cookies/sesiones
      SECRET_KEY: envField.string({
        access: "secret",
        context: "server",
      }),
      // Clave pública para cliente
      PUBLIC_SECRET_KEY: envField.string({
        access: "public",
        context: "client",
      }),
      // API Key del negocio para autenticación de customers
      // Requerida por ApiKeyValidationMiddleware del backend larimar
      BUSINESS_API_KEY: envField.string({
        access: "secret",
        context: "server",
      }),
    },
  },

  session: {
    // El adaptador Node usa filesystem local por defecto
    // Duración de los datos en el storage filesystem (30 días en segundos)
    ttl: 60 * 60 * 24 * 30, // 2592000 segundos = 30 días
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    },
  },
});
