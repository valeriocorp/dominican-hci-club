import { defineAction } from 'astro:actions';
import { sendMail } from '@/lib/mailer';

export const sendTestEmail = defineAction({
    accept: "json",
    handler: async () => {
        try {
            const result = await sendMail({
                to: 'franciscojvg0607@gmail.com',
                subject: '🧪 Correo de prueba - Dominican HCI Club',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h1 style="color: #6366f1; text-align: center;">✅ ¡El mailer funciona correctamente!</h1>
                        <p style="font-size: 16px; color: #333; line-height: 1.6;">
                            Este es un correo de prueba enviado desde <strong>Dominican HCI Club</strong> 
                            para verificar que la configuración de nodemailer con OAuth2 está funcionando correctamente.
                        </p>
                        <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 20px; border-radius: 10px; margin: 20px 0;">
                            <p style="color: white; margin: 0; text-align: center; font-size: 18px;">
                                📧 Configuración OAuth2 verificada
                            </p>
                        </div>
                        <p style="font-size: 14px; color: #666; text-align: center;">
                            Enviado el: ${new Date().toLocaleString('es-DO', { timeZone: 'America/Santo_Domingo' })}
                        </p>
                    </div>
                `
            });

            if (result.success) {
                return {
                    success: true,
                    message: `✅ Correo enviado exitosamente. ID: ${result.messageId}`
                };
            } else {
                return {
                    success: false,
                    message: `❌ Error al enviar: ${result.error}`
                };
            }
        } catch (error) {
            console.error('Error en sendTestEmail:', error);
            return {
                success: false,
                message: `❌ Error inesperado: ${error instanceof Error ? error.message : 'Error desconocido'}`
            };
        }
    }
});

