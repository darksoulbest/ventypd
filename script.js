// ELEMENT HOOKS
const enBtn = document.getElementById('langEn');
const siBtn = document.getElementById('langSi');
const themeToggle = document.getElementById('themeToggle');
const enContent = document.getElementById('englishContent');
const siContent = document.getElementById('sinhalaContent');
const downloadBtn = document.getElementById('downloadBtn');

// LANGUAGE TOGGLE
function showEnglish() {
  enContent.style.display = 'block';
  siContent.style.display = 'none';
  window.scrollTo({ top: 0, behavior: 'smooth' });
  localStorage.setItem('vcpd_lang', 'en');
}
function showSinhala() {
  enContent.style.display = 'none';
  siContent.style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
  localStorage.setItem('vcpd_lang', 'si');
}
enBtn.addEventListener('click', showEnglish);
siBtn.addEventListener('click', showSinhala);

// THEME TOGGLE (dark default)
function applyTheme(isDark) {
  if (isDark) {
    document.body.classList.remove('theme-dark-off');
    themeToggle.textContent = 'Light';
  } else {
    document.body.classList.add('theme-dark-off');
    themeToggle.textContent = 'Dark';
  }
  localStorage.setItem('vcpd_theme_dark', isDark ? '1' : '0');
}
themeToggle.addEventListener('click', () => {
  const nowDark = !document.body.classList.contains('theme-dark-off');
  applyTheme(!nowDark);
});

// ON LOAD: prefs + observers
window.addEventListener('load', () => {
  // Theme
  const savedDark = localStorage.getItem('vcpd_theme_dark');
  applyTheme(savedDark === null ? true : savedDark === '1');

  // Language
  const lang = localStorage.getItem('vcpd_lang') || 'en';
  lang === 'si' ? showSinhala() : showEnglish();

  // Reveal cards when visible
  const cards = document.querySelectorAll('.card');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  cards.forEach(c => obs.observe(c));

  // Fade sections (topbar/content/footer)
  const fades = document.querySelectorAll('.fade-section');
  const obs2 = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs2.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  fades.forEach(f => obs2.observe(f));
});

// Cinematic overlay darkens with scroll
window.addEventListener('scroll', () => {
  const overlay = document.querySelector('.overlay');
  const y = window.scrollY;
  // Darken faster initially, then ease
  const opacity = Math.min(0.35 + (y / 600), 0.88);
  overlay.style.background = `rgba(0,0,0,${opacity})`;
});

// Optional: modal preview helper (if you use any image click-to-zoom)
const modal = document.getElementById('imgModal');
const modalImg = document.getElementById('modalImg');
function openModal(src) {
  if (!modal) return;
  modalImg.src = src;
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  if (!modal) return;
  modal.classList.remove('show');
  modalImg.src = '';
  document.body.style.overflow = '';
}
if (modal) modal.addEventListener('click', closeModal);

// Download current HTML (note: references external CSS/JS files)
downloadBtn.addEventListener('click', () => {
  const html = '<!doctype html>\n' + document.documentElement.outerHTML;
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'vcpd_guide.html';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});
