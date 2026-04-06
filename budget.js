/* ============================================
   BUDGET — Mi Mes Ideal (presupuesto mensual)
   ============================================ */

var DEFAULT_BUDGET = [
  { name: 'Sueldo / Ingresos', amount: 0, type: 'ingreso' },
  { name: 'Casa (dividendo/arriendo)', amount: 0, type: 'gasto' },
  { name: 'Jardin / Colegio', amount: 0, type: 'gasto' },
  { name: 'Yosi (nana)', amount: 0, type: 'gasto' },
  { name: 'Bencina / Auto', amount: 0, type: 'gasto' },
  { name: 'Inversiones / Ahorro', amount: 0, type: 'gasto' }
];

function loadBudget() {
  try {
    var saved = localStorage.getItem('guitacontrol_budget');
    return saved ? JSON.parse(saved) : DEFAULT_BUDGET.slice();
  } catch(e) { return DEFAULT_BUDGET.slice(); }
}

function saveBudget(items) {
  localStorage.setItem('guitacontrol_budget', JSON.stringify(items));
}

function renderBudget() {
  var container = document.getElementById('budgetContent');
  if (!container) return;

  var items = loadBudget();
  var totalIngreso = 0, totalGasto = 0;
  items.forEach(function(it) {
    if (it.type === 'ingreso') totalIngreso += it.amount;
    else totalGasto += it.amount;
  });
  var disponible = totalIngreso - totalGasto;

  // If nothing configured, show setup prompt
  if (totalIngreso === 0 && totalGasto === 0) {
    container.innerHTML = '<div style="text-align:center;padding:20px 0;color:var(--text-secondary)">' +
      '<div style="font-size:1.5rem;margin-bottom:8px">📋</div>' +
      '<p>Arma tu presupuesto mensual ideal.</p>' +
      '<p style="font-size:0.8rem">Define tus ingresos y gastos fijos para ver cuanto te queda disponible.</p>' +
      '<button class="btn btn-primary" onclick="showBudgetModal()" style="margin-top:12px">Configurar →</button></div>';
    return;
  }

  var html = '<div class="budget-grid">';

  // Ingresos
  var ingresos = items.filter(function(it) { return it.type === 'ingreso'; });
  if (ingresos.length > 0) {
    html += '<div class="budget-group">' +
      '<div class="budget-group-title">Ingresos</div>';
    ingresos.forEach(function(it) {
      if (it.amount > 0) {
        html += '<div class="budget-row"><span class="budget-row-name">📥 ' + it.name + '</span>' +
          '<span class="budget-row-amount amount-positive">+' + fmt(it.amount) + '</span></div>';
      }
    });
    html += '<div class="budget-row budget-row-total"><span>Total ingresos</span>' +
      '<span class="amount-positive">+' + fmt(totalIngreso) + '</span></div></div>';
  }

  // Gastos fijos
  var gastos = items.filter(function(it) { return it.type === 'gasto'; });
  if (gastos.length > 0) {
    html += '<div class="budget-group">' +
      '<div class="budget-group-title">Gastos Fijos</div>';
    gastos.forEach(function(it) {
      if (it.amount > 0) {
        var pct = totalIngreso > 0 ? ((it.amount / totalIngreso) * 100).toFixed(0) : 0;
        html += '<div class="budget-row"><span class="budget-row-name">📤 ' + it.name + '</span>' +
          '<span class="budget-row-detail">' + pct + '%</span>' +
          '<span class="budget-row-amount amount-negative">-' + fmt(it.amount) + '</span></div>';
      }
    });
    html += '<div class="budget-row budget-row-total"><span>Total gastos fijos</span>' +
      '<span class="amount-negative">-' + fmt(totalGasto) + '</span></div></div>';
  }

  // Disponible
  var dispColor = disponible >= 0 ? 'green' : 'red';
  var dispPct = totalIngreso > 0 ? ((disponible / totalIngreso) * 100).toFixed(0) : 0;
  html += '<div class="budget-disponible ' + dispColor + '">' +
    '<div class="budget-disponible-label">Disponible para entretencion y otros</div>' +
    '<div class="budget-disponible-amount">' + (disponible < 0 ? '-' : '') + fmt(Math.abs(disponible)) + '</div>' +
    '<div class="budget-disponible-pct">' + dispPct + '% de tus ingresos</div>';

  // Progress bar
  if (totalIngreso > 0) {
    var gastoPct = Math.min((totalGasto / totalIngreso) * 100, 100);
    html += '<div class="budget-bar-bg"><div class="budget-bar-fill" style="width:' + gastoPct + '%;background:' + (gastoPct > 90 ? 'var(--red)' : gastoPct > 70 ? '#f59e0b' : 'var(--green)') + '"></div></div>';
  }

  html += '</div></div>';
  container.innerHTML = html;
}

