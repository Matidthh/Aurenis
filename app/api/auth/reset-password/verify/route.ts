export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyResetToken, resetPasswordWithToken } from "@/lib/services/recovery.service";
import {
  checkRateLimit,
  getClientIdentifier,
  getRateLimitHeaders,
  RATE_LIMIT_CONFIGS,
} from "@/lib/security/rate-limiter";
import { apiSuccess, apiError } from "@/lib/api/response";

/**
 * ============================================================================
 * ENDPOINT Y MIDDLEWARE DE VERIFICACIÓN DE RESTABLECIMIENTO DE CONTRASEÑA
 * RUTA: `/api/auth/reset-password/verify`
 * ============================================================================
 * Autores:
 * - Maicol R. (Backend, Arquitectura de Autenticación)
 * - Frank M. (Seguridad, QA & Prevención de Fuerza Bruta)
 * - Lucas P. (UI/UX en HTML fallback)
 *
 * Misión:
 * 1. Acepta y valida el token enviado por correo electrónico contra la tabla `PasswordResetToken`.
 * 2. Verifica vigencia (expiración de 15 minutos) y que no haya sido utilizado previamente.
 * 3. Si la petición proviene de un navegador web directo, renderiza una interfaz interactiva
 *    para actualizar la contraseña de forma segura.
 * 4. Si es una petición API JSON (GET/POST), retorna los objetos estructurados de validación.
 * ============================================================================
 */

const ResetVerifyBodySchema = z.object({
  token: z.string().min(32, "El token de restablecimiento debe tener al menos 32 caracteres"),
  newPassword: z.string().min(8, "La nueva contraseña debe tener al menos 8 caracteres"),
});

/**
 * Genera una página HTML elegante y funcional para cuando el usuario hace clic directo en el enlace.
 */
