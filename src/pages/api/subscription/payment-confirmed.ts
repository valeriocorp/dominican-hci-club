import type { APIRoute } from 'astro';
import { BUSINESS_API_KEY } from 'astro:env/server';
import { sendPaymentConfirmationEmailInternal } from '@/actions/email';

/**
 * 📧 PAYMENT CONFIRMATION WEBHOOK ENDPOINT
 * 
 * Endpoint específico de ESTE negocio que recibe notificaciones del backend
 * Larimar cuando se procesa exitosamente un pago de suscripción de ESTE negocio.
 * 
 * 🔐 SEGURIDAD (Multi-tenant):
 * - Valida X-Business-Key header con el BUSINESS_API_KEY de este negocio
 * - Solo el backend Larimar conoce este API key
 * - El backend solo llama a este endpoint si el pago es de ESTE negocio
 * 
 * 📡 FLUJO:
 * 1. Cliente paga suscripción
 * 2. Stripe envía webhook a Larimar
 * 3. Larimar detecta que la suscripción es de ESTE negocio
 * 4. Larimar obtiene la URL del negocio (allowed_origins/config)
 * 5. Larimar llama a {business_url}/api/subscription/payment-confirmed
 * 6. Este endpoint envía el correo de confirmación de pago
 * 
 * Headers requeridos:
 *   - Content-Type: application/json
 *   - X-Business-Key: {BUSINESS_API_KEY del negocio}
 * 
 * Body:
 *   {
 *     "customer_email": "user@example.com",
 *     "customer_name": "John Doe",
 *     "amount": 18.00,
 *     "currency": "USD",
 *     "next_billing_date": "2024-03-15T00:00:00.000Z",
 *     "transaction_id": "pi_abc123...",
 *     "payment_method": "card"
 *   }
 */

interface PaymentConfirmationPayload {
    customer_email: string;
    customer_name: string;
    amount: number;
    currency: string;
    next_billing_date: string;
    transaction_id: string;
    payment_method: string;
}

export const POST: APIRoute = async ({ request }) => {
    try {
        // 1. Validar el Business API Key
        const businessKey = request.headers.get('X-Business-Key');

        console.log(`[Payment Confirmed] 🔑 Recibida solicitud con X-Business-Key: ${businessKey ? 'presente' : 'ausente'}`);

        if (!businessKey || businessKey !== BUSINESS_API_KEY) {
            console.error('[Payment Confirmed] ❌ Business API Key inválido o ausente');
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

        console.log('[Payment Confirmed] ✅ API Key validado correctamente');

        // 2. Parsear el body
        let payload: PaymentConfirmationPayload;
        try {
            payload = await request.json();
        } catch {
            console.error('[Payment Confirmed] ❌ Body inválido');
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
            amount, 
            currency, 
            next_billing_date, 
            transaction_id, 
            payment_method 
        } = payload;

        if (!customer_email || !customer_name || amount === undefined || !currency || !next_billing_date || !transaction_id || !payment_method) {
            console.error('[Payment Confirmed] ❌ Datos incompletos:', payload);
            return new Response(
                JSON.stringify({ 
                    success: false, 
                    error: 'Bad Request - Missing required fields: customer_email, customer_name, amount, currency, next_billing_date, transaction_id, payment_method' 
                }),
                { 
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        // 4. Validar tipos de datos específicos
        if (typeof amount !== 'number' || !Number.isFinite(amount)) {
            console.error('[Payment Confirmed] ❌ Amount inválido:', amount);
            return new Response(
                JSON.stringify({ 
                    success: false, 
                    error: 'Bad Request - Invalid data type: amount must be a finite number' 
                }),
                { 
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        if (isNaN(new Date(next_billing_date).getTime())) {
            console.error('[Payment Confirmed] ❌ next_billing_date inválido:', next_billing_date);
            return new Response(
                JSON.stringify({ 
                    success: false, 
                    error: 'Bad Request - Invalid data type: next_billing_date must be a valid date string' 
                }),
                { 
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        console.log(`[Payment Confirmed] 📧 Procesando confirmación de pago para: ${customer_email}`);
        console.log(`[Payment Confirmed] 💰 Monto: ${amount} ${currency}, Método: ${payment_method}`);

        // 5. Enviar correo de confirmación de pago
        const result = await sendPaymentConfirmationEmailInternal(
            customer_email,
            customer_name,
            amount,
            currency,
            next_billing_date,
            transaction_id,
            payment_method
        );

        if (result.success) {
            console.log(`[Payment Confirmed] ✅ Correo enviado a: ${customer_email}`);
            return new Response(
                JSON.stringify({ 
                    success: true, 
                    message: 'Payment confirmation email sent successfully' 
                }),
                { 
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        } else {
            console.error(`[Payment Confirmed] ❌ Error enviando correo:`, result.error);
            return new Response(
                JSON.stringify({ 
                    success: false, 
                    error: result.error || 'Failed to send payment confirmation email' 
                }),
                { 
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

    } catch (error) {
        console.error('[Payment Confirmed] ❌ Error inesperado:', error);
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

