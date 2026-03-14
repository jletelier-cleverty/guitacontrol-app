/* ============================================
   FINANZAS PANEL - App Logic v3
   ============================================ */

const STATE_KEY = 'finanzas_data';
const RULES_KEY = 'finanzas_rules_v3';

// Categorias invisibles en dashboard/KPIs/graficos (pero visibles atenuadas en tabla)
const HIDDEN_CATEGORIES = ['Transferencias Propias'];
// Categorias excluidas de gastos reales (atenuadas en tabla)
const ALWAYS_EXCLUDED = ['Transferencias Propias', 'Ahorro'];

const CAT_CONFIG = {
  'Dividendo / Vivienda':    { color: '#4f46e5', icon: '\u{1F3E0}' },
  'Educacion / Ninos':       { color: '#8b5cf6', icon: '\u{1F4DA}' },
  'Supermercado':             { color: '#10b981', icon: '\u{1F6D2}' },
  'Restaurantes / Comida':   { color: '#f59e0b', icon: '\u{1F37D}' },
  'Delivery':                 { color: '#f97316', icon: '\u{1F6F5}' },
  'Bencina / Auto':           { color: '#6366f1', icon: '\u26FD' },
  'Transporte':               { color: '#06b6d4', icon: '\u{1F697}' },
  'Salud':                    { color: '#ec4899', icon: '\u{1F3E5}' },
  'Seguros':                  { color: '#14b8a6', icon: '\u{1F6E1}' },
  'Suscripciones':            { color: '#a855f7', icon: '\u{1F4F1}' },
  'Compras Online':           { color: '#e11d48', icon: '\u{1F6CD}' },
  'Compras en Cuotas':        { color: '#7c3aed', icon: '\u{1F501}' },
  'Servicios Basicos':        { color: '#0ea5e9', icon: '\u{1F4A1}' },
  'Creditos / Banco':         { color: '#64748b', icon: '\u{1F3E6}' },
  'Prestamos Cleverty':       { color: '#0369a1', icon: '\u{1F3DB}' },
  'Entretenimiento':          { color: '#d946ef', icon: '\u{1F3AF}' },
  'Bienestar':                { color: '#22c55e', icon: '\u{1F486}' },
  'Mascotas':                 { color: '#84cc16', icon: '\u{1F43E}' },
  'IA':                        { color: '#2dd4bf', icon: '\u{1F916}' },
  'Regalos':                  { color: '#e879f9', icon: '\u{1F381}' },
  'Hogar':                    { color: '#eab308', icon: '\u{1F3E1}' },
  'Ropa / Personal':          { color: '#f43f5e', icon: '\u{1F455}' },
  'Nana / Empleados':         { color: '#78716c', icon: '\u{1F3E0}' },
  'Dividendo / Inversion':              { color: '#0284c7', icon: '\u{1F3E2}' },
  'Transferencias Propias':   { color: '#94a3b8', icon: '\u{1F504}' },
  'Ingresos Trabajo':         { color: '#059669', icon: '\u{1F4B0}' },
  'Arriendos / Inversiones':   { color: '#15803d', icon: '\u{1F3E2}' },
  'Ingresos Otros':           { color: '#16a34a', icon: '\u{1F4B5}' },
  'Ahorro':                    { color: '#0d9488', icon: '\u{1F3AF}' },
  'Sin Categorizar':          { color: '#9ca3af', icon: '\u2753' },
};

const FALLBACK_COLORS = ['#4f46e5','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#06b6d4','#84cc16','#f97316','#6366f1'];
const CUSTOM_CATS_KEY = 'finanzas_custom_cats';
var customCats = JSON.parse(localStorage.getItem(CUSTOM_CATS_KEY) || '{}');
Object.keys(customCats).forEach(function(k) { CAT_CONFIG[k] = customCats[k]; });

let transactions = JSON.parse(localStorage.getItem(STATE_KEY) || '[]');
let rules = JSON.parse(localStorage.getItem(RULES_KEY) || 'null');
let charts = {};
let activeCatFilter = 'all';

if (!rules) {
  rules = [
    { keyword: 'hipotecaria evoluciona', category: 'Dividendo / Vivienda' },
    { keyword: 'inmobiliaria panoramica', category: 'Dividendo / Inversion' },
    { keyword: 'servipag', category: 'Dividendo / Inversion' },
    { keyword: 'rainbow', category: 'Educacion / Ninos' },
    { keyword: 'huinganal', category: 'Educacion / Ninos' },
    { keyword: 'corporacion chileno alemana', category: 'Educacion / Ninos' },
    { keyword: 'tip y tap', category: 'Educacion / Ninos' },
    { keyword: 'caramba', category: 'Educacion / Ninos' },
    { keyword: 'jumbo', category: 'Supermercado' },
    { keyword: 'tottus', category: 'Supermercado' },
    { keyword: 'exp pie andino', category: 'Supermercado' },
    { keyword: 'mc donalds', category: 'Restaurantes / Comida' },
    { keyword: 'mcdonalds', category: 'Restaurantes / Comida' },
    { keyword: 'bk la dehesa', category: 'Restaurantes / Comida' },
    { keyword: 'eric kayser', category: 'Restaurantes / Comida' },
    { keyword: 'costa norte', category: 'Restaurantes / Comida' },
    { keyword: 'patio', category: 'Restaurantes / Comida' },
    { keyword: 'el golf', category: 'Restaurantes / Comida' },
    { keyword: 'foods dtk', category: 'Restaurantes / Comida' },
    { keyword: 'laguna', category: 'Restaurantes / Comida' },
    { keyword: 'cafe la canastita', category: 'Restaurantes / Comida' },
    { keyword: 'margo isidora', category: 'Restaurantes / Comida' },
    { keyword: 'aleman experto', category: 'Restaurantes / Comida' },
    { keyword: 'haulmer', category: 'Restaurantes / Comida' },
    { keyword: 'segreta', category: 'Restaurantes / Comida' },
    { keyword: 'casa costanera', category: 'Restaurantes / Comida' },
    { keyword: 'casacostanera', category: 'Restaurantes / Comida' },
    { keyword: 'work cafe', category: 'Restaurantes / Comida' },
    { keyword: 'quinto pin', category: 'Restaurantes / Comida' },
    { keyword: 'row', category: 'Restaurantes / Comida' },
    { keyword: 'uber eats', category: 'Delivery' },
    { keyword: 'rappi', category: 'Delivery' },
    { keyword: 'copec', category: 'Bencina / Auto' },
    { keyword: 'aramco', category: 'Bencina / Auto' },
    { keyword: 'pronto', category: 'Bencina / Auto' },
    { keyword: 'tag total', category: 'Bencina / Auto' },
    { keyword: 'simplepark', category: 'Bencina / Auto' },
    { keyword: 'parksur', category: 'Bencina / Auto' },
    { keyword: 'parquime', category: 'Bencina / Auto' },
    { keyword: 'puchuncavi', category: 'Bencina / Auto' },
    { keyword: 'uber', category: 'Transporte' },
    { keyword: 'clinica alemana', category: 'Salud' },
    { keyword: 'cesfam', category: 'Salud' },
    { keyword: 'salcobrand', category: 'Salud' },
    { keyword: 'metlife', category: 'Seguros' },
    { keyword: 'chilena cons.seg', category: 'Seguros' },
    { keyword: 'seguro fu', category: 'Seguros' },
    { keyword: 'netflix', category: 'Suscripciones' },
    { keyword: 'spotify', category: 'Suscripciones' },
    { keyword: 'apple', category: 'Suscripciones' },
    { keyword: 'kindle', category: 'Suscripciones' },
    { keyword: 'audible', category: 'Suscripciones' },
    { keyword: 'wix.com', category: 'Suscripciones' },
    { keyword: 'mercado libre', category: 'Compras Online' },
    { keyword: 'mercadopago', category: 'Compras Online' },
    { keyword: 'merpago', category: 'Compras Online' },
    { keyword: 'aliexpre', category: 'Compras Online' },
    { keyword: 'falabella.com', category: 'Compras Online' },
    { keyword: 'movistar', category: 'Servicios Basicos' },
    { keyword: 'pago de credito', category: 'Creditos / Banco' },
    { keyword: 'cargo automatico de credito', category: 'Prestamos Cleverty' },
    { keyword: 'comision adm', category: 'Creditos / Banco' },
    { keyword: 'interes saldo aplazado', category: 'Creditos / Banco' },
    { keyword: 'impuesto ite', category: 'Creditos / Banco' },
    { keyword: 'club de golf', category: 'Entretenimiento' },
    { keyword: 'bioparque', category: 'Entretenimiento' },
    { keyword: 'buinzoo', category: 'Entretenimiento' },
    { keyword: 'bestias spa', category: 'Bienestar' },
    { keyword: 'salon oscar', category: 'Bienestar' },
    { keyword: 'global66', category: 'Transferencias Propias' },
    { keyword: 'banco consorcio', category: 'Transferencias Propias' },
    { keyword: 'itau chile', category: 'Transferencias Propias' },
    { keyword: 'pago tarjeta cmr', category: 'Transferencias Propias' },
    { keyword: 'tarjeta cmr', category: 'Transferencias Propias' },
    { keyword: 'pago tarjeta visa', category: 'Transferencias Propias' },
    { keyword: 'jtlc spa', category: 'Transferencias Propias' },
    { keyword: 'banco santander', category: 'Transferencias Propias' },
    { keyword: 'cleverty', category: 'Prestamos Cleverty' },
    { keyword: 'tricapitals', category: 'Ingresos Trabajo' },
    { keyword: 'depositos con documentos', category: 'Ingresos Otros' },
    { keyword: 'khipu', category: 'Ingresos Otros' },
    { keyword: 'gonzalo delgado', category: 'Hogar' },
    { keyword: 'gonzalo vasquez', category: 'Hogar' },
    { keyword: 'dayana peralta', category: 'Nana / Empleados' },
    { keyword: 'karolay carrillo', category: 'Nana / Empleados' },
    { keyword: 'andreina martinez', category: 'Nana / Empleados' },
    { keyword: 'maria constanza', category: 'Transferencias Propias' },
    { keyword: 'francisca undurraga', category: 'Transferencias Propias' },
    { keyword: 'benjamin bercovich', category: 'Transferencias Propias' },
    { keyword: 'benjamin reichhardt', category: 'Transferencias Propias' },
  ];
  saveRules();
}

// ---- PARSERS ----

function parseBICE(workbook) {
  var sheet = workbook.Sheets[workbook.SheetNames[0]];
  var raw = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  var results = [];
  var headerRow = -1;
  var colFecha = -1, colCat = -1, colDesc = -1, colMonto = -1;
  for (var i = 0; i < raw.length; i++) {
    var row = raw[i];
    if (!row) continue;
    for (var j = 0; j < row.length; j++) {
      var v = String(row[j] || '').toLowerCase().trim();
      if (v === 'fecha') colFecha = j;
      if (v === 'categoria' || v.indexOf('categor') === 0) colCat = j;
      if (v === 'descripcion' || v.indexOf('descrip') === 0) colDesc = j;
      if (v === 'monto') colMonto = j;
    }
    if (colFecha >= 0 && colCat >= 0 && colDesc >= 0 && colMonto >= 0) {
      headerRow = i;
      break;
    }
    colFecha = colCat = colDesc = colMonto = -1;
  }
  if (headerRow === -1) return results;
  for (var i = headerRow + 1; i < raw.length; i++) {
    var row = raw[i];
    if (!row || !row[colFecha] || !row[colMonto]) continue;
    var dateObj = parseDateBICE(String(row[colFecha]));
    if (!dateObj) continue;
    var montoStr = String(row[colMonto]).replace(/[\$\.]/g, '').replace(/,/g, '').trim();
    var amount = parseInt(montoStr) || 0;
    if (amount === 0) continue;
    results.push({
      id: gid(), date: dateObj.toISOString().split('T')[0],
      description: cleanDesc(String(row[colDesc] || '')),
      amount: amount,
      type: String(row[colCat] || '').toLowerCase().indexOf('abono') >= 0 ? 'ingreso' : 'gasto',
      source: 'banco', category: '',
      month: dateObj.getFullYear() + '-' + String(dateObj.getMonth()+1).padStart(2,'0')
    });
  }
  return results;
}

function parseDateBICE(str) {
  var m = { ene:0,feb:1,mar:2,abr:3,may:4,jun:5,jul:6,ago:7,sep:8,oct:9,nov:10,dic:11 };
  var p = str.trim().split(' ');
  if (p.length < 3) return null;
  var d = parseInt(p[0]), mo = m[p[1].toLowerCase()], y = parseInt(p[2]);
  return (isNaN(d) || mo === undefined || isNaN(y)) ? null : new Date(y, mo, d);
}

