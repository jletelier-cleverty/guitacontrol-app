/* ============================================
   DEUDAS — Debt tracking + monthly reconciliation
   ============================================ */

function renderDeudas() {
  var listEl = document.getElementById('debtsList');
  var emptyEl = document.getElementById('debtsEmpty');
  var reconEl = document.getElementById('debtsReconciliation');
  if (!listEl) return;

  if (debts.length === 0) {
    listEl.innerHTML = '';
    emptyEl.style.display = '';
    emptyEl.innerHTML = '<div class="empty-state-enhanced"><div class="empty-icon">💳</div>' +
      '<div class="empty-msg">Registra deudas, creditos o pagos recurrentes.<br>' +
      'Vincula una categoria para conciliar automaticamente con tus transacciones.</div>' +
      '<button class="btn btn-primary" onclick="document.getElementById(\'addDebtBtn\').click()">Agregar deuda →</button></div>';
    reconEl.innerHTML = '';
    return;
  }

  emptyEl.style.display = 'none';
  var totalMeDeben = 0, totalYoDebo = 0;

  var debtCards = debts.map(function(d) {
    var cat = d.linked_category;
    var txs = cat ? transactions.filter(function(t) { return t.category === cat; }) : [];
    var ingresos = txs.filter(function(t) { return t.type === 'ingreso'; });
    var gastos = txs.filter(function(t) { return t.type === 'gasto'; });
    var totalIngresos = ingresos.reduce(function(s,t) { return s+t.amount; }, 0);
    var totalGastos = gastos.reduce(function(s,t) { return s+t.amount; }, 0);

    var saldo, saldoLabel;
    if (d.type === 'me_deben') {
      // Me deben: ingresos = lo que me pagan, gastos = lo que el banco me cobra
      saldo = totalGastos - totalIngresos;
      if (saldo > 0) totalMeDeben += saldo;
      saldoLabel = saldo > 0 ? 'Te deben ' + fmt(saldo) : '✅ Cuadrado';
    } else if (d.type === 'yo_pago') {
      // Yo pago recurrente (ej: nana): solo gastos/ingresos
      saldo = totalGastos;
      totalYoDebo += saldo;
      saldoLabel = 'Total pagado: ' + fmt(saldo);
    } else {
      // Yo debo
      saldo = (d.original_amount || totalGastos) - totalIngresos;
      if (saldo > 0) totalYoDebo += saldo;
      saldoLabel = saldo > 0 ? 'Debes ' + fmt(saldo) : '✅ Pagado';
    }

    var statusClass = saldo <= 0 ? 'debt-paid' : (d.type === 'me_deben' ? 'debt-owed' : 'debt-owe');
    var icon = d.type === 'me_deben' ? '📥' : (d.type === 'yo_pago' ? '👤' : '📤');

    // Monthly breakdown
    var monthlyHtml = '';
    if (txs.length > 0) {
      var byMonth = {};
      txs.forEach(function(t) {
        if (!byMonth[t.month]) byMonth[t.month] = { ingresos: [], gastos: [] };
        if (t.type === 'ingreso') byMonth[t.month].ingresos.push(t);
        else byMonth[t.month].gastos.push(t);
      });
      var months = Object.keys(byMonth).sort().reverse();

      monthlyHtml = '<div class="debt-monthly">' +
        '<div class="debt-monthly-title">Detalle mes a mes</div>' +
        months.map(function(m) {
          var md = byMonth[m];
          var mIngresos = md.ingresos.reduce(function(s,t) { return s+t.amount; }, 0);
          var mGastos = md.gastos.reduce(function(s,t) { return s+t.amount; }, 0);
          var mDiff = mGastos - mIngresos;
          var parts = m.split('-');
          var monthNames = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
          var monthLabel = monthNames[parseInt(parts[1])-1] + ' ' + parts[0];

          var txList = md.gastos.concat(md.ingresos).sort(function(a,b) { return a.date.localeCompare(b.date); });

          return '<div class="debt-month-block">' +
            '<div class="debt-month-header" onclick="this.parentElement.classList.toggle(\'expanded\')">' +
              '<span class="debt-month-name">' + monthLabel + '</span>' +
              '<span class="debt-month-kpis">' +
                (mGastos > 0 ? '<span class="amount-negative">-' + fmt(mGastos) + '</span>' : '') +
                (mIngresos > 0 ? '<span class="amount-positive" style="margin-left:10px">+' + fmt(mIngresos) + '</span>' : '') +
                (d.type === 'me_deben' && mDiff !== 0 ? '<span class="debt-month-diff ' + (mDiff > 0 ? 'red' : 'green') + '">' + (mDiff > 0 ? 'Deben ' : 'A favor ') + fmt(Math.abs(mDiff)) + '</span>' : '') +
                (d.type === 'yo_pago' ? '<span class="debt-month-diff">Total: ' + fmt(mGastos) + '</span>' : '') +
              '</span>' +
              '<span class="review-group-arrow">▾</span>' +
            '</div>' +
            '<div class="debt-month-body">' +
              txList.map(function(t) {
                return '<div class="top-item">' +
                  '<span class="top-icon">' + (t.type === 'ingreso' ? '📥' : '📤') + '</span>' +
                  '<div class="top-info"><span class="top-desc">' + t.description + '</span>' +
                  '<span class="top-date">' + t.date + ' - ' + (t.source === 'banco' ? 'BICE' : 'CMR') + '</span></div>' +
                  '<span class="' + (t.type==='ingreso'?'amount-positive':'amount-negative') + '">' + (t.type==='ingreso'?'+':'-') + fmt(t.amount) + '</span></div>';
              }).join('') +
            '</div>' +
          '</div>';
        }).join('') +
      '</div>';
    }

    return '<div class="debt-card ' + statusClass + '">' +
      '<div class="debt-header">' +
        '<div class="debt-name">' + icon + ' ' + d.name + '</div>' +
        '<div class="debt-status">' + saldoLabel + '</div>' +
      '</div>' +
      '<div class="debt-details">' +
        (d.type === 'me_deben' ? (
          '<div class="debt-detail"><span class="debt-detail-label">Banco te cobra</span><span class="debt-detail-value amount-negative">' + fmt(totalGastos) + '</span></div>' +
          '<div class="debt-detail"><span class="debt-detail-label">' + d.name + ' te paga</span><span class="debt-detail-value amount-positive">' + fmt(totalIngresos) + '</span></div>' +
          '<div class="debt-detail"><span class="debt-detail-label">Diferencia</span><span class="debt-detail-value ' + (totalGastos - totalIngresos > 0 ? 'red' : 'green') + '">' + fmt(Math.abs(totalGastos - totalIngresos)) + '</span></div>'
        ) : d.type === 'yo_pago' ? (
          '<div class="debt-detail"><span class="debt-detail-label">Total pagado</span><span class="debt-detail-value">' + fmt(totalGastos) + '</span></div>' +
          '<div class="debt-detail"><span class="debt-detail-label">Meses con pagos</span><span class="debt-detail-value">' + Object.keys(txs.reduce(function(acc,t) { acc[t.month]=1; return acc; }, {})).length + '</span></div>' +
          (d.original_amount > 0 ? '<div class="debt-detail"><span class="debt-detail-label">Pago mensual acordado</span><span class="debt-detail-value">' + fmt(d.original_amount) + '</span></div>' : '')
        ) : (
          '<div class="debt-detail"><span class="debt-detail-label">Deuda original</span><span class="debt-detail-value">' + fmt(d.original_amount || totalGastos) + '</span></div>' +
          '<div class="debt-detail"><span class="debt-detail-label">Pagado</span><span class="debt-detail-value">' + fmt(totalIngresos) + '</span></div>' +
          '<div class="debt-detail"><span class="debt-detail-label">Saldo</span><span class="debt-detail-value ' + (saldo > 0 ? 'red' : 'green') + '">' + fmt(Math.abs(saldo)) + '</span></div>'
        )) +
      '</div>' +
      monthlyHtml +
      '<div class="debt-actions">' +
        '<button class="btn btn-sm btn-secondary" onclick="editDebt(\'' + d.id + '\')">Editar</button> ' +
        '<button class="btn btn-sm btn-danger" onclick="removeDebt(\'' + d.id + '\')">Eliminar</button>' +
      '</div>' +
    '</div>';
  });

  listEl.innerHTML = '<div class="debt-summary">' +
    '<div class="debt-kpi"><span class="debt-kpi-label">Me deben</span><span class="debt-kpi-value green">' + fmt(totalMeDeben) + '</span></div>' +
    '<div class="debt-kpi"><span class="debt-kpi-label">Yo debo / pago</span><span class="debt-kpi-value red">' + fmt(totalYoDebo) + '</span></div>' +
    '<div class="debt-kpi"><span class="debt-kpi-label">Balance neto</span><span class="debt-kpi-value ' + (totalMeDeben - totalYoDebo >= 0 ? 'green' : 'red') + '">' + fmt(totalMeDeben - totalYoDebo) + '</span></div>' +
  '</div>' + debtCards.join('');

  reconEl.innerHTML = '';
}

