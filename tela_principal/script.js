// IIFE para aplicar o tema sem flash
(function(){
  const savedTheme = localStorage.getItem('theme');
  const isDark = savedTheme === 'dark';
  document.documentElement.classList.toggle('dark', isDark);
  document.documentElement.classList.toggle('light', !isDark);
  document.documentElement.style.visibility = 'visible';
})();

// Seleciona elementos do DOM
const sidebar      = document.getElementById('sidebar');
const mainHdr      = document.getElementById('main-header');
const sbHdr        = document.getElementById('sidebar-header');
const nameTag      = document.getElementById('userName');
const preview      = document.getElementById('avatarPreview');
const themeToggle  = document.getElementById('themeToggle');
const themeLabel   = document.getElementById('themeLabel'); // ← declaração adicionada

// Funções de menu lateral
function abrirMenu() {
  sidebar.classList.toggle('-translate-x-full');
  sidebar.classList.toggle('opacity-0');
  sidebar.classList.toggle('translate-x-0');
  sidebar.classList.toggle('opacity-100');
}

function fecharMenu() {
  sidebar.classList.add('-translate-x-full');
  sidebar.classList.add('opacity-0');
  sidebar.classList.remove('translate-x-0');
  sidebar.classList.remove('opacity-100');
}

function syncSidebarHeaderHeight() {
  if (!mainHdr || !sbHdr) return;
  sbHdr.style.height = mainHdr.getBoundingClientRect().height + 'px';
}

// Funções de tema
function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  themeLabel.textContent = isDark ? 'Escuro' : 'Claro';
}

function loadTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  const isDark = savedTheme === 'dark';              // ← criei isDark aqui
  document.documentElement.classList.toggle('dark', isDark);
  themeToggle.checked = isDark;
  themeLabel.textContent = isDark ? 'Escuro' : 'Claro';
}

// Eventos
window.addEventListener('load', () => {
  loadTheme();
  syncSidebarHeaderHeight();

  const savedName   = localStorage.getItem('nomeUsuario');
  const savedAvatar = localStorage.getItem('avatarUsuario');
  if (savedName)   nameTag.textContent = savedName;
  if (savedAvatar) preview.src = savedAvatar;
});

themeToggle.addEventListener('change', toggleTheme);
window.addEventListener('resize', syncSidebarHeaderHeight);
