import './style.css'
import './reveal.js'
import './form.js'
import './layout.js'

// Revelar contenido cuando todo esté listo (prevenir FOUC)
window.addEventListener('load', () => {
  document.documentElement.style.transition = 'opacity 0.4s ease';
  document.documentElement.style.visibility = 'visible';
  document.documentElement.style.opacity = '1';
});

// Copiar carta de postulación al portapapeles
const copyBtn = document.getElementById('btn-copy-cover');
if (copyBtn) {
  copyBtn.addEventListener('click', async () => {
    const textToCopy = `Asunto: Arquitecto de Estructuración y SIG — Postulación Julian Alejandro de Ecozan
Para: seleccion@galias.com.co

Estimado equipo de Selección de Las Galias,

Mi nombre es Julian Alejandro de Ecozan, Arquitecto Especialista en Gestión Ambiental Urbana. Escribo para presentar mi postulación oficial al cargo de Profesional Senior — Estructuración y Normativa.

A diferencia de un CV tradicional, he preparado una propuesta de valor directa y una muestra técnica de mi trabajo (basada en mis 12 años de experiencia en Planeación Municipal y la revisión directa de más de 3,000 expedientes de licenciamiento):
https://portafolio.deecozan.com

Quedo a su entera disposición para agendar una entrevista técnica.

Atentamente,

Julian Alejandro de Ecozan
Arquitecto Especialista en Gestión Ambiental Urbana
Tel: +57 311 262 1281
Email: alejandrodecozan@gmail.com`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      const span = document.getElementById('copy-cover-text');
      const copyIcon = document.getElementById('copy-icon');
      const originalText = span ? span.textContent : '';
      if (span) span.textContent = '¡Carta copiada al portapapeles!';
      if (copyIcon) copyIcon.innerHTML = '<polyline points="20 6 9 17 4 12"></polyline>';
      copyBtn.style.borderColor = 'var(--gold)';
      copyBtn.style.color = 'var(--gold)';
      setTimeout(() => {
        if (span) span.textContent = originalText;
        if (copyIcon) copyIcon.innerHTML = '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>';
        copyBtn.style.borderColor = '';
        copyBtn.style.color = '';
      }, 3000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  });
}
