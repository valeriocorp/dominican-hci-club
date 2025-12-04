import type { APIRoute } from 'astro';
import { BUSINESS_API_KEY } from 'astro:env/server';
import { sendPaymentFailedEmailInternal } from '@/actions/email';

/**
 * ❌ PAYMENT FAILED WEBHOOK ENDPOINT
 * 
 * Endpoint específico de ESTE negocio que recibe notificaciones del backend
 * Larimar cuando falla un pago de suscripción de ESTE negocio.
 * 
 * 🔐 SEGURIDAD (Multi-tenant):
 * - Valida X-Business-Key header con el BUSINESS_API_KEY de este negocio
 * - Solo el backend Larimar conoce este API key
 * - El backend solo llama a este endpoint si el pago es de ESTE negocio
 * 
 * 📡 FLUJO:
 * 1. Cliente intenta pago que falla
 * 2. Stripe envía webhook a Larimar
 * 3. Larimar detecta que la suscripción es de ESTE negocio
 * 4. Larimar obtiene la URL del negocio (allowed_origins/config)
 * 5. Larimar llama a {business_url}/api/subscription/payment-failed
 * 6. Este endpoint envía el correo de notificación de pago fallido
 * 
 * Headers requeridos:
 *   - Content-Type: application/json
 *   - X-Business-Key: {BUSINESS_API_KEY del negocio}
 * 
 * Body:
 *   {
 *     "customer_email": "user@example.com",
 *     "customer_name": "John Doe",
 *     "amount_due": 18.00,
 *     "currency": "USD"
 *   }
 */

interface PaymentFailedPayload {
    customer_email: string;
    customer_name: string;
    amount_due: number;
    currency: string;
}

export const POST: APIRoute = async ({ request }) => {
    try {
        // 1. Validar el Business API Key
        const businessKey = request.headers.get('X-Business-Key');

        console.log(`[Payment Failed] 🔑 Recibida solicitud con X-Business-Key: ${businessKey ? 'presente' : 'ausente'}`);

        if (!businessKey || businessKey !== BUSINESS_API_KEY) {
            console.error('[Payment Failed] ❌ Business API Key inválido o ausente');
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

        console.log('[Payment Failed] ✅ API Key validado correctamente');

        // 2. Parsear el body
        let payload: PaymentFailedPayload;
        try {
            payload = await request.json();
        } catch {
            console.error('[Payment Failed] ❌ Body inválido');
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
        const { 
            customer_email, 
            customer_name, 
            amount_due, 
            currency 
        } = payload;

        if (!customer_email || !customer_name || amount_due === undefined || !currency) {
            console.error('[Payment Failed] ❌ Datos incompletos:', payload);
            return new Response(
                JSON.stringify({ 
                    success: false, 
                    error: 'Bad Request - Missing required fields: customer_email, customer_name, amount_due, currency' 
                }),
                { 
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        // 4. Validar tipos de datos específicos
        if (typeof amount_due !== 'number' || !Number.isFinite(amount_due)) {
            console.error('[Payment Failed] ❌ amount_due inválido:', amount_due);
            return new Response(
                JSON.stringify({ 
                    success: false, 
                    error: 'Bad Request - Invalid data type: amount_due must be a finite number' 
                }),
                { 
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        console.log(`[Payment Failed] 📧 Procesando notificación de pago fallido para: ${customer_email}`);
        console.log(`[Payment Failed] 💰 Monto adeudado: ${amount_due} ${currency}`);

        // 5. Enviar correo de notificación de pago fallido
        const result = await sendPaymentFailedEmailInternal(
            customer_email,
            customer_name,
            amount_due,
            currency
        );

        if (result.success) {
            console.log(`[Payment Failed] ✅ Correo enviado a: ${customer_email}`);
            return new Response(
                JSON.stringify({ 
                    success: true, 
                    message: 'Payment failed notification email sent successfully' 
                }),
                { 
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        } else {
            console.error(`[Payment Failed] ❌ Error enviando correo:`, result.error);
            return new Response(
                JSON.stringify({ 
                    success: false, 
                    error: result.error || 'Failed to send payment failed notification email' 
                }),
                { 
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

    } catch (error) {
        console.error('[Payment Failed] ❌ Error inesperado:', error);
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

