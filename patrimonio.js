/* ============================================
   PATRIMONIO — Properties, accounts, FIRE, projection
   ============================================ */

function loadProfileForm() {
  document.getElementById('profileUF').value = profile.uf || 38800;
  document.getElementById('profileAge').value = profile.age;
  document.getElementById('profileRetireAge').value = profile.retireAge;
  document.getElementById('profileMonthlySpend').value = profile.monthlySpend;
  document.getElementById('profileSavingsGoal').value = profile.savingsGoal;
  document.getElementById('profileReturnRate').value = profile.returnRate;
}

document.getElementById('saveProfileBtn').addEventListener('click', async function() {
  profile.uf = parseFloat(document.getElementById('profileUF').value) || 38800;
  profile.age = parseInt(document.getElementById('profileAge').value) || 30;
  profile.retireAge = parseInt(document.getElementById('profileRetireAge').value) || 65;
  profile.monthlySpend = parseInt(document.getElementById('profileMonthlySpend').value) || 1500000;
  profile.savingsGoal = parseInt(document.getElementById('profileSavingsGoal').value) || 500000;
  profile.returnRate = parseFloat(document.getElementById('profileReturnRate').value) || 8;
  await saveProfileDB();
  renderPatrimonio();
});

// ---- PROPERTY TYPES ----
var PROP_TYPE_CONFIG = {
  propiedad: { icon: '🏠', label: 'Casa / Departamento', hint: 'Ingresa tu casa o depto. Si tienes credito hipotecario, pon la deuda y el dividendo para proyectar cuando se libera.', namePlaceholder: 'ej: Depto Las Condes', purchasePlaceholder: 'ej: 3500', currentPlaceholder: 'ej: 4200', showDebt: true, showDividendo: true, showYears: true, showRent: true, defaultAppreciation: 5 },
  terreno: { icon: '🏞️', label: 'Terreno', hint: 'Los terrenos bien ubicados suben 5-10% anual. No tienen dividendo ni arriendo normalmente.', namePlaceholder: 'ej: Terreno Chicureo', purchasePlaceholder: 'ej: 2000', currentPlaceholder: 'ej: 2800', showDebt: true, showDividendo: false, showYears: true, showRent: false, defaultAppreciation: 6 },
  comercial: { icon: '🏢', label: 'Local Comercial / Oficina', hint: 'Locales y oficinas generan arriendo. Pon el arriendo mensual para incluirlo en tu proyeccion.', namePlaceholder: 'ej: Oficina Providencia', purchasePlaceholder: 'ej: 5000', currentPlaceholder: 'ej: 5500', showDebt: true, showDividendo: true, showYears: true, showRent: true, defaultAppreciation: 4 },
  estacionamiento: { icon: '🅿️', label: 'Estacionamiento / Bodega', hint: 'Estacionamientos y bodegas son buena inversion por bajo costo y buen arriendo relativo.', namePlaceholder: 'ej: Estacionamiento Ed. Central', purchasePlaceholder: 'ej: 400', currentPlaceholder: 'ej: 450', showDebt: false, showDividendo: false, showYears: false, showRent: true, defaultAppreciation: 3 }
};

