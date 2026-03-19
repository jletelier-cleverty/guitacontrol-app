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
    var dateObj = parseFlexDate(row[colFecha]);
    if (!dateObj) continue;
    var desc = cleanDescCMR(String(row[colDesc] || ''));
    if (!desc) continue;
    var monto = Math.abs(parseInt(row[colMonto]) || 0);
    if (monto === 0) continue;
    var isPay = false;
    if (colValorCuota >= 0 && row[colValorCuota] !== undefined) {
      isPay = Number(row[colValorCuota]) < 0;
    }
    if (!isPay) isPay = desc.toLowerCase().indexOf('pago tarjeta') >= 0 ||
                        desc.toLowerCase().indexOf('pago recibido') >= 0 ||
                        desc.toLowerCase().indexOf('pago ') === 0 ||
                        Number(row[colMonto]) < 0;
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

function parseGenericExcel(workbook, sourceType) {
  var sheet = workbook.Sheets[workbook.SheetNames[0]];
  var raw = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  var results = [];
  var headerRow = -1, colFecha = -1, colDesc = -1, colMonto = -1;
  var colCargos = -1, colAbonos = -1, colTipo = -1, colCuotas = -1, colValorCuota = -1;
  var src = sourceType || 'banco';

  for (var i = 0; i < Math.min(raw.length, 30); i++) {
    var row = raw[i];
    if (!row) continue;
    for (var j = 0; j < row.length; j++) {
      var v = String(row[j] || '').trim().toLowerCase();
      if (v === 'fecha' || v === 'date') colFecha = j;
      if (v.indexOf('descripci') >= 0 || v.indexOf('detalle') >= 0 || v === 'glosa' ||
          v === 'description' || v === 'comercio') colDesc = j;
      if (v === 'monto' || v === 'amount' || v.indexOf('monto total') >= 0 || v === 'monto $') colMonto = j;
      // Cargo/Abono (Banco de Chile, Santander, BCI, Scotiabank, Consorcio)
      if ((v.indexOf('cargo') >= 0 || v.indexOf('debe') >= 0 || v.indexOf('debito') >= 0 || v === 'débito') && v.indexOf('total') === -1) colCargos = j;
      if ((v.indexOf('abono') >= 0 || v.indexOf('haber') >= 0 || v.indexOf('credito') >= 0 || v === 'crédito') && v.indexOf('total') === -1) colAbonos = j;
      // Tipo column (BancoEstado CuentaRUT: Monto + Tipo)
      if (v === 'tipo') colTipo = j;
      // Cuotas (TC)
      if (v === 'cuotas' || v.indexOf('cuota') >= 0 && v.indexOf('valor') === -1) colCuotas = j;
      if (v.indexOf('valor cuota') >= 0) colValorCuota = j;
    }
    if (colFecha >= 0 && colDesc >= 0 && (colMonto >= 0 || colCargos >= 0 || colAbonos >= 0)) {
      headerRow = i;
      break;
    }
    colFecha = colDesc = colMonto = colCargos = colAbonos = colTipo = colCuotas = colValorCuota = -1;
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

    if (colCargos >= 0 || colAbonos >= 0) {
      // Separated columns: Cargo/Abono, Debe/Haber, Débito/Crédito
      var cargo = colCargos >= 0 ? (Math.abs(Number(row[colCargos])) || 0) : 0;
      var abono = colAbonos >= 0 ? (Math.abs(Number(row[colAbonos])) || 0) : 0;
      amount = Math.round(cargo || abono);
      if (abono > 0 && cargo === 0) type = 'ingreso';
    } else if (colMonto >= 0 && colTipo >= 0) {
      // Monto + Tipo column (BancoEstado CuentaRUT)
      amount = Math.round(Math.abs(Number(String(row[colMonto]).replace(/[\$\.,\s]/g, '')) || 0));
      var tipoVal = String(row[colTipo] || '').toLowerCase().trim();
      if (tipoVal === 'abono' || tipoVal === 'a' || tipoVal === 'ingreso' || tipoVal === 'credito') type = 'ingreso';
    } else if (colMonto >= 0) {
      // Single monto column (BICE style: sign indicates type)
      var rawMonto = Number(String(row[colMonto]).replace(/[\$\.\s]/g, '').replace(',', '.'));
      amount = Math.round(Math.abs(rawMonto || 0));
      if (rawMonto > 0) {
        // Positive = could be ingreso (BICE) or gasto depending on context
        // Check for "Abono" in categoria or description
        var catCol = -1;
        for (var j = 0; j < row.length; j++) {
          var hv = String((raw[headerRow] || [])[j] || '').toLowerCase();
          if (hv.indexOf('categor') >= 0) { catCol = j; break; }
        }
        if (catCol >= 0 && String(row[catCol] || '').toLowerCase().indexOf('abono') >= 0) type = 'ingreso';
        else if (desc.toLowerCase().indexOf('abono') >= 0 || desc.toLowerCase().indexOf('sueldo') >= 0 ||
                 desc.toLowerCase().indexOf('deposito') >= 0 || desc.toLowerCase().indexOf('tef recibida') >= 0) type = 'ingreso';
      }
      if (rawMonto < 0) type = 'gasto'; // Negative = gasto
    }
    if (amount === 0) continue;

    // For TC: check if it's a payment
    if (src === 'tc') {
      var dl = desc.toLowerCase();
      if (dl.indexOf('pago') >= 0 || dl.indexOf('abono') >= 0 || (colValorCuota >= 0 && Number(row[colValorCuota]) < 0)) {
        type = 'ingreso';
      }
    }

    results.push({
      id: gid(), date: dateObj.toISOString().split('T')[0],
      description: desc, amount: amount, type: type,
      source: src, category: '',
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

async function addParsedTransactions(parsed, batchId) {
  var added = 0, dupes = 0;
  var newTxs = [];
  var bid = batchId || gid();
  parsed.forEach(function(tx) {
    if (isDuplicate(tx)) { dupes++; return; }
    tx.category = categorize(tx);
    tx.batch_id = bid;
    transactions.push(tx);
    newTxs.push(tx);
    added++;
  });
  if (newTxs.length > 0) await saveTransactionsBatch(newTxs);
  return { added: added, dupes: dupes, total: parsed.length, batch_id: bid };
}

// ---- GENERIC PDF PARSER (tabular bank statements) ----

function parseGenericPdf(text) {
  var results = [];
  var lines = text.split('\n');
  var dateRegex = /(\d{2}[\/\-]\d{2}[\/\-]\d{4})/;

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    var dm = line.match(dateRegex);
    if (!dm) continue;

    var sep = dm[1].indexOf('/') >= 0 ? '/' : '-';
    var parts = dm[1].split(sep).map(Number);
    var dateObj = new Date(parts[2], parts[1] - 1, parts[0]);
    if (isNaN(dateObj.getTime())) continue;

    // After date, collect description + amounts from same line and following lines
    var afterDate = line.substring(line.indexOf(dm[1]) + dm[1].length).trim();
    var desc = '', amounts = [];

    // Extract amounts: look for "$ NUMBER" pattern first (explicit currency marker)
    // Then fall back to plain numbers, but skip reference/serie numbers (too many digits without dots)
    var tokens = afterDate.split(/\s+/);
    for (var t = 0; t < tokens.length; t++) {
      var tok = tokens[t];
      var isAfterDollar = (t > 0 && tokens[t - 1] === '$') || tok.charAt(0) === '$';
      var cleaned = tok.replace(/[\$]/g, '');
      if (/^-?[\d.]+$/.test(cleaned) && cleaned.replace(/\./g, '').length > 0) {
        var num = parseInt(cleaned.replace(/\./g, '')) || 0;
        // Skip numbers that are likely reference/serie numbers:
        // - No dots as thousands separators AND more than 8 digits = reference number
        // - Or exceeds 999 million pesos (unrealistic for personal finance)
        var hasDots = cleaned.indexOf('.') >= 0;
        var digitCount = cleaned.replace(/\./g, '').length;
        if (num > 999000000) { desc += (desc ? ' ' : '') + tok; continue; }
        if (!hasDots && !isAfterDollar && digitCount > 8) { desc += (desc ? ' ' : '') + tok; continue; }
        if (num !== 0) amounts.push(num);
      } else if (tok === '$') {
        // Skip the $ sign itself, next token is the amount
        continue;
      } else {
        desc += (desc ? ' ' : '') + tok;
      }
    }

    // If not enough info on this line, scan ahead
    if (amounts.length === 0) {
      for (var j = i + 1; j < Math.min(i + 5, lines.length); j++) {
        var nl = lines[j].trim();
        if (dateRegex.test(nl)) break;
        var numMatch = nl.match(/^[\$]?\s*-?([\d.]+)\s*$/);
        if (numMatch) {
          amounts.push(parseInt(numMatch[1].replace(/\./g, '')) || 0);
        } else if (!desc && nl && !/^(Fecha|Saldo|Total|Pagina|Movimiento)/i.test(nl)) {
          desc = nl;
        }
      }
    }

    desc = desc.replace(/\s+/g, ' ').trim();
    if (!desc || amounts.length === 0) continue;

    // Heuristic for Cargo/Abono/Saldo pattern (3 amounts = most Chilean banks)
    // Pattern: [Cargo, Abono, Saldo] — movement is the non-zero of Cargo or Abono
    var amount = 0, type = 'gasto';
    if (amounts.length >= 3) {
      // 3+ amounts: likely Cargo, Abono, Saldo (ignore saldo = last)
      var cargo = amounts[0];
      var abono = amounts[1];
      if (cargo > 0 && abono === 0) { amount = cargo; type = 'gasto'; }
      else if (abono > 0 && cargo === 0) { amount = abono; type = 'ingreso'; }
      else if (cargo > 0) { amount = cargo; type = 'gasto'; }
      else { amount = abono; type = 'ingreso'; }
    } else if (amounts.length === 2) {
      // 2 amounts: first is movement, second is saldo (skip saldo)
      amount = amounts[0];
      if (amounts[0] === 0 && amounts[1] > 0) { amount = amounts[1]; type = 'ingreso'; }
    } else {
      amount = Math.abs(amounts[0]);
      if (amounts[0] < 0) type = 'ingreso';
    }
    if (amount === 0) continue;

    // Detect income by keywords
    var dl = desc.toLowerCase();
    if (dl.indexOf('abono') >= 0 || dl.indexOf('deposito') >= 0 || dl.indexOf('tef recibida') >= 0 ||
        dl.indexOf('transferencia recibida') >= 0 || dl.indexOf('sueldo') >= 0 ||
        dl.indexOf('traspaso de:') >= 0) {
      type = 'ingreso';
    }

    results.push({
      id: gid(), date: dateObj.toISOString().split('T')[0],
      description: desc, amount: amount, type: type,
      source: 'banco', category: '',
      month: dateObj.getFullYear() + '-' + String(dateObj.getMonth() + 1).padStart(2, '0')
    });
  }
  return results;
}

// ---- GENERIC TC PDF PARSER (credit card statements) ----

function parseTcGenericPdf(text) {
  var results = [];
  var lines = text.split('\n');
  var dateRegex = /(\d{2}\/\d{2}\/\d{4})/;

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    var dm = line.match(dateRegex);
    if (!dm) continue;

    var parts = dm[1].split('/').map(Number);
    var dateObj = new Date(parts[2], parts[1] - 1, parts[0]);
    if (isNaN(dateObj.getTime())) continue;

    var afterDate = line.substring(line.indexOf(dm[1]) + dm[1].length).trim();
    // Try to extract description and amount from same line
    var desc = '', amount = 0;

    // Pattern: date description amount (with dots as thousand separator)
    var lineMatch = afterDate.match(/^(.+?)\s+(-?[\d.]+)\s*$/);
    if (lineMatch) {
      desc = lineMatch[1].trim();
      amount = parseInt(lineMatch[2].replace(/\./g, '')) || 0;
    } else {
      // Description is everything after date, amount on next line(s)
      desc = afterDate;
      for (var j = i + 1; j < Math.min(i + 4, lines.length); j++) {
        var nl = lines[j].trim();
        if (dateRegex.test(nl)) break;
        var numMatch = nl.match(/^[\$]?\s*-?([\d.]+)\s*$/);
        if (numMatch) { amount = parseInt(numMatch[1].replace(/\./g, '')) || 0; break; }
        // Could be cuotas line (e.g., "1/3"), skip it
        if (/^\d+\/\d+$/.test(nl)) continue;
        if (nl && !desc) desc = nl;
      }
    }

    // Remove cuotas info from description (e.g., "3 cuotas", "1/6")
    desc = desc.replace(/\s*\d+\/\d+\s*$/, '').replace(/\s*\d+\s*cuotas?\s*/i, '').trim();
    desc = desc.replace(/\s+/g, ' ').trim();
    if (!desc || amount === 0) continue;

    var isPay = amount < 0 || desc.toLowerCase().indexOf('pago') >= 0;
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

// Detect bank from file content fingerprints
function detectBankExcel(workbook) {
  var sheet = workbook.Sheets[workbook.SheetNames[0]];
  var raw = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  var text = raw.slice(0, 30).map(function(r) { return (r || []).join(' '); }).join(' ').toLowerCase();
  var sheetName = (workbook.SheetNames[0] || '').toLowerCase();

  // Header text only (first 5 rows) for TC detection - avoid matching transaction descriptions
  var headerText = raw.slice(0, 5).map(function(r) { return (r || []).join(' '); }).join(' ').toLowerCase();

  // Tarjetas de credito (detectar primero para no confundir con bancos)
  if (headerText.indexOf('cmr') >= 0 || (headerText.indexOf('falabella') >= 0 && text.indexOf('valor cuota') >= 0)) return 'cmr';
  if (sheetName.indexOf('saldo y mov no facturado') >= 0 || headerText.indexOf('mov no facturado') >= 0 ||
      headerText.indexOf('tipo de tarjeta') >= 0 || headerText.indexOf('visa signature') >= 0 ||
      headerText.indexOf('visa platinum') >= 0 || headerText.indexOf('mastercard') >= 0) return 'visa';
  if (text.indexOf('cencosud') >= 0 && (text.indexOf('scotiabank') >= 0 || text.indexOf('paris') >= 0 || text.indexOf('jumbo') >= 0)) return 'tc_cencosud';
  if (text.indexOf('hites') >= 0 && text.indexOf('tarjeta') >= 0) return 'tc_hites';
  if (text.indexOf('la polar') >= 0 && text.indexOf('tarjeta') >= 0) return 'tc_lapolar';
  if (text.indexOf('abcdin') >= 0) return 'tc_abcdin';
  if (text.indexOf('lider') >= 0 && text.indexOf('bci') >= 0 && text.indexOf('tarjeta') >= 0) return 'tc_lider';
  if (text.indexOf('unimarc') >= 0 || text.indexOf('unicard') >= 0 || text.indexOf('smu') >= 0) return 'tc_unimarc';
  if (text.indexOf('ripley') >= 0 && text.indexOf('tarjeta') >= 0) return 'tc_ripley';

  // Bancos — usar solo header (primeras 30 filas) para detectar banco emisor
  // El contenido de transacciones menciona otros bancos en TEFs y confunde
  if (headerText.indexOf('consorcio') >= 0) return 'consorcio';
  if (headerText.indexOf('banco de chile') >= 0 || headerText.indexOf('cargos (clp)') >= 0 ||
      headerText.indexOf('abonos (clp)') >= 0 || headerText.indexOf('canal o sucursal') >= 0) return 'bchile';
  if (headerText.indexOf('bice') >= 0 || (headerText.indexOf('bice') >= 0 && text.indexOf('categoria') >= 0)) return 'bice';
  if (headerText.indexOf('santander') >= 0) return 'santander';
  if (headerText.indexOf('scotiabank') >= 0) return 'scotiabank';
  if (headerText.indexOf('bci') >= 0 || headerText.indexOf('banco credito') >= 0) return 'bci';
  if (headerText.indexOf('itau') >= 0 || headerText.indexOf('itaú') >= 0) return 'itau';
  if (headerText.indexOf('bancoestado') >= 0 || headerText.indexOf('cuentarut') >= 0) return 'estado';
  if (headerText.indexOf('banco falabella') >= 0) return 'falabella';
  if (headerText.indexOf('banco ripley') >= 0) return 'ripley';
  if (headerText.indexOf('banco internacional') >= 0) return 'internacional';

  // Fintech
  if (text.indexOf('tenpo') >= 0) return 'tenpo';
  if (text.indexOf('mercado pago') >= 0) return 'mercadopago';
  if (text.indexOf('mach') >= 0) return 'mach';
  if (text.indexOf('global66') >= 0) return 'global66';

  return 'desconocido';
}

function detectBankPdf(text) {
  var t = text.substring(0, 3000).toLowerCase();

  // Tarjetas de credito primero
  if (t.indexOf('cmr') >= 0 || (t.indexOf('falabella') >= 0 && (t.indexOf('periodo facturado') >= 0 || t.indexOf('valor cuota') >= 0))) return 'cmr';
  if ((t.indexOf('mov no facturado') >= 0 || t.indexOf('mov facturado') >= 0) &&
      (t.indexOf('visa signature') >= 0 || t.indexOf('visa platinum') >= 0 ||
       t.indexOf('mastercard') >= 0 || t.indexOf('tipo de tarjeta') >= 0)) return 'visa';
  if (t.indexOf('cencosud') >= 0 && (t.indexOf('scotiabank') >= 0 || t.indexOf('paris') >= 0 ||
      t.indexOf('jumbo') >= 0 || t.indexOf('easy') >= 0 || t.indexOf('santa isabel') >= 0)) return 'tc_cencosud';
  if (t.indexOf('tarjeta') >= 0 && t.indexOf('hites') >= 0) return 'tc_hites';
  if (t.indexOf('tarjeta') >= 0 && t.indexOf('la polar') >= 0) return 'tc_lapolar';
  if (t.indexOf('abcdin') >= 0) return 'tc_abcdin';
  if (t.indexOf('lider') >= 0 && t.indexOf('bci') >= 0) return 'tc_lider';
  if (t.indexOf('unimarc') >= 0 || t.indexOf('unicard') >= 0) return 'tc_unimarc';
  if (t.indexOf('tarjeta ripley') >= 0 || (t.indexOf('ripley') >= 0 && t.indexOf('cupo') >= 0)) return 'tc_ripley';

  // Bancos — usar solo primeras 500 chars (header/titulo del PDF) para detectar banco emisor.
  // Mas abajo aparecen TEFs que mencionan OTROS bancos y confunden la deteccion.
  var h = text.substring(0, 500).toLowerCase();
  // Consorcio: logo es imagen (no texto), detectar por estructura unica de columnas
  if (h.indexOf('consorcio') >= 0) return 'consorcio';
  if (h.indexOf('cartola de movimientos') >= 0 && t.indexOf('serie') >= 0 &&
      t.indexOf('cargo') >= 0 && t.indexOf('abono') >= 0 && t.indexOf('saldo') >= 0) return 'consorcio';
  if (h.indexOf('banco de chile') >= 0 || h.indexOf('cartolas claras') >= 0) return 'bchile';
  if (h.indexOf('bice') >= 0) return 'bice';
  if (h.indexOf('santander') >= 0) return 'santander';
  if (h.indexOf('scotiabank') >= 0) return 'scotiabank';
  if (h.indexOf('bci') >= 0 || h.indexOf('credito e inversiones') >= 0) return 'bci';
  if (h.indexOf('itau') >= 0 || h.indexOf('itaú') >= 0) return 'itau';
  if (h.indexOf('falabella') >= 0 && h.indexOf('banco') >= 0) return 'falabella';
  if (h.indexOf('ripley') >= 0 && h.indexOf('banco') >= 0) return 'ripley';
  if (h.indexOf('internacional') >= 0) return 'internacional';
  if (h.indexOf('bancoestado') >= 0 || h.indexOf('cuentarut') >= 0) return 'estado';
  // Fallback: buscar en mas texto pero con keywords estructurales (no de contenido)
  if (t.indexOf('cargos (clp)') >= 0 || t.indexOf('canal o sucursal') >= 0) return 'bchile';
  if (t.indexOf('bice') >= 0 && t.indexOf('categoria') >= 0) return 'bice';
  if (t.indexOf('bancoestado') >= 0 || t.indexOf('cuentarut') >= 0) return 'estado';

  // Fintech — usar solo header para evitar que TEFs a fintechs confundan deteccion
  if (h.indexOf('tenpo') >= 0) return 'tenpo';
  if (h.indexOf('mercado pago') >= 0) return 'mercadopago';
  if (h.indexOf('mach') >= 0) return 'mach';
  if (h.indexOf('global66') >= 0) return 'global66';
  if (h.indexOf('copec pay') >= 0) return 'copecpay';
  if (h.indexOf('dale') >= 0 && h.indexOf('coopeuch') >= 0) return 'dale';
  if (h.indexOf('fpay') >= 0 || h.indexOf('falabella pay') >= 0) return 'fpay';
  if (h.indexOf('prex') >= 0) return 'prex';

  // Deteccion generica de TC por keywords comunes en estados de cuenta
  if (t.indexOf('cupo disponible') >= 0 || t.indexOf('pago minimo') >= 0 ||
      t.indexOf('mov facturado') >= 0 || t.indexOf('estado de cuenta tarjeta') >= 0 ||
      t.indexOf('deuda total') >= 0) return 'tc_generica';

  return 'desconocido';
}

var BANK_LABELS = {
  bice: 'Banco BICE', cmr: 'TC CMR Falabella', visa: 'TC Visa/MC',
  bchile: 'Banco de Chile', santander: 'Banco Santander',
  scotiabank: 'Scotiabank', bci: 'BCI', itau: 'Banco Itaú',
  estado: 'BancoEstado', falabella: 'Banco Falabella', ripley: 'Banco Ripley',
  consorcio: 'Banco Consorcio', internacional: 'Banco Internacional',
  tc_cencosud: 'TC Cencosud Scotiabank', tc_hites: 'TC Hites',
  tc_lapolar: 'TC La Polar', tc_abcdin: 'TC ABCDIN',
  tc_lider: 'TC Lider BCI', tc_unimarc: 'TC Unimarc SMU',
  tc_ripley: 'TC Ripley', tc_generica: 'Tarjeta Credito',
  tenpo: 'Tenpo', mercadopago: 'Mercado Pago', mach: 'MACH',
  global66: 'Global66', copecpay: 'Copec Pay', dale: 'Dale Coopeuch',
  fpay: 'Fpay', prex: 'Prex',
  desconocido: 'Auto-detectado'
};

// Determine if a bank code is a credit card (tc) or bank account
function getSourceType(bank) {
  var tcBanks = ['cmr','visa','tc_cencosud','tc_hites','tc_lapolar','tc_abcdin',
                 'tc_lider','tc_unimarc','tc_ripley','tc_generica'];
  return tcBanks.indexOf(bank) >= 0 ? 'tc' : 'banco';
}

async function importFile(file) {
  var name = file.name.toLowerCase();
  var isPdf = name.endsWith('.pdf');
  var rawText = '';
  var rawRows = null; // For Excel: array of arrays
  var parsed = [];
  var bank = 'desconocido';
  var label = '';
  var src = 'banco';
  var parserUsed = 'rules';

  // ===== EXTRACT TEXT / DATA =====
  if (isPdf) {
    var ab = await file.arrayBuffer();
    var pdf = await pdfjsLib.getDocument({ data: ab }).promise;
    for (var i = 1; i <= pdf.numPages; i++) {
      var page = await pdf.getPage(i);
      var content = await page.getTextContent();
      var lastY = null, line = '';
      content.items.forEach(function(item) {
        var y = Math.round(item.transform[5]);
        if (lastY !== null && Math.abs(y - lastY) > 3) { rawText += line.trim() + '\n'; line = ''; }
        line += item.str + ' '; lastY = y;
      });
      rawText += line.trim() + '\n';
    }
    bank = detectBankPdf(rawText);
  } else {
    var ab = await file.arrayBuffer();
    var wb = XLSX.read(ab, { type: 'array' });
    bank = detectBankExcel(wb);
    // Extract raw rows for manual mapping fallback
    var sheet = wb.Sheets[wb.SheetNames[0]];
    rawRows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
    // Also build text representation for AI fallback
    rawText = rawRows.map(function(r) { return r.join('\t'); }).join('\n');
  }

  label = BANK_LABELS[bank] || bank;
  src = getSourceType(bank);

  // ===== CAPA 1: Parser de reglas (gratis, <100ms) =====
  if (isPdf) {
    if (bank === 'bchile') parsed = parseBChilePdf(rawText);
    else if (bank === 'visa') parsed = parseVisaPdf(rawText);
    else if (bank === 'cmr') parsed = parseCMRPdf(rawText);
    else if (bank === 'bice') parsed = parseBChilePdf(rawText);
    else if (src === 'tc') parsed = parseTcGenericPdf(rawText);
    else if (bank !== 'desconocido') parsed = parseGenericPdf(rawText);

    // Fallback chain
    if (parsed.length === 0) { parsed = parseGenericPdf(rawText); if (parsed.length > 0 && bank === 'desconocido') label = 'Auto-detectado (Banco)'; }
    if (parsed.length === 0) { parsed = parseTcGenericPdf(rawText); if (parsed.length > 0 && bank === 'desconocido') label = 'Auto-detectado (TC)'; }
    if (parsed.length === 0) { parsed = parseBChilePdf(rawText); if (parsed.length > 0 && bank === 'desconocido') label = 'Auto-detectado'; }
    if (parsed.length === 0) { parsed = parseVisaPdf(rawText); if (parsed.length > 0 && bank === 'desconocido') label = 'Auto-detectado'; }
    if (parsed.length === 0) { parsed = parseCMRPdf(rawText); if (parsed.length > 0 && bank === 'desconocido') label = 'Auto-detectado'; }
  } else {
    if (bank === 'bice') parsed = parseBICE(wb);
    else if (bank === 'cmr') parsed = parseCMRExcel(wb);
    else if (bank === 'visa') parsed = parseVisaExcel(wb);
    else if (bank === 'bchile') parsed = parseBChileExcel(wb);
    else if (bank !== 'desconocido') parsed = parseGenericExcel(wb, src);

    if (parsed.length === 0) {
      parsed = parseGenericExcel(wb, src);
      if (parsed.length > 0 && bank === 'desconocido') label = 'Auto-detectado';
    }
  }

  // Set source type
  if (parsed.length > 0) {
    if (src === 'tc') parsed.forEach(function(tx) { tx.source = 'tc'; });
    else if (bank !== 'desconocido') parsed.forEach(function(tx) { tx.source = 'banco'; });
  }

  // ===== VALIDACION: si Capa 1 produjo resultados sospechosos, descartar =====
  if (parsed.length > 0) {
    // Detectar montos absurdos (> 500M pesos) — señal de parseo malo
    var suspicious = parsed.filter(function(tx) { return tx.amount > 500000000; });
    if (suspicious.length > parsed.length * 0.1) {
      console.warn('Capa 1 produjo ' + suspicious.length + '/' + parsed.length + ' montos > 500M, descartando resultados');
      parsed = [];
      label = '';
    }
  }

  // ===== CAPA 2: Claude AI via Edge Function (~$0.01, ~2 seg) =====
  if (parsed.length === 0 && rawText.length > 50) {
    parserUsed = 'ai';
    var statusEl = document.getElementById('importStatus');
    if (statusEl) {
      statusEl.innerHTML = '<span class="ai-parsing-indicator"><span class="ai-spinner"></span> Analizando con IA...</span>';
      statusEl.className = 'import-status';
    }
    try {
      var aiResult = await callAIParse(rawText, file.name);
      if (aiResult && aiResult.transactions && aiResult.transactions.length > 0) {
        var aiBank = aiResult.bank || 'IA';
        var aiSrc = aiResult.account_type === 'tarjeta_credito' ? 'tc' : 'banco';
        label = aiBank + ' (IA)';
        parsed = aiResult.transactions.map(function(t) {
          return {
            date: t.date || '',
            description: t.description || '',
            amount: Math.abs(parseInt(t.amount) || 0),
            type: t.type === 'ingreso' ? 'ingreso' : 'gasto',
            source: aiSrc
          };
        }).filter(function(t) { return t.date && t.amount > 0; });

        // Auto-learning: save bank format for future rule-based parsing
        if (parsed.length > 0 && aiResult.fingerprint_keywords && aiResult.fingerprint_keywords.length > 0) {
          saveBankFormat({
            bank_name: aiBank,
            fingerprint_keywords: aiResult.fingerprint_keywords,
            column_mapping: aiResult.column_mapping || {},
            date_format: aiResult.date_format || '',
            source_type: aiSrc,
            sample_headers: []
          }).catch(function(e) { console.warn('saveBankFormat error:', e); });
        }
      }
    } catch (aiErr) {
      console.warn('AI parse failed:', aiErr);
    }
  }

  // ===== CAPA 3: Mapeo manual con preview =====
  if (parsed.length === 0) {
    parserUsed = 'manual';
    var manualResult = await showManualMappingModal(rawRows, rawText, isPdf);
    if (manualResult && manualResult.length > 0) {
      parsed = manualResult;
      label = 'Mapeo manual';
    }
  }

  // ===== LOGGING (silencioso, no bloquea) =====
  logImport({
    file_name: file.name,
    detected_bank: bank,
    parser_used: parserUsed,
    transactions_found: parsed.length,
    success: parsed.length > 0,
    error_message: parsed.length === 0 ? 'No transactions found' : null,
    text_preview: rawText.substring(0, 500)
  }).catch(function() {});

  if (parsed.length === 0) {
    return { results: { added: 0, dupes: 0, total: 0, batch_id: null }, source: 'No reconocido' };
  }

  var batchId = gid();
  return { results: await addParsedTransactions(parsed, batchId), source: label, parserUsed: parserUsed };
}

// ===== MANUAL MAPPING MODAL =====
function showManualMappingModal(rawRows, rawText, isPdf) {
  return new Promise(function(resolve) {
    // Build rows from text if no rawRows (PDF)
    var rows = rawRows;
    if (!rows || rows.length < 2) {
      rows = rawText.split('\n').filter(function(l) { return l.trim(); }).map(function(l) {
        return l.split(/\t|  +/).map(function(c) { return c.trim(); });
      });
    }
    if (rows.length < 2) { resolve([]); return; }

    // Take first 15 rows for preview
    var previewRows = rows.slice(0, 15);
    var maxCols = 0;
    previewRows.forEach(function(r) { if (r.length > maxCols) maxCols = r.length; });
    if (maxCols < 2 || maxCols > 20) { resolve([]); return; }

    var modal = document.getElementById('manualMappingModal');
    var tableHtml = '<table class="manual-map-table"><thead><tr>';

    // Column dropdowns
    for (var c = 0; c < maxCols; c++) {
      tableHtml += '<th><select class="manual-col-select" data-col="' + c + '">' +
        '<option value="ignorar">Ignorar</option>' +
        '<option value="fecha">Fecha</option>' +
        '<option value="descripcion">Descripcion</option>' +
        '<option value="monto">Monto</option>' +
        '<option value="cargo">Cargo</option>' +
        '<option value="abono">Abono</option>' +
        '</select></th>';
    }
    tableHtml += '</tr></thead><tbody>';

    // Data rows
    previewRows.forEach(function(row) {
      tableHtml += '<tr>';
      for (var c = 0; c < maxCols; c++) {
        var val = row[c] != null ? String(row[c]) : '';
        tableHtml += '<td>' + val.substring(0, 40) + '</td>';
      }
      tableHtml += '</tr>';
    });
    tableHtml += '</tbody></table>';

    var content = document.getElementById('manualMappingContent');
    content.innerHTML =
      '<p style="margin-bottom:12px;color:var(--text-secondary);font-size:0.85rem">No pudimos leer tu cartola automaticamente. Marca las columnas para importar:</p>' +
      tableHtml +
      '<div style="display:flex;gap:12px;margin-top:16px;align-items:center;flex-wrap:wrap">' +
        '<label style="font-size:0.85rem;font-weight:500">Banco: <input type="text" id="manualBankName" placeholder="Ej: Banco Consorcio" style="padding:6px 10px;border:1px solid var(--border);border-radius:6px;font-size:0.85rem;width:180px"></label>' +
        '<label style="font-size:0.85rem;font-weight:500;display:flex;align-items:center;gap:6px"><input type="radio" name="manualSourceType" value="banco" checked> Cuenta</label>' +
        '<label style="font-size:0.85rem;font-weight:500;display:flex;align-items:center;gap:6px"><input type="radio" name="manualSourceType" value="tc"> Tarjeta</label>' +
      '</div>' +
      '<div style="display:flex;gap:12px;margin-top:16px">' +
        '<button class="btn btn-primary" id="manualMapImportBtn">Importar con este mapeo</button>' +
        '<button class="btn btn-secondary" id="manualMapCancelBtn">Cancelar</button>' +
      '</div>';

    // Auto-detect column types from first data rows
    autoDetectColumns(previewRows, maxCols);

    modal.classList.add('open');

    document.getElementById('manualMapCancelBtn').onclick = function() {
      modal.classList.remove('open');
      resolve([]);
    };

    document.getElementById('manualMapImportBtn').onclick = function() {
      // Read column mapping
      var mapping = {};
      var selects = content.querySelectorAll('.manual-col-select');
      selects.forEach(function(sel) {
        var col = parseInt(sel.getAttribute('data-col'));
        if (sel.value !== 'ignorar') mapping[sel.value] = col;
      });

      if (!mapping.fecha || (!mapping.monto && !mapping.cargo)) {
        alert('Debes seleccionar al menos una columna de Fecha y Monto (o Cargo).');
        return;
      }

      var sourceType = document.querySelector('input[name="manualSourceType"]:checked').value;
      var bankName = document.getElementById('manualBankName').value.trim() || 'Manual';

      // Parse all rows (skip obvious header rows)
      var results = [];
      for (var r = 0; r < rows.length; r++) {
        var row = rows[r];
        var dateVal = row[mapping.fecha];
        if (!dateVal) continue;
        var d = parseFlexDate(dateVal);
        if (!d) continue;

        var desc = mapping.descripcion != null ? String(row[mapping.descripcion] || '') : '';
        var amount = 0;
        if (mapping.monto != null) {
          amount = Math.abs(parseFloat(String(row[mapping.monto]).replace(/[^\d.,-]/g, '').replace(/\./g, '').replace(',', '.')) || 0);
        } else {
          var cargo = Math.abs(parseFloat(String(row[mapping.cargo] || '0').replace(/[^\d.,-]/g, '').replace(/\./g, '').replace(',', '.')) || 0);
          var abono = mapping.abono != null ? Math.abs(parseFloat(String(row[mapping.abono] || '0').replace(/[^\d.,-]/g, '').replace(/\./g, '').replace(',', '.')) || 0) : 0;
          amount = cargo || abono;
        }

        if (amount <= 0) continue;

        var type = 'gasto';
        if (mapping.abono != null && mapping.cargo != null) {
          var cargoVal = Math.abs(parseFloat(String(row[mapping.cargo] || '0').replace(/[^\d.,-]/g, '').replace(/\./g, '').replace(',', '.')) || 0);
          var abonoVal = Math.abs(parseFloat(String(row[mapping.abono] || '0').replace(/[^\d.,-]/g, '').replace(/\./g, '').replace(',', '.')) || 0);
          type = (abonoVal > 0 && cargoVal === 0) ? 'ingreso' : 'gasto';
        } else if (sourceType === 'tc') {
          type = 'gasto';
        }

        results.push({
          date: d, description: desc.trim(), amount: Math.round(amount),
          type: type, source: sourceType
        });
      }

      // Save format for auto-learning
      if (results.length > 0) {
        var keywords = [];
        if (bankName) keywords.push(bankName.toLowerCase());
        // Extract keywords from first row (likely headers)
        if (rows[0]) {
          rows[0].forEach(function(cell) {
            var v = String(cell).toLowerCase().trim();
            if (v.length > 2 && v.length < 30) keywords.push(v);
          });
        }
        saveBankFormat({
          bank_name: bankName,
          fingerprint_keywords: keywords.slice(0, 6),
          column_mapping: mapping,
          date_format: '',
          source_type: sourceType,
          sample_headers: rows[0] ? rows[0].map(String) : []
        }).catch(function() {});
      }

      modal.classList.remove('open');
      resolve(results);
    };
  });
}

function autoDetectColumns(previewRows, maxCols) {
  // Try to guess column types from content
  var selects = document.querySelectorAll('.manual-col-select');
  for (var c = 0; c < maxCols; c++) {
    var dateCount = 0, numCount = 0, textCount = 0;
    for (var r = 0; r < previewRows.length; r++) {
      var val = String(previewRows[r][c] || '').trim();
      if (!val) continue;
      if (/^\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}$/.test(val) || /^\d{4}-\d{2}-\d{2}$/.test(val) || /^\d{1,2}\s+(ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic)/i.test(val)) {
        dateCount++;
      } else if (/^[\d.,\-$]+$/.test(val.replace(/\s/g, '')) && parseFloat(val.replace(/[^\d.,-]/g, '').replace(/\./g, '').replace(',', '.')) > 0) {
        numCount++;
      } else if (val.length > 3) {
        textCount++;
      }
    }
    var total = previewRows.length;
    var sel = selects[c];
    if (!sel) continue;
    if (dateCount > total * 0.3) sel.value = 'fecha';
    else if (textCount > total * 0.3 && textCount > numCount) sel.value = 'descripcion';
    else if (numCount > total * 0.3) {
      // First number column = cargo, second = abono
      var alreadyHasCargo = Array.from(selects).some(function(s) { return s.value === 'cargo' || s.value === 'monto'; });
      sel.value = alreadyHasCargo ? 'abono' : 'cargo';
    }
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
      // Guardar en historial de importaciones con totales
      if (r.added > 0 && r.batch_id) {
        var batchTxs = transactions.filter(function(tx) { return tx.batch_id === r.batch_id; });
        var totalIngresos = 0, totalGastos = 0;
        batchTxs.forEach(function(tx) {
          if (tx.type === 'ingreso') totalIngresos += tx.amount;
          else totalGastos += tx.amount;
        });
        addImportHistory({
          batch_id: r.batch_id,
          file_name: files[i].name,
          source: result.source,
          parser_used: result.parserUsed || 'rules',
          count: r.added,
          total_ingresos: totalIngresos,
          total_gastos: totalGastos,
          date: new Date().toISOString()
        });
      }
    } catch (err) {
      messages.push(files[i].name + ': Error — ' + err.message);
    }
  }
  statusEl.innerHTML = '<strong>' + totalAdded + ' transacciones importadas</strong>' + (totalDupes > 0 ? ' (' + totalDupes + ' duplicadas ignoradas)' : '') + '<br><small>' + messages.join('<br>') + '</small>';
  statusEl.className = 'import-status success';
  document.getElementById('fileImport').value = '';
  refreshAll();
  renderImportHistory();
}

// ===== IMPORT HISTORY =====
function getImportHistory() {
  try {
    return JSON.parse(localStorage.getItem('import_history_' + currentUser.id) || '[]');
  } catch(e) { return []; }
}

function addImportHistory(entry) {
  var history = getImportHistory();
  history.unshift(entry);
  localStorage.setItem('import_history_' + currentUser.id, JSON.stringify(history));
}

function removeImportHistory(batchId) {
  var history = getImportHistory().filter(function(h) { return h.batch_id !== batchId; });
  localStorage.setItem('import_history_' + currentUser.id, JSON.stringify(history));
}

async function deleteImportBatch(batchId) {
  var batchTxIds = transactions.filter(function(t) { return t.batch_id === batchId; }).map(function(t) { return t.id; });
  if (batchTxIds.length === 0) { removeImportHistory(batchId); renderImportHistory(); return; }
  if (!confirm('Eliminar ' + batchTxIds.length + ' transacciones de esta importacion?')) return;

  // Delete from Supabase in batches
  for (var i = 0; i < batchTxIds.length; i += 100) {
    var batch = batchTxIds.slice(i, i + 100);
    await sb.from('transactions').delete().in('id', batch);
  }
  // Remove from local array
  transactions = transactions.filter(function(t) { return t.batch_id !== batchId; });
  removeImportHistory(batchId);
  renderImportHistory();
  refreshAll();
}

function renderImportHistory() {
  var container = document.getElementById('importHistoryList');
  if (!container) return;
  var history = getImportHistory();
  if (history.length === 0) {
    container.innerHTML = '<p style="color:var(--text-secondary);font-size:0.82rem">No hay importaciones recientes.</p>';
    return;
  }
  var html = '';
  history.forEach(function(h) {
    var d = new Date(h.date);
    var dateStr = d.toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' });
    var timeStr = d.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
    var parserBadge = h.parser_used === 'ai' ? '<span class="import-badge badge-ai">IA</span>' :
                      h.parser_used === 'manual' ? '<span class="import-badge badge-manual">Manual</span>' : '';
    var totalsHtml = '';
    if (h.total_ingresos || h.total_gastos) {
      totalsHtml = ' &middot; <span style="color:var(--green)">+' + fmt(h.total_ingresos || 0) + '</span> <span style="color:var(--red)">-' + fmt(h.total_gastos || 0) + '</span>';
    }
    html += '<div class="import-history-row">' +
      '<div class="import-history-info">' +
        '<strong>' + h.file_name + '</strong> ' + parserBadge +
        '<small>' + h.source + ' &middot; ' + h.count + ' transacciones' + totalsHtml + ' &middot; ' + dateStr + ' ' + timeStr + '</small>' +
      '</div>' +
      '<button class="btn-icon-delete" onclick="deleteImportBatch(\'' + h.batch_id + '\')" title="Eliminar esta importacion">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/></svg>' +
      '</button>' +
    '</div>';
  });
  container.innerHTML = html;
}
