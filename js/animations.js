// ── Fade-in sections on scroll ──
const fadeEls = document.querySelectorAll('section, .neu-card, .tag');
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in-view');
      fadeObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });
fadeEls.forEach(el => fadeObserver.observe(el));

// ── Active nav link highlighting ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`nav a[href="#${e.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => navObserver.observe(s));

// ── Scroll-to-top button ──
const topBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
  topBtn.classList.toggle('visible', window.scrollY > 400);
});
topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Setup succeeded — cancel the <head> failsafe that would reveal everything.
clearTimeout(window.__animFailsafe);
