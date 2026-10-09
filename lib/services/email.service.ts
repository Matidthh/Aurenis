/**
 * ============================================================================
 * AURENIS — SERVICIO DE NOTIFICACIONES CORREO INSTITUCIONAL (EMAIL SERVICE)
 * ============================================================================
 * Autores: Maicol R. (Backend Lead) & Frank M. (Seguridad & Plantillas HTML)
 * 
 * Misión:
 * 1. Formatea y despacha correos electrónicos institucionales seguros.
 * 2. Soporta envío de enlaces de restablecimiento de contraseña con expiración.
 * ============================================================================
 */

export interface PasswordResetEmailInput {
  email: string;
  recipientName: string;
  resetUrl: string;
  expiresMinutes: number;
}

export interface EmailDispatchResult {
  sent: boolean;
  messageId: string;
  previewUrl?: string;
}

/**
 * Genera la plantilla HTML institucional para recuperación de clave.
 */
function buildPasswordResetHtmlTemplate(input: PasswordResetEmailInput): string {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Restablecimiento de Contraseña — Aurenis</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 0; }
        .container { max-width: 580px; margin: 30px auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .header { background-color: #0a1128; padding: 24px; text-align: center; color: #ffffff; }
        .content { padding: 32px; text-align: left; }
        .button { display: inline-block; background-color: #2563eb; color: #ffffff; font-weight: 700; text-decoration: none; padding: 14px 28px; border-radius: 12px; margin: 20px 0; text-align: center; }
        .footer { background-color: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
        .warning { background-color: #fffbebf8; border: 1px solid #fde68a; border-radius: 10px; padding: 12px 16px; font-size: 12px; color: #92400e; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin:0; font-size: 20px; font-weight: 800; letter-spacing: -0.02em;">AURENIS • Plataforma Académica</h1>
        </div>
        <div class="content">
          <h2 style="font-size: 18px; color: #0f172a; margin-top: 0;">Solicitud de Restablecimiento de Contraseña</h2>
          <p style="font-size: 14px; line-height: 1.6; color: #334155;">Hola <strong>${input.recipientName}</strong>,</p>
          <p style="font-size: 14px; line-height: 1.6; color: #334155;">
            Hemos recibido una solicitud para restablecer la contraseña de tu cuenta institucional. Haz clic en el siguiente botón para definir tu nueva clave:
          </p>
          <div style="text-align: center;">
            <a href="${input.resetUrl}" class="button" target="_blank">Restablecer Mi Contraseña</a>
          </div>
          <div class="warning">
            ⚠️ <strong>Importante:</strong> Este enlace es de un solo uso y vencerá estrictamente en <strong>${input.expiresMinutes} minutos</strong>. Si no solicitaste este cambio, puedes ignorar este correo de forma segura.
          </div>
        </div>
        <div class="footer">
          AURENIS Plataforma Escolar Multi-Tenant • Decreto Supremo N.º 67/2018
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Despacha el correo de restablecimiento de contraseña.
 */
export async function sendPasswordResetEmail(input: PasswordResetEmailInput): Promise<EmailDispatchResult> {
  const html = buildPasswordResetHtmlTemplate(input);
  const messageId = `msg_reset_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

  // En producción se integrará con el proveedor SMTP/Resend institucional
  console.log(`[EMAIL_SERVICE] Despachando correo de recuperación a: ${input.email} (MessageID: ${messageId})`);

  return {
    sent: true,
    messageId,
    previewUrl: input.resetUrl,
  };
}
