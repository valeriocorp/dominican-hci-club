import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { sendMail } from '@/lib/mailer';
import { getCancellationMembershipEmail } from '@/lib/email-templates';

/**
 * 📧 SEND CANCELLATION EMAIL ACTION
 * 
 * Envía un correo de confirmación de cancelación de membresía premium.
 * Se usa cuando un usuario cancela su membresía premium.
 * 
 * Este action puede ser llamado:
 * 1. Directamente desde el frontend (si detecta la cancelación)
 * 2. Desde el endpoint API que recibe webhooks del backend
 */
export const sendCancellationEmail = defineAction({
    accept: "json",
    input: z.object({
        customer_email: z.string().email('El correo electrónico no es válido'),
        customer_name: z.string().min(1, 'El nombre es requerido'),
        premium_end_date: z.string().min(1, 'La fecha de finalización es requerida'),
    }),
    handler: async (input) => {
        const { customer_email, customer_name, premium_end_date } = input;

        try {
            const emailHtml = getCancellationMembershipEmail(
                customer_name,
                premium_end_date
            );

            const result = await sendMail({
                to: customer_email,
                subject: 'Confirmación de Cancelación - Dominican HCI Club',
                html: emailHtml,
            });

            if (!result.success) {
                console.error('Error enviando correo de cancelación:', result.error);
                return {
                    success: false,
                    message: 'Error al enviar el correo de cancelación',
                    error: result.error,
                };
            }

            console.log(`📧 Correo de cancelación enviado a: ${customer_email}`);

            return {
                success: true,
                message: 'Correo de cancelación enviado exitosamente',
                messageId: result.messageId,
            };

        } catch (error) {
            console.error('Error inesperado enviando correo de cancelación:', error);
            return {
                success: false,
                message: 'Error inesperado al enviar el correo',
                error: error instanceof Error ? error.message : 'Error desconocido',
            };
        }
    }
});

/**
 * 📧 SEND CANCELLATION EMAIL (INTERNAL)
 * 
 * Función helper para enviar correo de cancelación desde otros módulos del servidor.
 * No requiere pasar por el sistema de actions de Astro.
 * 
 * Útil para ser llamada desde:
 * - Endpoints API
 * - Otros actions
 * - Webhooks internos
 * 
 * @param email - Correo del cliente
 * @param name - Nombre del cliente
 * @param premiumEndDate - Fecha de finalización del período premium
 */
export async function sendCancellationEmailInternal(
    email: string,
    name: string,
    premiumEndDate: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const emailHtml = getCancellationMembershipEmail(name, premiumEndDate);

        const result = await sendMail({
            to: email,
            subject: 'Confirmación de Cancelación - Dominican HCI Club',
            html: emailHtml,
        });

        return {
            success: result.success,
            error: result.error,
        };

    } catch (error) {
        console.error('Error en sendCancellationEmailInternal:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error desconocido',
        };
    }
}

