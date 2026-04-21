/* ============================================
   CATEGORIES — Modal, autocomplete, split, rules CRUD
   ============================================ */

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
  if (query && !catAllOptions.some(function(c) { return c.toLowerCase() === query; })) {
    html += '<div class="autocomplete-item ac-create" data-cat="__new__">+ Crear "' + filter + '"</div>';
  }
  list.innerHTML = html;
  if (filtered.length > 0 || query) list.classList.add('open');
  else list.classList.remove('open');
}

function updateGoalLinkVisibility(cat) {
  var section = document.getElementById('goalLinkSection');
  if (section) section.style.display = (cat === 'Ahorro') ? '' : 'none';
}

document.getElementById('catSearchInput').addEventListener('input', function() {
  updateGoalLinkVisibility(this.value.trim());
});
document.getElementById('catSearchInput').addEventListener('change', function() {
  updateGoalLinkVisibility(this.value.trim());
});

window.openCatModal = function(id) {
  editingTxId = id;
  var tx = transactions.find(function(t) { return t.id === id; });
  if (!tx) return;
  catAllOptions = getCatOptions();

  var input = document.getElementById('catSearchInput');
  input.value = tx.category || '';
  document.getElementById('catSearchList').classList.remove('open');

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

  updateGoalLinkVisibility(tx.category || '');
  var goalSel = document.getElementById('catGoalSelect');
  goalSel.innerHTML = '<option value="">Sin asignar (ahorro general)</option>';
  goals.forEach(function(g) {
    var cfg = GOAL_CATEGORY_CONFIG[g.category] || GOAL_CATEGORY_CONFIG.otro;
    var opt = document.createElement('option');
    opt.value = g.id;
    opt.textContent = cfg.icon + ' ' + g.name + ' (' + fmt(g.target) + ')';
    if (tx.goalId === g.id) opt.selected = true;
    goalSel.appendChild(opt);
  });

  document.getElementById('splitSection').style.display = 'none';
  var splitBtn = document.getElementById('catModalSplit');
  splitBtn.style.display = '';
  splitBtn.textContent = 'Dividir';
  splitBtn.style.background = '#f59e0b';
  document.getElementById('splitAmount1').value = '';
  document.getElementById('splitAmount2').value = '';
  document.getElementById('splitCat1').value = '';
  document.getElementById('splitCat2').value = '';
  splitMode = false;

  document.getElementById('catModal').classList.add('open');
};

document.getElementById('catModalCancel').addEventListener('click', function() {
  document.getElementById('catModal').classList.remove('open');
  document.getElementById('catSearchList').classList.remove('open');
});

// ---- SPLIT TRANSACTION ----
(function() {
  var splitBtn = document.getElementById('catModalSplit');
  if (!splitBtn) return;
  splitBtn.addEventListener('click', function() {
    if (!editingTxId) return;
    var tx = transactions.find(function(t) { return t.id === editingTxId; });
    if (!tx) return;

    if (!splitMode) {
      splitMode = true;
      document.getElementById('splitSection').style.display = '';
      splitBtn.textContent = 'Cancelar Division';
      splitBtn.style.background = '#64748b';
      var cat1 = document.getElementById('catSearchInput').value.trim();
      document.getElementById('splitCat1').value = cat1;
      document.getElementById('splitAmount1').value = Math.round(tx.amount / 2);
      document.getElementById('splitAmount2').value = tx.amount - Math.round(tx.amount / 2);
      document.getElementById('splitCat2').value = '';
      document.getElementById('splitCat2').focus();
    } else {
      splitMode = false;
      document.getElementById('splitSection').style.display = 'none';
      splitBtn.textContent = 'Dividir';
      splitBtn.style.background = '#f59e0b';
    }
  });

  document.getElementById('splitAmount1').addEventListener('input', function() {
    var tx = transactions.find(function(t) { return t.id === editingTxId; });
    if (!tx) return;
    var a1 = parseInt(this.value) || 0;
    document.getElementById('splitAmount2').value = Math.max(0, tx.amount - a1);
  });
})();

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
    updateGoalLinkVisibility(input.value.trim());
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
        updateGoalLinkVisibility(input.value.trim());
      }
    } else if (e.key === 'Escape') {
      list.classList.remove('open');
    }
  });

  document.getElementById('catModal').addEventListener('click', function(e) {
    if (!e.target.closest('.autocomplete-wrap')) {
      list.classList.remove('open');
    }
  });
})();

