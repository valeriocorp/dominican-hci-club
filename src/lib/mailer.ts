import nodemailer from 'nodemailer';
import type { Attachment } from 'nodemailer/lib/mailer';


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: import.meta.env.GMAIL_USER,
        clientId: import.meta.env.GMAIL_CLIENT_ID,
        clientSecret: import.meta.env.GMAIL_CLIENT_SECRET,
        refreshToken: import.meta.env.GMAIL_REFRESH_TOKEN
    }
})

interface SendMailOptions {
    to: string | string[];
    subject: string;
    html: string;
    attachments?: Attachment[];
  }
  
  interface MailResponse {
    success: boolean;
    messageId?: string;
    error?: string;
  }

  export async function sendMail({ to, subject, html, attachments = [] }: SendMailOptions): Promise<MailResponse> {
    try {
      const result = await transporter.sendMail({
        from: import.meta.env.GMAIL_USER,
        to,
        subject,
        html,
        attachments
      });
      
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Error enviando email:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  } 