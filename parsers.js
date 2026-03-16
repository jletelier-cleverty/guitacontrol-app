/* ============================================
   PARSERS — Import, parse, categorize
   ============================================ */

function getDefaultRules() {
  return [
    { keyword: 'hipotecaria evoluciona', category: 'Dividendo / Vivienda' },
    { keyword: 'inmobiliaria panoramica', category: 'Dividendo / Inversion' },
    { keyword: 'servipag', category: 'Dividendo / Inversion' },
    { keyword: 'rainbow', category: 'Educacion / Ninos' },
    { keyword: 'huinganal', category: 'Educacion / Ninos' },
    { keyword: 'corporacion chileno alemana', category: 'Educacion / Ninos' },
    { keyword: 'tip y tap', category: 'Educacion / Ninos' },
    { keyword: 'caramba', category: 'Educacion / Ninos' },
    { keyword: 'jumbo', category: 'Supermercado' },
    { keyword: 'tottus', category: 'Supermercado' },
    { keyword: 'exp pie andino', category: 'Supermercado' },
    { keyword: 'mc donalds', category: 'Restaurantes / Comida' },
    { keyword: 'mcdonalds', category: 'Restaurantes / Comida' },
    { keyword: 'bk la dehesa', category: 'Restaurantes / Comida' },
    { keyword: 'eric kayser', category: 'Restaurantes / Comida' },
    { keyword: 'costa norte', category: 'Restaurantes / Comida' },
    { keyword: 'patio', category: 'Restaurantes / Comida' },
    { keyword: 'el golf', category: 'Restaurantes / Comida' },
    { keyword: 'foods dtk', category: 'Restaurantes / Comida' },
    { keyword: 'laguna', category: 'Restaurantes / Comida' },
    { keyword: 'cafe la canastita', category: 'Restaurantes / Comida' },
    { keyword: 'margo isidora', category: 'Restaurantes / Comida' },
    { keyword: 'aleman experto', category: 'Restaurantes / Comida' },
    { keyword: 'haulmer', category: 'Restaurantes / Comida' },
    { keyword: 'segreta', category: 'Restaurantes / Comida' },
    { keyword: 'casa costanera', category: 'Restaurantes / Comida' },
    { keyword: 'casacostanera', category: 'Restaurantes / Comida' },
    { keyword: 'work cafe', category: 'Restaurantes / Comida' },
    { keyword: 'quinto pin', category: 'Restaurantes / Comida' },
    { keyword: 'row', category: 'Restaurantes / Comida' },
    { keyword: 'uber eats', category: 'Delivery' },
    { keyword: 'rappi', category: 'Delivery' },
    { keyword: 'copec', category: 'Bencina / Auto' },
    { keyword: 'aramco', category: 'Bencina / Auto' },
    { keyword: 'pronto', category: 'Bencina / Auto' },
    { keyword: 'tag total', category: 'Bencina / Auto' },
    { keyword: 'simplepark', category: 'Bencina / Auto' },
    { keyword: 'parksur', category: 'Bencina / Auto' },
    { keyword: 'parquime', category: 'Bencina / Auto' },
    { keyword: 'puchuncavi', category: 'Bencina / Auto' },
    { keyword: 'uber', category: 'Transporte' },
    { keyword: 'clinica alemana', category: 'Salud' },
    { keyword: 'cesfam', category: 'Salud' },
    { keyword: 'salcobrand', category: 'Salud' },
    { keyword: 'metlife', category: 'Seguros' },
    { keyword: 'chilena cons.seg', category: 'Seguros' },
    { keyword: 'seguro fu', category: 'Seguros' },
    { keyword: 'netflix', category: 'Suscripciones' },
    { keyword: 'spotify', category: 'Suscripciones' },
    { keyword: 'apple', category: 'Suscripciones' },
    { keyword: 'kindle', category: 'Suscripciones' },
    { keyword: 'audible', category: 'Suscripciones' },
    { keyword: 'wix.com', category: 'Suscripciones' },
    { keyword: 'mercado libre', category: 'Compras Online' },
    { keyword: 'mercadopago', category: 'Compras Online' },
    { keyword: 'merpago', category: 'Compras Online' },
    { keyword: 'aliexpre', category: 'Compras Online' },
    { keyword: 'falabella.com', category: 'Compras Online' },
    { keyword: 'movistar', category: 'Servicios Basicos' },
    { keyword: 'pago de credito', category: 'Creditos / Banco' },
    { keyword: 'cargo automatico de credito', category: 'Prestamos Cleverty' },
    { keyword: 'comision adm', category: 'Creditos / Banco' },
    { keyword: 'interes saldo aplazado', category: 'Creditos / Banco' },
    { keyword: 'impuesto ite', category: 'Creditos / Banco' },
    { keyword: 'club de golf', category: 'Entretenimiento' },
    { keyword: 'bioparque', category: 'Entretenimiento' },
    { keyword: 'buinzoo', category: 'Entretenimiento' },
    { keyword: 'bestias spa', category: 'Bienestar' },
    { keyword: 'salon oscar', category: 'Bienestar' },
    { keyword: 'global66', category: 'Transferencias Propias' },
    { keyword: 'banco consorcio', category: 'Transferencias Propias' },
    { keyword: 'itau chile', category: 'Transferencias Propias' },
    { keyword: 'pago tarjeta cmr', category: 'Transferencias Propias' },
    { keyword: 'tarjeta cmr', category: 'Transferencias Propias' },
    { keyword: 'pago tarjeta visa', category: 'Transferencias Propias' },
    { keyword: 'jtlc spa', category: 'Transferencias Propias' },
    { keyword: 'banco santander', category: 'Transferencias Propias' },
    { keyword: 'cleverty', category: 'Prestamos Cleverty' },
    { keyword: 'tricapitals', category: 'Ingresos Trabajo' },
    { keyword: 'depositos con documentos', category: 'Ingresos Otros' },
    { keyword: 'khipu', category: 'Ingresos Otros' },
    { keyword: 'gonzalo delgado', category: 'Hogar' },
    { keyword: 'gonzalo vasquez', category: 'Hogar' },
    { keyword: 'dayana peralta', category: 'Nana / Empleados' },
    { keyword: 'karolay carrillo', category: 'Nana / Empleados' },
    { keyword: 'andreina martinez', category: 'Nana / Empleados' },
    { keyword: 'maria constanza', category: 'Transferencias Propias' },
    { keyword: 'francisca undurraga', category: 'Transferencias Propias' },
    { keyword: 'benjamin bercovich', category: 'Transferencias Propias' },
    { keyword: 'benjamin reichhardt', category: 'Transferencias Propias' },
  ];
}

