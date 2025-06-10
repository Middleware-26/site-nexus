// js/scrollspy.js
// scrollspy para links de navegação
const links    = document.querySelectorAll('.scrollspy-link');
const sections = Array.from(links).map(a => document.querySelector(a.getAttribute('href')));

const ACTIVE_CLASSES   = ['bg-primary-600', 'bg-opacity-40','text-primary-600', 'dark:text-primary-400', 'border-l-4', 'border-primary-600', 'pl-2'];
const INACTIVE_CLASSES = ['text-gray-700',   'dark:text-gray-300',            'border-l-0'];

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id   = entry.target.id;
    const link = document.querySelector(`.scrollspy-link[href="#${id}"]`);
    if (!link) return;

    if (entry.isIntersecting) {
      links.forEach(l => {
        l.classList.remove(...ACTIVE_CLASSES);
        l.classList.add(...INACTIVE_CLASSES);
      });
      link.classList.remove(...INACTIVE_CLASSES);
      link.classList.add(...ACTIVE_CLASSES);
    }
  });
}, {
  root: null,
  threshold: 0.5
});

sections.forEach(sec => {
  if (sec) observer.observe(sec);
});
