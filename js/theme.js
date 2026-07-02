const STORAGE_KEY = 'portfolio-theme';
const DEFAULT_THEME = 'neu';

const LABELS = {
  neu:   { icon: '✦', label: 'Glass' },
  glass: { icon: '◑', label: 'Neu'   },
};

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const { icon, label } = LABELS[theme];
  document.getElementById('themeIcon').textContent  = icon;
  document.getElementById('themeLabel').textContent = label;
  localStorage.setItem(STORAGE_KEY, theme);
}

document.getElementById('themeToggle').addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme') || DEFAULT_THEME;
  applyTheme(current === 'neu' ? 'glass' : 'neu');
});

// Apply saved or default theme immediately
applyTheme(localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME);
