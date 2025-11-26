import { defineAction } from 'astro:actions';
import { SERVER_URL } from "astro:env/server";
import type { SessionStatusResponse } from "@/types/ApiResponse";
import { handleBackendResponse, createGenericError } from '@/utils/errorHandler';

// Constantes - Usamos el endpoint de llovio que es reusable
const API_URL = 'auth/llovio/session/status';

export const sessionStatus = defineAction({
    accept: "json",
    handler: async (_, context) => {
        const { session } = context;

        try {
            const token = await session?.get('token');

            // Si no hay token en la sesión local, devolver sesión inactiva
            if (!token) {
                return {
                    success: false,
                    message: 'No hay sesión activa',
                };
            }

            // Si hay token, verificar con el servidor
            const response = await fetch(`${SERVER_URL}${API_URL}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            // Usar el manejador de respuestas del backend
            const result = await handleBackendResponse<SessionStatusResponse>(
                response, 
                'Sesión verificada correctamente'
            );

            return {
                success: true,
                message: result.message,
                data: result.data
            };

        } catch (error) {
            // Si es un ActionError, verificar si es UNAUTHORIZED para limpiar sesión
            if (error && typeof error === 'object' && 'code' in error) {
                if ((error as { code: string }).code === 'UNAUTHORIZED') {
                    // Limpiar la sesión local si el servidor dice que no es válida
                    await session?.destroy();
                    return {
                        success: false,
                        message: 'Sesión expirada. Por favor, inicia sesión nuevamente.',
                    };
                }
                
                // Para otros ActionErrors, relanzar
                throw error;
            }
            
            // Para errores de red u otros errores inesperados
            if (import.meta.env.DEV) {
                console.error('Error inesperado en session status:', error);
            }
            throw createGenericError('No se pudo verificar el estado de la sesión. Por favor, intenta nuevamente.');
        }
    }
});
