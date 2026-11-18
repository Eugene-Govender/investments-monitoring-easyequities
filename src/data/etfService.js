import etfsRaw from '../../data/etfs.json';
import ratesRaw from '../../data/exchange_rates.json';
import catalogRaw from '../../data/catalog.json';

export const BASE_ETFS = etfsRaw.etfs;
export const ALL_ETFS = etfsRaw.etfs;
export const METADATA = etfsRaw.metadata;
export const RATES = { ...ratesRaw };
export const EXTENDED_CATALOG = catalogRaw;

const STORAGE_KEY_CUSTOM_ETFS = 'easyequities_custom_etfs_v1';
const STORAGE_KEY_LIVE_RATE = 'easyequities_live_rate_v1';

/** Retrieve all ETFs (baseline + custom user-added ETFs) */
export function getActiveETFs() {
  if (typeof window === 'undefined') return BASE_ETFS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY_CUSTOM_ETFS);
    if (!stored) return BASE_ETFS;
    const customList = JSON.parse(stored);
    // Merge without duplicates by ID
    const baseIds = new Set(BASE_ETFS.map(e => e.id));
    const uniqueCustom = customList.filter(c => !baseIds.has(c.id));
    return [...BASE_ETFS, ...uniqueCustom];
  } catch {
    return BASE_ETFS;
  }
}

/** Save a new ETF from the catalog to local dashboard */
export function addCustomETF(etf) {
  if (typeof window === 'undefined') return;
  try {
    const current = getActiveETFs();
    if (current.some(e => e.id === etf.id || e.ticker === etf.ticker)) return;
    const stored = localStorage.getItem(STORAGE_KEY_CUSTOM_ETFS);
    const customList = stored ? JSON.parse(stored) : [];
    customList.push(etf);
    localStorage.setItem(STORAGE_KEY_CUSTOM_ETFS, JSON.stringify(customList));
  } catch (err) {
    console.error('Failed to save custom ETF', err);
  }
}

/** Remove a custom-added ETF */
export function removeCustomETF(id) {
  if (typeof window === 'undefined') return;
  try {
    const stored = localStorage.getItem(STORAGE_KEY_CUSTOM_ETFS);
    if (!stored) return;
    const customList = JSON.parse(stored).filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEY_CUSTOM_ETFS, JSON.stringify(customList));
  } catch (err) {
    console.error('Failed to remove custom ETF', err);
  }
}

/** Get live or saved exchange rate */
export function getCurrentUSDZAR() {
  if (typeof window === 'undefined') return RATES.rates.ZAR;
  try {
    const saved = localStorage.getItem(STORAGE_KEY_LIVE_RATE);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.rate && typeof parsed.rate === 'number') return parsed.rate;
    }
  } catch {}
  return RATES.rates.ZAR;
}

/** Fetch live spot USD/ZAR rate from open API */
export async function fetchLiveUSDZAR() {
  try {
    // Open reliable forex rate endpoint with no auth needed
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    if (!res.ok) throw new Error('Network error fetching forex');
    const data = await res.json();
    if (data && data.rates && data.rates.ZAR) {
      const liveRate = Math.round(data.rates.ZAR * 100) / 100;
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_LIVE_RATE, JSON.stringify({
          rate: liveRate,
          lastUpdated: new Date().toISOString()
        }));
      }
      RATES.rates.ZAR = liveRate;
      return { success: true, rate: liveRate, timestamp: new Date().toLocaleTimeString() };
    }
    throw new Error('Rate format unexpected');
  } catch (err) {
    console.warn('Live forex fetch fallback to base peg:', err);
    return { success: false, rate: RATES.rates.ZAR, timestamp: new Date().toLocaleTimeString() };
  }
}

/** Convert ZAR → USD or keep USD */
export function convertValue(value, fromCurrency, toCurrency, rate = getCurrentUSDZAR()) {
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
    if (aVal === null && bVal === null) return 0;
    if (aVal === null) return 1;
    if (bVal === null) return -1;
    if (dir === 'asc') return aVal > bVal ? 1 : -1;
    return aVal < bVal ? 1 : -1;
  });
}

/** KPI computations — skips funds with null returns */
export function computeKPIs(etfs) {
  const withReturns = etfs.filter(e => e.returns && e.returns.fiveYearAnnualized !== null);
  const with3Y = etfs.filter(e => e.returns && e.returns.threeYearAnnualized !== null);
  const lowestTER = [...etfs].sort((a, b) => a.ter - b.ter)[0];
  const best3Y = [...with3Y].sort((a, b) => b.returns.threeYearAnnualized - a.returns.threeYearAnnualized)[0];
  const best5Y = [...withReturns].sort((a, b) => b.returns.fiveYearAnnualized - a.returns.fiveYearAnnualized)[0];
  const bestYield = [...etfs].sort((a, b) => b.dividendYield - a.dividendYield)[0];
  const tfsaTop = [...withReturns].filter(e => e.tfsaEligible).sort((a, b) => b.returns.fiveYearAnnualized - a.returns.fiveYearAnnualized)[0];
  return { lowestTER, best3Y, best5Y, bestYield, tfsaTop };
}

/** Compound fee drag simulation */
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
  if (!etfA.top10Holdings || !etfB.top10Holdings) return [];
  const namesA = new Set(etfA.top10Holdings.map(h => h.name));
  return etfB.top10Holdings.filter(h => namesA.has(h.name) && h.weight > 0);
}

/** Search all funds across baseline + extended catalog */
export function searchCatalog(query) {
  if (!query || !query.trim()) return [];
  const q = query.trim().toUpperCase();

  // Combine baseline + extended catalog with unified structure
  const allAvailable = [
    ...BASE_ETFS.map(e => ({
      ...e,
      onEasyEquities: true,
      eeAccount: e.accountType,
      source: 'baseline'
    })),
    ...EXTENDED_CATALOG.map(c => ({
      ...c,
      id: c.ticker.toLowerCase(),
      isin: c.isin || 'N/A',
      accountType: c.eeAccount,
      source: 'catalog',
      top10Holdings: c.top10Holdings || [
        { name: `${c.benchmark} constituents`, weight: 95 },
        { name: "Cash / Liquidity", weight: 5 }
      ],
      sectors: c.sectors || [{ name: c.category, weight: 100 }],
      geography: c.geography || [{ region: c.account === 'ZAR' ? 'South Africa' : 'Global', weight: 100 }]
    }))
  ];

  // Exact match first, then ticker starts-with, then name contains
  return allAvailable.filter(item => {
    return item.ticker.toUpperCase().includes(q) || 
           item.name.toUpperCase().includes(q) ||
           item.category.toUpperCase().includes(q) ||
           item.issuer.toUpperCase().includes(q);
  });
}
