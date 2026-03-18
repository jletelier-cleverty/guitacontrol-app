/* ============================================
   DEUDAS — Debt tracking + reconciliation
   ============================================ */

function renderDeudas() {
  var listEl = document.getElementById('debtsList');
  var emptyEl = document.getElementById('debtsEmpty');
  var reconEl = document.getElementById('debtsReconciliation');
  if (!listEl) return;

  var loanCats = [...new Set(transactions.map(function(t) { return t.category; }))].filter(function(c) {
    return c && c.indexOf('Prestamos') === 0;
  });

  var allDebts = [];
  debts.forEach(function(d) {
    allDebts.push({ id: d.id, name: d.name, type: d.type, linkedCategory: d.linked_category, originalAmount: d.original_amount || 0, manual: true });
  });

  var linkedCats = debts.map(function(d) { return d.linked_category; });
  loanCats.forEach(function(cat) {
    if (linkedCats.indexOf(cat) === -1) {
      allDebts.push({ id: 'auto_' + cat, name: cat.replace('Prestamos ', ''), type: 'me_deben', linkedCategory: cat, originalAmount: 0, manual: false });
    }
  });

  if (allDebts.length === 0) {
    listEl.innerHTML = '';
    emptyEl.style.display = '';
    emptyEl.innerHTML = '<div class="empty-state-enhanced"><div class="empty-icon">💳</div><div class="empty-msg">Registra deudas que tienes o que te deben.<br>Se concilian automáticamente con tus transacciones.</div><button class="btn btn-primary" onclick="document.getElementById(\'addDebtBtn\').click()">Agregar deuda →</button></div>';
    reconEl.innerHTML = '';
    return;
  }

  emptyEl.style.display = 'none';

  var totalMeDeben = 0, totalYoDebo = 0;
  var debtCards = allDebts.map(function(d) {
    var cat = d.linkedCategory;
    var txs = cat ? transactions.filter(function(t) { return t.category === cat; }) : [];
    var cobros = txs.filter(function(t) { return t.type === 'gasto'; });
    var pagos = txs.filter(function(t) { return t.type === 'ingreso'; });
    var totalCobros = cobros.reduce(function(s,t) { return s+t.amount; }, 0);
    var totalPagos = pagos.reduce(function(s,t) { return s+t.amount; }, 0);

    var saldo;
    if (d.type === 'me_deben') { saldo = totalCobros - totalPagos; if (saldo > 0) totalMeDeben += saldo; }
    else { saldo = (d.originalAmount || totalCobros) - totalPagos; if (saldo > 0) totalYoDebo += saldo; }

    var statusClass = saldo <= 0 ? 'debt-paid' : (d.type === 'me_deben' ? 'debt-owed' : 'debt-owe');
    var statusLabel = saldo <= 0 ? '✅ Cuadrado' : (d.type === 'me_deben' ? 'Te debe ' + fmt(saldo) : 'Debes ' + fmt(saldo));
    var icon = d.type === 'me_deben' ? '📥' : '📤';

    return '<div class="debt-card ' + statusClass + '">' +
      '<div class="debt-header"><div class="debt-name">' + icon + ' ' + d.name + '</div><div class="debt-status">' + statusLabel + '</div></div>' +
      '<div class="debt-details">' +
        '<div class="debt-detail"><span class="debt-detail-label">' + (d.type === 'me_deben' ? 'Prestado' : 'Deuda original') + '</span><span class="debt-detail-value">' + fmt(d.originalAmount || totalCobros) + '</span></div>' +
        '<div class="debt-detail"><span class="debt-detail-label">Pagado / Devuelto</span><span class="debt-detail-value">' + fmt(totalPagos) + '</span></div>' +
        '<div class="debt-detail"><span class="debt-detail-label">Saldo</span><span class="debt-detail-value ' + (saldo > 0 ? (d.type === 'me_deben' ? 'green' : 'red') : 'green') + '">' + fmt(Math.abs(saldo)) + '</span></div>' +
      '</div>' +
      (d.manual ? '<div class="debt-actions"><button class="btn btn-sm btn-secondary" onclick="editDebt(\'' + d.id + '\')">Editar</button> <button class="btn btn-sm btn-danger" onclick="removeDebt(\'' + d.id + '\')">Eliminar</button></div>' : '<div class="debt-actions"><span style="font-size:0.75rem;color:var(--text-secondary)">Auto-detectado de transacciones</span></div>') +
    '</div>';
  });

  listEl.innerHTML = '<div class="debt-summary">' +
    '<div class="debt-kpi"><span class="debt-kpi-label">Me deben</span><span class="debt-kpi-value green">' + fmt(totalMeDeben) + '</span></div>' +
    '<div class="debt-kpi"><span class="debt-kpi-label">Yo debo</span><span class="debt-kpi-value red">' + fmt(totalYoDebo) + '</span></div>' +
    '<div class="debt-kpi"><span class="debt-kpi-label">Balance neto</span><span class="debt-kpi-value ' + (totalMeDeben - totalYoDebo >= 0 ? 'green' : 'red') + '">' + fmt(totalMeDeben - totalYoDebo) + '</span></div>' +
  '</div>' + debtCards.join('');

  reconEl.innerHTML = allDebts.filter(function(d) { return d.linkedCategory; }).map(function(d) {
    var txs = transactions.filter(function(t) { return t.category === d.linkedCategory; });
    if (txs.length === 0) return '';
    var sorted = txs.sort(function(a,b) { return b.date.localeCompare(a.date); });
    return '<div class="import-card" style="margin-top:16px">' +
      '<h3>' + getCatIcon(d.linkedCategory) + ' ' + d.name + ' — Conciliacion</h3>' +
      '<div class="top-gastos">' + sorted.map(function(t) {
        return '<div class="top-item"><span class="top-icon">' + (t.type === 'ingreso' ? '📥' : '📤') + '</span>' +
          '<div class="top-info"><span class="top-desc">' + trunc(t.description, 50) + '</span>' +
          '<span class="top-date">' + t.date + ' - ' + (t.source === 'banco' ? 'BICE' : 'CMR') + '</span></div>' +
          '<span class="' + (t.type==='ingreso'?'amount-positive':'amount-negative') + '">' + (t.type==='ingreso'?'+':'-') + fmt(t.amount) + '</span></div>';
      }).join('') + '</div></div>';
  }).join('');
}

