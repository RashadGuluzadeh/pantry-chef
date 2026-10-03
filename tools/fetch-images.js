/* Downloads one photo per recipe from Wikipedia / Wikimedia Commons into ../images
 * and writes ../js/images.js with the file paths and author/license credits.
 *
 * Run (needs internet + Node 18+):   node tools/fetch-images.js
 * Re-running skips recipes that already have a photo; use --force to re-download all.
 * To change a photo, edit the Wikipedia article title(s) in TITLES below and run again with --force.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const IMG_DIR = path.join(ROOT, 'images');
const OUT = path.join(ROOT, 'js', 'images.js');
const WIDTH = 640;
const UA = 'PantryChefRecipeApp/1.0 (personal, non-commercial recipe viewer)';
const FORCE = process.argv.includes('--force');

// recipe id → Wikipedia article title(s); the first one that has a lead image wins
const TITLES = {
  'chicken-noodle-soup': ['Chicken soup'],
  'red-lentil-soup': ['Lentil soup'],
  'dovga': ['Dovga'],
  'bozbash': ['Bozbash'],
  'kufta-bozbash': ['Bozbash'],
  'vegetable-soup': ['Vegetable soup'],
  'tomato-soup': ['Tomato soup'],
  'mushroom-soup': ['Cream of mushroom soup', 'Mushroom soup'],
  'pumpkin-soup': ['Pumpkin soup'],
  'borscht': ['Borscht'],
  'kharcho': ['Kharcho'],
  'yayla-soup': ['Yayla soup', 'Yogurt soup', 'Ash-e doogh'],
  'minestrone': ['Minestrone'],
  'chicken-corn-soup': ['Corn soup', 'Egg drop soup'],
  'white-bean-soup': ['Bean soup'],
  'gazpacho': ['Gazpacho'],
  'chicken-stir-fry': ['Stir frying'],
  'chicken-pilaf': ['Pilaf'],
  'chicken-chighirtma': ['Chighirtma', 'Chakhokhbili'],
  'yogurt-lemon-chicken': ['Tavuk şiş', 'Roast chicken'],
  'creamy-chicken-pasta': ['Fettuccine Alfredo'],
  'chicken-curry': ['Chicken curry', 'Chicken tikka masala', 'Curry'],
  'teriyaki-chicken': ['Teriyaki'],
  'chicken-fajitas': ['Fajita'],
  'chicken-shawarma': ['Shawarma'],
  'chicken-schnitzel': ['Schnitzel'],
  'chicken-mushroom-julienne': ['Julienne (dish)', 'Cocotte'],
  'roast-chicken-potatoes': ['Roast chicken'],
  'chicken-fried-rice': ['Fried rice'],
  'chicken-lavangi': ['Lavangi'],
  'chicken-kebab': ['Shish kebab'],
  'beef-stroganoff': ['Beef Stroganoff'],
  'beef-potato-qovurma': ['Qovurma', 'Kavurma'],
  'cutlets': ['Kotlet', 'Kotleta'],
  'bolognese': ['Bolognese sauce'],
  'stuffed-peppers': ['Stuffed peppers'],
  'yarpaq-dolma': ['Dolma'],
  'cabbage-dolma': ['Cabbage roll'],
  'plov': ['Azerbaijani pilaf', 'Pilaf'],
  'lula-kebab': ['Lula kebab'],
  'meat-qutab': ['Qutab'],
  'moussaka': ['Moussaka'],
  'lasagna': ['Lasagna'],
  'chili-con-carne': ['Chili con carne'],
  'beef-tacos': ['Taco'],
  'beef-stew': ['Beef stew', 'Stew'],
  'beef-broccoli': ['Beef and broccoli'],
  'burger': ['Hamburger'],
  'eggplant-kebab': ['Patlıcan kebabı', 'Kebab'],
  'saj-ichi': ['Saj ichi', 'Sac kavurma', 'Kavurma'],
  'lamb-chops': ['Lamb chop', 'Chop (meat)'],
  'meat-potato-bake': ['Shepherd\'s pie', 'Casserole'],
  'sausage-pasta': ['Penne', 'Pasta'],
  'baked-lemon-fish': ['Baked fish', 'Fish as food'],
  'fried-fish': ['Fried fish'],
  'garlic-butter-shrimp': ['Gambas al ajillo', 'Garlic shrimp'],
  'shrimp-pasta': ['Shrimp scampi', 'Scampi'],
  'salmon-teriyaki': ['Salmon as food', 'Teriyaki'],
  'fish-lavangi': ['Lavangi'],
  'ajapsandal': ['Ajapsandali'],
  'mushroom-potatoes': ['Home fries'],
  'imam-bayildi': ['İmam bayıldı', 'Imam bayildi'],
  'ratatouille': ['Ratatouille'],
  'veg-noodles': ['Chow mein', 'Lo mein'],
  'chana-masala': ['Chana masala'],
  'pasta-pomodoro': ['Pasta al pomodoro'],
  'aglio-olio': ['Spaghetti aglio e olio'],
  'pizza-margherita': ['Pizza Margherita'],
  'green-bean-eggs': ['Green bean', 'Frittata'],
  'spinach-borek': ['Börek'],
  'mushroom-risotto': ['Risotto'],
  'potato-pancakes': ['Potato pancake'],
  'mac-and-cheese': ['Macaroni and cheese'],
  'fried-potatoes': ['Home fries', 'Fried potatoes'],
  'mashed-potatoes': ['Mashed potato'],
  'bulgur-pilaf': ['Bulgur pilaf', 'Bulgur'],
  'plain-rice': ['Cooked rice', 'Rice'],
  'potato-wedges': ['Potato wedges'],
  'fried-cauliflower': ['Cauliflower'],
  'shepherd-salad': ['Shepherd\'s salad'],
  'cabbage-carrot-salad': ['Coleslaw'],
  'chicken-veg-salad': ['Chicken salad', 'Salad'],
  'greek-salad': ['Greek salad'],
  'caesar-salad': ['Caesar salad'],
  'olivier': ['Olivier salad'],
  'beet-salad': ['Beetroot salad', 'Beetroot'],
  'tuna-salad': ['Tuna salad'],
  'bean-salad': ['Piyaz', 'Bean salad'],
  'tabbouleh': ['Tabbouleh'],
  'mangal-salad': ['Mangal salad', 'Baba ghanoush'],
  'cacik': ['Cacık', 'Tzatziki'],
  'herb-kuku': ['Kuku (food)', 'Kuku sabzi'],
  'greens-qutab': ['Qutab'],
  'eggplant-yogurt': ['Eggplant salads and appetizers', 'Eggplant'],
  'lentil-kofte': ['Mercimek köftesi', 'Kofta'],
  'zucchini-fritters': ['Mücver', 'Fritter'],
  'hummus': ['Hummus'],
  'guacamole': ['Guacamole'],
  'garlic-bread': ['Garlic bread'],
  'quesadilla': ['Quesadilla'],
  'deviled-eggs': ['Deviled egg'],
  'bruschetta': ['Bruschetta'],
  'tuna-sandwich': ['Tuna fish sandwich', 'Tuna salad'],
  'cheese-toast': ['Cheese sandwich'],
  'tomato-eggs': ['Menemen (food)', 'Scrambled eggs'],
  'cheese-omelet': ['Omelette'],
  'spinach-eggs': ['Eggs Florentine', 'Spinach'],
  'banana-oatmeal': ['Oatmeal', 'Porridge'],
  'menemen': ['Menemen (food)'],
  'shakshuka': ['Shakshouka'],
  'french-toast': ['French toast'],
  'avocado-toast': ['Avocado toast'],
  'pancakes': ['Pancake'],
  'syrniki': ['Syrniki'],
  'eggs-sausage': ['Full breakfast', 'Fried egg'],
  'rice-porridge': ['Rice pudding', 'Rice porridge'],
  'yogurt-parfait': ['Parfait'],
  'crepes': ['Crêpe'],
  'apple-charlotte': ['Sharlotka', 'Apple cake', 'Charlotte (cake)'],
  'banana-bread': ['Banana bread'],
  'rice-pudding': ['Sütlaç', 'Rice pudding'],
  'brownies': ['Chocolate brownie'],
  'baked-apples': ['Baked apple'],
  'halva': ['Halva'],
  'fruit-salad': ['Fruit salad'],
  'cottage-cheese-bake': ['Zapekanka', 'Cheesecake'],
  'upgraded-noodles': ['Instant noodles', 'Ramen'],
  'noodle-stir-fry': ['Yakisoba', 'Instant noodles'],
  'butter-cheese-pasta': ['Pasta al burro', 'Buttered noodles', 'Cacio e pepe'],
  'ketchup-sausage-pasta': ['Spaghetti Napolitan', 'Hot dog'],
  'tuna-pasta': ['Tuna pasta', 'Pasta'],
  'tomato-paste-pasta': ['Spaghetti al pomodoro', 'Pasta al pomodoro'],
  'navy-pasta': ['Navy-style pasta', 'Makarony po-flotski', 'Pasta'],
  'fried-eggs': ['Fried egg'],
  'egg-in-hole': ['Egg in the basket'],
  'scrambled-egg-toast': ['Scrambled eggs'],
  'mug-omelette': ['Omelette'],
  'lavash-egg-wrap': ['Wrap (food)', 'Lavash'],
  'lazy-khachapuri': ['Khachapuri'],
  'pelmeni': ['Pelmeni'],
  'fried-pelmeni': ['Potstickers', 'Jiaozi', 'Pelmeni'],
  'buckwheat': ['Buckwheat porridge', 'Kasha', 'Buckwheat'],
  'buckwheat-sausage': ['Kasha', 'Buckwheat'],
  'egg-fried-rice': ['Egg fried rice', 'Fried rice'],
  'tuna-rice-bowl': ['Donburi', 'Tuna'],
  'jacket-potato': ['Baked potato', 'Jacket potato', 'Potato'],
  // Azerbaijani
  'piti': ['Piti (food)', 'Piti'],
  'dushbara': ['Dushbara'],
  'khingal': ['Khingal', 'Khinkal'],
  'tava-kebab': ['Tava kebab', 'Kebab'],
  'turshu-qovurma': ['Turshu qovurma', 'Qovurma'],
  'sabzi-qovurma': ['Sabzi qovurma', 'Ghormeh sabzi'],
  'three-sisters-dolma': ['Three sisters dolma', 'Dolma'],
  'pumpkin-qutab': ['Qutab'],
  'arishta-ashi': ['Ash reshteh'],
  'narsharab-chicken': ['Narsharab', 'Pomegranate juice'],
  'sturgeon-kebab': ['Sturgeon kebab', 'Shashlik'],
  'fisinjan': ['Fesenjan'],
  'shah-plov': ['Shah plov', 'Azerbaijani pilaf'],
  'shekerbura': ['Shekerbura'],
  'pakhlava': ['Pakhlava', 'Baklava'],
  'kata': ['Gata (food)', 'Gata (bread)', 'Gata'],
  'sherbet': ['Sharbat (drink)', 'Sherbet'],
  // Georgian
  'adjaruli-khachapuri': ['Adjarian khachapuri', 'Khachapuri'],
  'imeruli-khachapuri': ['Imeruli khachapuri', 'Khachapuri'],
  'khinkali': ['Khinkali'],
  'chakhokhbili': ['Chakhokhbili'],
  'satsivi': ['Satsivi'],
  'chkmeruli': ['Shkmeruli', 'Chkmeruli'],
  'lobio': ['Lobio'],
  'pkhali': ['Pkhali'],
  'badrijani': ['Badrijani nigvzit', 'Eggplant salads and appetizers'],
  'mtsvadi': ['Mtsvadi', 'Shashlik'],
  'ojakhuri': ['Ojakhuri'],
  'chashushuli': ['Chashushuli'],
  'chikhirtma': ['Chikhirtma'],
  'georgian-salad': ['Georgian salad', 'Shepherd\'s salad'],
  'lobiani': ['Lobiani'],
  'gozinaki': ['Gozinaki'],
  // Turkish
  'lahmacun': ['Lahmacun'],
  'pide': ['Pide'],
  'iskender': ['İskender kebap', 'Iskender kebap'],
  'adana-kebab': ['Adana kebabı', 'Adana kebab'],
  'kofte': ['Köfte', 'Kofta'],
  'karniyarik': ['Karnıyarık'],
  'manti': ['Manti (food)'],
  'ezogelin': ['Ezogelin soup'],
  'tavuk-sote': ['Tavuk sote', 'Sautéed chicken'],
  'sigara-boregi': ['Sigara böreği', 'Börek'],
  'gozleme': ['Gözleme'],
  'cilbir': ['Çılbır'],
  'sucuklu-yumurta': ['Sucuk', 'Sujuk'],
  'kisir': ['Kısır'],
  'hunkar-begendi': ['Hünkâr beğendi', 'Hünkar beğendi'],
  'sehriyeli-pilav': ['Turkish pilaf', 'Pilaf'],
  'revani': ['Revani'],
  'irmik-helvasi': ['Semolina halva', 'Halva'],
  'herb-potatoes': ['Boiled potatoes', 'New potato', 'Potato'],
  'spanish-omelette': ['Spanish omelette'],
  'cabbage-egg': ['Stir-fried cabbage', 'Cabbage'],
  'veg-rice': ['Vegetable rice', 'Fried rice'],
  'mujaddara': ['Mujaddara'],
  'beans-on-toast': ['Beans on toast'],
  'chickpea-tomato': ['Chickpea stew', 'Chickpea'],
  'pizza-toast': ['Pizza toast', 'Cheese on toast'],
  'lavash-pizza': ['Pizza', 'Flatbread'],
  'hot-sandwich': ['Grilled cheese', 'Toast sandwich'],
  'pan-chicken': ['Fried chicken', 'Chicken as food'],
  'egg-drop-soup': ['Egg drop soup'],
  'banana-pancakes': ['Banana pancakes', 'Pancake'],
  'overnight-oats': ['Overnight oats', 'Bircher muesli'],
  'pb-banana-toast': ['Peanut butter and banana sandwich', 'Peanut butter'],
  'mug-cake': ['Mug cake'],
  'turshu-qovurma': ['Turshu qovurma', 'Kavurma', 'Qovurma'],
  'shah-plov': ['Shah plov', 'Azerbaijani pilaf', 'Pilaf'],
  'imeruli-khachapuri': ['Imeruli khachapuri', 'Khachapuri'],
  'pkhali': ['Pkhali', 'Phkhali', 'Mkhali'],
  'pide': ['Pide', 'Turkish pide', 'Pide (food)'],
  'tavuk-sote': ['Tavuk sote', 'Chicken as food'],
  'sucuklu-yumurta': ['Sucuk', 'Sujuk', 'Sucuk (food)'],
  'tuna-melt': ['Tuna melt'],
  'tuna-patties': ['Fish cake', 'Tuna'],
  'tuna-bean-salad': ['Tuna and bean salad', 'Tuna salad'],
  'tuna-omelette': ['Omelette'],
  'tuna-wrap': ['Wrap (food)'],
  'tuna-pasta-salad': ['Pasta salad'],
  'tuna-avocado': ['Avocado'],
  'yogurt-flatbread': ['Flatbread'],
  'yogurt-pasta': ['Manti (food)', 'Pasta'],
  'spinach-borani': ['Borani', 'Spinach'],
  'labneh': ['Labneh', 'Strained yogurt'],
  'yogurt-cake': ['Yogurt cake', 'Pound cake'],
  'lassi': ['Lassi'],
  'frozen-yogurt-bark': ['Frozen yogurt'],
  'pb-oatmeal': ['Oatmeal', 'Porridge'],
  'pb-smoothie': ['Smoothie'],
  'peanut-noodles': ['Peanut noodles', 'Dan dan noodles', 'Noodle'],
  'chicken-satay': ['Satay'],
  'energy-balls': ['Energy ball', 'Rum ball', 'Peanut butter'],
  'pb-cookies': ['Peanut butter cookie'],
  'pbj-sandwich': ['Peanut butter and jelly sandwich'],
  'apple-pb': ['Peanut butter', 'Apple'],
  'ayran': ['Ayran'],
  'smoothie': ['Smoothie'],
  'milkshake': ['Milkshake'],
  'lemonade': ['Lemonade']
};

const sleep = ms => new Promise(r => setTimeout(r, ms));
const stripHtml = s => String(s || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

// Retries on rate limits and flaky connections
async function request(url) {
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA, 'Api-User-Agent': UA } });
      if (res.status !== 429 && res.status < 500) return res;
    } catch { /* network hiccup — retry */ }
    await sleep(2000 * (attempt + 1));
  }
  return null;
}

