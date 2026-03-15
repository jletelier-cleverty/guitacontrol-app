/* ============================================
   ESTRATEGIA — Perfil inversionista, portafolio,
   inversiones view, windfall advisor
   ============================================ */

// ---- TYPEFORM QUIZ ----

function tfSelect(btn) {
  var slide = btn.closest('.tf-slide');
  var q = slide.dataset.q;
  slide.querySelectorAll('.tf-opt').forEach(function(o) { o.classList.remove('selected'); });
  btn.classList.add('selected');
  tfAnswers[q] = parseInt(btn.dataset.val);
  setTimeout(function() { tfNext(); }, 300);
}

function tfNext() {
  if (tfCurrentSlide >= tfTotalSlides) {
    tfShowResults();
    return;
  }
  tfCurrentSlide++;
  tfUpdateView();
}

function tfPrev() {
  if (tfCurrentSlide <= 1) return;
  tfCurrentSlide--;
  tfUpdateView();
}

function tfUpdateView() {
  document.querySelectorAll('.tf-slide').forEach(function(s) { s.classList.remove('active'); });
  var target = document.querySelector('.tf-slide[data-q="' + tfCurrentSlide + '"]');
  if (target) target.classList.add('active');
  document.getElementById('tfProgressFill').style.width = ((tfCurrentSlide / tfTotalSlides) * 100) + '%';
  document.getElementById('tfCounter').textContent = tfCurrentSlide + ' de ' + tfTotalSlides;
  document.getElementById('tfBack').style.visibility = tfCurrentSlide > 1 ? 'visible' : 'hidden';
}

function tfShowResults() {
  var score = 0;
  var count = 0;
  Object.keys(tfAnswers).forEach(function(k) { score += tfAnswers[k]; count++; });

  var inmoInterest = tfAnswers['6'] || 2;

  var avg = count > 0 ? score / count : 2;
  var profileType;
  if (avg <= 1.8) profileType = 'conservador';
  else if (avg <= 2.8) profileType = 'moderado';
  else profileType = 'agresivo';

  var p = JSON.parse(JSON.stringify(INVESTOR_PROFILES[profileType]));
  if (inmoInterest >= 3) {
    p.allocation.inmobiliario = Math.min(50, p.allocation.inmobiliario + 15);
    p.allocation.rentaFija = Math.max(5, p.allocation.rentaFija - 5);
    p.allocation.rentaVariable = Math.max(5, p.allocation.rentaVariable - 5);
    p.allocation.caja = Math.max(5, p.allocation.caja - 5);
  } else if (inmoInterest <= 1) {
    var reduction = Math.min(15, p.allocation.inmobiliario - 5);
    p.allocation.inmobiliario -= reduction;
    p.allocation.rentaVariable += Math.round(reduction * 0.6);
    p.allocation.rentaFija += Math.round(reduction * 0.4);
  }

  var intlInterest = tfAnswers['8'] || 2;

  renderEstrategia(profileType, p, inmoInterest, intlInterest);
}

function tfResetQuiz() {
  tfAnswers = {};
  tfCurrentSlide = 1;
  document.querySelectorAll('.tf-opt').forEach(function(o) { o.classList.remove('selected'); });
  tfUpdateView();
  document.getElementById('estrategiaQuiz').style.display = '';
  document.getElementById('estrategiaResult').style.display = 'none';
  localStorage.removeItem('investor_profile');
  localStorage.removeItem('investor_answers');
}

// ---- INVESTOR PROFILES ----

var INVESTOR_PROFILES = {
  conservador: {
    label: 'Conservador', icon: '\u{1F6E1}\ufe0f',
    desc: 'Priorizas la seguridad de tu capital. Prefieres inversiones estables con menor riesgo, aunque el retorno sea m\u00e1s bajo. Tu foco est\u00e1 en preservar y crecer gradualmente.',
    allocation: { inmobiliario: 25, rentaFija: 40, rentaVariable: 10, caja: 25 }
  },
  moderado: {
    label: 'Moderado', icon: '\u2696\ufe0f',
    desc: 'Buscas un balance entre crecimiento y seguridad. Est\u00e1s dispuesto a asumir algo de riesgo por mejor retorno, pero sin perder el sue\u00f1o.',
    allocation: { inmobiliario: 30, rentaFija: 25, rentaVariable: 25, caja: 20 }
  },
  agresivo: {
    label: 'Agresivo', icon: '\u{1F680}',
    desc: 'Apuntas al m\u00e1ximo crecimiento a largo plazo. Toleras volatilidad y ca\u00eddas temporales porque inviertes con horizonte amplio y disciplina.',
    allocation: { inmobiliario: 25, rentaFija: 10, rentaVariable: 50, caja: 15 }
  }
};

// ---- COUNTRY INSTRUMENT DATABASE ----

