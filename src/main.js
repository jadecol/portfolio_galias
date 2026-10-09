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
