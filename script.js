// ELEMENT HOOKS
const enBtn = document.getElementById('langEn');
const siBtn = document.getElementById('langSi');
const themeToggle = document.getElementById('themeToggle');
const enContent = document.getElementById('englishContent');
const siContent = document.getElementById('sinhalaContent');
const downloadBtn = document.getElementById('downloadBtn');

// Safety: ensure elements exist before adding listeners
function safeAddListener(el, ev, fn) {
  if (!el) return;
  el.addEventListener(ev, fn);
}

// LANGUAGE TOGGLE
function showEnglish() {
  if (enContent) enContent.style.display = 'block';
  if (siContent) siContent.style.display = 'none';
  // accessibility
  if (enBtn) enBtn.setAttribute('aria-pressed', 'true');
  if (siBtn) siBtn.setAttribute('aria-pressed', 'false');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  try { localStorage.setItem('vcpd_lang', 'en'); } catch(e) {}
}
function showSinhala() {
  if (enContent) enContent.style.display = 'none';
  if (siContent) siContent.style.display = 'block';
  if (enBtn) enBtn.setAttribute('aria-pressed', 'false');
  if (siBtn) siBtn.setAttribute('aria-pressed', 'true');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  try { localStorage.setItem('vcpd_lang', 'si'); } catch(e) {}
}
safeAddListener(enBtn, 'click', showEnglish);
safeAddListener(siBtn, 'click', showSinhala);

// THEME TOGGLE (dark default)
function applyTheme(isDark) {
  if (isDark) {
    document.body.classList.remove('theme-dark-off');
    if (themeToggle) themeToggle.textContent = 'Light';
    if (themeToggle) themeToggle.setAttribute('aria-pressed', 'true');
  } else {
    document.body.classList.add('theme-dark-off');
    if (themeToggle) themeToggle.textContent = 'Dark';
    if (themeToggle) themeToggle.setAttribute('aria-pressed', 'false');
  }
  try { localStorage.setItem('vcpd_theme_dark', isDark ? '1' : '0'); } catch(e) {}
}
safeAddListener(themeToggle, 'click', () => {
  const nowDark = !document.body.classList.contains('theme-dark-off');
  applyTheme(!nowDark);
});

// ON LOAD: prefs + observers
window.addEventListener('load', () => {
  // Theme
  const savedDark = (function() {
    try { return localStorage.getItem('vcpd_theme_dark'); } catch (e) { return null; }
  })();
  applyTheme(savedDark === null ? true : savedDark === '1');

  // Language
  const lang = (function() {
    try { return localStorage.getItem('vcpd_lang') || 'en'; } catch(e) { return 'en'; }
  })();
  lang === 'si' ? showSinhala() : showEnglish();

  // Reveal cards when visible
  const cards = document.querySelectorAll('.card');
  const obs = new IntersectionObserver((entries, observer) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  cards.forEach(c => obs.observe(c));

  // Fade sections (topbar/content/footer)
  const fades = document.querySelectorAll('.fade-section');
  const obs2 = new IntersectionObserver((entries, observer) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  fades.forEach(f => obs2.observe(f));
});

// Cinematic overlay darkens with scroll
window.addEventListener('scroll', () => {
  const overlay = document.querySelector('.overlay');
  if (!overlay) return;
  const y = window.scrollY || window.pageYOffset || 0;
  // Darken faster initially, then ease
  const opacity = Math.min(0.35 + (y / 600), 0.88);
  overlay.style.background = `rgba(0,0,0,${opacity})`;
});

// Optional: modal preview helper (if you use any image click-to-zoom)
const modal = document.getElementById('imgModal');
const modalImg = document.getElementById('modalImg');
function openModal(src) {
  if (!modal || !modalImg) return;
  modalImg.src = src;
  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  if (!modal || !modalImg) return;
  modal.classList.remove('show');
  modalImg.src = '';
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
if (modal) {
  modal.addEventListener('click', closeModal);
  // close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

// Download current HTML (note: references external CSS/JS files)
if (downloadBtn) {
  downloadBtn.addEventListener('click', () => {
    try {
      // Produce a clean HTML snapshot for download (still references external css/js)
      const doctype = '<!doctype html>\n';
      const html = doctype + document.documentElement.outerHTML;
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'vcpd_guide.html';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => { URL.revokeObjectURL(url); }, 5000);
    } catch (err) {
      console.error('Download failed', err);
      alert('Unable to create download at this time.');
    }
  });
}
