import { store, monthKey, addMonths, monthName, money, parseMoney, esc, uid, toast, CHEVRON_LEFT, CHEVRON_RIGHT } from './util.js';

export const CATEGORIES = [
  {
    id: 'need',
    name: 'Necessidades essenciais',
    short: 'Essenciais',
    target: 50,
    color: 'var(--cat-need)',
    examples: 'Aluguel, contas de luz e água, mercado, transporte, saúde.',
  },
  {
    id: 'life',
    name: 'Lazer / Estilo de vida',
    short: 'Lazer',
    target: 30,
    color: 'var(--cat-life)',
    examples: 'Restaurantes, streaming, viagens, compras, hobbies.',
  },
  {
    id: 'goal',
    name: 'Metas financeiras',
    short: 'Metas',
    target: 20,
    color: 'var(--cat-goal)',
    examples: 'Reserva de emergência, investimentos, quitar dívidas.',
  },
];

const KEY = 'planning';
const load = () => store.get(KEY, { months: {} });
const save = (d) => store.set(KEY, d);
const getMonth = (d, m) => d.months[m] || { income: 0, expenses: [] };

const TIPS = [
  ['O que é a regra 50/30/20?', 'É um jeito simples de dividir a sua renda líquida (o que cai na conta): 50% para o que é essencial, 30% para o que traz prazer e 20% para construir o seu futuro.'],
  ['E se meus gastos essenciais passam de 50%?', 'É comum, principalmente com aluguel alto. Comece revisando contas fixas (planos de celular, assinaturas, energia) e, se necessário, reduza temporariamente o lazer — mas evite zerar as metas.'],
  ['Por onde começar as metas financeiras?', 'Primeiro quite dívidas caras (cartão de crédito, cheque especial). Depois monte uma reserva de emergência de 3 a 6 meses de gastos essenciais, em um investimento seguro e com resgate rápido.'],
  ['Pague-se primeiro', 'Assim que receber, separe os 20% das metas antes de gastar com o resto. Automatizar uma transferência no dia do pagamento ajuda muito.'],
];

function statusFor(cat, pct, income) {
  if (!income) return { cls: '', text: '' };
  if (cat.id === 'goal') {
    if (pct >= cat.target) return { cls: 'ok', text: 'Ótimo! Você está investindo no seu futuro.' };
    if (pct >= cat.target / 2) return { cls: 'warn', text: `Faltam ${(cat.target - pct).toFixed(0)} pontos para chegar aos ${cat.target}% recomendados.` };
    return { cls: 'bad', text: 'Abaixo do ideal. Tente separar uma parte assim que receber.' };
  }
  if (pct <= cat.target) return { cls: 'ok', text: 'Dentro do recomendado.' };
  if (pct <= cat.target + 10) return { cls: 'warn', text: `Um pouco acima dos ${cat.target}% recomendados.` };
  return { cls: 'bad', text: `Bem acima dos ${cat.target}% recomendados — vale revisar.` };
}

