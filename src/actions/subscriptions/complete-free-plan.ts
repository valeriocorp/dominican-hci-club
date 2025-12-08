import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { SERVER_URL, BUSINESS_API_KEY, FREE_PLAN_PAYMENT_LINK_ID } from "astro:env/server";
import { handleBackendResponse, createGenericError } from '@/utils/errorHandler';
import { sendWelcomeBasicEmailInternal } from '@/actions/email';

/**
 * 🆓 COMPLETE FREE PLAN ACTION
 * 
 * Completa la suscripción a un plan gratuito después del registro.
 * Crea la entrada en customer_subscriptions para el plan gratuito.
 * También envía el correo de bienvenida al usuario.
 * 
 * @returns { subscription_id: string, status: string }
 */

export const completeFreePlan = defineAction({
    accept: "json",
    input: z.object({
        customer_email: z.string().email('El correo electrónico no es válido'),
        customer_name: z.string().optional(),
        customer_phone: z.string().optional(),
    }),
    handler: async (input, context) => {
        const { customer_email, customer_name, customer_phone } = input;
        const { request } = context;

        // Obtener origin del request para validación del backend
        const origin = request.headers.get('origin') 
            || new URL(request.url).origin;

        try {
            const body = {
                payment_link_id: FREE_PLAN_PAYMENT_LINK_ID,
                customer_email: customer_email.trim().toLowerCase(),
                customer_name: customer_name?.trim(),
                customer_phone: customer_phone?.trim(),
            };

            const response = await fetch(`${SERVER_URL}payment-links/recurring/free-plan/complete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Business-Key': BUSINESS_API_KEY,
                    'Origin': origin,
                },
                body: JSON.stringify(body),
            });

            const result = await handleBackendResponse<{
                subscription_id: string;
                status: string;
            }>(response, 'Plan gratuito activado exitosamente');

            // Enviar correo de bienvenida (en background, sin bloquear la respuesta)
            if (result.data) {
                sendWelcomeBasicEmailInternal(
                    customer_email,
                    customer_name || 'Usuario'
                ).then((emailResult) => {
                    if (emailResult.success) {
                        console.log(`📧 Correo de bienvenida enviado exitosamente a ${customer_email}`);
                    } else {
                        console.error(`📧 Error enviando correo de bienvenida:`, emailResult.error);
                    }
                }).catch((error) => {
                    console.error(`📧 Error inesperado enviando correo:`, error);
                });
            }

            return {
                success: true,
                message: result.message,
                data: result.data
            };

        } catch (error) {
            // Si es un ActionError del handleBackendResponse, lo relanzamos
            if (error && typeof error === 'object' && 'code' in error) {
                throw error;
            }
            
            if (import.meta.env.DEV) {
                console.error('Error completando plan gratuito:', error);
            }
            throw createGenericError('No se pudo activar el plan gratuito. Por favor, intenta nuevamente.');
        }
    }
});
