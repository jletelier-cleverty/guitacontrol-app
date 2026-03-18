/* ============================================
   NAV — Sidebar navigation + mobile menu
   ============================================ */

var navTitles = {
  importar:['Importar','Sube cartolas y estados de cuenta'],
  transacciones:['Transacciones','Detalle de movimientos'],
  patrimonio:['Patrimonio','Inversiones, ahorro y proyeccion'],
  dashboard:['Dashboard','Resumen de tus finanzas'],
  estrategia:['Mi Estrategia','Perfil de inversionista y portafolio sugerido'],
  ajustes:['Ajustes','Configuracion, reglas y categorizacion']
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
