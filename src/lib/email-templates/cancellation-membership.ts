/**
 * Template de correo de cancelación de membresía Premium
 * 
 * Se envía cuando un usuario cancela su membresía premium.
 * Incluye:
 * - Confirmación de la cancelación
 * - Fecha hasta la cual mantiene beneficios premium
 * - Aviso de fin de membresía al terminar el ciclo
 * - Invitación a regresar
 * 
 * @param customerName - Nombre del cliente
 * @param premiumEndDate - Fecha de finalización del período premium actual
 * @returns HTML del correo
 */
export function getCancellationMembershipEmail(
    customerName: string, 
    premiumEndDate: string
): string {
    // Formatear la fecha si viene en formato ISO
    let formattedDate = premiumEndDate;
    try {
        const date = new Date(premiumEndDate);
        if (!isNaN(date.getTime())) {
            formattedDate = date.toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        }
    } catch {
        // Si falla el parseo, usar la fecha tal cual
    }

    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cancelación de Membresía - Dominican HCI Club</title>
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
                    
                    <!-- Título principal -->
                    <tr>
                        <td align="center" style="padding: 32px 24px 16px 24px;">
                            <h2 style="margin: 0; font-size: 24px; font-weight: 700; color: #192A6E;">
                                Lamentamos verte partir
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
                                Hemos procesado la solicitud de cancelación de tu plan Premium. Sentimos mucho que decidas tomar un camino diferente y queremos que sepas que siempre tendrás un lugar en la comunidad del Dominican HCI Club.
                            </p>
                            
                            <!-- Caja de información de fin de membresía -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 32px;">
                                <tr>
                                    <td style="padding: 24px;">
                                        <p style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #192A6E; text-align: center;">
                                            Tu membresía finalizará el <span style="text-decoration: underline;">${formattedDate}</span>.
                                        </p>

                                        <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #4b5563;">
                                            Mantendrás el acceso completo a todos los beneficios Premium hasta el final de tu ciclo de facturación actual (<strong style="color: #192A6E;">${formattedDate}</strong>). A partir de esa fecha, tu membresía quedará cerrada y no se generarán nuevos cobros. Podrás reactivarla cuando quieras para recuperar el acceso al club.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Mensaje de esperanza -->
                            <p style="margin: 0 0 24px 0; font-size: 16px; font-weight: 600; color: #192A6E; text-align: center;">
                                Esperamos que sigas encontrando valor en nuestro espacio.
                            </p>
                            
                            <!-- Mensaje de feedback -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-top: 1px solid #e5e7eb; padding-top: 16px;">
                                <tr>
                                    <td style="padding-top: 16px;">
                                        <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: #6b7280;">
                                            Si la cancelación se debe a un problema o si deseas compartir tus comentarios, por favor responde a este correo. Siempre estamos buscando mejorar.
                                        </p>
                                        
                                        <p style="margin: 0 0 24px 0; font-size: 16px; font-weight: 700; color: #192A6E;">
                                            ¡Te deseamos lo mejor en tu desarrollo profesional!
                                        </p>
                                        
                                        <p style="margin: 0; font-size: 16px; color: #374151;">
                                            Atentamente,
                                        </p>
                                        <p style="margin: 4px 0 0 0; font-size: 16px; font-weight: 600; color: #192A6E;">
                                            Marilenny Soriano
                                        </p>
                                        <p style="margin: 0; font-size: 14px; color: #6b7280;">
                                            Fundadora
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
                                Este correo fue enviado porque solicitaste la cancelación de tu membresía premium.
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

