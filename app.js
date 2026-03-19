/* ============================================
   APP — Orchestrator: refreshAll + init
   ============================================ */

function refreshAll() {
  try { populateMonthFilter(); } catch(e) { console.error('refreshAll > populateMonthFilter:', e); }
  try { renderDashboard(); } catch(e) { console.error('refreshAll > renderDashboard:', e); }
  try { renderTransactions(); } catch(e) { console.error('refreshAll > renderTransactions:', e); }
  try { populateCatFilter(); } catch(e) { console.error('refreshAll > populateCatFilter:', e); }
  try { renderRules(); } catch(e) { console.error('refreshAll > renderRules:', e); }
  try { renderPatrimonio(); } catch(e) { console.error('refreshAll > renderPatrimonio:', e); }
  try { renderAjustes(); } catch(e) { console.error('refreshAll > renderAjustes:', e); }
  try { renderAccounts(); } catch(e) { console.error('refreshAll > renderAccounts:', e); }
  try { renderCompanies(); } catch(e) { console.error('refreshAll > renderCompanies:', e); }
  try { renderChecklist(); } catch(e) { console.error('refreshAll > renderChecklist:', e); }
  try { if (typeof checkSavedInvestorProfile === 'function') checkSavedInvestorProfile(); } catch(e) { console.error('refreshAll > checkSavedInvestorProfile:', e); }
  try { if (typeof renderImportHistory === 'function') renderImportHistory(); } catch(e) { console.error('refreshAll > renderImportHistory:', e); }
}

// Start app — check auth + load from Supabase
// In demo mode, skip initApp entirely — demo loading handled by inline script in index.html
if (!window.DEMO_MODE) {
  initApp();
}
