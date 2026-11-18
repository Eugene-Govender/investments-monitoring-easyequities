import etfsRaw from '../../data/etfs.json';
import ratesRaw from '../../data/exchange_rates.json';

export const ALL_ETFS = etfsRaw.etfs;
export const METADATA = etfsRaw.metadata;
export const RATES = ratesRaw;

/** Convert ZAR → USD or keep USD */
export function convertValue(value, fromCurrency, toCurrency, rate = RATES.rates.ZAR) {
  if (fromCurrency === toCurrency) return value;
  if (fromCurrency === 'ZAR' && toCurrency === 'USD') return value / rate;
  if (fromCurrency === 'USD' && toCurrency === 'ZAR') return value * rate;
  return value;
}

/** Format currency nicely */
export function formatCurrency(value, currency, compact = false) {
  const locale = 'en-ZA';
  const opts = {
    style: 'currency',
    currency,
    maximumFractionDigits: compact ? 0 : 2,
    notation: compact ? 'compact' : 'standard',
  };
  try {
    return new Intl.NumberFormat(locale, opts).format(value);
  } catch {
    return `${currency === 'ZAR' ? 'R' : '$'}${value.toLocaleString()}`;
  }
}

/** Filter ETFs by criteria */
export function filterETFs(etfs, { currency, tfsaOnly, category, maxTer }) {
  return etfs.filter(e => {
    if (currency !== 'ALL' && e.account !== currency) return false;
    if (tfsaOnly && !e.tfsaEligible) return false;
    if (category !== 'ALL' && e.category !== category) return false;
    if (maxTer !== null && e.ter > maxTer) return false;
    return true;
  });
}

/** Sort ETFs — null values always sort to the end regardless of direction */
export function sortETFs(etfs, field, dir = 'asc') {
  return [...etfs].sort((a, b) => {
    let aVal, bVal;
    if (field === 'ter') { aVal = a.ter; bVal = b.ter; }
    else if (field === '1y') { aVal = a.returns.oneYear; bVal = b.returns.oneYear; }
    else if (field === '3y') { aVal = a.returns.threeYearAnnualized; bVal = b.returns.threeYearAnnualized; }
    else if (field === '5y') { aVal = a.returns.fiveYearAnnualized; bVal = b.returns.fiveYearAnnualized; }
    else if (field === 'yield') { aVal = a.dividendYield; bVal = b.dividendYield; }
    else if (field === 'name') { aVal = a.ticker; bVal = b.ticker; }
    else { aVal = a.ter; bVal = b.ter; }
    // Null values always go to bottom
    if (aVal === null && bVal === null) return 0;
    if (aVal === null) return 1;
    if (bVal === null) return -1;
    if (dir === 'asc') return aVal > bVal ? 1 : -1;
    return aVal < bVal ? 1 : -1;
  });
}

/** KPI computations — skips funds with null returns */
export function computeKPIs(etfs) {
  const withReturns = etfs.filter(e => e.returns.fiveYearAnnualized !== null);
  const with3Y = etfs.filter(e => e.returns.threeYearAnnualized !== null);
  const lowestTER = [...etfs].sort((a, b) => a.ter - b.ter)[0];
  const best3Y = [...with3Y].sort((a, b) => b.returns.threeYearAnnualized - a.returns.threeYearAnnualized)[0];
  const best5Y = [...withReturns].sort((a, b) => b.returns.fiveYearAnnualized - a.returns.fiveYearAnnualized)[0];
  const bestYield = [...etfs].sort((a, b) => b.dividendYield - a.dividendYield)[0];
  const tfsaTop = [...withReturns].filter(e => e.tfsaEligible).sort((a, b) => b.returns.fiveYearAnnualized - a.returns.fiveYearAnnualized)[0];
  return { lowestTER, best3Y, best5Y, bestYield, tfsaTop };
}

/** 
 * Compound fee drag simulation:
 * Returns array of yearly { year, withFee, withoutFee } objects 
 */
export function simulateFeeDrag({ initial, monthly, years, returnRate, ter }) {
  const data = [];
  let withFee = initial;
  let withoutFee = initial;
  const rMonthly = returnRate / 100 / 12;
  const rMonthlyNet = (returnRate - ter) / 100 / 12;

  for (let year = 1; year <= years; year++) {
    for (let m = 0; m < 12; m++) {
      withFee = withFee * (1 + rMonthlyNet) + monthly;
      withoutFee = withoutFee * (1 + rMonthly) + monthly;
    }
    data.push({ year, withFee: Math.round(withFee), withoutFee: Math.round(withoutFee), drag: Math.round(withoutFee - withFee) });
  }
  return data;
}

/** Unique categories from ETF list */
export function getCategories(etfs) {
  const cats = [...new Set(etfs.map(e => e.category))];
  return ['ALL', ...cats];
}

/** Holdings overlap between two ETFs (tickers in top10) */
export function holdingsOverlap(etfA, etfB) {
  const namesA = new Set(etfA.top10Holdings.map(h => h.name));
  const overlap = etfB.top10Holdings.filter(h => namesA.has(h.name));
  return overlap;
}
