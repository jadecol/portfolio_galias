// Gestor de envío del formulario de prueba 24h vía API REST (Resend + Cloudflare)

function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export async function submitForm(e) {
  e.preventDefault();

  const formEl = document.getElementById('prueba-form');
  const errorEl = document.getElementById('form-error');
  const successEl = document.getElementById('form-success');
  const btnSubmit = document.getElementById('btn-submit');
  const btnText = document.getElementById('btn-submit-text');
  const btnLoading = document.getElementById('btn-submit-loading');

  // Ocultar error previo
  if (errorEl) {
    errorEl.style.display = 'none';
    errorEl.textContent = '';
  }

  const nombre = document.getElementById('f-nombre').value.trim();
  const email = document.getElementById('f-email').value.trim();
  const ciudad = document.getElementById('f-ciudad').value;
  const area = document.getElementById('f-area').value.trim();
  const dir = document.getElementById('f-dir').value.trim();
  const tipo = document.getElementById('f-tipo').value;
  const msg = document.getElementById('f-msg').value.trim();
  const ctlInput = document.getElementById('f-ctl');

  if (!nombre || !dir || !email) {
    showError('Por favor completa Nombre, Email y Dirección / CHIP del predio.');
    return;
  }

  // Validación básica de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showError('Por favor ingresa un correo electrónico válido.');
    return;
  }

  const hasFile = ctlInput && ctlInput.files && ctlInput.files.length > 0;
  const file = hasFile ? ctlInput.files[0] : null;

  // Validación de peso de archivo (máx 15MB)
  if (file && file.size > 15 * 1024 * 1024) {
    showError(`El archivo "${file.name}" supera el límite de 15MB (${formatFileSize(file.size)}). Por favor adjunta un archivo más liviano o comparte un enlace.`);
    return;
  }

  // Preparar FormData
  const formData = new FormData();
  formData.append('nombre', nombre);
  formData.append('email', email);
  formData.append('ciudad', ciudad);
  formData.append('area', area);
  formData.append('dir', dir);
  formData.append('tipo', tipo);
  formData.append('msg', msg);
  if (file) {
    formData.append('ctl', file);
  }

  // Activar estado de carga
  setLoadingState(true);

  try {
    const response = await fetch('/api/solicitud', {
      method: 'POST',
      body: formData
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || 'Ocurrió un error al procesar tu solicitud.');
    }

    // Éxito: ocultar formulario y mostrar tarjeta de confirmación
    formEl.style.display = 'none';

    document.getElementById('succ-dir').textContent = dir;
    document.getElementById('succ-email').textContent = email;

    const fileWrap = document.getElementById('succ-file-wrap');
    const fileLabel = document.getElementById('succ-file');
    if (file) {
      fileLabel.textContent = `${file.name} (${formatFileSize(file.size)})`;
      fileWrap.style.display = 'inline';
    } else {
      fileWrap.style.display = 'none';
    }

    successEl.style.display = 'block';
    successEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  } catch (err) {
    console.error('Error enviando formulario:', err);
    showError(
      `${err.message || 'No fue posible enviar la solicitud.'} Si el problema persiste, puedes escribir directamente a alejandrodecozan@gmail.com o llamar al 311 262 1281.`
    );
  } finally {
    setLoadingState(false);
  }

  function setLoadingState(loading) {
    if (btnSubmit) {
      btnSubmit.disabled = loading;
      if (btnText) btnText.style.display = loading ? 'none' : 'inline';
      if (btnLoading) btnLoading.style.display = loading ? 'inline-flex' : 'none';
    }
  }

  function showError(message) {
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';
      errorEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      alert(message);
    }
  }
}

// Actualización visual del selector de archivos y botón de limpiar
const ctlInput = document.getElementById('f-ctl');
const clearBtn = document.getElementById('f-ctl-clear');
const textEl = document.getElementById('f-ctl-text');

if (ctlInput) {
  ctlInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      textEl.textContent = `Archivo: ${file.name} (${formatFileSize(file.size)})`;
      textEl.style.color = 'var(--gold)';
      textEl.style.fontWeight = '600';
      if (clearBtn) clearBtn.style.display = 'inline-block';
    } else {
      resetFileInput();
    }
  });
}

if (clearBtn) {
  clearBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    resetFileInput();
  });
}

function resetFileInput() {
  if (ctlInput) ctlInput.value = '';
  if (textEl) {
    textEl.textContent = 'Cargar CTL (Opcional, máx 15MB)';
    textEl.style.color = '';
    textEl.style.fontWeight = '';
  }
  if (clearBtn) clearBtn.style.display = 'none';
}

// Botón para radicar otra solicitud
const resetFormBtn = document.getElementById('btn-reset-form');
if (resetFormBtn) {
  resetFormBtn.addEventListener('click', () => {
    const formEl = document.getElementById('prueba-form');
    const successEl = document.getElementById('form-success');
    if (formEl) {
      formEl.reset();
      resetFileInput();
      formEl.style.display = 'block';
    }
    if (successEl) {
      successEl.style.display = 'none';
    }
  });
}

// Registro del evento submit
const formEl = document.getElementById('prueba-form');
if (formEl) {
  formEl.addEventListener('submit', submitForm);
}
