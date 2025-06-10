// js/main.js
import { toggleTheme, loadTheme }                   from './theme.js';
import { abrirMenu, fecharMenu, syncSidebarHeaderHeight } from './sidebar.js';
import { toggleNotifs, handleClickOutside }               from './notifications.js';
import './modal.js';
import './tabs.js';
import './selection.js';
import './scrollspy.js';
import './studentmodal.js';

// Seleção de elementos do DOM
const nameTag     = document.getElementById('userName');
const preview     = document.getElementById('avatarPreview');
const themeToggle = document.getElementById('themeToggle');
const themeLabel  = document.getElementById('themeLabel');
const mainHdr     = document.getElementById('main-header');
const sbHdr       = document.getElementById('sidebar-header');
const notifButton = document.getElementById('notifButton');
const notifList   = document.getElementById('notifList');

// Eventos globais
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
document.addEventListener('click', handleClickOutside);
