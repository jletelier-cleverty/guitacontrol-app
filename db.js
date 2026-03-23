/* ============================================
   FINANZAS PANEL - Database Layer (Supabase)
   Replaces localStorage with Supabase tables
   ============================================ */

var sb, currentUser = null;
try {
  sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch(e) {
  console.error('Supabase init error:', e);
}

// ---- AUTH ----
async function checkAuth() {
  if (window.DEMO_MODE) {
    currentUser = { id: 'demo-user-000', email: 'demo@guitacontrol.com', user_metadata: { full_name: 'Usuario Demo' } };
    return currentUser;
  }
  var res = await sb.auth.getSession();
  if (!res.data.session) {
    window.location.href = 'login.html';
    return null;
  }
  currentUser = res.data.session.user;
  return currentUser;
}

async function logout() {
  await sb.auth.signOut();
  window.location.href = 'login.html';
}

// ---- PROFILE ----
async function loadProfile() {
  if (window.DEMO_MODE) return;
  var res = await sb.from('profiles').select('*').eq('id', currentUser.id).single();
  if (res.error) {
    console.error('Error loading profile:', res.error.message);
    return;
  }
  if (res.data) {
    profile = {
      age: res.data.age || 30,
      retireAge: res.data.retire_age || 65,
      monthlySpend: res.data.monthly_spend || 1500000,
      savingsGoal: res.data.savings_goal || 500000,
      returnRate: parseFloat(res.data.return_rate) || 8,
      uf: parseFloat(res.data.uf) || 38800,
      country: res.data.country || 'CL',
      onboardingDone: res.data.onboarding_done || false
    };
  }
}

async function saveProfileDB() {
  var updateData = {
    age: profile.age,
    retire_age: profile.retireAge,
    monthly_spend: profile.monthlySpend,
    savings_goal: profile.savingsGoal,
    return_rate: profile.returnRate,
    uf: profile.uf,
    updated_at: new Date().toISOString()
  };
  var res = await sb.from('profiles').update(updateData).eq('id', currentUser.id);
  if (res.error) {
    console.error('Error saving profile:', res.error.message);
  }
}

// ---- TRANSACTIONS ----
async function loadTransactions() {
  if (window.DEMO_MODE) return;
  var { data } = await sb.from('transactions').select('*').eq('user_id', currentUser.id).order('date', { ascending: false });
  transactions = (data || []).map(function(t) {
    return {
      id: t.id, date: t.date, description: t.description,
      amount: t.amount, type: t.type, source: t.source,
      category: t.category || '', month: t.month,
      batch_id: t.batch_id || null
    };
  });
}

async function saveTransactionsBatch(txList) {
  if (!txList.length) return;
  var rows = txList.map(function(tx) {
    return {
      id: tx.id, user_id: currentUser.id, date: tx.date,
      description: tx.description, amount: tx.amount, type: tx.type,
      source: tx.source, category: tx.category || '', month: tx.month,
      batch_id: tx.batch_id || null
    };
  });
  await sb.from('transactions').upsert(rows, { onConflict: 'id' });
}

async function updateTransaction(tx) {
  await sb.from('transactions').update({
    category: tx.category || '', month: tx.month, amount: tx.amount
  }).eq('id', tx.id);
}

async function deleteAllTransactions() {
  await sb.from('transactions').delete().eq('user_id', currentUser.id);
  transactions = [];
}

async function deleteTransactionDuplicates(keepIds) {
  // Delete transactions not in keepIds
  var allIds = transactions.map(function(t) { return t.id; });
  var removeIds = allIds.filter(function(id) { return keepIds.indexOf(id) === -1; });
  if (removeIds.length > 0) {
    // Delete in batches of 100
    for (var i = 0; i < removeIds.length; i += 100) {
      var batch = removeIds.slice(i, i + 100);
      await sb.from('transactions').delete().in('id', batch);
    }
  }
}

// ---- RULES ----
async function loadRules() {
  if (window.DEMO_MODE) return;
  var { data } = await sb.from('rules').select('*').eq('user_id', currentUser.id).order('created_at');
  if (data && data.length > 0) {
    rules = data.map(function(r) { return { keyword: r.keyword, category: r.category, _id: r.id }; });
    // Auto-add essential banking rules if missing
    await ensureEssentialRules();
  } else {
    // First time — load defaults and save
    rules = getDefaultRules();
    await saveAllRules();
  }
}

var ESSENTIAL_RULES = [
  { keyword: 'abono desde linea de credito', category: 'Transferencias Propias' },
  { keyword: 'cargo pago linea de credito', category: 'Transferencias Propias' },
  { keyword: 'cargo de impuesto por uso linea', category: 'Transferencias Propias' },
  { keyword: 'cargo cuota creditos', category: 'Transferencias Propias' },
  { keyword: 'abono reversa pago', category: 'Transferencias Propias' },
  { keyword: 'pago tc web', category: 'Transferencias Propias' },
  { keyword: 'cargo pago tarjeta de credito', category: 'Transferencias Propias' },
  { keyword: 'abono gastos operacionales', category: 'Transferencias Propias' },
  { keyword: 'cargo comision mantencion', category: 'Transferencias Propias' }
];

async function ensureEssentialRules() {
  var existing = rules.map(function(r) { return r.keyword.toLowerCase(); });
  var toAdd = ESSENTIAL_RULES.filter(function(r) {
    return existing.indexOf(r.keyword) === -1;
  });
  if (toAdd.length === 0) return;
  for (var i = 0; i < toAdd.length; i++) {
    await addRule(toAdd[i].keyword, toAdd[i].category);
  }
  // Re-categorize uncategorized transactions with new rules
  var updated = false;
  transactions.forEach(function(tx) {
    if (!tx.category || tx.category === '') {
      var cat = categorize(tx);
      if (cat) { tx.category = cat; updated = true; }
    }
  });
  if (updated) console.log('Auto-applied essential banking rules');
}

async function saveAllRules() {
  // Delete existing and re-insert
  await sb.from('rules').delete().eq('user_id', currentUser.id);
  if (rules.length === 0) return;
  var rows = rules.map(function(r) {
    return { user_id: currentUser.id, keyword: r.keyword, category: r.category };
  });
  // Insert in batches of 100
  for (var i = 0; i < rows.length; i += 100) {
    await sb.from('rules').insert(rows.slice(i, i + 100));
  }
}

async function addRule(keyword, category) {
  rules.push({ keyword: keyword, category: category });
  await sb.from('rules').insert({ user_id: currentUser.id, keyword: keyword, category: category });
}

async function deleteRuleByIndex(idx) {
  rules.splice(idx, 1);
  await saveAllRules();
}

// ---- PROPERTIES ----
async function loadProperties() {
  if (window.DEMO_MODE) return;
  var { data } = await sb.from('properties').select('*').eq('user_id', currentUser.id);
  properties = (data || []).map(function(p) {
    return {
      id: p.id, name: p.name, type: p.type,
      purchaseValue: parseFloat(p.purchase_value) || 0,
      currentValue: parseFloat(p.current_value) || 0,
      debt: parseFloat(p.debt) || 0,
      dividendo: p.dividendo || 0,
      yearsLeft: p.years_left || 0,
      appreciation: parseFloat(p.appreciation) || 0,
      rent: p.rent || 0
    };
  });
}

async function saveProperty(p) {
  await sb.from('properties').upsert({
    id: p.id, user_id: currentUser.id, name: p.name, type: p.type,
    purchase_value: p.purchaseValue, current_value: p.currentValue,
    debt: p.debt, dividendo: p.dividendo, years_left: p.yearsLeft,
    appreciation: p.appreciation, rent: p.rent
  }, { onConflict: 'id' });
}

async function deleteProperty(id) {
  properties = properties.filter(function(p) { return p.id !== id; });
  await sb.from('properties').delete().eq('id', id);
}

// ---- GOALS ----
async function loadGoals() {
  if (window.DEMO_MODE) return;
  var { data } = await sb.from('goals_v2').select('*').eq('user_id', currentUser.id).order('created_at');
  goals = (data || []).map(function(g) {
    return {
      id: g.id, name: g.name, category: g.category || 'otro',
      target: g.target || 0, rawTarget: g.raw_target || 0,
      tradeIn: g.trade_in || 0, term: g.term || 'mediano',
      date: g.target_date || '', monthly: g.monthly || 0,
      priority: g.priority || 'media', notes: g.notes || '',
      saved: g.saved || 0, createdAt: new Date(g.created_at).getTime()
    };
  });
}

async function saveGoalDB(goal) {
  if (window.DEMO_MODE) return;
  await sb.from('goals_v2').upsert({
    id: goal.id, user_id: currentUser.id, name: goal.name,
    category: goal.category || 'otro', target: goal.target || 0,
    raw_target: goal.rawTarget || 0, trade_in: goal.tradeIn || 0,
    term: goal.term || 'mediano', target_date: goal.date || '',
    monthly: goal.monthly || 0, priority: goal.priority || 'media',
    notes: goal.notes || '', saved: goal.saved || 0
  }, { onConflict: 'id' });
}

async function deleteGoalDB(id) {
  if (window.DEMO_MODE) return;
  await sb.from('goals_v2').delete().eq('id', id);
}

// ---- DEBTS ----
async function loadDebts() {
  if (window.DEMO_MODE) return;
  var { data } = await sb.from('debts').select('*').eq('user_id', currentUser.id).order('created_at');
  debts = (data || []).map(function(d) {
    return {
      id: d.id, name: d.name, type: d.type,
      original_amount: parseFloat(d.original_amount) || 0,
      linked_category: d.linked_category || ''
    };
  });
}

async function saveDebtDB(d) {
  await sb.from('debts').upsert({
    id: d.id, user_id: currentUser.id, name: d.name, type: d.type,
    original_amount: d.original_amount || 0,
    linked_category: d.linked_category || ''
  }, { onConflict: 'id' });
}

async function deleteDebtDB(id) {
  await sb.from('debts').delete().eq('id', id);
}

// ---- ACCOUNTS ----
async function loadAccounts() {
  if (window.DEMO_MODE) return;
  var { data } = await sb.from('accounts').select('*').eq('user_id', currentUser.id);
  accounts = (data || []).map(function(a) {
    return {
      id: a.id, name: a.name, type: a.type,
      balance: a.balance || 0, institution: a.institution || '',
      returnRate: parseFloat(a.return_rate) || 0, notes: a.notes || ''
    };
  });
}

async function saveAccountDB(a) {
  if (window.DEMO_MODE) return;
  await sb.from('accounts').upsert({
    id: a.id, user_id: currentUser.id, name: a.name, type: a.type,
    balance: a.balance || 0, institution: a.institution || '',
    return_rate: a.returnRate || 0, notes: a.notes || ''
  }, { onConflict: 'id' });
}

async function deleteAccountDB(id) {
  if (window.DEMO_MODE) return;
  await sb.from('accounts').delete().eq('id', id);
}

// ---- COMPANIES ----
async function loadCompanies() {
  if (window.DEMO_MODE) return;
  var { data } = await sb.from('companies').select('*').eq('user_id', currentUser.id);
  companies = (data || []).map(function(c) {
    return {
      id: c.id, name: c.name, value: c.value || 0,
      pct: parseFloat(c.pct) || 0, notes: c.notes || ''
    };
  });
}

async function saveCompanyDB(c) {
  if (window.DEMO_MODE) return;
  await sb.from('companies').upsert({
    id: c.id, user_id: currentUser.id, name: c.name,
    value: c.value || 0, pct: c.pct || 0, notes: c.notes || ''
  }, { onConflict: 'id' });
}

async function deleteCompanyDB(id) {
  if (window.DEMO_MODE) return;
  await sb.from('companies').delete().eq('id', id);
}

// ---- BANK FORMATS (auto-learning) ----
async function loadBankFormats() {
  if (window.DEMO_MODE) return [];
  var { data } = await sb.from('bank_formats').select('*').order('times_used', { ascending: false });
  return data || [];
}

async function saveBankFormat(format) {
  if (window.DEMO_MODE) return;
  await sb.from('bank_formats').insert({
    bank_name: format.bank_name,
    fingerprint_keywords: format.fingerprint_keywords,
    column_mapping: format.column_mapping || {},
    date_format: format.date_format || '',
    source_type: format.source_type || 'banco',
    sample_headers: format.sample_headers || [],
    times_used: 1
  });
}

async function incrementBankFormatUsage(id) {
  if (window.DEMO_MODE) return;
  await sb.rpc('increment_bank_format_usage', { format_id: id }).catch(function() {
    // Fallback: just update directly
    sb.from('bank_formats').update({ times_used: sb.raw('times_used + 1'), updated_at: new Date().toISOString() }).eq('id', id);
  });
}

// ---- IMPORT LOGS ----
async function logImport(data) {
  if (window.DEMO_MODE) return;
  await sb.from('import_logs').insert({
    user_id: currentUser.id,
    file_name: data.file_name || '',
    detected_bank: data.detected_bank || '',
    parser_used: data.parser_used || 'rules',
    transactions_found: data.transactions_found || 0,
    success: data.success || false,
    error_message: data.error_message || null,
    text_preview: (data.text_preview || '').substring(0, 500).replace(/\d{5,}/g, '***')
  }).catch(function(e) { console.warn('logImport error:', e); });
}

// ---- AI PARSE (Edge Function) ----
async function callAIParse(text, fileName) {
  var session = await sb.auth.getSession();
  var token = session.data.session ? session.data.session.access_token : '';
  var resp = await fetch(SUPABASE_URL + '/functions/v1/parse-statement', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({ text: text, file_name: fileName })
  });
  if (!resp.ok) {
    var errBody = await resp.text();
    throw new Error('AI parse failed: ' + resp.status + ' ' + errBody);
  }
  return await resp.json();
}