function parseCMRExcel(workbook) {
  var sheet = workbook.Sheets[workbook.SheetNames[0]];
  var raw = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  var results = [];
  var headerRow = -1;
  var colFecha = -1, colDesc = -1, colMonto = -1, colValorCuota = -1;
  for (var i = 0; i < Math.min(raw.length, 10); i++) {
    var row = raw[i];
    if (!row) continue;
    for (var j = 0; j < row.length; j++) {
      var v = String(row[j] || '').trim().toLowerCase();
      if (v === 'fecha') colFecha = j;
      if (v === 'descripcion' || v.indexOf('descrip') === 0) colDesc = j;
      if (v === 'monto' || v.indexOf('monto') >= 0) colMonto = j;
      if (v.indexOf('valor cuota') >= 0) colValorCuota = j;
    }
    if (colFecha >= 0 && colDesc >= 0 && colMonto >= 0) {
      headerRow = i;
      break;
    }
    colFecha = colDesc = colMonto = -1;
    colValorCuota = -1;
  }
  if (headerRow === -1) return results;

  for (var i = headerRow + 1; i < raw.length; i++) {
    var row = raw[i];
    if (!row || row[colFecha] === undefined || row[colFecha] === null) continue;
    var dateObj;
    if (typeof row[colFecha] === 'number') {
      dateObj = new Date((row[colFecha] - 25569) * 86400000);
    } else {
      dateObj = new Date(row[colFecha]);
    }
    if (isNaN(dateObj.getTime())) continue;
    var desc = cleanDescCMR(String(row[colDesc] || ''));
    if (!desc) continue;
    var monto = Math.abs(parseInt(row[colMonto]) || 0);
    if (monto === 0) continue;
    var isPay = false;
    if (colValorCuota >= 0 && row[colValorCuota] !== undefined) {
      isPay = Number(row[colValorCuota]) < 0;
    }
    if (!isPay) isPay = desc.toLowerCase().indexOf('pago tarjeta') >= 0;
    results.push({
      id: gid(), date: dateObj.toISOString().split('T')[0],
      description: desc, amount: monto,
      type: isPay ? 'ingreso' : 'gasto',
      source: 'tc', category: '',
      month: dateObj.getFullYear() + '-' + String(dateObj.getMonth()+1).padStart(2,'0')
    });
  }
  return results;
}

function parseCMRPdf(text) {
  var results = [];
  var lines = text.split('\n');
  var dateRegex = /(\d{2}\/\d{2}\/\d{4})/;
  var periodoHasta = null;
  var pm = text.match(/Per[ií]odo Facturado\s+(\d{2}\/\d{2}\/\d{4})\s+(\d{2}\/\d{2}\/\d{4})/);
  if (pm) periodoHasta = pm[2];
  for (var li = 0; li < lines.length; li++) {
    var line = lines[li];
    var dm = line.match(dateRegex);
    if (!dm) continue;
    var parts = dm[1].split('/').map(Number);
    var dateObj = new Date(parts[2], parts[1]-1, parts[0]);
    if (isNaN(dateObj.getTime())) continue;
    var afterDate = line.substring(line.indexOf(dm[1]) + dm[1].length).trim();
    var tm = afterDate.match(/^(.+?)\s+T\s+(-?[\d.,]+)\s/);
    if (!tm) continue;
    var desc = tm[1].replace(/\s+\d+-\d+$/, '').trim();
    var monto = parseInt(tm[2].replace(/\./g, '').replace(',', '')) || 0;
    if (monto === 0) continue;
    var isPay = monto < 0;
    if (isPay) monto = Math.abs(monto);
    results.push({
      id: gid(), date: dateObj.toISOString().split('T')[0], description: desc,
      amount: monto, type: isPay ? 'ingreso' : 'gasto', source: 'tc', category: '',
      month: dateObj.getFullYear() + '-' + String(dateObj.getMonth()+1).padStart(2,'0')
    });
  }
  for (var li = 0; li < lines.length; li++) {
    var line = lines[li];
    var im = line.match(/Interes saldo aplazado\s+([\d.,]+)\s/);
    if (im && periodoHasta) {
      var p2 = periodoHasta.split('/').map(Number);
      results.push({ id: gid(), date: new Date(p2[2],p2[1]-1,p2[0]).toISOString().split('T')[0],
        description: 'Interes saldo aplazado', amount: parseInt(im[1].replace(/\./g,''))||0,
        type: 'gasto', source: 'tc', category: '',
        month: p2[2] + '-' + String(p2[1]).padStart(2,'0') });
    }
    var it = line.match(/Impuesto ite.*?\s+([\d.,]+)\s+([\d.,]+)/);
    if (it && periodoHasta) {
      var p3 = periodoHasta.split('/').map(Number);
      results.push({ id: gid(), date: new Date(p3[2],p3[1]-1,p3[0]).toISOString().split('T')[0],
        description: 'Impuesto ITE TC', amount: parseInt(it[1].replace(/\./g,''))||0,
        type: 'gasto', source: 'tc', category: '',
        month: p3[2] + '-' + String(p3[1]).padStart(2,'0') });
    }
  }
  return results;
}

function cleanDesc(desc) {
  return desc.replace(/\s+/g, ' ')
    .replace(/Rut\s*\d+[\.\-\dkK]+/gi, '')
    .replace(/el \d{4}-\d{2}-\d{2} a las \d{2}:\d{2}(:\d{2})?\s*hrs\.?/gi, '')
    .replace(/el \d{2}\/\d{2}\/\d{4}\s*(a las)?\s*\d{2}:\d{2}/gi, '')
    .replace(/desde Banco BICE/gi, '')
    .replace(/a Cuenta (Corriente|Vista) de [^,]+,?/gi, '')
    .replace(/\s+/g, ' ').trim();
}

function cleanDescCMR(desc) {
  return desc.replace(/^COMPRA\s+/i, '').replace(/\*+$/, '').replace(/\s+/g, ' ').trim();
}

function categorize(tx) {
  var d = tx.description.toLowerCase();
  for (var i = 0; i < rules.length; i++) {
    if (d.indexOf(rules[i].keyword.toLowerCase()) >= 0) return rules[i].category;
  }
  return '';
}

function categorizeAll() {
  transactions.forEach(function(tx) { if (!tx.category) tx.category = categorize(tx); });
  saveTransactions();
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

function saveTransactions() { localStorage.setItem(STATE_KEY, JSON.stringify(transactions)); }
function saveRules() { localStorage.setItem(RULES_KEY, JSON.stringify(rules)); }
function gid() { return Date.now().toString(36) + Math.random().toString(36).substr(2, 5); }
function normalizeDesc(s) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 25);
}
function isDuplicate(t) {
  var nd = normalizeDesc(t.description);
  return transactions.some(function(x) {
    return x.date === t.date && x.amount === t.amount && normalizeDesc(x.description) === nd;
  });
}
function removeDuplicates() {
  var seen = {};
  var clean = [];
  transactions.forEach(function(tx) {
    var key = tx.date + '|' + tx.amount + '|' + normalizeDesc(tx.description);
    if (!seen[key]) {
      seen[key] = true;
      clean.push(tx);
    }
  });
  var removed = transactions.length - clean.length;
  transactions = clean;
  saveTransactions();
  return removed;
}
function fmt(n) { return '$' + n.toLocaleString('es-CL'); }
function trunc(s, l) { return s.length > l ? s.substring(0, l) + '...' : s; }
function getCatColor(cat) { return (CAT_CONFIG[cat] || {}).color || FALLBACK_COLORS[Math.abs(hashStr(cat)) % FALLBACK_COLORS.length]; }
function getCatIcon(cat) { return (CAT_CONFIG[cat] || {}).icon || '\u{1F4CC}'; }
function hashStr(s) { var h=0; for(var i=0;i<s.length;i++) h=((h<<5)-h)+s.charCodeAt(i); return h; }

// ---- IMPORT ----

function addParsedTransactions(parsed) {
  var added = 0, dupes = 0;
  parsed.forEach(function(tx) {
    if (isDuplicate(tx)) { dupes++; return; }
    tx.category = categorize(tx);
    transactions.push(tx);
    added++;
  });
  saveTransactions();
  return { added: added, dupes: dupes, total: parsed.length };
}

async function importFile(file) {
  var name = file.name.toLowerCase();
  var isPdf = name.endsWith('.pdf');

  if (isPdf) {
    // PDF — try CMR parser
    var ab = await file.arrayBuffer();
    var pdf = await pdfjsLib.getDocument({ data: ab }).promise;
    var lineText = '';
    for (var i = 1; i <= pdf.numPages; i++) {
      var page = await pdf.getPage(i);
      var content = await page.getTextContent();
      var lastY = null, line = '';
      content.items.forEach(function(item) {
        var y = Math.round(item.transform[5]);
        if (lastY !== null && Math.abs(y - lastY) > 3) { lineText += line.trim() + '\n'; line = ''; }
        line += item.str + ' '; lastY = y;
      });
      lineText += line.trim() + '\n';
    }
    var parsed = parseCMRPdf(lineText);
    return { results: addParsedTransactions(parsed), source: 'PDF' };
  } else {
    // Excel — auto-detect: try BICE first, then CMR
    var ab = await file.arrayBuffer();
    var wb = XLSX.read(ab, { type: 'array' });
    var biceParsed = parseBICE(wb);
    if (biceParsed.length > 0) {
      return { results: addParsedTransactions(biceParsed), source: 'Banco BICE' };
    }
    var cmrParsed = parseCMRExcel(wb);
    if (cmrParsed.length > 0) {
      return { results: addParsedTransactions(cmrParsed), source: 'TC CMR' };
    }
    return { results: { added: 0, dupes: 0, total: 0 }, source: 'No reconocido' };
  }
}

async function importFiles(files) {
  var statusEl = document.getElementById('importStatus');
  statusEl.textContent = 'Procesando ' + files.length + ' archivo(s)...';
  statusEl.className = 'import-status';
  var totalAdded = 0, totalDupes = 0, messages = [];
  for (var i = 0; i < files.length; i++) {
    try {
      var result = await importFile(files[i]);
      var r = result.results;
      totalAdded += r.added;
      totalDupes += r.dupes;
      messages.push(files[i].name + ': ' + r.added + ' nuevas' + (r.dupes > 0 ? ', ' + r.dupes + ' duplicadas' : '') + (r.total === 0 ? ' (formato no reconocido)' : '') + ' [' + result.source + ']');
    } catch (err) {
      messages.push(files[i].name + ': Error — ' + err.message);
    }
  }
  statusEl.innerHTML = '<strong>' + totalAdded + ' transacciones importadas</strong>' + (totalDupes > 0 ? ' (' + totalDupes + ' duplicadas ignoradas)' : '') + '<br><small>' + messages.join('<br>') + '</small>';
  statusEl.className = 'import-status success';
  document.getElementById('fileImport').value = '';
  refreshAll();
}

// ---- NAVIGATION ----
document.querySelectorAll('.nav-item').forEach(function(item) {
  item.addEventListener('click', function(e) {
    e.preventDefault();
    var view = item.dataset.view;
    document.querySelectorAll('.nav-item').forEach(function(n) { n.classList.remove('active'); });
    item.classList.add('active');
    document.querySelectorAll('.view').forEach(function(v) { v.classList.remove('active'); });
    document.getElementById('view-' + view).classList.add('active');
    var t = { dashboard:['Dashboard','Resumen de tus finanzas'], metas:['Metas','Para que nunca se te olvide'],
      transacciones:['Transacciones','Detalle de movimientos'],
      categorias:['Categorias','Reglas y conciliacion'], importar:['Importar','Sube cartolas y estados de cuenta'],
      revisar:['Revisar','Corrige categorias mal asignadas'], patrimonio:['Patrimonio','Inversiones, ahorro y proyeccion'] };
    document.getElementById('viewTitle').textContent = (t[view]||['',''])[0];
    document.getElementById('viewSubtitle').textContent = (t[view]||['',''])[1];
    // Close mobile menu on nav
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('mobileOverlay').classList.remove('open');
  });
});

// ---- MOBILE MENU ----
document.getElementById('mobileMenuBtn').addEventListener('click', function() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('mobileOverlay').classList.toggle('open');
});
document.getElementById('mobileOverlay').addEventListener('click', function() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('mobileOverlay').classList.remove('open');
});

// ---- MONTH FILTER ----
var MN = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

function populateMonthFilter() {
  var sel = document.getElementById('monthFilter');
  var months = [...new Set(transactions.map(function(t) { return t.month; }))].sort().reverse();
  var cur = sel.value;
  sel.innerHTML = '<option value="all">Todos los meses</option>';
  months.forEach(function(m) { var p=m.split('-'); var o=document.createElement('option'); o.value=m; o.textContent=MN[parseInt(p[1])-1]+' '+p[0]; sel.appendChild(o); });
  sel.value = cur || 'all';
}