var _addDebtBtn = document.getElementById('addDebtBtn');
if (_addDebtBtn) _addDebtBtn.addEventListener('click', function() { showDebtModal(); });

function showDebtModal(existing) {
  var isEdit = !!existing;
  var d = existing || { name: '', type: 'me_deben', linked_category: '', original_amount: 0 };

  var allCats = [...new Set(transactions.map(function(t) { return t.category; }).filter(Boolean))].sort();

  var overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.style.display = 'flex';
  overlay.innerHTML = '<div class="modal">' +
    '<h3>' + (isEdit ? 'Editar Deuda' : 'Nueva Deuda') + '</h3>' +
    '<div class="modal-body">' +
      '<label>Nombre</label><input type="text" id="debtName" value="' + (d.name || '') + '" placeholder="ej: Cleverty, Tricapitals, Yosi..." class="search-input full-w">' +
      '<label style="margin-top:12px">Tipo</label>' +
      '<select id="debtType" class="filter-select full-w">' +
        '<option value="me_deben"' + (d.type === 'me_deben' ? ' selected' : '') + '>Me deben / Credito (empresa me paga y banco me cobra)</option>' +
        '<option value="yo_pago"' + (d.type === 'yo_pago' ? ' selected' : '') + '>Yo pago recurrente (nana, arriendo, etc.)</option>' +
        '<option value="yo_debo"' + (d.type === 'yo_debo' ? ' selected' : '') + '>Yo debo (me prestaron plata)</option>' +
      '</select>' +
      '<label style="margin-top:12px">Monto mensual o deuda original</label><input type="number" id="debtAmount" value="' + (d.original_amount || '') + '" placeholder="0 (opcional)" class="search-input full-w">' +
      '<p style="font-size:0.75rem;color:var(--text-secondary);margin-top:2px">Para pagos recurrentes: monto mensual acordado. Para deudas: monto original.</p>' +
      '<label style="margin-top:12px">Categoria vinculada</label>' +
      '<select id="debtCategory" class="filter-select full-w"><option value="">Sin vincular</option>' +
        allCats.map(function(c) { return '<option value="' + c + '"' + (d.linked_category === c ? ' selected' : '') + '>' + getCatIcon(c) + ' ' + c + '</option>'; }).join('') +
      '</select>' +
      '<p style="font-size:0.75rem;color:var(--text-secondary);margin-top:2px">Vincula una categoria para ver el detalle mes a mes automaticamente.</p>' +
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
    var debt = {
      id: isEdit ? d.id : 'debt_' + Date.now(),
      name: name,
      type: document.getElementById('debtType').value,
      original_amount: parseFloat(document.getElementById('debtAmount').value) || 0,
      linked_category: document.getElementById('debtCategory').value
    };
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