var COUNTRY_INSTRUMENTS = {
  CL: {
    rentaFija: {
      title: '\u{1F4C4} Renta Fija',
      tooltip: 'Instrumentos de deuda con retorno predecible. Menor riesgo, ideal para capital que necesitas en 1-3 a\u00f1os.',
      instruments: [
        { name: 'DAP Banco BICE 360d', return1m: 0.47, return6m: 2.8, return1y: 5.8, risk: 'Sin riesgo', access: 'F\u00e1cil', minInvest: '$500K', tooltip: 'Dep\u00f3sito a plazo fijo a 1 a\u00f1o. Garantizado por el banco, cubierto por garant\u00eda estatal hasta 108 UF.' },
        { name: 'DAP Banco Chile 360d', return1m: 0.45, return6m: 2.7, return1y: 5.5, risk: 'Sin riesgo', access: 'F\u00e1cil', minInvest: '$250K', tooltip: 'Dep\u00f3sito a plazo en Banco Chile. Mismo mecanismo, levemente menor tasa.' },
        { name: 'DAP BCI 180d', return1m: 0.43, return6m: 2.6, return1y: 5.2, risk: 'Sin riesgo', access: 'F\u00e1cil', minInvest: '$500K', tooltip: 'Plazo m\u00e1s corto (6 meses), tasa algo menor pero m\u00e1s liquidez.' },
        { name: 'FM Banchile Dep\u00f3sito Plus', return1m: 0.44, return6m: 2.7, return1y: 5.4, risk: 'Bajo', access: 'F\u00e1cil', minInvest: '$5K', tooltip: 'Fondo mutuo que invierte en dep\u00f3sitos a plazo de distintos bancos. Rescate en 24h.' },
        { name: 'FM BCI Rendimiento', return1m: 0.42, return6m: 2.5, return1y: 5.1, risk: 'Bajo', access: 'F\u00e1cil', minInvest: '$5K', tooltip: 'Fondo mutuo de renta fija nacional. Diversifica entre bonos y dep\u00f3sitos.' },
        { name: 'FM LarrainVial Ahorro Capital', return1m: 0.40, return6m: 2.4, return1y: 4.9, risk: 'Bajo', access: 'F\u00e1cil', minInvest: '$10K', tooltip: 'Fondo conservador de LarrainVial. Invierte en instrumentos de corto plazo.' },
        { name: 'FM Security Renta Corto Plazo', return1m: 0.39, return6m: 2.3, return1y: 4.7, risk: 'Bajo', access: 'F\u00e1cil', minInvest: '$10K', tooltip: 'Fondo que invierte en papeles de deuda de corto plazo, bajo riesgo.' },
        { name: 'FM Ita\u00fa Renta Fija Chile', return1m: 0.37, return6m: 2.2, return1y: 4.5, risk: 'Bajo', access: 'F\u00e1cil', minInvest: '$5K', tooltip: 'Fondo de renta fija con exposici\u00f3n a bonos del gobierno y corporativos chilenos.' },
        { name: 'Bono BCU 5 a\u00f1os', return1m: 0.35, return6m: 2.1, return1y: 4.2, risk: 'Bajo', access: 'Medio', minInvest: '$1M', tooltip: 'Bono del Banco Central en UF. Renta real asegurada, pero plazo largo. Ideal v\u00eda APV.' },
        { name: 'FM Fintual Conservative Clooney', return1m: 0.32, return6m: 1.9, return1y: 3.9, risk: 'Bajo', access: 'F\u00e1cil', minInvest: '$1', tooltip: 'Fondo Fintual m\u00e1s conservador. 100% renta fija, comisi\u00f3n 0.49%/a\u00f1o. App f\u00e1cil de usar.' }
      ]
    },
    rentaVariable: {
      title: '\u{1F4C8} Renta Variable',
      tooltip: 'Acciones y ETFs. Mayor potencial de retorno pero con volatilidad. Horizonte recomendado: +5 a\u00f1os.',
      instruments: [
        { name: 'ETF VOO (S&P 500)', return1m: 2.8, return6m: 14.1, return1y: 24.3, risk: 'Alto', access: 'F\u00e1cil', minInvest: '$10K', tooltip: 'Las 500 empresas m\u00e1s grandes de EEUU. Se compra v\u00eda Racional, Fintual o broker internacional.' },
        { name: 'ETF VT (Total World)', return1m: 2.1, return6m: 10.5, return1y: 19.2, risk: 'Alto', access: 'F\u00e1cil', minInvest: '$10K', tooltip: 'Diversificaci\u00f3n mundial: +9.000 empresas de todo el planeta. Menos concentrado que VOO.' },
        { name: 'ETF QQQ (Nasdaq 100)', return1m: 3.5, return6m: 16.2, return1y: 28.7, risk: 'Muy Alto', access: 'F\u00e1cil', minInvest: '$10K', tooltip: 'Las 100 tech m\u00e1s grandes (Apple, Google, Nvidia). Muy vol\u00e1til pero alt\u00edsimo retorno hist\u00f3rico.' },
        { name: 'FM Fintual Risky Norris', return1m: 2.3, return6m: 12.0, return1y: 22.1, risk: 'Alto', access: 'F\u00e1cil', minInvest: '$1', tooltip: 'Fondo Fintual m\u00e1s agresivo. ~75% renta variable internacional. Comisi\u00f3n 0.49%/a\u00f1o.' },
        { name: 'FM Banchile Acciones Chile', return1m: 1.8, return6m: 8.2, return1y: 15.3, risk: 'Alto', access: 'F\u00e1cil', minInvest: '$50K', tooltip: 'Exposici\u00f3n al IPSA (mercado accionario chileno). M\u00e1s correlacionado con econom\u00eda local.' },
        { name: 'ETF EWZ (Brasil)', return1m: -0.5, return6m: 5.8, return1y: 12.8, risk: 'Alto', access: 'Medio', minInvest: '$10K', tooltip: 'ETF de acciones brasile\u00f1as. Diversificaci\u00f3n regional en LATAM.' },
        { name: 'FM BTG Pactual Acciones LATAM', return1m: 0.9, return6m: 7.5, return1y: 14.6, risk: 'Alto', access: 'Medio', minInvest: '$100K', tooltip: 'Fondo de acciones latinoamericanas. Diversifica entre Chile, Brasil, M\u00e9xico, Per\u00fa.' },
        { name: 'ETF SCHD (Dividendos US)', return1m: 1.5, return6m: 9.2, return1y: 16.8, risk: 'Medio-Alto', access: 'F\u00e1cil', minInvest: '$10K', tooltip: 'ETF de empresas que pagan altos dividendos en EEUU. Menor volatilidad que S&P 500.' },
        { name: 'FM LarrainVial Acc. Nac.', return1m: 1.6, return6m: 7.0, return1y: 13.5, risk: 'Alto', access: 'F\u00e1cil', minInvest: '$50K', tooltip: 'Fondo de acciones nacionales. Portfolio de blue chips chilenas.' },
        { name: 'ETF VWO (Emergentes)', return1m: 0.2, return6m: 4.8, return1y: 10.4, risk: 'Alto', access: 'Medio', minInvest: '$10K', tooltip: 'ETF de mercados emergentes (China, India, Brasil, etc). Alta volatilidad, alto potencial.' }
      ]
    },
    caja: {
      title: '\u{1F4B5} Caja / Emergencia',
      tooltip: 'Liquidez inmediata o en pocos d\u00edas. Para tu fondo de emergencia (3-6 meses de gastos). Prioriza acceso r\u00e1pido sobre rentabilidad.',
      instruments: [
        { name: 'Cuenta 2 AFP Habitat', return1m: 0.37, return6m: 2.2, return1y: 4.5, risk: 'Bajo', access: 'Inmediato', minInvest: '$0', tooltip: 'Ahorro voluntario en tu AFP. Rescate en 2-4 d\u00edas h\u00e1biles, sin costo. Puedes elegir fondo A-E.' },
        { name: 'Cuenta 2 AFP Modelo', return1m: 0.35, return6m: 2.1, return1y: 4.3, risk: 'Bajo', access: 'Inmediato', minInvest: '$0', tooltip: 'Similar a Habitat. AFP con comisi\u00f3n m\u00e1s baja del mercado.' },
        { name: 'FM Money Market BCI', return1m: 0.34, return6m: 2.0, return1y: 4.1, risk: 'Muy Bajo', access: 'Inmediato', minInvest: '$5K', tooltip: 'Fondo money market: rescate mismo d\u00eda. Invierte en papeles ultracortos.' },
        { name: 'FM Money Market Banchile', return1m: 0.32, return6m: 1.9, return1y: 3.9, risk: 'Muy Bajo', access: 'Inmediato', minInvest: '$5K', tooltip: 'Fondo de mercado monetario de Banco Chile. Rescate en el d\u00eda.' },
        { name: 'Cuenta remunerada Banco BICE', return1m: 0.29, return6m: 1.7, return1y: 3.5, risk: 'Sin riesgo', access: 'Inmediato', minInvest: '$0', tooltip: 'Cuenta vista que paga inter\u00e9s. Sin restricci\u00f3n de retiro, acceso 24/7.' },
        { name: 'Cuenta remunerada Banco Falabella', return1m: 0.27, return6m: 1.6, return1y: 3.3, risk: 'Sin riesgo', access: 'Inmediato', minInvest: '$0', tooltip: 'Cuenta vista remunerada. Paga inter\u00e9s diario sobre el saldo.' },
        { name: 'FM Fintual Moderate Clooney', return1m: 0.31, return6m: 1.9, return1y: 3.8, risk: 'Bajo', access: 'F\u00e1cil', minInvest: '$1', tooltip: 'Fondo Fintual moderado. Rescate en 3-5 d\u00edas. Buena opci\u00f3n para fondo de emergencia.' },
        { name: 'Mercado Pago Rendimiento', return1m: 0.25, return6m: 1.5, return1y: 3.0, risk: 'Sin riesgo', access: 'Inmediato', minInvest: '$0', tooltip: 'Tu saldo en Mercado Pago genera inter\u00e9s diario. Ultra l\u00edquido.' },
        { name: 'FM Security Money Market', return1m: 0.30, return6m: 1.8, return1y: 3.7, risk: 'Muy Bajo', access: 'Inmediato', minInvest: '$10K', tooltip: 'Fondo monetario de Security. Rescate mismo d\u00eda.' },
        { name: 'Coopeuch Ahorro a la Vista', return1m: 0.26, return6m: 1.5, return1y: 3.1, risk: 'Sin riesgo', access: 'Inmediato', minInvest: '$0', tooltip: 'Cuenta de ahorro en Coopeuch. Sin costo, retiro libre.' }
      ]
    },
    inmobiliario: {
      title: '\u{1F3E0} Inmobiliario',
      tooltip: 'Inversi\u00f3n en propiedades: plusval\u00eda + arriendo. Requiere cr\u00e9dito hipotecario. Te mostramos comunas alcanzables seg\u00fan tu ingreso.',
      comunas: [
        { name: '\u00d1u\u00f1oa', avgUF: 4200, plusvalia1y: 6.8, plusvalia5y: 42, plusvalia10y: 95, arriendoPct: 5.2, capRate: 4.8, tooltip: 'Alta demanda, cercan\u00eda a metro, mix residencial-comercial. Buena plusval\u00eda hist\u00f3rica.' },
        { name: 'Santiago Centro', avgUF: 2800, plusvalia1y: 4.2, plusvalia5y: 22, plusvalia10y: 55, arriendoPct: 6.8, capRate: 5.5, tooltip: 'Ticket m\u00e1s bajo, alta rotaci\u00f3n de arriendo. Ideal para primera inversi\u00f3n DFL2.' },
        { name: 'La Florida', avgUF: 3200, plusvalia1y: 5.5, plusvalia5y: 35, plusvalia10y: 78, arriendoPct: 5.8, capRate: 5.0, tooltip: 'Gran conectividad (metro), comuna consolidada. Buena relaci\u00f3n precio/arriendo.' },
        { name: 'Macul', avgUF: 3500, plusvalia1y: 7.2, plusvalia5y: 48, plusvalia10y: 110, arriendoPct: 5.5, capRate: 5.1, tooltip: 'Zona en desarrollo cerca de \u00d1u\u00f1oa. Plusval\u00eda al alza por nuevos proyectos y metro.' },
        { name: 'Estaci\u00f3n Central', avgUF: 2600, plusvalia1y: 5.0, plusvalia5y: 28, plusvalia10y: 62, arriendoPct: 7.2, capRate: 5.8, tooltip: 'Ticket bajo, muy alta demanda de arriendo. Alto cap rate pero ojo con la plusval\u00eda largo plazo.' },
        { name: 'San Miguel', avgUF: 3800, plusvalia1y: 6.5, plusvalia5y: 40, plusvalia10y: 88, arriendoPct: 5.3, capRate: 4.9, tooltip: 'Comuna consolidada, buena calidad de vida. Plusval\u00eda estable.' },
        { name: 'Providencia', avgUF: 6500, plusvalia1y: 5.8, plusvalia5y: 32, plusvalia10y: 72, arriendoPct: 4.5, capRate: 4.0, tooltip: 'Premium. Menor cap rate pero muy segura como inversi\u00f3n. Requiere mayor pie.' },
        { name: 'Independencia', avgUF: 2900, plusvalia1y: 4.8, plusvalia5y: 30, plusvalia10y: 68, arriendoPct: 6.5, capRate: 5.3, tooltip: 'Cercan\u00eda a hospitales y universidades. Buena demanda estudiantil y profesional.' },
        { name: 'Maipu', avgUF: 2400, plusvalia1y: 4.5, plusvalia5y: 25, plusvalia10y: 58, arriendoPct: 6.0, capRate: 5.2, tooltip: 'Ticket muy accesible. Gran cantidad de oferta nueva. Ideal primer depto inversi\u00f3n.' },
        { name: 'Las Condes', avgUF: 8500, plusvalia1y: 4.0, plusvalia5y: 28, plusvalia10y: 65, arriendoPct: 3.8, capRate: 3.5, tooltip: 'Zona premium. Baja rentabilidad por arriendo pero alta seguridad patrimonial.' }
      ],
      fondos: [
        { name: 'FM Inmobiliario BTG Pactual', return1m: 0.7, return6m: 4.2, return1y: 8.8, risk: 'Medio', access: 'F\u00e1cil', minInvest: '$100K', tooltip: 'Fondo que invierte en oficinas y locales comerciales. No necesitas comprar propiedad.' },
        { name: 'FM Toesca Rentas Inmobiliarias', return1m: 0.6, return6m: 3.6, return1y: 7.5, risk: 'Medio', access: 'Medio', minInvest: '$500K', tooltip: 'Fondo de renta inmobiliaria con activos diversificados en Chile.' },
        { name: 'FM Credicorp Capital Inmob.', return1m: 0.5, return6m: 3.3, return1y: 6.9, risk: 'Medio', access: 'Medio', minInvest: '$1M', tooltip: 'Fondo inmobiliario con foco en activos comerciales e industriales.' }
      ]
    }
  },
  PE: {
    rentaFija: {
      title: '\u{1F4C4} Renta Fija', tooltip: 'Dep\u00f3sitos y fondos de deuda en soles.',
      instruments: [
        { name: 'Dep\u00f3sito BCP 360d', return1m: 0.53, return6m: 3.2, return1y: 6.5, risk: 'Sin riesgo', access: 'F\u00e1cil', minInvest: 'S/1,000', tooltip: 'Dep\u00f3sito a plazo en Banco de Cr\u00e9dito del Per\u00fa.' },
        { name: 'Dep\u00f3sito Interbank 360d', return1m: 0.51, return6m: 3.0, return1y: 6.2, risk: 'Sin riesgo', access: 'F\u00e1cil', minInvest: 'S/500', tooltip: 'Dep\u00f3sito a plazo fijo en Interbank.' },
        { name: 'FM Sura Renta Fija Soles', return1m: 0.47, return6m: 2.8, return1y: 5.8, risk: 'Bajo', access: 'F\u00e1cil', minInvest: 'S/100', tooltip: 'Fondo mutuo de deuda peruana en soles.' },
        { name: 'FM Credicorp RF Corto Plazo', return1m: 0.45, return6m: 2.7, return1y: 5.5, risk: 'Bajo', access: 'F\u00e1cil', minInvest: 'S/500', tooltip: 'Fondo conservador de Credicorp Capital.' },
        { name: 'FM Scotia Fondos Conservador', return1m: 0.43, return6m: 2.6, return1y: 5.3, risk: 'Bajo', access: 'F\u00e1cil', minInvest: 'S/100', tooltip: 'Fondo Scotiabank para perfil conservador.' }
      ]
    },
    rentaVariable: {
      title: '\u{1F4C8} Renta Variable', tooltip: 'Acciones y ETFs accesibles desde Per\u00fa.',
      instruments: [
        { name: 'ETF VOO (S&P 500)', return1m: 2.8, return6m: 14.1, return1y: 24.3, risk: 'Alto', access: 'Medio', minInvest: 'S/500', tooltip: 'V\u00eda Tyba o broker. Las 500 empresas m\u00e1s grandes de EEUU.' },
        { name: 'FM Sura Acciones', return1m: 1.2, return6m: 7.5, return1y: 14.2, risk: 'Alto', access: 'F\u00e1cil', minInvest: 'S/100', tooltip: 'Fondo de acciones de Sura, exposici\u00f3n al mercado peruano y regional.' },
        { name: 'FM Credicorp Acciones', return1m: 0.9, return6m: 6.5, return1y: 12.8, risk: 'Alto', access: 'F\u00e1cil', minInvest: 'S/500', tooltip: 'Fondo de acciones peruanas de Credicorp.' },
        { name: 'ETF EPU (Per\u00fa)', return1m: 0.7, return6m: 5.2, return1y: 10.5, risk: 'Alto', access: 'Medio', minInvest: 'S/500', tooltip: 'ETF del mercado peruano listado en NYSE.' },
        { name: 'FM BBVA Agresivo', return1m: 1.5, return6m: 8.5, return1y: 16.1, risk: 'Alto', access: 'F\u00e1cil', minInvest: 'S/100', tooltip: 'Fondo agresivo de BBVA Per\u00fa con exposici\u00f3n global.' }
      ]
    },
    caja: {
      title: '\u{1F4B5} Caja / Emergencia', tooltip: 'Liquidez para tu fondo de emergencia en soles.',
      instruments: [
        { name: 'Cuenta Ahorro BCP', return1m: 0.29, return6m: 1.7, return1y: 3.5, risk: 'Sin riesgo', access: 'Inmediato', minInvest: 'S/0', tooltip: 'Cuenta de ahorro del BCP con inter\u00e9s.' },
        { name: 'FM Sura Money Market', return1m: 0.33, return6m: 2.0, return1y: 4.0, risk: 'Muy Bajo', access: 'Inmediato', minInvest: 'S/100', tooltip: 'Fondo monetario con rescate r\u00e1pido.' },
        { name: 'Cuenta Ahorro Interbank', return1m: 0.26, return6m: 1.6, return1y: 3.2, risk: 'Sin riesgo', access: 'Inmediato', minInvest: 'S/0', tooltip: 'Cuenta de ahorro con inter\u00e9s diario.' },
        { name: 'Tyba Ahorro', return1m: 0.31, return6m: 1.9, return1y: 3.8, risk: 'Bajo', access: 'Inmediato', minInvest: 'S/1', tooltip: 'Ahorro digital en Tyba (Credicorp). F\u00e1cil y sin comisi\u00f3n.' },
        { name: 'FM BBVA Corto Plazo', return1m: 0.30, return6m: 1.8, return1y: 3.6, risk: 'Muy Bajo', access: 'Inmediato', minInvest: 'S/100', tooltip: 'Fondo money market de BBVA Per\u00fa.' }
      ]
    },
    inmobiliario: {
      title: '\u{1F3E0} Inmobiliario', tooltip: 'Inversi\u00f3n en propiedades en Per\u00fa.',
      comunas: [
        { name: 'Miraflores', avgUF: 2800, plusvalia1y: 5.5, plusvalia5y: 30, plusvalia10y: 68, arriendoPct: 5.0, capRate: 4.5, tooltip: 'Zona premium de Lima. Alta demanda de arriendo.' },
        { name: 'Jes\u00fas Mar\u00eda', avgUF: 1800, plusvalia1y: 6.2, plusvalia5y: 38, plusvalia10y: 82, arriendoPct: 6.0, capRate: 5.2, tooltip: 'Buena relaci\u00f3n precio/renta. Zona c\u00e9ntrica.' },
        { name: 'Pueblo Libre', avgUF: 1600, plusvalia1y: 5.8, plusvalia5y: 35, plusvalia10y: 75, arriendoPct: 6.5, capRate: 5.5, tooltip: 'Ticket accesible. Creciente demanda.' },
        { name: 'San Miguel', avgUF: 1400, plusvalia1y: 7.0, plusvalia5y: 45, plusvalia10y: 98, arriendoPct: 6.8, capRate: 5.8, tooltip: 'Zona en desarrollo con alta plusval\u00eda.' },
        { name: 'Magdalena', avgUF: 1700, plusvalia1y: 6.0, plusvalia5y: 36, plusvalia10y: 78, arriendoPct: 6.2, capRate: 5.3, tooltip: 'Cercan\u00eda a Miraflores, precio m\u00e1s accesible.' }
      ],
      fondos: [
        { name: 'Fibra Prime REIT', return1m: 0.6, return6m: 3.6, return1y: 7.5, risk: 'Medio', access: 'F\u00e1cil', minInvest: 'S/1,000', tooltip: 'REIT peruano. Inversi\u00f3n en inmuebles sin comprar directo.' }
      ]
    }
  }
};