document.getElementById('monthFilter').addEventListener('change', function() { activeCatFilter='all'; refreshAll(); });

// getFilteredAll: todo incluyendo transferencias (para tabla)
function getFilteredAll() {
  var m = document.getElementById('monthFilter').value;
  var list = m === 'all' ? transactions.slice() : transactions.filter(function(t) { return t.month === m; });
  if (activeCatFilter !== 'all') list = list.filter(function(t) { return (t.category || 'Sin Categorizar') === activeCatFilter; });
  return list;
}

// getFiltered: sin categorias ocultas (para dashboard)
function getFiltered() {
  return getFilteredAll().filter(isVisible);
}

function getFilteredByMonth() {
  var m = document.getElementById('monthFilter').value;
  var list = m === 'all' ? transactions.slice() : transactions.filter(function(t) { return t.month === m; });
  return list.filter(isVisible);
}

// ---- DASHBOARD ----
function renderDashboard() {
  var all = getFilteredByMonth();
  var filtered = getFiltered();
  var gastosReales = filtered.filter(isRealExpense);
  var ingresos = filtered.filter(function(t) { return t.type === 'ingreso' && !isExcluded(t.category); });
  var totalG = gastosReales.reduce(function(s,t) { return s+t.amount; }, 0);
  var totalI = ingresos.reduce(function(s,t) { return s+t.amount; }, 0);
  var balance = totalI - totalG;

  document.getElementById('kpiIngresos').textContent = fmt(totalI);
  document.getElementById('kpiGastos').textContent = fmt(totalG);
  var bEl = document.getElementById('kpiBalance');
  bEl.textContent = (balance < 0 ? '-' : '') + fmt(Math.abs(balance));
  bEl.className = 'kpi-value ' + (balance >= 0 ? 'green' : 'red');

  var avgDiario = gastosReales.length > 0 ? Math.round(totalG / Math.max(1, getUniqueDays(gastosReales))) : 0;
  document.getElementById('kpiPromedio').textContent = fmt(avgDiario);
  var uncatCount = all.filter(function(t) { return !t.category && t.type === 'gasto'; }).length;
  document.getElementById('kpiSinCat').textContent = uncatCount;
  document.getElementById('kpiSinCat').className = 'kpi-value ' + (uncatCount > 0 ? 'yellow' : '');
  document.getElementById('kpiTxCount').textContent = filtered.length;

  // Debug panel — show ALL transactions breakdown including excluded
  var debugAll = getFilteredAll(); // includes hidden categories
  var debugIncome = {};
  var debugExpense = {};
  debugAll.forEach(function(t) {
    var cat = t.category || 'Sin Categorizar';
    if (t.type === 'ingreso') {
      if (!debugIncome[cat]) debugIncome[cat] = 0;
      debugIncome[cat] += t.amount;
    } else {
      if (!debugExpense[cat]) debugExpense[cat] = 0;
      debugExpense[cat] += t.amount;
    }
  });

  var debugPanel = document.getElementById('debugPanel');
  var debugDetail = document.getElementById('debugDetail');
  if (debugAll.length > 0) {
    debugPanel.style.display = '';
    var html = '<div class="debug-section"><div class="debug-section-title">Ingresos por categoria</div>';
    var incTotal = 0;
    Object.entries(debugIncome).sort(function(a,b) { return b[1]-a[1]; }).forEach(function(e) {
      var excluded = isExcluded(e[0]);
      incTotal += excluded ? 0 : e[1];
      html += '<div class="debug-row' + (excluded ? ' debug-excluded' : '') + '"><span>' + getCatIcon(e[0]) + ' ' + e[0] + (excluded ? ' (excluida)' : '') + '</span><span>+' + fmt(e[1]) + '</span></div>';
    });
    html += '<div class="debug-row debug-total"><span>Total ingresos reales</span><span>+' + fmt(incTotal) + '</span></div></div>';

    html += '<div class="debug-section"><div class="debug-section-title">Gastos por categoria</div>';
    var expTotal = 0;
    Object.entries(debugExpense).sort(function(a,b) { return b[1]-a[1]; }).forEach(function(e) {
      var excluded = isExcluded(e[0]);
      expTotal += excluded ? 0 : e[1];
      html += '<div class="debug-row' + (excluded ? ' debug-excluded' : '') + '"><span>' + getCatIcon(e[0]) + ' ' + e[0] + (excluded ? ' (excluida)' : '') + '</span><span>-' + fmt(e[1]) + '</span></div>';
    });
    html += '<div class="debug-row debug-total"><span>Total gastos reales</span><span>-' + fmt(expTotal) + '</span></div></div>';

    html += '<div class="debug-section"><div class="debug-row debug-total"><span>Balance</span><span style="color:' + (incTotal - expTotal >= 0 ? 'var(--green)' : 'var(--red)') + '">' + (incTotal - expTotal >= 0 ? '+' : '-') + fmt(Math.abs(incTotal - expTotal)) + '</span></div></div>';
    debugDetail.innerHTML = html;
  } else {
    debugPanel.style.display = 'none';
  }

  var catData = {};
  var allGastosReales = all.filter(isRealExpense);
  allGastosReales.forEach(function(t) {
    var c = t.category || 'Sin Categorizar';
    if (!catData[c]) catData[c] = { total: 0, count: 0 };
    catData[c].total += t.amount;
    catData[c].count++;
  });
  var totalAllG = allGastosReales.reduce(function(s,t) { return s+t.amount; }, 0);
  var sorted = Object.entries(catData).sort(function(a,b) { return b[1].total - a[1].total; });

  var catGrid = document.getElementById('catBreakdown');
  catGrid.innerHTML = sorted.map(function(entry) {
    var cat = entry[0], data = entry[1];
    var pct = totalAllG > 0 ? ((data.total / totalAllG) * 100).toFixed(1) : 0;
    var isActive = activeCatFilter === cat;
    return '<div class="cat-card ' + (isActive ? 'active' : '') + '" data-cat="' + cat + '" onclick="filterByCat(\'' + cat.replace(/'/g,"\\'") + '\')">' +
      '<div class="cat-card-header"><span class="cat-card-icon">' + getCatIcon(cat) + '</span><span class="cat-card-pct">' + pct + '%</span></div>' +
      '<div class="cat-card-name">' + cat + '</div>' +
      '<div class="cat-card-amount">' + fmt(data.total) + '</div>' +
      '<div class="cat-card-bar"><div style="width:' + pct + '%;background:' + getCatColor(cat) + '"></div></div>' +
      '<div class="cat-card-count">' + data.count + ' movimientos</div></div>';
  }).join('');

  if (charts.cat) charts.cat.destroy();
  var ctx1 = document.getElementById('chartCategorias').getContext('2d');
  charts.cat = new Chart(ctx1, {
    type: 'doughnut',
    data: {
      labels: sorted.map(function(c) { return c[0]; }),
      datasets: [{ data: sorted.map(function(c) { return c[1].total; }), backgroundColor: sorted.map(function(c) { return getCatColor(c[0]); }), borderWidth: 2, borderColor: '#fff' }]
    },
    options: {
      responsive: true, cutout: '65%',
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: function(ctx) { return ctx.label + ': ' + fmt(ctx.parsed) + ' (' + ((ctx.parsed/totalAllG)*100).toFixed(1) + '%)'; } } }
      },
      onClick: function(e, el) { if (el.length) filterByCat(sorted[el[0].index][0]); }
    }
  });

  var centerText = document.getElementById('chartCenter');
  if (centerText) centerText.innerHTML = '<strong>' + fmt(totalAllG) + '</strong><br><small>Total gastos</small>';

  var monthlyData = {};
  transactions.forEach(function(t) {
    if (!monthlyData[t.month]) monthlyData[t.month] = { i: 0, g: 0 };
    if (t.type === 'ingreso') monthlyData[t.month].i += t.amount;
    else if (isRealExpense(t)) monthlyData[t.month].g += t.amount;
  });
  var sm = Object.keys(monthlyData).sort();

  if (charts.monthly) charts.monthly.destroy();
  charts.monthly = new Chart(document.getElementById('chartMensual').getContext('2d'), {
    type: 'bar',
    data: {
      labels: sm.map(function(m) { var p=m.split('-'); return MN[parseInt(p[1])-1]+' '+p[0]; }),
      datasets: [
        { label: 'Ingresos', data: sm.map(function(m) { return monthlyData[m].i; }), backgroundColor: '#10b981', borderRadius: 6, barPercentage: 0.7 },
        { label: 'Gastos', data: sm.map(function(m) { return monthlyData[m].g; }), backgroundColor: '#ef4444', borderRadius: 6, barPercentage: 0.7 }
      ]
    },
    options: {
      responsive: true,
      plugins: { tooltip: { callbacks: { label: function(ctx) { return ctx.dataset.label + ': ' + fmt(ctx.parsed.y); } } }, legend: { position: 'top' } },
      scales: { y: { ticks: { callback: function(v) { return '$'+(v/1000000).toFixed(1)+'M'; } }, grid: { color: '#f0f0f0' } }, x: { grid: { display: false } } }
    }
  });

  var topDiv = document.getElementById('topGastos');
  var top = gastosReales.slice().sort(function(a,b) { return b.amount - a.amount; }).slice(0, 8);
  topDiv.innerHTML = top.map(function(t) {
    return '<div class="top-item"><span class="top-icon">' + getCatIcon(t.category || 'Sin Categorizar') + '</span>' +
      '<div class="top-info"><span class="top-desc">' + trunc(t.description, 45) + '</span><span class="top-date">' + t.date + '</span></div>' +
      '<span class="top-cat" style="background:' + getCatColor(t.category||'Sin Categorizar') + '15;color:' + getCatColor(t.category||'Sin Categorizar') + '">' + (t.category || 'Sin Cat.') + '</span>' +
      '<span class="top-amount">-' + fmt(t.amount) + '</span></div>';
  }).join('');

  // Prestamos Relacionados — auto-detect any category starting with "Prestamos"
  var loanCats = [...new Set(transactions.map(function(t) { return t.category; }))].filter(function(c) {
    return c && c.indexOf('Prestamos') === 0;
  });
  var loansContainer = document.getElementById('loansSection');
  if (loanCats.length > 0) {
    loansContainer.innerHTML = loanCats.map(function(cat) {
      var loanTxs = transactions.filter(function(t) { return t.category === cat; });
      var cobros = loanTxs.filter(function(t) { return t.type === 'gasto'; });
      var pagos = loanTxs.filter(function(t) { return t.type === 'ingreso'; });
      var totalCobros = cobros.reduce(function(s,t) { return s+t.amount; }, 0);
      var totalPagos = pagos.reduce(function(s,t) { return s+t.amount; }, 0);
      var diff = totalCobros - totalPagos;
      var diffClass = diff > 0 ? 'red' : 'green';
      var loanName = cat.replace('Prestamos ', '').replace('Prestamos', 'Relacionados');
      var diffLabel = diff > 0 ? loanName + ' te debe' : 'Cuadrado';
      var allTxs = cobros.concat(pagos).sort(function(a,b) { return b.date.localeCompare(a.date); });
      return '<div class="chart-card full-width" style="margin-bottom:16px">' +
        '<h3>' + getCatIcon(cat) + ' ' + cat + ' — Conciliacion</h3>' +
        '<div style="display:flex;gap:24px;align-items:center;margin-bottom:14px;flex-wrap:wrap">' +
        '<div><span style="font-size:0.75rem;color:var(--text-secondary);text-transform:uppercase;font-weight:600">Banco te cobra</span><br><strong class="amount-negative">' + fmt(totalCobros) + '</strong></div>' +
        '<div><span style="font-size:0.75rem;color:var(--text-secondary);text-transform:uppercase;font-weight:600">' + loanName + ' te paga</span><br><strong class="amount-positive">' + fmt(totalPagos) + '</strong></div>' +
        '<div><span style="font-size:0.75rem;color:var(--text-secondary);text-transform:uppercase;font-weight:600">' + diffLabel + '</span><br><strong class="' + diffClass + '" style="font-size:1.1rem">' + fmt(diff) + '</strong></div></div>' +
        '<div class="top-gastos">' + allTxs.map(function(t) {
          return '<div class="top-item"><span class="top-icon">' + (t.type === 'ingreso' ? '\u{1F4E5}' : '\u{1F4E4}') + '</span>' +
            '<div class="top-info"><span class="top-desc">' + trunc(t.description, 50) + '</span>' +
            '<span class="top-date">' + t.date + ' - ' + (t.source === 'banco' ? 'BICE' : 'CMR') + '</span></div>' +
            '<span class="' + (t.type==='ingreso'?'amount-positive':'amount-negative') + '">' + (t.type==='ingreso'?'+':'-') + fmt(t.amount) + '</span></div>';
        }).join('') + '</div></div>';
    }).join('');
  } else {
    loansContainer.innerHTML = '';
  }
}