// ---- PARSERS ----

function parseBICE(workbook) {
  var sheet = workbook.Sheets[workbook.SheetNames[0]];
  var raw = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  var results = [];
  var headerRow = -1;
  var colFecha = -1, colCat = -1, colDesc = -1, colMonto = -1;
  for (var i = 0; i < raw.length; i++) {
    var row = raw[i];
    if (!row) continue;
    for (var j = 0; j < row.length; j++) {
      var v = String(row[j] || '').toLowerCase().trim();
      if (v === 'fecha') colFecha = j;
      if (v === 'categoria' || v.indexOf('categor') === 0) colCat = j;
      if (v === 'descripcion' || v.indexOf('descrip') === 0) colDesc = j;
      if (v === 'monto') colMonto = j;
    }
    if (colFecha >= 0 && colCat >= 0 && colDesc >= 0 && colMonto >= 0) {
      headerRow = i;
      break;
    }
    colFecha = colCat = colDesc = colMonto = -1;
  }
  if (headerRow === -1) return results;
  for (var i = headerRow + 1; i < raw.length; i++) {
    var row = raw[i];
    if (!row || !row[colFecha] || !row[colMonto]) continue;
    var dateObj = parseDateBICE(String(row[colFecha]));
    if (!dateObj) continue;
    var montoStr = String(row[colMonto]).replace(/[\$\.]/g, '').replace(/,/g, '').trim();
    var amount = parseInt(montoStr) || 0;
    if (amount === 0) continue;
    results.push({
      id: gid(), date: dateObj.toISOString().split('T')[0],
      description: cleanDesc(String(row[colDesc] || '')),
      amount: amount,
      type: String(row[colCat] || '').toLowerCase().indexOf('abono') >= 0 ? 'ingreso' : 'gasto',
      source: 'banco', category: '',
      month: dateObj.getFullYear() + '-' + String(dateObj.getMonth()+1).padStart(2,'0')
    });
  }
  return results;
}

