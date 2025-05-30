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
const notifButton  = document.getElementById('notifButton');
const notifList    = document.getElementById('notifList');

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

   // --- início: lógica de seleção de cards ---
  // seleção de cards com cor específica
  const cards = document.querySelectorAll('.card');
  let activeCard = null;

 cards.forEach(card => {
    card.addEventListener('click', () => {
      // remove ring do anterior
      if (activeCard) {
        const prevRings = activeCard.dataset.ring.split(' ');
        activeCard.classList.remove('ring-2', ...prevRings);
      }
      // adiciona ring no atual
      const rings = card.dataset.ring.split(' ');
      card.classList.add('ring-2', ...rings);
      activeCard = card;
    });
  });
  // --- fim: lógica de seleção de cards ---
});

themeToggle.addEventListener('change', toggleTheme);
window.addEventListener('resize', syncSidebarHeaderHeight);




// Funções de notificação
function toggleNotifs() {
  const list = document.getElementById('notifList');
  list.classList.toggle('hidden');
}

// Fecha a lista ao clicar fora do botão ou da lista
function handleClickOutside(e) {
  const btn = document.getElementById('notifButton');
  const list = document.getElementById('notifList');
  if (!btn.contains(e.target) && !list.contains(e.target)) {
    list.classList.add('hidden');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const notifButton    = document.getElementById('notifButton');
  const notifList      = document.getElementById('notifList');
  const notifContainer = notifButton.parentElement;

  // Inicia com a lista oculta
  notifList.classList.add('hidden');

  // Clique no botão: alterna visibilidade
  notifButton.addEventListener('click', toggleNotifs);

  // Clique externo: esconde
  document.addEventListener('click', handleClickOutside);

  // Hover: ao passar o mouse, mostrar; ao sair, esconder
  notifContainer.addEventListener('mouseenter', () => {
    notifList.classList.remove('hidden');
  });
  notifContainer.addEventListener('mouseleave', () => {
    notifList.classList.add('hidden');
  });
});