window.filterByCat = function(cat) {
  activeCatFilter = activeCatFilter === cat ? 'all' : cat;
  refreshAll();
};

function getUniqueDays(txs) {
  return new Set(txs.map(function(t) { return t.date; })).size;
}

// ---- TRANSACTIONS (muestra TODO incluyendo transferencias, atenuadas) ----
function populateCatFilter() {
  var sel = document.getElementById('filterCat');
  var cur = sel.value;
  var cats = [...new Set(transactions.map(function(t) { return t.category || ''; }))].filter(Boolean).sort();
  // Keep first two static options, rebuild the rest
  while (sel.options.length > 2) sel.remove(2);
  cats.forEach(function(c) {
    var o = document.createElement('option');
    o.value = c; o.textContent = getCatIcon(c) + ' ' + c;
    sel.appendChild(o);
  });
  sel.value = cur || 'all';
}

function renderTransactions() {
  populateCatFilter();
  var filtered = getFilteredAll();
  var search = document.getElementById('searchTx').value.toLowerCase();
  var source = document.getElementById('filterSource').value;
  var type = document.getElementById('filterType').value;
  var catFilter = document.getElementById('filterCat').value;

  var list = filtered;
  if (search) list = list.filter(function(t) { return t.description.toLowerCase().indexOf(search) >= 0; });
  if (source !== 'all') list = list.filter(function(t) { return t.source === source; });
  if (type !== 'all') list = list.filter(function(t) { return t.type === type; });
  if (catFilter === 'uncategorized') list = list.filter(function(t) { return !t.category; });
  else if (catFilter !== 'all') list = list.filter(function(t) { return t.category === catFilter; });
  list.sort(function(a,b) { return b.date.localeCompare(a.date); });

  document.getElementById('txBody').innerHTML = list.map(function(t) {
    var c = getCatColor(t.category||'Sin Categorizar');
    var excluded = isExcluded(t.category);
    return '<tr class="row-' + t.type + (excluded ? ' row-excluded' : '') + '">' +
      '<td class="td-date">' + t.date + '</td>' +
      '<td class="td-desc" title="' + t.description + '">' + trunc(t.description, 65) + '</td>' +
      '<td><span class="source-badge source-' + t.source + '">' + (t.source==='banco'?'BICE':'CMR') + '</span></td>' +
      '<td class="' + (t.type==='gasto'?'amount-negative':'amount-positive') + '">' + (t.type==='gasto'?'-':'+') + fmt(t.amount) + '</td>' +
      '<td><span class="cat-pill" style="background:' + c + '15;color:' + c + ';border:1px solid ' + c + '30" onclick="openCatModal(\'' + t.id + '\')">' + getCatIcon(t.category||'Sin Categorizar') + ' ' + (t.category||'Categorizar') + '</span></td></tr>';
  }).join('');
}

// ---- REVISAR (oculta transferencias propias) ----
function renderRevisar() {
  var container = document.getElementById('revisarList');
  var cats = {};
  transactions.filter(isVisible).forEach(function(t) {
    var c = t.category || 'Sin Categorizar';
    if (!cats[c]) cats[c] = [];
    cats[c].push(t);
  });

  var sortedCats = Object.entries(cats).sort(function(a,b) { return b[1].length - a[1].length; });

  container.innerHTML = sortedCats.map(function(entry) {
    var cat = entry[0], txs = entry[1];
    return '<div class="review-group">' +
      '<div class="review-group-header" style="border-left-color:' + getCatColor(cat) + '" onclick="this.parentElement.classList.toggle(\'expanded\')">' +
      '<span class="review-group-icon">' + getCatIcon(cat) + '</span>' +
      '<span class="review-group-name">' + cat + '</span>' +
      '<span class="review-group-count">' + txs.length + ' transacciones</span>' +
      '<span class="review-group-total">' + fmt(txs.reduce(function(s,t){return s+t.amount;},0)) + '</span>' +
      '<span class="review-group-arrow">&#9662;</span></div>' +
      '<div class="review-group-body">' +
      txs.sort(function(a,b){return b.date.localeCompare(a.date);}).slice(0, 30).map(function(t) {
        return '<div class="review-item">' +
          '<span class="review-date">' + t.date + '</span>' +
          '<span class="review-desc">' + trunc(t.description, 50) + '</span>' +
          '<span class="review-amount ' + (t.type==='gasto'?'amount-negative':'amount-positive') + '">' + (t.type==='gasto'?'-':'') + fmt(t.amount) + '</span>' +
          '<button class="btn-edit-cat" onclick="openCatModal(\'' + t.id + '\')">Editar</button></div>';
      }).join('') + '</div></div>';
  }).join('');
}

// ---- CATEGORY MODAL ----
var editingTxId = null;

var catAllOptions = [];
var catHighlightIdx = -1;

function getCatOptions() {
  var allCats = Object.keys(CAT_CONFIG).filter(function(c) { return c !== 'Sin Categorizar'; });
  var extraCats = [...new Set(transactions.map(function(t){return t.category;}).filter(Boolean))].filter(function(c) { return allCats.indexOf(c) === -1; });
  return allCats.concat(extraCats).sort();
}

function renderCatList(filter) {
  var list = document.getElementById('catSearchList');
  var query = (filter || '').toLowerCase();
  var filtered = catAllOptions.filter(function(c) {
    return !query || c.toLowerCase().indexOf(query) >= 0;
  });
  catHighlightIdx = -1;
  var html = filtered.map(function(c, i) {
    return '<div class="autocomplete-item" data-cat="' + c + '" data-idx="' + i + '">' +
      '<span class="ac-icon">' + getCatIcon(c) + '</span>' +
      '<span class="ac-name">' + c + '</span></div>';
  }).join('');
  // If query doesn't match anything exactly, offer to create
  if (query && !catAllOptions.some(function(c) { return c.toLowerCase() === query; })) {
    html += '<div class="autocomplete-item ac-create" data-cat="__new__">+ Crear "' + filter + '"</div>';
  }
  list.innerHTML = html;
  if (filtered.length > 0 || query) list.classList.add('open');
  else list.classList.remove('open');
}

window.openCatModal = function(id) {
  editingTxId = id;
  var tx = transactions.find(function(t) { return t.id === id; });
  if (!tx) return;
  catAllOptions = getCatOptions();

  var input = document.getElementById('catSearchInput');
  input.value = tx.category || '';
  document.getElementById('catSearchList').classList.remove('open');

  // Month selector — show current month and neighbors
  var mSel = document.getElementById('catMonthSelect');
  var txDate = new Date(tx.date + 'T12:00:00');
  var options = [];
  for (var off = -2; off <= 2; off++) {
    var d = new Date(txDate.getFullYear(), txDate.getMonth() + off, 1);
    var mv = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
    options.push({ value: mv, label: MN[d.getMonth()] + ' ' + d.getFullYear() });
  }
  mSel.innerHTML = '';
  options.forEach(function(o) {
    var opt = document.createElement('option');
    opt.value = o.value; opt.textContent = o.label;
    if (o.value === tx.month) opt.selected = true;
    mSel.appendChild(opt);
  });

  document.getElementById('catModalInfo').innerHTML = '<strong>' + tx.date + '</strong> &mdash; ' + trunc(tx.description, 80) + '<br><strong>' + fmt(tx.amount) + '</strong>';
  document.getElementById('catModal').classList.add('open');
};

document.getElementById('catModalCancel').addEventListener('click', function() {
  document.getElementById('catModal').classList.remove('open');
  document.getElementById('catSearchList').classList.remove('open');
});

// Autocomplete events
(function() {
  var input = document.getElementById('catSearchInput');
  var list = document.getElementById('catSearchList');

  input.addEventListener('input', function() {
    renderCatList(input.value);
  });

  input.addEventListener('focus', function() {
    renderCatList(input.value);
  });

  list.addEventListener('click', function(e) {
    var item = e.target.closest('.autocomplete-item');
    if (!item) return;
    var cat = item.dataset.cat;
    if (cat === '__new__') {
      input.value = input.value.trim();
    } else {
      input.value = cat;
    }
    list.classList.remove('open');
  });

  input.addEventListener('keydown', function(e) {
    var items = list.querySelectorAll('.autocomplete-item');
    if (!items.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      catHighlightIdx = Math.min(catHighlightIdx + 1, items.length - 1);
      items.forEach(function(el, i) { el.classList.toggle('highlighted', i === catHighlightIdx); });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      catHighlightIdx = Math.max(catHighlightIdx - 1, 0);
      items.forEach(function(el, i) { el.classList.toggle('highlighted', i === catHighlightIdx); });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (catHighlightIdx >= 0 && items[catHighlightIdx]) {
        var cat = items[catHighlightIdx].dataset.cat;
        input.value = cat === '__new__' ? input.value.trim() : cat;
        list.classList.remove('open');
      }
    } else if (e.key === 'Escape') {
      list.classList.remove('open');
    }
  });

  // Close list when clicking outside
  document.getElementById('catModal').addEventListener('click', function(e) {
    if (!e.target.closest('.autocomplete-wrap')) {
      list.classList.remove('open');
    }
  });
})();

document.getElementById('catModalSave').addEventListener('click', function() {
  var cat = document.getElementById('catSearchInput').value.trim();
  if (!editingTxId) return;
  var tx = transactions.find(function(t) { return t.id === editingTxId; });
  if (!tx) return;

  // Update category if selected
  if (cat) {
    tx.category = cat;
    var d = tx.description.toLowerCase();
    if (!rules.find(function(r) { return d.indexOf(r.keyword.toLowerCase()) >= 0; })) {
      var w = tx.description.split(' ').filter(function(w) { return w.length > 2; });
      var kw = w.slice(0, 3).join(' ').toLowerCase();
      if (kw.length > 3) { rules.push({ keyword: kw, category: cat }); saveRules(); }
    }
  }

  // Update month if changed
  var newMonth = document.getElementById('catMonthSelect').value;
  if (newMonth && newMonth !== tx.month) {
    tx.month = newMonth;
  }

  saveTransactions();
  document.getElementById('catModal').classList.remove('open');
  refreshAll();
});

// ---- RULES ----
function renderRules() {
  var list = document.getElementById('rulesList');
  var grouped = {};
  rules.forEach(function(r, i) { if (!grouped[r.category]) grouped[r.category] = []; grouped[r.category].push({keyword:r.keyword, category:r.category, idx:i}); });
  var sortedG = Object.entries(grouped).sort(function(a,b) { return a[0].localeCompare(b[0]); });

  list.innerHTML = sortedG.map(function(entry) {
    var cat = entry[0], items = entry[1];
    return '<div class="rules-group"><div class="rules-group-header">' + getCatIcon(cat) + ' ' + cat + ' <span class="rules-group-count">' + items.length + '</span></div>' +
      items.map(function(r) {
        return '<div class="rule-item"><span class="rule-keyword">"' + r.keyword + '"</span><button class="rule-delete" onclick="deleteRule(' + r.idx + ')">x</button></div>';
      }).join('') + '</div>';
  }).join('');

  var uncat = transactions.filter(function(t) { return !t.category; });
  var uncatDiv = document.getElementById('uncategorized');
  if (uncat.length === 0) {
    uncatDiv.innerHTML = '<p style="color:var(--text-secondary);font-size:0.88rem">Todas categorizadas.</p>';
  } else {
    uncatDiv.innerHTML = uncat.slice(0, 15).map(function(t) {
      return '<div class="rule-item" style="justify-content:space-between">' +
        '<span style="font-size:0.85rem">' + t.date + ' &mdash; ' + trunc(t.description, 40) + '</span>' +
        '<span style="font-weight:600">' + fmt(t.amount) + '</span>' +
        '<span class="cat-pill uncategorized" onclick="openCatModal(\'' + t.id + '\')" style="cursor:pointer">Categorizar</span></div>';
    }).join('');
  }
}

window.deleteRule = function(idx) {
  rules.splice(idx, 1);
  saveRules();
  transactions.forEach(function(tx) { tx.category = categorize(tx); });
  saveTransactions();
  refreshAll();
};

document.getElementById('addRuleBtn').addEventListener('click', function() {
  var cats = Object.keys(CAT_CONFIG).filter(function(c){return c!=='Sin Categorizar';}).sort();
  var sel = document.getElementById('ruleCatSelect');
  sel.innerHTML = '<option value="">-- Seleccionar --</option>';
  cats.forEach(function(c) { var o=document.createElement('option'); o.value=c; o.textContent=getCatIcon(c)+' '+c; sel.appendChild(o); });
  document.getElementById('ruleKeyword').value = '';
  document.getElementById('ruleNewCat').value = '';
  document.getElementById('ruleModal').classList.add('open');
});

