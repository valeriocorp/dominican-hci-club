import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { SERVER_URL, BUSINESS_API_KEY } from "astro:env/server";
import { handleBackendResponse, createGenericError } from '@/utils/errorHandler';

/**
 * 🎫 CREATE CUSTOMER PORTAL SESSION ACTION
 * 
 * Crea una sesión del Customer Portal de Stripe donde el usuario puede:
 * - Actualizar su método de pago
 * - Ver historial de facturas
 * - Cancelar su suscripción
 * 
 * @returns { portal_url: string }
 */
export const createPortalSession = defineAction({
    accept: "json",
    input: z.object({
        customer_email: z.string().email('El correo electrónico no es válido'),
        return_url: z.string().optional(),
    }),
    handler: async (input, context) => {
        const { customer_email, return_url } = input;
        const { request } = context;

        // Obtener origin del request para validación del backend
        const origin = request.headers.get('origin') 
            || new URL(request.url).origin;

        try {
            const body = {
                customer_email: customer_email.trim().toLowerCase(),
                return_url,
            };

            const response = await fetch(`${SERVER_URL}payment-links/customer/portal-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Business-Key': BUSINESS_API_KEY,
                    'Origin': origin,
                },
                body: JSON.stringify(body),
            });

            // El backend devuelve { success, message, data: { portal_url } }
            const result = await handleBackendResponse<{
                success: boolean;
                message: string;
                data: {
                    portal_url: string;
                };
            }>(response, 'Sesión del portal creada exitosamente');

            // Extraer los datos internos del backend
            const backendData = result.data?.data;

            return {
                success: true,
                message: result.message,
                data: backendData
            };

        } catch (error) {
            // Si es un ActionError del handleBackendResponse, lo relanzamos
            if (error && typeof error === 'object' && 'code' in error) {
                throw error;
            }
            
            if (import.meta.env.DEV) {
                console.error('Error creando portal session:', error);
            }
            throw createGenericError('No se pudo abrir el portal de gestión. Por favor, intenta nuevamente.');
        }
    }
});
