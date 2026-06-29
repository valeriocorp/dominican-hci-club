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
      // API Key del negocio para autenticación de customers
      // Requerida por ApiKeyValidationMiddleware del backend larimar
      BUSINESS_API_KEY: envField.string({
        access: "secret",
        context: "server",
      }),
      // Plan Premium - Dev: 9, Prod: 2
      PUBLIC_PREMIUM_PLAN_ID: envField.string({
        access: "public",
        context: "client",
      }),
    },
  },

  session: {
    // Redis compartido entre clientes; `base` aísla las llaves de HCI.
    // process.env (no import.meta.env): el config se evalúa antes de la
    // inyección de env de Vite, donde import.meta.env queda undefined.
    driver: 'redis',
    options: {
      url: process.env.REDIS_URL,
      base: 'hci',
    },
    ttl: 60 * 60 * 24 * 30, // 30 días
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    },
  },
});
