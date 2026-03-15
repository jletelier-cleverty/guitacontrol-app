/* ============================================
   CONSTANTS — Config, categories, colors
   ============================================ */

// LATAM country config
var COUNTRY_CONFIG = {
  CL: { currency:'CLP', locale:'es-CL', symbol:'$',  unitName:'UF',  unitDefault:38800, label:'Chile' },
  MX: { currency:'MXN', locale:'es-MX', symbol:'$',  unitName:'UDI', unitDefault:8.29,  label:'Mexico' },
  CO: { currency:'COP', locale:'es-CO', symbol:'$',  unitName:'UVR', unitDefault:350,   label:'Colombia' },
  PE: { currency:'PEN', locale:'es-PE', symbol:'S/',  unitName:null,  unitDefault:1,     label:'Peru' },
  AR: { currency:'ARS', locale:'es-AR', symbol:'$',  unitName:'UVA', unitDefault:1200,  label:'Argentina' },
  BR: { currency:'BRL', locale:'pt-BR', symbol:'R$', unitName:null,  unitDefault:1,     label:'Brasil' },
  UY: { currency:'UYU', locale:'es-UY', symbol:'$U', unitName:'UI',  unitDefault:6.2,   label:'Uruguay' }
};

// Categorias invisibles en dashboard/KPIs/graficos (pero visibles atenuadas en tabla)
var HIDDEN_CATEGORIES = ['Transferencias Propias'];
// Categorias excluidas de gastos reales (atenuadas en tabla)
var ALWAYS_EXCLUDED = ['Transferencias Propias', 'Ahorro'];

var CAT_CONFIG = {
  'Dividendo / Vivienda':    { color: '#4f46e5', icon: '\u{1F3E0}' },
  'Educacion / Ninos':       { color: '#8b5cf6', icon: '\u{1F4DA}' },
  'Supermercado':             { color: '#10b981', icon: '\u{1F6D2}' },
  'Restaurantes / Comida':   { color: '#f59e0b', icon: '\u{1F37D}' },
  'Delivery':                 { color: '#f97316', icon: '\u{1F6F5}' },
  'Bencina / Auto':           { color: '#6366f1', icon: '\u26FD' },
  'Transporte':               { color: '#06b6d4', icon: '\u{1F697}' },
  'Salud':                    { color: '#ec4899', icon: '\u{1F3E5}' },
  'Seguros':                  { color: '#14b8a6', icon: '\u{1F6E1}' },
  'Suscripciones':            { color: '#a855f7', icon: '\u{1F4F1}' },
  'Compras Online':           { color: '#e11d48', icon: '\u{1F6CD}' },
  'Compras en Cuotas':        { color: '#7c3aed', icon: '\u{1F501}' },
  'Servicios Basicos':        { color: '#0ea5e9', icon: '\u{1F4A1}' },
  'Creditos / Banco':         { color: '#64748b', icon: '\u{1F3E6}' },
  'Prestamos Cleverty':       { color: '#0369a1', icon: '\u{1F3DB}' },
  'Prestamos Tricapitals':    { color: '#b45309', icon: '\u{1F3E6}' },
  'Creditos Tricapitals':     { color: '#92400e', icon: '\u{1F4B3}' },
  'Entretenimiento':          { color: '#d946ef', icon: '\u{1F3AF}' },
  'Bienestar':                { color: '#22c55e', icon: '\u{1F486}' },
  'Mascotas':                 { color: '#84cc16', icon: '\u{1F43E}' },
  'IA':                        { color: '#2dd4bf', icon: '\u{1F916}' },
  'Regalos':                  { color: '#e879f9', icon: '\u{1F381}' },
  'Hogar':                    { color: '#eab308', icon: '\u{1F3E1}' },
  'Ropa / Personal':          { color: '#f43f5e', icon: '\u{1F455}' },
  'Nana / Empleados':         { color: '#78716c', icon: '\u{1F3E0}' },
  'Dividendo / Inversion':              { color: '#0284c7', icon: '\u{1F3E2}' },
  'Transferencias Propias':   { color: '#94a3b8', icon: '\u{1F504}' },
  'Ingresos Trabajo':         { color: '#059669', icon: '\u{1F4B0}' },
  'Arriendos / Inversiones':   { color: '#15803d', icon: '\u{1F3E2}' },
  'Ingresos Otros':           { color: '#16a34a', icon: '\u{1F4B5}' },
  'Ahorro':                    { color: '#0d9488', icon: '\u{1F3AF}' },
  'Sin Categorizar':          { color: '#9ca3af', icon: '\u2753' },
};

var FALLBACK_COLORS = ['#4f46e5','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#06b6d4','#84cc16','#f97316','#6366f1'];

var MN = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

var defaultBenchmarks = {
  'Dividendo / Vivienda': 30, 'Supermercado': 15, 'Restaurantes / Comida': 8,
  'Delivery': 5, 'Entretenimiento': 8, 'Suscripciones': 3,
  'Bencina / Auto': 12, 'Transporte': 12, 'Salud': 10,
  'Ropa / Personal': 5, 'Compras Online': 5, 'Educacion / Ninos': 15
};

var EMOJI_OPTIONS = [
  '🏠','🏢','🏡','🏗️','📚','🎓','🛒','🍽️','🍕','🍺','☕',
  '🛵','⛽','🚗','🚕','🚌','✈️','🏥','💊','🛡️','📱','💻',
  '🛍️','🔁','💡','🔌','🏦','🏛️','🎯','🎮','🎬','🎵','🎭',
  '💆','🐾','🤖','🎁','👔','👗','👟','💄','💈','🧹','👶',
  '💰','📈','📉','💳','💎','🏋️','⚽','🎾','🏊','🧘','🌴',
  '🍷','🎂','🎪','📦','🔧','🎨','📷','🖥️','⌚','🎒','🧳',
  '🏆','⭐','❤️','🔥','💫','🌟','🎉','✨','🍀','🌈'
];
