// Gera data/daily.json com indicadores e notícias do dia.
// Executado diariamente pelo GitHub Actions (.github/workflows/update-data.yml).
// Uso local: node scripts/update-data.mjs   (Node 18+, sem dependências)

import { writeFile, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { fetchIndicators } from '../js/indicators.js';

const OUT = fileURLToPath(new URL('../data/daily.json', import.meta.url));

const FEEDS = [
  { url: 'https://www.infomoney.com.br/mercados/feed/', source: 'InfoMoney' },
  { url: 'https://g1.globo.com/rss/g1/economia/', source: 'g1 Economia' },
  { url: 'https://news.google.com/rss/search?q=mercado+financeiro+when:1d&hl=pt-BR&gl=BR&ceid=BR:pt-419', source: 'Google Notícias' },
];

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
const decode = (s) =>
  s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&(#x?[0-9a-f]+|\w+);/gi, (m, e) => {
      if (e[0] === '#') return String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
      return ENTITIES[e.toLowerCase()] ?? m;
    })
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const tag = (xml, name) => {
  const m = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, 'i'));
  return m ? decode(m[1]) : '';
};

async function readFeed({ url, source }) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (WInvest daily update)' } });
  if (!res.ok) throw new Error(`${source}: HTTP ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<item\b[\s\S]*?<\/item>/gi)].slice(0, 10).map(([item]) => {
    let title = tag(item, 'title');
    let src = source;
    // Google Notícias coloca o veículo no fim do título: "Manchete - Veículo"
    const gsrc = tag(item, 'source');
    if (gsrc) { src = gsrc; title = title.replace(new RegExp(`\\s+-\\s+${gsrc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`), ''); }
    const pub = tag(item, 'pubDate');
    const date = pub && !Number.isNaN(Date.parse(pub)) ? new Date(pub).toISOString() : null;
    return { title, link: tag(item, 'link'), date, source: src };
  }).filter((n) => n.title && /^https?:\/\//.test(n.link));
}

async function main() {
  let previous = {};
  try { previous = JSON.parse(await readFile(OUT, 'utf8')); } catch {}

  const indicators = await fetchIndicators();
  for (const [k, v] of Object.entries(indicators)) {
    if (!v) {
      console.warn(`Indicador ${k} indisponível; mantendo valor anterior.`);
      if (previous.indicators?.[k]) indicators[k] = previous.indicators[k];
      else delete indicators[k];
    }
  }

  const results = await Promise.allSettled(FEEDS.map(readFeed));
  results.forEach((r, i) => r.status === 'rejected' && console.warn(`Feed ${FEEDS[i].source} falhou: ${r.reason?.message}`));
  const seen = new Set();
  let news = results
    .filter((r) => r.status === 'fulfilled')
    .flatMap((r) => r.value)
    .filter((n) => {
      const k = n.title.toLowerCase();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    })
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
    .slice(0, 20);
  if (!news.length && previous.news?.length) news = previous.news;

  const out = { generatedAt: new Date().toISOString(), indicators, news };
  await writeFile(OUT, JSON.stringify(out, null, 2) + '\n');
  console.log(`OK: ${Object.keys(indicators).length} indicadores, ${news.length} notícias.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
