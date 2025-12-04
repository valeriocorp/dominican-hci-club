import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { sendMail } from '@/lib/mailer';
import { getWelcomePremiumPlanEmail } from '@/lib/email-templates';

/**
 * 📧 SEND WELCOME EMAIL - PREMIUM PLAN
 * 
 * Envía el correo de bienvenida a usuarios que se suscriben al plan Premium.
 * 
 * @param customerEmail - Email del cliente
 * @param customerName - Nombre del cliente
 * @returns { success: boolean, messageId?: string, error?: string }
 */
export const sendWelcomePremiumEmail = defineAction({
    accept: "json",
    input: z.object({
        customerEmail: z.string().email('El correo electrónico no es válido'),
        customerName: z.string().min(1, 'El nombre es requerido'),
    }),
    handler: async ({ customerEmail, customerName }) => {
        try {
            // Generar el HTML del correo usando el template
            const htmlContent = getWelcomePremiumPlanEmail(
                customerName,
                'https://dominicanhciclub.com/profile-premium' // URL para acceder al espacio premium
            );

            const result = await sendMail({
                to: customerEmail,
                subject: '⭐ ¡Bienvenido al Plan Premium! - Dominican HCI Club',
                html: htmlContent
            });

            if (result.success) {
                console.log(`✅ Correo de bienvenida (plan premium) enviado a: ${customerEmail}`);
                return {
                    success: true,
                    messageId: result.messageId
                };
            } else {
                console.error(`❌ Error enviando correo de bienvenida premium a ${customerEmail}:`, result.error);
                return {
                    success: false,
                    error: result.error
                };
            }
        } catch (error) {
            console.error('Error en sendWelcomePremiumEmail:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error desconocido'
            };
        }
    }
});

/**
 * Función helper para enviar correo de bienvenida premium internamente (sin definir como action)
 * Útil para llamar desde otras actions del servidor (ej: webhook de Stripe)
 */
export async function sendWelcomePremiumEmailInternal(customerEmail: string, customerName: string): Promise<{
    success: boolean;
    messageId?: string;
    error?: string;
}> {
    try {
        const htmlContent = getWelcomePremiumPlanEmail(
            customerName,
            'https://dominicanhciclub.com/profile-premium'
        );

        const result = await sendMail({
            to: customerEmail,
            subject: '⭐ ¡Bienvenido al Plan Premium! - Dominican HCI Club',
            html: htmlContent
        });

        if (result.success) {
            console.log(`✅ Correo de bienvenida (plan premium) enviado a: ${customerEmail}`);
            return {
                success: true,
                messageId: result.messageId
            };
        } else {
            console.error(`❌ Error enviando correo de bienvenida premium a ${customerEmail}:`, result.error);
            return {
                success: false,
                error: result.error
            };
        }
    } catch (error) {
        console.error('Error en sendWelcomePremiumEmailInternal:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error desconocido'
        };
    }
}