// ---- HELPER FUNCTIONS ----

function getCountryInstruments() {
  return COUNTRY_INSTRUMENTS[profile.country] || COUNTRY_INSTRUMENTS['CL'];
}

function calcMaxPropertyTicket(monthlyIncome, financingPct) {
  var maxCuota = monthlyIncome * 0.25;
  var tasaMensual = 0.045 / 12;
  var plazo = 25 * 12;
  var maxCredito = maxCuota * (1 - Math.pow(1 + tasaMensual, -plazo)) / tasaMensual;
  var maxPropiedad = maxCredito / (financingPct / 100);
  return Math.round(maxPropiedad);
}

function getAffordableComunas(monthlyIncome) {
  var ci = getCountryInstruments();
  if (!ci.inmobiliario || !ci.inmobiliario.comunas) return [];
  var ufVal = profile.uf || 38800;

  var maxTicketCLP = calcMaxPropertyTicket(monthlyIncome, 90);
  var maxTicketUF = maxTicketCLP / ufVal;

  return ci.inmobiliario.comunas
    .filter(function(c) { return c.avgUF <= maxTicketUF * 1.1; })
    .map(function(c) {
      var totalReturn = c.plusvalia1y + c.arriendoPct;
      var pieCLP80 = Math.round(c.avgUF * 0.20 * ufVal);
      var pieCLP85 = Math.round(c.avgUF * 0.15 * ufVal);
      var pieCLP90 = Math.round(c.avgUF * 0.10 * ufVal);
      var cuota80 = calcCuotaMensual(c.avgUF * ufVal * 0.80);
      var cuota85 = calcCuotaMensual(c.avgUF * ufVal * 0.85);
      var cuota90 = calcCuotaMensual(c.avgUF * ufVal * 0.90);
      return {
        name: c.name, avgUF: c.avgUF, plusvalia1y: c.plusvalia1y,
        arriendoPct: c.arriendoPct, capRate: c.capRate, tooltip: c.tooltip,
        totalReturn: totalReturn, pieCLP80: pieCLP80, pieCLP85: pieCLP85, pieCLP90: pieCLP90,
        cuota80: cuota80, cuota85: cuota85, cuota90: cuota90,
        arriendoMensual: Math.round(c.avgUF * ufVal * (c.arriendoPct / 100) / 12)
      };
    })
    .sort(function(a, b) { return b.totalReturn - a.totalReturn; })
    .slice(0, 5);
}