function parseDateBICE(str) {
  var m = { ene:0,feb:1,mar:2,abr:3,may:4,jun:5,jul:6,ago:7,sep:8,oct:9,nov:10,dic:11 };
  var p = str.trim().split(' ');
  if (p.length < 3) return null;
  var d = parseInt(p[0]), mo = m[p[1].toLowerCase()], y = parseInt(p[2]);
  return (isNaN(d) || mo === undefined || isNaN(y)) ? null : new Date(y, mo, d);
}

function parseCMRExcel(workbook) {
  var sheet = workbook.Sheets[workbook.SheetNames[0]];
  var raw = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  var results = [];
  var headerRow = -1;
  var colFecha = -1, colDesc = -1, colMonto = -1, colValorCuota = -1;
  for (var i = 0; i < Math.min(raw.length, 10); i++) {
    var row = raw[i];
    if (!row) continue;
    for (var j = 0; j < row.length; j++) {
      var v = String(row[j] || '').trim().toLowerCase();
      if (v === 'fecha') colFecha = j;
      if (v === 'descripcion' || v.indexOf('descrip') === 0) colDesc = j;
      if (v === 'monto' || v.indexOf('monto') >= 0) colMonto = j;
      if (v.indexOf('valor cuota') >= 0) colValorCuota = j;
    }
    if (colFecha >= 0 && colDesc >= 0 && colMonto >= 0) {
      headerRow = i;
      break;
    }
    colFecha = colDesc = colMonto = -1;
    colValorCuota = -1;
  }
  if (headerRow === -1) return results;

  for (var i = headerRow + 1; i < raw.length; i++) {
    var row = raw[i];
    if (!row || row[colFecha] === undefined || row[colFecha] === null) continue;
    var dateObj;
    if (typeof row[colFecha] === 'number') {
      dateObj = new Date((row[colFecha] - 25569) * 86400000);
    } else {
      dateObj = new Date(row[colFecha]);
    }
    if (isNaN(dateObj.getTime())) continue;
    var desc = cleanDescCMR(String(row[colDesc] || ''));
    if (!desc) continue;
    var monto = Math.abs(parseInt(row[colMonto]) || 0);
    if (monto === 0) continue;
    var isPay = false;
    if (colValorCuota >= 0 && row[colValorCuota] !== undefined) {
      isPay = Number(row[colValorCuota]) < 0;
    }
    if (!isPay) isPay = desc.toLowerCase().indexOf('pago tarjeta') >= 0;
    results.push({
      id: gid(), date: dateObj.toISOString().split('T')[0],
      description: desc, amount: monto,
      type: isPay ? 'ingreso' : 'gasto',
      source: 'tc', category: '',
      month: dateObj.getFullYear() + '-' + String(dateObj.getMonth()+1).padStart(2,'0')
    });
  }
  return results;
}

