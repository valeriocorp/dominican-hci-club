import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { sendMail } from '@/lib/mailer';
import { getPaymentFailedEmail } from '@/lib/email-templates';

/**
 * ❌ SEND PAYMENT FAILED EMAIL ACTION
 * 
 * Envía un correo de notificación cuando falla un pago de membresía premium.
 * Se usa cuando Stripe no puede procesar el pago recurrente de suscripción.
 * 
 * Este action puede ser llamado:
 * 1. Directamente desde el frontend (si detecta el fallo de pago)
 * 2. Desde el endpoint API que recibe webhooks del backend
 */
export const sendPaymentFailedEmail = defineAction({
    accept: "json",
    input: z.object({
        customer_email: z.string().email('El correo electrónico no es válido'),
        customer_name: z.string().min(1, 'El nombre es requerido'),
        amount_due: z.number().positive('El monto debe ser positivo'),
        currency: z.string().min(1, 'La moneda es requerida'),
    }),
    handler: async (input) => {
        const { 
            customer_email, 
            customer_name, 
            amount_due, 
            currency 
        } = input;

        try {
            const emailHtml = getPaymentFailedEmail(
                customer_name,
                amount_due,
                currency
            );

            const result = await sendMail({
                to: customer_email,
                subject: 'Problema con tu Pago - Dominican HCI Club',
                html: emailHtml,
            });

            if (!result.success) {
                console.error('Error enviando correo de pago fallido:', result.error);
                return {
                    success: false,
                    message: 'Error al enviar el correo de notificación de pago fallido',
                    error: result.error,
                };
            }

            console.log(`📧 Correo de pago fallido enviado a: ${customer_email}`);

            return {
                success: true,
                message: 'Correo de notificación de pago fallido enviado exitosamente',
                messageId: result.messageId,
            };

        } catch (error) {
            console.error('Error inesperado enviando correo de pago fallido:', error);
            return {
                success: false,
                message: 'Error inesperado al enviar el correo',
                error: error instanceof Error ? error.message : 'Error desconocido',
            };
        }
    }
});

/**
 * ❌ SEND PAYMENT FAILED EMAIL (INTERNAL)
 * 
 * Función helper para enviar correo de pago fallido desde otros módulos del servidor.
 * No requiere pasar por el sistema de actions de Astro.
 * 
 * Útil para ser llamada desde:
 * - Endpoints API
 * - Otros actions
 * - Webhooks internos
 * 
 * @param email - Correo del cliente
 * @param name - Nombre del cliente
 * @param amountDue - Monto adeudado del pago
 * @param currency - Moneda del pago (USD o DOP)
 */
export async function sendPaymentFailedEmailInternal(
    email: string,
    name: string,
    amountDue: number,
    currency: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const emailHtml = getPaymentFailedEmail(
            name,
            amountDue,
            currency
        );

        const result = await sendMail({
            to: email,
            subject: 'Problema con tu Pago - Dominican HCI Club',
            html: emailHtml,
        });

        return {
            success: result.success,
            error: result.error,
        };

    } catch (error) {
        console.error('Error en sendPaymentFailedEmailInternal:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error desconocido',
        };
    }
}