window.updatePropertyForm = function() {
  var type = document.getElementById('propType').value;
  var cfg = PROP_TYPE_CONFIG[type] || PROP_TYPE_CONFIG.propiedad;
  document.getElementById('propTypeHint').textContent = cfg.hint;
  var f = '';
  f += '<label>Nombre</label>';
  f += '<input type="text" id="propName" placeholder="' + cfg.namePlaceholder + '" class="search-input full-w">';
  f += '<label>Valor de compra (' + (getUnitName ? getUnitName() || 'UF' : 'UF') + ')</label>';
  f += '<input type="number" id="propPurchaseValue" placeholder="' + cfg.purchasePlaceholder + '" step="0.01" class="search-input full-w">';
  f += '<label>Valor actual estimado (' + (getUnitName ? getUnitName() || 'UF' : 'UF') + ')</label>';
  f += '<input type="number" id="propCurrentValue" placeholder="' + cfg.currentPlaceholder + '" step="0.01" class="search-input full-w">';
  if (cfg.showDebt) { f += '<label>Deuda pendiente (' + (getUnitName ? getUnitName() || 'UF' : 'UF') + ')</label>'; f += '<input type="number" id="propDebt" placeholder="ej: 2800" step="0.01" value="0" class="search-input full-w">'; }
  if (cfg.showDividendo) { f += '<label>Dividendo mensual (CLP)</label>'; f += '<input type="number" id="propDividendo" value="0" class="search-input full-w">'; }
  if (cfg.showYears) { f += '<label>Plazo restante credito (años)</label>'; f += '<input type="number" id="propYearsLeft" value="0" min="0" max="40" class="search-input full-w" style="width:100px">'; }
  f += '<label>Plusvalia anual esperada (%)</label>';
  f += '<input type="number" id="propAppreciation" step="0.5" value="' + cfg.defaultAppreciation + '" class="search-input full-w" style="width:100px">';
  if (cfg.showRent) { f += '<label>Arriendo mensual (CLP)</label>'; f += '<input type="number" id="propRent" value="0" class="search-input full-w">'; }
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

document.getElementById('propModalCancel').addEventListener('click', function() { document.getElementById('propertyModal').classList.remove('open'); });

document.getElementById('propModalDelete').addEventListener('click', async function() {
  if (editingPropId && confirm('Eliminar esta propiedad?')) {
    await deleteProperty(editingPropId);
    document.getElementById('propertyModal').classList.remove('open');
    renderPatrimonio();
  }
});

document.getElementById('propModalSave').addEventListener('click', async function() {
  var nameEl = document.getElementById('propName');
  var name = nameEl ? nameEl.value.trim() : '';
  if (!name) return;
  var getVal = function(id, def) { var el = document.getElementById(id); return el ? (parseFloat(el.value) || def) : def; };
  var data = { id: editingPropId || gid(), name: name, type: document.getElementById('propType').value, purchaseValue: getVal('propPurchaseValue', 0), currentValue: getVal('propCurrentValue', 0), debt: getVal('propDebt', 0), dividendo: getVal('propDividendo', 0), yearsLeft: getVal('propYearsLeft', 0), appreciation: getVal('propAppreciation', 0), rent: getVal('propRent', 0) };
  if (editingPropId) { var idx = properties.findIndex(function(p) { return p.id === editingPropId; }); if (idx >= 0) properties[idx] = data; }
  else { properties.push(data); }
  await saveProperty(data);
  document.getElementById('propertyModal').classList.remove('open');
  renderPatrimonio();
});

window.editProperty = function(id) {
  var p = properties.find(function(x) { return x.id === id; });
  if (!p) return;
  editingPropId = id;
  document.getElementById('propertyModalTitle').textContent = 'Editar Propiedad';
  document.getElementById('propType').value = p.type || 'propiedad';
  updatePropertyForm();
  var setVal = function(id, v) { var el = document.getElementById(id); if (el) el.value = v; };
  setVal('propName', p.name); setVal('propPurchaseValue', p.purchaseValue); setVal('propCurrentValue', p.currentValue);
  setVal('propDebt', p.debt || 0); setVal('propDividendo', p.dividendo || 0); setVal('propYearsLeft', p.yearsLeft || 0);
  setVal('propAppreciation', p.appreciation); setVal('propRent', p.rent || 0);
  document.getElementById('propModalDelete').style.display = '';
  document.getElementById('propertyModal').classList.add('open');
};

function getPropertyIcon(type) { var cfg = PROP_TYPE_CONFIG[type]; return cfg ? cfg.icon : '🏠'; }

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
  return transactions.filter(function(tx) { return tx.category === 'Ahorro'; }).reduce(function(s, tx) { return s + (tx.type === 'gasto' ? tx.amount : -tx.amount); }, 0);
}

