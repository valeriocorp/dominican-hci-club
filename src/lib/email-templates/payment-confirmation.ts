/**
 * Template de correo de confirmación de pago de membresía Premium
 * 
 * Se envía cuando se procesa exitosamente un pago de suscripción.
 * Incluye:
 * - Confirmación del pago recibido
 * - Monto y método de pago
 * - ID de transacción para referencia
 * - Fecha del próximo cobro
 * 
 * @param customerName - Nombre del cliente
 * @param amount - Monto del pago
 * @param currency - Moneda del pago (USD o DOP)
 * @param nextBillingDate - Fecha del próximo cobro (ISO string)
 * @param transactionId - ID de referencia de la transacción
 * @param paymentMethod - Método de pago utilizado
 * @returns HTML del correo
 */
export function getPaymentConfirmationEmail(
    customerName: string,
    amount: number,
    currency: string,
    nextBillingDate: string,
    transactionId: string,
    paymentMethod: string
): string {
    // Formatear el monto con símbolo de moneda
    const currencySymbol = currency.toUpperCase() === 'USD' ? '$' : 'RD$';
    const formattedAmount = `${currencySymbol}${amount.toFixed(2)} ${currency.toUpperCase()}`;

    // Formatear la fecha del próximo cobro
    let formattedNextBillingDate = nextBillingDate;
    try {
        const date = new Date(nextBillingDate);
        if (!isNaN(date.getTime())) {
            formattedNextBillingDate = date.toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        }
    } catch {
        // Si falla el parseo, usar la fecha tal cual
    }

    // Mapear método de pago a texto legible
    const paymentMethodMap: Record<string, string> = {
        'card': 'Tarjeta de Crédito/Débito',
        'paypal': 'PayPal',
        'bank_transfer': 'Transferencia Bancaria',
        'cash': 'Efectivo',
        'sepa_debit': 'Débito SEPA',
        'us_bank_account': 'Cuenta Bancaria US'
    };
    const formattedPaymentMethod = paymentMethodMap[paymentMethod.toLowerCase()] || paymentMethod;

    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmación de Pago - Dominican HCI Club</title>
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
                    
                    <!-- Icono de check y título -->
                    <tr>
                        <td align="center" style="padding: 32px 24px 16px 24px;">
                            <!-- Icono de check verde -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td align="center" style="width: 64px; height: 64px; background-color: #10B981; border-radius: 50%;">
                                        <span style="font-size: 32px; color: #ffffff;">✓</span>
                                    </td>
                                </tr>
                            </table>
                            <h2 style="margin: 24px 0 0 0; font-size: 24px; font-weight: 700; color: #192A6E;">
                                ¡Pago Recibido!
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
                                Hemos recibido tu pago exitosamente. Gracias por continuar siendo parte de la comunidad Premium del Dominican HCI Club. Tu apoyo nos ayuda a seguir creciendo y ofreciendo contenido de calidad.
                            </p>
                            
                            <!-- Caja de detalles del pago -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f0fdf4; border: 2px solid #10B981; border-radius: 8px; margin-bottom: 24px;">
                                <tr>
                                    <td style="padding: 24px;">
                                        <p style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #192A6E; text-align: center;">
                                            Detalles de la Transacción
                                        </p>
                                        
                                        <!-- Tabla de detalles -->
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                            <tr>
                                                <td style="padding: 8px 0; border-bottom: 1px solid #d1fae5;">
                                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                                        <tr>
                                                            <td style="font-size: 14px; color: #6b7280; width: 50%;">Monto:</td>
                                                            <td style="font-size: 16px; font-weight: 700; color: #10B981; text-align: right;">${formattedAmount}/mes</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0; border-bottom: 1px solid #d1fae5;">
                                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                                        <tr>
                                                            <td style="font-size: 14px; color: #6b7280; width: 50%;">Método de Pago:</td>
                                                            <td style="font-size: 14px; font-weight: 600; color: #374151; text-align: right;">${formattedPaymentMethod}</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0; border-bottom: 1px solid #d1fae5;">
                                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                                        <tr>
                                                            <td style="font-size: 14px; color: #6b7280; width: 50%;">ID de Transacción:</td>
                                                            <td style="font-size: 12px; font-weight: 500; color: #374151; text-align: right; word-break: break-all;">${transactionId}</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0;">
                                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                                        <tr>
                                                            <td style="font-size: 14px; color: #6b7280; width: 50%;">Próximo Cobro:</td>
                                                            <td style="font-size: 14px; font-weight: 600; color: #192A6E; text-align: right;">${formattedNextBillingDate}</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Recordatorio de beneficios -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 24px;">
                                <tr>
                                    <td style="padding: 24px;">
                                        <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #192A6E;">
                                            Recuerda que como miembro Premium tienes acceso a:
                                        </p>
                                        
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                            <tr>
                                                <td style="padding: 6px 0; font-size: 14px; line-height: 1.6; color: #374151;">
                                                    ✨ Recursos exclusivos y contenido premium
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 6px 0; font-size: 14px; line-height: 1.6; color: #374151;">
                                                    🎓 Eventos y talleres especializados
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 6px 0; font-size: 14px; line-height: 1.6; color: #374151;">
                                                    💬 Acceso completo a la comunidad
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 6px 0; font-size: 14px; line-height: 1.6; color: #374151;">
                                                    🎯 Soporte prioritario
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Mensaje de cierre -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-top: 1px solid #e5e7eb; padding-top: 16px;">
                                <tr>
                                    <td style="padding-top: 16px;">
                                        <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: #6b7280;">
                                            Si tienes alguna pregunta sobre tu pago o membresía, no dudes en contactarnos respondiendo a este correo.
                                        </p>
                                        
                                        <p style="margin: 0 0 24px 0; font-size: 16px; font-weight: 700; color: #192A6E;">
                                            ¡Gracias por ser parte de nuestra comunidad!
                                        </p>
                                        
                                        <p style="margin: 0; font-size: 16px; color: #374151;">
                                            Atentamente,
                                        </p>
                                        <p style="margin: 4px 0 0 0; font-size: 16px; font-weight: 600; color: #192A6E;">
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
                                Este correo fue enviado como confirmación de tu pago de membresía premium.
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

