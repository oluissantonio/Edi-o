import { renderNews } from './news.js';
import { renderHabits } from './habits.js';
import { renderPlanning } from './planning.js';
import { renderCourses } from './courses.js';
import { renderProfile } from './profile.js';

const ROUTES = {
  noticias: { title: 'Notícias', render: renderNews },
  habitos: { title: 'Hábitos', render: renderHabits },
  planejamento: { title: 'Planejamento', render: renderPlanning },
  cursos: { title: 'Cursos', render: renderCourses },
  perfil: { title: 'Perfil', render: renderProfile },
};

const view = document.getElementById('view');
const titleEl = document.getElementById('view-title');

function route() {
  // Formato do hash: #sessao ou #sessao/parametro (ex.: #cursos/m1-l2)
  const [name, ...rest] = location.hash.replace(/^#/, '').split('/');
  const key = ROUTES[name] ? name : 'noticias';
  const r = ROUTES[key];

  document.querySelectorAll('.tab').forEach((t) => {
    const on = t.dataset.tab === key;
    t.classList.toggle('active', on);
    if (on) t.setAttribute('aria-current', 'page');
    else t.removeAttribute('aria-current');
  });
  titleEl.textContent = r.title;
  document.title = `${r.title} · WInvest`;

  view.innerHTML = '';
  r.render(view, rest.join('/'));
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', route);
route();

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}