function parseCMRPdf(text) {
  var results = [];
  var lines = text.split('\n');
  var dateRegex = /(\d{2}\/\d{2}\/\d{4})/;
  var periodoHasta = null;
  var pm = text.match(/Per[ií]odo Facturado\s+(\d{2}\/\d{2}\/\d{4})\s+(\d{2}\/\d{2}\/\d{4})/);
  if (pm) periodoHasta = pm[2];
  for (var li = 0; li < lines.length; li++) {
    var line = lines[li];
    var dm = line.match(dateRegex);
    if (!dm) continue;
    var parts = dm[1].split('/').map(Number);
    var dateObj = new Date(parts[2], parts[1]-1, parts[0]);
    if (isNaN(dateObj.getTime())) continue;
    var afterDate = line.substring(line.indexOf(dm[1]) + dm[1].length).trim();
    var tm = afterDate.match(/^(.+?)\s+T\s+(-?[\d.,]+)\s/);
    if (!tm) continue;
    var desc = tm[1].replace(/\s+\d+-\d+$/, '').trim();
    var monto = parseInt(tm[2].replace(/\./g, '').replace(',', '')) || 0;
    if (monto === 0) continue;
    var isPay = monto < 0;
    if (isPay) monto = Math.abs(monto);
    results.push({
      id: gid(), date: dateObj.toISOString().split('T')[0], description: desc,
      amount: monto, type: isPay ? 'ingreso' : 'gasto', source: 'tc', category: '',
      month: dateObj.getFullYear() + '-' + String(dateObj.getMonth()+1).padStart(2,'0')
    });
  }
  for (var li = 0; li < lines.length; li++) {
    var line = lines[li];
    var im = line.match(/Interes saldo aplazado\s+([\d.,]+)\s/);
    if (im && periodoHasta) {
      var p2 = periodoHasta.split('/').map(Number);
      results.push({ id: gid(), date: new Date(p2[2],p2[1]-1,p2[0]).toISOString().split('T')[0],
        description: 'Interes saldo aplazado', amount: parseInt(im[1].replace(/\./g,''))||0,
        type: 'gasto', source: 'tc', category: '',
        month: p2[2] + '-' + String(p2[1]).padStart(2,'0') });
    }
    var it = line.match(/Impuesto ite.*?\s+([\d.,]+)\s+([\d.,]+)/);
    if (it && periodoHasta) {
      var p3 = periodoHasta.split('/').map(Number);
      results.push({ id: gid(), date: new Date(p3[2],p3[1]-1,p3[0]).toISOString().split('T')[0],
        description: 'Impuesto ITE TC', amount: parseInt(it[1].replace(/\./g,''))||0,
        type: 'gasto', source: 'tc', category: '',
        month: p3[2] + '-' + String(p3[1]).padStart(2,'0') });
    }
  }
  return results;
}

// ---- VISA / BANCO DE CHILE (Saldo y Mov No Facturado) ----

function parseVisaExcel(workbook) {
  var sheet = workbook.Sheets[workbook.SheetNames[0]];
  var raw = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  var results = [];
  // Detect by looking for "Movimientos Nacionales" or header row with Fecha/Descripción/Monto
  var headerRow = -1;
  for (var i = 0; i < Math.min(raw.length, 25); i++) {
    var row = raw[i];
    if (!row) continue;
    var joined = row.map(function(c) { return String(c || '').trim().toLowerCase(); }).join('|');
    if (joined.indexOf('fecha') >= 0 && joined.indexOf('monto') >= 0) {
      headerRow = i;
      break;
    }
  }
  if (headerRow === -1) return results;

  for (var i = headerRow + 1; i < raw.length; i++) {
    var row = raw[i];
    if (!row) continue;
    // Date in col 1, description in col 4, amount in col 10 (or last numeric col)
    var dateStr = String(row[1] || '').trim();
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) continue;
    var parts = dateStr.split('/').map(Number);
    var dateObj = new Date(parts[2], parts[1] - 1, parts[0]);
    if (isNaN(dateObj.getTime())) continue;

    // Description: col 4, sometimes city spills to col 6
    var desc = String(row[4] || '').trim();
    var city = String(row[6] || '').trim();
    if (city && city !== 'undefined') desc = desc + ' ' + city;
    desc = cleanDescVisa(desc);
    if (!desc) continue;

    // Amount: find last numeric value in the row
    var amount = 0;
    for (var j = row.length - 1; j >= 7; j--) {
      var v = Number(row[j]);
      if (v && !isNaN(v)) { amount = Math.round(v); break; }
    }
    if (amount === 0) continue;

    var isPay = amount < 0 || desc.toLowerCase().indexOf('pago') >= 0 && desc.toLowerCase().indexOf('tef') >= 0;
    if (isPay) amount = Math.abs(amount);

    results.push({
      id: gid(), date: dateObj.toISOString().split('T')[0],
      description: desc, amount: amount,
      type: isPay ? 'ingreso' : 'gasto',
      source: 'tc', category: '',
      month: dateObj.getFullYear() + '-' + String(dateObj.getMonth() + 1).padStart(2, '0')
    });
  }
  return results;
}

