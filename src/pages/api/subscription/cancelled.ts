import type { APIRoute } from 'astro';
import { BUSINESS_API_KEY } from 'astro:env/server';
import { sendCancellationEmailInternal } from '@/actions/email';

/**
 * 📧 SUBSCRIPTION CANCELLED WEBHOOK ENDPOINT
 * 
 * Endpoint específico de ESTE negocio que recibe notificaciones del backend
 * Larimar cuando un usuario de ESTE negocio cancela su suscripción premium.
 * 
 * 🔐 SEGURIDAD (Multi-tenant):
 * - Valida X-Business-Key header con el BUSINESS_API_KEY de este negocio
 * - Solo el backend Larimar conoce este API key
 * - El backend solo llama a este endpoint si la cancelación es de ESTE negocio
 * 
 * 📡 FLUJO:
 * 1. Usuario cancela desde Stripe Portal
 * 2. Stripe envía webhook a Larimar
 * 3. Larimar detecta que la suscripción es de ESTE negocio
 * 4. Larimar obtiene la URL del negocio (allowed_origins/config)
 * 5. Larimar llama a {business_url}/api/subscription/cancelled
 * 6. Este endpoint envía el correo de cancelación
 * 
 * Headers requeridos:
 *   - Content-Type: application/json
 *   - X-Business-Key: {BUSINESS_API_KEY del negocio}
 * 
 * Body:
 *   {
 *     "customer_email": "user@example.com",
 *     "customer_name": "John Doe",
 *     "premium_end_date": "2024-02-15T00:00:00.000Z"
 *   }
 */

interface CancellationPayload {
    customer_email: string;
    customer_name: string;
    premium_end_date: string;
}

export const POST: APIRoute = async ({ request }) => {
    try {
        // 1. Validar el Business API Key
        const businessKey = request.headers.get('X-Business-Key');

        if (!businessKey || businessKey !== BUSINESS_API_KEY) {
            console.error('[Subscription Cancelled] ❌ Business API Key inválido o ausente');
            return new Response(
                JSON.stringify({ 
                    success: false, 
                    error: 'Unauthorized - Invalid business API key' 
                }),
                { 
                    status: 401,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        // 2. Parsear el body
        let payload: CancellationPayload;
        try {
            payload = await request.json();
        } catch {
            console.error('[Subscription Cancelled] ❌ Body inválido');
            return new Response(
                JSON.stringify({ 
                    success: false, 
                    error: 'Bad Request - Invalid JSON body' 
                }),
                { 
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        // 3. Validar campos requeridos
        const { customer_email, customer_name, premium_end_date } = payload;

        if (!customer_email || !customer_name || !premium_end_date) {
            console.error('[Subscription Cancelled] ❌ Datos incompletos:', payload);
            return new Response(
                JSON.stringify({ 
                    success: false, 
                    error: 'Bad Request - Missing required fields: customer_email, customer_name, premium_end_date' 
                }),
                { 
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        console.log(`[Subscription Cancelled] 📧 Procesando cancelación para: ${customer_email}`);

        // 4. Enviar correo de cancelación
        const result = await sendCancellationEmailInternal(
            customer_email,
            customer_name,
            premium_end_date
        );

        if (result.success) {
            console.log(`[Subscription Cancelled] ✅ Correo enviado a: ${customer_email}`);
            return new Response(
                JSON.stringify({ 
                    success: true, 
                    message: 'Cancellation email sent successfully' 
                }),
                { 
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        } else {
            console.error(`[Subscription Cancelled] ❌ Error enviando correo:`, result.error);
            return new Response(
                JSON.stringify({ 
                    success: false, 
                    error: result.error || 'Failed to send cancellation email' 
                }),
                { 
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

    } catch (error) {
        console.error('[Subscription Cancelled] ❌ Error inesperado:', error);
        return new Response(
            JSON.stringify({ 
                success: false, 
                error: 'Internal Server Error' 
            }),
            { 
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
};

// Rechazar otros métodos HTTP
export const ALL: APIRoute = async () => {
    return new Response(
        JSON.stringify({ 
            success: false, 
            error: 'Method Not Allowed' 
        }),
        { 
            status: 405,
            headers: { 'Content-Type': 'application/json' }
        }
    );
};