async function getJson(url) {
  const res = await request(url);
  return res && res.ok ? res.json() : null;
}

async function findImage(title) {
  const summary = await getJson(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, '_'))}`);
  if (!summary || !summary.originalimage) return null;
  // ".../commons/a/ab/Name.jpg" or, for big files, ".../commons/thumb/a/ab/Name.jpg/3840px-Name.jpg"
  const parts = summary.originalimage.source.split('?')[0].split('/');
  const fileName = decodeURIComponent(parts.includes('thumb') ? parts[parts.length - 2] : parts[parts.length - 1]);
  const info = await getJson('https://en.wikipedia.org/w/api.php?action=query&format=json&prop=imageinfo'
    + `&iiprop=url|extmetadata|mime&iiurlwidth=${WIDTH}&titles=${encodeURIComponent('File:' + fileName)}`);
  const page = info && Object.values(info.query.pages)[0];
  const ii = page && page.imageinfo && page.imageinfo[0];
  if (!ii) return null;
  const meta = ii.extmetadata || {};
  return {
    url: ii.thumburl || ii.url,
    article: summary.content_urls.desktop.page,
    filePage: ii.descriptionurl,
    author: stripHtml(meta.Artist && meta.Artist.value) || 'Unknown',
    license: stripHtml(meta.LicenseShortName && meta.LicenseShortName.value) || ''
  };
}

async function main() {
  global.window = {};
  require(path.join(ROOT, 'js', 'data.js'));
  const recipes = window.RECIPES;
  fs.mkdirSync(IMG_DIR, { recursive: true });

  let existing = {};
  if (!FORCE && fs.existsSync(OUT)) {
    const w = {};
    new Function('window', fs.readFileSync(OUT, 'utf8'))(w);
    existing = w.RECIPE_IMAGES || {};
  }

  const result = {};
  const missing = [];
  for (const r of recipes) {
    if (existing[r.id] && fs.existsSync(path.join(ROOT, existing[r.id].src))) {
      result[r.id] = existing[r.id];
      continue;
    }
    let found = null;
    for (const title of TITLES[r.id] || [r.name]) {
      found = await findImage(title);
      await sleep(150);
      if (found) break;
    }
    if (!found) { missing.push(r.id); console.log(`✗ ${r.id}`); continue; }

    const res = await request(found.url);
    if (!res || !res.ok) { missing.push(r.id); console.log(`✗ ${r.id} (download failed)`); continue; }
    const ext = (res.headers.get('content-type') || '').includes('png') ? 'png'
      : (res.headers.get('content-type') || '').includes('webp') ? 'webp' : 'jpg';
    const file = `images/${r.id}.${ext}`;
    fs.writeFileSync(path.join(ROOT, file), Buffer.from(await res.arrayBuffer()));
    result[r.id] = { src: file, author: found.author, license: found.license, source: found.filePage };
    console.log(`✓ ${r.id}  ←  ${found.article}`);
    await sleep(150);
  }

  fs.writeFileSync(OUT,
    '/* Generated by tools/fetch-images.js — recipe photos from Wikimedia Commons with author & license. */\n'
    + `window.RECIPE_IMAGES = ${JSON.stringify(result, null, 2)};\n`);
  console.log(`\nDone: ${Object.keys(result).length}/${recipes.length} photos.`
    + (missing.length ? ` Without photo: ${missing.join(', ')}` : ''));
}

main().catch(err => { console.error(err); process.exit(1); });