function parseVisaPdf(text) {
  var results = [];
  var lines = text.split('\n');
  var dateRegex = /^(\d{2}\/\d{2}\/\d{4})$/;
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    if (!dateRegex.test(line)) continue;
    var parts = line.split('/').map(Number);
    var dateObj = new Date(parts[2], parts[1] - 1, parts[0]);
    if (isNaN(dateObj.getTime())) continue;

    // Next lines: card type, description (possibly multi-line), cuotas, amount
    // Scan ahead to find amount (number with comma as thousands separator)
    var desc = '', amount = 0, j = i + 1;
    // Skip card type line (Titular***, Adicional***)
    if (j < lines.length && /^(Titular|Adicional)/.test(lines[j].trim())) j++;
    // Collect description lines until we hit cuotas pattern (XX/XX)
    while (j < lines.length) {
      var l = lines[j].trim();
      if (/^\d{2}\/\d{2}$/.test(l)) { j++; break; } // cuotas line
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(l)) break; // next date
      if (/^-?[\d,]+$/.test(l.replace(/\s/g, ''))) break; // amount
      desc += (desc ? ' ' : '') + l;
      j++;
    }
    // Next should be amount
    if (j < lines.length) {
      var amtStr = lines[j].trim().replace(/\s/g, '');
      if (/^-?[\d,]+$/.test(amtStr)) {
        amount = parseInt(amtStr.replace(/,/g, '')) || 0;
      }
    }
    if (!desc || amount === 0) continue;
    desc = cleanDescVisa(desc);
    var isPay = amount < 0 || (desc.toLowerCase().indexOf('pago') >= 0 && desc.toLowerCase().indexOf('tef') >= 0);
    if (isPay) amount = Math.abs(amount);
    results.push({
      id: gid(), date: dateObj.toISOString().split('T')[0],
      description: desc, amount: amount,
      type: isPay ? 'ingreso' : 'gasto',
      source: 'tc', category: '',
      month: dateObj.getFullYear() + '-' + String(dateObj.getMonth() + 1).padStart(2, '0')
    });
  }
  return results;
}

// ---- BANCO DE CHILE — Cuenta Corriente (Saldos y Movimientos) ----

function parseBChileExcel(workbook) {
  var sheet = workbook.Sheets[workbook.SheetNames[0]];
  var raw = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  var results = [];
  var headerRow = -1, colFecha = -1, colDesc = -1, colCargos = -1, colAbonos = -1;
  for (var i = 0; i < Math.min(raw.length, 30); i++) {
    var row = raw[i];
    if (!row) continue;
    for (var j = 0; j < row.length; j++) {
      var v = String(row[j] || '').trim().toLowerCase();
      if (v === 'fecha') colFecha = j;
      if (v.indexOf('descripci') >= 0) colDesc = j;
      if (v.indexOf('cargo') >= 0 && v.indexOf('clp') >= 0) colCargos = j;
      if (v.indexOf('abono') >= 0 && v.indexOf('clp') >= 0) colAbonos = j;
    }
    if (colFecha >= 0 && colDesc >= 0 && (colCargos >= 0 || colAbonos >= 0)) {
      headerRow = i;
      break;
    }
    colFecha = colDesc = colCargos = colAbonos = -1;
  }
  if (headerRow === -1) return results;

  for (var i = headerRow + 1; i < raw.length; i++) {
    var row = raw[i];
    if (!row) continue;
    var dateStr = String(row[colFecha] || '').trim();
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) continue;
    var parts = dateStr.split('/').map(Number);
    var dateObj = new Date(parts[2], parts[1] - 1, parts[0]);
    if (isNaN(dateObj.getTime())) continue;

    var desc = cleanDescBChile(String(row[colDesc] || '').trim());
    if (!desc) continue;

    var cargo = colCargos >= 0 ? (Number(row[colCargos]) || 0) : 0;
    var abono = colAbonos >= 0 ? (Number(row[colAbonos]) || 0) : 0;
    var amount = Math.round(cargo || abono);
    if (amount === 0) continue;

    results.push({
      id: gid(), date: dateObj.toISOString().split('T')[0],
      description: desc, amount: amount,
      type: abono > 0 ? 'ingreso' : 'gasto',
      source: 'banco', category: '',
      month: dateObj.getFullYear() + '-' + String(dateObj.getMonth() + 1).padStart(2, '0')
    });
  }
  return results;
}

