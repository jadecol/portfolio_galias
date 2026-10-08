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
    '',
    'Qué quiere validar:',
    msg || '(sin detalle adicional)',
    '',
    'Gracias.'
  ].join('\n');

  const subject = encodeURIComponent(`PRUEBA 24H - Predio ${dir} - ${ciudad} - ${tipo} - ${nombre}`);
  window.location.href = `mailto:alejandrodecozan@gmail.com?subject=${subject}&body=${encodeURIComponent(body)}`;

  document.getElementById('prueba-form').style.display = 'none';
  document.getElementById('form-success').style.display = 'block';
}

const formEl = document.getElementById('prueba-form');
if (formEl) formEl.addEventListener('submit', submitForm);
