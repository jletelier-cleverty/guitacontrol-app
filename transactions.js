/* ============================================
   TRANSACTIONS — Table + Review views
   ============================================ */

function populateCatFilter() {
  var sel = document.getElementById('filterCat');
  var cur = sel.value;
  var cats = [...new Set(transactions.map(function(t) { return t.category || ''; }))].filter(Boolean).sort();
  while (sel.options.length > 2) sel.remove(2);
  cats.forEach(function(c) {
    var o = document.createElement('option');
    o.value = c; o.textContent = getCatIcon(c) + ' ' + c;
    sel.appendChild(o);
  });
  sel.value = cur || 'all';
}

function detectSplitGroups(list) {
  var splitChildren = {};
  var splitGroups = {};
  list.forEach(function(t) {
    var match = t.description.match(/^(.+) \(parte \d+\)$/);
    if (match) {
      var baseDesc = match[1];
      var parent = list.find(function(p) {
        return p.id !== t.id && p.date === t.date && p.description === baseDesc;
      });
      if (parent) {
        splitChildren[t.id] = parent.id;
        if (!splitGroups[parent.id]) splitGroups[parent.id] = [];
        splitGroups[parent.id].push(t);
      }
    }
  });
  return { splitChildren: splitChildren, splitGroups: splitGroups };
}

function renderSplitGroup(parent, children) {
  var allParts = [parent].concat(children);
  var totalAmount = allParts.reduce(function(s, p) { return s + p.amount; }, 0);
  var html = '<tr class="split-parent row-' + parent.type + '">' +
    '<td class="td-date">' + parent.date + '</td>' +
    '<td class="td-desc" title="' + parent.description + '">' + parent.description + ' <span class="split-badge">Dividida en ' + allParts.length + '</span></td>' +
    '<td><span class="source-badge source-' + parent.source + '" onclick="toggleTxSource(\'' + parent.id + '\')" title="Click para cambiar">' + (parent.source==='banco'?'BICE':'CMR') + '</span></td>' +
    '<td class="' + (parent.type==='gasto'?'amount-negative':'amount-positive') + '" style="opacity:0.5">' + (parent.type==='gasto'?'-':'+') + fmt(totalAmount) + '</td>' +
    '<td><button class="btn-tx-delete" onclick="removeTx(\'' + parent.id + '\')" title="Eliminar">&times;</button></td></tr>';
  allParts.forEach(function(p, i) {
    var c = getCatColor(p.category || 'Sin Categorizar');
    var excluded = isExcluded(p.category);
    var isLast = i === allParts.length - 1;
    var cleanDesc = p.description.replace(/ \(parte \d+\)$/, '');
    html += '<tr class="split-child' + (isLast ? ' split-child-last' : '') + ' row-' + p.type + (excluded ? ' row-excluded' : '') + '">' +
      '<td class="td-date"></td>' +
      '<td class="td-desc split-desc">' + (isLast ? '└' : '├') + ' ' + cleanDesc + '</td>' +
      '<td></td>' +
      '<td class="' + (p.type==='gasto'?'amount-negative':'amount-positive') + '">' + (p.type==='gasto'?'-':'+') + fmt(p.amount) + '</td>' +
      '<td><span class="cat-pill" style="background:' + c + '15;color:' + c + ';border:1px solid ' + c + '30" onclick="openCatModal(\'' + p.id + '\')">' + getCatIcon(p.category||'Sin Categorizar') + ' ' + (p.category||'Categorizar') + '</span></td></tr>';
  });
  return html;
}

