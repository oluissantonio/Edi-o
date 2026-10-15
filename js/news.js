import { fetchIndicators } from './indicators.js';
import { store, esc, num, parseDateKey } from './util.js';

const INFO = [
  {
    key: 'ipca',
    name: 'IPCA',
    full: 'Inflação oficial do Brasil',
    desc: 'Mede quanto os preços de produtos e serviços subiram para as famílias. É a inflação oficial e serve de referência para a meta do Banco Central.',
  },
  {
    key: 'selic',
    name: 'Taxa Selic',
    full: 'Juros básicos da economia',
    desc: 'É a taxa básica de juros, definida pelo Banco Central. Quando sobe, empréstimos ficam mais caros e a renda fixa rende mais; quando cai, o contrário.',
  },
  {
    key: 'inpc',
    name: 'INPC',
    full: 'Inflação das famílias de menor renda',
    desc: 'Parecido com o IPCA, mas focado em famílias que ganham de 1 a 5 salários mínimos. É usado para reajustar o salário mínimo e aposentadorias.',
  },
  {
    key: 'igpm',
    name: 'IGP-M',
    full: 'A "inflação do aluguel"',
    desc: 'Índice da FGV que inclui preços no atacado, na construção e ao consumidor. É muito usado para reajustar contratos de aluguel.',
  },
  {
    key: 'dolar',
    name: 'Dólar',
    full: 'Câmbio USD/BRL',
    desc: 'Quantos reais custa 1 dólar. Afeta preços de importados, combustíveis, viagens e eletrônicos — e, indiretamente, a inflação.',
  },
];

const CACHE_KEY = 'news-cache';

const fmtDate = (iso, opts = { month: 'short', year: 'numeric' }) =>
  iso ? parseDateKey(iso).toLocaleDateString('pt-BR', opts) : '';

function indicatorBody(key, d) {
  if (!d) return { value: '—', unit: 'indisponível no momento', ref: '' };
  switch (key) {
    case 'selic':
      return { value: `${num(d.value)}%`, unit: 'ao ano (meta Copom)', ref: d.ref ? `Desde ${fmtDate(d.ref, { day: '2-digit', month: 'short', year: 'numeric' })}` : '' };
    case 'dolar': {
      const ch = Number.isFinite(d.change) ? ` · ${d.change >= 0 ? '▲' : '▼'} ${num(Math.abs(d.change))}% no dia` : '';
      return { value: `R$ ${num(d.value)}`, unit: `por US$ 1${ch}`, ref: d.ref ? `Cotação de ${fmtDate(d.ref, { day: '2-digit', month: 'short' })}` : '' };
    }
    default: {
      const main = d.acc12 != null ? d.acc12 : d.month;
      const unit = d.acc12 != null ? `em 12 meses · ${num(d.month)}% no mês` : 'no mês';
      return { value: `${num(main)}%`, unit, ref: d.ref ? `Referência: ${fmtDate(d.ref)}` : '' };
    }
  }
}

function indicatorCard(info, data, loading) {
  const b = indicatorBody(info.key, data);
  const sk = loading && !data ? ' skeleton' : '';
  return `
    <article class="card indicator${info.key === 'dolar' ? ' wide' : ''}">
      <div>
        <div class="indicator-name">${info.name}</div>
        <div class="indicator-full">${esc(info.full)}</div>
      </div>
      <div class="indicator-value${sk}">${esc(b.value)}</div>
      <div class="indicator-unit">${esc(b.unit)}</div>
      <p class="indicator-desc">${esc(info.desc)}</p>
      ${b.ref ? `<div class="indicator-ref">${esc(b.ref)}</div>` : ''}
    </article>`;
}

