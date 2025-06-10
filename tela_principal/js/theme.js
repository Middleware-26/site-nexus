// js/theme.js
// IIFE para aplicar o tema sem flash
(function(){
  const savedTheme = localStorage.getItem('theme');
  const isDark = savedTheme === 'dark';
  document.documentElement.classList.toggle('dark', isDark);
  document.documentElement.classList.toggle('light', !isDark);
  document.documentElement.style.visibility = 'visible';
})();

// Funções de tema
function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  themeLabel.textContent = isDark ? 'Tema: Escuro' : 'Tema: Claro';
}

function loadTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  const isDark = savedTheme === 'dark';
  document.documentElement.classList.toggle('dark', isDark);
  themeToggle.checked = isDark;
  themeLabel.textContent = isDark ? 'Tema: Escuro' : 'Tema: Claro';
}

export { toggleTheme, loadTheme };
