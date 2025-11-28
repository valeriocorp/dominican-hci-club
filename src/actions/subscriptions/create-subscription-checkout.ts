import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { SERVER_URL, BUSINESS_API_KEY } from "astro:env/server";
import { handleBackendResponse, createGenericError } from '@/utils/errorHandler';

/**
 * 💳 CREATE SUBSCRIPTION CHECKOUT ACTION
 * 
 * Crea una Stripe Checkout Session para suscripción de plan premium.
 * Solo se debe llamar después de que el usuario se haya registrado exitosamente.
 * 
 * @returns { checkout_url: string, session_id: string }
 */
export const createSubscriptionCheckout = defineAction({
    accept: "json",
    input: z.object({
        plan_id: z.string().min(1, 'El ID del plan es requerido'),
        customer_email: z.string().email('El correo electrónico no es válido'),
        customer_name: z.string().optional(),
        customer_phone: z.string().optional(),
        currency: z.enum(['DOP', 'USD']).default('USD'),
        success_url: z.string().optional(),
        cancel_url: z.string().optional(),
    }),
    handler: async (input, context) => {
        const { plan_id, customer_email, customer_name, customer_phone, currency, success_url, cancel_url } = input;
        const { request } = context;

        // Obtener origin del request para validación del backend
        const origin = request.headers.get('origin') 
            || new URL(request.url).origin;

        try {
            const body = {
                plan_id,
                customer_email: customer_email.trim().toLowerCase(),
                customer_name: customer_name?.trim(),
                customer_phone: customer_phone?.trim(),
                currency,
                success_url,
                cancel_url,
            };

            const response = await fetch(`${SERVER_URL}payment-links/customer/subscription-checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Business-Key': BUSINESS_API_KEY,
                    'Origin': origin,
                },
                body: JSON.stringify(body),
            });

            // El backend devuelve { success, message, data: { checkout_url, session_id } }
            // handleBackendResponse envuelve TODO eso en { success, message, data: {...} }
            const result = await handleBackendResponse<{
                success: boolean;
                message: string;
                data: {
                    checkout_url: string;
                    session_id: string;
                };
            }>(response, 'Checkout creado exitosamente');

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
                console.error('Error creando subscription checkout:', error);
            }
            throw createGenericError('No se pudo crear el checkout de suscripción. Por favor, intenta nuevamente.');
        }
    }
});
