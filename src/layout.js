// Responsive form grid
function checkWidth() {
  const fg = document.querySelector('.form-2col');
  if (fg) {
    const panels = document.querySelectorAll('.form-2col');
    panels.forEach(p => { p.style.gridTemplateColumns = window.innerWidth < 600 ? '1fr' : '1fr 1fr'; });
  }
  const wg = document.getElementById('form-wrapper');
  if (wg) wg.style.gridTemplateColumns = window.innerWidth < 768 ? '1fr' : '1fr 1fr';
}
window.addEventListener('resize', checkWidth);
checkWidth();
