/**
 * Cloudflare Worker con soporte para Static Assets y endpoint de envío de correo /api/solicitud
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Endpoint de la solicitud
    if (url.pathname === '/api/solicitud') {
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
          }
        });
      }

      if (request.method === 'POST') {
        try {
          const contentType = request.headers.get('content-type') || '';
          if (!contentType.includes('multipart/form-data')) {
            return jsonResponse({ error: 'Formato no soportado, se requiere multipart/form-data' }, 400);
          }

          const formData = await request.formData();
          const nombre = (formData.get('nombre') || '').trim();
          const email = (formData.get('email') || '').trim();
          const ciudad = (formData.get('ciudad') || '').trim();
          const area = (formData.get('area') || '').trim();
          const dir = (formData.get('dir') || '').trim();
          const tipo = (formData.get('tipo') || '').trim();
          const msg = (formData.get('msg') || '').trim();
          const ctlFile = formData.get('ctl');

          if (!nombre || !email || !dir) {
            return jsonResponse({ error: 'Nombre, Email y Dirección del predio son obligatorios.' }, 400);
          }

          const resendApiKey = env.RESEND_API_KEY;
          if (!resendApiKey) {
            return jsonResponse({
              error: 'Falta configurar RESEND_API_KEY en las variables de entorno de Cloudflare.'
            }, 500);
          }

          // Procesar archivo adjunto si existe
          const attachments = [];
          let hasAttachment = false;
          let attachmentName = '';
          let attachmentSizeFormatted = '';

          if (ctlFile && typeof ctlFile === 'object' && ctlFile.size > 0) {
            // Límite de seguridad: 15MB
            if (ctlFile.size > 15 * 1024 * 1024) {
              return jsonResponse({ error: 'El archivo excede el tamaño máximo permitido de 15MB.' }, 400);
            }

            const arrayBuffer = await ctlFile.arrayBuffer();
            const bytes = new Uint8Array(arrayBuffer);
            const base64Content = uint8ArrayToBase64(bytes);

            attachments.push({
              filename: ctlFile.name || 'Certificado-Tradicion.pdf',
              content: base64Content
            });

            hasAttachment = true;
            attachmentName = ctlFile.name || 'Certificado-Tradicion.pdf';
            attachmentSizeFormatted = formatBytes(ctlFile.size);
          }

          // Plantilla de correo HTML elegante y ejecutiva
          const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f9fa; color: #111827; margin: 0; padding: 24px; }
    .container { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e5e7eb; overflow: hidden; box-shadow: 0 4px 14px rgba(0,0,0,0.06); }
    .header { background: #0f141c; color: #ffffff; padding: 28px 24px; border-bottom: 3px solid #d4a96a; }
    .badge { display: inline-block; font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #d4a96a; font-weight: 700; margin-bottom: 6px; }
    .title { margin: 0; font-size: 20px; font-weight: 600; color: #ffffff; }
    .content { padding: 26px 24px; font-size: 14px; line-height: 1.6; }
    .lead { font-size: 14px; color: #4b5563; margin-top: 0; margin-bottom: 20px; }
    .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #6b7280; margin-top: 22px; margin-bottom: 8px; border-bottom: 1px solid #f3f4f6; padding-bottom: 4px; }
    .data-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
    .data-table td { padding: 8px 12px; vertical-align: top; font-size: 13.5px; border-bottom: 1px solid #f9fafb; }
    .data-table td.label { font-weight: 600; color: #4b5563; width: 34%; background: #f9fafb; }
    .data-table td.value { color: #111827; }
    .attachment-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 12px 16px; margin: 16px 0; color: #166534; font-size: 13px; }
    .notes-box { background: #fcfaf7; border-left: 3px solid #d4a96a; padding: 12px 16px; margin: 12px 0; color: #334155; font-size: 13.5px; line-height: 1.5; white-space: pre-wrap; }
    .cta-center { text-align: center; margin: 28px 0 10px; }
    .reply-btn { display: inline-block; background: #0f141c; color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; font-size: 13px; }
    .footer { background: #f9fafb; padding: 16px 24px; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge">PRUEBA 24H · PORTAFOLIO</div>
      <h1 class="title">Nueva Solicitud de Viabilidad de Predio</h1>
    </div>
    <div class="content">
      <p class="lead">Se ha radicado una nueva solicitud para evaluación de viabilidad normativa, cabida y riesgo desde el portafolio:</p>
      
      <div class="section-title">Datos del Solicitante</div>
      <table class="data-table">
        <tr>
          <td class="label">Nombre / Cargo:</td>
          <td class="value"><strong>${escapeHtml(nombre)}</strong></td>
        </tr>
        <tr>
          <td class="label">Correo Electrónico:</td>
          <td class="value"><a href="mailto:${escapeHtml(email)}" style="color:#2563eb;text-decoration:none"><strong>${escapeHtml(email)}</strong></a></td>
        </tr>
      </table>

      <div class="section-title">Información del Predio</div>
      <table class="data-table">
        <tr>
          <td class="label">Dirección / CHIP:</td>
          <td class="value"><strong>${escapeHtml(dir)}</strong></td>
        </tr>
        <tr>
          <td class="label">Ciudad:</td>
          <td class="value">${escapeHtml(ciudad)}</td>
        </tr>
        <tr>
          <td class="label">Área aproximada:</td>
          <td class="value">${escapeHtml(area ? area + ' m²' : 'No especificada')}</td>
        </tr>
        <tr>
          <td class="label">Tipo de proyecto:</td>
          <td class="value">${escapeHtml(tipo)}</td>
        </tr>
      </table>

      <div class="section-title">Certificado de Tradición y Libertad (CTL)</div>
      ${hasAttachment ? `
        <div class="attachment-box">
          📎 <strong>Archivo adjunto al correo:</strong>&nbsp; ${escapeHtml(attachmentName)} (${escapeHtml(attachmentSizeFormatted)})
        </div>
      ` : `
        <p style="color:#6b7280;font-size:13px;margin:8px 0;">No se adjuntó archivo / Pendiente de consulta.</p>
      `}

      <div class="section-title">Qué quiere validar</div>
      <div class="notes-box">${escapeHtml(msg) || 'Sin detalle adicional proporcionado.'}</div>

      <div class="cta-center">
        <a href="mailto:${escapeHtml(email)}?subject=Re: PRUEBA 24H - Predio ${encodeURIComponent(dir)}" class="reply-btn">
          Responder directamente a ${escapeHtml(nombre)}
        </a>
      </div>
    </div>
    <div class="footer">
      Recibido automáticamente desde <strong>portafolio.deecozan.com</strong> · Notificación directa.
    </div>
  </div>
</body>
</html>
          `;

          const notificationEmail = env.NOTIFICATION_EMAIL || 'alejandrodecozan@gmail.com';
          const fromEmail = env.RESEND_FROM || 'Prueba 24H <solicitudes@deecozan.com>';

          const resendResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              from: fromEmail,
              to: [notificationEmail],
              reply_to: email,
              subject: `[PRUEBA 24H] Predio ${dir} - ${ciudad} - ${tipo} - ${nombre}`,
              html: emailHtml,
              attachments: attachments
            })
          });

          const resendData = await resendResponse.json();

          if (!resendResponse.ok) {
            console.error('Error de Resend API:', resendData);
            return jsonResponse({
              error: resendData.message || 'Error al enviar el correo a través de Resend.'
            }, resendResponse.status);
          }

          return jsonResponse({
            success: true,
            message: 'Solicitud enviada correctamente',
            id: resendData.id
          }, 200);

        } catch (err) {
          console.error('Error procesando /api/solicitud:', err);
          return jsonResponse({ error: err.message || 'Error interno al procesar solicitud' }, 500);
        }
      }

      return jsonResponse({ error: 'Método no permitido' }, 405);
    }

    // Servir archivos estáticos del sitio
    return env.ASSETS.fetch(request);
  }
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

function uint8ArrayToBase64(bytes) {
  let binary = '';
  const len = bytes.byteLength;
  const chunkSize = 8192;
  for (let i = 0; i < len; i += chunkSize) {
    const chunk = bytes.subarray(i, Math.min(i + chunkSize, len));
    binary += String.fromCharCode.apply(null, chunk);
  }
  return btoa(binary);
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
