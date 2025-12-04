/**
 * Template de correo de notificación de pago fallido de membresía Premium
 * 
 * Se envía cuando falla un pago de suscripción.
 * Incluye:
 * - Notificación del problema con el pago
 * - Monto adeudado
 * - Instrucciones para reintentar el pago
 * - CTA para ir al portal de pagos de Stripe
 * 
 * @param customerName - Nombre del cliente
 * @param amountDue - Monto adeudado del pago
 * @param currency - Moneda del pago (USD o DOP)
 * @returns HTML del correo
 */
export function getPaymentFailedEmail(
    customerName: string,
    amountDue: number,
    currency: string
): string {
    // Formatear el monto con símbolo de moneda
    const currencySymbol = currency.toUpperCase() === 'USD' ? '$' : 'RD$';
    const formattedAmount = `${currencySymbol}${amountDue.toFixed(2)} ${currency.toUpperCase()}`;

    // URL del portal de Stripe (el cliente puede actualizar su método de pago aquí)
    const stripePortalUrl = 'https://billing.stripe.com/p/login/28o6s97RQ9wr2li8ww';

    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Problema con tu Pago - Dominican HCI Club</title>
    <!--[if mso]>
    <style type="text/css">
        body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
    </style>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #C6C9D9;">
    
    <!-- Contenedor principal -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #C6C9D9;">
        <tr>
            <td align="center" style="padding: 24px 16px;">
                
                <!-- Caja de contenido -->
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
                    
                    <!-- Header con logo -->
                    <tr>
                        <td align="center" style="padding: 32px 24px 24px 24px; border-bottom: 1px solid #e5e7eb;">
                            <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #192A6E;">Dominican HCI Club</h1>
                        </td>
                    </tr>
                    
                    <!-- Icono de alerta y título -->
                    <tr>
                        <td align="center" style="padding: 32px 24px 16px 24px;">
                            <!-- Icono de alerta rojo -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td align="center" style="width: 64px; height: 64px; background-color: #ef4444; border-radius: 50%;">
                                        <span style="font-size: 32px; color: #ffffff;">!</span>
                                    </td>
                                </tr>
                            </table>
                            <h2 style="margin: 24px 0 0 0; font-size: 24px; font-weight: 700; color: #192A6E;">
                                Problema con tu Pago
                            </h2>
                        </td>
                    </tr>
                    
                    <!-- Contenido principal -->
                    <tr>
                        <td style="padding: 0 24px 32px 24px;">
                            
                            <!-- Saludo -->
                            <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #374151;">
                                ¡Hola <strong style="color: #192A6E;">${customerName}</strong>!
                            </p>
                            
                            <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #374151;">
                                Lamentamos informarte que no pudimos procesar tu pago de membresía Premium. Tu acceso a los beneficios exclusivos podría verse afectado pronto si no actualizas tu método de pago.
                            </p>
                            
                            <!-- Caja de alerta con detalles del pago -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #fef2f2; border: 2px solid #ef4444; border-radius: 8px; margin-bottom: 24px;">
                                <tr>
                                    <td style="padding: 24px;">
                                        <p style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #991b1b; text-align: center;">
                                            ⚠️ Pago Rechazado
                                        </p>
                                        
                                        <!-- Tabla de detalles -->
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                            <tr>
                                                <td style="padding: 8px 0; border-bottom: 1px solid #fecaca;">
                                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                                        <tr>
                                                            <td style="font-size: 14px; color: #7f1d1d; width: 50%;">Monto Adeudado:</td>
                                                            <td style="font-size: 16px; font-weight: 700; color: #ef4444; text-align: right;">${formattedAmount}</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0;">
                                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                                        <tr>
                                                            <td style="font-size: 14px; color: #7f1d1d; width: 50%;">Estado:</td>
                                                            <td style="font-size: 14px; font-weight: 600; color: #991b1b; text-align: right;">Pendiente de pago</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Instrucciones para reintentar -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 24px;">
                                <tr>
                                    <td style="padding: 24px;">
                                        <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #192A6E;">
                                            ¿Cómo resolver este problema?
                                        </p>
                                        
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                            <tr>
                                                <td style="padding: 6px 0; font-size: 14px; line-height: 1.6; color: #374151;">
                                                    <strong style="color: #192A6E;">1.</strong> Haz clic en el botón de abajo para acceder a tu portal de pagos.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 6px 0; font-size: 14px; line-height: 1.6; color: #374151;">
                                                    <strong style="color: #192A6E;">2.</strong> Verifica que tu tarjeta tenga fondos suficientes o actualiza tu método de pago.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 6px 0; font-size: 14px; line-height: 1.6; color: #374151;">
                                                    <strong style="color: #192A6E;">3.</strong> Una vez actualizado, intentaremos procesar el pago automáticamente.
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- CTA Button -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 24px;">
                                <tr>
                                    <td align="center">
                                        <a href="${stripePortalUrl}" style="display: inline-block; padding: 16px 32px; background-color: #192A6E; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(25, 42, 110, 0.3), 0 2px 4px -1px rgba(25, 42, 110, 0.2);">
                                            Haz click aquí para intentarlo nuevamente
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Nota de urgencia -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #fffbeb; border: 1px solid #f59e0b; border-radius: 8px; margin-bottom: 24px;">
                                <tr>
                                    <td style="padding: 16px;">
                                        <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #92400e;">
                                            <strong>⏰ Importante:</strong> Si no actualizas tu método de pago en los próximos días, tu membresía Premium podría ser suspendida y perderás acceso a los beneficios exclusivos.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Mensaje de cierre -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-top: 1px solid #e5e7eb; padding-top: 16px;">
                                <tr>
                                    <td style="padding-top: 16px;">
                                        <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: #6b7280;">
                                            Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos respondiendo a este correo.
                                        </p>
                                        
                                        <p style="margin: 0 0 24px 0; font-size: 16px; font-weight: 700; color: #192A6E;">
                                            ¡Estamos aquí para ayudarte!
                                        </p>
                                        
                                        <p style="margin: 0; font-size: 16px; color: #374151;">
                                            Atentamente,
                                        </p>
                                        <p style="margin: 4px 0 0 0; font-size: 16px; font-weight: 600; color: #192A6E;">
                                            Marilenny Soriano
                                        </p>
                                        <p style="margin: 4px 0 0 0; font-size: 14px; color: #6b7280;">
                                            El equipo de Dominican HCI Club
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td align="center" style="padding: 24px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
                            <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280;">
                                © ${new Date().getFullYear()} Dominican HCI Club. Todos los derechos reservados.
                            </p>
                            <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                                Este correo fue enviado como notificación de un problema con tu pago de membresía premium.
                            </p>
                        </td>
                    </tr>
                    
                </table>
                
            </td>
        </tr>
    </table>
    
</body>
</html>
    `.trim();
}