export function renderPlanning(root) {
  const state = { month: monthKey(), cat: 'need' };

  const paint = () => {
    const data = load();
    const m = getMonth(data, state.month);
    const income = m.income || 0;
    const totals = Object.fromEntries(CATEGORIES.map((c) => [c.id, 0]));
    m.expenses.forEach((e) => { totals[e.cat] = (totals[e.cat] || 0) + e.value; });
    const spent = Object.values(totals).reduce((a, b) => a + b, 0);
    const balance = income - spent;
    const prev = getMonth(data, addMonths(state.month, -1));

    root.innerHTML = `
      <section class="section">
        <div class="card">
          <div class="month-switch">
            <button class="icon-btn" data-action="prev" aria-label="Mês anterior">${CHEVRON_LEFT}</button>
            <span class="month-label">${monthName(state.month)}</span>
            <button class="icon-btn" data-action="next" aria-label="Próximo mês">${CHEVRON_RIGHT}</button>
          </div>
          <form class="field" id="income-form" style="margin-top:14px">
            <label for="income">Renda líquida do mês</label>
            <div class="row">
              <input class="input" id="income" inputmode="decimal" placeholder="Ex.: 3.500,00" value="${income ? income.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : ''}">
              <button class="btn" type="submit">Salvar</button>
            </div>
          </form>
          <div class="summary-grid">
            <div><div class="k">Renda</div><div class="v">${money(income)}</div></div>
            <div><div class="k">Gastos</div><div class="v">${money(spent)}</div></div>
            <div><div class="k">Saldo</div><div class="v ${balance < 0 ? 'neg' : balance > 0 ? 'pos' : ''}">${money(balance)}</div></div>
          </div>
          ${income ? `
            <div class="split-bar" aria-hidden="true">
              ${CATEGORIES.map((c) => `<i style="width:${Math.min(100, (totals[c.id] / income) * 100)}%;background:${c.color}"></i>`).join('')}
            </div>` : ''}
        </div>
      </section>

      <section class="section">
        <div class="section-head">
          <h2 class="section-title">Regra 50/30/20</h2>
          <span class="section-sub">Recomendado x realizado</span>
        </div>
        ${!income ? '<p class="lead" style="margin-bottom:12px">Informe sua renda acima para ver quanto o ideal seria em cada parte.</p>' : ''}
        ${CATEGORIES.map((c) => {
          const ideal = (income * c.target) / 100;
          const pct = income ? (totals[c.id] / income) * 100 : 0;
          const fill = income ? Math.min(100, (totals[c.id] / ideal) * 100) : 0;
          const over = income && totals[c.id] > ideal && c.id !== 'goal';
          const st = statusFor(c, pct, income);
          return `
            <div class="card cat-card">
              <div class="cat-top">
                <span class="cat-dot" style="background:${c.color}"></span>
                <span class="cat-name">${c.name}</span>
                <span class="cat-pct">${income ? pct.toFixed(0) : 0}% <span class="muted small">/ ${c.target}%</span></span>
              </div>
              <div class="progress"><i class="${over ? 'over' : ''}" style="width:${fill}%;background:${c.color}"></i></div>
              <div class="cat-foot"><span>Gasto: ${money(totals[c.id])}</span><span>Ideal: ${money(ideal)}</span></div>
              ${st.text ? `<div class="cat-status ${st.cls}">${st.text}</div>` : `<div class="cat-status muted">${c.examples}</div>`}
            </div>`;
        }).join('')}
      </section>

      <section class="section">
        <div class="card">
          <h3 class="section-title" style="font-size:16px;margin-bottom:12px">Lançar gasto</h3>
          <form id="expense-form" class="stack">
            <div class="seg" role="radiogroup" aria-label="Categoria">
              ${CATEGORIES.map((c) => `<button type="button" role="radio" aria-checked="${state.cat === c.id}" class="${state.cat === c.id ? 'on' : ''}" data-cat="${c.id}">${c.short}</button>`).join('')}
            </div>
            <p class="muted tiny">${CATEGORIES.find((c) => c.id === state.cat).examples}</p>
            <div class="form-grid">
              <div class="field full"><label for="exp-name">Descrição</label><input class="input" id="exp-name" placeholder="Ex.: Aluguel" maxlength="60" required></div>
              <div class="field full"><label for="exp-value">Valor (R$)</label><input class="input" id="exp-value" inputmode="decimal" placeholder="0,00" required></div>
            </div>
            <button class="btn block" type="submit">Adicionar gasto</button>
          </form>
        </div>
      </section>

      <section class="section">
        <div class="section-head">
          <h2 class="section-title">Gastos do mês</h2>
          <span class="section-sub">${m.expenses.length} lançamento${m.expenses.length === 1 ? '' : 's'}</span>
        </div>
        ${CATEGORIES.map((c) => {
          const items = m.expenses.filter((e) => e.cat === c.id);
          return `
            <div class="card">
              <div class="cat-top"><span class="cat-dot" style="background:${c.color}"></span><span class="cat-name">${c.name}</span><span class="cat-pct">${money(totals[c.id])}</span></div>
              <div class="expense-list" style="margin-top:6px">
                ${items.length ? items.map((e) => `
                  <div class="expense">
                    <span class="expense-name">${esc(e.name)}</span>
                    <span class="expense-val">${money(e.value)}</span>
                    <button class="del" data-del="${e.id}" aria-label="Excluir ${esc(e.name)}">×</button>
                  </div>`).join('') : '<div class="muted small" style="padding:8px 0">Nenhum gasto lançado.</div>'}
              </div>
            </div>`;
        }).join('')}
        ${!m.expenses.length && prev.expenses.length ? `<button class="btn ghost block" data-action="copy" style="margin-top:12px">Copiar gastos de ${monthName(addMonths(state.month, -1))}</button>` : ''}
      </section>

      <section class="section">
        <div class="card">
          <h3 class="section-title" style="font-size:16px;margin-bottom:6px">Entenda e aplique</h3>
          ${TIPS.map(([q, a]) => `<details class="tip"><summary>${q}</summary><p>${a}</p></details>`).join('')}
        </div>
      </section>`;
  };

  root.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = load();
    const m = getMonth(data, state.month);
    if (e.target.id === 'income-form') {
      const v = parseMoney(root.querySelector('#income').value);
      if (!(v >= 0)) return toast('Informe um valor válido.');
      m.income = v;
      toast('Renda salva.');
    } else if (e.target.id === 'expense-form') {
      const name = root.querySelector('#exp-name').value.trim();
      const value = parseMoney(root.querySelector('#exp-value').value);
      if (!name || !(value > 0)) return toast('Preencha descrição e valor.');
      m.expenses.push({ id: uid(), name, value, cat: state.cat });
      toast('Gasto adicionado.');
    }
    data.months[state.month] = m;
    save(data);
    paint();
  });

  root.addEventListener('click', (e) => {
    const cat = e.target.closest('[data-cat]');
    if (cat) {
      state.cat = cat.dataset.cat;
      // Atualiza só o seletor, preservando o que já foi digitado.
      root.querySelectorAll('[data-cat]').forEach((b) => {
        const on = b.dataset.cat === state.cat;
        b.classList.toggle('on', on);
        b.setAttribute('aria-checked', on);
      });
      root.querySelector('#expense-form .tiny').textContent = CATEGORIES.find((c) => c.id === state.cat).examples;
      return;
    }
    const del = e.target.closest('[data-del]');
    if (del) {
      const data = load();
      const m = getMonth(data, state.month);
      m.expenses = m.expenses.filter((x) => x.id !== del.dataset.del);
      data.months[state.month] = m;
      save(data);
      paint();
      return;
    }
    const action = e.target.closest('[data-action]')?.dataset.action;
    if (action === 'prev') state.month = addMonths(state.month, -1);
    else if (action === 'next') state.month = addMonths(state.month, 1);
    else if (action === 'copy') {
      const data = load();
      const prev = getMonth(data, addMonths(state.month, -1));
      const m = getMonth(data, state.month);
      m.expenses = prev.expenses.map((x) => ({ ...x, id: uid() }));
      if (!m.income) m.income = prev.income;
      data.months[state.month] = m;
      save(data);
      toast('Gastos copiados — ajuste o que mudou.');
    } else return;
    paint();
  });

  paint();
}
