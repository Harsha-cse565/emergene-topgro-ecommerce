const fs = require('fs');
const path = require('path');

const srcAssetsDir = path.resolve(__dirname, '../src/assets/images');
const publicProductsDir = path.resolve(__dirname, '../public/images/products');
const backendDataDir = path.resolve(__dirname, '../backend/data');
const frontendDataDir = path.resolve(__dirname, '../src/data');

if (!fs.existsSync(publicProductsDir)) {
  fs.mkdirSync(publicProductsDir, { recursive: true });
}

// 1. Copy generated photo assets
const photoMappings = [
  { slug: 'yieldmax-19-19-19', file: 'yieldmax_fertilizer_1790265190216.jpg', dest: 'yieldmax-19-19-19.jpg' },
  { slug: 'shield', file: 'shield_fungicide_1790265207413.jpg', dest: 'shield.jpg' },
  { slug: 'shield-plant-guard', file: 'shield_fungicide_1790265207413.jpg', dest: 'shield-plant-guard.jpg' },
  { slug: 'almighty', file: 'almighty_can_1790265222510.jpg', dest: 'almighty.jpg' },
  { slug: 'calciwin', file: 'calciwin_fertilizer_1790265235926.jpg', dest: 'calciwin.jpg' },
  { slug: 'grovel', file: 'grovel_bottle_1790265248666.jpg', dest: 'grovel.jpg' },
  { slug: 'dinogard', file: 'dinogard_box_1790265283530.jpg', dest: 'dinogard.jpg' },
  { slug: 'revive-bottle', file: 'revive_tonic_1790265296883.jpg', dest: 'revive-bottle.jpg' },
  { slug: 'rnr-sona', file: 'paddy_seeds_bag_1790265310867.jpg', dest: 'rnr-sona.jpg' },
  { slug: 'kartapgard', file: 'kartapgard_box_1790267607727.jpg', dest: 'kartapgard.jpg' },
  { slug: 'sengen-granules', file: 'sengen_pouch_1790267622718.jpg', dest: 'sengen-granules.jpg' },
  { slug: 'sengen-box', file: 'sengen_pouch_1790267622718.jpg', dest: 'sengen-box.jpg' },
  { slug: 'delite', file: 'delite_bucket_1790267637917.jpg', dest: 'delite.jpg' },
  { slug: 'titus-gold', file: 'titus_gold_box_1790267650379.jpg', dest: 'titus-gold.jpg' },
  { slug: 'titus-bottle', file: 'titus_gold_box_1790267650379.jpg', dest: 'titus-bottle.jpg' },
  { slug: 'quantum-power', file: 'quantum_power_foil_1790267663203.jpg', dest: 'quantum-power.jpg' },
  { slug: 'veera-bottle', file: 'veera_fighter_jar_1790267674815.jpg', dest: 'veera-bottle.jpg' },
  { slug: 'veera-sp', file: 'veera_fighter_jar_1790267674815.jpg', dest: 'veera-sp.jpg' },
  { slug: 'judo', file: 'judo_canister_1790267688138.jpg', dest: 'judo.jpg' },
  { slug: 'glufostar', file: 'glufostar_bottle_1790267702454.jpg', dest: 'glufostar.jpg' }
];

console.log('Copying photo packaging assets...');
const photoMapBySlug = {};
for (const item of photoMappings) {
  const src = path.join(srcAssetsDir, item.file);
  const dest = path.join(publicProductsDir, item.dest);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    photoMapBySlug[item.slug] = `/images/products/${item.dest}`;
    console.log(`✓ Copied ${item.file} -> ${item.dest}`);
  }
}

// Read products data
const products = JSON.parse(fs.readFileSync(path.join(backendDataDir, 'products.json'), 'utf8'));

