/* ============================================
   GOALS — Metas financieras
   ============================================ */

function saveGoalsLocal() { localStorage.setItem(GOALS_LOCAL_KEY, JSON.stringify(goals)); }

var GOAL_CATEGORY_CONFIG = {
  emergencia: { icon:'🛡️', label:'Fondo de emergencia', hint:'Se recomienda tener 3-6 meses de gastos. Si gastas $1.5M/mes, apunta a $4.5M-$9M.' },
  viaje: { icon:'✈️', label:'Viaje', hint:'Incluye pasajes, alojamiento, comida y actividades. Un viaje a Europa puede costar $3M-$6M por persona.' },
  auto: { icon:'🚗', label:'Auto', hint:'Considera el pie (20-30%), seguro, patente y mantencion. Un auto nuevo parte en $8M-$15M.' },
  casa: { icon:'🏠', label:'Pie de casa', hint:'El pie de una propiedad es 10-20% del valor. Para un depto de 3.000 UF necesitas 300-600 UF de pie.' },
  educacion: { icon:'🎓', label:'Educacion', hint:'Un magister en Chile cuesta $5M-$15M. En el extranjero puede superar los $30M.' },
  negocio: { icon:'💼', label:'Negocio', hint:'El capital inicial depende del rubro. Define tu MVP y calcula costos de los primeros 6 meses.' },
  retiro: { icon:'🏖️', label:'Retiro', hint:'Regla del 4%: necesitas 25 veces tus gastos anuales. Si gastas $1.5M/mes = $450M.' },
  otro: { icon:'📌', label:'Otro', hint:'Define un monto claro y una fecha objetivo para mantener el foco.' }
};

var TRADEIN_CONFIG = {
  auto: { show: true, hint: 'Si tienes auto, ponlo en parte de pago. Ej: tu auto actual vale $4M → solo necesitas juntar la diferencia.', label: 'Valor de tu auto actual' },
  casa: { show: true, hint: 'Si vendes una propiedad para comprar otra, pon el valor neto (valor - deuda hipotecaria).', label: 'Valor neto propiedad actual' }
};

window.updateGoalForm = function() {
  var cat = document.getElementById('goalCategory').value;
  var cfg = GOAL_CATEGORY_CONFIG[cat] || GOAL_CATEGORY_CONFIG.otro;
  document.getElementById('goalCategoryHint').textContent = cfg.hint;

  var tiSection = document.getElementById('goalTradeInSection');
  var tiCfg = TRADEIN_CONFIG[cat];
  if (tiCfg && tiCfg.show) {
    tiSection.style.display = '';
    document.getElementById('goalTradeInHint').textContent = tiCfg.hint;
    document.getElementById('goalTradeIn').placeholder = tiCfg.label;
  } else {
    tiSection.style.display = 'none';
    document.getElementById('goalTradeIn').value = '';
    document.getElementById('goalNetTarget').style.display = 'none';
  }
};

document.getElementById('goalTradeIn').addEventListener('input', updateNetTarget);
document.getElementById('goalTarget').addEventListener('input', updateNetTarget);

function updateNetTarget() {
  var target = parseInt(document.getElementById('goalTarget').value) || 0;
  var tradeIn = parseInt(document.getElementById('goalTradeIn').value) || 0;
  var netEl = document.getElementById('goalNetTarget');
  if (tradeIn > 0 && target > 0) {
    var net = Math.max(0, target - tradeIn);
    netEl.textContent = 'Necesitas juntar: ' + fmt(net) + ' (objetivo ' + fmt(target) + ' - parte de pago ' + fmt(tradeIn) + ')';
    netEl.style.display = '';
  } else {
    netEl.style.display = 'none';
  }
}

window.filterGoals = function(filter) {
  currentGoalFilter = filter;
  document.querySelectorAll('.goals-tab').forEach(function(t) { t.classList.toggle('active', t.dataset.filter === filter); });
  renderMetas();
};

function getFilteredGoals() { return currentGoalFilter === 'all' ? goals : goals.filter(function(g) { return g.term === currentGoalFilter; }); }

function getGoalProgress(g) {
  var fromTx = transactions.filter(function(t) { return t.goalId === g.id && t.category === 'Ahorro'; })
    .reduce(function(s, t) { return s + (t.type === 'gasto' ? t.amount : -t.amount); }, 0);
  return fromTx > 0 ? fromTx : (g.saved || 0);
}

