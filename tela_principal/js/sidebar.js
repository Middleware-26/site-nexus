// js/sidebar.js
// Seleciona elementos
const sidebar      = document.getElementById('sidebar');
const mainContent  = document.getElementById('mainContent');



// Funções de menu lateral
function abrirMenu() {
  sidebar.classList.toggle('-translate-x-full');
  sidebar.classList.toggle('opacity-0');
  sidebar.classList.toggle('translate-x-0');
  sidebar.classList.toggle('opacity-100');
  const hidden = sidebar.classList.contains('-translate-x-full');
  mainContent.classList.toggle('ml-64', !hidden);
  mainContent.classList.toggle('ml-0', hidden);
}

function fecharMenu() {
  if (!sidebar.classList.contains('-translate-x-full')) {
    abrirMenu();
  }
}

function syncSidebarHeaderHeight() {
  const mainHdr = document.getElementById('main-header');
  const sbHdr   = document.getElementById('sidebar-header');
  if (!mainHdr || !sbHdr) return;
  sbHdr.style.height = mainHdr.getBoundingClientRect().height + 'px';
}

export { abrirMenu, fecharMenu, syncSidebarHeaderHeight };
