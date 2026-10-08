// Aparición al hacer scroll y borde del header
// Scroll-based fade in
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// Header sub opacity on scroll
window.addEventListener('scroll', () => {
  const h = document.querySelector('header');
  if (h) h.style.borderBottomColor = window.scrollY > 80 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.06)';
});
