import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { sendMail } from '@/lib/mailer';
import { getPaymentConfirmationEmail } from '@/lib/email-templates';

/**
 * 📧 SEND PAYMENT CONFIRMATION EMAIL ACTION
 * 
 * Envía un correo de confirmación de pago de membresía premium.
 * Se usa cuando se procesa exitosamente un pago recurrente de suscripción.
 * 
 * Este action puede ser llamado:
 * 1. Directamente desde el frontend (si detecta el pago)
 * 2. Desde el endpoint API que recibe webhooks del backend
 */
export const sendPaymentConfirmationEmail = defineAction({
    accept: "json",
    input: z.object({
        customer_email: z.string().email('El correo electrónico no es válido'),
        customer_name: z.string().min(1, 'El nombre es requerido'),
        amount: z.number().positive('El monto debe ser positivo'),
        currency: z.string().min(1, 'La moneda es requerida'),
        next_billing_date: z.string().min(1, 'La fecha del próximo cobro es requerida'),
        transaction_id: z.string().min(1, 'El ID de transacción es requerido'),
        payment_method: z.string().min(1, 'El método de pago es requerido'),
    }),
    handler: async (input) => {
        const { 
            customer_email, 
            customer_name, 
            amount, 
            currency, 
            next_billing_date, 
            transaction_id, 
            payment_method 
        } = input;

        try {
            const emailHtml = getPaymentConfirmationEmail(
                customer_name,
                amount,
                currency,
                next_billing_date,
                transaction_id,
                payment_method
            );

            const result = await sendMail({
                to: customer_email,
                subject: 'Confirmación de Pago - Dominican HCI Club',
                html: emailHtml,
            });

            if (!result.success) {
                console.error('Error enviando correo de confirmación de pago:', result.error);
                return {
                    success: false,
                    message: 'Error al enviar el correo de confirmación de pago',
                    error: result.error,
                };
            }

            console.log(`📧 Correo de confirmación de pago enviado a: ${customer_email}`);

            return {
                success: true,
                message: 'Correo de confirmación de pago enviado exitosamente',
                messageId: result.messageId,
            };

        } catch (error) {
            console.error('Error inesperado enviando correo de confirmación de pago:', error);
            return {
                success: false,
                message: 'Error inesperado al enviar el correo',
                error: error instanceof Error ? error.message : 'Error desconocido',
            };
        }
    }
});

/**
 * 📧 SEND PAYMENT CONFIRMATION EMAIL (INTERNAL)
 * 
 * Función helper para enviar correo de confirmación de pago desde otros módulos del servidor.
 * No requiere pasar por el sistema de actions de Astro.
 * 
 * Útil para ser llamada desde:
 * - Endpoints API
 * - Otros actions
 * - Webhooks internos
 * 
 * @param email - Correo del cliente
 * @param name - Nombre del cliente
 * @param amount - Monto del pago
 * @param currency - Moneda del pago (USD o DOP)
 * @param nextBillingDate - Fecha del próximo cobro
 * @param transactionId - ID de referencia de la transacción
 * @param paymentMethod - Método de pago utilizado
 */
export async function sendPaymentConfirmationEmailInternal(
    email: string,
    name: string,
    amount: number,
    currency: string,
    nextBillingDate: string,
    transactionId: string,
    paymentMethod: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const emailHtml = getPaymentConfirmationEmail(
            name,
            amount,
            currency,
            nextBillingDate,
            transactionId,
            paymentMethod
        );

        const result = await sendMail({
            to: email,
            subject: 'Confirmación de Pago - Dominican HCI Club',
            html: emailHtml,
        });

        return {
            success: result.success,
            error: result.error,
        };

    } catch (error) {
        console.error('Error en sendPaymentConfirmationEmailInternal:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error desconocido',
        };
    }
}