function calcCuotaMensual(montoCredito) {
  var tasaMensual = 0.045 / 12;
  var plazo = 300;
  return Math.round(montoCredito * tasaMensual / (1 - Math.pow(1 + tasaMensual, -plazo)));
}

var APV_INFO = {
  title: '\u{1F3E6} APV \u2014 Ahorro Previsional Voluntario',
  detail: 'Beneficio tributario adicional a cualquier perfil',
  options: [
    { name: 'R\u00e9gimen A \u2014 Bonificaci\u00f3n 15%', detail: 'El Estado te regala 15% de lo que aportes (tope ~$600K/mes). Ideal si ganas < $4M/mes.', highlight: true },
    { name: 'R\u00e9gimen B \u2014 Descuento tributario', detail: 'Reduces tu base imponible. Conviene si est\u00e1s en tramo impositivo alto (> $4M/mes).' },
    { name: 'D\u00f3nde: Fintual, Habitat, AFP Modelo', detail: 'Compara comisiones y rentabilidad. Fintual cobra 0.49%/a\u00f1o, AFPs ~0.6-1.2%.' }
  ]
};

var ALLOC_COLORS = { inmobiliario: '#4f46e5', rentaFija: '#10b981', rentaVariable: '#f59e0b', caja: '#64748b' };
var ALLOC_LABELS = { inmobiliario: 'Inmobiliario', rentaFija: 'Renta Fija', rentaVariable: 'Renta Variable', caja: 'Caja / Emergencia' };

function calculateCurrentAllocation() {
  var totalProp = 0, totalCaja = 0, totalRF = 0, totalRV = 0;

  if (typeof properties !== 'undefined') {
    properties.forEach(function(p) {
      var equity = (p.currentValue || 0) - (p.debt || 0);
      totalProp += ufToCLP(equity);
    });
  }

  if (typeof accounts !== 'undefined') {
    accounts.forEach(function(a) {
      var t = a.type || '';
      if (t === 'dap' || t === 'rf' || t === 'apv') totalRF += (a.balance || 0);
      else if (t === 'acciones' || t === 'etf' || t === 'crypto') totalRV += (a.balance || 0);
      else totalCaja += (a.balance || 0);
    });
  }

  var ahorro = getTotalSavings();
  if (ahorro > 0) totalCaja += ahorro;

  var total = totalProp + totalRF + totalRV + totalCaja;
  if (total === 0) return { inmobiliario: 0, rentaFija: 0, rentaVariable: 0, caja: 0, total: 0 };

  return {
    inmobiliario: Math.round((totalProp / total) * 100),
    rentaFija: Math.round((totalRF / total) * 100),
    rentaVariable: Math.round((totalRV / total) * 100),
    caja: Math.round((totalCaja / total) * 100),
    total: total
  };
}

function toggleRecoMore(id, btn) {
  var el = document.getElementById(id);
  if (el.style.display === 'none') {
    el.style.display = '';
    btn.textContent = 'Ocultar \u25b4';
  } else {
    el.style.display = 'none';
    btn.textContent = 'Ver top 10 \u00faltimo a\u00f1o \u25be';
  }
}

// ---- RENDER ESTRATEGIA ----