document.getElementById('catModalSave').addEventListener('click', async function() {
  var cat = document.getElementById('catSearchInput').value.trim();
  if (!editingTxId) return;
  var tx = transactions.find(function(t) { return t.id === editingTxId; });
  if (!tx) return;

  // SPLIT MODE
  if (splitMode) {
    var amount1 = parseInt(document.getElementById('splitAmount1').value) || 0;
    var amount2 = parseInt(document.getElementById('splitAmount2').value) || 0;
    var cat1 = document.getElementById('splitCat1').value.trim();
    var cat2 = document.getElementById('splitCat2').value.trim();
    if (!amount1 || !amount2 || !cat1 || !cat2) { alert('Completa ambas partes para dividir.'); return; }
    if (amount1 + amount2 !== tx.amount) { alert('Los montos deben sumar ' + fmt(tx.amount)); return; }

    tx.amount = amount1;
    tx.category = cat1;
    await updateTransaction(tx);

    var tx2 = {
      id: gid(), date: tx.date, description: tx.description + ' (parte 2)',
      amount: amount2, type: tx.type, source: tx.source, category: cat2, month: tx.month
    };
    transactions.push(tx2);
    await saveTransactionsBatch([tx2]);

    splitMode = false;
    document.getElementById('catModal').classList.remove('open');
    refreshAll();
    return;
  }

  // NORMAL MODE
  if (cat) {
    tx.category = cat;
    if (cat === 'Ahorro') {
      var selectedGoalId = document.getElementById('catGoalSelect').value;
      tx.goalId = selectedGoalId || null;
    } else {
      tx.goalId = null;
    }
    var d = tx.description.toLowerCase();
    if (!rules.find(function(r) { return d.indexOf(r.keyword.toLowerCase()) >= 0; })) {
      var w = tx.description.split(' ').filter(function(w) { return w.length > 2; });
      var kw = w.slice(0, 3).join(' ').toLowerCase();
      if (kw.length > 3) { await addRule(kw, cat); }
    }
  }

  var newMonth = document.getElementById('catMonthSelect').value;
  if (newMonth && newMonth !== tx.month) {
    tx.month = newMonth;
  }

  await updateTransaction(tx);
  document.getElementById('catModal').classList.remove('open');
  refreshAll();
});

// ---- SPLIT CATEGORY AUTOCOMPLETE ----
(function() {
  ['splitCat1', 'splitCat2'].forEach(function(id) {
    var input = document.getElementById(id);
    var list = document.getElementById(id + 'List');
    if (!input || !list) return;

    function renderList(filter) {
      var query = (filter || '').toLowerCase();
      var opts = getCatOptions().filter(function(c) {
        return !query || c.toLowerCase().indexOf(query) >= 0;
      });
      list.innerHTML = opts.map(function(c) {
        return '<div class="autocomplete-item" data-cat="' + c + '"><span class="ac-icon">' + getCatIcon(c) + '</span><span class="ac-name">' + c + '</span></div>';
      }).join('');
      if (opts.length > 0) list.classList.add('open');
      else list.classList.remove('open');
    }

    input.addEventListener('input', function() { renderList(input.value); });
    input.addEventListener('focus', function() { renderList(input.value); });
    list.addEventListener('click', function(e) {
      var item = e.target.closest('.autocomplete-item');
      if (!item) return;
      input.value = item.dataset.cat;
      list.classList.remove('open');
    });
    input.addEventListener('keydown', function(e) {
      var items = list.querySelectorAll('.autocomplete-item');
      var idx = -1;
      items.forEach(function(el, i) { if (el.classList.contains('highlighted')) idx = i; });
      if (e.key === 'ArrowDown') { e.preventDefault(); idx = Math.min(idx + 1, items.length - 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); idx = Math.max(idx - 1, 0); }
      else if (e.key === 'Enter' && idx >= 0) { e.preventDefault(); input.value = items[idx].dataset.cat; list.classList.remove('open'); return; }
      else if (e.key === 'Escape') { list.classList.remove('open'); return; }
      else return;
      items.forEach(function(el, i) { el.classList.toggle('highlighted', i === idx); });
    });
    document.getElementById('catModal').addEventListener('click', function(e) {
      if (!e.target.closest('.autocomplete-wrap')) list.classList.remove('open');
    });
  });
})();

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
  var uncatBanner = document.getElementById('uncatBanner');
  if (uncat.length === 0) {
    if (uncatBanner) uncatBanner.style.display = 'none';
    if (uncatDiv) uncatDiv.innerHTML = '<p style="color:var(--green);font-size:0.88rem;font-weight:500">✅ Todas las transacciones estan categorizadas.</p>';
  } else {
    if (uncatBanner) {
      uncatBanner.style.display = 'flex';
      document.getElementById('uncatBannerCount').textContent = uncat.length;
    }
    if (uncatDiv) uncatDiv.innerHTML = uncat.slice(0, 30).map(function(t) {
      return '<div class="rule-item" style="justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border)">' +
        '<span style="font-size:0.85rem;flex:1">' + t.date + ' &mdash; ' + trunc(t.description, 40) + '</span>' +
        '<span style="font-weight:600;margin:0 12px">' + fmt(t.amount) + '</span>' +
        '<span class="cat-pill uncategorized" onclick="openCatModal(\'' + t.id + '\')" style="cursor:pointer;background:var(--yellow-bg);color:var(--yellow);border:1px solid var(--yellow);font-weight:600">Categorizar</span></div>';
    }).join('') + (uncat.length > 30 ? '<p style="color:var(--text-secondary);font-size:0.82rem;margin-top:12px">... y ' + (uncat.length - 30) + ' mas</p>' : '');
  }
}

