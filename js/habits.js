import { store, dateKey, monthKey, addMonths, parseDateKey, monthName, esc, toast, CHECK_SVG, CHEVRON_LEFT, CHEVRON_RIGHT } from './util.js';

export const HABITS = [
  { id: 'estudar', name: 'Estudar', icon: '📚', hint: 'Assista a uma aula na aba <a href="#cursos">Cursos</a>' },
  { id: 'exercicio', name: 'Exercício físico', icon: '🏃', hint: 'Pelo menos 30 minutos de movimento' },
  { id: 'alimentacao', name: 'Alimentação saudável', icon: '🥗', hint: 'Refeições equilibradas, mais água' },
  { id: 'leitura', name: 'Leitura', icon: '📖', hint: 'Algumas páginas de um bom livro' },
  { id: 'sono', name: 'Sono', icon: '😴', hint: '7 a 8 horas de descanso' },
];

const KEY = 'habits';
const load = () => store.get(KEY, {});
const save = (data) => store.set(KEY, data);

/** Marca "Estudar" no dia de hoje (chamado ao concluir uma aula). Retorna true se marcou agora. */
export function markStudyToday() {
  const data = load();
  const k = dateKey();
  const list = new Set(data[k] || []);
  if (list.has('estudar')) return false;
  list.add('estudar');
  data[k] = [...list];
  save(data);
  return true;
}

function streak(data) {
  let count = 0;
  const d = new Date();
  // Se hoje ainda não tem hábitos, a sequência conta a partir de ontem.
  if (!(data[dateKey(d)] || []).length) d.setDate(d.getDate() - 1);
  while ((data[dateKey(d)] || []).length) {
    count++;
    d.setDate(d.getDate() - 1);
  }
  return count;
}

function ring(done, total) {
  const r = 27;
  const c = 2 * Math.PI * r;
  const off = c * (1 - done / total);
  return `
    <div class="ring" aria-label="${done} de ${total} hábitos">
      <svg viewBox="0 0 64 64"><circle class="track" cx="32" cy="32" r="${r}"/><circle class="bar" cx="32" cy="32" r="${r}" stroke-dasharray="${c}" stroke-dashoffset="${off}"/></svg>
      <div class="ring-label">${done}/${total}</div>
    </div>`;
}

