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
      country: res.data.country || 'CL'
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
      category: t.category || '', month: t.month
    };
  });
}

async function saveTransactionsBatch(txList) {
  if (!txList.length) return;
  var rows = txList.map(function(tx) {
    return {
      id: tx.id, user_id: currentUser.id, date: tx.date,
      description: tx.description, amount: tx.amount, type: tx.type,
      source: tx.source, category: tx.category || '', month: tx.month
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
  } else {
    // First time — load defaults and save
    rules = getDefaultRules();
    await saveAllRules();
  }
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
  var { data } = await sb.from('goals').select('*').eq('user_id', currentUser.id).order('slot');
  goals = [{}, {}, {}];
  if (data) {
    data.forEach(function(g) {
      goals[g.slot] = { title: g.title || '', value: g.value || 0, image: g.image_url || '' };
    });
  }
}

async function saveGoalDB(slot) {
  var g = goals[slot] || {};
  await sb.from('goals').upsert({
    user_id: currentUser.id, slot: slot,
    title: g.title || '', value: g.value || 0,
    image_url: g.image || ''
  }, { onConflict: 'user_id,slot' });
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
  await Promise.all([loadProfile(), loadTransactions(), loadRules(), loadProperties(), loadGoals(), loadDebts()]);

  // Demo mode: load fake data
  if (window.DEMO_MODE && typeof loadDemoData === 'function') {
    loadDemoData();
  }

  // Check if new user needs onboarding
  if (typeof checkOnboarding === 'function' && checkOnboarding()) return;

  // Render
  refreshAll();

  // Demo mode: inject banner and CTAs after render
  if (window.DEMO_MODE && typeof injectDemoUI === 'function') {
    injectDemoUI();
  }
}
