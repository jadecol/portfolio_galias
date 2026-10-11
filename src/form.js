// Form submit
export function submitForm(e) {
  e.preventDefault();
  const nombre = document.getElementById('f-nombre').value;
  const email = document.getElementById('f-email').value;
  const ciudad = document.getElementById('f-ciudad').value;
  const area = document.getElementById('f-area').value;
  const dir = document.getElementById('f-dir').value;
  const tipo = document.getElementById('f-tipo').value;
  const msg = document.getElementById('f-msg').value;
  const ctlInput = document.getElementById('f-ctl');
  const hasCtl = ctlInput && ctlInput.files && ctlInput.files.length > 0;
  const ctlFileName = hasCtl ? ctlInput.files[0].name : null;

  if (!nombre || !dir || !email) { alert('Por favor completa Nombre, Email y Dirección del predio.'); return; }

  const body = [
    'Hola Julian,',
    '',
    'Solicito la PRUEBA 24H: viabilidad normativa + cabida + riesgo del siguiente predio.',
    '',
    '--- SOLICITANTE ---',
    `Nombre / Cargo: ${nombre}`,
    `Email: ${email}`,
    '',
    '--- PREDIO ---',
    `Ciudad: ${ciudad}`,
    `Dirección / Chip: ${dir}`,
    `Área aprox m2: ${area}`,
    `Tipo de proyecto: ${tipo}`,
    `Certificado de Tradición y Libertad (CTL): ${hasCtl ? `Adjunto en este correo (${ctlFileName})` : 'No adjunto / Por consultar'}`,
    '',
    'Qué quiere validar:',
    msg || '(sin detalle adicional)',
    '',
    ...(hasCtl ? ['[NOTA: Por favor recuerda adjuntar el archivo del Certificado de Tradición en la ventana de tu cliente de correo recién abierta.]', ''] : []),
    'Gracias.'
  ].join('\n');

  const subject = encodeURIComponent(`PRUEBA 24H - Predio ${dir} - ${ciudad} - ${tipo} - ${nombre}`);
  window.location.href = `mailto:alejandrodecozan@gmail.com?subject=${subject}&body=${encodeURIComponent(body)}`;

  document.getElementById('prueba-form').style.display = 'none';
  const successEl = document.getElementById('form-success');
  if (hasCtl) {
    successEl.innerHTML = `
      <div style="font-weight:700;font-size:14px;color:var(--ink);margin-bottom:8px">Se abrirá tu cliente de correo. ¡Recuerda adjuntar el archivo del Certificado de Tradición (${ctlFileName}) al enviar!</div>
      <div style="font-size:12px;color:rgba(17,24,39,0.5)">Si el cliente de correo no abrió automáticamente, escribe a alejandrodecozan@gmail.com o llama al 311 262 1281 adjuntando el documento.</div>
    `;
  }
  successEl.style.display = 'block';
}

// File input label update
const ctlInput = document.getElementById('f-ctl');
if (ctlInput) {
  ctlInput.addEventListener('change', (e) => {
    const textEl = document.getElementById('f-ctl-text');
    if (e.target.files && e.target.files.length > 0) {
      textEl.textContent = `Archivo: ${e.target.files[0].name}`;
      textEl.style.color = 'var(--gold)';
      textEl.style.fontWeight = '600';
    } else {
      textEl.textContent = 'Cargar CTL (Opcional)';
      textEl.style.color = '';
      textEl.style.fontWeight = '';
    }
  });
}

const formEl = document.getElementById('prueba-form');
if (formEl) formEl.addEventListener('submit', submitForm);