document.getElementById('ruleModalCancel').addEventListener('click', function() { document.getElementById('ruleModal').classList.remove('open'); });

document.getElementById('ruleModalSave').addEventListener('click', function() {
  var kw = document.getElementById('ruleKeyword').value.trim().toLowerCase();
  var cat = document.getElementById('ruleNewCat').value.trim() || document.getElementById('ruleCatSelect').value;
  if (!kw || !cat) return;
  rules.push({ keyword: kw, category: cat });
  saveRules(); categorizeAll();
  document.getElementById('ruleModal').classList.remove('open');
  refreshAll();
});

// ---- CREATE CATEGORY ----
document.getElementById('addCatBtn').addEventListener('click', function() {
  document.getElementById('catCreateName').value = '';
  document.getElementById('catCreateIcon').value = '';
  document.getElementById('catCreateColor').value = '#6366f1';
  document.getElementById('catCreateModal').classList.add('open');
});

document.getElementById('catCreateCancel').addEventListener('click', function() {
  document.getElementById('catCreateModal').classList.remove('open');
});

document.getElementById('catCreateSave').addEventListener('click', function() {
  var name = document.getElementById('catCreateName').value.trim();
  var icon = document.getElementById('catCreateIcon').value.trim() || '\u{1F4CC}';
  var color = document.getElementById('catCreateColor').value;
  if (!name) return;
  if (!CAT_CONFIG[name]) {
    CAT_CONFIG[name] = { color: color, icon: icon };
    customCats[name] = { color: color, icon: icon };
    localStorage.setItem(CUSTOM_CATS_KEY, JSON.stringify(customCats));
  }
  document.getElementById('catCreateModal').classList.remove('open');
  refreshAll();
});

// ---- FILE INPUTS ----
document.getElementById('fileImport').addEventListener('change', function(e) {
  if (e.target.files.length > 0) importFiles(e.target.files);
});

var dropEl = document.getElementById('dropImport');
dropEl.addEventListener('dragover', function(e) { e.preventDefault(); dropEl.style.borderColor='var(--accent)'; });
dropEl.addEventListener('dragleave', function() { dropEl.style.borderColor=''; });
dropEl.addEventListener('drop', function(e) {
  e.preventDefault(); dropEl.style.borderColor='';
  if (e.dataTransfer.files.length > 0) importFiles(e.dataTransfer.files);
});

document.getElementById('searchTx').addEventListener('input', renderTransactions);
document.getElementById('filterSource').addEventListener('change', renderTransactions);
document.getElementById('filterType').addEventListener('change', renderTransactions);
document.getElementById('filterCat').addEventListener('change', renderTransactions);

document.getElementById('dedupBtn').addEventListener('click', function() {
  var removed = removeDuplicates();
  var info = document.getElementById('storageInfo');
  if (removed > 0) {
    info.innerHTML = '<strong>' + removed + ' duplicados eliminados.</strong> Quedan ' + transactions.length + ' transacciones.';
    info.className = 'import-status success';
    refreshAll();
  } else {
    info.textContent = 'No se encontraron duplicados.';
    info.className = 'import-status success';
  }
});

document.getElementById('exportBtn').addEventListener('click', function() {
  var csv = ['Fecha,Descripcion,Monto,Tipo,Fuente,Categoria'];
  transactions.forEach(function(t) { csv.push(t.date + ',"' + t.description.replace(/"/g,'""') + '",' + t.amount + ',' + t.type + ',' + t.source + ',"' + t.category + '"'); });
  var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv.join('\n')],{type:'text/csv'}));
  a.download = 'finanzas_export.csv'; a.click();
});

document.getElementById('clearBtn').addEventListener('click', function() {
  if (confirm('Borrar todas las transacciones?')) { transactions=[]; saveTransactions(); refreshAll(); }
});

document.getElementById('resetRulesBtn').addEventListener('click', function() {
  if (confirm('Resetear reglas a las originales? Las transacciones se re-categorizaran.')) {
    localStorage.removeItem(RULES_KEY); rules = null; location.reload();
  }
});

// (refreshAll moved to end of file after patrimonio module)

// ---- PATRIMONIO MODULE ----
var PROFILE_KEY = 'finanzas_profile';
var PROPERTIES_KEY = 'finanzas_properties';
var ACCOUNTS_KEY = 'finanzas_accounts';

var profile = JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null') || {
  age: 30, retireAge: 65, monthlySpend: 1500000, savingsGoal: 500000, returnRate: 8, uf: 38800
};
var properties = JSON.parse(localStorage.getItem(PROPERTIES_KEY) || '[]');
var accounts = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]');

function saveProfile() { localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); }
function saveProperties() { localStorage.setItem(PROPERTIES_KEY, JSON.stringify(properties)); }
function saveAccounts() { localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts)); }

