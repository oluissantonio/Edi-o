// Busca dos indicadores econômicos em fontes públicas.
// Usado pelo app (navegador) e pelo script diário (scripts/update-data.mjs, Node 18+).

const SGS = (code, n) =>
  `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${code}/dados/ultimos/${n}?formato=json`;

// Códigos das séries do Sistema Gerenciador de Séries Temporais (SGS) do Banco Central.
export const SERIES = {
  ipca: 433, // IPCA – variação % mensal
  selic: 432, // Meta Selic definida pelo Copom – % a.a.
  inpc: 188, // INPC – variação % mensal
  igpm: 189, // IGP-M – variação % mensal
  ptax: 1, // Dólar comercial (PTAX venda) – R$
};

async function getJSON(url, timeoutMs = 10000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

const toNum = (s) => parseFloat(String(s).replace(',', '.'));

/** "dd/mm/aaaa" -> "aaaa-mm-dd" */
const isoFromBR = (s) => {
  const [d, m, y] = s.split('/');
  return `${y}-${m}-${d}`;
};

/** Série mensal: retorna variação do último mês e acumulado de 12 meses. */
async function monthly(code) {
  const rows = await getJSON(SGS(code, 12));
  if (!Array.isArray(rows) || rows.length === 0) throw new Error('série vazia');
  const values = rows.map((r) => toNum(r.valor));
  const acc12 = (values.reduce((acc, v) => acc * (1 + v / 100), 1) - 1) * 100;
  const last = rows[rows.length - 1];
  return {
    month: toNum(last.valor),
    acc12: rows.length === 12 ? acc12 : null,
    ref: isoFromBR(last.data),
  };
}

async function selic() {
  const rows = await getJSON(SGS(SERIES.selic, 1));
  const last = rows[rows.length - 1];
  return { value: toNum(last.valor), ref: isoFromBR(last.data) };
}

async function dollar() {
  try {
    const data = await getJSON('https://economia.awesomeapi.com.br/json/last/USD-BRL');
    const q = data.USDBRL;
    return {
      value: toNum(q.bid),
      change: toNum(q.pctChange),
      ref: q.create_date ? q.create_date.slice(0, 10) : null,
      source: 'AwesomeAPI',
    };
  } catch {
    const rows = await getJSON(SGS(SERIES.ptax, 2));
    const last = rows[rows.length - 1];
    const prev = rows.length > 1 ? toNum(rows[0].valor) : null;
    const value = toNum(last.valor);
    return {
      value,
      change: prev ? ((value - prev) / prev) * 100 : null,
      ref: isoFromBR(last.data),
      source: 'Banco Central (PTAX)',
    };
  }
}

/**
 * Busca todos os indicadores. Cada um é independente: se uma fonte falhar,
 * o campo correspondente vem como null e o restante continua funcionando.
 */
export async function fetchIndicators() {
  const jobs = {
    ipca: monthly(SERIES.ipca),
    selic: selic(),
    inpc: monthly(SERIES.inpc),
    igpm: monthly(SERIES.igpm),
    dolar: dollar(),
  };
  const keys = Object.keys(jobs);
  const results = await Promise.allSettled(Object.values(jobs));
  const out = {};
  results.forEach((r, i) => {
    out[keys[i]] = r.status === 'fulfilled' ? r.value : null;
  });
  return out;
}