function timeAgo(iso) {
  if (!iso) return '';
  const diff = (Date.now() - new Date(iso).getTime()) / 60000;
  if (!Number.isFinite(diff)) return '';
  if (diff < 60) return `há ${Math.max(1, Math.round(diff))} min`;
  if (diff < 1440) return `há ${Math.round(diff / 60)} h`;
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

function newsItem(n) {
  const safeUrl = /^https?:\/\//i.test(n.link) ? n.link : '#';
  return `
    <a class="card news-item" href="${esc(safeUrl)}" target="_blank" rel="noopener noreferrer">
      <h4>${esc(n.title)}</h4>
      <div class="news-meta">${esc(n.source || '')}${n.date ? ' · ' + esc(timeAgo(n.date)) : ''}</div>
    </a>`;
}

async function loadDaily() {
  try {
    const res = await fetch(`data/daily.json?d=${new Date().toISOString().slice(0, 10)}`);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return null;
  }
}

// Feeds lidos diretamente pelo navegador (via rss2json) caso o arquivo diário não tenha notícias.
const LIVE_FEEDS = [
  { url: 'https://www.infomoney.com.br/mercados/feed/', source: 'InfoMoney' },
  { url: 'https://g1.globo.com/rss/g1/economia/', source: 'g1 Economia' },
];

async function loadLiveNews() {
  const all = await Promise.allSettled(
    LIVE_FEEDS.map(async (f) => {
      const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(f.url)}`);
      const j = await res.json();
      if (j.status !== 'ok') throw new Error();
      return j.items.slice(0, 8).map((it) => ({
        title: it.title,
        link: it.link,
        date: it.pubDate ? new Date(it.pubDate.replace(' ', 'T') + 'Z').toISOString() : null,
        source: f.source,
      }));
    }),
  );
  const seen = new Set();
  return all
    .filter((r) => r.status === 'fulfilled')
    .flatMap((r) => r.value)
    .filter((n) => !seen.has(n.title) && seen.add(n.title))
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
    .slice(0, 15);
}

export function renderNews(root) {
  const cache = store.get(CACHE_KEY, { indicators: {}, news: [] });
  const state = { indicators: { ...cache.indicators }, news: cache.news || [], loading: true, newsLoading: true };

  root.innerHTML = `
    <section class="section">
      <div class="section-head">
        <h2 class="section-title">Indicadores da economia</h2>
        <span class="section-sub" id="ind-updated"></span>
      </div>
      <p class="lead">Os números que mais influenciam o seu bolso — com uma explicação simples de cada um.</p>
      <div class="indicators" id="indicators" style="margin-top:12px"></div>
    </section>
    <section class="section">
      <div class="section-head">
        <h2 class="section-title">Notícias do mercado</h2>
        <span class="section-sub">Atualizadas diariamente</span>
      </div>
      <div class="news-list" id="news"></div>
    </section>`;

  const indEl = root.querySelector('#indicators');
  const newsEl = root.querySelector('#news');
  const updEl = root.querySelector('#ind-updated');

  const paint = () => {
    if (!root.isConnected) return;
    indEl.innerHTML = INFO.map((i) => indicatorCard(i, state.indicators[i.key], state.loading)).join('');
    if (state.news.length) {
      newsEl.innerHTML = state.news.map(newsItem).join('');
    } else if (state.newsLoading) {
      newsEl.innerHTML = Array.from({ length: 3 }, () =>
        '<div class="card news-item"><h4 class="skeleton">Carregando notícia do dia</h4><div class="news-meta skeleton">fonte</div></div>').join('');
    } else {
      newsEl.innerHTML = '<div class="card empty-state">Não foi possível carregar as notícias agora. Verifique sua conexão e tente novamente mais tarde.</div>';
    }
    if (cache.updatedAt) updEl.textContent = `Atualizado ${timeAgo(cache.updatedAt)}`;
  };
  paint();

  const save = () => {
    cache.indicators = state.indicators;
    cache.news = state.news;
    cache.updatedAt = new Date().toISOString();
    store.set(CACHE_KEY, cache);
  };

  const dailyP = loadDaily();

  // Indicadores: tenta ao vivo e completa o que faltar com o arquivo diário.
  Promise.all([fetchIndicators().catch(() => ({})), dailyP]).then(([live, daily]) => {
    for (const { key } of INFO) {
      const v = live[key] || daily?.indicators?.[key];
      if (v) state.indicators[key] = v;
    }
    state.loading = false;
    if (INFO.some(({ key }) => live[key] || daily?.indicators?.[key])) save();
    paint();
  });

  // Notícias: arquivo diário primeiro; se vazio, busca ao vivo.
  dailyP.then(async (daily) => {
    let news = daily?.news?.length ? daily.news : [];
    if (!news.length) news = await loadLiveNews().catch(() => []);
    if (news.length) {
      state.news = news;
      save();
    }
    state.newsLoading = false;
    paint();
  });
}