window.deleteRule = async function(idx) {
  await deleteRuleByIndex(idx);
  await categorizeAll();
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

document.getElementById('ruleModalSave').addEventListener('click', async function() {
  var kw = document.getElementById('ruleKeyword').value.trim().toLowerCase();
  var cat = document.getElementById('ruleNewCat').value.trim() || document.getElementById('ruleCatSelect').value;
  if (!kw || !cat) return;
  await addRule(kw, cat);
  await categorizeAll();
  document.getElementById('ruleModal').classList.remove('open');
  refreshAll();
});

// ---- CREATE CATEGORY ----
var emojiPicker = document.getElementById('emojiPicker');
var selectedEmoji = '📌';
EMOJI_OPTIONS.forEach(function(em) {
  var btn = document.createElement('div');
  btn.className = 'emoji-option';
  btn.textContent = em;
  btn.addEventListener('click', function() {
    selectedEmoji = em;
    document.getElementById('catCreateIcon').value = em;
    document.getElementById('emojiSelected').textContent = em;
    emojiPicker.querySelectorAll('.emoji-option').forEach(function(b) { b.classList.remove('selected'); });
    btn.classList.add('selected');
  });
  emojiPicker.appendChild(btn);
});

document.getElementById('addCatBtn').addEventListener('click', function() {
  document.getElementById('catCreateName').value = '';
  document.getElementById('catCreateIcon').value = '';
  document.getElementById('emojiSelected').textContent = '📌';
  emojiPicker.querySelectorAll('.emoji-option').forEach(function(b) { b.classList.remove('selected'); });
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

document.getElementById('dedupBtn').addEventListener('click', async function() {
  var removed = await removeDuplicates();
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

document.getElementById('dedupeBtn').addEventListener('click', async function() {
  var removed = await removeDuplicates();
  var info = document.getElementById('storageInfo');
  if (removed > 0) {
    info.textContent = removed + ' duplicados eliminados.';
    info.className = 'import-status success';
    refreshAll();
  } else {
    info.textContent = 'No se encontraron duplicados.';
    info.className = 'import-status success';
  }
});

document.getElementById('clearBtn').addEventListener('click', async function() {
  if (confirm('Borrar todas las transacciones?')) { await deleteAllTransactions(); refreshAll(); }
});

document.getElementById('resetRulesBtn').addEventListener('click', async function() {
  if (confirm('Resetear reglas a las originales? Las transacciones se re-categorizaran.')) {
    rules = getDefaultRules();
    await saveAllRules();
    await categorizeAll();
    refreshAll();
  }
});
