import { QUESTIONS, PROFILES, MIN_SCORE, MAX_SCORE, profileFor } from './data/questions.js';
import { store, esc, toast } from './util.js';

const KEY = 'profile';

export function renderProfile(root) {
  const saved = store.get(KEY, { name: '', result: null });
  const state = { mode: saved.result ? 'result' : 'intro', step: 0, answers: [] };

  const paint = () => {
    if (state.mode === 'intro') {
      root.innerHTML = `
        <section class="section">
          <div class="card">
            <h2 class="section-title">Descubra seu perfil de investidor</h2>
            <p class="muted" style="margin-top:8px">São ${QUESTIONS.length} perguntas rápidas sobre seus objetivos, prazos e como você reage aos altos e baixos do mercado. Não existe resposta certa ou errada.</p>
            <div class="field" style="margin-top:16px">
              <label for="name">Como podemos te chamar? (opcional)</label>
              <input class="input" id="name" maxlength="40" value="${esc(saved.name)}" placeholder="Seu nome">
            </div>
            <button class="btn block" data-action="start" style="margin-top:16px">Começar questionário</button>
          </div>
        </section>
        <section class="section">
          <div class="card">
            <h3 class="section-title" style="font-size:16px;margin-bottom:8px">Os três perfis</h3>
            ${PROFILES.map((p) => `<p class="small" style="margin-bottom:8px"><strong>${p.name}:</strong> <span class="muted">${p.desc.split('.')[0]}.</span></p>`).join('')}
          </div>
        </section>`;
      return;
    }

    if (state.mode === 'quiz') {
      const q = QUESTIONS[state.step];
      const sel = state.answers[state.step];
      root.innerHTML = `
        <section class="section">
          <div class="card">
            <div class="row"><span class="muted small">Pergunta ${state.step + 1} de ${QUESTIONS.length}</span><span class="spacer"></span><button class="back-link" data-action="cancel">Cancelar</button></div>
            <div class="quiz-progress"><i style="width:${(state.step / QUESTIONS.length) * 100}%"></i></div>
            <div class="question">${esc(q.q)}</div>
            <div class="options" role="radiogroup">
              ${q.options.map(([label], i) => `
                <button class="option${sel === i ? ' on' : ''}" role="radio" aria-checked="${sel === i}" data-opt="${i}">
                  <span class="radio"></span><span>${esc(label)}</span>
                </button>`).join('')}
            </div>
            <div class="lesson-nav">
              ${state.step > 0 ? '<button class="btn ghost" data-action="back">Voltar</button>' : ''}
              <button class="btn" data-action="next" ${sel == null ? 'disabled' : ''}>${state.step === QUESTIONS.length - 1 ? 'Ver resultado' : 'Próxima'}</button>
            </div>
          </div>
        </section>`;
      return;
    }

    const r = saved.result;
    const p = PROFILES.find((x) => x.id === r.profile) || profileFor(r.score);
    const pos = ((r.score - MIN_SCORE) / (MAX_SCORE - MIN_SCORE)) * 100;
    root.innerHTML = `
      <section class="section">
        <div class="card">
          <p class="muted small">${saved.name ? `${esc(saved.name)}, seu perfil é` : 'Seu perfil é'}</p>
          <div class="profile-badge">${p.name}</div>
          <div class="score-scale"><i style="left:${pos}%"></i></div>
          <div class="scale-labels"><span>Conservador</span><span>Moderado</span><span>Arrojado</span></div>
          <p style="margin-top:14px">${p.desc}</p>
          <p class="muted tiny" style="margin-top:10px">Pontuação ${r.score} de ${MAX_SCORE} · respondido em ${new Date(r.date).toLocaleDateString('pt-BR')}</p>
        </div>
      </section>
      <section class="section">
        <div class="card">
          <h3 class="section-title" style="font-size:16px">Exemplo de carteira para o seu perfil</h3>
          <p class="muted tiny" style="margin-top:4px">Apenas uma referência educativa, não é recomendação de investimento.</p>
          <div class="alloc">
            ${p.alloc.map(([label, v]) => `
              <div>
                <div class="alloc-row"><span>${label}</span><b>${v}%</b></div>
                <div class="hbar"><i style="width:${v}%"></i></div>
              </div>`).join('')}
          </div>
        </div>
      </section>
      <section class="section">
        <div class="card">
          <h3 class="section-title" style="font-size:16px;margin-bottom:6px">Próximo passo</h3>
          <p class="muted">${p.next}</p>
          <a class="btn secondary block" href="#cursos" style="margin-top:12px;text-decoration:none">Ir para os cursos</a>
        </div>
        <button class="btn ghost block" data-action="redo" style="margin-top:12px">Refazer questionário</button>
      </section>`;
  };

  root.addEventListener('click', (e) => {
    const opt = e.target.closest('[data-opt]');
    if (opt) {
      state.answers[state.step] = Number(opt.dataset.opt);
      paint();
      return;
    }
    const action = e.target.closest('[data-action]')?.dataset.action;
    if (!action) return;
    if (action === 'start') {
      saved.name = root.querySelector('#name').value.trim();
      store.set(KEY, saved);
      state.mode = 'quiz';
      state.step = 0;
      state.answers = [];
    } else if (action === 'cancel') {
      state.mode = saved.result ? 'result' : 'intro';
    } else if (action === 'back') {
      state.step = Math.max(0, state.step - 1);
    } else if (action === 'next') {
      if (state.answers[state.step] == null) return;
      if (state.step < QUESTIONS.length - 1) {
        state.step++;
      } else {
        const score = state.answers.reduce((sum, a, i) => sum + QUESTIONS[i].options[a][1], 0);
        saved.result = { score, profile: profileFor(score).id, answers: state.answers, date: new Date().toISOString() };
        store.set(KEY, saved);
        state.mode = 'result';
        toast('Perfil salvo!');
      }
    } else if (action === 'redo') {
      state.mode = 'intro';
    }
    paint();
    window.scrollTo(0, 0);
  });

  paint();
}
