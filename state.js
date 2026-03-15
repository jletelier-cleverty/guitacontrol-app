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
var debts = [];

var ACCOUNTS_KEY = 'finanzas_accounts';
var accounts = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]');

var GOALS_LOCAL_KEY = 'finanzas_goals_v2';
var goals = JSON.parse(localStorage.getItem(GOALS_LOCAL_KEY) || '[]');

var editingTxId = null;
var editingPropId = null;
var editingAccId = null;
var editingGoalId = null;
var currentGoalFilter = 'all';
var splitMode = false;

var catAllOptions = [];
var catHighlightIdx = -1;

// Estrategia quiz state
var tfAnswers = {};
var tfCurrentSlide = 1;
var tfTotalSlides = 8;

// Windfall quiz state
var wfQuizAnswers = {};

// Inversiones state
var invCurrentCat = 'rentaVariable';
var invCurrentPeriod = '1y';
