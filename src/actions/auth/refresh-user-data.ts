import { defineAction } from 'astro:actions';
import { SERVER_URL } from "astro:env/server";
import { handleBackendResponse, createGenericError } from '@/utils/errorHandler';
import { saveSessionData } from '@/utils/sessionHelpers';

/**
 * Action para refrescar los datos del usuario desde el backend
 * Útil después de cambios en la suscripción o perfil
 */
export const refreshUserData = defineAction({
    accept: "json",
    handler: async (_, context) => {
        const { session } = context;

        try {
            const token = await session?.get('token');

            // Si no hay token en la sesión, no podemos refrescar
            if (!token) {
                return {
                    success: false,
                    message: 'No hay sesión activa para refrescar',
                };
            }

            // Llamar al endpoint GET /auth/customer/me con el token
            const response = await fetch(`${SERVER_URL}auth/customer/me`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            // Usar el manejador de respuestas del backend
            const result = await handleBackendResponse(
                response, 
                'Datos actualizados correctamente'
            );
            
            // Actualizar la sesión con los datos frescos
            // Solo actualizamos user, businesses y subscription (no el token)
            if (result.data) {
                if (result.data.user) {
                    await session?.set('user', result.data.user);
                }
                if (result.data.businesses) {
                    await session?.set('businesses', result.data.businesses);
                }
                if (result.data.subscription) {
                    await session?.set('subscription', result.data.subscription);
                } else {
                    // Si no hay suscripción, limpiar de la sesión
                    await session?.set('subscription', null);
                }
            }

            return {
                success: true,
                message: 'Sesión actualizada correctamente',
                data: result.data,
            };

        } catch (error) {
            if (import.meta.env.DEV) {
                console.error('Error refrescando datos del usuario:', error);
            }
            throw createGenericError('No se pudieron actualizar los datos. Por favor, intenta nuevamente.');
        }
    }
});
