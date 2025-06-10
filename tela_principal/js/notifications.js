// js/notifications.js
// Funções de notificação
function toggleNotifs() {
  const list = document.getElementById('notifList');
  list.classList.toggle('hidden');
}

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

  notifList.classList.add('hidden');
  notifButton.addEventListener('click', toggleNotifs);
  document.addEventListener('click', handleClickOutside);
  notifContainer.addEventListener('mouseenter', () => {
    notifList.classList.remove('hidden');
  });
  notifContainer.addEventListener('mouseleave', () => {
    notifList.classList.add('hidden');
  });
});

export { toggleNotifs, handleClickOutside };