function renderPatrimonio() {
  loadProfileForm();

  var listEl = document.getElementById('propertiesList');
  var emptyEl = document.getElementById('propertiesEmpty');
  if (properties.length === 0) {
    listEl.innerHTML = '';
    emptyEl.style.display = '';
    emptyEl.innerHTML = '<div class="empty-state-enhanced"><div class="empty-icon">🏠</div><div class="empty-msg">Registra tus propiedades e inversiones inmobiliarias<br>para calcular tu patrimonio real.</div><button class="btn btn-primary" onclick="document.getElementById(\'addPropertyBtn\').click()">Agregar propiedad →</button></div>';
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

  renderAccounts();
  renderCompanies();

  var totalValueUF = properties.reduce(function(s, p) { return s + p.currentValue; }, 0);
  var totalDebtUF = properties.reduce(function(s, p) { return s + (p.debt || 0); }, 0);
  var totalEquityUF = totalValueUF - totalDebtUF;
  var totalEquityCLP = ufToCLP(totalEquityUF);
  var totalAhorro = getTotalSavings();
  var totalLiquidez = getTotalAccounts();
  var totalCompanies = getTotalCompanies();
  var patrimonio = totalEquityCLP + Math.max(0, totalAhorro) + totalLiquidez + totalCompanies;

  document.getElementById('patPropTotal').textContent = fmt(totalEquityCLP);
  document.getElementById('patPropUF').textContent = fmtUF(totalEquityUF) + ' (valor ' + fmtUF(totalValueUF) + ' - deuda ' + fmtUF(totalDebtUF) + ')';
  document.getElementById('patAhorroTotal').textContent = fmt(Math.max(0, totalAhorro));
  document.getElementById('patNetoTotal').textContent = fmt(patrimonio);

  var fireNumber = (profile.monthlySpend * 12) / 0.04;
  var firePct = fireNumber > 0 ? Math.min(100, (patrimonio / fireNumber) * 100) : 0;
  document.getElementById('patFire').textContent = fmt(fireNumber);
  document.getElementById('patFirePct').textContent = firePct.toFixed(1) + '%';
  document.getElementById('fireBarFill').style.width = firePct + '%';

  var yearsToFire = calculateYearsToFire(patrimonio, fireNumber);
  var fireLabel = document.getElementById('fireYearsLabel');
  if (patrimonio >= fireNumber) { fireLabel.textContent = 'Ya alcanzaste FIRE!'; }
  else if (yearsToFire < 100) { fireLabel.textContent = '~' + yearsToFire + ' años'; }
  else { fireLabel.textContent = 'Ajusta tu plan'; }

  renderSavingsTrack();
  renderProjection(patrimonio, fireNumber);
}

function getPropertyEquityAtYear(p, year) {
  var value = p.currentValue * Math.pow(1 + p.appreciation / 100, year);
  var debt = (p.debt || 0);
  if (debt > 0 && (p.yearsLeft || 0) > 0) { var remaining = Math.max(0, 1 - year / p.yearsLeft); debt = debt * remaining; }
  else if (debt > 0) { debt = 0; }
  return value - debt;
}

function getFreedDividendosAtYear(year) {
  return properties.reduce(function(s, p) {
    if ((p.dividendo || 0) > 0 && (p.yearsLeft || 0) > 0 && year >= p.yearsLeft) { return s + p.dividendo; }
    return s;
  }, 0);
}

function calculateYearsToFire(currentNet, fireNumber) {
  if (currentNet >= fireNumber) return 0;
  var monthlyRate = (profile.returnRate / 100) / 12;
  var baseMonthlySave = profile.savingsGoal;
  var monthlyRent = properties.reduce(function(s, p) { return s + (p.rent || 0); }, 0);
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
  var financialAssets = currentNet - propEquityY0CLP;

  var labels = [], dataPatrimonio = [], dataDebt = [], dataFire = [];

  for (var y = 0; y <= yearsToRetire; y++) {
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
        { label: 'Patrimonio Neto', data: dataPatrimonio, borderColor: '#4f46e5', backgroundColor: 'rgba(79,70,229,0.08)', fill: true, tension: 0.3, pointRadius: 2, borderWidth: 2.5 },
        { label: 'Deuda Hipotecaria', data: dataDebt, borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.06)', fill: true, tension: 0.3, pointRadius: 0, borderWidth: 2, borderDash: [4, 3] },
        { label: 'Numero FIRE', data: dataFire, borderColor: '#10b981', borderDash: [8, 4], pointRadius: 0, borderWidth: 2, fill: false }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      aspectRatio: window.innerWidth < 600 ? 1.2 : 2,
      interaction: { intersect: false, mode: 'index' },
      plugins: {
        tooltip: { callbacks: { title: function(items) { return 'Edad: ' + items[0].label + ' años'; }, label: function(ctx) { return ctx.dataset.label + ': ' + fmt(ctx.parsed.y); } } },
        legend: { position:'top', labels:{ boxWidth:12, font:{ size: window.innerWidth<600?10:12 }, padding:10 } }
      },
      scales: {
        y: { ticks: { callback: function(v) { return '$' + (v/1000000).toFixed(0) + 'M'; }, font:{ size: window.innerWidth<600?10:12 }, maxTicksLimit:6 }, grid: { color: '#f0f0f0' } },
        x: { title: { display:true, text:'Edad', font:{ size: window.innerWidth<600?10:12 } }, ticks: { font:{ size: window.innerWidth<600?9:12 }, maxTicksLimit: window.innerWidth<600?8:15, maxRotation:0 }, grid: { display: false } }
      }
    }
  });

  var crossAge = null;
  for (var i = 0; i < dataPatrimonio.length; i++) {
    if (dataPatrimonio[i] >= fireNumber) { crossAge = labels[i]; break; }
  }

  var insightsEl = document.getElementById('projectionInsights');
  insightsEl.innerHTML =
    '<div class="insight-card"><span class="insight-label">Patrimonio a los ' + profile.retireAge + '</span><span class="insight-value">' + fmt(patrimonioAtRetire) + '</span></div>' +
    '<div class="insight-card"><span class="insight-label">Renta mensual pasiva (regla 4%)</span><span class="insight-value">' + fmt(monthlyPassive) + '</span><span class="insight-sub">' + (monthlyPassive >= profile.monthlySpend ? 'Cubre tu meta de ' + fmt(profile.monthlySpend) : 'Falta ' + fmt(profile.monthlySpend - monthlyPassive) + ' para tu meta') + '</span></div>' +
    '<div class="insight-card"><span class="insight-label">Edad FIRE estimada</span><span class="insight-value' + (crossAge ? ' green' : '') + '">' + (crossAge ? crossAge + ' años' : 'No alcanzable con plan actual') + '</span>' + (crossAge ? '<span class="insight-sub">Faltan ' + (crossAge - profile.age) + ' años</span>' : '<span class="insight-sub">Considera aumentar ahorro o rentabilidad</span>') + '</div>' +
    '<div class="insight-card"><span class="insight-label">Propiedades a los ' + profile.retireAge + ' (neto)</span><span class="insight-value">' + fmtUF(properties.reduce(function(s, p) { return s + getPropertyEquityAtYear(p, yearsToRetire); }, 0)) + '</span><span class="insight-sub">' + fmt(ufToCLP(properties.reduce(function(s, p) { return s + getPropertyEquityAtYear(p, yearsToRetire); }, 0))) + ' · sin deuda</span></div>';
}