function fmtUF(n) { return 'UF ' + n.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function ufToCLP(uf) { return Math.round(uf * (profile.uf || 38800)); }
function clpToUF(clp) { return clp / (profile.uf || 38800); }

function loadProfileForm() {
  document.getElementById('profileUF').value = profile.uf || 38800;
  document.getElementById('profileAge').value = profile.age;
  document.getElementById('profileRetireAge').value = profile.retireAge;
  document.getElementById('profileMonthlySpend').value = profile.monthlySpend;
  document.getElementById('profileSavingsGoal').value = profile.savingsGoal;
  document.getElementById('profileReturnRate').value = profile.returnRate;
}

document.getElementById('saveProfileBtn').addEventListener('click', function() {
  profile.uf = parseFloat(document.getElementById('profileUF').value) || 38800;
  profile.age = parseInt(document.getElementById('profileAge').value) || 30;
  profile.retireAge = parseInt(document.getElementById('profileRetireAge').value) || 65;
  profile.monthlySpend = parseInt(document.getElementById('profileMonthlySpend').value) || 1500000;
  profile.savingsGoal = parseInt(document.getElementById('profileSavingsGoal').value) || 500000;
  profile.returnRate = parseFloat(document.getElementById('profileReturnRate').value) || 8;
  saveProfile();
  renderPatrimonio();
});

// Property CRUD
var editingPropId = null;

var PROP_TYPE_CONFIG = {
  propiedad: {
    icon: '🏠', label: 'Casa / Departamento',
    hint: 'Ingresa tu casa o depto. Si tienes crédito hipotecario, pon la deuda y el dividendo para proyectar cuándo se libera.',
    namePlaceholder: 'ej: Depto Las Condes',
    purchasePlaceholder: 'ej: 3500',
    currentPlaceholder: 'ej: 4200',
    showDebt: true, showDividendo: true, showYears: true, showRent: true,
    defaultAppreciation: 5
  },
  terreno: {
    icon: '🏞️', label: 'Terreno',
    hint: 'Los terrenos bien ubicados suben 5-10% anual. No tienen dividendo ni arriendo normalmente.',
    namePlaceholder: 'ej: Terreno Chicureo',
    purchasePlaceholder: 'ej: 2000',
    currentPlaceholder: 'ej: 2800',
    showDebt: true, showDividendo: false, showYears: true, showRent: false,
    defaultAppreciation: 6
  },
  comercial: {
    icon: '🏢', label: 'Local Comercial / Oficina',
    hint: 'Locales y oficinas generan arriendo. Pon el arriendo mensual para incluirlo en tu proyección.',
    namePlaceholder: 'ej: Oficina Providencia',
    purchasePlaceholder: 'ej: 5000',
    currentPlaceholder: 'ej: 5500',
    showDebt: true, showDividendo: true, showYears: true, showRent: true,
    defaultAppreciation: 4
  },
  estacionamiento: {
    icon: '🅿️', label: 'Estacionamiento / Bodega',
    hint: 'Estacionamientos y bodegas son buena inversión por bajo costo y buen arriendo relativo.',
    namePlaceholder: 'ej: Estacionamiento Ed. Central',
    purchasePlaceholder: 'ej: 400',
    currentPlaceholder: 'ej: 450',
    showDebt: false, showDividendo: false, showYears: false, showRent: true,
    defaultAppreciation: 3
  }
};

window.updatePropertyForm = function() {
  var type = document.getElementById('propType').value;
  var cfg = PROP_TYPE_CONFIG[type] || PROP_TYPE_CONFIG.propiedad;
  document.getElementById('propTypeHint').textContent = cfg.hint;

  var f = '';
  f += '<label>Nombre</label>';
  f += '<input type="text" id="propName" placeholder="' + cfg.namePlaceholder + '" class="search-input full-w">';
  f += '<label>Valor de compra (UF)</label>';
  f += '<input type="number" id="propPurchaseValue" placeholder="' + cfg.purchasePlaceholder + '" step="0.01" class="search-input full-w">';
  f += '<label>Valor actual estimado (UF)</label>';
  f += '<input type="number" id="propCurrentValue" placeholder="' + cfg.currentPlaceholder + '" step="0.01" class="search-input full-w">';

  if (cfg.showDebt) {
    f += '<label>Deuda pendiente (UF) <span class="help-tip" data-tip="Cuanto debes del crédito hipotecario en UF. Si no tiene deuda, deja en 0.">?</span></label>';
    f += '<input type="number" id="propDebt" placeholder="ej: 2800" step="0.01" value="0" class="search-input full-w">';
  }
  if (cfg.showDividendo) {
    f += '<label>Dividendo mensual (CLP) <span class="help-tip" data-tip="Cuánto pagas de dividendo al mes.">?</span></label>';
    f += '<input type="number" id="propDividendo" value="0" class="search-input full-w">';
  }
  if (cfg.showYears) {
    f += '<label>Plazo restante crédito (años) <span class="help-tip" data-tip="Años que te quedan de crédito hipotecario.">?</span></label>';
    f += '<input type="number" id="propYearsLeft" value="0" min="0" max="40" class="search-input full-w" style="width:100px">';
  }
  f += '<label>Plusvalía anual esperada (%)</label>';
  f += '<input type="number" id="propAppreciation" step="0.5" value="' + cfg.defaultAppreciation + '" class="search-input full-w" style="width:100px">';
  if (cfg.showRent) {
    f += '<label>Arriendo mensual (CLP) <span class="help-tip" data-tip="Ingreso por arriendo. Se suma a tu ahorro en la proyección.">?</span></label>';
    f += '<input type="number" id="propRent" value="0" class="search-input full-w">';
  }

  document.getElementById('propDynamicFields').innerHTML = f;
};

document.getElementById('addPropertyBtn').addEventListener('click', function() {
  editingPropId = null;
  document.getElementById('propertyModalTitle').textContent = 'Agregar Propiedad';
  document.getElementById('propType').value = 'propiedad';
  document.getElementById('propModalDelete').style.display = 'none';
  updatePropertyForm();
  document.getElementById('propertyModal').classList.add('open');
});

document.getElementById('propModalCancel').addEventListener('click', function() {
  document.getElementById('propertyModal').classList.remove('open');
});

document.getElementById('propModalDelete').addEventListener('click', function() {
  if (editingPropId && confirm('Eliminar esta propiedad?')) {
    properties = properties.filter(function(p) { return p.id !== editingPropId; });
    saveProperties();
    document.getElementById('propertyModal').classList.remove('open');
    renderPatrimonio();
  }
});

document.getElementById('propModalSave').addEventListener('click', function() {
  var nameEl = document.getElementById('propName');
  var name = nameEl ? nameEl.value.trim() : '';
  if (!name) return;
  var getVal = function(id, def) { var el = document.getElementById(id); return el ? (parseFloat(el.value) || def) : def; };
  var data = {
    id: editingPropId || gid(),
    name: name,
    type: document.getElementById('propType').value,
    purchaseValue: getVal('propPurchaseValue', 0),
    currentValue: getVal('propCurrentValue', 0),
    debt: getVal('propDebt', 0),
    dividendo: getVal('propDividendo', 0),
    yearsLeft: getVal('propYearsLeft', 0),
    appreciation: getVal('propAppreciation', 0),
    rent: getVal('propRent', 0)
  };
  if (editingPropId) {
    var idx = properties.findIndex(function(p) { return p.id === editingPropId; });
    if (idx >= 0) properties[idx] = data;
  } else {
    properties.push(data);
  }
  saveProperties();
  document.getElementById('propertyModal').classList.remove('open');
  renderPatrimonio();
});

window.editProperty = function(id) {
  var p = properties.find(function(x) { return x.id === id; });
  if (!p) return;
  editingPropId = id;
  document.getElementById('propertyModalTitle').textContent = 'Editar Propiedad';
  document.getElementById('propType').value = p.type;
  updatePropertyForm();
  var setVal = function(id, v) { var el = document.getElementById(id); if (el) el.value = v; };
  setVal('propName', p.name);
  setVal('propPurchaseValue', p.purchaseValue);
  setVal('propCurrentValue', p.currentValue);
  setVal('propDebt', p.debt || 0);
  setVal('propDividendo', p.dividendo || 0);
  setVal('propYearsLeft', p.yearsLeft || 0);
  setVal('propAppreciation', p.appreciation);
  setVal('propRent', p.rent || 0);
  document.getElementById('propModalDelete').style.display = '';
  document.getElementById('propertyModal').classList.add('open');
};

function getPropertyIcon(type) {
  var cfg = PROP_TYPE_CONFIG[type];
  return cfg ? cfg.icon : '🏠';
}

// ---- ACCOUNTS (LIQUIDEZ) MODULE ----
var editingAccId = null;

function getAccountIcon(type) {
  var icons = {
    cuenta_corriente: '\u{1F3E6}', cuenta_ahorro: '\u{1F4B0}', deposito_plazo: '\u{1F512}',
    fondo_mutuo: '\u{1F4C8}', apv: '\u{1F3AF}', etf: '\u{1F4CA}',
    cripto: '\u20BF', efectivo: '\u{1F4B5}', otro: '\u{1F4BC}'
  };
  return icons[type] || '\u{1F4BC}';
}

function getAccountTypeName(type) {
  var names = {
    cuenta_corriente: 'Cuenta Corriente', cuenta_ahorro: 'Cuenta de Ahorro',
    deposito_plazo: 'Depósito a Plazo', fondo_mutuo: 'Fondo Mutuo',
    apv: 'APV', etf: 'ETF / Acciones', cripto: 'Cripto', efectivo: 'Efectivo', otro: 'Otro'
  };
  return names[type] || type;
}

function getTotalAccounts() {
  return accounts.reduce(function(s, a) { return s + (a.balance || 0); }, 0);
}

var ACC_TYPE_CONFIG = {
  cuenta_corriente: {
    hint: 'Tu cuenta del banco donde recibes tu sueldo y pagas tus gastos del día a día.',
    namePlaceholder: 'ej: Cuenta Corriente Banco BICE',
    balancePlaceholder: 'ej: 2500000',
    institutionPlaceholder: 'ej: Banco BICE, Banco Chile, BCI',
    showReturn: false, defaultReturn: 0, showNotes: false
  },
  cuenta_ahorro: {
    hint: 'Cuenta donde guardas plata que no usas en el día a día. Generalmente tiene una tasa baja.',
    namePlaceholder: 'ej: Cuenta Ahorro Banco Estado',
    balancePlaceholder: 'ej: 5000000',
    institutionPlaceholder: 'ej: Banco Estado, BCI, Banco Chile',
    showReturn: true, defaultReturn: 2, showNotes: false
  },
  deposito_plazo: {
    hint: 'Plata a plazo fijo en el banco. No la puedes tocar hasta que venza. Renta entre 4-6% anual.',
    namePlaceholder: 'ej: DAP 90 días Banco Chile',
    balancePlaceholder: 'ej: 10000000',
    institutionPlaceholder: 'ej: Banco Chile, Banco BICE, BCI',
    showReturn: true, defaultReturn: 5,
    showNotes: true, notesPlaceholder: 'ej: Vence 15 junio 2026'
  },
  fondo_mutuo: {
    hint: 'Un fondo que invierte tu plata en un mix de instrumentos. Renta fija (~4-6%) o variable (~8-12%).',
    namePlaceholder: 'ej: Fondo Mutuo Renta Local BCI',
    balancePlaceholder: 'ej: 8000000',
    institutionPlaceholder: 'ej: BCI, Fintual, LarrainVial, BTG Pactual',
    showReturn: true, defaultReturn: 7,
    showNotes: true, notesPlaceholder: 'ej: Serie A, renta fija nacional'
  },
  apv: {
    hint: 'Ahorro Previsional Voluntario. Régimen A: el Estado te bonifica 15%. Régimen B: descuentas de impuestos.',
    namePlaceholder: 'ej: APV Régimen A Habitat',
    balancePlaceholder: 'ej: 3000000',
    institutionPlaceholder: 'ej: AFP Habitat, AFP Capital, Fintual',
    showReturn: true, defaultReturn: 6,
    showNotes: true, notesPlaceholder: 'ej: Régimen A, perfil moderado'
  },
  etf: {
    hint: 'Fondos que replican índices (S&P 500) o acciones. Mayor riesgo pero mayor retorno potencial.',
    namePlaceholder: 'ej: ETF S&P 500 (VOO)',
    balancePlaceholder: 'Valor actual en CLP, ej: 6000000',
    institutionPlaceholder: 'ej: Racional, eToro, Interactive Brokers',
    showReturn: true, defaultReturn: 10,
    showNotes: true, notesPlaceholder: 'ej: 15 cuotas VOO'
  },
  cripto: {
    hint: 'Bitcoin, Ethereum u otras criptos. Alta volatilidad. Pon el valor actual en pesos.',
    namePlaceholder: 'ej: Bitcoin',
    balancePlaceholder: 'Valor actual en CLP, ej: 4000000',
    institutionPlaceholder: 'ej: Buda.com, Binance, Coinbase',
    showReturn: false, defaultReturn: 0,
    showNotes: true, notesPlaceholder: 'ej: 0.05 BTC'
  },
  efectivo: {
    hint: 'Plata en efectivo, caja chica, o guardada fuera del banco.',
    namePlaceholder: 'ej: Caja fuerte casa',
    balancePlaceholder: 'ej: 500000',
    institutionPlaceholder: '',
    showReturn: false, defaultReturn: 0, showNotes: false
  },
  otro: {
    hint: 'Cualquier otro ahorro o inversión que no calce en las categorías anteriores.',
    namePlaceholder: 'ej: Préstamo a familiar',
    balancePlaceholder: 'ej: 2000000',
    institutionPlaceholder: '',
    showReturn: true, defaultReturn: 0,
    showNotes: true, notesPlaceholder: 'ej: Me pagan en diciembre'
  }
};

window.updateAccountForm = function(preserveValues) {
  var type = document.getElementById('accType').value;
  var cfg = ACC_TYPE_CONFIG[type] || ACC_TYPE_CONFIG.otro;
  document.getElementById('accTypeHint').textContent = cfg.hint;

  var fields = '';
  fields += '<label>Nombre</label>';
  fields += '<input type="text" id="accName" placeholder="' + cfg.namePlaceholder + '" class="search-input full-w">';
  fields += '<label>Saldo actual (CLP)</label>';
  fields += '<input type="number" id="accBalance" placeholder="' + cfg.balancePlaceholder + '" class="search-input full-w">';

  if (cfg.institutionPlaceholder) {
    fields += '<label>Institución</label>';
    fields += '<input type="text" id="accInstitution" placeholder="' + cfg.institutionPlaceholder + '" class="search-input full-w">';
  }
  if (cfg.showReturn) {
    fields += '<label>Rentabilidad anual esperada (%)</label>';
    fields += '<input type="number" id="accReturn" step="0.5" value="' + cfg.defaultReturn + '" class="search-input full-w" style="width:100px">';
  }
  if (cfg.showNotes) {
    fields += '<label>Notas</label>';
    fields += '<input type="text" id="accNotes" placeholder="' + (cfg.notesPlaceholder || '') + '" class="search-input full-w">';
  }
  document.getElementById('accDynamicFields').innerHTML = fields;
};

document.getElementById('addAccountBtn').addEventListener('click', function() {
  editingAccId = null;
  document.getElementById('accountModalTitle').textContent = 'Agregar Cuenta';
  document.getElementById('accType').value = 'cuenta_corriente';
  document.getElementById('accModalDelete').style.display = 'none';
  updateAccountForm();
  document.getElementById('accountModal').classList.add('open');
});

document.getElementById('accModalCancel').addEventListener('click', function() {
  document.getElementById('accountModal').classList.remove('open');
});

document.getElementById('accModalDelete').addEventListener('click', function() {
  if (editingAccId && confirm('Eliminar esta cuenta?')) {
    accounts = accounts.filter(function(a) { return a.id !== editingAccId; });
    saveAccounts();
    document.getElementById('accountModal').classList.remove('open');
    renderPatrimonio();
  }
});

document.getElementById('accModalSave').addEventListener('click', function() {
  var nameEl = document.getElementById('accName');
  var name = nameEl ? nameEl.value.trim() : '';
  if (!name) return;
  var balEl = document.getElementById('accBalance');
  var instEl = document.getElementById('accInstitution');
  var retEl = document.getElementById('accReturn');
  var notesEl = document.getElementById('accNotes');
  var data = {
    id: editingAccId || gid(),
    name: name,
    type: document.getElementById('accType').value,
    balance: parseInt(balEl ? balEl.value : 0) || 0,
    institution: instEl ? instEl.value.trim() : '',
    returnRate: parseFloat(retEl ? retEl.value : 0) || 0,
    notes: notesEl ? notesEl.value.trim() : ''
  };
  if (editingAccId) {
    var idx = accounts.findIndex(function(a) { return a.id === editingAccId; });
    if (idx >= 0) accounts[idx] = data;
  } else {
    accounts.push(data);
  }
  saveAccounts();
  document.getElementById('accountModal').classList.remove('open');
  renderPatrimonio();
});

window.editAccount = function(id) {
  var a = accounts.find(function(x) { return x.id === id; });
  if (!a) return;
  editingAccId = id;
  document.getElementById('accountModalTitle').textContent = 'Editar Cuenta';
  document.getElementById('accType').value = a.type;
  updateAccountForm();
  var nameEl = document.getElementById('accName');
  var balEl = document.getElementById('accBalance');
  var instEl = document.getElementById('accInstitution');
  var retEl = document.getElementById('accReturn');
  var notesEl = document.getElementById('accNotes');
  if (nameEl) nameEl.value = a.name;
  if (balEl) balEl.value = a.balance;
  if (instEl) instEl.value = a.institution || '';
  if (retEl) retEl.value = a.returnRate || 0;
  if (notesEl) notesEl.value = a.notes || '';
  document.getElementById('accModalDelete').style.display = '';
  document.getElementById('accountModal').classList.add('open');
};

function renderAccounts() {
  var listEl = document.getElementById('accountsList');
  var emptyEl = document.getElementById('accountsEmpty');
  var totalBar = document.getElementById('accountsTotalBar');
  if (accounts.length === 0) {
    listEl.innerHTML = '';
    emptyEl.style.display = '';
    totalBar.style.display = 'none';
  } else {
    emptyEl.style.display = 'none';
    totalBar.style.display = '';
    listEl.innerHTML = accounts.map(function(a) {
      var retInfo = a.returnRate > 0 ? ' · Rent: ' + a.returnRate + '%' : '';
      var instInfo = a.institution ? ' · ' + a.institution : '';
      var notesInfo = a.notes ? ' · ' + a.notes : '';
      return '<div class="property-card" onclick="editAccount(\'' + a.id + '\')">' +
        '<span class="property-icon">' + getAccountIcon(a.type) + '</span>' +
        '<div class="property-info"><span class="property-name">' + a.name + '</span>' +
        '<span class="property-meta">' + getAccountTypeName(a.type) + instInfo + retInfo + notesInfo + '</span></div>' +
        '<div class="property-value"><span class="property-value-main amount-positive">' + fmt(a.balance) + '</span></div></div>';
    }).join('');
    document.getElementById('accountsTotalValue').textContent = fmt(getTotalAccounts());
  }
}

function getMonthlySavings() {
  var byMonth = {};
  transactions.forEach(function(tx) {
    if (tx.category === 'Ahorro' && tx.type === 'gasto') {
      if (!byMonth[tx.month]) byMonth[tx.month] = 0;
      byMonth[tx.month] += tx.amount;
    }
  });
  return byMonth;
}

function getTotalSavings() {
  return transactions.filter(function(tx) {
    return tx.category === 'Ahorro';
  }).reduce(function(s, tx) {
    return s + (tx.type === 'gasto' ? tx.amount : -tx.amount);
  }, 0);
}

function renderPatrimonio() {
  loadProfileForm();

  // Properties list
  var listEl = document.getElementById('propertiesList');
  var emptyEl = document.getElementById('propertiesEmpty');
  if (properties.length === 0) {
    listEl.innerHTML = '';
    emptyEl.style.display = '';
  } else {
    emptyEl.style.display = 'none';
    listEl.innerHTML = properties.map(function(p) {
      var debt = p.debt || 0;
      var equity = p.currentValue - debt;
      var equityClass = equity >= 0 ? 'amount-positive' : 'amount-negative';
      var debtInfo = debt > 0 ? ' · Deuda: ' + fmtUF(debt) + (p.yearsLeft > 0 ? ' (' + p.yearsLeft + ' años)' : '') : '';
      var dividendoInfo = (p.dividendo || 0) > 0 ? ' · Div: ' + fmt(p.dividendo) + '/mes' : '';
      var rentInfo = (p.rent || 0) > 0 ? ' · Arriendo: ' + fmt(p.rent) + '/mes' : '';
      return '<div class="property-card" onclick="editProperty(\'' + p.id + '\')">' +
        '<span class="property-icon">' + getPropertyIcon(p.type) + '</span>' +
        '<div class="property-info"><span class="property-name">' + p.name + '</span>' +
        '<span class="property-meta">Plusvalia: ' + p.appreciation + '%' + debtInfo + dividendoInfo + rentInfo + '</span></div>' +
        '<div class="property-value"><span class="property-value-main">' + fmtUF(p.currentValue) + '</span>' +
        (debt > 0 ? '<span class="property-value-gain" style="color:var(--red);font-size:0.75rem">Deuda: -' + fmtUF(debt) + '</span>' : '') +
        '<span class="property-value-gain ' + equityClass + '">Neto: ' + fmtUF(equity) + '</span>' +
        '<span class="property-value-gain" style="color:var(--text-secondary);font-size:0.72rem">' + fmt(ufToCLP(equity)) + '</span></div></div>';
    }).join('');
  }

  // Accounts list
  renderAccounts();

  // Summary — properties equity = value - debt, in UF, converted to CLP
  var totalValueUF = properties.reduce(function(s, p) { return s + p.currentValue; }, 0);
  var totalDebtUF = properties.reduce(function(s, p) { return s + (p.debt || 0); }, 0);
  var totalEquityUF = totalValueUF - totalDebtUF;
  var totalEquityCLP = ufToCLP(totalEquityUF);
  var totalAhorro = getTotalSavings();
  var totalLiquidez = getTotalAccounts();
  var patrimonio = totalEquityCLP + Math.max(0, totalAhorro) + totalLiquidez;

  document.getElementById('patPropTotal').textContent = fmt(totalEquityCLP);
  document.getElementById('patPropUF').textContent = fmtUF(totalEquityUF) + ' (valor ' + fmtUF(totalValueUF) + ' - deuda ' + fmtUF(totalDebtUF) + ')';
  document.getElementById('patAhorroTotal').textContent = fmt(Math.max(0, totalAhorro) + totalLiquidez);
  document.getElementById('patNetoTotal').textContent = fmt(patrimonio);

  // FIRE number: (gasto mensual × 12) / 0.04
  var fireNumber = (profile.monthlySpend * 12) / 0.04;
  var firePct = fireNumber > 0 ? Math.min(100, (patrimonio / fireNumber) * 100) : 0;
  document.getElementById('patFire').textContent = fmt(fireNumber);
  document.getElementById('patFirePct').textContent = firePct.toFixed(1) + '%';
  document.getElementById('fireBarFill').style.width = firePct + '%';

  // Calculate years to FIRE
  var yearsToFire = calculateYearsToFire(patrimonio, fireNumber);
  var fireLabel = document.getElementById('fireYearsLabel');
  if (patrimonio >= fireNumber) {
    fireLabel.textContent = 'Ya alcanzaste FIRE!';
  } else if (yearsToFire < 100) {
    fireLabel.textContent = '~' + yearsToFire + ' años';
  } else {
    fireLabel.textContent = 'Ajusta tu plan';
  }

  // Savings goal tracking
  renderSavingsTrack();

  // Projection chart
  renderProjection(patrimonio, fireNumber);
}

function getPropertyEquityAtYear(p, year) {
  var value = p.currentValue * Math.pow(1 + p.appreciation / 100, year);
  var debt = (p.debt || 0);
  if (debt > 0 && (p.yearsLeft || 0) > 0) {
    // Linear debt reduction over yearsLeft
    var remaining = Math.max(0, 1 - year / p.yearsLeft);
    debt = debt * remaining;
  } else if (debt > 0) {
    debt = 0; // already paid
  }
  return value - debt;
}

function getFreedDividendosAtYear(year) {
  // When a property's debt is paid off, the dividendo is freed as extra savings
  return properties.reduce(function(s, p) {
    if ((p.dividendo || 0) > 0 && (p.yearsLeft || 0) > 0 && year >= p.yearsLeft) {
      return s + p.dividendo;
    }
    return s;
  }, 0);
}

function calculateYearsToFire(currentNet, fireNumber) {
  if (currentNet >= fireNumber) return 0;
  var monthlyRate = (profile.returnRate / 100) / 12;
  var baseMonthlySave = profile.savingsGoal;
  var monthlyRent = properties.reduce(function(s, p) { return s + (p.rent || 0); }, 0);
  // Start with just financial assets (no properties — we recalc property equity each year)
  var financialAssets = currentNet - ufToCLP(properties.reduce(function(s, p) { return s + getPropertyEquityAtYear(p, 0); }, 0));

  for (var m = 1; m <= 1200; m++) {
    var yearFloat = m / 12;
    var freedDiv = getFreedDividendosAtYear(yearFloat);
    var monthlySave = baseMonthlySave + freedDiv;
    financialAssets = financialAssets * (1 + monthlyRate) + monthlySave + monthlyRent;

    if (m % 12 === 0) {
      var propEquityCLP = ufToCLP(properties.reduce(function(s, p) { return s + getPropertyEquityAtYear(p, m / 12); }, 0));
      var total = Math.max(0, financialAssets) + propEquityCLP;
      if (total >= fireNumber) return Math.ceil(m / 12);
    }
  }
  return 999;
}

function renderSavingsTrack() {
  var container = document.getElementById('savingsTrack');
  var savings = getMonthlySavings();
  var allMonths = [...new Set(transactions.map(function(t) { return t.month; }))].sort().reverse().slice(0, 12);
  if (allMonths.length === 0) {
    container.innerHTML = '<div class="empty-state">Importa transacciones y categoriza como "Ahorro" para ver tu progreso.</div>';
    return;
  }
  container.innerHTML = allMonths.map(function(m) {
    var amount = savings[m] || 0;
    var pct = profile.savingsGoal > 0 ? Math.min(100, (amount / profile.savingsGoal) * 100) : 0;
    var met = amount >= profile.savingsGoal;
    var parts = m.split('-');
    var barColor = met ? 'var(--green)' : (pct > 50 ? 'var(--yellow)' : 'var(--red)');
    return '<div class="savings-month ' + (met ? 'over-goal' : 'under-goal') + '">' +
      '<div class="savings-month-label">' + MN[parseInt(parts[1]) - 1] + ' ' + parts[0] + '</div>' +
      '<div class="savings-month-amount">' + fmt(amount) + '</div>' +
      '<div class="savings-month-bar"><div style="width:' + pct + '%;background:' + barColor + '"></div></div>' +
      '<div class="savings-month-pct">' + pct.toFixed(0) + '% de ' + fmt(profile.savingsGoal) + '</div></div>';
  }).join('');
}

function renderProjection(currentNet, fireNumber) {
  var yearsToRetire = Math.max(1, profile.retireAge - profile.age);
  var annualRate = profile.returnRate / 100;
  var annualSavings = profile.savingsGoal * 12;
  var annualRent = properties.reduce(function(s, p) { return s + (p.rent || 0) * 12; }, 0);
  var propEquityY0CLP = ufToCLP(properties.reduce(function(s, p) { return s + getPropertyEquityAtYear(p, 0); }, 0));
  // Financial assets = total patrimonio minus property equity
  var financialAssets = currentNet - propEquityY0CLP;

  var labels = [];
  var dataPatrimonio = [];
  var dataDebt = [];
  var dataFire = [];

  for (var y = 0; y <= yearsToRetire; y++) {
    // Property equity at year y (value - remaining debt)
    var propEquityCLP = ufToCLP(properties.reduce(function(s, p) { return s + getPropertyEquityAtYear(p, y); }, 0));
    var propDebtCLP = ufToCLP(properties.reduce(function(s, p) {
      var debt = (p.debt || 0);
      if (debt > 0 && (p.yearsLeft || 0) > 0) debt = debt * Math.max(0, 1 - y / p.yearsLeft);
      else debt = 0;
      return s + debt;
    }, 0));
    var total = Math.max(0, financialAssets) + propEquityCLP;

    labels.push(profile.age + y);
    dataPatrimonio.push(Math.round(total));
    dataDebt.push(Math.round(propDebtCLP));
    dataFire.push(fireNumber);

    // Grow financial assets for next year
    var freedDiv = getFreedDividendosAtYear(y) * 12;
    financialAssets = financialAssets * (1 + annualRate) + annualSavings + annualRent + freedDiv;
  }

  var patrimonioAtRetire = dataPatrimonio[dataPatrimonio.length - 1];
  var monthlyPassive = Math.round(patrimonioAtRetire * 0.04 / 12);

  if (charts.projection) charts.projection.destroy();
  charts.projection = new Chart(document.getElementById('chartProjection').getContext('2d'), {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Patrimonio Neto',
          data: dataPatrimonio,
          borderColor: '#4f46e5',
          backgroundColor: 'rgba(79,70,229,0.08)',
          fill: true,
          tension: 0.3,
          pointRadius: 2,
          borderWidth: 2.5
        },
        {
          label: 'Deuda Hipotecaria',
          data: dataDebt,
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239,68,68,0.06)',
          fill: true,
          tension: 0.3,
          pointRadius: 0,
          borderWidth: 2,
          borderDash: [4, 3]
        },
        {
          label: 'Numero FIRE',
          data: dataFire,
          borderColor: '#10b981',
          borderDash: [8, 4],
          pointRadius: 0,
          borderWidth: 2,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: window.innerWidth < 600 ? 1.2 : 2,
      interaction: { intersect: false, mode: 'index' },
      plugins: {
        tooltip: {
          callbacks: {
            title: function(items) { return 'Edad: ' + items[0].label + ' años'; },
            label: function(ctx) { return ctx.dataset.label + ': ' + fmt(ctx.parsed.y); }
          }
        },
        legend: {
          position: 'top',
          labels: { boxWidth: 12, font: { size: window.innerWidth < 600 ? 10 : 12 }, padding: 10 }
        }
      },
      scales: {
        y: {
          ticks: {
            callback: function(v) { return '$' + (v / 1000000).toFixed(0) + 'M'; },
            font: { size: window.innerWidth < 600 ? 10 : 12 },
            maxTicksLimit: 6
          },
          grid: { color: '#f0f0f0' }
        },
        x: {
          title: { display: true, text: 'Edad', font: { size: window.innerWidth < 600 ? 10 : 12 } },
          ticks: {
            font: { size: window.innerWidth < 600 ? 9 : 12 },
            maxTicksLimit: window.innerWidth < 600 ? 8 : 15,
            maxRotation: 0
          },
          grid: { display: false }
        }
      }
    }
  });

  // Insights
  var crossAge = null;
  for (var i = 0; i < dataPatrimonio.length; i++) {
    if (dataPatrimonio[i] >= fireNumber) { crossAge = labels[i]; break; }
  }

  var insightsEl = document.getElementById('projectionInsights');
  insightsEl.innerHTML =
    '<div class="insight-card"><span class="insight-label">Patrimonio a los ' + profile.retireAge + '</span>' +
    '<span class="insight-value">' + fmt(patrimonioAtRetire) + '</span></div>' +

    '<div class="insight-card"><span class="insight-label">Renta mensual pasiva (regla 4%)</span>' +
    '<span class="insight-value">' + fmt(monthlyPassive) + '</span>' +
    '<span class="insight-sub">' + (monthlyPassive >= profile.monthlySpend ? 'Cubre tu meta de ' + fmt(profile.monthlySpend) : 'Falta ' + fmt(profile.monthlySpend - monthlyPassive) + ' para tu meta') + '</span></div>' +

    '<div class="insight-card"><span class="insight-label">Edad FIRE estimada</span>' +
    '<span class="insight-value' + (crossAge ? ' green' : '') + '">' + (crossAge ? crossAge + ' años' : 'No alcanzable con plan actual') + '</span>' +
    (crossAge ? '<span class="insight-sub">Faltan ' + (crossAge - profile.age) + ' años</span>' : '<span class="insight-sub">Considera aumentar ahorro o rentabilidad</span>') + '</div>' +

    '<div class="insight-card"><span class="insight-label">Propiedades a los ' + profile.retireAge + ' (neto)</span>' +
    '<span class="insight-value">' + fmtUF(properties.reduce(function(s, p) { return s + getPropertyEquityAtYear(p, yearsToRetire); }, 0)) + '</span>' +
    '<span class="insight-sub">' + fmt(ufToCLP(properties.reduce(function(s, p) { return s + getPropertyEquityAtYear(p, yearsToRetire); }, 0))) + ' · sin deuda</span></div>';
}

