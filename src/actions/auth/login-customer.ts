import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { SERVER_URL, BUSINESS_API_KEY } from "astro:env/server";
import type { LoginCustomerResponse } from "@/types/ApiResponse";
import { handleBackendResponse, createGenericError } from '@/utils/errorHandler';

// Constantes
const API_URL = 'auth/customer/login';

export const loginCustomer = defineAction({
    accept: "json",
    input: z.object({
        email: z.string().email('El correo electrónico no es válido'),
        password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    }),
    handler: async (input, context) => {
        const { email, password } = input;
        const { session, request } = context;
        
        // Obtener origin del request para validación del backend
        const origin = request.headers.get('origin') 
            || new URL(request.url).origin;
        
        try {
            const response = await fetch(`${SERVER_URL}${API_URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Business-Key': BUSINESS_API_KEY,
                    'Origin': origin,
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            // Usar el manejador de respuestas del backend
            const result = await handleBackendResponse<LoginCustomerResponse>(
                response, 
                'Inicio de sesión exitoso'
            );

            // Manejo de sesión solo en caso de éxito
            if (result.data) {
                // Regenerar id de la sesión por seguridad
                await session?.regenerate();
                
                // Guardar en la sesión los datos del usuario
                session?.set('user', result.data.user);
                session?.set('token', result.data.token);
                session?.set('businesses', result.data.businesses);
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
            
            // Para errores de red u otros errores inesperados
            if (import.meta.env.DEV) {
                console.error('Error inesperado en login customer:', error);
            }
            throw createGenericError('No se pudo procesar tu solicitud de inicio de sesión. Por favor, intenta nuevamente.');
        }
    }
});
