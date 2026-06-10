import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { SERVER_URL, BUSINESS_API_KEY } from 'astro:env/server';
import type { LoginCustomerResponse } from '@/types/ApiResponse';
import { handleBackendResponse, createGenericError } from '@/utils/errorHandler';

export const verifyWhatsappOtp = defineAction({
    accept: 'json',
    input: z.object({
        email: z.string().email('El correo electrónico no es válido'),
        code: z.string().min(4, 'Código inválido').max(8, 'Código inválido'),
    }),
    handler: async (input, context) => {
        const { session, request } = context;
        const origin = request.headers.get('origin') || new URL(request.url).origin;

        try {
            const response = await fetch(`${SERVER_URL}auth/customer/login/verify-whatsapp-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Business-Key': BUSINESS_API_KEY,
                    'Origin': origin,
                },
                body: JSON.stringify({ email: input.email, code: input.code }),
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
            throw createGenericError('El código es incorrecto o expiró. Solicita uno nuevo.');
        }
    },
});
