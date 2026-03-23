/* ============================================
   STATE — Global mutable state
   ============================================ */

var transactions = [];
var rules = [];
var charts = {};
var activeCatFilter = 'all';
var customCats = {};

var profile = {
  age: 30, retireAge: 65, monthlySpend: 1500000, savingsGoal: 500000, returnRate: 8, uf: 38800, country: 'CL'
};
var properties = [];
var accounts = [];
var companies = [];
var goals = [];
var debts = [];

var editingTxId = null;
var editingPropId = null;
var editingAccId = null;
var editingCompanyId = null;
var splitMode = false;

var catAllOptions = [];
var catHighlightIdx = -1;

// Estrategia quiz state
var tfAnswers = {};
var tfCurrentSlide = 1;
var tfTotalSlides = 8;

