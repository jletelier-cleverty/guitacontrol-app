/* ============================================
   AJUSTES — Settings + Simulador "¿Me alcanza?"
   ============================================ */

function renderAjustes() {
  // Country
  document.getElementById('ajusteCountry').value = profile.country || 'CL';
  var cfg = getCountryCfg();
  var unitRow = document.getElementById('ajusteUnitRow');
  if (cfg.unitName) {
    unitRow.style.display = '';
    document.getElementById('ajusteUnitLabel').textContent = 'Valor ' + cfg.unitName + ' actual';
  } else {
    unitRow.style.display = 'none';
  }
  // Sync profile fields
  document.getElementById('ajusteUF').value = profile.uf || cfg.unitDefault;
  document.getElementById('ajusteAge').value = profile.age || 30;
  document.getElementById('ajusteRetireAge').value = profile.retireAge || 65;
  document.getElementById('ajusteMonthlySpend').value = profile.monthlySpend || 1500000;
  document.getElementById('ajusteSavingsGoal').value = profile.savingsGoal || 500000;
  document.getElementById('ajusteReturnRate').value = profile.returnRate || 8;

  // Also sync old profile fields in patrimonio view
  var profileUnitLabel = document.getElementById('profileUnitLabel');
  if (profileUnitLabel && cfg.unitName) profileUnitLabel.textContent = 'Valor ' + cfg.unitName + ' actual';
  document.getElementById('profileUF').value = profile.uf || cfg.unitDefault;
  document.getElementById('profileAge').value = profile.age || 30;
  document.getElementById('profileRetireAge').value = profile.retireAge || 65;
  document.getElementById('profileMonthlySpend').value = profile.monthlySpend || 1500000;
  document.getElementById('profileSavingsGoal').value = profile.savingsGoal || 500000;
  document.getElementById('profileReturnRate').value = profile.returnRate || 8;

  // Render benchmark settings
  var container = document.getElementById('benchmarkSettings');
  if (!container) return;
  var userBenchmarks = profile.benchmarks || {};
  container.innerHTML = '<div class="bench-grid">' + Object.keys(defaultBenchmarks).map(function(cat) {
    var val = userBenchmarks[cat] !== undefined ? userBenchmarks[cat] : defaultBenchmarks[cat];
    return '<div class="bench-item">' +
      '<span class="bench-label">' + getCatIcon(cat) + ' ' + cat + '</span>' +
      '<div class="bench-input-wrap"><input type="number" min="0" max="100" step="1" value="' + val + '" data-bench-cat="' + cat + '" class="search-input bench-input"><span class="bench-pct">%</span></div>' +
    '</div>';
  }).join('') + '</div>';
}

document.getElementById('ajusteCountry').addEventListener('change', function() {
  var cfg = COUNTRY_CONFIG[this.value] || COUNTRY_CONFIG['CL'];
  var unitRow = document.getElementById('ajusteUnitRow');
  if (cfg.unitName) {
    unitRow.style.display = '';
    document.getElementById('ajusteUnitLabel').textContent = 'Valor ' + cfg.unitName + ' actual';
    document.getElementById('ajusteUF').value = cfg.unitDefault;
  } else {
    unitRow.style.display = 'none';
  }
});

document.getElementById('saveAjustesBtn').addEventListener('click', async function() {
  profile.country = document.getElementById('ajusteCountry').value || 'CL';
  var cfg = getCountryCfg();
  profile.uf = parseFloat(document.getElementById('ajusteUF').value) || cfg.unitDefault;
  profile.age = parseInt(document.getElementById('ajusteAge').value) || 30;
  profile.retireAge = parseInt(document.getElementById('ajusteRetireAge').value) || 65;
  profile.monthlySpend = parseInt(document.getElementById('ajusteMonthlySpend').value) || 1500000;
  profile.savingsGoal = parseInt(document.getElementById('ajusteSavingsGoal').value) || 500000;
  profile.returnRate = parseFloat(document.getElementById('ajusteReturnRate').value) || 8;

  // Collect benchmarks
  var benchmarks = {};
  document.querySelectorAll('[data-bench-cat]').forEach(function(input) {
    benchmarks[input.getAttribute('data-bench-cat')] = parseInt(input.value) || 0;
  });
  profile.benchmarks = benchmarks;

  await saveProfileDB();
  refreshAll();
  alert('Ajustes guardados');
});