function renderTransactions() {
  populateCatFilter();
  var filtered = getFilteredAll();
  var search = document.getElementById('searchTx').value.toLowerCase();
  var source = document.getElementById('filterSource').value;
  var type = document.getElementById('filterType').value;
  var catFilter = document.getElementById('filterCat').value;

  var list = filtered;
  if (search) list = list.filter(function(t) { return t.description.toLowerCase().indexOf(search) >= 0; });
  if (source !== 'all') list = list.filter(function(t) { return t.source === source; });
  if (type !== 'all') list = list.filter(function(t) { return t.type === type; });
  if (catFilter === 'uncategorized') list = list.filter(function(t) { return !t.category; });
  else if (catFilter !== 'all') list = list.filter(function(t) { return t.category === catFilter; });
  list.sort(function(a,b) { return b.date.localeCompare(a.date); });

  var splits = detectSplitGroups(list);
  var rendered = {};

  document.getElementById('txBody').innerHTML = list.map(function(t) {
    if (rendered[t.id]) return '';

    // Split parent — render group
    if (splits.splitGroups[t.id]) {
      rendered[t.id] = true;
      splits.splitGroups[t.id].forEach(function(ch) { rendered[ch.id] = true; });
      return renderSplitGroup(t, splits.splitGroups[t.id]);
    }

    // Split child already rendered with parent
    if (splits.splitChildren[t.id]) return '';

    // Normal row
    var c = getCatColor(t.category||'Sin Categorizar');
    var excluded = isExcluded(t.category);
    return '<tr class="row-' + t.type + (excluded ? ' row-excluded' : '') + '">' +
      '<td class="td-date">' + t.date + '</td>' +
      '<td class="td-desc" title="' + t.description + '">' + t.description + '</td>' +
      '<td><span class="source-badge source-' + t.source + '" onclick="toggleTxSource(\'' + t.id + '\')" title="Click para cambiar">' + (t.source==='banco'?'BICE':'CMR') + '</span></td>' +
      '<td class="' + (t.type==='gasto'?'amount-negative':'amount-positive') + '">' + (t.type==='gasto'?'-':'+') + fmt(t.amount) + '</td>' +
      '<td class="td-actions"><span class="cat-pill" style="background:' + c + '15;color:' + c + ';border:1px solid ' + c + '30" onclick="openCatModal(\'' + t.id + '\')">' + getCatIcon(t.category||'Sin Categorizar') + ' ' + (t.category||'Categorizar') + '</span>' +
      '<button class="btn-tx-delete" onclick="removeTx(\'' + t.id + '\')" title="Eliminar transaccion">&times;</button></td></tr>';
  }).join('');
}

// ---- REVISAR (legacy, kept for compatibility) ----
function renderRevisar() {
  var container = document.getElementById('revisarList');
  if (!container) return;
  var cats = {};
  transactions.filter(isVisible).forEach(function(t) {
    var c = t.category || 'Sin Categorizar';
    if (!cats[c]) cats[c] = [];
    cats[c].push(t);
  });

  var sortedCats = Object.entries(cats).sort(function(a,b) { return b[1].length - a[1].length; });

  container.innerHTML = sortedCats.map(function(entry) {
    var cat = entry[0], txs = entry[1];
    return '<div class="review-group">' +
      '<div class="review-group-header" style="border-left-color:' + getCatColor(cat) + '" onclick="this.parentElement.classList.toggle(\'expanded\')">' +
      '<span class="review-group-icon">' + getCatIcon(cat) + '</span>' +
      '<span class="review-group-name">' + cat + '</span>' +
      '<span class="review-group-count">' + txs.length + ' transacciones</span>' +
      '<span class="review-group-total">' + fmt(txs.reduce(function(s,t){return s+t.amount;},0)) + '</span>' +
      '<span class="review-group-arrow">&#9662;</span></div>' +
      '<div class="review-group-body">' +
      txs.sort(function(a,b){return b.date.localeCompare(a.date);}).slice(0, 30).map(function(t) {
        return '<div class="review-item">' +
          '<span class="review-date">' + t.date + '</span>' +
          '<span class="review-desc">' + t.description + '</span>' +
          '<span class="review-amount ' + (t.type==='gasto'?'amount-negative':'amount-positive') + '">' + (t.type==='gasto'?'-':'') + fmt(t.amount) + '</span>' +
          '<button class="btn-edit-cat" onclick="openCatModal(\'' + t.id + '\')">Editar</button></div>';
      }).join('') + '</div></div>';
  }).join('');
}

// ---- EDIT / DELETE INDIVIDUAL TRANSACTIONS ----
async function toggleTxSource(id) {
  var tx = transactions.find(function(t) { return t.id === id; });
  if (!tx) return;
  tx.source = tx.source === 'banco' ? 'tc' : 'banco';
  await updateTransaction(tx);
  refreshAll();
}

async function removeTx(id) {
  if (!confirm('Eliminar esta transaccion?')) return;
  await deleteTransaction(id);
  refreshAll();
}

// ---- EVENT LISTENERS ----
document.getElementById('searchTx').addEventListener('input', renderTransactions);
document.getElementById('filterSource').addEventListener('change', renderTransactions);
document.getElementById('filterType').addEventListener('change', renderTransactions);
document.getElementById('filterCat').addEventListener('change', renderTransactions);
