import { COURSE, ALL_LESSONS } from './data/course.js';
import { markStudyToday } from './habits.js';
import { store, esc, toast, CHECK_SVG } from './util.js';

const KEY = 'course-progress';
const load = () => store.get(KEY, {});

function overview(root) {
  const done = load();
  const total = ALL_LESSONS.length;
  const count = ALL_LESSONS.filter((l) => done[l.id]).length;
  const pct = Math.round((count / total) * 100);
  const next = ALL_LESSONS.find((l) => !done[l.id]);

  root.innerHTML = `
    <section class="section">
      <div class="card course-hero">
        <span class="chip" style="background:rgba(255,255,255,.18);color:#fff">Curso gratuito</span>
        <h2 style="font-size:22px;margin:10px 0 4px">${esc(COURSE.title)}</h2>
        <p class="muted small">${esc(COURSE.subtitle)}</p>
        <div class="row" style="margin-top:14px">
          <div class="hbar" style="flex:1"><i style="width:${pct}%"></i></div>
          <b class="small">${count}/${total} aulas</b>
        </div>
        ${next ? `<a class="btn secondary" style="margin-top:14px;background:#fff;text-decoration:none" href="#cursos/${next.id}">${count ? 'Continuar' : 'Começar'}: ${esc(next.title)}</a>` : '<p style="margin-top:12px;font-weight:600">🎓 Curso concluído! Revise as aulas quando quiser.</p>'}
      </div>
      <p class="muted tiny" style="margin-top:10px">Ao concluir uma aula, o hábito <strong>Estudar</strong> do dia é marcado automaticamente.</p>
    </section>
    <section class="section stack">
      ${COURSE.modules.map((m, i) => {
        const mDone = m.lessons.filter((l) => done[l.id]).length;
        return `
          <div class="card module">
            <div class="module-head">
              <span class="module-num">${i + 1}</span>
              <div style="flex:1"><div class="module-title">${esc(m.title)}</div><div class="muted tiny">${mDone}/${m.lessons.length} aulas concluídas</div></div>
            </div>
            ${m.lessons.map((l) => `
              <a class="lesson${done[l.id] ? ' done' : ''}" href="#cursos/${l.id}" style="text-decoration:none;color:inherit">
                <span class="lesson-status">${done[l.id] ? CHECK_SVG : ''}</span>
                <span class="lesson-title">${esc(l.title)}</span>
                <span class="lesson-time">${l.minutes} min</span>
              </a>`).join('')}
          </div>`;
      }).join('')}
    </section>`;
}

function lessonView(root, id) {
  const idx = ALL_LESSONS.findIndex((l) => l.id === id);
  if (idx < 0) return overview(root);
  const l = ALL_LESSONS[idx];
  const prev = ALL_LESSONS[idx - 1];
  const next = ALL_LESSONS[idx + 1];

  const paint = () => {
    const done = load();
    root.innerHTML = `
      <section class="section lesson-view">
        <a class="back-link" href="#cursos" style="text-decoration:none">← Todas as aulas</a>
        <div class="card" style="margin-top:8px">
          <span class="chip">${esc(l.moduleTitle)} · ${l.minutes} min</span>
          <h2>${esc(l.title)}</h2>
          ${l.video
            ? `<div class="video"><iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(l.video)}" title="${esc(l.title)}" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>`
            : '<div class="video-placeholder">🎬 Vídeo desta aula em breve</div>'}
          <div class="lesson-body">${l.body}</div>
          <button class="btn block${done[l.id] ? ' secondary' : ''}" data-action="toggle" style="margin-top:16px">
            ${done[l.id] ? '✓ Aula concluída' : 'Marcar como concluída'}
          </button>
          <div class="lesson-nav">
            ${prev ? `<a class="btn ghost" href="#cursos/${prev.id}" style="text-decoration:none">← Anterior</a>` : ''}
            ${next ? `<a class="btn ghost" href="#cursos/${next.id}" style="text-decoration:none">Próxima →</a>` : ''}
          </div>
        </div>
      </section>`;
  };

  root.addEventListener('click', (e) => {
    if (e.target.closest('[data-action="toggle"]')) {
      const done = load();
      if (done[l.id]) {
        delete done[l.id];
      } else {
        done[l.id] = new Date().toISOString();
        toast(markStudyToday() ? 'Aula concluída! Hábito "Estudar" marcado ✓' : 'Aula concluída!');
      }
      store.set(KEY, done);
      paint();
    }
  });

  paint();
}

export function renderCourses(root, param) {
  if (param) lessonView(root, param);
  else overview(root);
}
