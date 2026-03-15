/* ============================================
   DEMO MODE - Datos ficticios para preview
   Se carga siempre pero solo actúa si DEMO_MODE=true
   ============================================ */

var loadDemoData, injectDemoUI;

if (!window.DEMO_MODE) {
  loadDemoData = function() {};
  injectDemoUI = function() {};
} else {

  loadDemoData = function() {
    function did() { return 'demo-' + Math.random().toString(36).substr(2, 9); }
    function rnd(a, b) { return Math.round(a + Math.random() * (b - a)); }

    var tx = [];
    var meses = ['2025-04', '2025-05', '2025-06', '2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12', '2026-01', '2026-02', '2026-03'];

    var rec = [
      { d: 'Sueldo Empresa Comercial Ltda', a: 2500000, t: 'ingreso', c: 'Sueldo', dy: 1 },
      { d: 'Arriendo depto Las Condes', a: 450000, t: 'ingreso', c: 'Arriendos / Inversiones', dy: 5 },
      { d: 'Hipotecaria Evoluciona - dividendo', a: 420000, t: 'gasto', c: 'Dividendo / Vivienda', dy: 1 },
      { d: 'Netflix.com', a: 12990, t: 'gasto', c: 'Suscripciones', dy: 3 },
      { d: 'Spotify Premium', a: 5990, t: 'gasto', c: 'Suscripciones', dy: 3 },
      { d: 'Apple iCloud 200GB', a: 4490, t: 'gasto', c: 'Suscripciones', dy: 4 },
      { d: 'Enel Distribucion energia', a: 38500, t: 'gasto', c: 'Servicios Basicos', dy: 10 },
      { d: 'Aguas Andinas', a: 22000, t: 'gasto', c: 'Servicios Basicos', dy: 12 },
      { d: 'Movistar fibra + movil', a: 42990, t: 'gasto', c: 'Servicios Basicos', dy: 15 },
      { d: 'Metlife seguro de vida', a: 52000, t: 'gasto', c: 'Seguros', dy: 5 },
      { d: 'Transferencia Fondo Mutuo Security', a: 400000, t: 'gasto', c: 'Ahorro / Inversion', dy: 2 },
      { d: 'Isapre Cruz Blanca plan', a: 95000, t: 'gasto', c: 'Salud', dy: 1 },
    ];

    var vari = [
      { d: 'Jumbo Alto Las Condes', c: 'Supermercado', mn: 55000, mx: 165000 },
      { d: 'Lider App despacho', c: 'Supermercado', mn: 35000, mx: 95000 },
      { d: 'Tottus La Dehesa', c: 'Supermercado', mn: 40000, mx: 120000 },
      { d: 'Copec Vitacura', c: 'Bencina / Auto', mn: 35000, mx: 55000 },
      { d: 'Shell Lo Barnechea', c: 'Bencina / Auto', mn: 30000, mx: 50000 },
      { d: 'Tag autopista peaje', c: 'Bencina / Auto', mn: 12000, mx: 25000 },
      { d: 'Uber Eats pedido', c: 'Delivery', mn: 12000, mx: 28000 },
      { d: 'Rappi restaurante', c: 'Delivery', mn: 10000, mx: 25000 },
      { d: 'PedidosYa comida', c: 'Delivery', mn: 8000, mx: 22000 },
      { d: 'Uber viaje Santiago', c: 'Transporte', mn: 3500, mx: 12000 },
      { d: 'Cafe Wonderland Providencia', c: 'Restaurantes / Comida', mn: 8000, mx: 18000 },
      { d: 'La Piccola Italia resto', c: 'Restaurantes / Comida', mn: 25000, mx: 55000 },
      { d: 'Starbucks Costanera', c: 'Restaurantes / Comida', mn: 5500, mx: 9500 },
      { d: 'Clinica Alemana copago', c: 'Salud', mn: 15000, mx: 65000 },
      { d: 'Salcobrand farmacia', c: 'Salud', mn: 8000, mx: 35000 },
      { d: 'Mercado Libre compra', c: 'Compras Online', mn: 15000, mx: 85000 },
      { d: 'Falabella.com', c: 'Compras Online', mn: 20000, mx: 120000 },
      { d: 'Club deportivo mensual', c: 'Entretenimiento', mn: 35000, mx: 45000 },
      { d: 'Cine Hoyts entradas', c: 'Entretenimiento', mn: 12000, mx: 24000 },
    ];

    meses.forEach(function(mes) {
      var yy = parseInt(mes.split('-')[0]);
      var mm = parseInt(mes.split('-')[1]);
      var dim = new Date(yy, mm, 0).getDate();

      rec.forEach(function(r) {
        tx.push({
          id: did(), date: mes + '-' + String(Math.min(r.dy, dim)).padStart(2, '0'),
          description: r.d, amount: r.a, type: r.t,
          source: 'banco', category: r.c, month: mes
        });
      });

      var sh = vari.slice().sort(function() { return Math.random() - 0.5; });
      var cnt = rnd(12, 16);
      for (var i = 0; i < cnt && i < sh.length; i++) {
        tx.push({
          id: did(), date: mes + '-' + String(rnd(1, dim)).padStart(2, '0'),
          description: sh[i].d, amount: rnd(sh[i].mn, sh[i].mx), type: 'gasto',
          source: 'banco', category: sh[i].c, month: mes
        });
      }

      if (mm === 1) {
        tx.push({ id: did(), date: mes + '-15', description: 'Homecenter Sodimac', amount: 89000, type: 'gasto', source: 'banco', category: 'Compras Online', month: mes });
        tx.push({ id: did(), date: mes + '-20', description: 'Farmacia Ahumada', amount: 18500, type: 'gasto', source: 'banco', category: 'Salud', month: mes });
      }
      if (mm === 2) {
        tx.push({ id: did(), date: mes + '-14', description: 'Flores dia de San Valentin', amount: 32000, type: 'gasto', source: 'banco', category: 'Otros', month: mes });
      }
      if (mm === 3) {
        tx.push({ id: did(), date: mes + '-18', description: 'Easy.cl herramientas', amount: 45000, type: 'gasto', source: 'banco', category: 'Compras Online', month: mes });
      }
      if (mm === 5) {
        tx.push({ id: did(), date: mes + '-10', description: 'Dia de la madre regalo', amount: 65000, type: 'gasto', source: 'banco', category: 'Otros', month: mes });
      }
      if (mm === 6) {
        tx.push({ id: did(), date: mes + '-21', description: 'Aguinaldo Fiestas Patrias', amount: 180000, type: 'ingreso', source: 'banco', category: 'Sueldo', month: mes });
      }
      if (mm === 7) {
        tx.push({ id: did(), date: mes + '-12', description: 'Vacaciones sur de Chile', amount: 320000, type: 'gasto', source: 'banco', category: 'Entretenimiento', month: mes });
      }
      if (mm === 9) {
        tx.push({ id: did(), date: mes + '-18', description: 'Fiestas Patrias asado', amount: 95000, type: 'gasto', source: 'banco', category: 'Restaurantes / Comida', month: mes });
        tx.push({ id: did(), date: mes + '-19', description: 'Fonda entrada + consumo', amount: 45000, type: 'gasto', source: 'banco', category: 'Entretenimiento', month: mes });
      }
      if (mm === 11) {
        tx.push({ id: did(), date: mes + '-25', description: 'Black Friday Falabella.com', amount: 189000, type: 'gasto', source: 'banco', category: 'Compras Online', month: mes });
      }
      if (mm === 12) {
        tx.push({ id: did(), date: mes + '-15', description: 'Aguinaldo Navidad', amount: 250000, type: 'ingreso', source: 'banco', category: 'Sueldo', month: mes });
        tx.push({ id: did(), date: mes + '-23', description: 'Regalos Navidad', amount: 210000, type: 'gasto', source: 'banco', category: 'Otros', month: mes });
        tx.push({ id: did(), date: mes + '-31', description: 'Cena Año Nuevo restaurante', amount: 85000, type: 'gasto', source: 'banco', category: 'Restaurantes / Comida', month: mes });
      }
    });

    tx.sort(function(a, b) { return b.date.localeCompare(a.date); });

    // SET GLOBALS
    transactions = tx;
    profile = { age: 33, retireAge: 60, monthlySpend: 1800000, savingsGoal: 500000, returnRate: 8, uf: 38856, country: 'CL' };
    properties = [
      { id: did(), name: 'Depto Las Condes (vivienda)', type: 'departamento', purchaseValue: 4500, currentValue: 5200, debt: 2800, dividendo: 420000, yearsLeft: 15, appreciation: 4.5, rent: 0 },
      { id: did(), name: 'Depto inversión Ñuñoa', type: 'departamento', purchaseValue: 3200, currentValue: 3800, debt: 2400, dividendo: 310000, yearsLeft: 23, appreciation: 5, rent: 450000 }
    ];
    goals = [
      { id: did(), name: 'Fondo de emergencia 6 meses', target: 4200000, category: 'emergencia', priority: 'alta', term: 'corto', image: '', saved: 1500000, tradeIn: 0, rawTarget: 4200000 },
      { id: did(), name: 'Vacaciones Europa 2027', target: 1800000, category: 'viaje', priority: 'media', term: 'mediano', image: '', saved: 400000, tradeIn: 0, rawTarget: 1800000 },
      { id: did(), name: 'Pie tercer depto inversión', target: 8000000, category: 'inversion', priority: 'alta', term: 'largo', image: '', saved: 2000000, tradeIn: 0, rawTarget: 8000000 }
    ];
    rules = [
      { keyword: 'jumbo', category: 'Supermercado' }, { keyword: 'lider', category: 'Supermercado' },
      { keyword: 'tottus', category: 'Supermercado' }, { keyword: 'copec', category: 'Bencina / Auto' },
      { keyword: 'shell', category: 'Bencina / Auto' }, { keyword: 'netflix', category: 'Suscripciones' },
      { keyword: 'spotify', category: 'Suscripciones' }, { keyword: 'uber eats', category: 'Delivery' },
      { keyword: 'rappi', category: 'Delivery' }, { keyword: 'enel', category: 'Servicios Basicos' },
      { keyword: 'movistar', category: 'Servicios Basicos' }, { keyword: 'hipotecaria', category: 'Dividendo / Vivienda' },
      { keyword: 'metlife', category: 'Seguros' }, { keyword: 'clinica', category: 'Salud' },
      { keyword: 'fondo mutuo', category: 'Ahorro / Inversion' }, { keyword: 'mercado libre', category: 'Compras Online' },
      { keyword: 'falabella', category: 'Compras Online' },
    ];
    accounts = [
      { id: did(), name: 'Cuenta corriente BICE', type: 'corriente', balance: 1850000 },
      { id: did(), name: 'DAP Banco Chile 360d', type: 'dap', balance: 5000000 },
      { id: did(), name: 'Fintual Risky Norris', type: 'etf', balance: 3200000 },
      { id: did(), name: 'Cuenta 2 AFP Habitat', type: 'apv', balance: 2800000 }
    ];
    debts = [
      { id: did(), name: 'Crédito hipotecario depto Las Condes', type: 'hipotecario', original_amount: 108864000, linked_category: 'Dividendo / Vivienda' },
      { id: did(), name: 'Crédito hipotecario depto Ñuñoa', type: 'hipotecario', original_amount: 93254400, linked_category: 'Dividendo / Inversion' },
    ];

    // BLOCK WRITES
    var _block = function(a) {
      if (typeof showToast === 'function') showToast('Para ' + a + ', crea tu cuenta gratis', 'warning');
    };

    saveProfileDB = function() { _block('guardar tu perfil'); };
    saveTransactionsBatch = function() { _block('guardar transacciones'); return Promise.resolve(); };
    updateTransaction = function() { _block('editar transacciones'); return Promise.resolve(); };
    deleteAllTransactions = function() { _block('borrar transacciones'); return Promise.resolve(); };
    saveAllRules = function() { _block('guardar reglas'); return Promise.resolve(); };
    addRule = function() { _block('agregar reglas'); return Promise.resolve(); };
    deleteRuleByIndex = function() { _block('editar reglas'); return Promise.resolve(); };
    saveProperty = function() { _block('guardar propiedades'); return Promise.resolve(); };
    deleteProperty = function() { _block('borrar propiedades'); return Promise.resolve(); };
    saveGoalDB = function() { _block('guardar metas'); return Promise.resolve(); };
    saveDebtDB = function() { _block('guardar deudas'); return Promise.resolve(); };
    deleteDebtDB = function() { _block('borrar deudas'); return Promise.resolve(); };
    logout = function() { window.location.href = 'login.html'; };
  };

  injectDemoUI = function() {
    // Banner
    var b = document.createElement('div');
    b.id = 'demoBanner';
    b.innerHTML = '<span>Estás viendo la demo — Importa tu cartola en minutos y reconocemos el 85% de tus gastos automáticamente</span> <a href="login.html">Crear cuenta gratis →</a>';
    document.body.prepend(b);
    document.body.classList.add('demo-mode');

    // Sidebar
    var em = document.getElementById('sidebarEmail');
    if (em) em.textContent = 'Modo demo';
    var lb = document.querySelector('[onclick*="logout"]');
    if (lb) { lb.textContent = 'Crear cuenta →'; lb.onclick = function() { window.location.href = 'login.html'; }; }

    // CTAs
    var ctas = {
      'view-dashboard': { m: 'Estos son datos de ejemplo. <strong>Importa tu cartola</strong> y en 2 minutos ordena tus finanzas reales.', b: 'Crear cuenta gratis' },
      'view-transacciones': { m: 'GuitaControl reconoce el <strong>85% de tus gastos</strong> automáticamente.', b: 'Importar mi cartola →' },
      'view-importar': { m: '<strong>Crea tu cuenta gratis</strong> para importar tus cartolas del banco.', b: 'Crear cuenta gratis' },
      'view-patrimonio': { m: 'Agrega tus propiedades e inversiones reales.', b: 'Crear cuenta gratis' },
      'view-metas': { m: 'Define tus propias metas financieras.', b: 'Crear cuenta gratis' },
      'view-estrategia': { m: 'Tu estrategia de inversión personalizada te espera.', b: 'Crear cuenta gratis' },
      'view-ajustes': { m: 'Configura tu perfil real.', b: 'Crear cuenta gratis' },
      'view-deudas': { m: 'Registra tus deudas reales.', b: 'Crear cuenta gratis' },
      'view-revisar': { m: 'Revisa las categorías de tus gastos reales.', b: 'Crear cuenta gratis' },
      'view-categorias': { m: 'Tus reglas se crean automáticamente al categorizar.', b: 'Crear cuenta gratis' }
    };
    Object.keys(ctas).forEach(function(vid) {
      var v = document.getElementById(vid);
      if (!v) return;
      var c = ctas[vid];
      var d = document.createElement('div');
      d.className = 'demo-cta-card';
      d.innerHTML = '<p>' + c.m + '</p><a href="login.html" class="demo-cta-btn">' + c.b + '</a>';
      var h = v.querySelector('h2, h3, .section-header');
      if (h && h.nextSibling) { h.parentNode.insertBefore(d, h.nextSibling); }
      else { v.prepend(d); }
    });
  };

}