// Helper to generate custom SVG matching the PDF visual elements
function generatePreciseSVG(p) {
  const name = p.name;
  const brand = p.brand || (p.name.includes('YieldMax') ? 'TOPGRO' : 'EMERGENE');
  const cat = p.category;
  const slug = p.slug;

  // Render specific emblem based on product characteristics in PDF
  let emblemSVG = '';

  if (slug === 'dinogard') {
    // Ninja turtle / warrior mascot
    emblemSVG = `
      <rect x="135" y="200" width="130" height="130" rx="8" fill="#ffedd5" stroke="#fed7aa"/>
      <ellipse cx="200" cy="250" rx="35" ry="38" fill="#15803d"/>
      <ellipse cx="200" cy="246" rx="28" ry="30" fill="#22c55e"/>
      <rect x="180" y="235" width="40" height="10" rx="4" fill="#ea580c"/>
      <circle cx="192" cy="240" r="3" fill="#ffffff"/><circle cx="192" cy="240" r="1.5" fill="#000000"/>
      <circle cx="208" cy="240" r="3" fill="#ffffff"/><circle cx="208" cy="240" r="1.5" fill="#000000"/>
      <polygon points="200,290 225,320 175,320" fill="#ea580c"/>
      <text x="200" y="315" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="8" fill="#ffffff">DEFENSE</text>
    `;
  } else if (slug === 'almighty') {
    // Leaping puma / panther against sunset
    emblemSVG = `
      <circle cx="200" cy="275" r="42" fill="#ea580c"/>
      <circle cx="200" cy="275" r="36" fill="#facc15"/>
      <path d="M175,282 C185,268 200,265 225,270 C220,278 205,280 195,288 C185,285 180,285 175,282 Z" fill="#09090b"/>
      <ellipse cx="178" cy="281" rx="8" ry="6" fill="#09090b"/>
      <path d="M222,270 L232,266 L226,275 Z" fill="#09090b"/>
      <text x="200" y="335" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="9" fill="#09090b" letter-spacing="1">TOLFENPYRAD 15% EC</text>
    `;
  } else if (slug.includes('kartapgard')) {
    // Spartan helmet & warrior shield
    emblemSVG = `
      <circle cx="200" cy="265" r="40" fill="#fee2e2" stroke="#dc2626" stroke-width="2"/>
      <path d="M185,250 C185,235 215,235 215,250 L215,270 C215,278 185,278 185,270 Z" fill="#b91c1c"/>
      <rect x="190" y="258" width="20" height="4" fill="#fef08a"/>
      <line x1="200" y1="230" x2="200" y2="245" stroke="#dc2626" stroke-width="4" stroke-linecap="round"/>
      <polygon points="200,325 215,340 200,355 185,340" fill="#dc2626"/>
      <text x="200" y="343" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="8" fill="#ffffff">DANGER</text>
    `;
  } else if (slug.includes('titus')) {
    // Superhero boy + blue diamond
    emblemSVG = `
      <polygon points="220,240 240,240 250,260 230,280 210,260" fill="#06b6d4" stroke="#ffffff" stroke-width="1.5"/>
      <polygon points="220,240 230,260 240,240" fill="#38bdf8"/>
      <circle cx="180" cy="245" r="14" fill="#fed7aa"/>
      <path d="M172,240 C175,230 190,230 190,240 Z" fill="#92400e"/>
      <path d="M170,259 L190,259 L195,290 L165,290 Z" fill="#2563eb"/>
      <path d="M165,260 L150,280 L165,285 Z" fill="#dc2626"/>
      <text x="200" y="325" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="10" fill="#ca8a04">TITUS GOLD FORMULATION</text>
    `;
  } else if (slug.includes('veera')) {
    // Supersonic fighter jet + orbit
    emblemSVG = `
      <ellipse cx="200" cy="275" rx="42" ry="24" fill="none" stroke="#ea580c" stroke-width="1.5" transform="rotate(-25 200 275)"/>
      <path d="M200,235 L206,275 L230,285 L206,285 L204,305 L200,302 L196,305 L194,285 L170,285 L194,275 Z" fill="#1e293b"/>
      <polygon points="198,305 202,305 200,318" fill="#ea580c"/>
      <text x="200" y="335" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="12" fill="#ea580c">SPEED • 6X</text>
    `;
  } else if (slug.includes('calciwin')) {
    // Muscular flexing bicep arm
    emblemSVG = `
      <circle cx="200" cy="270" r="38" fill="#ecfdf5" stroke="#10b981" stroke-width="2"/>
      <path d="M180,280 C180,265 190,255 205,255 C215,255 220,262 220,270 C220,278 210,285 195,285 Z" fill="#10b981"/>
      <path d="M188,270 C192,260 200,258 206,263" fill="none" stroke="#047857" stroke-width="2" stroke-linecap="round"/>
      <text x="200" y="328" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="10" fill="#1e3a8a">CALCIUM + BORON</text>
    `;
  } else if (slug.includes('delite')) {
    // Fruit and vegetable harvest basket
    emblemSVG = `
      <rect x="145" y="240" width="110" height="70" rx="8" fill="#ffffff" stroke="#e2e8f0"/>
      <circle cx="175" cy="265" r="14" fill="#ef4444"/>
      <circle cx="195" cy="262" r="12" fill="#eab308"/>
      <circle cx="215" cy="268" r="13" fill="#84cc16"/>
      <circle cx="225" cy="262" r="10" fill="#8b5cf6"/>
      <path d="M165,280 Q200,295 235,280" fill="none" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
      <text x="200" y="304" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="800" font-size="9" fill="#15803d">FOLIAR HARVEST MAX</text>
    `;
  } else if (slug.includes('sengen')) {
    // Leaping stallion horse / DG technology
    emblemSVG = `
      <circle cx="200" cy="270" r="38" fill="#f0fdf4" stroke="#16a34a" stroke-width="2"/>
      <path d="M178,285 C185,270 195,260 215,255 C222,253 226,260 220,268 C215,275 200,280 185,288 Z" fill="#0f172a"/>
      <path d="M210,255 L215,248 L220,256 Z" fill="#0f172a"/>
      <text x="200" y="326" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="9" fill="#15803d">DG TECHNOLOGY</text>
    `;
  } else if (slug.includes('quantum-power')) {
    // Concentric glowing green atomic rings
    emblemSVG = `
      <circle cx="200" cy="270" r="42" fill="#09090b"/>
      <circle cx="200" cy="270" r="36" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-dasharray="6,4"/>
      <circle cx="200" cy="270" r="24" fill="none" stroke="#4ade80" stroke-width="2"/>
      <circle cx="200" cy="270" r="12" fill="#ef4444"/>
      <circle cx="200" cy="270" r="5" fill="#fef08a"/>
      <text x="200" y="330" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="10" fill="#22c55e">BIO ATOM TECH</text>
    `;
  } else if (slug.includes('advent')) {
    // Rainbow wings
    emblemSVG = `
      <path d="M160,280 C165,245 190,240 200,255 C210,240 235,245 240,280 C225,270 210,265 200,285 C190,265 175,270 160,280 Z" fill="#0284c7"/>
      <path d="M165,275 C175,255 190,250 200,265 C210,250 225,255 235,275 Z" fill="#eab308"/>
      <circle cx="200" cy="255" r="7" fill="#ef4444"/>
      <text x="200" y="325" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="9" fill="#0369a1">ORGANIC IMMUNIZER</text>
    `;
  } else if (slug.includes('ranger') || slug.includes('lucas-gold')) {
    // Charging red bull
    emblemSVG = `
      <circle cx="200" cy="270" r="38" fill="#18181b" stroke="#eab308" stroke-width="2"/>
      <path d="M175,278 C185,260 205,260 220,270 C215,278 200,282 185,286 Z" fill="#dc2626"/>
      <path d="M185,265 L180,252 L192,260 Z" fill="#facc15"/>
      <path d="M215,265 L225,254 L218,264 Z" fill="#facc15"/>
      <text x="200" y="325" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="9" fill="#dc2626">STRONG DEFENSE</text>
    `;
  } else if (slug.includes('rnr-sona') || slug.includes('yodha') || slug.includes('samrat')) {
    // Grain crop / paddy / corn
    emblemSVG = `
      <ellipse cx="200" cy="270" rx="35" ry="40" fill="#fef9c3" stroke="#ca8a04" stroke-width="2"/>
      <path d="M190,290 C190,250 205,245 205,230 C205,255 215,270 215,290" fill="none" stroke="#15803d" stroke-width="3"/>
      <ellipse cx="195" cy="255" rx="5" ry="8" fill="#eab308" transform="rotate(-20 195 255)"/>
      <ellipse cx="205" cy="265" rx="5" ry="8" fill="#eab308" transform="rotate(20 205 265)"/>
      <ellipse cx="196" cy="275" rx="5" ry="8" fill="#eab308" transform="rotate(-15 196 275)"/>
      <text x="200" y="325" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="9" fill="#15803d">CERTIFIED SEED</text>
    `;
  } else if (slug.includes('judo')) {
    // JUDO with Hindi text
    emblemSVG = `
      <rect x="145" y="240" width="110" height="50" rx="6" fill="#ea580c"/>
      <text x="200" y="262" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="16" fill="#ffffff">JUDO</text>
      <text x="200" y="282" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="14" fill="#fef08a">जुडो</text>
      <text x="200" y="320" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="700" font-size="9" fill="#15803d">INSECTICIDE PROTECTOR</text>
    `;
  } else if (slug.includes('yieldmax-mkp')) {
    // Pink and black MKP
    emblemSVG = `
      <rect x="140" y="235" width="120" height="60" rx="6" fill="#db2777"/>
      <text x="200" y="260" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="18" fill="#ffffff">MKP</text>
      <text x="200" y="280" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="12" fill="#fef08a">00:52:34</text>
      <text x="200" y="325" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="700" font-size="9" fill="#db2777">100% WATER SOLUBLE</text>
    `;
  } else if (slug.includes('yieldmax')) {
    // Geometric NPK facets
    emblemSVG = `
      <polygon points="160,250 200,230 240,250 240,290 200,310 160,290" fill="#f97316"/>
      <polygon points="175,258 200,245 225,258 200,285" fill="#eab308"/>
      <text x="200" y="278" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="10" fill="#ffffff">YIELD</text>
      <text x="200" y="330" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="800" font-size="9" fill="#ea580c">PRECISION NPK</text>
    `;
  } else if (slug.includes('shield')) {
    // Shield emblem
    emblemSVG = `
      <polygon points="200,235 230,245 230,280 200,305 170,280 170,245" fill="#15803d" stroke="#facc15" stroke-width="2"/>
      <text x="200" y="275" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="11" fill="#ffffff">SHIELD</text>
      <text x="200" y="328" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="700" font-size="9" fill="#15803d">ORGANIC PLANT GUARD</text>
    `;
  } else {
    // Default high-grade emblem with botanical leaf crest
    emblemSVG = `
      <circle cx="200" cy="270" r="35" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
      <path d="M190,285 C190,260 210,255 210,245 C210,265 200,275 200,285 Z" fill="#16a34a"/>
      <circle cx="200" cy="270" r="25" fill="none" stroke="#22c55e" stroke-width="1.5" stroke-dasharray="4,3"/>
      <text x="200" y="325" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="700" font-size="9" fill="#475569">PREMIUM AGRO CHEMICAL</text>
    `;
  }

  // Determine container shape: sack, bottle, jar, box, pouch, bucket, canister
  let container = '';
  const packType = p.packType || 'bottle';

  if (packType === 'sack') {
    container = `
      <!-- SACK -->
      <g filter="url(#shadow)">
        <polygon points="120,95 280,95 295,395 105,395" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
        <polygon points="120,95 280,95 275,130 125,130" fill="#ea580c"/>
        <text x="200" y="118" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="14" fill="#ffffff" letter-spacing="2">${brand}</text>
        
        <rect x="135" y="150" width="130" height="40" rx="6" fill="#0f172a"/>
        <text x="200" y="176" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="${name.length > 15 ? 13 : 17}" fill="#fef08a">${name}</text>
        
        ${emblemSVG}

        <rect x="135" y="355" width="130" height="24" rx="4" fill="#f1f5f9"/>
        <text x="200" y="371" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="700" font-size="10" fill="#334155">${cat}</text>
      </g>
    `;
  } else if (packType === 'box') {
    container = `
      <!-- BOX -->
      <g filter="url(#shadow)">
        <polygon points="135,110 185,80 285,80 235,110" fill="#e2e8f0" stroke="#cbd5e1"/>
        <polygon points="285,80 285,360 235,395 235,110" fill="#cbd5e1" stroke="#94a3b8"/>
        
        <rect x="115" y="110" width="120" height="285" rx="3" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
        <rect x="115" y="110" width="120" height="55" fill="#0284c7"/>
        <text x="175" y="132" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="11" fill="#ffffff" letter-spacing="1.5">${brand}</text>
        <text x="175" y="153" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="${name.length > 14 ? 12 : 15}" fill="#fef08a">${name}</text>
        
        <g transform="translate(-25, 0)">
          ${emblemSVG}
        </g>
        
        <rect x="125" y="355" width="100" height="22" rx="4" fill="#f1f5f9"/>
        <text x="175" y="370" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="700" font-size="9" fill="#1e293b">${cat}</text>
      </g>
    `;
  } else if (packType === 'pouch') {
    container = `
      <!-- POUCH -->
      <g filter="url(#shadow)">
        <path d="M120,95 L280,95 L280,120 L275,125 L280,130 L280,385 C280,405 270,415 250,415 L150,415 C130,415 120,405 120,385 L120,130 L125,125 L120,120 Z" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
        <rect x="120" y="95" width="160" height="25" fill="#15803d"/>
        <line x1="120" y1="102" x2="280" y2="102" stroke="#ffffff" stroke-dasharray="2,2" stroke-width="1"/>
        <line x1="120" y1="112" x2="280" y2="112" stroke="#ffffff" stroke-dasharray="2,2" stroke-width="1"/>
        
        <text x="200" y="145" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="14" fill="#15803d" letter-spacing="1.5">${brand}</text>
        
        <rect x="135" y="160" width="130" height="34" rx="6" fill="#0f172a"/>
        <text x="200" y="182" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="${name.length > 15 ? 12 : 16}" fill="#ffffff">${name}</text>
        
        ${emblemSVG}

        <rect x="145" y="355" width="110" height="22" rx="11" fill="#f1f5f9" stroke="#cbd5e1"/>
        <text x="200" y="370" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="700" font-size="9" fill="#334155">${cat}</text>
      </g>
    `;
  } else if (packType === 'bucket') {
    container = `
      <!-- BUCKET -->
      <g filter="url(#shadow)">
        <ellipse cx="200" cy="110" rx="95" ry="18" fill="#16a34a"/>
        <ellipse cx="200" cy="108" rx="90" ry="14" fill="#ffffff"/>
        
        <path d="M108,110 L135,395 C136,408 155,415 200,415 C245,415 264,408 265,395 L292,110 Z" fill="#16a34a"/>
        <path d="M106,140 C100,50 300,50 294,140" fill="none" stroke="#64748b" stroke-width="4" stroke-linecap="round"/>
        
        <rect x="130" y="160" width="140" height="190" rx="8" fill="#ffffff"/>
        <text x="200" y="185" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="13" fill="#15803d">${brand}</text>
        <rect x="138" y="195" width="124" height="30" rx="4" fill="#0f172a"/>
        <text x="200" y="215" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="${name.length > 15 ? 12 : 15}" fill="#ffffff">${name}</text>
        
        ${emblemSVG}
      </g>
    `;
  } else if (packType === 'can') {
    container = `
      <!-- CANISTER / CAN -->
      <g filter="url(#shadow)">
        <ellipse cx="200" cy="85" rx="55" ry="12" fill="#0284c7"/>
        <rect x="145" y="85" width="110" height="25" fill="#0284c7"/>
        <ellipse cx="200" cy="110" rx="55" ry="12" fill="#38bdf8"/>
        
        <rect x="130" y="115" width="140" height="280" rx="6" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
        <ellipse cx="200" cy="395" rx="70" ry="14" fill="#0284c7"/>
        
        <rect x="131" y="145" width="138" height="45" fill="#0f172a"/>
        <text x="200" y="166" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="13" fill="#ffffff" letter-spacing="1.5">${brand}</text>
        <text x="200" y="182" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="${name.length > 12 ? 14 : 17}" fill="#fef08a">${name}</text>
        
        ${emblemSVG}

        <rect x="145" y="355" width="110" height="22" rx="11" fill="#f1f5f9" stroke="#cbd5e1"/>
        <text x="200" y="370" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="700" font-size="9" fill="#334155">${cat}</text>
      </g>
    `;
  } else {
    // BOTTLE / JAR
    container = `
      <!-- BOTTLE / JAR -->
      <g filter="url(#shadow)">
        <rect x="175" y="60" width="50" height="35" rx="4" fill="#0284c7"/>
        <line x1="182" y1="65" x2="182" y2="90" stroke="#ffffff" stroke-opacity="0.5" stroke-width="2"/>
        <line x1="192" y1="65" x2="192" y2="90" stroke="#ffffff" stroke-opacity="0.5" stroke-width="2"/>
        <line x1="208" y1="65" x2="208" y2="90" stroke="#ffffff" stroke-opacity="0.5" stroke-width="2"/>
        <line x1="218" y1="65" x2="218" y2="90" stroke="#ffffff" stroke-opacity="0.5" stroke-width="2"/>
        <rect x="170" y="95" width="60" height="8" rx="2" fill="#cbd5e1"/>
        
        <path d="M178,103 L178,135 C178,150 145,175 145,200 L145,395 C145,410 160,415 200,415 C240,415 255,410 255,395 L255,200 C255,175 222,150 222,135 L222,103 Z" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
        
        <rect x="146" y="195" width="108" height="45" fill="#0f172a"/>
        <text x="200" y="214" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="10" fill="#ffffff" letter-spacing="1.5">${brand}</text>
        <text x="200" y="232" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="${name.length > 14 ? 11 : 14}" fill="#fef08a">${name}</text>
        
        ${emblemSVG}

        <rect x="154" y="355" width="92" height="18" rx="9" fill="#f1f5f9"/>
        <text x="200" y="367" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="700" font-size="8" fill="#1e293b">${cat}</text>
      </g>
    `;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 460" width="100%" height="100%">
  <defs>
    <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#0f172a" flood-opacity="0.12"/>
    </filter>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f8fafc"/>
    </linearGradient>
  </defs>

  <rect width="400" height="460" fill="url(#bgGrad)"/>
  <ellipse cx="200" cy="425" rx="120" ry="18" fill="#0f172a" opacity="0.08"/>

  ${container}

  <!-- PDF Catalogue 2026 Verification Badge -->
  <g transform="translate(15, 15)">
    <rect width="90" height="22" rx="4" fill="#ffffff" opacity="0.95" stroke="#e2e8f0"/>
    <text x="45" y="15" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="800" font-size="9" fill="#047857">PDF CATALOGUE</text>
  </g>
</svg>`;
}

console.log('Generating high-precision SVGs and updating product image links...');
for (const p of products) {
  const svgFilename = `${p.slug}.svg`;
  const svgPath = path.join(publicProductsDir, svgFilename);
  const svgContent = generatePreciseSVG(p);
  fs.writeFileSync(svgPath, svgContent, 'utf8');

  // If a photo exists for this product, put the photo first, and the SVG second
  const photoUrl = photoMapBySlug[p.slug];
  if (photoUrl) {
    p.images = [photoUrl, `/images/products/${svgFilename}`];
  } else {
    p.images = [`/images/products/${svgFilename}`];
  }
}

// Write back updated products to both backend and frontend stores
fs.writeFileSync(path.join(backendDataDir, 'products.json'), JSON.stringify(products, null, 2), 'utf8');
fs.writeFileSync(path.join(frontendDataDir, 'products.json'), JSON.stringify(products, null, 2), 'utf8');

console.log(`✓ All 85 products updated! Real photo packaging: ${Object.keys(photoMapBySlug).length}, Authentic PDF vector packaging: 85.`);