var _addDebtBtn = document.getElementById('addDebtBtn');
if (_addDebtBtn) _addDebtBtn.addEventListener('click', function() { showDebtModal(); });

function showDebtModal(existing) {
  var isEdit = !!existing;
  var d = existing || { name: '', type: 'me_deben', linked_category: '', original_amount: 0 };

  var allCats = [...new Set(transactions.map(function(t) { return t.category; }).filter(Boolean))];

  var overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.style.display = 'flex';
  overlay.innerHTML = '<div class="modal">' +
    '<h3>' + (isEdit ? 'Editar Deuda' : 'Nueva Deuda') + '</h3>' +
    '<div class="modal-body">' +
      '<label>Nombre</label><input type="text" id="debtName" value="' + (d.name || '') + '" placeholder="ej: Tricapitals, Juan, etc." class="search-input full-w">' +
      '<label style="margin-top:12px">Tipo</label>' +
      '<select id="debtType" class="filter-select full-w">' +
        '<option value="me_deben"' + (d.type === 'me_deben' ? ' selected' : '') + '>Me deben (yo preste)</option>' +
        '<option value="yo_debo"' + (d.type === 'yo_debo' ? ' selected' : '') + '>Yo debo (me prestaron)</option>' +
      '</select>' +
      '<label style="margin-top:12px">Monto original</label><input type="number" id="debtAmount" value="' + (d.original_amount || '') + '" placeholder="0" class="search-input full-w">' +
      '<label style="margin-top:12px">Categoria vinculada (opcional)</label>' +
      '<select id="debtCategory" class="filter-select full-w"><option value="">Sin vincular</option>' +
        allCats.map(function(c) { return '<option value="' + c + '"' + (d.linked_category === c ? ' selected' : '') + '>' + c + '</option>'; }).join('') +
      '</select>' +
      '<p style="font-size:0.75rem;color:var(--text-secondary);margin-top:4px">Si vinculas una categoria, las transacciones de esa categoria se usan para conciliar la deuda automaticamente.</p>' +
    '</div>' +
    '<div class="modal-footer">' +
      '<button class="btn btn-secondary" id="debtCancel">Cancelar</button>' +
      '<button class="btn btn-primary" id="debtSave">' + (isEdit ? 'Guardar' : 'Agregar') + '</button>' +
    '</div></div>';

  document.body.appendChild(overlay);
  overlay.offsetHeight;
  overlay.classList.add('open');

  overlay.querySelector('#debtCancel').addEventListener('click', function() { document.body.removeChild(overlay); });

  overlay.querySelector('#debtSave').addEventListener('click', async function() {
    var name = document.getElementById('debtName').value.trim();
    if (!name) { alert('Ingresa un nombre'); return; }
    var debt = { id: isEdit ? d.id : 'debt_' + Date.now(), name: name, type: document.getElementById('debtType').value, original_amount: parseFloat(document.getElementById('debtAmount').value) || 0, linked_category: document.getElementById('debtCategory').value };
    if (isEdit) { var idx = debts.findIndex(function(x) { return x.id === d.id; }); if (idx >= 0) debts[idx] = debt; }
    else { debts.push(debt); }
    await saveDebtDB(debt);
    document.body.removeChild(overlay);
    renderDeudas();
  });
}

function editDebt(id) {
  var d = debts.find(function(x) { return x.id === id; });
  if (d) showDebtModal(d);
}

async function removeDebt(id) {
  if (!confirm('Eliminar esta deuda?')) return;
  debts = debts.filter(function(x) { return x.id !== id; });
  await deleteDebtDB(id);
  renderDeudas();
}
