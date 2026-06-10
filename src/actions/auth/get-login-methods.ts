import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { SERVER_URL, BUSINESS_API_KEY } from 'astro:env/server';
import { handleBackendResponse, createGenericError } from '@/utils/errorHandler';

export interface LoginMethods {
    webauthn: boolean;
    whatsapp_otp: boolean;
    magic_link: boolean;
    password: boolean;
}

export interface GetLoginMethodsResponse {
    methods: LoginMethods;
    preferred: string;
}

export const getLoginMethods = defineAction({
    accept: 'json',
    input: z.object({
        email: z.string().email('El correo electrónico no es válido'),
    }),
    handler: async (input, context) => {
        const { request } = context;
        const origin = request.headers.get('origin') || new URL(request.url).origin;

        try {
            const response = await fetch(`${SERVER_URL}auth/customer/login/methods`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Business-Key': BUSINESS_API_KEY,
                    'Origin': origin,
                },
                body: JSON.stringify({ email: input.email }),
            });

            const result = await handleBackendResponse<GetLoginMethodsResponse>(response);

            return {
                success: true,
                data: result.data,
            };
        } catch (error) {
            if (error && typeof error === 'object' && 'code' in error) throw error;
            throw createGenericError('No se pudo verificar el correo. Intenta nuevamente.');
        }
    },
});
