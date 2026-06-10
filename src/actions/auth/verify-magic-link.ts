import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { SERVER_URL, BUSINESS_API_KEY } from 'astro:env/server';
import type { LoginCustomerResponse } from '@/types/ApiResponse';
import { handleBackendResponse, createGenericError } from '@/utils/errorHandler';

export const verifyMagicLink = defineAction({
    accept: 'json',
    input: z.object({
        token: z.string().min(1, 'Token requerido'),
    }),
    handler: async (input, context) => {
        const { session, request } = context;
        const origin = request.headers.get('origin') || new URL(request.url).origin;

        try {
            const response = await fetch(`${SERVER_URL}auth/customer/login/magic-link/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Business-Key': BUSINESS_API_KEY,
                    'Origin': origin,
                },
                body: JSON.stringify({ token: input.token }),
            });

            const result = await handleBackendResponse<LoginCustomerResponse>(
                response,
                'Inicio de sesión exitoso',
            );

            if (result.data) {
                await session?.regenerate();
                session?.set('user', result.data.user);
                session?.set('token', result.data.token);
                session?.set('businesses', result.data.businesses);
                session?.set('subscription', result.data.subscription || null);
            }

            return { success: true, data: result.data };
        } catch (error) {
            if (error && typeof error === 'object' && 'code' in error) throw error;
            throw createGenericError('El enlace no es válido o ya expiró. Solicita uno nuevo.');
        }
    },
});