// ---- ACCOUNTS / LIQUIDEZ ----
function saveAccounts() { if (typeof saveAccountDB === 'function') { /* saved per-item via saveAccountDB */ } }
function getTotalAccounts() { return accounts.reduce(function(s, a) { return s + (a.balance || 0); }, 0); }
function getAccountIcon(type) {
  var icons = { cuenta_corriente:'💳', cuenta_ahorro:'🏦', deposito_plazo:'🔒', fondo_mutuo:'📈', apv:'🎯', etf:'📊', cripto:'₿', efectivo:'💵', otro:'📁' };
  return icons[type] || '📁';
}
function getAccountTypeName(type) {
  var names = { cuenta_corriente:'Cuenta Corriente', cuenta_ahorro:'Cuenta Ahorro', deposito_plazo:'Deposito a Plazo', fondo_mutuo:'Fondo Mutuo', apv:'APV', etf:'ETF/Acciones', cripto:'Cripto', efectivo:'Efectivo', otro:'Otro' };
  return names[type] || type;
}

var ACC_TYPE_CONFIG = {
  cuenta_corriente: { hint:'Tu cuenta del banco donde recibes tu sueldo y pagas tus gastos del dia a dia.', namePlaceholder:'ej: Cuenta Corriente Banco BICE', balancePlaceholder:'ej: 2500000', institutionPlaceholder:'ej: Banco BICE, Banco Chile, BCI', showReturn:false, defaultReturn:0, showNotes:false },
  cuenta_ahorro: { hint:'Cuenta donde guardas plata que no usas en el dia a dia.', namePlaceholder:'ej: Cuenta Ahorro Banco Estado', balancePlaceholder:'ej: 5000000', institutionPlaceholder:'ej: Banco Estado, BCI', showReturn:true, defaultReturn:2, showNotes:false },
  deposito_plazo: { hint:'Plata a plazo fijo en el banco. No la puedes tocar hasta que venza. Renta entre 4-6% anual.', namePlaceholder:'ej: DAP 90 dias Banco Chile', balancePlaceholder:'ej: 10000000', institutionPlaceholder:'ej: Banco Chile, Banco BICE', showReturn:true, defaultReturn:5, showNotes:true, notesPlaceholder:'ej: Vence 15 junio 2026' },
  fondo_mutuo: { hint:'Un fondo que invierte tu plata en un mix de instrumentos. Renta fija (~4-6%) o variable (~8-12%).', namePlaceholder:'ej: Fondo Mutuo Renta Local BCI', balancePlaceholder:'ej: 8000000', institutionPlaceholder:'ej: BCI, Fintual, LarrainVial', showReturn:true, defaultReturn:7, showNotes:true, notesPlaceholder:'ej: Serie A, renta fija' },
  apv: { hint:'Ahorro Previsional Voluntario. Regimen A: el Estado te bonifica 15%. Regimen B: descuentas de impuestos.', namePlaceholder:'ej: APV Regimen A Habitat', balancePlaceholder:'ej: 3000000', institutionPlaceholder:'ej: AFP Habitat, Fintual', showReturn:true, defaultReturn:6, showNotes:true, notesPlaceholder:'ej: Regimen A, perfil moderado' },
  etf: { hint:'Fondos que replican indices (S&P 500) o acciones. Mayor riesgo pero mayor retorno potencial.', namePlaceholder:'ej: ETF S&P 500 (VOO)', balancePlaceholder:'Valor actual en CLP, ej: 6000000', institutionPlaceholder:'ej: Racional, eToro, Interactive Brokers', showReturn:true, defaultReturn:10, showNotes:true, notesPlaceholder:'ej: 15 cuotas VOO' },
  cripto: { hint:'Bitcoin, Ethereum u otras criptos. Alta volatilidad. Pon el valor actual en pesos.', namePlaceholder:'ej: Bitcoin', balancePlaceholder:'Valor actual en CLP, ej: 4000000', institutionPlaceholder:'ej: Buda.com, Binance', showReturn:false, defaultReturn:0, showNotes:true, notesPlaceholder:'ej: 0.05 BTC' },
  efectivo: { hint:'Plata en efectivo, caja chica, o guardada fuera del banco.', namePlaceholder:'ej: Caja fuerte casa', balancePlaceholder:'ej: 500000', institutionPlaceholder:'', showReturn:false, defaultReturn:0, showNotes:false },
  otro: { hint:'Cualquier otro ahorro o inversion que no calce en las categorias anteriores.', namePlaceholder:'ej: Prestamo a familiar', balancePlaceholder:'ej: 2000000', institutionPlaceholder:'', showReturn:true, defaultReturn:0, showNotes:true, notesPlaceholder:'ej: Me pagan en diciembre' }
};

