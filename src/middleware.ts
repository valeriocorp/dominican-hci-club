//? MIDDLEWARE DE AUTENTICACIÓN PARA CUSTOMERS - ASTRO 5.0
//? ============================================================
//? Este middleware maneja la autenticación de clientes (customers),
//? verificación de sesiones y control de acceso a rutas.
//? Versión simplificada sin roles, onboarding o lógica de negocios complejos.

import { defineMiddleware } from "astro:middleware";
import {
    getSessionUser,
    getLastSessionCheck,
    updateSessionCheckTimestamp,
    clearSession,
    getSessionToken,
    getCurrentBusinessId,
} from "@/utils/sessionHelpers";
import { server } from "@/actions";

//? ===========================
//? CONSTANTES DE CONFIGURACIÓN
//? ===========================

//? Intervalo para verificar sesión con el backend (5 minutos)
const SESSION_CHECK_INTERVAL = 5 * 60 * 1000;

//? Rutas que requieren usuario autenticado
//? Si un usuario no autenticado intenta acceder, será redirigido a /login
const privateRoutes = [
    '/profile',
    '/profile-free',
    '/welcome',
    '/premium-welcome',
    '/plan-changed',
    '/confirmation',
];

//? Rutas que solo deben ser accedidas por usuarios NO autenticados
//? Si un usuario ya está logueado intenta acceder, será redirigido a la página principal
const authOnlyRoutes = ['/login', '/register'];

//? ==========================================
//? MIDDLEWARE PRINCIPAL DE AUTENTICACIÓN
//? ==========================================