function getMonthsRemaining(g) { if (!g.date) return null; var t = new Date(g.date), n = new Date(); return Math.max(0, (t.getFullYear()-n.getFullYear())*12 + t.getMonth()-n.getMonth()); }

function getGoalProjection(g) {
  var rem = g.target - getGoalProgress(g);
  if (rem <= 0) return { onTrack:true, monthsNeeded:0 };
  if (!g.monthly || g.monthly <= 0) return { onTrack:false, monthsNeeded:Infinity };
  var mn = Math.ceil(rem/g.monthly), ml = getMonthsRemaining(g);
  return { onTrack: ml===null || mn<=ml, monthsNeeded:mn };
}

window.editGoal = function(id) {
  var g = goals.find(function(x) { return x.id === id; }); if (!g) return;
  editingGoalId = id;
  document.getElementById('goalModalTitle').textContent = 'Editar Meta';
  document.getElementById('goalCategory').value = g.category || 'otro'; updateGoalForm();
  document.getElementById('goalName').value = g.name || '';
  document.getElementById('goalTarget').value = g.target || '';
  document.getElementById('goalTradeIn').value = g.tradeIn || '';
  updateNetTarget();
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
  document.getElementById('goalCategory').value = 'emergencia'; updateGoalForm();
  document.getElementById('goalName').value = ''; document.getElementById('goalTarget').value = '';
  document.getElementById('goalTradeIn').value = ''; document.getElementById('goalNetTarget').style.display = 'none';
  document.getElementById('goalTerm').value = 'corto'; document.getElementById('goalDate').value = '';
  document.getElementById('goalMonthly').value = ''; document.getElementById('goalPriority').value = 'media';
  document.getElementById('goalNotes').value = '';
  document.getElementById('goalModalDelete').style.display = 'none';
  document.getElementById('goalModal').classList.add('open');
});

document.getElementById('goalModalCancel').addEventListener('click', function() { document.getElementById('goalModal').classList.remove('open'); });

document.getElementById('goalModalDelete').addEventListener('click', function() {
  if (editingGoalId && confirm('Eliminar esta meta?')) {
    goals = goals.filter(function(g) { return g.id !== editingGoalId; });
    saveGoalsLocal(); document.getElementById('goalModal').classList.remove('open'); renderMetas();
  }
});