// ---- SIMULADOR ¿ME ALCANZA? ----
var _simBtn = document.getElementById('simCalcular');
if (_simBtn) _simBtn.addEventListener('click', function() {
  var valor = parseFloat(document.getElementById('simValor').value) || 0;
  var nombre = document.getElementById('simNombre').value || document.getElementById('simTipo').value;
  var pago = document.querySelector('input[name="simPago"]:checked').value;

  if (valor <= 0) { alert('Ingresa el valor del bien'); return; }

  // Get current monthly flow
  var curMonth = document.getElementById('monthFilter').value;
  var filtered = getFiltered();
  var ingMes = filtered.filter(function(t) { return t.type === 'ingreso' && !isExcluded(t.category); }).reduce(function(s,t) { return s+t.amount; }, 0);
  var gasMes = filtered.filter(isRealExpense).reduce(function(s,t) { return s+t.amount; }, 0);
  var flujoActual = ingMes - gasMes;

  var cuotaMensual = 0;
  var totalPagar = valor;
  var interesTotal = 0;
  var plazoMeses = 0;

  if (pago === 'credito') {
    var pie = parseFloat(document.getElementById('simPie').value) || 0;
    var tasaAnual = parseFloat(document.getElementById('simTasa').value) || 0;
    plazoMeses = parseInt(document.getElementById('simPlazo').value) || 48;
    var monto = valor - pie;

    if (tasaAnual > 0 && plazoMeses > 0 && monto > 0) {
      var tasaMes = tasaAnual / 100 / 12;
      cuotaMensual = Math.round(monto * (tasaMes * Math.pow(1 + tasaMes, plazoMeses)) / (Math.pow(1 + tasaMes, plazoMeses) - 1));
      totalPagar = pie + (cuotaMensual * plazoMeses);
      interesTotal = totalPagar - valor;
    } else {
      cuotaMensual = monto > 0 ? Math.round(monto / plazoMeses) : 0;
      totalPagar = valor;
    }
  }

  var ahorro = parseFloat(document.getElementById('simAhorro').value) || 0;
  var flujoNuevo = pago === 'contado' ? flujoActual : flujoActual - cuotaMensual;
  var pctFlujo = ingMes > 0 ? (cuotaMensual / ingMes * 100).toFixed(1) : 0;

  var resultado = document.getElementById('simResultado');
  resultado.style.display = '';
  document.getElementById('simResultTitulo').textContent = '\u{1F4CA} ' + nombre;

  var html = '';

  if (pago === 'credito') {
    html += '<div class="sim-result-row"><span class="sim-result-label">Valor del bien</span><span class="sim-result-value">' + fmt(valor) + '</span></div>';
    html += '<div class="sim-result-row"><span class="sim-result-label">Pie / Enganche</span><span class="sim-result-value">' + fmt(parseFloat(document.getElementById('simPie').value) || 0) + '</span></div>';
    html += '<div class="sim-result-row"><span class="sim-result-label">Monto a financiar</span><span class="sim-result-value">' + fmt(valor - (parseFloat(document.getElementById('simPie').value) || 0)) + '</span></div>';
    html += '<div class="sim-result-row"><span class="sim-result-label">Tasa anual</span><span class="sim-result-value">' + (parseFloat(document.getElementById('simTasa').value) || 0) + '%</span></div>';
    html += '<div class="sim-result-row"><span class="sim-result-label">Plazo</span><span class="sim-result-value">' + plazoMeses + ' meses (' + (plazoMeses/12).toFixed(1) + ' a\u00f1os)</span></div>';
    html += '<div class="sim-result-row" style="font-size:1.1rem"><span class="sim-result-label"><strong>Cuota mensual</strong></span><span class="sim-result-value" style="color:var(--red)"><strong>' + fmt(cuotaMensual) + '</strong></span></div>';
    html += '<div class="sim-result-row"><span class="sim-result-label">Total a pagar</span><span class="sim-result-value">' + fmt(totalPagar) + '</span></div>';
    html += '<div class="sim-result-row"><span class="sim-result-label">Intereses totales</span><span class="sim-result-value" style="color:#ef4444">' + fmt(interesTotal) + '</span></div>';
    html += '<div class="sim-result-row"><span class="sim-result-label">% de tu ingreso mensual</span><span class="sim-result-value">' + pctFlujo + '%</span></div>';
  } else {
    html += '<div class="sim-result-row"><span class="sim-result-label">Valor del bien</span><span class="sim-result-value">' + fmt(valor) + '</span></div>';
    html += '<div class="sim-result-row"><span class="sim-result-label">Tu ahorro / caja</span><span class="sim-result-value">' + fmt(ahorro) + '</span></div>';
    var sobrante = ahorro - valor;
    html += '<div class="sim-result-row" style="font-size:1.1rem"><span class="sim-result-label"><strong>' + (sobrante >= 0 ? 'Te sobra' : 'Te falta') + '</strong></span><span class="sim-result-value" style="color:' + (sobrante >= 0 ? 'var(--green)' : 'var(--red)') + '"><strong>' + fmt(Math.abs(sobrante)) + '</strong></span></div>';
    if (sobrante < 0 && flujoActual > 0) {
      var mesesAhorro = Math.ceil(Math.abs(sobrante) / flujoActual);
      html += '<div class="sim-result-row"><span class="sim-result-label">Meses ahorrando para llegar</span><span class="sim-result-value">' + mesesAhorro + ' meses (' + (mesesAhorro/12).toFixed(1) + ' a\u00f1os)</span></div>';
    }
  }

  // Flow comparison
  if (pago === 'credito') {
    html += '<div class="sim-flow-compare">' +
      '<div class="sim-flow-box"><div class="sim-flow-label">Flujo actual</div><div class="sim-flow-value" style="color:' + (flujoActual >= 0 ? 'var(--green)' : 'var(--red)') + '">' + (flujoActual < 0 ? '-' : '') + fmt(Math.abs(flujoActual)) + '</div></div>' +
      '<div class="sim-flow-arrow">\u27a1\ufe0f</div>' +
      '<div class="sim-flow-box"><div class="sim-flow-label">Flujo con cuota</div><div class="sim-flow-value" style="color:' + (flujoNuevo >= 0 ? 'var(--green)' : 'var(--red)') + '">' + (flujoNuevo < 0 ? '-' : '') + fmt(Math.abs(flujoNuevo)) + '</div></div>' +
    '</div>';
  } else {
    html += '<div class="sim-flow-compare">' +
      '<div class="sim-flow-box"><div class="sim-flow-label">Ahorro actual</div><div class="sim-flow-value" style="color:var(--green)">' + fmt(ahorro) + '</div></div>' +
      '<div class="sim-flow-arrow">\u27a1\ufe0f</div>' +
      '<div class="sim-flow-box"><div class="sim-flow-label">Ahorro despues</div><div class="sim-flow-value" style="color:' + (sobrante >= 0 ? 'var(--green)' : 'var(--red)') + '">' + (sobrante < 0 ? '-' : '') + fmt(Math.abs(sobrante)) + '</div></div>' +
    '</div>';
  }

  // Verdict
  var verdictClass, verdictText;
  if (pago === 'contado') {
    if (ahorro >= valor && (ahorro - valor) > ahorro * 0.2) {
      verdictClass = 'sim-verdict-ok';
      verdictText = '\u2705 <strong>Si te alcanza!</strong> Te sobran ' + fmt(ahorro - valor) + ' despues de la compra. Buen colchon de seguridad.';
    } else if (ahorro >= valor) {
      verdictClass = 'sim-verdict-tight';
      verdictText = '\u26a0\ufe0f <strong>Te alcanza, pero te quedas justo.</strong> Despues de pagar te quedan solo ' + fmt(ahorro - valor) + '. Considera dejar al menos 3-6 meses de gastos como fondo de emergencia.';
    } else {
      var falta = valor - ahorro;
      var mesesMsg = flujoActual > 0 ? ' Si ahorras tu excedente mensual (' + fmt(flujoActual) + '), lo juntas en ' + Math.ceil(falta / flujoActual) + ' meses.' : '';
      verdictClass = 'sim-verdict-no';
      verdictText = '\u{1F6A8} <strong>No te alcanza al contado.</strong> Te faltan ' + fmt(falta) + '.' + mesesMsg + ' Considera credito o seguir ahorrando.';
    }
  } else {
    if (flujoNuevo > ingMes * 0.2) {
      verdictClass = 'sim-verdict-ok';
      verdictText = '\u2705 <strong>Te alcanza comodo!</strong> La cuota de ' + fmt(cuotaMensual) + ' (' + pctFlujo + '% de tu ingreso) te deja buen margen. Aun te sobrarian ' + fmt(flujoNuevo) + ' al mes.';
    } else if (flujoNuevo > 0) {
      verdictClass = 'sim-verdict-tight';
      verdictText = '\u26a0\ufe0f <strong>Te alcanza, pero justo.</strong> La cuota de ' + fmt(cuotaMensual) + ' (' + pctFlujo + '% de tu ingreso) te deja solo ' + fmt(flujoNuevo) + ' de margen. Cualquier imprevisto te puede complicar.';
    } else {
      verdictClass = 'sim-verdict-no';
      verdictText = '\u{1F6A8} <strong>No te alcanza.</strong> La cuota de ' + fmt(cuotaMensual) + ' (' + pctFlujo + '% de tu ingreso) te dejaria con flujo negativo de ' + fmt(Math.abs(flujoNuevo)) + '. Busca un plazo mas largo, un bien mas barato, o ahorra para un pie mayor.';
    }
  }

  html += '<div class="sim-verdict ' + verdictClass + '">' + verdictText + '</div>';

  document.getElementById('simResultBody').innerHTML = html;
});