export const onRequest = defineMiddleware(
    async (context, next) => {
        const { url, locals, redirect, isPrerendered, callAction, session } = context;
        const pathname = url.pathname;

        //? ===============================
        //? VERIFICACIÓN DE PRERENDERIZADO
        //? ===============================

        //? En modo prerenderizado (build time), no podemos acceder a sesiones
        //? porque no hay usuario real. Simplemente continuamos sin verificaciones.
        if (isPrerendered) {
            return await next();
        }

        //? ===============================
        //? INICIALIZACIÓN DE SESIÓN
        //? ===============================

        //? Obtener datos del usuario desde la sesión usando los helpers existentes
        const user = await getSessionUser(session);

        //? Variables de control para el manejo de sesión durante este request
        let isValidSession = !!user;
        let shouldDestroySession = false;

        //? ==========================================
        //? VERIFICACIÓN DE VALIDEZ DE SESIÓN (5 min)
        //? ==========================================

        //? Si hay un usuario en la sesión local, verificamos si sigue siendo válida en el servidor
        //? Esto previene usuarios con tokens expirados o sesiones inválidas
        if (user) {
            const lastCheck = await getLastSessionCheck(session);
            const now = Date.now();
            const elapsed = now - lastCheck;

            //? Solo verificar si han pasado más de 5 minutos desde la última verificación
            if (elapsed > SESSION_CHECK_INTERVAL) {
                try {
                    //? Llamar al action sessionStatus para verificar el token con el backend
                    const result = await callAction(server.auth.sessionStatus, {});

                    //? ✅ CASO DE ÉXITO - SESIÓN VÁLIDA
                    if (result.data) {
                        //? Actualizar timestamp de última verificación en la sesión
                        updateSessionCheckTimestamp(session);
                    }
                } catch (actionError) {
                    //? Verificar si es un ActionError del sistema de errores estructurados
                    if (actionError && typeof actionError === 'object' && 'code' in actionError) {
                        if ((actionError as { code: string }).code === 'UNAUTHORIZED') {
                            //? 🔒 SESIÓN INVÁLIDA - Token expirado, usuario desactivado, etc.
                            shouldDestroySession = true;
                            isValidSession = false;
                        }
                        //? Para otros códigos de error del servidor, mantener sesión temporalmente
                    } else {
                        //? Errores de conectividad u otros errores de sistema
                        const errorMessage = actionError instanceof Error 
                            ? actionError.message 
                            : String(actionError);

                        if (errorMessage.includes('timeout') || errorMessage.includes('fetch failed')) {
                            //? 🌐 Error de conectividad temporal - preservar sesión local
                            //? No destruir para permitir uso offline temporal
                        } else {
                            //? ⚡ Error crítico desconocido - destruir sesión por seguridad
                            shouldDestroySession = true;
                            isValidSession = false;
                        }
                    }
                }
            }
            //? Si elapsed <= SESSION_CHECK_INTERVAL, usamos la sesión en caché (verificación reciente)
        }

        //? ==========================================
        //? LIMPIEZA DE SESIÓN INVÁLIDA
        //? ==========================================

        //? Si se determinó que la sesión debe ser destruida (token expirado, error crítico, etc.)
        if (shouldDestroySession) {
            try {
                clearSession(session);

                //? Si el usuario estaba en una ruta privada, redirigir a login con parámetro informativo
                if (privateRoutes.some(route => pathname.startsWith(route))) {
                    return redirect('/login?session=expired');
                }
            } catch (error) {
                //? Si falla la destrucción, continuar sin detener el flujo
                if (import.meta.env.DEV) {
                    console.error('[Middleware] ⚠️ Error al destruir la sesión:', error);
                }
            }
        }

        //? ==========================================
        //? PREPARACIÓN DE DATOS DE USUARIO
        //? ==========================================

        //? Determinar el usuario actual basado en si se destruyó la sesión
        const currentUser = shouldDestroySession ? null : user;

        //? Obtener token y businessId de la sesión (almacenados separadamente del user)
        const token = await getSessionToken(session);
        const currentBusinessId = await getCurrentBusinessId(session);

        //? ==========================================
        //? CONFIGURACIÓN DE LOCALS PARA ASTRO 5.0
        //? ==========================================

        //? Configurar el objeto locals que estará disponible en todas las páginas y componentes
        //? Según la interfaz App.Locals definida en src/env.d.ts
        Object.assign(locals, {
            isLoggedIn: isValidSession && !!currentUser,
            userId: currentUser?.id || null,
            userEmail: currentUser?.email || null,
            userName: currentUser?.name || null,
            token: shouldDestroySession ? null : token,
            currentBusinessId: shouldDestroySession ? null : currentBusinessId,
        });

        //? ==========================================
        //? CONTROL DE ACCESO A RUTAS
        //? ==========================================

        //? ===================================
        //? REDIRECCIÓN: USUARIOS AUTENTICADOS
        //? ===================================

        //? Si un usuario YA está logueado intenta acceder a páginas de login/register
        //? Redirigirlo a la página principal para evitar confusión
        if (locals.isLoggedIn && authOnlyRoutes.some(route => pathname === route)) {
            return redirect('/');
        }

        //? ===================================
        //? REDIRECCIÓN: USUARIOS NO AUTENTICADOS
        //? ===================================

        //? Si un usuario NO está logueado intenta acceder a rutas privadas
        //? Redirigirlo a login para que se autentique primero
        if (!locals.isLoggedIn && privateRoutes.some(route => pathname.startsWith(route))) {
            return redirect('/login');
        }

        //? ==========================================
        //? PROCESAMIENTO DE LA RESPUESTA
        //? ==========================================

        //? ✅ Continuar con la respuesta - ya no necesitamos modificar cookies manualmente
        return await next();
    }
);

//? ==========================================
//? RESUMEN DEL FLUJO DEL MIDDLEWARE (CUSTOMERS)
//? ==========================================
//? 
//? 1. 🔍 DETECCIÓN: Identificar tipo de request (prerenderizado, action, normal)
//? 2. 🔒 SESIÓN: Obtener usuario de la sesión usando helpers
//? 3. ⏰ VERIFICACIÓN: Decidir si verificar con servidor (cada 5 minutos)
//? 4. 🌐 SERVIDOR: Llamar sessionStatus para validar token
//? 5. 🛡️ MANEJO: Procesar UNAUTHORIZED vs errores de red
//? 6. 🧹 LIMPIEZA: Destruir sesión si es inválida
//? 7. 📊 LOCALS: Configurar datos para componentes de Astro
//? 8. 🔄 REDIRECCIÓN: Controlar acceso basado en autenticación
//? 9. ✅ RESPUESTA: Retornar respuesta final
//? 
//? NOTA: Este middleware es una versión simplificada para customers.
//? No incluye verificaciones de roles, onboarding, o carga de negocios
//? ya que los customers no tienen estas funcionalidades.