// ---- INVESTOR PROFILE (stored in profiles table) ----
async function saveInvestorProfileDB(profileType, answers) {
  if (window.DEMO_MODE) return;
  await sb.from('profiles').update({
    investor_profile: profileType,
    investor_answers: answers || {}
  }).eq('id', currentUser.id);
}

async function loadInvestorProfileDB() {
  if (window.DEMO_MODE) return null;
  var { data } = await sb.from('profiles').select('investor_profile, investor_answers').eq('id', currentUser.id).single();
  if (data && data.investor_profile) {
    return { profile: data.investor_profile, answers: data.investor_answers || {} };
  }
  return null;
}

// ---- ONBOARDING (stored in profiles table) ----
async function saveOnboardingDB(objectives) {
  if (window.DEMO_MODE) return;
  await sb.from('profiles').update({
    onboarding_done: true,
    user_objectives: objectives || []
  }).eq('id', currentUser.id);
}

async function loadOnboardingDB() {
  if (window.DEMO_MODE) return null;
  var { data } = await sb.from('profiles').select('onboarding_done, user_objectives').eq('id', currentUser.id).single();
  return data;
}

// ---- INIT ----
async function initApp() {
  var user = await checkAuth();
  if (!user) return;

  // Show user email in sidebar
  var logoEl = document.querySelector('.sidebar-logo');
  if (logoEl) logoEl.innerHTML = '<img src="logo.png" alt="GuitaControl">';
  var emailEl = document.getElementById('sidebarEmail');
  if (emailEl) emailEl.textContent = currentUser.email;

  // Load all data
  await Promise.all([loadProfile(), loadTransactions(), loadRules(), loadProperties(), loadAccounts(), loadCompanies(), loadGoals(), loadDebts()]);

  // Demo mode: load fake data
  if (window.DEMO_MODE && typeof loadDemoData === 'function') {
    loadDemoData();
  }

  // Check if new user needs onboarding
  if (typeof checkOnboarding === 'function' && checkOnboarding()) return;

  // Render
  refreshAll();

  // Choose initial view based on user state
  if (transactions.length === 0) {
    switchView('importar');
  } else {
    switchView('dashboard');
  }

  // Demo mode: inject banner and CTAs after render
  if (window.DEMO_MODE && typeof injectDemoUI === 'function') {
    injectDemoUI();
  }
}