function renderEstrategia(profileType, customProfile, inmoInterest, intlInterest) {
  var p = customProfile || INVESTOR_PROFILES[profileType];
  var current = calculateCurrentAllocation();
  var suggested = p.allocation;

  // Inmobiliario insight
  var inmoMsg = '';
  if (inmoInterest >= 3) inmoMsg = '<div style="margin-top:12px;padding:10px 14px;background:#eef2ff;border-radius:8px;font-size:0.83rem">\u{1F3E0} <strong>Foco inmobiliario alto:</strong> Tu portafolio sugerido prioriza inversi\u00f3n en propiedades.</div>';
  else if (inmoInterest <= 1) inmoMsg = '<div style="margin-top:12px;padding:10px 14px;background:#f0fdf4;border-radius:8px;font-size:0.83rem">\u{1F4B0} <strong>Prefieres liquidez:</strong> Tu portafolio prioriza instrumentos financieros sobre inmobiliario.</div>';

  // International insight
  var intlMsg = '';
  if (intlInterest >= 3) intlMsg = '<div style="margin-top:8px;padding:10px 14px;background:#fffbeb;border-radius:8px;font-size:0.83rem">\u{1F30D} <strong>Diversificaci\u00f3n global:</strong> Considera ETFs internacionales (VOO, VT) para no depender solo del mercado chileno.</div>';

  // Profile card
  document.getElementById('perfilCard').innerHTML =
    '<div class="perfil-icon">' + p.icon + '</div>' +
    '<div class="perfil-type">' + p.label + '</div>' +
    '<div class="perfil-desc">' + p.desc + '</div>' +
    inmoMsg + intlMsg;

  // Charts
  var keys = ['inmobiliario', 'rentaFija', 'rentaVariable', 'caja'];
  var colors = keys.map(function(k) { return ALLOC_COLORS[k]; });
  var labels = keys.map(function(k) { return ALLOC_LABELS[k]; });

  if (charts.actual) charts.actual.destroy();
  if (charts.sugerido) charts.sugerido.destroy();

  function makeLegend(data, containerId) {
    document.getElementById(containerId).innerHTML = keys.map(function(k, i) {
      return '<div class="portfolio-legend-item"><span class="portfolio-legend-dot" style="background:' + ALLOC_COLORS[k] + '"></span>' +
        ALLOC_LABELS[k] + ': <strong>' + data[i] + '%</strong></div>';
    }).join('');
  }

  var currentData = keys.map(function(k) { return current[k]; });
  var suggestedData = keys.map(function(k) { return suggested[k]; });

  var chartOpts = { responsive: true, cutout: '60%', plugins: { legend: { display: false } } };

  charts.actual = new Chart(document.getElementById('chartActual').getContext('2d'), {
    type: 'doughnut', data: { labels: labels, datasets: [{ data: currentData, backgroundColor: colors, borderWidth: 2, borderColor: '#fff' }] }, options: chartOpts
  });
  makeLegend(currentData, 'chartActualLegend');

  charts.sugerido = new Chart(document.getElementById('chartSugerido').getContext('2d'), {
    type: 'doughnut', data: { labels: labels, datasets: [{ data: suggestedData, backgroundColor: colors, borderWidth: 2, borderColor: '#fff' }] }, options: chartOpts
  });
  makeLegend(suggestedData, 'chartSugeridoLegend');

  // Gaps
  var gapsHtml = '';
  keys.forEach(function(k) {
    var diff = current[k] - suggested[k];
    var cls = diff > 5 ? 'gap-over' : diff < -5 ? 'gap-under' : 'gap-ok';
    var arrow = diff > 5 ? '\u2b06\ufe0f Sobreasignado' : diff < -5 ? '\u2b07\ufe0f Te falta' : '\u2705 OK';
    gapsHtml += '<div class="gap-item ' + cls + '"><span>' + ALLOC_LABELS[k] + '</span><span>Actual: ' + current[k] + '% \u2192 Sugerido: ' + suggested[k] + '% ' + arrow + '</span></div>';
  });
  document.getElementById('portfolioGaps').innerHTML = gapsHtml;

  // Recommendations with real instrument data
  var ci = getCountryInstruments();
  var recoHtml = '';
  var portfolioReturn = 0;

  function tip(text) {
    return '<span class="info-tip" tabindex="0" data-tip="' + text.replace(/"/g, '&quot;') + '">\u2139\ufe0f</span>';
  }

  function renderInstCard(inst, maxReturn) {
    var barWidth = Math.min(100, Math.max(5, (inst.return1y / (maxReturn || 30)) * 100));
    var barColor = inst.return1y >= 15 ? '#10b981' : inst.return1y >= 8 ? '#3b82f6' : inst.return1y >= 4 ? '#f59e0b' : '#64748b';
    return '<div class="inst-card">' +
      '<div class="inst-header"><strong>' + inst.name + '</strong>' + (inst.tooltip ? tip(inst.tooltip) : '') + '<span class="inst-return">+' + inst.return1y + '%</span></div>' +
      '<div class="inst-bar-wrap"><div class="inst-bar" style="width:' + barWidth + '%;background:' + barColor + '"></div></div>' +
      '<div class="inst-meta"><span>Riesgo: ' + inst.risk + '</span><span>Acceso: ' + inst.access + '</span><span>M\u00ednimo: ' + inst.minInvest + '</span></div>' +
      '</div>';
  }

  var finCats = ['rentaVariable', 'rentaFija', 'caja'];
  finCats.forEach(function(cat) {
    var catData = ci[cat];
    if (!catData || !catData.instruments) return;
    var allocPct = suggested[cat] || 0;
    if (allocPct <= 0) return;

    var avgRet = 0;
    catData.instruments.forEach(function(inst) { avgRet += inst.return1y; });
    avgRet = avgRet / catData.instruments.length;
    portfolioReturn += (avgRet * allocPct) / 100;

    var maxRet = Math.max.apply(null, catData.instruments.map(function(i) { return i.return1y; }));

    var segId = 'recoSeg_' + cat;
    recoHtml += '<div class="reco-segment">' +
      '<div class="reco-seg-header"><h4>' + catData.title + ' ' + (catData.tooltip ? tip(catData.tooltip) : '') + '</h4><span class="reco-alloc">' + allocPct + '% de tu portafolio</span></div>' +
      '<div class="reco-instruments">';

    catData.instruments.forEach(function(inst, idx) {
      if (idx === 3) recoHtml += '<div class="reco-more-wrap" id="' + segId + '" style="display:none">';
      recoHtml += renderInstCard(inst, maxRet);
    });
    if (catData.instruments.length > 3) {
      recoHtml += '</div>';
      recoHtml += '<button class="reco-toggle-btn" onclick="toggleRecoMore(\'' + segId + '\', this)">Ver top 10 \u00faltimo a\u00f1o \u25be</button>';
    }

    recoHtml += '</div></div>';
  });

  // Inmobiliario section
  var inmoAllocPct = suggested.inmobiliario || 0;
  if (inmoAllocPct > 0 && ci.inmobiliario) {
    var inmoData = ci.inmobiliario;

    var ingresos = (typeof transactions !== 'undefined') ? transactions.filter(function(t) { return t.type === 'ingreso'; }) : [];
    var monthlyIncome = 0;
    if (ingresos.length > 0) {
      monthlyIncome = ingresos.reduce(function(s,t) { return s + t.amount; }, 0) / Math.max(1, getUniqueMonths(ingresos));
    }
    if (monthlyIncome <= 0) monthlyIncome = profile.monthlySpend * 1.3;

    var affordableComunas = getAffordableComunas(monthlyIncome);

    var inmoReturn = 0;
    if (affordableComunas.length > 0) {
      affordableComunas.forEach(function(c) { inmoReturn += c.totalReturn; });
      inmoReturn = inmoReturn / affordableComunas.length;
    } else {
      inmoReturn = 9.5;
    }
    portfolioReturn += (inmoReturn * inmoAllocPct) / 100;

    recoHtml += '<div class="reco-segment">' +
      '<div class="reco-seg-header"><h4>' + inmoData.title + ' ' + tip(inmoData.tooltip) + '</h4><span class="reco-alloc">' + inmoAllocPct + '% de tu portafolio</span></div>';

    if (affordableComunas.length > 0) {
      recoHtml += '<div class="inmo-income-note">\u{1F4CA} Basado en tu ingreso estimado de <strong>' + fmt(Math.round(monthlyIncome)) + '/mes</strong>, estas son las comunas donde te alcanzar\u00eda para invertir ' + tip('Calculado con cuota m\u00e1xima del 25% de tu ingreso, tasa 4.5%, plazo 25 a\u00f1os. El ticket m\u00e1ximo depende del % de financiamiento.') + '</div>';
      recoHtml += '<div class="reco-instruments">';

      affordableComunas.forEach(function(c, idx) {
        var totalReturn = c.plusvalia1y + c.arriendoPct;
        var barWidth = Math.min(100, Math.max(10, (totalReturn / 15) * 100));
        var barColor = totalReturn >= 12 ? '#10b981' : totalReturn >= 9 ? '#3b82f6' : '#f59e0b';

        recoHtml += '<div class="inst-card comuna-card">' +
          '<div class="inst-header"><strong>' + (idx + 1) + '. ' + c.name + '</strong>' + tip(c.tooltip) + '<span class="inst-return">+' + totalReturn.toFixed(1) + '% total</span></div>' +
          '<div class="inst-bar-wrap"><div class="inst-bar" style="width:' + barWidth + '%;background:' + barColor + '"></div></div>' +
          '<div class="comuna-stats">' +
            '<div class="comuna-stat"><span class="comuna-stat-label">Depto promedio</span><span class="comuna-stat-val">' + c.avgUF.toLocaleString() + ' UF ' + tip('Precio promedio de un depto de inversi\u00f3n en esta comuna (1-2 dormitorios)') + '</span></div>' +
            '<div class="comuna-stat"><span class="comuna-stat-label">Plusval\u00eda 1 a\u00f1o</span><span class="comuna-stat-val" style="color:#10b981">+' + c.plusvalia1y + '%</span></div>' +
            '<div class="comuna-stat"><span class="comuna-stat-label">Yield arriendo</span><span class="comuna-stat-val" style="color:#3b82f6">' + c.arriendoPct + '% anual ' + tip('Arriendo anual / precio de compra. Es la renta que genera la propiedad. Arriendo mensual estimado: ' + fmt(c.arriendoMensual)) + '</span></div>' +
            '<div class="comuna-stat"><span class="comuna-stat-label">Cap Rate</span><span class="comuna-stat-val">' + c.capRate + '% ' + tip('Tasa de capitalizaci\u00f3n: ingreso neto / precio. Descuenta gastos operacionales del yield bruto.') + '</span></div>' +
          '</div>' +
          '<div class="comuna-financing">' +
            '<div class="comuna-fin-title">Financiamiento ' + tip('Pie = plata que pones t\u00fa. Cuota = dividendo mensual estimado. Arriendo del depto puede cubrir parte o toda la cuota.') + '</div>' +
            '<div class="comuna-fin-grid">' +
              '<div class="comuna-fin-opt"><span class="comuna-fin-pct">80%</span><span>Pie: ' + fmt(c.pieCLP80) + '</span><span>Cuota: ' + fmt(c.cuota80) + '/mes</span></div>' +
              '<div class="comuna-fin-opt"><span class="comuna-fin-pct">85%</span><span>Pie: ' + fmt(c.pieCLP85) + '</span><span>Cuota: ' + fmt(c.cuota85) + '/mes</span></div>' +
              '<div class="comuna-fin-opt"><span class="comuna-fin-pct">90%</span><span>Pie: ' + fmt(c.pieCLP90) + '</span><span>Cuota: ' + fmt(c.cuota90) + '/mes</span></div>' +
            '</div>' +
            '<div class="comuna-arriendo-vs">\u{1F3E0} Arriendo estimado: <strong>' + fmt(c.arriendoMensual) + '/mes</strong> \u2014 ' +
              (c.arriendoMensual >= c.cuota90 ? '\u2705 Cubre la cuota al 90%' : c.arriendoMensual >= c.cuota80 ? '\u2705 Cubre la cuota al 80%' : '\u26a0\ufe0f No cubre cuota, necesitas aportar diferencia') +
            '</div>' +
          '</div>' +
        '</div>';
      });

      recoHtml += '</div>';
    } else {
      recoHtml += '<div class="inmo-income-note">\u{1F4A1} Con tu ingreso actual, las comunas tradicionales de inversi\u00f3n quedan algo ajustadas para cr\u00e9dito hipotecario. Considera estas alternativas:</div>';
    }

    if (inmoData.fondos && inmoData.fondos.length > 0) {
      recoHtml += '<div style="margin-top:16px"><div class="reco-seg-subheader">\u{1F4BC} Alternativa: Fondos inmobiliarios ' + tip('Si no quieres o no puedes comprar una propiedad, estos fondos te dan exposici\u00f3n al sector inmobiliario con menor capital.') + '</div>';
      recoHtml += '<div class="reco-instruments">';
      var maxFondoRet = Math.max.apply(null, inmoData.fondos.map(function(f) { return f.return1y; }));
      inmoData.fondos.forEach(function(f) {
        recoHtml += renderInstCard(f, maxFondoRet);
      });
      recoHtml += '</div></div>';
    }

    recoHtml += '</div>';
  }

  // Portfolio return summary
  var returnSummary = '<div class="portfolio-return-card">' +
    '<div class="pr-label">Rentabilidad estimada de tu cartera sugerida ' + tip('Promedio ponderado del retorno 1 a\u00f1o de cada categor\u00eda seg\u00fan tu asignaci\u00f3n. Rentabilidad pasada no garantiza resultados futuros.') + '</div>' +
    '<div class="pr-value">+' + portfolioReturn.toFixed(1) + '% anual</div>' +
    '<div class="pr-detail">Basado en rendimiento promedio 1 a\u00f1o \u00b7 ' + (getCountryCfg().label || 'Chile') + '</div>' +
    '</div>';

  // APV section (Chile only)
  var apvHtml = '';
  if ((profile.country || 'CL') === 'CL') {
    apvHtml = '<div class="reco-segment reco-apv">' +
      '<div class="reco-seg-header"><h4>' + APV_INFO.title + ' ' + tip('El APV es un ahorro adicional a tu pensi\u00f3n con beneficios tributarios. Funciona con cualquier perfil de riesgo.') + '</h4><span class="reco-alloc">Complemento</span></div>' +
      '<div class="reco-instruments">';
    APV_INFO.options.forEach(function(opt) {
      apvHtml += '<div class="inst-card' + (opt.highlight ? ' inst-highlight' : '') + '">' +
        '<strong>' + opt.name + '</strong>' +
        '<div class="inst-detail">' + opt.detail + '</div></div>';
    });
    apvHtml += '</div></div>';
  }

  document.getElementById('recomendaciones').innerHTML = returnSummary + recoHtml + apvHtml;

  document.getElementById('estrategiaQuiz').style.display = 'none';
  document.getElementById('estrategiaResult').style.display = '';

  localStorage.setItem('investor_profile', profileType);
  localStorage.setItem('investor_answers', JSON.stringify(tfAnswers));
}

// Redo quiz
document.getElementById('quizRedo').addEventListener('click', function() {
  tfResetQuiz();
});

// Restore saved profile on load
function checkSavedInvestorProfile() {
  var saved = localStorage.getItem('investor_profile');
  var savedAnswers = localStorage.getItem('investor_answers');
  if (saved && INVESTOR_PROFILES[saved]) {
    if (savedAnswers) {
      tfAnswers = JSON.parse(savedAnswers);
      tfShowResults();
    } else {
      renderEstrategia(saved);
    }
  }
}

// ---- INVERSIONES VIEW ----

function renderInversiones() {
  var ci = getCountryInstruments();
  var container = document.getElementById('invContent');
  var periodKey = 'return' + invCurrentPeriod;
  var periodLabel = invCurrentPeriod === '1y' ? '\u00daltimo a\u00f1o' : invCurrentPeriod === '6m' ? '\u00daltimos 6 meses' : '\u00daltimo mes';

  if (invCurrentCat === 'inmobiliario') {
    renderInvInmobiliario(ci, container);
    return;
  }

  var catData = ci[invCurrentCat];
  if (!catData || !catData.instruments) {
    container.innerHTML = '<div class="empty-state-enhanced"><div class="empty-icon">\u{1F4CA}</div><div class="empty-msg">No hay datos para esta categor\u00eda.</div></div>';
    return;
  }

  var sorted = catData.instruments.slice().sort(function(a, b) {
    return (b[periodKey] || b.return1y) - (a[periodKey] || a.return1y);
  });

  var maxRet = Math.max.apply(null, sorted.map(function(i) { return i[periodKey] || i.return1y; }));

  var html = '<div class="inv-section-header">' +
    '<h4>' + catData.title + '</h4>' +
    '<span class="inv-period-label">' + periodLabel + ' \u00b7 ' + (getCountryCfg().label || 'Chile') + '</span>' +
    '</div>';

  html += '<div class="inv-table">';
  html += '<div class="inv-table-header"><span class="inv-th-rank">#</span><span class="inv-th-name">Instrumento</span><span class="inv-th-ret">Retorno</span><span class="inv-th-risk">Riesgo</span></div>';

  sorted.forEach(function(inst, idx) {
    var ret = inst[periodKey] || inst.return1y;
    var sem = riskSemaphore(inst.risk);
    var barWidth = Math.min(100, Math.max(5, Math.abs(ret) / (Math.abs(maxRet) || 1) * 100));
    var barColor = ret >= 15 ? '#10b981' : ret >= 8 ? '#3b82f6' : ret >= 4 ? '#f59e0b' : ret >= 0 ? '#64748b' : '#ef4444';
    var retSign = ret >= 0 ? '+' : '';

    html += '<div class="inv-table-row">' +
      '<span class="inv-rank">' + (idx + 1) + '</span>' +
      '<div class="inv-name-col">' +
        '<strong>' + inst.name + '</strong>' +
        '<div class="inv-bar-mini"><div class="inst-bar" style="width:' + barWidth + '%;background:' + barColor + '"></div></div>' +
        '<div class="inv-meta-mini"><span>' + inst.access + '</span><span>' + inst.minInvest + '</span></div>' +
      '</div>' +
      '<span class="inv-ret" style="color:' + barColor + '">' + retSign + ret + '%</span>' +
      '<span class="inv-risk-col">' + sem.dot + '<span class="inv-risk-label">' + sem.label + '</span></span>' +
      '</div>' +
      (inst.tooltip ? '<div class="inv-tooltip-row">' + inst.tooltip + '</div>' : '');
  });

  html += '</div>';

  // Period comparison
  html += '<div class="inv-compare-card">';
  html += '<h4>\u{1F4CA} Comparaci\u00f3n de per\u00edodos</h4>';
  html += '<div class="inv-compare-table">';
  html += '<div class="inv-cmp-header"><span>Instrumento</span><span>1 Mes</span><span>6 Meses</span><span>1 A\u00f1o</span></div>';
  sorted.slice(0, 5).forEach(function(inst) {
    var c1m = inst.return1m >= 0 ? '#10b981' : '#ef4444';
    var c6m = inst.return6m >= 0 ? '#10b981' : '#ef4444';
    var c1y = inst.return1y >= 0 ? '#10b981' : '#ef4444';
    html += '<div class="inv-cmp-row">' +
      '<span>' + inst.name + '</span>' +
      '<span style="color:' + c1m + '">' + (inst.return1m >= 0 ? '+' : '') + inst.return1m + '%</span>' +
      '<span style="color:' + c6m + '">' + (inst.return6m >= 0 ? '+' : '') + inst.return6m + '%</span>' +
      '<span style="color:' + c1y + '">' + (inst.return1y >= 0 ? '+' : '') + inst.return1y + '%</span>' +
      '</div>';
  });
  html += '</div></div>';

  container.innerHTML = html;
}

function renderInvInmobiliario(ci, container) {
  var inmoData = ci.inmobiliario;
  if (!inmoData || !inmoData.comunas) {
    container.innerHTML = '<div class="empty-state-enhanced"><div class="empty-icon">\u{1F3E0}</div><div class="empty-msg">No hay datos inmobiliarios.</div></div>';
    return;
  }

  var comunas = inmoData.comunas.slice().sort(function(a, b) {
    return (b.plusvalia1y + b.arriendoPct) - (a.plusvalia1y + a.arriendoPct);
  });

  var html = '<div class="inv-section-header">' +
    '<h4>\u{1F3E0} Inmobiliario \u2014 Comunas de inversi\u00f3n</h4>' +
    '<span class="inv-period-label">Plusval\u00eda + arriendo \u00b7 ' + (getCountryCfg().label || 'Chile') + '</span>' +
    '</div>';

  html += '<div class="inv-table">';
  html += '<div class="inv-table-header inv-inmo-header"><span class="inv-th-rank">#</span><span class="inv-th-name">Comuna</span><span class="inv-th-sm">UF prom.</span><span class="inv-th-sm">1 A\u00f1o</span><span class="inv-th-sm">5 A\u00f1os</span><span class="inv-th-sm">10 A\u00f1os</span><span class="inv-th-sm">Arriendo</span></div>';

  comunas.forEach(function(c, idx) {
    var totalReturn = c.plusvalia1y + c.arriendoPct;
    var barWidth = Math.min(100, Math.max(10, (totalReturn / 15) * 100));
    var barColor = totalReturn >= 12 ? '#10b981' : totalReturn >= 9 ? '#3b82f6' : '#f59e0b';

    html += '<div class="inv-table-row inv-inmo-row">' +
      '<span class="inv-rank">' + (idx + 1) + '</span>' +
      '<div class="inv-name-col"><strong>' + c.name + '</strong>' +
        '<div class="inv-bar-mini"><div class="inst-bar" style="width:' + barWidth + '%;background:' + barColor + '"></div></div>' +
      '</div>' +
      '<span class="inv-inmo-val">' + c.avgUF.toLocaleString() + '</span>' +
      '<span class="inv-inmo-val" style="color:#10b981">+' + c.plusvalia1y + '%</span>' +
      '<span class="inv-inmo-val" style="color:#3b82f6">+' + c.plusvalia5y + '%</span>' +
      '<span class="inv-inmo-val" style="color:#4f46e5;font-weight:700">+' + c.plusvalia10y + '%</span>' +
      '<span class="inv-inmo-val" style="color:#f59e0b">' + c.arriendoPct + '%</span>' +
      '</div>' +
      '<div class="inv-tooltip-row">' + c.tooltip + ' \u00b7 Cap Rate: ' + c.capRate + '%</div>';
  });
  html += '</div>';

  if (inmoData.fondos && inmoData.fondos.length > 0) {
    html += '<div class="inv-section-header" style="margin-top:24px">' +
      '<h4>\u{1F4BC} Fondos inmobiliarios</h4>' +
      '<span class="inv-period-label">Alternativa sin comprar propiedad</span>' +
      '</div>';
    html += '<div class="inv-table">';
    html += '<div class="inv-table-header"><span class="inv-th-rank">#</span><span class="inv-th-name">Fondo</span><span class="inv-th-ret">1 A\u00f1o</span><span class="inv-th-risk">Riesgo</span></div>';
    inmoData.fondos.forEach(function(f, idx) {
      var sem = riskSemaphore(f.risk);
      html += '<div class="inv-table-row">' +
        '<span class="inv-rank">' + (idx + 1) + '</span>' +
        '<div class="inv-name-col"><strong>' + f.name + '</strong><div class="inv-meta-mini"><span>' + f.access + '</span><span>' + f.minInvest + '</span></div></div>' +
        '<span class="inv-ret" style="color:#10b981">+' + f.return1y + '%</span>' +
        '<span class="inv-risk-col">' + sem.dot + '<span class="inv-risk-label">' + sem.label + '</span></span>' +
        '</div>' +
        '<div class="inv-tooltip-row">' + f.tooltip + '</div>';
    });
    html += '</div>';
  }

  container.innerHTML = html;
}

// Inversiones tab handlers
document.querySelectorAll('.inv-tab').forEach(function(tab) {
  tab.addEventListener('click', function() {
    document.querySelectorAll('.inv-tab').forEach(function(t) { t.classList.remove('active'); });
    tab.classList.add('active');
    invCurrentCat = tab.dataset.cat;

    var timeTabs = document.getElementById('invTimeTabs');
    if (invCurrentCat === 'inmobiliario') {
      timeTabs.style.display = 'none';
    } else {
      timeTabs.style.display = '';
    }

    renderInversiones();
  });
});

document.querySelectorAll('.inv-time').forEach(function(tab) {
  tab.addEventListener('click', function() {
    document.querySelectorAll('.inv-time').forEach(function(t) { t.classList.remove('active'); });
    tab.classList.add('active');
    invCurrentPeriod = tab.dataset.period;
    renderInversiones();
  });
});

// ---- WINDFALL ADVISOR ----

function openWindfall() {
  document.getElementById('wfStep1').style.display = '';
  document.getElementById('wfStep2').style.display = 'none';
  document.getElementById('wfStep3').style.display = 'none';
  document.getElementById('wfAmount').value = '';
  document.getElementById('wfSource').value = '';
  wfQuizAnswers = {};
  document.getElementById('windfallTitle').textContent = '\u{1F4B8} Me lleg\u00f3 plata';
  document.getElementById('windfallModal').classList.add('open');
  setTimeout(function() { document.getElementById('wfAmount').focus(); }, 200);
}

function wfBackToStart() {
  document.getElementById('wfStep1').style.display = '';
  document.getElementById('wfStep2').style.display = 'none';
  document.getElementById('wfStep3').style.display = 'none';
  document.getElementById('windfallTitle').textContent = '\u{1F4B8} Me lleg\u00f3 plata';
}

function wfGoToQuiz() {
  var amount = parseInt(document.getElementById('wfAmount').value) || 0;
  if (amount <= 0) { document.getElementById('wfAmount').focus(); return; }
  wfQuizAnswers = {};
  document.querySelectorAll('.wf-opt').forEach(function(o) { o.classList.remove('selected'); });
  document.getElementById('wfQ1').style.display = '';
  document.getElementById('wfQ2').style.display = 'none';
  document.getElementById('wfQ3').style.display = 'none';
  document.getElementById('wfStep1').style.display = 'none';
  document.getElementById('wfStep2').style.display = '';
  document.getElementById('windfallTitle').textContent = '\u{1F914} \u00bfQu\u00e9 quieres hacer?';
}

function wfSelect(btn) {
  var q = btn.dataset.q;
  var val = btn.dataset.val;
  btn.closest('.wf-quiz-opts').querySelectorAll('.wf-opt').forEach(function(o) { o.classList.remove('selected'); });
  btn.classList.add('selected');
  wfQuizAnswers[q] = val;

  setTimeout(function() {
    if (q === 'intent') {
      document.getElementById('wfQ1').style.display = 'none';
      document.getElementById('wfQ2').style.display = '';
      document.getElementById('windfallTitle').textContent = '\u23f3 \u00bfHorizonte?';
    } else if (q === 'horizonte') {
      document.getElementById('wfQ2').style.display = 'none';
      document.getElementById('wfQ3').style.display = '';
      document.getElementById('windfallTitle').textContent = '\u{1F3AF} \u00bfRiesgo?';
    } else if (q === 'riesgo') {
      analyzeWindfall();
    }
  }, 300);
}

function riskSemaphore(risk) {
  var map = {
    'Sin riesgo': { color: '#10b981', dot: '\u{1F7E2}', label: 'Sin riesgo' },
    'Muy Bajo': { color: '#10b981', dot: '\u{1F7E2}', label: 'Muy bajo' },
    'Bajo': { color: '#84cc16', dot: '\u{1F7E2}', label: 'Bajo' },
    'Medio': { color: '#f59e0b', dot: '\u{1F7E1}', label: 'Medio' },
    'Medio-Alto': { color: '#f97316', dot: '\u{1F7E0}', label: 'Medio-Alto' },
    'Alto': { color: '#ef4444', dot: '\u{1F534}', label: 'Alto' },
    'Muy Alto': { color: '#dc2626', dot: '\u{1F534}', label: 'Muy alto' }
  };
  return map[risk] || map['Medio'];
}

function analyzeWindfall() {
  var amount = parseInt(document.getElementById('wfAmount').value) || 0;
  if (amount <= 0) return;

  var source = document.getElementById('wfSource').value;
  var intent = wfQuizAnswers.intent || 'mix';
  var horizonte = wfQuizAnswers.horizonte || 'medio';
  var riesgo = wfQuizAnswers.riesgo || 'algo';
  var gastoMensual = profile.monthlySpend || 1500000;

  var totalLiquidez = (typeof getTotalAccounts === 'function') ? getTotalAccounts() : 0;
  var ahorro = (typeof getTotalSavings === 'function') ? getTotalSavings() : 0;
  totalLiquidez += Math.max(0, ahorro);
  var emergencyTarget = gastoMensual * 6;
  var emergencyGap = Math.max(0, emergencyTarget - totalLiquidez);

  var activeGoals = (typeof goals !== 'undefined') ? goals.filter(function(g) {
    var saved = getGoalProgress(g);
    return g.target > 0 && saved < g.target;
  }) : [];

  var totalDebt = (typeof debts !== 'undefined') ? debts.filter(function(d) {
    return d.type === 'yo_debo';
  }).reduce(function(s, d) { return s + (d.original_amount || 0); }, 0) : 0;

  var funPct = 0, emergPct = 0, debtPct = 0, goalPct = 0, investPct = 0;

  if (intent === 'disfrutar') funPct = 25;
  else if (intent === 'mix') funPct = 10;
  else if (intent === 'crecer') funPct = 5;
  else funPct = 5;

  var workingPct = 100 - funPct;

  if (emergencyGap > 0) {
    var emergAmt = Math.min(emergencyGap, amount);
    emergPct = Math.min(Math.round((emergAmt / amount) * 100), workingPct);
    workingPct -= emergPct;
  }

  if (totalDebt > 0 && workingPct > 0) {
    debtPct = Math.min(20, workingPct);
    workingPct -= debtPct;
  }

  if (activeGoals.length > 0 && workingPct > 0) {
    goalPct = Math.min(Math.round(workingPct * 0.35), workingPct);
    workingPct -= goalPct;
  }

  investPct = workingPct;

  var splits = [];
  var remaining = amount;

  if (emergPct > 0) {
    var amt = Math.round(amount * emergPct / 100);
    splits.push({ icon: '\u{1F6E1}\ufe0f', label: 'Fondo de emergencia', detail: 'Te faltan ' + fmt(emergencyGap) + ' para 6 meses de gastos', amount: amt, type: 'urgent' });
    remaining -= amt;
  }

  if (debtPct > 0) {
    var amt = Math.round(amount * debtPct / 100);
    splits.push({ icon: '\u{1F4B3}', label: 'Pagar deudas', detail: 'Deuda: ' + fmt(totalDebt) + '. Reduce intereses', amount: amt, type: 'urgent' });
    remaining -= amt;
  }

  if (goalPct > 0) {
    var amt = Math.round(amount * goalPct / 100);
    var topGoal = activeGoals.sort(function(a, b) {
      var pa = a.priority === 'alta' ? 3 : a.priority === 'media' ? 2 : 1;
      var pb = b.priority === 'alta' ? 3 : b.priority === 'media' ? 2 : 1;
      return pb - pa;
    })[0];
    var cfg = GOAL_CATEGORY_CONFIG[topGoal.category] || GOAL_CATEGORY_CONFIG.otro;
    splits.push({ icon: cfg.icon, label: 'Meta: ' + topGoal.name, detail: 'Faltan ' + fmt(topGoal.target - getGoalProgress(topGoal)), amount: amt, type: 'important' });
    remaining -= amt;
  }

  if (investPct > 0) {
    var investAmt = remaining - (funPct > 0 ? Math.round(amount * funPct / 100) : 0);
    if (investAmt < 0) investAmt = 0;
    splits.push({ icon: '\u{1F4C8}', label: 'Invertir', detail: '', amount: investAmt, type: 'growth' });
    remaining -= investAmt;
  }

  if (funPct > 0 && amount >= 100000) {
    var funAmt = Math.max(0, remaining);
    if (funAmt > 0) {
      splits.push({ icon: '\u{1F389}', label: 'Darte un gusto', detail: 'Te lo ganaste \u2014 disfrutar tambi\u00e9n es parte del plan', amount: funAmt, type: 'fun' });
    }
  }

  var ci = getCountryInstruments();
  var recoInstruments = [];

  if (riesgo === 'nada' || horizonte === 'corto') {
    if (ci.caja) recoInstruments = recoInstruments.concat(ci.caja.instruments.slice(0, 4));
    if (ci.rentaFija) recoInstruments = recoInstruments.concat(ci.rentaFija.instruments.slice(0, 3));
  } else if (riesgo === 'algo' || (horizonte === 'medio' && intent !== 'crecer')) {
    if (ci.rentaFija) recoInstruments = recoInstruments.concat(ci.rentaFija.instruments.slice(0, 3));
    if (ci.rentaVariable) recoInstruments = recoInstruments.concat(ci.rentaVariable.instruments.slice(0, 3));
    if (ci.caja) recoInstruments = recoInstruments.concat(ci.caja.instruments.slice(0, 1));
  } else {
    if (ci.rentaVariable) recoInstruments = recoInstruments.concat(ci.rentaVariable.instruments.slice(0, 5));
    if (ci.rentaFija) recoInstruments = recoInstruments.concat(ci.rentaFija.instruments.slice(0, 2));
  }

  recoInstruments.sort(function(a, b) { return b.return1y - a.return1y; });

  var html = '<div class="wf-header"><div class="wf-amount">' + fmt(amount) + '</div>';
  if (source) {
    var sourceLabels = { bono:'Bono / Aguinaldo', venta:'Venta', herencia:'Herencia', freelance:'Trabajo extra', devolucion:'Devoluci\u00f3n impuestos', regalo:'Regalo', otro:'Ingreso extra' };
    html += '<div class="wf-sub">' + (sourceLabels[source] || 'Ingreso extra') + '</div>';
  }
  var perfilBadge = riesgo === 'nada' ? '\u{1F7E2} Conservador con esta plata' : riesgo === 'algo' ? '\u{1F7E1} Moderado con esta plata' : '\u{1F534} Agresivo con esta plata';
  html += '<div class="wf-profile-badge">' + perfilBadge + '</div>';
  html += '</div>';

  html += '<div class="wf-splits">';
  splits.forEach(function(s) {
    var pct = ((s.amount / amount) * 100).toFixed(0);
    html += '<div class="wf-split wf-' + s.type + '">' +
      '<div class="wf-split-icon">' + s.icon + '</div>' +
      '<div class="wf-split-info"><strong>' + s.label + '</strong><span>' + s.detail + '</span></div>' +
      '<div class="wf-split-amount">' + fmt(s.amount) + '<br><span style="font-size:0.7rem;color:var(--text-secondary);font-weight:400">' + pct + '%</span></div>' +
      '</div>';
  });
  html += '</div>';

  if (recoInstruments.length > 0) {
    html += '<div class="wf-instruments-section">';
    html += '<h4 class="wf-inst-title">\u{1F4CA} D\u00f3nde ponerla \u2014 instrumentos sugeridos</h4>';
    html += '<div class="wf-inst-list">';

    var maxRet = Math.max.apply(null, recoInstruments.map(function(i) { return i.return1y; }));
    recoInstruments.forEach(function(inst) {
      var sem = riskSemaphore(inst.risk);
      var barWidth = Math.min(100, Math.max(8, (inst.return1y / (maxRet || 30)) * 100));
      var barColor = inst.return1y >= 15 ? '#10b981' : inst.return1y >= 8 ? '#3b82f6' : inst.return1y >= 4 ? '#f59e0b' : '#64748b';

      html += '<div class="wf-inst-card">' +
        '<div class="wf-inst-top">' +
          '<strong>' + inst.name + '</strong>' +
          '<span class="wf-inst-ret">+' + inst.return1y + '%</span>' +
        '</div>' +
        '<div class="inst-bar-wrap"><div class="inst-bar" style="width:' + barWidth + '%;background:' + barColor + '"></div></div>' +
        '<div class="wf-inst-bottom">' +
          '<span class="wf-risk-badge" style="color:' + sem.color + '">' + sem.dot + ' ' + sem.label + '</span>' +
          '<span class="wf-inst-access">' + inst.access + '</span>' +
          '<span class="wf-inst-min">' + inst.minInvest + '</span>' +
        '</div>' +
        (inst.tooltip ? '<div class="wf-inst-tooltip">' + inst.tooltip + '</div>' : '') +
        '</div>';
    });
    html += '</div></div>';
  }

  var tips = {
    bono: '\u{1F4A1} Los bonos son plata que no estaba en tu presupuesto \u2014 es la mejor oportunidad para avanzar sin sentirlo.',
    herencia: '\u{1F4A1} No hay apuro. Un DAP a 30 d\u00edas te da tiempo para pensar sin que la plata pierda valor.',
    devolucion: '\u{1F4A1} La devoluci\u00f3n es plata que ya "gastaste". \u00dasala para patrimonio, no consumo.',
    venta: '\u{1F4A1} Si vendiste un activo, reinvierte para mantener el efecto compuesto.'
  };
  if (tips[source]) {
    html += '<div class="wf-tip">' + tips[source] + '</div>';
  }

  document.getElementById('wfResult').innerHTML = html;
  document.getElementById('wfStep2').style.display = 'none';
  document.getElementById('wfStep3').style.display = '';
  document.getElementById('windfallTitle').textContent = '\u{1F4CA} Tu plan para esta plata';
}
