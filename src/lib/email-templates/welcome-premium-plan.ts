/**
 * Template de correo de bienvenida para usuarios con Plan Premium
 * 
 * @param customerName - Nombre del cliente
 * @param premiumAccessUrl - URL para acceder al espacio premium
 * @returns HTML del correo
 */
export function getWelcomePremiumPlanEmail(customerName: string, premiumAccessUrl: string = '/profile-premium'): string {
    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenido al Plan Premium - Dominican HCI Club</title>
    <!--[if mso]>
    <style type="text/css">
        body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
    </style>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb;">
    
    <!-- Contenedor principal -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f9fafb;">
        <tr>
            <td align="center" style="padding: 24px 16px;">
                
                <!-- Caja de contenido -->
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
                    
                    <!-- Header con logo y badge premium -->
                    <tr>
                        <td align="center" style="padding: 32px 24px 24px 24px; border-bottom: 1px solid #e5e7eb;">
                            <h1 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 700; color: #192A6E;">Dominican HCI Club</h1>
                            <span style="display: inline-block; padding: 4px 12px; background: linear-gradient(135deg, #192A6E, #3B4D99); color: white; font-size: 12px; font-weight: 600; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px;">⭐ Miembro Premium</span>
                        </td>
                    </tr>
                    
                    <!-- Contenido principal -->
                    <tr>
                        <td style="padding: 32px 24px;">
                            
                            <!-- Saludo -->
                            <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #374151;">
                                ¡Hola <strong style="color: #192A6E;">${customerName}</strong>!
                            </p>
                            
                            <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #374151;">
                                ¡Felicidades y gracias! En nombre de todo el equipo, queremos darte una calurosa bienvenida oficial como miembro <strong style="color: #192A6E;">Premium</strong> del Dominican HCI Club.
                            </p>
                            
                            <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #374151;">
                                Has desbloqueado el <strong style="color: #192A6E;">potencial completo</strong> de nuestra comunidad. Tu compromiso con la excelencia en la Interacción Humano-Computadora te garantiza ahora un asiento de primera fila para dominar las herramientas y prácticas más innovadoras de la industria.
                            </p>
                            
                            <!-- Sección: Beneficios Premium -->
                            <h2 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: #192A6E; padding-bottom: 8px;">
                                Tu membresía premium te proporciona acceso a:
                            </h2>
                            
                            <!-- Lista de beneficios Premium -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 0 0 24px 0;">
                                <!-- Recursos ilimitados -->
                                <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
                                        <strong style="display: block; color: #192A6E; font-size: 16px; margin-bottom: 4px;">📚 Recursos ilimitados</strong>
                                        <span style="font-size: 14px; color: #6b7280;">Acceso completo a toda la biblioteca académica y material exclusivo del club.</span>
                                    </td>
                                </tr>
                                <!-- Seminarios exclusivos -->
                                <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
                                        <strong style="display: block; color: #192A6E; font-size: 16px; margin-bottom: 4px;">🎓 Seminarios exclusivos</strong>
                                        <span style="font-size: 14px; color: #6b7280;">Asistencia ilimitada a eventos, workshops Premium y acceso total a todas las grabaciones.</span>
                                    </td>
                                </tr>
                                <!-- Comunidad profesional -->
                                <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
                                        <strong style="display: block; color: #192A6E; font-size: 16px; margin-bottom: 4px;">👥 Comunidad profesional</strong>
                                        <span style="font-size: 14px; color: #6b7280;">Conexión directa con expertos del sector y acceso a canales privados de discusión.</span>
                                    </td>
                                </tr>
                                <!-- Mentoría personalizada -->
                                <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
                                        <strong style="display: block; color: #192A6E; font-size: 16px; margin-bottom: 4px;">🎯 Mentoría personalizada</strong>
                                        <span style="font-size: 14px; color: #6b7280;">Sesiones 1:1 con mentores expertos para guiar tu crecimiento profesional y revisión de proyectos.</span>
                                    </td>
                                </tr>
                                <!-- Soporte prioritario -->
                                <tr>
                                    <td style="padding: 12px 0;">
                                        <strong style="display: block; color: #192A6E; font-size: 16px; margin-bottom: 4px;">⚡ Soporte prioritario</strong>
                                        <span style="font-size: 14px; color: #6b7280;">Disfruta de respuestas rápidas y atención dedicada a todas tus consultas y necesidades.</span>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Mensaje motivacional -->
                            <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #192A6E; font-weight: 600; text-align: center;">
                                ¡Ahora no hay límites para tu crecimiento! Estamos listos para guiarte en tu camino hacia una carrera de impacto en HCI.
                            </p>
                            
                            <!-- CTA Button -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td align="center" style="padding: 16px 0;">
                                        <p style="margin: 0 0 12px 0; font-size: 18px; font-weight: 700; color: #192A6E;">
                                            Empieza a explorar tus nuevos beneficios hoy mismo.
                                        </p>
                                        <a href="${premiumAccessUrl}" style="display: inline-block; padding: 14px 28px; background-color: #ffffff; color: #192A6E; font-size: 16px; font-weight: 700; text-decoration: none; border-radius: 8px; border: 2px solid #C6C9D9; box-shadow: 0 0 0 4px rgba(198, 201, 217, 0.4);">
                                            Haz clic aquí para acceder al espacio premium
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Mensaje de cierre -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-top: 1px solid #e5e7eb; margin-top: 24px; padding-top: 16px;">
                                <tr>
                                    <td style="padding-top: 16px;">
                                        <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #374151;">
                                            Si tienes cualquier pregunta sobre cómo acceder a estos beneficios, no dudes en responder a este correo.
                                        </p>
                                        
                                        <p style="margin: 0 0 24px 0; font-size: 16px; font-weight: 700; color: #192A6E;">
                                            ¡A diseñar el futuro juntos!
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
                                Este correo fue enviado a ti porque te suscribiste al Plan Premium.
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