window.updateAccountForm = function() {
  var type = document.getElementById('accType').value;
  var cfg = ACC_TYPE_CONFIG[type] || ACC_TYPE_CONFIG.otro;
  document.getElementById('accTypeHint').textContent = cfg.hint;
  var fields = '';
  fields += '<label>Nombre</label><input type="text" id="accName" placeholder="' + cfg.namePlaceholder + '" class="search-input full-w">';
  fields += '<label>Saldo actual (CLP)</label><input type="number" id="accBalance" placeholder="' + cfg.balancePlaceholder + '" class="search-input full-w">';
  if (cfg.institutionPlaceholder) fields += '<label>Institucion</label><input type="text" id="accInstitution" placeholder="' + cfg.institutionPlaceholder + '" class="search-input full-w">';
  if (cfg.showReturn) fields += '<label>Rentabilidad anual esperada (%)</label><input type="number" id="accReturn" step="0.5" value="' + cfg.defaultReturn + '" class="search-input full-w" style="width:100px">';
  if (cfg.showNotes) fields += '<label>Notas</label><input type="text" id="accNotes" placeholder="' + (cfg.notesPlaceholder || '') + '" class="search-input full-w">';
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
document.getElementById('accModalCancel').addEventListener('click', function() { document.getElementById('accountModal').classList.remove('open'); });
document.getElementById('accModalDelete').addEventListener('click', function() {
  if (editingAccId && confirm('Eliminar esta cuenta?')) {
    accounts = accounts.filter(function(a) { return a.id !== editingAccId; });
    deleteAccountDB(editingAccId); document.getElementById('accountModal').classList.remove('open'); renderPatrimonio();
  }
});
document.getElementById('accModalSave').addEventListener('click', function() {
  var nameEl = document.getElementById('accName');
  var name = nameEl ? nameEl.value.trim() : '';
  if (!name) return;
  var balEl = document.getElementById('accBalance'), instEl = document.getElementById('accInstitution'), retEl = document.getElementById('accReturn'), notesEl = document.getElementById('accNotes');
  var data = { id: editingAccId || gid(), name: name, type: document.getElementById('accType').value, balance: parseInt(balEl ? balEl.value : 0) || 0, institution: instEl ? instEl.value.trim() : '', returnRate: parseFloat(retEl ? retEl.value : 0) || 0, notes: notesEl ? notesEl.value.trim() : '' };
  if (editingAccId) { var idx = accounts.findIndex(function(a) { return a.id === editingAccId; }); if (idx >= 0) accounts[idx] = data; } else { accounts.push(data); }
  saveAccountDB(data); document.getElementById('accountModal').classList.remove('open'); renderPatrimonio();
});
window.editAccount = function(id) {
  var a = accounts.find(function(x) { return x.id === id; });
  if (!a) return;
  editingAccId = id;
  document.getElementById('accountModalTitle').textContent = 'Editar Cuenta';
  document.getElementById('accType').value = a.type;
  updateAccountForm();
  var nameEl = document.getElementById('accName'), balEl = document.getElementById('accBalance'), instEl = document.getElementById('accInstitution'), retEl = document.getElementById('accReturn'), notesEl = document.getElementById('accNotes');
  if (nameEl) nameEl.value = a.name; if (balEl) balEl.value = a.balance; if (instEl) instEl.value = a.institution || ''; if (retEl) retEl.value = a.returnRate || 0; if (notesEl) notesEl.value = a.notes || '';
  document.getElementById('accModalDelete').style.display = '';
  document.getElementById('accountModal').classList.add('open');
};
// ---- COMPANIES / EMPRESAS ----
function getTotalCompanies() {
  return companies.reduce(function(s, c) { return s + Math.round((c.value || 0) * (c.pct || 0) / 100); }, 0);
}

function renderCompanies() {
  var listEl = document.getElementById('companiesList');
  var emptyEl = document.getElementById('companiesEmpty');
  var totalBar = document.getElementById('companiesTotalBar');
  if (!listEl) return;
  if (companies.length === 0) {
    listEl.innerHTML = '';
    emptyEl.style.display = '';
    totalBar.style.display = 'none';
    emptyEl.innerHTML = '<div class="empty-state-enhanced"><div class="empty-icon">🏢</div><div class="empty-msg">Registra tu participacion en empresas o sociedades<br>para incluirlas en tu patrimonio total.</div><button class="btn btn-primary" onclick="document.getElementById(\'addCompanyBtn\').click()">Agregar empresa →</button></div>';
  } else {
    emptyEl.style.display = 'none';
    totalBar.style.display = '';
    listEl.innerHTML = companies.map(function(c) {
      var myValue = Math.round((c.value || 0) * (c.pct || 0) / 100);
      return '<div class="property-card" onclick="editCompany(\'' + c.id + '\')">' +
        '<span class="property-icon">🏢</span>' +
        '<div class="property-info"><span class="property-name">' + c.name + '</span>' +
        '<span class="property-meta">Valor empresa: ' + fmt(c.value) + ' · ' + c.pct + '% participacion' + (c.notes ? ' · ' + c.notes : '') + '</span></div>' +
        '<div class="property-value"><span class="property-value-main amount-positive">' + fmt(myValue) + '</span>' +
        '<span class="property-value-gain" style="color:var(--text-secondary);font-size:0.72rem">Tu parte</span></div></div>';
    }).join('');
    document.getElementById('companiesTotalValue').textContent = fmt(getTotalCompanies());
  }
}

document.getElementById('addCompanyBtn').addEventListener('click', function() {
  editingCompanyId = null;
  document.getElementById('companyModalTitle').textContent = 'Agregar Empresa';
  document.getElementById('companyName').value = '';
  document.getElementById('companyValue').value = '';
  document.getElementById('companyPct').value = '';
  document.getElementById('companyNotes').value = '';
  document.getElementById('companyModalDelete').style.display = 'none';
  document.getElementById('companyModal').classList.add('open');
});

document.getElementById('companyModalCancel').addEventListener('click', function() {
  document.getElementById('companyModal').classList.remove('open');
});

document.getElementById('companyModalDelete').addEventListener('click', async function() {
  if (editingCompanyId && confirm('Eliminar esta empresa?')) {
    companies = companies.filter(function(c) { return c.id !== editingCompanyId; });
    await deleteCompanyDB(editingCompanyId);
    document.getElementById('companyModal').classList.remove('open');
    renderPatrimonio();
  }
});

document.getElementById('companyModalSave').addEventListener('click', async function() {
  var name = document.getElementById('companyName').value.trim();
  if (!name) return;
  var data = {
    id: editingCompanyId || gid(),
    name: name,
    value: parseInt(document.getElementById('companyValue').value) || 0,
    pct: parseFloat(document.getElementById('companyPct').value) || 0,
    notes: document.getElementById('companyNotes').value.trim()
  };
  if (editingCompanyId) {
    var idx = companies.findIndex(function(c) { return c.id === editingCompanyId; });
    if (idx >= 0) companies[idx] = data;
  } else {
    companies.push(data);
  }
  await saveCompanyDB(data);
  document.getElementById('companyModal').classList.remove('open');
  renderPatrimonio();
});

window.editCompany = function(id) {
  var c = companies.find(function(x) { return x.id === id; });
  if (!c) return;
  editingCompanyId = id;
  document.getElementById('companyModalTitle').textContent = 'Editar Empresa';
  document.getElementById('companyName').value = c.name;
  document.getElementById('companyValue').value = c.value;
  document.getElementById('companyPct').value = c.pct;
  document.getElementById('companyNotes').value = c.notes || '';
  document.getElementById('companyModalDelete').style.display = '';
  document.getElementById('companyModal').classList.add('open');
};

function renderAccounts() {
  var listEl = document.getElementById('accountsList'), emptyEl = document.getElementById('accountsEmpty'), totalBar = document.getElementById('accountsTotalBar');
  if (accounts.length === 0) { listEl.innerHTML = ''; emptyEl.style.display = ''; totalBar.style.display = 'none'; emptyEl.innerHTML = '<div class="empty-state-enhanced"><div class="empty-icon">💰</div><div class="empty-msg">Registra tus cuentas de ahorro, fondos mutuos y liquidez<br>para ver tu patrimonio completo.</div><button class="btn btn-primary" onclick="document.getElementById(\'addAccountBtn\').click()">Agregar cuenta →</button></div>'; }
  else {
    emptyEl.style.display = 'none'; totalBar.style.display = '';
    listEl.innerHTML = accounts.map(function(a) {
      var retInfo = a.returnRate > 0 ? ' · Rent: ' + a.returnRate + '%' : '';
      var instInfo = a.institution ? ' · ' + a.institution : '';
      return '<div class="property-card" onclick="editAccount(\'' + a.id + '\')">' +
        '<span class="property-icon">' + getAccountIcon(a.type) + '</span>' +
        '<div class="property-info"><span class="property-name">' + a.name + '</span>' +
        '<span class="property-meta">' + getAccountTypeName(a.type) + instInfo + retInfo + '</span></div>' +
        '<div class="property-value"><span class="property-value-main amount-positive">' + fmt(a.balance) + '</span></div></div>';
    }).join('');
    document.getElementById('accountsTotalValue').textContent = fmt(getTotalAccounts());
  }
}