function parseBChilePdf(text) {
  var results = [];
  var lines = text.split('\n');
  // Find lines with dd/mm/yyyy pattern followed by description and amounts
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    var dm = line.match(/^(\d{2}\/\d{2}\/\d{4})$/);
    if (!dm) continue;
    var parts = dm[1].split('/').map(Number);
    var dateObj = new Date(parts[2], parts[1] - 1, parts[0]);
    if (isNaN(dateObj.getTime())) continue;

    // Collect description and amounts from following lines
    var desc = '', cargo = 0, abono = 0, j = i + 1;
    // Description lines until we hit amounts or next date
    while (j < lines.length) {
      var l = lines[j].trim();
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(l)) break; // next date
      // Amount line: just a number with commas/dots
      if (/^[\d.,]+$/.test(l.replace(/\s/g, ''))) {
        var num = parseInt(l.replace(/[.,\s]/g, '')) || 0;
        if (num > 0) {
          if (!cargo && !abono) cargo = num; // first number could be cargo or abono
          // We need context to distinguish; collect all numbers
        }
        j++;
        continue;
      }
      if (l && !/^(Infórmate|©|Saldo|Cupo|Total|Movimientos al|Fecha|Descripci|Canal|Cargo|Abono|Retenci|Línea)/.test(l)) {
        desc += (desc ? ' ' : '') + l;
      }
      j++;
      if (j - i > 8) break; // safety
    }
    if (!desc) continue;
    desc = cleanDescBChile(desc);

    // Try to find amount: look at the numbers after the description
    // Scan lines after date for numbers
    var amounts = [];
    for (var k = i + 1; k < Math.min(j, i + 8); k++) {
      var numMatch = lines[k].trim().replace(/\s/g, '').match(/^([\d.,]+)$/);
      if (numMatch) amounts.push(parseInt(numMatch[1].replace(/[.,]/g, '')) || 0);
    }
    if (amounts.length === 0) continue;

    // In BChile PDF: cargo, then abono (if present), then saldo
    // If there's a "Traspaso De:" it's an abono, "Traspaso A:" is cargo
    var isAbono = desc.toLowerCase().indexOf('traspaso de:') >= 0 ||
                  desc.toLowerCase().indexOf('deposito') >= 0 ||
                  desc.toLowerCase().indexOf('abono') >= 0;
    var amount = amounts[0];
    if (amount === 0) continue;

    results.push({
      id: gid(), date: dateObj.toISOString().split('T')[0],
      description: desc, amount: amount,
      type: isAbono ? 'ingreso' : 'gasto',
      source: 'banco', category: '',
      month: dateObj.getFullYear() + '-' + String(dateObj.getMonth() + 1).padStart(2, '0')
    });
    i = j - 1; // skip processed lines
  }
  return results;
}

function cleanDescBChile(desc) {
  return desc.replace(/^Pago:/i, '').replace(/\s+/g, ' ').trim();
}

// ---- GENERIC FALLBACK PARSER ----

function parseGenericExcel(workbook) {
  var sheet = workbook.Sheets[workbook.SheetNames[0]];
  var raw = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  var results = [];
  var headerRow = -1, colFecha = -1, colDesc = -1, colMonto = -1, colCargos = -1, colAbonos = -1;

  for (var i = 0; i < Math.min(raw.length, 30); i++) {
    var row = raw[i];
    if (!row) continue;
    for (var j = 0; j < row.length; j++) {
      var v = String(row[j] || '').trim().toLowerCase();
      if (v === 'fecha' || v === 'date') colFecha = j;
      if (v.indexOf('descripci') >= 0 || v.indexOf('detalle') >= 0 || v === 'glosa' || v === 'description') colDesc = j;
      if (v === 'monto' || v === 'amount' || v.indexOf('monto total') >= 0) colMonto = j;
      if (v.indexOf('cargo') >= 0 && v.indexOf('total') === -1) colCargos = j;
      if (v.indexOf('abono') >= 0 && v.indexOf('total') === -1) colAbonos = j;
    }
    if (colFecha >= 0 && colDesc >= 0 && (colMonto >= 0 || colCargos >= 0 || colAbonos >= 0)) {
      headerRow = i;
      break;
    }
    colFecha = colDesc = colMonto = colCargos = colAbonos = -1;
  }
  if (headerRow === -1) return results;

  for (var i = headerRow + 1; i < raw.length; i++) {
    var row = raw[i];
    if (!row || !row[colFecha]) continue;

    var dateObj = parseFlexDate(row[colFecha]);
    if (!dateObj) continue;

    var desc = String(row[colDesc] || '').replace(/\s+/g, ' ').trim();
    if (!desc) continue;

    var amount = 0, type = 'gasto';
    if (colMonto >= 0) {
      amount = Math.round(Math.abs(Number(String(row[colMonto]).replace(/[\$\.,\s]/g, '')) || 0));
      if (Number(String(row[colMonto]).replace(/[\$\.\s]/g, '').replace(',', '.')) < 0) type = 'ingreso';
    } else {
      var cargo = colCargos >= 0 ? (Number(row[colCargos]) || 0) : 0;
      var abono = colAbonos >= 0 ? (Number(row[colAbonos]) || 0) : 0;
      amount = Math.round(cargo || abono);
      if (abono > 0) type = 'ingreso';
    }
    if (amount === 0) continue;

    results.push({
      id: gid(), date: dateObj.toISOString().split('T')[0],
      description: desc, amount: amount, type: type,
      source: 'banco', category: '',
      month: dateObj.getFullYear() + '-' + String(dateObj.getMonth() + 1).padStart(2, '0')
    });
  }
  return results;
}

