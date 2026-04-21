/* ============================================
   DASHBOARD — KPIs, charts, health, trends, insights
   ============================================ */

function renderDashboard() {
  renderChecklist();
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

  // Debug panel
  var debugAll = getFilteredAll();
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

  // Category breakdown
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

  // Donut chart
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

  // Monthly bar chart
  var monthlyData = {};
  transactions.forEach(function(t) {
    if (!monthlyData[t.month]) monthlyData[t.month] = { i: 0, g: 0 };
    if (t.type === 'ingreso' && !isExcluded(t.category)) monthlyData[t.month].i += t.amount;
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

  // Top gastos
  var topDiv = document.getElementById('topGastos');
  var top = gastosReales.slice().sort(function(a,b) { return b.amount - a.amount; }).slice(0, 8);
  topDiv.innerHTML = top.map(function(t) {
    return '<div class="top-item"><span class="top-icon">' + getCatIcon(t.category || 'Sin Categorizar') + '</span>' +
      '<div class="top-info"><span class="top-desc">' + t.description + '</span><span class="top-date">' + t.date + '</span></div>' +
      '<span class="top-cat" style="background:' + getCatColor(t.category||'Sin Categorizar') + '15;color:' + getCatColor(t.category||'Sin Categorizar') + '">' + (t.category || 'Sin Cat.') + '</span>' +
      '<span class="top-amount">-' + fmt(t.amount) + '</span></div>';
  }).join('');

  // Prestamos — Conciliacion (Cleverty y Tricapitals)
  renderPrestamos();

  // ---- SALUD FINANCIERA ----
  var userBench = profile.benchmarks || {};
  var benchmarks = {};
  var defBench = defaultBenchmarks;
  Object.keys(defBench).forEach(function(cat) {
    benchmarks[cat] = { max: userBench[cat] !== undefined ? userBench[cat] : defBench[cat] };
  });

  var healthSection = document.getElementById('healthSection');
  var healthGrid = document.getElementById('healthGrid');
  var healthSummary = document.getElementById('healthSummary');

  if (totalI > 0 && totalG > 0) {
    healthSection.style.display = '';
    var healthHtml = '';
    var warnings = 0;
    var alerts = 0;

    Object.keys(benchmarks).forEach(function(cat) {
      var bm = benchmarks[cat];
      var catTotal = 0;
      gastosReales.forEach(function(t) { if (t.category === cat) catTotal += t.amount; });
      if (catTotal === 0) return;

      var pct = (catTotal / totalI) * 100;
      var ratio = pct / bm.max;
      var color, signal;
      if (ratio <= 0.8) { color = '#10b981'; signal = '\u{1F7E2}'; }
      else if (ratio <= 1.1) { color = '#f59e0b'; signal = '\u{1F7E1}'; warnings++; }
      else { color = '#ef4444'; signal = '\u{1F534}'; alerts++; }

      var barWidth = Math.min(pct / bm.max * 100, 150);

      healthHtml += '<div class="health-item">' +
        '<span class="health-icon">' + getCatIcon(cat) + '</span>' +
        '<div class="health-info">' +
          '<div class="health-cat">' + cat + '</div>' +
          '<div class="health-bar-bg"><div class="health-bar" style="width:' + barWidth + '%;background:' + color + '"></div></div>' +
          '<div class="health-detail">' + pct.toFixed(1) + '% de tu ingreso (recomendado: ' + bm.max + '%)</div>' +
        '</div>' +
        '<span class="health-signal">' + signal + '</span>' +
      '</div>';
    });

    healthGrid.innerHTML = healthHtml;

    if (alerts > 0) {
      healthSummary.className = 'health-summary-bad';
      healthSummary.innerHTML = '<strong>\u26A0\uFE0F Atencion:</strong> Tienes ' + alerts + ' categoria(s) por sobre lo recomendado. Revisa tus gastos en las areas marcadas en rojo.';
    } else if (warnings > 0) {
      healthSummary.className = 'health-summary-warn';
      healthSummary.innerHTML = '<strong>\u{1F7E1} Cuidado:</strong> ' + warnings + ' categoria(s) estan cerca del limite. Vas bien pero ojo con esas areas.';
    } else {
      healthSummary.className = 'health-summary-good';
      healthSummary.innerHTML = '<strong>\u2705 Excelente!</strong> Tus gastos estan dentro de los rangos saludables en todas las categorias.';
    }
  } else {
    healthSection.style.display = 'none';
  }

  // ---- TENDENCIAS VS MES ANTERIOR ----
  var trendsSection = document.getElementById('trendsSection');
  var trendsGrid = document.getElementById('trendsGrid');
  var selectedMonth = document.getElementById('monthFilter').value;

  if (selectedMonth !== 'all') {
    var parts = selectedMonth.split('-');
    var y = parseInt(parts[0]), m = parseInt(parts[1]);
    var prevM = m === 1 ? 12 : m - 1;
    var prevY = m === 1 ? y - 1 : y;
    var prevMonth = prevY + '-' + String(prevM).padStart(2, '0');

    var curCats = {};
    var prevCats = {};
    transactions.forEach(function(t) {
      if (!isRealExpense(t)) return;
      var c = t.category || 'Sin Categorizar';
      if (t.month === selectedMonth) { curCats[c] = (curCats[c] || 0) + t.amount; }
      if (t.month === prevMonth) { prevCats[c] = (prevCats[c] || 0) + t.amount; }
    });

    var allCats = Object.keys(Object.assign({}, curCats, prevCats)).sort(function(a, b) {
      return (curCats[b] || 0) - (curCats[a] || 0);
    });

    if (allCats.length > 0 && Object.keys(prevCats).length > 0) {
      trendsSection.style.display = '';
      var trendsHtml = '';

      allCats.forEach(function(cat) {
        var cur = curCats[cat] || 0;
        var prev = prevCats[cat] || 0;
        if (cur === 0 && prev === 0) return;

        var diff = prev > 0 ? ((cur - prev) / prev * 100) : (cur > 0 ? 100 : 0);
        var arrow, color;
        if (diff < -10) { arrow = '\u2B07\uFE0F'; color = '#10b981'; }
        else if (diff > 10) { arrow = '\u2B06\uFE0F'; color = '#ef4444'; }
        else { arrow = '\u27A1\uFE0F'; color = '#f59e0b'; }

        var diffText = diff > 0 ? '+' + diff.toFixed(0) + '%' : diff.toFixed(0) + '%';
        if (prev === 0) diffText = 'Nuevo';

        trendsHtml += '<div class="trend-item">' +
          '<span class="trend-arrow">' + arrow + '</span>' +
          '<div class="trend-info">' +
            '<div class="trend-cat">' + getCatIcon(cat) + ' ' + cat + '</div>' +
            '<div class="trend-detail">' + fmt(cur) + ' vs ' + fmt(prev) + ' <strong style="color:' + color + '">' + diffText + '</strong></div>' +
          '</div>' +
        '</div>';
      });

      trendsGrid.innerHTML = trendsHtml;
    } else {
      trendsSection.style.display = 'none';
    }
  } else {
    trendsSection.style.display = 'none';
  }

  // ---- PERFIL FINANCIERO ----
  var ufVal = profile.uf || 38800;
  var totalActivosUF = 0;
  var totalDeudasUF = 0;
  properties.forEach(function(p) {
    totalActivosUF += p.currentValue || 0;
    totalDeudasUF += p.debt || 0;
  });
  var totalActivos = totalActivosUF * ufVal;
  var totalDeudas = totalDeudasUF * ufVal;
  var patrimonioNeto = totalActivos - totalDeudas;

  var flujoMensual = totalI - totalG;

  document.getElementById('finPatrimonioValue').textContent = (patrimonioNeto < 0 ? '-' : '') + fmt(Math.abs(patrimonioNeto));
  document.getElementById('finPatrimonioValue').style.color = patrimonioNeto >= 0 ? 'var(--green)' : 'var(--red)';

  document.getElementById('finFlujoValue').textContent = (flujoMensual < 0 ? '-' : '') + fmt(Math.abs(flujoMensual));
  document.getElementById('finFlujoValue').style.color = flujoMensual >= 0 ? 'var(--green)' : 'var(--red)';

  var patBar = document.getElementById('finPatrimonioBar');
  var patRatio = totalActivos > 0 ? Math.min((patrimonioNeto / totalActivos) * 100, 100) : 0;
  if (patRatio < 0) patRatio = 0;
  patBar.style.width = Math.max(patRatio, 5) + '%';
  patBar.style.background = patRatio > 60 ? '#10b981' : patRatio > 30 ? '#f59e0b' : '#ef4444';

  var deudaRatio = totalActivos > 0 ? ((totalDeudas / totalActivos) * 100).toFixed(0) : 0;
  var deudaColor = deudaRatio <= 40 ? '#10b981' : deudaRatio <= 60 ? '#f59e0b' : '#ef4444';
  var deudaLabel = deudaRatio <= 40 ? 'saludable' : deudaRatio <= 60 ? 'moderado' : 'alto';
  document.getElementById('finPatrimonioDetail').innerHTML =
    'Activos: ' + fmt(totalActivos) + (getUnitName() ? ' (' + totalActivosUF.toFixed(0) + ' ' + getUnitName() + ')' : '') + ' | Deudas: ' + fmt(totalDeudas) + (getUnitName() ? ' (' + totalDeudasUF.toFixed(0) + ' ' + getUnitName() + ')' : '') +
    '<br>Ratio deuda/activo: ' + deudaRatio + '% <strong style="color:' + deudaColor + '">(' + deudaLabel + ')</strong>' +
    '<br><span style="font-size:0.7rem;opacity:0.7">Recomendado: menos de 40% ideal, hasta 60% aceptable</span>';

  var flujoBar = document.getElementById('finFlujoBar');
  var savingsRate = totalI > 0 ? (flujoMensual / totalI) * 100 : 0;
  flujoBar.style.width = Math.max(Math.min(Math.abs(savingsRate), 100), 5) + '%';
  flujoBar.style.background = savingsRate >= 20 ? '#10b981' : savingsRate >= 10 ? '#f59e0b' : '#ef4444';

  var ahorroColor = savingsRate >= 20 ? '#10b981' : savingsRate >= 10 ? '#f59e0b' : '#ef4444';
  var ahorroLabel = savingsRate >= 20 ? 'excelente' : savingsRate >= 10 ? 'aceptable' : 'bajo';
  document.getElementById('finFlujoDetail').innerHTML =
    'Ingresos: ' + fmt(totalI) + ' | Gastos: ' + fmt(totalG) +
    '<br>Tasa de ahorro: ' + savingsRate.toFixed(1) + '% <strong style="color:' + ahorroColor + '">(' + ahorroLabel + ')</strong>' +
    '<br><span style="font-size:0.7rem;opacity:0.7">Recomendado: 10% minimo, 20%+ ideal</span>';

  // Diagnostico
  var diagEl = document.getElementById('finDiagnostico');
  var patOk = patrimonioNeto > 0 && (totalDeudas / Math.max(totalActivos, 1)) < 0.6;
  var flujoOk = savingsRate >= 10;

  if (patOk && flujoOk) {
    diagEl.className = 'fin-diagnostico-strong';
    diagEl.innerHTML = '<strong>\u{1F3C6} Perfil solido:</strong> Tienes buen patrimonio y flujo positivo. Estas en una posicion financiera fuerte. Tip: destina parte del excedente a inversiones para hacer crecer tu patrimonio aun mas.';
  } else if (flujoOk && !patOk) {
    diagEl.className = 'fin-diagnostico-flow';
    diagEl.innerHTML = '<strong>\u{1F4B0} Buen flujo, patrimonio por construir:</strong> Ganas bien y ahorras, pero tu patrimonio neto es bajo o tienes mucha deuda. Tip: prioriza pagar deudas y luego invierte el excedente mensual.';
  } else if (patOk && !flujoOk) {
    diagEl.className = 'fin-diagnostico-patrimonio';
    diagEl.innerHTML = '<strong>\u26A0\uFE0F Buen patrimonio, flujo ajustado:</strong> Tienes activos pero estas gastando casi todo lo que ganas (o mas). Tip: revisa tus gastos mensuales, podrías estar consumiendo tus ahorros sin darte cuenta.';
  } else {
    diagEl.className = 'fin-diagnostico-weak';
    diagEl.innerHTML = '<strong>\u{1F6A8} Atencion:</strong> Tu patrimonio y flujo necesitan trabajo. No te desanimes — el primer paso es tener visibilidad (que ya la tienes). Tip: arma un presupuesto, reduce gastos no esenciales y busca aumentar ingresos.';
  }

  renderInsights();
}

window.filterByCat = function(cat) {
  activeCatFilter = activeCatFilter === cat ? 'all' : cat;
  refreshAll();
};

// ---- INSIGHTS / COACH FINANCIERO ----
function generateInsights() {
  var insights = [];

  var totalPropUF = properties.reduce(function(s,p) { return s + p.currentValue; }, 0);
  var totalDebtUF = properties.reduce(function(s,p) { return s + (p.debt||0); }, 0);
  var totalEquityUF = totalPropUF - totalDebtUF;
  var totalEquityCLP = ufToCLP(totalEquityUF);
  var totalLiquidez = getTotalAccounts();
  var totalAhorro = Math.max(0, getTotalSavings());
  var patrimonio = totalEquityCLP + totalAhorro + totalLiquidez;
  var gastoMensual = profile.monthlySpend || 0;
  var metaAhorro = profile.savingsGoal || 0;

  var allTx = transactions;
  var now = new Date();
  var curMonth = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0');
  var prevMonth = now.getMonth() === 0
    ? (now.getFullYear()-1) + '-12'
    : now.getFullYear() + '-' + String(now.getMonth()).padStart(2,'0');

  var curGastos = allTx.filter(function(t) { return t.month === curMonth && t.type === 'gasto' && !isExcluded(t.category); })
    .reduce(function(s,t) { return s+t.amount; }, 0);
  var curIngresos = allTx.filter(function(t) { return t.month === curMonth && t.type === 'ingreso' && !isExcluded(t.category); })
    .reduce(function(s,t) { return s+t.amount; }, 0);
  var curAhorro = allTx.filter(function(t) { return t.month === curMonth && t.category === 'Ahorro' && t.type === 'gasto'; })
    .reduce(function(s,t) { return s+t.amount; }, 0);

  var prevGastos = allTx.filter(function(t) { return t.month === prevMonth && t.type === 'gasto' && !isExcluded(t.category); })
    .reduce(function(s,t) { return s+t.amount; }, 0);

  // 1. FONDO DE EMERGENCIA
  var emergencyTarget = gastoMensual * 6;
  if (emergencyTarget > 0 && totalLiquidez < emergencyTarget) {
    var gap = emergencyTarget - totalLiquidez;
    var months = metaAhorro > 0 ? Math.ceil(gap / metaAhorro) : 0;
    insights.push({
      type: 'alert', icon: '🛡️', title: 'Fondo de emergencia insuficiente',
      text: 'Se recomienda tener 6 meses de gastos en liquidez (' + fmt(emergencyTarget) + '). Tienes ' + fmt(totalLiquidez) + ' liquido. Te faltan ' + fmt(gap) + '.' +
        (months > 0 ? ' Si destinas ' + fmt(metaAhorro) + '/mes lo logras en ~' + months + ' meses.' : '')
    });
  } else if (emergencyTarget > 0 && totalLiquidez >= emergencyTarget) {
    insights.push({
      type: 'success', icon: '✅', title: 'Fondo de emergencia cubierto',
      text: 'Tienes ' + fmt(totalLiquidez) + ' en liquidez, que cubre ' + Math.floor(totalLiquidez/gastoMensual) + ' meses de gastos. Bien!'
    });
  }

  // 2. DISTRIBUCION DE ACTIVOS
  if (patrimonio > 0) {
    var pctProp = totalEquityCLP / patrimonio * 100;
    var pctLiq = totalLiquidez / patrimonio * 100;
    if (pctProp > 80 && totalLiquidez > 0) {
      insights.push({
        type: 'warning', icon: '🏠', title: 'Muy concentrado en propiedades',
        text: 'El ' + pctProp.toFixed(0) + '% de tu patrimonio esta en propiedades y solo ' + pctLiq.toFixed(0) + '% en liquidez. Si necesitas plata rapido, no vas a poder vender un depto. Considera diversificar en instrumentos liquidos.'
      });
    }
    if (pctLiq > 70 && properties.length > 0) {
      insights.push({
        type: 'info', icon: '💧', title: 'Mucha liquidez sin invertir',
        text: 'Tienes ' + pctLiq.toFixed(0) + '% en cuentas liquidas. Esta plata pierde valor con la inflacion (~4% anual). Considera mover parte a instrumentos con mejor retorno (fondos mutuos, APV, ETFs).'
      });
    }
    if (totalLiquidez === 0 && accounts.length === 0 && patrimonio > 0) {
      insights.push({
        type: 'info', icon: '💰', title: 'Registra tu liquidez',
        text: 'No tienes cuentas de liquidez registradas. Ve a Patrimonio > Liquidez y Ahorros para agregar tus cuentas corrientes, depositos, fondos, etc. Asi el analisis sera mas completo.'
      });
    }
  }

  // 3. TASA DE AHORRO
  if (curIngresos > 0 && curMonth) {
    var tasaAhorro = curAhorro / curIngresos * 100;
    if (tasaAhorro < 10 && curAhorro > 0) {
      insights.push({
        type: 'warning', icon: '📉', title: 'Tasa de ahorro baja (' + tasaAhorro.toFixed(0) + '%)',
        text: 'Este mes ahorraste ' + fmt(curAhorro) + ' de ' + fmt(curIngresos) + ' de ingresos. Se recomienda ahorrar al menos 20%. Para llegar ahi necesitarias ahorrar ' + fmt(Math.round(curIngresos * 0.2)) + '/mes.'
      });
    } else if (tasaAhorro >= 20) {
      insights.push({
        type: 'success', icon: '🎯', title: 'Excelente tasa de ahorro (' + tasaAhorro.toFixed(0) + '%)',
        text: 'Este mes ahorraste ' + fmt(curAhorro) + ', un ' + tasaAhorro.toFixed(0) + '% de tus ingresos. Sigue asi!'
      });
    }
  }

  // 4. META DE AHORRO vs REALIDAD
  if (metaAhorro > 0 && curAhorro > 0) {
    var pctMeta = curAhorro / metaAhorro * 100;
    if (pctMeta < 80) {
      insights.push({
        type: 'warning', icon: '🎯', title: 'Ahorro por debajo de tu meta',
        text: 'Tu meta es ' + fmt(metaAhorro) + '/mes pero este mes ahorraste ' + fmt(curAhorro) + ' (' + pctMeta.toFixed(0) + '%). Te faltan ' + fmt(metaAhorro - curAhorro) + ' para cumplir.'
      });
    }
  }

  // 5. GASTOS CRECIENDO
  if (prevGastos > 0 && curGastos > 0) {
    var gastoDiff = ((curGastos - prevGastos) / prevGastos * 100);
    if (gastoDiff > 15) {
      insights.push({
        type: 'warning', icon: '📊', title: 'Gastos subieron ' + gastoDiff.toFixed(0) + '% vs mes anterior',
        text: 'Este mes llevas ' + fmt(curGastos) + ' en gastos vs ' + fmt(prevGastos) + ' el mes pasado. Revisa que categorias aumentaron en la seccion de Tendencias arriba.'
      });
    } else if (gastoDiff < -10) {
      insights.push({
        type: 'success', icon: '👏', title: 'Gastos bajaron ' + Math.abs(gastoDiff).toFixed(0) + '% vs mes anterior',
        text: 'Este mes llevas ' + fmt(curGastos) + ' vs ' + fmt(prevGastos) + ' el mes pasado. Buen control!'
      });
    }
  }

  // 6. RATIO DEUDA/PATRIMONIO
  if (totalPropUF > 0) {
    var debtRatio = totalDebtUF / totalPropUF * 100;
    if (debtRatio > 70) {
      insights.push({
        type: 'alert', icon: '⚠️', title: 'Nivel de deuda alto (' + debtRatio.toFixed(0) + '%)',
        text: 'Debes ' + fmtUF(totalDebtUF) + ' sobre propiedades valoradas en ' + fmtUF(totalPropUF) + '. Tu apalancamiento es ' + debtRatio.toFixed(0) + '%. Cuidado con subidas de tasa. Prioriza reducir deuda.'
      });
    }
  }

  // 7. APV
  var tieneAPV = accounts.some(function(a) { return a.type === 'apv'; });
  if (!tieneAPV && curIngresos > 1000000) {
    insights.push({
      type: 'info', icon: '🎁', title: 'No tienes APV registrado',
      text: 'El APV en Regimen A te da un 15% de bonificacion estatal (hasta ~$300K/año gratis). Con tus ingresos podrias beneficiarte. Si ya tienes uno, registralo en Liquidez y Ahorros.'
    });
  }

  // 8. METAS SIN AHORRO
  var metasSinAhorro = goals.filter(function(g) { return g.target > 0 && (!g.monthly || g.monthly <= 0); });
  if (metasSinAhorro.length > 0) {
    insights.push({
      type: 'info', icon: '📌', title: metasSinAhorro.length + ' meta(s) sin ahorro mensual asignado',
      text: 'Las metas "' + metasSinAhorro.map(function(g){return g.name;}).join('", "') + '" no tienen ahorro mensual. Sin plan de ahorro, es dificil cumplirlas. Ve a Metas y asigna un monto mensual.'
    });
  }

  // 9. CAPACIDAD DE AHORRO REAL
  if (curIngresos > 0 && curGastos > 0) {
    var excedente = curIngresos - curGastos;
    if (excedente > 0) {
      var totalMetaMensual = goals.reduce(function(s,g) { return s + (g.monthly||0); }, 0);
      if (totalMetaMensual > excedente) {
        insights.push({
          type: 'warning', icon: '💸', title: 'Tus metas piden mas de lo que te sobra',
          text: 'Tu excedente mensual es ~' + fmt(excedente) + ' pero tus metas requieren ' + fmt(totalMetaMensual) + '/mes. O reduces metas o buscas gastar menos / ganar mas.'
        });
      }
    }
  }

  // 10. TIPS
  if (patrimonio > 0 && insights.length < 3) {
    var tips = [
      { icon: '📚', title: 'Regla del 50/30/20', text: '50% necesidades, 30% gustos, 20% ahorro. Revisa tu distribucion de gastos por categoria para ver si calzas.' },
      { icon: '🧮', title: 'Interes compuesto', text: 'Si inviertes ' + fmt(metaAhorro) + '/mes al ' + profile.returnRate + '% anual, en 10 años tendrias ~' + fmt(Math.round(metaAhorro * 12 * ((Math.pow(1+profile.returnRate/100, 10)-1)/(profile.returnRate/100)))) + '. El tiempo es tu mejor aliado.' },
      { icon: '🏖️', title: 'Numero FIRE', text: 'Para vivir de tus inversiones necesitas 25x tus gastos anuales = ' + fmt(gastoMensual * 12 * 25) + '. Hoy tienes ' + (patrimonio/(gastoMensual*12*25)*100).toFixed(1) + '% de ese objetivo.' }
    ];
    var tip = tips[Math.floor(Math.random() * tips.length)];
    insights.push({ type: 'tip', icon: tip.icon, title: tip.title, text: tip.text });
  }

  return insights;
}

function renderInsights() {
  var section = document.getElementById('insightsSection');
  var list = document.getElementById('insightsList');
  if (!section || !list) return;

  if (transactions.length === 0 && properties.length === 0 && accounts.length === 0) {
    section.style.display = 'none';
    return;
  }

  var insights = generateInsights();
  if (insights.length === 0) {
    section.style.display = 'none';
    return;
  }

  section.style.display = '';
  list.innerHTML = insights.map(function(ins) {
    return '<div class="insight-item insight-' + ins.type + '">' +
      '<span class="insight-item-icon">' + ins.icon + '</span>' +
      '<div class="insight-item-content">' +
        '<div class="insight-item-title">' + ins.title + '</div>' +
        '<div class="insight-item-text">' + ins.text + '</div>' +
      '</div></div>';
  }).join('');
}

// ---- PRESTAMOS — CONCILIACION ----
function renderPrestamos() {
  var container = document.getElementById('prestamosContent');
  if (!container) return;

  var LOAN_CATS = ['Prestamos Cleverty', 'Prestamos Tricapitals'];
  var hasAny = false;

  var html = '<div style="display:flex;flex-direction:column;gap:20px">';

  LOAN_CATS.forEach(function(cat) {
    var txs = transactions.filter(function(t) { return t.category === cat; });
    if (txs.length === 0) return;
    hasAny = true;

    var cobros = txs.filter(function(t) { return t.type === 'gasto'; });
    var pagos = txs.filter(function(t) { return t.type === 'ingreso'; });
    var totalCobros = cobros.reduce(function(s,t) { return s+t.amount; }, 0);
    var totalPagos = pagos.reduce(function(s,t) { return s+t.amount; }, 0);
    var diff = totalCobros - totalPagos;
    var nombre = cat.replace('Prestamos ', '');

    // Monthly breakdown
    var byMonth = {};
    txs.forEach(function(t) {
      if (!byMonth[t.month]) byMonth[t.month] = { cobros: 0, pagos: 0 };
      if (t.type === 'gasto') byMonth[t.month].cobros += t.amount;
      else byMonth[t.month].pagos += t.amount;
    });
    var months = Object.keys(byMonth).sort().reverse();

    html += '<div style="border:1px solid var(--border);border-radius:var(--radius-sm);padding:16px">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">' +
        '<strong style="font-size:1rem">' + getCatIcon(cat) + ' ' + nombre + '</strong>' +
        '<span style="font-size:1.1rem;font-weight:700;color:' + (diff > 0 ? 'var(--red)' : 'var(--green)') + '">' +
          (diff > 0 ? 'Te deben ' + fmt(diff) : diff < 0 ? 'Les debes ' + fmt(Math.abs(diff)) : 'Cuadrado') +
        '</span>' +
      '</div>' +
      '<div style="display:flex;gap:24px;flex-wrap:wrap;margin-bottom:14px">' +
        '<div><span style="font-size:0.7rem;color:var(--text-secondary);text-transform:uppercase;font-weight:600">Banco te cobra</span><br><strong class="amount-negative">' + fmt(totalCobros) + '</strong></div>' +
        '<div><span style="font-size:0.7rem;color:var(--text-secondary);text-transform:uppercase;font-weight:600">' + nombre + ' te paga</span><br><strong class="amount-positive">' + fmt(totalPagos) + '</strong></div>' +
      '</div>';

    // Month by month detail
    html += '<div style="font-size:0.82rem">';
    months.forEach(function(m) {
      var md = byMonth[m];
      var mDiff = md.cobros - md.pagos;
      var parts = m.split('-');
      var monthLabel = MN[parseInt(parts[1])-1] + ' ' + parts[0];
      html += '<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border)">' +
        '<span>' + monthLabel + '</span>' +
        '<span style="display:flex;gap:16px">' +
          (md.cobros > 0 ? '<span class="amount-negative">-' + fmt(md.cobros) + '</span>' : '<span style="color:var(--text-secondary)">-</span>') +
          (md.pagos > 0 ? '<span class="amount-positive">+' + fmt(md.pagos) + '</span>' : '<span style="color:var(--text-secondary)">-</span>') +
          '<span style="font-weight:600;min-width:100px;text-align:right;color:' + (mDiff > 0 ? 'var(--red)' : 'var(--green)') + '">' +
            (mDiff > 0 ? 'Deben ' + fmt(mDiff) : mDiff < 0 ? 'A favor ' + fmt(Math.abs(mDiff)) : 'OK') +
          '</span>' +
        '</span>' +
      '</div>';
    });
    html += '</div></div>';
  });

  html += '</div>';

  if (!hasAny) {
    container.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text-secondary)">' +
      '<p>No hay transacciones categorizadas como "Prestamos Cleverty" o "Prestamos Tricapitals".</p>' +
      '<p style="font-size:0.8rem">Categoriza tus transacciones de prestamos para ver la conciliacion aqui.</p></div>';
  } else {
    container.innerHTML = html;
  }
}