// ---- METAS / GOALS SYSTEM ----
var GOALS_KEY = 'finanzas_goals';
var goalsRaw = JSON.parse(localStorage.getItem(GOALS_KEY) || '[]');
var editingGoalId = null;
var currentGoalFilter = 'all';

// Migrate old vision board format (array of 3 objects with title/value/image)
if (goalsRaw.length > 0 && !goalsRaw[0].id && goalsRaw[0].title) {
  goalsRaw = goalsRaw.filter(function(g) { return g.title; }).map(function(g, i) {
    return {
      id: gid(), name: g.title, target: g.value || 0, saved: 0,
      category: 'otro', term: 'mediano', priority: 'media',
      monthly: 0, date: '', notes: '', createdAt: Date.now()
    };
  });
  localStorage.setItem(GOALS_KEY, JSON.stringify(goalsRaw));
}
var goals = goalsRaw;

function saveGoals() {
  localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
}

var GOAL_CATEGORY_CONFIG = {
  emergencia: { icon: '🛡️', label: 'Fondo de emergencia', hint: 'Se recomienda tener 3-6 meses de gastos. Si gastas $1.5M/mes, apunta a $4.5M-$9M.' },
  viaje: { icon: '✈️', label: 'Viaje', hint: 'Incluye pasajes, alojamiento, comida y actividades. Un viaje a Europa puede costar $3M-$6M por persona.' },
  auto: { icon: '🚗', label: 'Auto', hint: 'Considera el pie (20-30%), seguro, patente y mantención. Un auto nuevo parte en $8M-$15M.' },
  casa: { icon: '🏠', label: 'Pie de casa', hint: 'El pie de una propiedad es 10-20% del valor. Para un depto de 3.000 UF necesitas 300-600 UF de pie.' },
  educacion: { icon: '🎓', label: 'Educación', hint: 'Un magister en Chile cuesta $5M-$15M. En el extranjero puede superar los $30M.' },
  negocio: { icon: '💼', label: 'Negocio', hint: 'El capital inicial depende del rubro. Define tu MVP y calcula costos de los primeros 6 meses.' },
  retiro: { icon: '🏖️', label: 'Retiro', hint: 'Regla del 4%: necesitas 25 veces tus gastos anuales. Si gastas $1.5M/mes = $450M.' },
  otro: { icon: '📌', label: 'Otro', hint: 'Define un monto claro y una fecha objetivo para mantener el foco.' }
};