function renderResetPasswordHtml(token: string, valid: boolean, reasonMessage?: string, expiresAt?: Date): string {
  const isExpiredOrInvalid = !valid;

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AURENIS — Restablecimiento de Contraseña</title>
  <style>
    :root {
      --primary: #0284c7;
      --primary-hover: #0369a1;
      --bg-dark: #0f172a;
      --card-bg: #1e293b;
      --text-light: #f8fafc;
      --text-muted: #94a3b8;
      --border: #334155;
      --danger: #ef4444;
      --success: #10b981;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    body { background: var(--bg-dark); color: var(--text-light); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 1.5rem; }
    .card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 1rem; width: 100%; max-width: 440px; padding: 2rem; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
    .logo { text-align: center; margin-bottom: 1.5rem; font-size: 1.5rem; font-weight: 800; letter-spacing: -0.025em; color: #38bdf8; }
    .title { font-size: 1.25rem; font-weight: 700; text-align: center; margin-bottom: 0.5rem; }
    .subtitle { font-size: 0.875rem; color: var(--text-muted); text-align: center; margin-bottom: 1.5rem; }
    .alert { padding: 1rem; border-radius: 0.5rem; margin-bottom: 1.5rem; font-size: 0.875rem; line-height: 1.4; text-align: center; }
    .alert-danger { background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3); color: #fca5a5; }
    .alert-success { background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); color: #6ee7b7; display: none; }
    .form-group { margin-bottom: 1.25rem; }
    label { display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.5rem; color: var(--text-light); }
    input { width: 100%; padding: 0.75rem 1rem; background: #0f172a; border: 1px solid var(--border); border-radius: 0.5rem; color: #fff; font-size: 0.95rem; outline: none; transition: border-color 0.2s; }
    input:focus { border-color: var(--primary); }
    button { width: 100%; padding: 0.875rem; background: var(--primary); color: #fff; border: none; border-radius: 0.5rem; font-weight: 600; font-size: 1rem; cursor: pointer; transition: background 0.2s; }
    button:hover { background: var(--primary-hover); }
    button:disabled { opacity: 0.5; cursor: not-allowed; }
    .footer-link { display: block; text-align: center; margin-top: 1.5rem; color: var(--text-muted); font-size: 0.875rem; text-decoration: none; }
    .footer-link:hover { color: #38bdf8; text-decoration: underline; }
    .badge-exp { display: inline-block; font-size: 0.75rem; color: #f59e0b; background: rgba(245, 158, 11, 0.1); padding: 0.25rem 0.5rem; border-radius: 0.25rem; margin-top: 0.5rem; }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">✦ AURENIS</div>
    
    ${isExpiredOrInvalid ? `
      <div class="title">Enlace No Válido o Expirado</div>
      <p class="subtitle">El token de restablecimiento no puede ser procesado.</p>
      <div class="alert alert-danger">${reasonMessage || "El enlace ha expirado (límite 15 min) o ya fue utilizado previamente."}</div>
      <a href="/login" class="footer-link">← Regresar al inicio de sesión</a>
    ` : `
      <div class="title">Restablecer Contraseña</div>
      <p class="subtitle">Ingrese su nueva clave de acceso para su cuenta institucional.</p>
      
      <div id="statusAlert" class="alert alert-danger" style="display: none;"></div>
      <div id="successAlert" class="alert alert-success">¡Contraseña actualizada exitosamente! Redirigiendo al inicio de sesión...</div>

      <form id="resetForm" onsubmit="handleReset(event)">
        <div class="form-group">
          <label for="newPassword">Nueva Contraseña</label>
          <input type="password" id="newPassword" name="newPassword" required minlength="8" placeholder="Mínimo 8 caracteres" autocomplete="new-password" />
        </div>
        <div class="form-group">
          <label for="confirmPassword">Confirmar Nueva Contraseña</label>
          <input type="password" id="confirmPassword" name="confirmPassword" required minlength="8" placeholder="Repita la nueva contraseña" autocomplete="new-password" />
        </div>
        <button type="submit" id="submitBtn">Guardar Nueva Contraseña</button>
      </form>
      <a href="/login" class="footer-link">Cancelar y volver al inicio de sesión</a>

      <script>
        async function handleReset(e) {
          e.preventDefault();
          const p1 = document.getElementById('newPassword').value;
          const p2 = document.getElementById('confirmPassword').value;
          const alert = document.getElementById('statusAlert');
          const successAlert = document.getElementById('successAlert');
          const btn = document.getElementById('submitBtn');

          if (p1.length < 8) {
            alert.style.display = 'block';
            alert.textContent = 'La contraseña debe tener al menos 8 caracteres.';
            return;
          }
          if (p1 !== p2) {
            alert.style.display = 'block';
            alert.textContent = 'Las contraseñas no coinciden.';
            return;
          }

          alert.style.display = 'none';
          btn.disabled = true;
          btn.textContent = 'Guardando...';

          try {
            const res = await fetch('/api/auth/reset-password/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token: '${token}', newPassword: p1 })
            });
            const data = await res.json();

            if (!res.ok || !data.success) {
              alert.style.display = 'block';
              alert.textContent = data.error || 'Error al restablecer contraseña.';
              btn.disabled = false;
              btn.textContent = 'Guardar Nueva Contraseña';
              return;
            }

            document.getElementById('resetForm').style.display = 'none';
            successAlert.style.display = 'block';
            setTimeout(() => { window.location.href = '/login'; }, 2500);
          } catch (err) {
            alert.style.display = 'block';
            alert.textContent = 'Error de conexión. Intente nuevamente.';
            btn.disabled = false;
            btn.textContent = 'Guardar Nueva Contraseña';
          }
        }
      </script>
    `}
  </div>
</body>
</html>`;
}

/**
 * Endpoint GET: Valida el token enviando la respuesta estructurada o el formulario HTML.
 */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const acceptsHtml = req.headers.get("accept")?.includes("text/html");

  if (!token || typeof token !== "string" || token.trim().length < 32) {
    if (acceptsHtml) {
      return new NextResponse(renderResetPasswordHtml("", false, "Token de restablecimiento no proporcionado o inválido."), {
        status: 400,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }
    return apiError("Token de restablecimiento inválido o no proporcionado.", "INVALID_TOKEN", {
      statusCode: 400,
    });
  }

  const verifyResult = await verifyResetToken(token);

  if (!verifyResult.valid) {
    if (acceptsHtml) {
      return new NextResponse(renderResetPasswordHtml(token, false, verifyResult.reason), {
        status: 400,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }
    return apiError(verifyResult.reason || "El enlace de restablecimiento es inválido o ha expirado.", "TOKEN_EXPIRED", {
      statusCode: 400,
    });
  }

  if (acceptsHtml) {
    return new NextResponse(renderResetPasswordHtml(token, true, undefined, verifyResult.expiresAt), {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  return apiSuccess({
    valid: true,
    expiresAt: verifyResult.expiresAt?.toISOString(),
    email: verifyResult.email,
    message: "Token válido. Ingrese su nueva contraseña.",
  });
}

/**
 * Endpoint POST: Aplica el cambio de contraseña de forma segura si el token es válido.
 */
export async function POST(req: NextRequest) {
  const clientIp = getClientIdentifier(req);
  const rateLimitKey = `password_reset:${clientIp}`;

  // Rate limiting específico para prevención de fuerza bruta
  const rateLimitResult = await checkRateLimit(rateLimitKey, RATE_LIMIT_CONFIGS.PASSWORD_RESET);
  if (!rateLimitResult.allowed) {
    return apiError(rateLimitResult.message || "Demasiados intentos. Por favor espere unos minutos.", "TOO_MANY_REQUESTS", {
      statusCode: 429,
      headers: getRateLimitHeaders(rateLimitResult),
    });
  }

  try {
    let token = "";
    let newPassword = "";

    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      token = String(formData.get("token") || "");
      newPassword = String(formData.get("newPassword") || formData.get("password") || "");
    } else {
      const body = await req.json();
      token = body.token;
      newPassword = body.newPassword || body.password;
    }

    const validated = ResetVerifyBodySchema.safeParse({ token, newPassword });

    if (!validated.success) {
      return apiError("Datos de entrada inválidos para el restablecimiento.", "VALIDATION_ERROR", {
        statusCode: 400,
        details: validated.error.flatten(),
      });
    }

    const ipAddress = clientIp.replace("ip:", "").replace(/^user:[^:]+:/, "");
    const userAgent = req.headers.get("user-agent") || undefined;

    // Ejecutar restablecimiento seguro
    const result = await resetPasswordWithToken(validated.data.token, validated.data.newPassword, {
      ipAddress,
      userAgent,
    });

    return apiSuccess(
      { success: true, message: result.message },
      {
        status: 200,
        message: "Contraseña actualizada exitosamente. Ya puede iniciar sesión con su nueva clave.",
      }
    );
  } catch (err: any) {
    return apiError(err.message || "No se pudo restablecer la contraseña.", "RESET_FAILED", {
      statusCode: 400,
    });
  }
}
