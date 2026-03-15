/* ============================================
   NAV — Sidebar navigation + mobile menu
   ============================================ */

var navTitles = {
  dashboard:['Dashboard','Resumen de tus finanzas'],
  metas:['Metas','Tus objetivos financieros'],
  transacciones:['Transacciones','Detalle de movimientos'],
  categorias:['Categorias','Reglas y conciliacion'],
  importar:['Importar','Sube cartolas y estados de cuenta'],
  revisar:['Revisar','Corrige categorias mal asignadas'],
  patrimonio:['Patrimonio','Inversiones, ahorro y proyeccion'],
  ajustes:['Ajustes','Configuracion y parametros'],
  deudas:['Deudas','Control de deudas y prestamos'],
  estrategia:['Mi Estrategia','Perfil de inversionista y portafolio sugerido'],
  inversiones:['Inversiones','Top instrumentos por categoría y rendimiento']
};

function switchView(view) {
  document.querySelectorAll('.nav-item').forEach(function(n) {
    n.classList.toggle('active', n.dataset.view === view);
  });
  document.querySelectorAll('.view').forEach(function(v) { v.classList.remove('active'); });
  var viewEl = document.getElementById('view-' + view);
  if (viewEl) viewEl.classList.add('active');
  var t = navTitles[view] || ['',''];
  document.getElementById('viewTitle').textContent = t[0];
  document.getElementById('viewSubtitle').textContent = t[1];
  if (view === 'estrategia' && typeof checkSavedInvestorProfile === 'function') checkSavedInvestorProfile();
  if (view === 'inversiones' && typeof renderInversiones === 'function') renderInversiones();
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('mobileOverlay').classList.remove('open');
}

// ---- SIDEBAR NAV ----
document.querySelectorAll('.nav-item').forEach(function(item) {
  item.addEventListener('click', function(e) {
    e.preventDefault();
    switchView(item.dataset.view);
  });
});

// ---- MOBILE MENU ----
var _mobileMenuBtn = document.getElementById('mobileMenuBtn');
if (_mobileMenuBtn) _mobileMenuBtn.addEventListener('click', function() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('mobileOverlay').classList.toggle('open');
});
var _mobileOverlay = document.getElementById('mobileOverlay');
if (_mobileOverlay) _mobileOverlay.addEventListener('click', function() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('mobileOverlay').classList.remove('open');
});

// ---- MONTH FILTER ----
function populateMonthFilter() {
  var sel = document.getElementById('monthFilter');
  var months = [...new Set(transactions.map(function(t) { return t.month; }))].sort().reverse();
  var cur = sel.value;
  sel.innerHTML = '<option value="all">Todos los meses</option>';
  months.forEach(function(m) { var p=m.split('-'); var o=document.createElement('option'); o.value=m; o.textContent=MN[parseInt(p[1])-1]+' '+p[0]; sel.appendChild(o); });
  sel.value = cur || 'all';
}

var _monthFilter = document.getElementById('monthFilter');
if (_monthFilter) _monthFilter.addEventListener('change', function() { activeCatFilter='all'; refreshAll(); });

// ---- FILTER FUNCTIONS ----
function getFilteredAll() {
  var m = document.getElementById('monthFilter').value;
  var list = m === 'all' ? transactions.slice() : transactions.filter(function(t) { return t.month === m; });
  if (activeCatFilter !== 'all') list = list.filter(function(t) { return (t.category || 'Sin Categorizar') === activeCatFilter; });
  return list;
}

function getFiltered() {
  return getFilteredAll().filter(isVisible);
}

function getFilteredByMonth() {
  var m = document.getElementById('monthFilter').value;
  var list = m === 'all' ? transactions.slice() : transactions.filter(function(t) { return t.month === m; });
  return list.filter(isVisible);
}

// ---- PDF.JS CONFIG ----
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