export function renderHabits(root) {
  const today = dateKey();
  const state = { selected: today, month: monthKey() };

  const paint = () => {
    const data = load();
    const sel = new Set(data[state.selected] || []);
    const isToday = state.selected === today;
    const selDate = parseDateKey(state.selected);
    const dayLabel = isToday
      ? 'Hoje'
      : selDate.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });

    // Calendário do mês exibido
    const first = parseDateKey(state.month + '-01');
    const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
    const lead = first.getDay();
    let cells = '';
    for (let i = 0; i < lead; i++) cells += '<span class="cal-day empty"></span>';
    let activeDays = 0;
    let perfectDays = 0;
    let elapsed = 0;
    const perHabit = Object.fromEntries(HABITS.map((h) => [h.id, 0]));
    for (let d = 1; d <= daysInMonth; d++) {
      const k = `${state.month}-${String(d).padStart(2, '0')}`;
      const n = (data[k] || []).length;
      const future = k > today;
      if (!future) {
        elapsed++;
        if (n) activeDays++;
        if (n === HABITS.length) perfectDays++;
        (data[k] || []).forEach((id) => { if (id in perHabit) perHabit[id]++; });
      }
      const cls = ['cal-day', future && 'future', k === today && 'today', k === state.selected && 'selected'].filter(Boolean).join(' ');
      cells += `<button class="${cls}" data-day="${k}" data-level="${n}" ${future ? 'disabled' : ''} aria-label="${d}: ${n} de ${HABITS.length} hábitos">${d}</button>`;
    }
    const canNext = state.month < monthKey();

    root.innerHTML = `
      <section class="section">
        <div class="card">
          <div class="today-head">
            <div>
              <div class="section-title" style="text-transform:capitalize">${esc(dayLabel)}</div>
              <p class="muted small">${isToday ? 'Marque os hábitos que você praticou hoje.' : 'Editando um dia anterior.'}</p>
              ${!isToday ? '<button class="back-link" data-action="today">← Voltar para hoje</button>' : ''}
            </div>
            ${ring(sel.size, HABITS.length)}
          </div>
          <div class="habit-list">
            ${HABITS.map((h) => `
              <label class="habit${sel.has(h.id) ? ' done' : ''}">
                <input type="checkbox" data-habit="${h.id}" ${sel.has(h.id) ? 'checked' : ''}>
                <span class="habit-icon" aria-hidden="true">${h.icon}</span>
                <span class="habit-text">
                  <span class="habit-name">${h.name}</span><br>
                  <span class="habit-hint">${h.hint}</span>
                </span>
                <span class="check" aria-hidden="true">${CHECK_SVG}</span>
              </label>`).join('')}
          </div>
        </div>
      </section>

      <section class="section">
        <div class="stats">
          <div class="card stat"><div class="stat-value">${streak(data)}</div><div class="stat-label">dias seguidos</div></div>
          <div class="card stat"><div class="stat-value">${activeDays}</div><div class="stat-label">dias ativos no mês</div></div>
          <div class="card stat"><div class="stat-value">${perfectDays}</div><div class="stat-label">dias com 5/5</div></div>
        </div>
      </section>

      <section class="section">
        <div class="card">
          <div class="cal-head">
            <button class="icon-btn" data-action="prev" aria-label="Mês anterior">${CHEVRON_LEFT}</button>
            <span class="cal-title">${monthName(state.month)}</span>
            <button class="icon-btn" data-action="next" aria-label="Próximo mês" ${canNext ? '' : 'disabled style="opacity:.35"'}>${CHEVRON_RIGHT}</button>
          </div>
          <div class="cal-grid">
            ${['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d) => `<span class="cal-dow">${d}</span>`).join('')}
            ${cells}
          </div>
          <div class="legend">menos <i></i><i data-level="1"></i><i data-level="3"></i><i data-level="5"></i> mais</div>
          <p class="muted tiny" style="margin-top:8px">Toque em um dia para ver ou ajustar os hábitos daquela data.</p>
        </div>
      </section>

      <section class="section">
        <div class="card">
          <div class="section-head"><h3 class="section-title" style="font-size:16px">Constância no mês</h3><span class="section-sub">${elapsed} dia${elapsed === 1 ? '' : 's'}</span></div>
          <div class="habit-bars">
            ${HABITS.map((h) => {
              const pct = elapsed ? Math.round((perHabit[h.id] / elapsed) * 100) : 0;
              return `<div class="hbar-row"><span>${h.icon} ${h.name}</span><div class="hbar"><i style="width:${pct}%"></i></div><b>${pct}%</b></div>`;
            }).join('')}
          </div>
        </div>
      </section>`;
  };

  root.addEventListener('change', (e) => {
    const id = e.target.dataset?.habit;
    if (!id) return;
    const data = load();
    const set = new Set(data[state.selected] || []);
    if (e.target.checked) set.add(id);
    else set.delete(id);
    if (set.size) data[state.selected] = [...set];
    else delete data[state.selected];
    save(data);
    if (set.size === HABITS.length) toast('Dia completo! Todos os hábitos feitos 🎉');
    paint();
  });

  root.addEventListener('click', (e) => {
    const day = e.target.closest('[data-day]');
    if (day && !day.disabled) {
      state.selected = day.dataset.day;
      paint();
      root.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    const action = e.target.closest('[data-action]')?.dataset.action;
    if (action === 'prev') state.month = addMonths(state.month, -1);
    else if (action === 'next' && state.month < monthKey()) state.month = addMonths(state.month, 1);
    else if (action === 'today') { state.selected = today; state.month = monthKey(); }
    else return;
    paint();
  });

  paint();
}
