import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { SERVER_URL, BUSINESS_API_KEY } from "astro:env/server";
import type { RegisterCustomerResponse } from "@/types/ApiResponse";
import { handleBackendResponse, createGenericError } from '@/utils/errorHandler';

// Constantes
const API_URL = 'auth/customer/register';

export const registerCustomer = defineAction({
    accept: "json",
    input: z.object({
        email: z.string().email('El correo electrónico no es válido'),
        password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
        name: z.string().min(1, 'El nombre es requerido'),
        phone: z.string().optional(),
        plan_id: z.string().optional(),
    }),
    handler: async (input, context) => {
        const { email, password, name, phone, plan_id } = input;
        const { session, request } = context;

        // Obtener origin del request para validación del backend
        const origin = request.headers.get('origin') 
            || new URL(request.url).origin;

        try {
            // Construir body solo con campos presentes
            const body: Record<string, string> = {
                email,
                password,
                name,
            };
            
            if (phone) {
                body.phone = phone;
            }
            
            if (plan_id) {
                body.plan_id = plan_id;
            }

            const response = await fetch(`${SERVER_URL}${API_URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Business-Key': BUSINESS_API_KEY,
                    'Origin': origin,
                },
                body: JSON.stringify(body),
            });

            // Usar el manejador de respuestas del backend
            const result = await handleBackendResponse<RegisterCustomerResponse>(
                response, 
                'Usuario registrado exitosamente'
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
                console.error('Error inesperado en register customer:', error);
            }
            throw createGenericError('No se pudo procesar tu solicitud de registro. Por favor, intenta nuevamente.');
        }
    }
});
