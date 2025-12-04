import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { sendMail } from '@/lib/mailer';
import { getWelcomeBasicPlanEmail } from '@/lib/email-templates';

/**
 * 📧 SEND WELCOME EMAIL - BASIC PLAN
 * 
 * Envía el correo de bienvenida a usuarios que se registran con el plan básico (gratuito).
 * 
 * @param customerEmail - Email del cliente
 * @param customerName - Nombre del cliente
 * @returns { success: boolean, messageId?: string, error?: string }
 */
export const sendWelcomeBasicEmail = defineAction({
    accept: "json",
    input: z.object({
        customerEmail: z.string().email('El correo electrónico no es válido'),
        customerName: z.string().min(1, 'El nombre es requerido'),
    }),
    handler: async ({ customerEmail, customerName }) => {
        try {
            // Generar el HTML del correo usando el template
            const htmlContent = getWelcomeBasicPlanEmail(
                customerName,
                'https://dominicanhciclub.com/profile' // URL para actualizar a premium
            );

            const result = await sendMail({
                to: customerEmail,
                subject: '🎉 ¡Bienvenido al Dominican HCI Club! - Tu membresía básica está activa',
                html: htmlContent
            });

            if (result.success) {
                console.log(`✅ Correo de bienvenida (plan básico) enviado a: ${customerEmail}`);
                return {
                    success: true,
                    messageId: result.messageId
                };
            } else {
                console.error(`❌ Error enviando correo de bienvenida a ${customerEmail}:`, result.error);
                return {
                    success: false,
                    error: result.error
                };
            }
        } catch (error) {
            console.error('Error en sendWelcomeBasicEmail:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error desconocido'
            };
        }
    }
});

/**
 * Función helper para enviar correo de bienvenida internamente (sin definir como action)
 * Útil para llamar desde otras actions del servidor
 */
export async function sendWelcomeBasicEmailInternal(customerEmail: string, customerName: string): Promise<{
    success: boolean;
    messageId?: string;
    error?: string;
}> {
    try {
        const htmlContent = getWelcomeBasicPlanEmail(
            customerName,
            'https://dominicanhciclub.com/profile'
        );

        const result = await sendMail({
            to: customerEmail,
            subject: '🎉 ¡Bienvenido al Dominican HCI Club! - Tu membresía básica está activa',
            html: htmlContent
        });

        if (result.success) {
            console.log(`✅ Correo de bienvenida (plan básico) enviado a: ${customerEmail}`);
            return {
                success: true,
                messageId: result.messageId
            };
        } else {
            console.error(`❌ Error enviando correo de bienvenida a ${customerEmail}:`, result.error);
            return {
                success: false,
                error: result.error
            };
        }
    } catch (error) {
        console.error('Error en sendWelcomeBasicEmailInternal:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error desconocido'
        };
    }
}