function parseFlexDate(val) {
  if (!val) return null;
  if (typeof val === 'number') {
    var d = new Date((val - 25569) * 86400000);
    return isNaN(d.getTime()) ? null : d;
  }
  var s = String(val).trim();
  // dd/mm/yyyy or dd-mm-yyyy
  var m = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (m) { var d = new Date(+m[3], +m[2]-1, +m[1]); return isNaN(d.getTime()) ? null : d; }
  // yyyy-mm-dd
  m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) { var d = new Date(+m[1], +m[2]-1, +m[3]); return isNaN(d.getTime()) ? null : d; }
  // "01 Ene 2026" style
  var months = {ene:0,feb:1,mar:2,abr:3,may:4,jun:5,jul:6,ago:7,sep:8,oct:9,nov:10,dic:11,
                jan:0,apr:3,aug:7,dec:11};
  m = s.match(/^(\d{1,2})\s+(\w{3})\s+(\d{4})$/i);
  if (m && months[m[2].toLowerCase()] !== undefined) {
    var d = new Date(+m[3], months[m[2].toLowerCase()], +m[1]);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}

function cleanDescVisa(desc) {
  return desc.replace(/\s+/g, ' ').replace(/\s*(COMPRAS?|CL)\s*$/i, '').replace(/\s+/g, ' ').trim();
}

function cleanDesc(desc) {
  return desc.replace(/\s+/g, ' ')
    .replace(/Rut\s*\d+[\.\-\dkK]+/gi, '')
    .replace(/el \d{4}-\d{2}-\d{2} a las \d{2}:\d{2}(:\d{2})?\s*hrs\.?/gi, '')
    .replace(/el \d{2}\/\d{2}\/\d{4}\s*(a las)?\s*\d{2}:\d{2}/gi, '')
    .replace(/desde Banco BICE/gi, '')
    .replace(/a Cuenta (Corriente|Vista) de [^,]+,?/gi, '')
    .replace(/\s+/g, ' ').trim();
}

function cleanDescCMR(desc) {
  return desc.replace(/^COMPRA\s+/i, '').replace(/\*+$/, '').replace(/\s+/g, ' ').trim();
}

function categorize(tx) {
  var d = tx.description.toLowerCase();
  for (var i = 0; i < rules.length; i++) {
    if (d.indexOf(rules[i].keyword.toLowerCase()) >= 0) return rules[i].category;
  }
  return '';
}

async function categorizeAll() {
  var changed = [];
  transactions.forEach(function(tx) {
    if (!tx.category) {
      tx.category = categorize(tx);
      if (tx.category) changed.push(tx);
    }
  });
  for (var i = 0; i < changed.length; i++) await updateTransaction(changed[i]);
}

async function removeDuplicates() {
  var seen = {};
  var clean = [];
  transactions.forEach(function(tx) {
    var key = tx.date + '|' + tx.amount + '|' + normalizeDesc(tx.description);
    if (!seen[key]) {
      seen[key] = true;
      clean.push(tx);
    }
  });
  var removed = transactions.length - clean.length;
  if (removed > 0) {
    var keepIds = clean.map(function(t) { return t.id; });
    await deleteTransactionDuplicates(keepIds);
  }
  transactions = clean;
  return removed;
}