function showBudgetModal() {
  var items = loadBudget();

  var overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.style.display = 'flex';

  var html = '<div class="modal" style="max-width:500px">' +
    '<h3>Mi Mes Ideal</h3>' +
    '<div class="modal-body">' +
    '<p style="font-size:0.8rem;color:var(--text-secondary);margin-bottom:14px">Define tus ingresos y gastos fijos mensuales. Deja en 0 los que no aplican.</p>' +
    '<div id="budgetItems">';

  items.forEach(function(it, idx) {
    var icon = it.type === 'ingreso' ? '📥' : '📤';
    html += '<div class="budget-edit-row" data-idx="' + idx + '">' +
      '<span class="budget-edit-icon">' + icon + '</span>' +
      '<input type="text" class="search-input budget-edit-name" value="' + it.name + '" placeholder="Nombre">' +
      '<input type="number" class="search-input budget-edit-amount" value="' + (it.amount || '') + '" placeholder="0" style="width:120px;text-align:right">' +
      '<button class="btn-tx-delete" style="opacity:1" onclick="this.parentElement.remove()">×</button></div>';
  });

  html += '</div>' +
    '<div style="display:flex;gap:8px;margin-top:12px">' +
      '<button class="btn btn-sm btn-secondary" id="addBudgetIngreso">+ Ingreso</button>' +
      '<button class="btn btn-sm btn-secondary" id="addBudgetGasto">+ Gasto fijo</button>' +
    '</div>' +
    '</div>' +
    '<div class="modal-footer">' +
      '<button class="btn btn-secondary" id="budgetCancel">Cancelar</button>' +
      '<button class="btn btn-primary" id="budgetSave">Guardar</button>' +
    '</div></div>';

  overlay.innerHTML = html;
  document.body.appendChild(overlay);
  overlay.offsetHeight;
  overlay.classList.add('open');

  function addRow(type) {
    var container = overlay.querySelector('#budgetItems');
    var idx = container.children.length;
    var icon = type === 'ingreso' ? '📥' : '📤';
    var div = document.createElement('div');
    div.className = 'budget-edit-row';
    div.dataset.type = type;
    div.innerHTML = '<span class="budget-edit-icon">' + icon + '</span>' +
      '<input type="text" class="search-input budget-edit-name" value="" placeholder="Nombre">' +
      '<input type="number" class="search-input budget-edit-amount" value="" placeholder="0" style="width:120px;text-align:right">' +
      '<button class="btn-tx-delete" style="opacity:1" onclick="this.parentElement.remove()">×</button>';
    container.appendChild(div);
  }

  overlay.querySelector('#addBudgetIngreso').addEventListener('click', function() { addRow('ingreso'); });
  overlay.querySelector('#addBudgetGasto').addEventListener('click', function() { addRow('gasto'); });
  overlay.querySelector('#budgetCancel').addEventListener('click', function() { document.body.removeChild(overlay); });

  overlay.querySelector('#budgetSave').addEventListener('click', function() {
    var rows = overlay.querySelectorAll('.budget-edit-row');
    var newItems = [];
    rows.forEach(function(row, idx) {
      var name = row.querySelector('.budget-edit-name').value.trim();
      if (!name) return;
      var amount = parseInt(row.querySelector('.budget-edit-amount').value) || 0;
      // Determine type from original data or from dataset
      var origType = items[idx] ? items[idx].type : (row.dataset.type || 'gasto');
      newItems.push({ name: name, amount: amount, type: origType });
    });
    saveBudget(newItems);
    document.body.removeChild(overlay);
    renderBudget();
  });
}

// Wire up edit button
var _editBudgetBtn = document.getElementById('editBudgetBtn');
if (_editBudgetBtn) _editBudgetBtn.addEventListener('click', showBudgetModal);
