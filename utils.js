/* ============================================
   UTILS — Pure helper functions
   ============================================ */

function getCountryCfg() { return COUNTRY_CONFIG[profile.country] || COUNTRY_CONFIG['CL']; }
function getUnitName() { return getCountryCfg().unitName; }

function fmt(n) { var c = getCountryCfg(); return c.symbol + n.toLocaleString(c.locale); }
function fmtUF(n) { var u = getUnitName(); return u ? (u + ' ' + n.toLocaleString(getCountryCfg().locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })) : fmt(n); }
function ufToCLP(uf) { return Math.round(uf * (profile.uf || 1)); }
function clpToUF(clp) { return clp / (profile.uf || 1); }

function trunc(s, l) { return s.length > l ? s.substring(0, l) + '...' : s; }
function getCatColor(cat) { return (CAT_CONFIG[cat] || {}).color || FALLBACK_COLORS[Math.abs(hashStr(cat)) % FALLBACK_COLORS.length]; }
function getCatIcon(cat) { return (CAT_CONFIG[cat] || {}).icon || '\u{1F4CC}'; }
function hashStr(s) { var h=0; for(var i=0;i<s.length;i++) h=((h<<5)-h)+s.charCodeAt(i); return h; }

function gid() { return Date.now().toString(36) + Math.random().toString(36).substr(2, 5); }
function normalizeDesc(s) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 25);
}

function isExcluded(category) {
  if (!category) return false;
  return ALWAYS_EXCLUDED.indexOf(category) >= 0 || category.indexOf('Prestamos') === 0;
}

function isRealExpense(tx) {
  return tx.type === 'gasto' && !isExcluded(tx.category);
}

function isVisible(tx) {
  return HIDDEN_CATEGORIES.indexOf(tx.category) === -1;
}

function isDuplicate(t) {
  var nd = normalizeDesc(t.description);
  return transactions.some(function(x) {
    return x.date === t.date && x.amount === t.amount && normalizeDesc(x.description) === nd;
  });
}

function getUniqueDays(txs) {
  return new Set(txs.map(function(t) { return t.date; })).size;
}
function getUniqueMonths(txs) {
  return new Set(txs.map(function(t) { return t.date ? t.date.substring(0,7) : ''; })).size;
}

function saveTransactions() { /* saved via Supabase in db.js */ }
function saveRules() { /* saved via Supabase in db.js */ }