// ---- IMPORT ----

async function addParsedTransactions(parsed) {
  var added = 0, dupes = 0;
  var newTxs = [];
  parsed.forEach(function(tx) {
    if (isDuplicate(tx)) { dupes++; return; }
    tx.category = categorize(tx);
    transactions.push(tx);
    newTxs.push(tx);
    added++;
  });
  if (newTxs.length > 0) await saveTransactionsBatch(newTxs);
  return { added: added, dupes: dupes, total: parsed.length };
}

async function importFile(file) {
  var name = file.name.toLowerCase();
  var isPdf = name.endsWith('.pdf');

  if (isPdf) {
    var ab = await file.arrayBuffer();
    var pdf = await pdfjsLib.getDocument({ data: ab }).promise;
    var lineText = '';
    for (var i = 1; i <= pdf.numPages; i++) {
      var page = await pdf.getPage(i);
      var content = await page.getTextContent();
      var lastY = null, line = '';
      content.items.forEach(function(item) {
        var y = Math.round(item.transform[5]);
        if (lastY !== null && Math.abs(y - lastY) > 3) { lineText += line.trim() + '\n'; line = ''; }
        line += item.str + ' '; lastY = y;
      });
      lineText += line.trim() + '\n';
    }
    // Try each PDF parser in order
    var bchilePdfParsed = parseBChilePdf(lineText);
    if (bchilePdfParsed.length > 0) {
      return { results: await addParsedTransactions(bchilePdfParsed), source: 'Banco de Chile' };
    }
    var visaPdfParsed = parseVisaPdf(lineText);
    if (visaPdfParsed.length > 0) {
      return { results: await addParsedTransactions(visaPdfParsed), source: 'TC Visa' };
    }
    var parsed = parseCMRPdf(lineText);
    return { results: await addParsedTransactions(parsed), source: 'TC CMR' };
  } else {
    var ab = await file.arrayBuffer();
    var wb = XLSX.read(ab, { type: 'array' });
    var biceParsed = parseBICE(wb);
    if (biceParsed.length > 0) {
      return { results: await addParsedTransactions(biceParsed), source: 'Banco BICE' };
    }
    var cmrParsed = parseCMRExcel(wb);
    if (cmrParsed.length > 0) {
      return { results: await addParsedTransactions(cmrParsed), source: 'TC CMR' };
    }
    var visaParsed = parseVisaExcel(wb);
    if (visaParsed.length > 0) {
      return { results: await addParsedTransactions(visaParsed), source: 'TC Visa' };
    }
    var bchileParsed = parseBChileExcel(wb);
    if (bchileParsed.length > 0) {
      return { results: await addParsedTransactions(bchileParsed), source: 'Banco de Chile' };
    }
    // Fallback: try generic parser for any Excel with Fecha/Descripcion/Monto columns
    var genericParsed = parseGenericExcel(wb);
    if (genericParsed.length > 0) {
      return { results: await addParsedTransactions(genericParsed), source: 'Auto-detectado' };
    }
    return { results: { added: 0, dupes: 0, total: 0 }, source: 'No reconocido' };
  }
}

async function importFiles(files) {
  var statusEl = document.getElementById('importStatus');
  statusEl.textContent = 'Procesando ' + files.length + ' archivo(s)...';
  statusEl.className = 'import-status';
  var totalAdded = 0, totalDupes = 0, messages = [];
  for (var i = 0; i < files.length; i++) {
    try {
      var result = await importFile(files[i]);
      var r = result.results;
      totalAdded += r.added;
      totalDupes += r.dupes;
      messages.push(files[i].name + ': ' + r.added + ' nuevas' + (r.dupes > 0 ? ', ' + r.dupes + ' duplicadas' : '') + (r.total === 0 ? ' (formato no reconocido)' : '') + ' [' + result.source + ']');
    } catch (err) {
      messages.push(files[i].name + ': Error — ' + err.message);
    }
  }
  statusEl.innerHTML = '<strong>' + totalAdded + ' transacciones importadas</strong>' + (totalDupes > 0 ? ' (' + totalDupes + ' duplicadas ignoradas)' : '') + '<br><small>' + messages.join('<br>') + '</small>';
  statusEl.className = 'import-status success';
  document.getElementById('fileImport').value = '';
  refreshAll();
}
