/**
 * Template de correo de bienvenida para usuarios con Plan Básico (gratuito)
 * 
 * @param customerName - Nombre del cliente
 * @param upgradeUrl - URL para actualizar a premium (opcional)
 * @returns HTML del correo
 */
export function getWelcomeBasicPlanEmail(customerName: string, upgradeUrl: string = '/profile'): string {
    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenido al Dominican HCI Club</title>
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
                    
                    <!-- Header con logo -->
                    <tr>
                        <td align="center" style="padding: 32px 24px 24px 24px; border-bottom: 1px solid #e5e7eb;">
                            <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #192A6E;">Dominican HCI Club</h1>
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
                                ¡En nombre de todo el equipo, te damos la más cordial bienvenida al Dominican HCI Club! Estamos emocionados de tenerte como parte de nuestra creciente comunidad dedicada a la Interacción Humano-Computadora.
                            </p>
                            
                            <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #374151;">
                                Has dado un paso importante para conectar con profesionales y entusiastas en el país y expandir tus conocimientos en un campo que está definiendo el futuro digital.
                            </p>
                            
                            <!-- Sección: Plan Básico -->
                            <h2 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #192A6E; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">
                                Tu plan de membresía cuenta con un acceso básico
                            </h2>
                            
                            <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #374151;">
                                Con tu registro has obtenido inmediatamente acceso a los siguientes beneficios para ayudarte a dar tus primeros pasos y a mantenerte conectado:
                            </p>
                            
                            <!-- Lista de beneficios -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 0 0 24px 0;">
                                <tr>
                                    <td style="padding: 8px 0 8px 16px; font-size: 15px; line-height: 1.6; color: #374151;">
                                        • <strong style="color: #192A6E;">Acceso a recursos limitados:</strong> tendrás acceso a una selección curada de contenidos fundamentales para iniciarte en el mundo de la investigación y diseño de experiencia de usuario.
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0 8px 16px; font-size: 15px; line-height: 1.6; color: #374151;">
                                        • <strong style="color: #192A6E;">Asistencia a eventos limitados:</strong> podrás asistir a eventos en línea y/o presenciales designados.
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0 8px 16px; font-size: 15px; line-height: 1.6; color: #374151;">
                                        • <strong style="color: #192A6E;">Comunidad limitada:</strong> participarás en nuestro canal general para recibir los beneficios anteriores y mantenerte al tanto de las novedades del club.
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0 8px 16px; font-size: 15px; line-height: 1.6; color: #374151;">
                                        • <strong style="color: #192A6E;">Soporte:</strong> cuentas con acceso a soporte general por correo electrónico y WhatsApp para consultas básicas sobre la membresía y actividades.
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Sección: Plan Premium -->
                            <h2 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #192A6E; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">
                                Y no olvides que siempre puedes pasar a un siguiente nivel: Descubre el plan premium
                            </h2>
                            
                            <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #374151;">
                                Si tu meta es acelerar tus conocimientos, dominar las últimas herramientas y adquirir experiencia con proyectos de diseño innovadores, te invitamos a considerar el <strong style="color: #192A6E;">Plan Premium</strong>.
                            </p>
                            
                            <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #374151;">
                                Mientras que el plan básico te permite explorar, la membresía premium desbloquea el <strong style="color: #192A6E;">potencial completo</strong> de nuestra comunidad, eliminando todas las limitaciones y permitiéndote que practiques lo que necesites, nosotros guiándote.
                            </p>
                            
                            <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #374151; font-weight: 600;">
                                <strong style="color: #192A6E;">No dejes que las limitaciones frenen tu crecimiento.</strong> El Plan Premium está diseñado para convertir tu interés en una experiencia profesional de impacto.
                            </p>
                            
                            <!-- CTA Button -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td align="center" style="padding: 16px 0;">
                                        <p style="margin: 0 0 12px 0; font-size: 18px; font-weight: 700; color: #192A6E;">
                                            ¡Actualiza tu membresía hoy y transforma tu futuro en HCI!
                                        </p>
                                        <a href="${upgradeUrl}" style="display: inline-block; padding: 14px 28px; background-color: #EFEFF4; color: #192A6E; font-size: 16px; font-weight: 700; text-decoration: none; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                                            Haz clic aquí para ver las ventajas premium
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Mensaje de cierre -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-top: 1px solid #e5e7eb; margin-top: 24px; padding-top: 16px;">
                                <tr>
                                    <td style="padding-top: 16px;">
                                        <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #374151;">
                                            Si tienes cualquier pregunta sobre cómo empezar o cómo aprovechar al máximo tu Plan Básico, no dudes en responder a este correo.
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
                                Este correo fue enviado a ti porque te registraste en nuestra plataforma.
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

