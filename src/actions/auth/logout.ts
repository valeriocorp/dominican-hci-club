import { defineAction } from 'astro:actions';
import { SERVER_URL } from "astro:env/server";
import { handleBackendResponse, createGenericError } from '@/utils/errorHandler';

// Constantes - Usamos el endpoint de llovio que es reusable
const API_URL = 'auth/llovio/logout';

export const logout = defineAction({
    accept: "json",
    handler: async (_, context) => {
        const { session } = context;

        try {
            // Obtener el token del usuario actual
            const token = await session?.get('token');
            
            if (!token) {
                // Si no hay token, solo limpiar la sesión local
                await session?.destroy();
                return {
                    success: true,
                    message: 'Sesión local cerrada correctamente',
                };
            }
            
            // Si hay token, llamar al API para cerrar sesión en el servidor
            try {
                const response = await fetch(`${SERVER_URL}${API_URL}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                // Independientemente del resultado, limpiar la sesión local primero
                await session?.destroy();

                // Intentar procesar la respuesta del servidor
                const result = await handleBackendResponse(
                    response, 
                    'Cierre de sesión exitoso'
                );

                return {
                    success: true,
                    message: result.message,
                    data: result.data
                };

            } catch (serverError) {
                // Si hay error del servidor, asegurar que la sesión local se limpie
                await session?.destroy();
                
                // Si es un ActionError del handleBackendResponse relacionado con token
                if (serverError && typeof serverError === 'object' && 'code' in serverError) {
                    // Para errores de autorización (token expirado/inválido), devolvemos éxito
                    // porque la sesión local ya se limpió
                    if ((serverError as { code: string }).code === 'UNAUTHORIZED') {
                        return {
                            success: true,
                            message: 'Sesión local cerrada correctamente (token expirado en servidor)',
                        };
                    }
                }
                
                // Para otros errores del servidor, devolvemos éxito porque la sesión local se limpió
                return {
                    success: true,
                    message: 'Sesión local cerrada correctamente (error de servidor)',
                };
            }

        } catch (error) {
            // Intentar limpiar la sesión incluso si hay un error crítico
            try {
                await session?.destroy();
            } catch (sessionError) {
                if (import.meta.env.DEV) {
                    console.error('Error adicional al intentar destruir la sesión:', sessionError);
                }
            }

            // Para errores críticos, lanzar excepción
            if (import.meta.env.DEV) {
                console.error('Error inesperado en logout:', error);
            }
            throw createGenericError('Ocurrió un error inesperado al cerrar sesión.');
        }
    }
});