window.updateGoalForm = function() {
  var cat = document.getElementById('goalCategory').value;
  var cfg = GOAL_CATEGORY_CONFIG[cat] || GOAL_CATEGORY_CONFIG.otro;
  document.getElementById('goalCategoryHint').textContent = cfg.hint;
};

window.filterGoals = function(filter) {
  currentGoalFilter = filter;
  document.querySelectorAll('.goals-tab').forEach(function(t) {
    t.classList.toggle('active', t.dataset.filter === filter);
  });
  renderMetas();
};

function getFilteredGoals() {
  if (currentGoalFilter === 'all') return goals;
  return goals.filter(function(g) { return g.term === currentGoalFilter; });
}

function getGoalProgress(g) {
  // Progress = saved amount (manual) + monthly contributions estimated
  return g.saved || 0;
}

function getMonthsRemaining(g) {
  if (!g.date) return null;
  var target = new Date(g.date);
  var now = new Date();
  var months = (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth());
  return Math.max(0, months);
}

function getGoalProjection(g) {
  var remaining = g.target - getGoalProgress(g);
  if (remaining <= 0) return { onTrack: true, monthsNeeded: 0 };
  if (!g.monthly || g.monthly <= 0) return { onTrack: false, monthsNeeded: Infinity };
  var monthsNeeded = Math.ceil(remaining / g.monthly);
  var monthsLeft = getMonthsRemaining(g);
  return {
    onTrack: monthsLeft === null || monthsNeeded <= monthsLeft,
    monthsNeeded: monthsNeeded
  };
}

window.editGoal = function(id) {
  var g = goals.find(function(x) { return x.id === id; });
  if (!g) return;
  editingGoalId = id;
  document.getElementById('goalModalTitle').textContent = 'Editar Meta';
  document.getElementById('goalCategory').value = g.category || 'otro';
  updateGoalForm();
  document.getElementById('goalName').value = g.name || '';
  document.getElementById('goalTarget').value = g.target || '';
  document.getElementById('goalTerm').value = g.term || 'mediano';
  document.getElementById('goalDate').value = g.date || '';
  document.getElementById('goalMonthly').value = g.monthly || '';
  document.getElementById('goalPriority').value = g.priority || 'media';
  document.getElementById('goalNotes').value = g.notes || '';
  document.getElementById('goalModalDelete').style.display = '';
  document.getElementById('goalModal').classList.add('open');
};

document.getElementById('addGoalBtn').addEventListener('click', function() {
  editingGoalId = null;
  document.getElementById('goalModalTitle').textContent = 'Nueva Meta';
  document.getElementById('goalCategory').value = 'emergencia';
  updateGoalForm();
  document.getElementById('goalName').value = '';
  document.getElementById('goalTarget').value = '';
  document.getElementById('goalTerm').value = 'corto';
  document.getElementById('goalDate').value = '';
  document.getElementById('goalMonthly').value = '';
  document.getElementById('goalPriority').value = 'media';
  document.getElementById('goalNotes').value = '';
  document.getElementById('goalModalDelete').style.display = 'none';
  document.getElementById('goalModal').classList.add('open');
});

document.getElementById('goalModalCancel').addEventListener('click', function() {
  document.getElementById('goalModal').classList.remove('open');
});

document.getElementById('goalModalDelete').addEventListener('click', function() {
  if (editingGoalId && confirm('Eliminar esta meta?')) {
    goals = goals.filter(function(g) { return g.id !== editingGoalId; });
    saveGoals();
    document.getElementById('goalModal').classList.remove('open');
    renderMetas();
  }
});

document.getElementById('goalModalSave').addEventListener('click', function() {
  var name = document.getElementById('goalName').value.trim();
  if (!name) return;
  var data = {
    id: editingGoalId || gid(),
    name: name,
    category: document.getElementById('goalCategory').value,
    target: parseInt(document.getElementById('goalTarget').value) || 0,
    term: document.getElementById('goalTerm').value,
    date: document.getElementById('goalDate').value,
    monthly: parseInt(document.getElementById('goalMonthly').value) || 0,
    priority: document.getElementById('goalPriority').value,
    notes: document.getElementById('goalNotes').value.trim(),
    saved: 0,
    createdAt: Date.now()
  };
  if (editingGoalId) {
    var idx = goals.findIndex(function(g) { return g.id === editingGoalId; });
    if (idx >= 0) {
      data.saved = goals[idx].saved || 0;
      data.createdAt = goals[idx].createdAt || Date.now();
      goals[idx] = data;
    }
  } else {
    goals.push(data);
  }
  saveGoals();
  document.getElementById('goalModal').classList.remove('open');
  renderMetas();
});

var motivationalQuotes = [
  '"La riqueza no es tener mucho dinero, es tener muchas opciones."',
  '"No ahorres lo que queda despues de gastar. Gasta lo que queda despues de ahorrar." — Warren Buffett',
  '"El mejor momento para plantar un arbol fue hace 20 años. El segundo mejor es ahora."',
  '"La libertad financiera no es un destino, es un viaje de decisiones diarias."',
  '"Cada peso que ahorras hoy es un soldado que trabaja para ti mañana."',
  '"No se trata de cuanto ganas, sino de cuanto conservas y haces crecer."',
  '"Tu yo del futuro te esta mirando. Hazlo sentir orgulloso."',
  '"El interes compuesto es la octava maravilla del mundo." — Albert Einstein'
];

function renderMetas() {
  var filtered = getFilteredGoals();
  var listEl = document.getElementById('goalsList');
  var emptyEl = document.getElementById('goalsEmpty');

  // Calculate totals for summary
  var totalTarget = goals.reduce(function(s, g) { return s + (g.target || 0); }, 0);
  var totalSaved = goals.reduce(function(s, g) { return s + getGoalProgress(g); }, 0);
  var totalMonthly = goals.reduce(function(s, g) { return s + (g.monthly || 0); }, 0);
  var completedCount = goals.filter(function(g) { return g.target > 0 && getGoalProgress(g) >= g.target; }).length;

  // Summary
  var summaryEl = document.getElementById('goalsSummary');
  if (goals.length > 0) {
    summaryEl.innerHTML =
      '<div class="goals-summary-card"><div class="gs-value">' + goals.length + '</div><div class="gs-label">Metas activas</div></div>' +
      '<div class="goals-summary-card"><div class="gs-value">' + fmt(totalMonthly) + '</div><div class="gs-label">Ahorro mensual asignado</div></div>' +
      '<div class="goals-summary-card"><div class="gs-value">' + fmt(totalTarget) + '</div><div class="gs-label">Objetivo total</div></div>';
  } else {
    summaryEl.innerHTML = '';
  }

  // List
  if (filtered.length === 0) {
    listEl.innerHTML = '';
    emptyEl.style.display = '';
  } else {
    emptyEl.style.display = 'none';
    listEl.innerHTML = filtered.map(function(g) {
      var cfg = GOAL_CATEGORY_CONFIG[g.category] || GOAL_CATEGORY_CONFIG.otro;
      var saved = getGoalProgress(g);
      var pct = g.target > 0 ? Math.min(100, (saved / g.target) * 100) : 0;
      var isComplete = pct >= 100;
      var proj = getGoalProjection(g);
      var monthsLeft = getMonthsRemaining(g);

      var termLabel = g.term === 'corto' ? 'Corto' : g.term === 'mediano' ? 'Mediano' : 'Largo';

      var metaLine = termLabel + ' plazo';
      if (g.monthly > 0) metaLine += ' · ' + fmt(g.monthly) + '/mes';
      if (monthsLeft !== null) {
        metaLine += ' · ' + (monthsLeft === 0 ? 'Vence este mes' : monthsLeft + ' meses restantes');
      }
      if (proj.monthsNeeded > 0 && proj.monthsNeeded < Infinity && !isComplete) {
        metaLine += ' · ~' + proj.monthsNeeded + ' meses para lograrlo';
      }

      var statusIcon = isComplete ? '✅' : (!proj.onTrack ? '⚠️' : '');

      return '<div class="goal-card" onclick="editGoal(\'' + g.id + '\')">' +
        '<div class="goal-card-header">' +
          '<span class="goal-card-icon">' + cfg.icon + '</span>' +
          '<div class="goal-card-info">' +
            '<div class="goal-card-name"><span class="goal-priority-dot ' + g.priority + '"></span>' + g.name + ' ' + statusIcon +
            '<span class="goal-term-badge ' + g.term + '">' + termLabel + '</span></div>' +
            '<div class="goal-card-meta">' + metaLine + '</div>' +
          '</div>' +
          '<div class="goal-card-amount">' + fmt(g.target) +
            (saved > 0 ? '<div class="goal-card-amount-sub">Ahorrado: ' + fmt(saved) + '</div>' : '') +
          '</div>' +
        '</div>' +
        (g.target > 0 ? '<div class="goal-progress-bar"><div class="goal-progress-fill' + (isComplete ? ' complete' : '') + '" style="width:' + pct + '%"></div></div>' +
        '<div class="goal-progress-text"><span><strong>' + pct.toFixed(1) + '%</strong></span><span>' + fmt(saved) + ' / ' + fmt(g.target) + '</span></div>' : '') +
        (g.notes ? '<div style="font-size:0.73rem;color:var(--text-secondary);margin-top:6px;padding-top:6px;border-top:1px solid var(--border);">' + g.notes + '</div>' : '') +
      '</div>';
    }).join('');
  }

  // Quote
  var quoteEl = document.getElementById('metasQuote');
  if (!quoteEl.dataset.set) {
    quoteEl.textContent = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    quoteEl.dataset.set = '1';
  }
}

// Add patrimonio to nav
var navTitles = { dashboard:['Dashboard','Resumen de tus finanzas'], metas:['Metas','Tus objetivos financieros'],
  transacciones:['Transacciones','Detalle de movimientos'],
  categorias:['Categorias','Reglas y conciliacion'], importar:['Importar','Sube cartolas y estados de cuenta'],
  revisar:['Revisar','Corrige categorias mal asignadas'], patrimonio:['Patrimonio','Inversiones, ahorro y proyeccion'] };

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// ---- REFRESH (updated) ----
function refreshAll() {
  populateMonthFilter();
  renderDashboard();
  renderTransactions();
  renderRules();
  renderRevisar();
  renderPatrimonio();
  renderMetas();
  var info = document.getElementById('storageInfo');
  info.textContent = transactions.length > 0 ? transactions.length + ' transacciones guardadas' : 'Sin datos';
  info.className = 'import-status ' + (transactions.length > 0 ? 'success' : '');
}

refreshAll();
