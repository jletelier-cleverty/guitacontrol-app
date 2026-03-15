/* ============================================
   ONBOARDING — Wizard + Checklist
   ============================================ */

function checkOnboarding() {
  if (window.DEMO_MODE) return false;
  if (localStorage.getItem('onboarding_done')) return false;
  if (profile.age === 30 && profile.monthlySpend === 1500000 && transactions.length === 0) {
    showOnboarding();
    return true;
  }
  return false;
}

function showOnboarding() {
  var wizard = document.getElementById('onboardingWizard');
  wizard.style.display = 'flex';
  var meta = currentUser && currentUser.user_metadata;
  if (meta && meta.full_name) {
    document.getElementById('obName').value = meta.full_name;
  }
  document.getElementById('obAge').addEventListener('input', function() {
    document.getElementById('obAgeLabel').textContent = this.value + ' años';
  });
  document.getElementById('obSpend').addEventListener('input', function() {
    var val = parseInt(this.value);
    var isMax = val >= 15000000;
    document.getElementById('obSpendLabel').textContent = isMax ? '$15M+' : '$' + val.toLocaleString('es-CL');
    document.getElementById('obSpendCustom').style.display = isMax ? '' : 'none';
    if (!isMax) document.getElementById('obSpendManual').value = '';
  });
}

function obNext(step) {
  if (step === 2) {
    var name = document.getElementById('obName').value.trim();
    if (!name) { document.getElementById('obName').focus(); return; }
  }
  document.querySelectorAll('.onboarding-dot').forEach(function(dot) {
    var s = parseInt(dot.dataset.step);
    if (s < step) { dot.classList.remove('active'); dot.classList.add('done'); dot.textContent = '✓'; }
    else if (s === step) { dot.classList.add('active'); dot.classList.remove('done'); }
    else { dot.classList.remove('active', 'done'); }
  });
  document.querySelectorAll('.onboarding-step').forEach(function(el) { el.classList.remove('active'); });
  document.getElementById('obStep' + step).classList.add('active');
  if (step === 3) {
    var name = document.getElementById('obName').value.trim();
    var age = document.getElementById('obAge').value;
    var country = document.getElementById('obCountry').selectedOptions[0].textContent;
    var goals = [];
    document.querySelectorAll('.ob-goal-item input:checked').forEach(function(cb) {
      goals.push(cb.parentElement.querySelector('span').textContent.trim());
    });
    document.getElementById('obSummary').innerHTML =
      '<strong>Hola ' + name + '</strong>, ' + age + ' años en ' + country + '.<br>' +
      (goals.length > 0 ? 'Quieres: ' + goals.join(', ') + '.' : 'Sin objetivos seleccionados.') + '<br>' +
      'Gasto mensual: <strong>' + document.getElementById('obSpendLabel').textContent + '</strong>';
  }
}

function obBack(step) {
  obNext(step);
}

async function obFinish() {
  profile.age = parseInt(document.getElementById('obAge').value) || 30;
  var manualSpend = parseInt(document.getElementById('obSpendManual').value);
  profile.monthlySpend = manualSpend > 0 ? manualSpend : (parseInt(document.getElementById('obSpend').value) || 1500000);
  profile.country = document.getElementById('obCountry').value;
  await saveProfileDB();
  localStorage.setItem('onboarding_done', '1');
  var objectives = [];
  document.querySelectorAll('.ob-goal-item input:checked').forEach(function(cb) { objectives.push(cb.value); });
  localStorage.setItem('user_objectives', JSON.stringify(objectives));
  document.getElementById('onboardingWizard').style.display = 'none';
  refreshAll();
}

async function obFinishDemo() {
  await obFinish();
}

function renderChecklist() {
  var card = document.getElementById('checklistCard');
  if (!card || localStorage.getItem('checklist_dismissed')) { if (card) card.style.display = 'none'; return; }

  var items = [
    { text: 'Completar tu perfil', done: profile.age !== 30 || profile.monthlySpend !== 1500000, view: 'ajustes', icon: '👤' },
    { text: 'Importar tu primera cartola', done: transactions.length > 0, view: 'importar', icon: '📄' },
    { text: 'Categorizar tus gastos', done: transactions.length > 0 && transactions.filter(function(t) { return t.type === 'gasto' && !t.category; }).length === 0, view: 'revisar', icon: '🏷️' },
    { text: 'Agregar patrimonio', done: (typeof properties !== 'undefined' && properties.length > 0) || (typeof accounts !== 'undefined' && accounts.length > 0), view: 'patrimonio', icon: '🏠' },
    { text: 'Definir tu primera meta', done: (typeof goals !== 'undefined' && goals.length > 0), view: 'metas', icon: '🎯' }
  ];

  var completed = items.filter(function(i) { return i.done; }).length;

  if (completed === 5) {
    if (!localStorage.getItem('checklist_all_done_date')) {
      localStorage.setItem('checklist_all_done_date', Date.now().toString());
    }
    var doneDate = parseInt(localStorage.getItem('checklist_all_done_date'));
    if (Date.now() - doneDate > 3 * 24 * 60 * 60 * 1000) {
      card.style.display = 'none'; return;
    }
  } else {
    localStorage.removeItem('checklist_all_done_date');
  }

  var pct = (completed / 5) * 100;
  card.style.display = '';
  card.innerHTML = '<h3>🚀 Tu progreso (' + completed + '/5)</h3>' +
    '<div class="checklist-progress"><div class="checklist-progress-fill" style="width:' + pct + '%"></div></div>' +
    items.map(function(item) {
      return '<div class="checklist-item' + (item.done ? ' done' : '') + '">' +
        '<span class="checklist-icon">' + (item.done ? '✅' : item.icon) + '</span>' +
        '<span class="checklist-text">' + item.text + '</span>' +
        (item.done ? '' : '<span class="checklist-go" onclick="switchView(\'' + item.view + '\')">Ir →</span>') +
        '</div>';
    }).join('') +
    (completed === 5 ? '<div style="text-align:center;margin-top:12px"><button class="btn btn-secondary btn-sm" onclick="localStorage.setItem(\'checklist_dismissed\',\'1\');this.closest(\'.checklist-card\').style.display=\'none\'">Ocultar ✓</button></div>' : '');
}