document.getElementById('goalModalSave').addEventListener('click', function() {
  var name = document.getElementById('goalName').value.trim(); if (!name) return;
  var tradeIn = parseInt(document.getElementById('goalTradeIn').value) || 0;
  var rawTarget = parseInt(document.getElementById('goalTarget').value) || 0;
  var effectiveTarget = tradeIn > 0 ? Math.max(0, rawTarget - tradeIn) : rawTarget;
  var data = { id: editingGoalId || gid(), name:name, category:document.getElementById('goalCategory').value, target:effectiveTarget, rawTarget:rawTarget, tradeIn:tradeIn, term:document.getElementById('goalTerm').value, date:document.getElementById('goalDate').value, monthly:parseInt(document.getElementById('goalMonthly').value)||0, priority:document.getElementById('goalPriority').value, notes:document.getElementById('goalNotes').value.trim(), saved:0, createdAt:Date.now() };
  if (editingGoalId) { var idx = goals.findIndex(function(g) { return g.id === editingGoalId; }); if (idx >= 0) { data.saved = goals[idx].saved || 0; data.createdAt = goals[idx].createdAt || Date.now(); goals[idx] = data; } } else { goals.push(data); }
  saveGoalsLocal(); document.getElementById('goalModal').classList.remove('open'); renderMetas();
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
  var listEl = document.getElementById('goalsList'), emptyEl = document.getElementById('goalsEmpty');
  var totalTarget = goals.reduce(function(s,g){return s+(g.target||0);},0);
  var totalMonthly = goals.reduce(function(s,g){return s+(g.monthly||0);},0);

  var totalSaved = goals.reduce(function(s,g){return s+getGoalProgress(g);},0);
  var summaryEl = document.getElementById('goalsSummary');
  if (goals.length > 0) {
    summaryEl.innerHTML = '<div class="goals-summary-card"><div class="gs-value">' + goals.length + '</div><div class="gs-label">Metas activas</div></div>' +
      '<div class="goals-summary-card"><div class="gs-value">' + fmt(totalSaved) + '</div><div class="gs-label">Ahorrado total</div></div>' +
      '<div class="goals-summary-card"><div class="gs-value">' + fmt(totalMonthly) + '</div><div class="gs-label">Ahorro mensual asignado</div></div>' +
      '<div class="goals-summary-card"><div class="gs-value">' + fmt(totalTarget) + '</div><div class="gs-label">Objetivo total</div></div>';
  } else { summaryEl.innerHTML = ''; }

  if (filtered.length === 0) {
    listEl.innerHTML = '';
    emptyEl.style.display = '';
    emptyEl.innerHTML = '<div class="empty-state-enhanced"><div class="empty-icon">🎯</div><div class="empty-msg">Define tus objetivos financieros y trackea tu progreso real.<br>Cada meta se vincula con tus transacciones de ahorro.</div><button class="btn btn-primary" onclick="document.getElementById(\'addGoalBtn\').click()">Crear primera meta →</button></div>';
  } else {
    emptyEl.style.display = 'none';
    listEl.innerHTML = filtered.map(function(g) {
      var cfg = GOAL_CATEGORY_CONFIG[g.category] || GOAL_CATEGORY_CONFIG.otro;
      var saved = getGoalProgress(g), pct = g.target > 0 ? Math.min(100,(saved/g.target)*100) : 0;
      var isComplete = pct >= 100, proj = getGoalProjection(g), monthsLeft = getMonthsRemaining(g);
      var termLabel = g.term==='corto'?'Corto':g.term==='mediano'?'Mediano':'Largo';
      var metaLine = termLabel + ' plazo';
      if (g.monthly > 0) metaLine += ' · ' + fmt(g.monthly) + '/mes';
      if (monthsLeft !== null) metaLine += ' · ' + (monthsLeft === 0 ? 'Vence este mes' : monthsLeft + ' meses restantes');
      if (proj.monthsNeeded > 0 && proj.monthsNeeded < Infinity && !isComplete) metaLine += ' · ~' + proj.monthsNeeded + ' meses para lograrlo';
      var statusIcon = isComplete ? '✅' : (!proj.onTrack ? '⚠️' : '');
      return '<div class="goal-card" onclick="editGoal(\'' + g.id + '\')">' +
        '<div class="goal-card-header"><span class="goal-card-icon">' + cfg.icon + '</span>' +
        '<div class="goal-card-info"><div class="goal-card-name"><span class="goal-priority-dot ' + g.priority + '"></span>' + g.name + ' ' + statusIcon + '<span class="goal-term-badge ' + g.term + '">' + termLabel + '</span></div>' +
        '<div class="goal-card-meta">' + metaLine + '</div></div>' +
        '<div class="goal-card-amount">' + fmt(g.target) + (saved > 0 ? '<div class="goal-card-amount-sub">Ahorrado: ' + fmt(saved) + '</div>' : '') + '</div></div>' +
        (g.tradeIn > 0 ? '<div style="font-size:0.75rem;color:var(--primary);padding:4px 0">🔄 Parte de pago: ' + fmt(g.tradeIn) + ' · Valor total: ' + fmt(g.rawTarget || g.target + g.tradeIn) + '</div>' : '') +
        (g.target > 0 ? '<div class="goal-progress-bar"><div class="goal-progress-fill' + (isComplete?' complete':'') + '" style="width:' + pct + '%"></div></div><div class="goal-progress-text"><span><strong>' + pct.toFixed(1) + '%</strong></span><span>' + fmt(saved) + ' / ' + fmt(g.target) + '</span></div>' : '') +
        (g.notes ? '<div style="font-size:0.73rem;color:var(--text-secondary);margin-top:6px;padding-top:6px;border-top:1px solid var(--border);">' + g.notes + '</div>' : '') +
      '</div>';
    }).join('');
  }
  var quoteEl = document.getElementById('metasQuote');
  if (!quoteEl.dataset.set) { quoteEl.textContent = motivationalQuotes[Math.floor(Math.random()*motivationalQuotes.length)]; quoteEl.dataset.set = '1'; }
}
