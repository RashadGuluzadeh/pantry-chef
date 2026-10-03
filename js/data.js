/* Ingredient catalogue and recipe database.
 *
 * Ingredient units: 'g', 'ml' or 'pcs'. `piece` = average weight of one piece in grams,
 * used to convert between "2 pcs" and "300 g".
 *
 * Recipe ingredients are written as a compact string:
 *   'chicken 300, onion 1, herbs 20?, salt'
 *   - the number is in the ingredient's own unit
 *   - a trailing ? marks the ingredient as optional
 *   - pantry staples (salt, oil, ...) may omit the amount ("to taste")
 */

window.INGREDIENTS = [
  // Meat, fish & eggs
  { id: 'chicken', name: 'Chicken', unit: 'g', emoji: '🍗', aliases: ['chicken breast', 'chicken thigh', 'chicken fillet', 'toyuq', 'toyuq əti'] },
  { id: 'beef', name: 'Beef', unit: 'g', emoji: '🥩', aliases: ['steak', 'veal', 'mal əti', 'dana'] },
  { id: 'lamb', name: 'Lamb', unit: 'g', emoji: '🍖', aliases: ['mutton', 'qoyun əti', 'quzu'] },
  { id: 'ground_meat', name: 'Ground meat', unit: 'g', emoji: '🥩', aliases: ['minced meat', 'mince', 'ground beef', 'ground lamb', 'qiymə'] },
  { id: 'fish', name: 'Fish', unit: 'g', emoji: '🐟', aliases: ['salmon', 'trout', 'sea bass', 'cod', 'sturgeon', 'balıq'] },
  { id: 'shrimp', name: 'Shrimp', unit: 'g', emoji: '🍤', aliases: ['prawns', 'krevet'] },
  { id: 'tuna', name: 'Canned tuna', unit: 'g', emoji: '🥫', aliases: ['tuna', 'tuna can'] },
  { id: 'sausage', name: 'Sausage', unit: 'g', piece: 50, emoji: '🌭', aliases: ['sausages', 'hot dog', 'sucuk', 'sujuk', 'kolbasa', 'sosiska'] },
  { id: 'egg', name: 'Eggs', unit: 'pcs', piece: 55, emoji: '🥚', aliases: ['egg', 'yumurta'] },

  // Vegetables
  { id: 'onion', name: 'Onion', unit: 'pcs', piece: 110, emoji: '🧅', aliases: ['onions', 'soğan'] },
  { id: 'garlic', name: 'Garlic', unit: 'pcs', label: ['clove', 'cloves'], piece: 5, emoji: '🧄', aliases: ['garlic clove', 'sarımsaq'] },
  { id: 'potato', name: 'Potatoes', unit: 'pcs', piece: 150, emoji: '🥔', aliases: ['potato', 'kartof'] },
  { id: 'tomato', name: 'Tomatoes', unit: 'pcs', piece: 120, emoji: '🍅', aliases: ['tomato', 'canned tomatoes', 'pomidor'] },
  { id: 'cucumber', name: 'Cucumber', unit: 'pcs', piece: 120, emoji: '🥒', aliases: ['cucumbers', 'pickles', 'xiyar'] },
  { id: 'bell_pepper', name: 'Bell pepper', unit: 'pcs', piece: 150, emoji: '🫑', aliases: ['pepper', 'peppers', 'sweet pepper', 'capsicum', 'bibər'] },
  { id: 'chili', name: 'Chili pepper', unit: 'pcs', piece: 15, emoji: '🌶️', aliases: ['chili', 'chilli', 'hot pepper', 'jalapeno'] },
  { id: 'eggplant', name: 'Eggplant', unit: 'pcs', piece: 250, emoji: '🍆', aliases: ['aubergine', 'badımcan'] },
  { id: 'zucchini', name: 'Zucchini', unit: 'pcs', piece: 200, emoji: '🥒', aliases: ['courgette', 'squash', 'balqabaq'] },
  { id: 'carrot', name: 'Carrots', unit: 'pcs', piece: 80, emoji: '🥕', aliases: ['carrot', 'yerkökü'] },
  { id: 'cabbage', name: 'Cabbage', unit: 'g', emoji: '🥬', aliases: ['white cabbage', 'kələm'] },
  { id: 'broccoli', name: 'Broccoli', unit: 'g', emoji: '🥦', aliases: [] },
  { id: 'cauliflower', name: 'Cauliflower', unit: 'g', emoji: '🥦', aliases: ['gül kələm'] },
  { id: 'spinach', name: 'Spinach', unit: 'g', emoji: '🥬', aliases: ['ispanaq'] },
  { id: 'mushroom', name: 'Mushrooms', unit: 'g', emoji: '🍄', aliases: ['mushroom', 'champignon', 'göbələk'] },
  { id: 'green_beans', name: 'Green beans', unit: 'g', emoji: '🫛', aliases: ['string beans', 'yaşıl lobya'] },
  { id: 'peas', name: 'Green peas', unit: 'g', emoji: '🫛', aliases: ['peas', 'yaşıl noxud'] },
  { id: 'corn', name: 'Sweet corn', unit: 'g', emoji: '🌽', aliases: ['corn', 'canned corn', 'qarğıdalı'] },
  { id: 'pumpkin', name: 'Pumpkin', unit: 'g', emoji: '🎃', aliases: ['butternut'] },
  { id: 'beetroot', name: 'Beetroot', unit: 'pcs', piece: 200, emoji: '🟣', aliases: ['beet', 'beets', 'çuğundur'] },
  { id: 'lettuce', name: 'Lettuce', unit: 'g', emoji: '🥬', aliases: ['salad leaves', 'romaine', 'iceberg', 'kahı'] },
  { id: 'avocado', name: 'Avocado', unit: 'pcs', piece: 170, emoji: '🥑', aliases: [] },
  { id: 'herbs', name: 'Fresh herbs', unit: 'g', emoji: '🌿', aliases: ['herbs', 'parsley', 'dill', 'coriander', 'cilantro', 'basil', 'mint', 'green onion', 'spring onion', 'tarragon', 'sorrel', 'tarxun', 'göyərti'] },
  { id: 'ginger', name: 'Ginger', unit: 'g', emoji: '🫚', aliases: ['fresh ginger'] },
  { id: 'olives', name: 'Olives', unit: 'g', emoji: '🫒', aliases: ['olive', 'zeytun'] },
  { id: 'grape_leaves', name: 'Grape leaves', unit: 'g', emoji: '🍃', aliases: ['vine leaves', 'yarpaq'] },

  // Fruit
  { id: 'lemon', name: 'Lemon', unit: 'pcs', piece: 100, emoji: '🍋', aliases: ['lemons', 'lime', 'limon'] },
  { id: 'apple', name: 'Apples', unit: 'pcs', piece: 180, emoji: '🍎', aliases: ['apple', 'alma'] },
  { id: 'banana', name: 'Bananas', unit: 'pcs', piece: 120, emoji: '🍌', aliases: ['banana', 'banan'] },
  { id: 'orange', name: 'Oranges', unit: 'pcs', piece: 150, emoji: '🍊', aliases: ['orange', 'mandarin', 'portağal'] },
  { id: 'berries', name: 'Berries', unit: 'g', emoji: '🍓', aliases: ['strawberries', 'strawberry', 'raspberries', 'blueberries', 'frozen berries', 'çiyələk'] },
  { id: 'pomegranate', name: 'Pomegranate / narsharab', unit: 'pcs', piece: 300, emoji: '🔴', aliases: ['pomegranate', 'pomegranate molasses', 'pomegranate sauce', 'narsharab', 'narşərab', 'nar'] },
  { id: 'dried_fruit', name: 'Dried fruit', unit: 'g', emoji: '🍑', aliases: ['raisins', 'dried apricots', 'prunes', 'dates', 'kişmiş', 'qaysı qurusu'] },

  // Grains, legumes & bakery
  { id: 'rice', name: 'Rice', unit: 'g', emoji: '🍚', aliases: ['basmati', 'düyü'] },
  { id: 'pasta', name: 'Pasta / noodles', unit: 'g', emoji: '🍝', aliases: ['pasta', 'spaghetti', 'penne', 'macaroni', 'noodles', 'lasagna sheets', 'makaron', 'əriştə'] },
  { id: 'bulgur', name: 'Bulgur', unit: 'g', emoji: '🌾', aliases: ['bulghur', 'cracked wheat'] },
  { id: 'lentils', name: 'Lentils', unit: 'g', emoji: '🫘', aliases: ['red lentils', 'lentil', 'mərci'] },
  { id: 'chickpeas', name: 'Chickpeas', unit: 'g', emoji: '🫘', aliases: ['chickpea', 'garbanzo', 'noxud'] },
  { id: 'beans', name: 'Beans', unit: 'g', emoji: '🫘', aliases: ['kidney beans', 'white beans', 'canned beans', 'lobya'] },
  { id: 'semolina', name: 'Semolina', unit: 'g', emoji: '🌾', aliases: ['irmik', 'manna', 'griz', 'farina'] },
  { id: 'oats', name: 'Oats', unit: 'g', emoji: '🥣', aliases: ['oatmeal', 'rolled oats', 'yulaf'] },
  { id: 'flour', name: 'Flour', unit: 'g', emoji: '🌾', aliases: ['wheat flour', 'un'] },
  { id: 'bread', name: 'Bread', unit: 'g', piece: 30, emoji: '🍞', aliases: ['toast', 'baguette', 'buns', 'breadcrumbs', 'çörək'] },
  { id: 'tortilla', name: 'Tortilla / lavash', unit: 'pcs', piece: 60, emoji: '🫓', aliases: ['tortillas', 'lavash', 'wrap', 'pita', 'yufka', 'lavaş'] },
  { id: 'yeast', name: 'Yeast', unit: 'g', emoji: '🧫', aliases: ['dry yeast', 'maya'] },

  // Dairy
  { id: 'milk', name: 'Milk', unit: 'ml', emoji: '🥛', aliases: ['süd'] },
  { id: 'yogurt', name: 'Yogurt', unit: 'ml', emoji: '🥣', aliases: ['plain yogurt', 'greek yogurt', 'matsoni', 'yoğurt', 'qatıq'] },
  { id: 'cream', name: 'Cream', unit: 'ml', emoji: '🥛', aliases: ['heavy cream', 'cooking cream', 'qaymaq', 'sliva'] },
  { id: 'sour_cream', name: 'Sour cream / mayo', unit: 'g', emoji: '🥄', aliases: ['sour cream', 'mayonnaise', 'mayo', 'xama', 'smetana'] },
  { id: 'cheese', name: 'Cheese', unit: 'g', emoji: '🧀', aliases: ['cheddar', 'mozzarella', 'parmesan', 'kashar', 'suluguni', 'imeruli', 'kaşar', 'pendir'] },
  { id: 'feta', name: 'Feta / white cheese', unit: 'g', emoji: '🧀', aliases: ['feta', 'white cheese', 'brynza', 'ağ pendir'] },
  { id: 'cottage_cheese', name: 'Cottage cheese', unit: 'g', emoji: '🥣', aliases: ['curd', 'ricotta', 'tvorog', 'kəsmik'] },
  { id: 'butter', name: 'Butter', unit: 'g', emoji: '🧈', aliases: ['kərə yağı'] },

  // Other
  { id: 'tomato_paste', name: 'Tomato paste', unit: 'g', emoji: '🥫', aliases: ['tomato puree', 'tomat'] },
  { id: 'soy_sauce', name: 'Soy sauce', unit: 'ml', emoji: '🍶', aliases: ['soya sauce'] },
  { id: 'walnuts', name: 'Walnuts', unit: 'g', emoji: '🌰', aliases: ['nuts', 'walnut', 'qoz'] },
  { id: 'honey', name: 'Honey', unit: 'g', emoji: '🍯', aliases: ['bal'] },
  { id: 'chocolate', name: 'Chocolate / cocoa', unit: 'g', emoji: '🍫', aliases: ['chocolate', 'cocoa', 'dark chocolate', 'şokolad'] },
  { id: 'ketchup', name: 'Ketchup', unit: 'g', emoji: '🥫', aliases: ['tomato ketchup', 'ketçup'] },
  { id: 'peanut_butter', name: 'Peanut butter', unit: 'g', emoji: '🥜', aliases: ['peanut paste', 'fıstıq yağı', 'fıstıq əzməsi', 'fıstık ezmesi'] },
  { id: 'jam', name: 'Jam', unit: 'g', emoji: '🍓', aliases: ['jelly', 'preserves', 'mürəbbə', 'cem'] },

  // Student-kitchen basics
  { id: 'instant_noodles', name: 'Instant noodles', unit: 'pcs', label: ['pack', 'packs'], piece: 75, emoji: '🍜', aliases: ['ramen', 'instant ramen', 'doshirak', 'rollton', 'mivina', 'noodle pack', 'doşirak'] },
  { id: 'pelmeni', name: 'Frozen dumplings', unit: 'g', emoji: '🥟', aliases: ['pelmeni', 'dumplings', 'vareniki', 'gyoza', 'düşbərə'] },
  { id: 'frozen_veg', name: 'Frozen vegetables', unit: 'g', emoji: '🧊', aliases: ['frozen veg', 'mixed vegetables', 'frozen mix', 'dondurulmuş tərəvəz'] },
  { id: 'buckwheat', name: 'Buckwheat', unit: 'g', emoji: '🌾', aliases: ['grechka', 'kasha', 'qarabaşaq', 'qreçka'] },

  // Pantry staples — most kitchens always have these
  { id: 'salt', name: 'Salt', unit: 'g', emoji: '🧂', staple: true, aliases: [] },
  { id: 'pepper', name: 'Black pepper', unit: 'g', emoji: '⚫', staple: true, aliases: ['black pepper'] },
  { id: 'oil', name: 'Cooking oil', unit: 'ml', emoji: '🫗', staple: true, aliases: ['oil', 'olive oil', 'sunflower oil', 'vegetable oil'] },
  { id: 'sugar', name: 'Sugar', unit: 'g', emoji: '🍬', staple: true, aliases: [] },
  { id: 'spices', name: 'Spices', unit: 'g', emoji: '🌶️', staple: true, aliases: ['cumin', 'paprika', 'turmeric', 'cinnamon', 'saffron', 'dried mint', 'bay leaf', 'sumac', 'chili flakes', 'pul biber', 'khmeli suneli', 'zəfəran'] },
  { id: 'vinegar', name: 'Vinegar', unit: 'ml', emoji: '🍶', staple: true, aliases: [] },
  { id: 'baking', name: 'Baking powder / soda', unit: 'g', emoji: '🧁', staple: true, aliases: ['baking powder', 'baking soda'] },
  { id: 'water', name: 'Water', unit: 'ml', emoji: '💧', staple: true, aliases: [] }
];

/* Approximate nutrition per 100 g (or 100 ml): [kcal, protein g, fat g, carbs g].
 * Raw weights for meat/fish/veg, dry weights for rice/pasta/grains, cooked/canned for chickpeas & beans. */
window.NUTRITION = {
  chicken: [150, 21, 7, 0], beef: [200, 20, 13, 0], lamb: [250, 17, 20, 0], ground_meat: [250, 17, 20, 0],
  fish: [130, 20, 5, 0], shrimp: [85, 20, 0.5, 0], tuna: [150, 25, 5, 0], sausage: [280, 12, 25, 2], egg: [143, 12.6, 9.5, 0.7],
  onion: [40, 1.1, 0.1, 9], garlic: [149, 6.4, 0.5, 33], potato: [77, 2, 0.1, 17], tomato: [18, 0.9, 0.2, 3.9],
  cucumber: [15, 0.7, 0.1, 3.6], bell_pepper: [26, 1, 0.3, 6], chili: [40, 2, 0.4, 9], eggplant: [25, 1, 0.2, 6],
  zucchini: [17, 1.2, 0.3, 3.1], carrot: [41, 0.9, 0.2, 10], cabbage: [25, 1.3, 0.1, 6], broccoli: [34, 2.8, 0.4, 7],
  cauliflower: [25, 1.9, 0.3, 5], spinach: [23, 2.9, 0.4, 3.6], mushroom: [22, 3.1, 0.3, 3.3], green_beans: [31, 1.8, 0.2, 7],
  peas: [81, 5.4, 0.4, 14], corn: [86, 3.3, 1.4, 19], pumpkin: [26, 1, 0.1, 6.5], beetroot: [43, 1.6, 0.2, 10],
  lettuce: [15, 1.4, 0.2, 2.9], avocado: [160, 2, 15, 9], herbs: [36, 3, 0.8, 6], ginger: [80, 1.8, 0.8, 18],
  olives: [115, 0.8, 11, 6], grape_leaves: [93, 5.6, 2.1, 17], lemon: [29, 1.1, 0.3, 9], apple: [52, 0.3, 0.2, 14],
  banana: [89, 1.1, 0.3, 23], orange: [47, 0.9, 0.1, 12], berries: [40, 0.8, 0.3, 9], pomegranate: [83, 1.7, 1.2, 19],
  dried_fruit: [280, 2.5, 0.5, 70], rice: [360, 7, 0.6, 79], pasta: [360, 12.5, 1.5, 72], bulgur: [342, 12, 1.3, 76],
  lentils: [350, 24, 1.5, 60], chickpeas: [164, 9, 2.6, 27], beans: [130, 8.7, 0.5, 23], oats: [380, 13, 7, 67],
  flour: [364, 10, 1, 76], bread: [265, 9, 3.2, 49], tortilla: [300, 8.5, 7, 50], yeast: [0, 0, 0, 0],
  semolina: [360, 12.7, 1, 73], buckwheat: [343, 13, 3.4, 72], instant_noodles: [450, 9, 18, 63], pelmeni: [275, 11, 13, 28],
  frozen_veg: [65, 3, 0.5, 13], milk: [60, 3.2, 3.2, 4.8], yogurt: [61, 3.5, 3.3, 4.7], cream: [250, 2.5, 25, 3.5],
  sour_cream: [250, 2, 25, 4], cheese: [350, 24, 27, 2], feta: [265, 14, 21, 4], cottage_cheese: [120, 16, 5, 3],
  butter: [717, 0.9, 81, 0.1], tomato_paste: [82, 4.3, 0.5, 19], soy_sauce: [53, 8, 0.6, 5], walnuts: [654, 15, 65, 14],
  honey: [304, 0.3, 0, 82], chocolate: [550, 6, 35, 50], ketchup: [112, 1.2, 0.1, 26], peanut_butter: [590, 25, 50, 20],
  jam: [250, 0.4, 0.1, 63],
  salt: [0, 0, 0, 0], pepper: [0, 0, 0, 0], spices: [0, 0, 0, 0], vinegar: [20, 0, 0, 1], baking: [0, 0, 0, 0], water: [0, 0, 0, 0],
  oil: [884, 0, 100, 0], sugar: [400, 0, 0, 100]
};

// Grams of an ingredient from an amount in its own unit (ml counted as grams)
window.ingredientGrams = (ing, qty) => (ing.unit === 'pcs' ? qty * (ing.piece || 0) : qty);

(function () {
  const MEAT = new Set(['chicken', 'beef', 'lamb', 'ground_meat', 'fish', 'shrimp', 'tuna', 'sausage']);

  function parse(id, list) {
    return list.split(',').map(part => {
      const m = part.trim().match(/^([a-z_]+)(?:\s+([\d.]+))?(\?)?$/);
      if (!m) throw new Error(`Bad ingredient "${part}" in recipe ${id}`);
      return { id: m[1], qty: m[2] ? Number(m[2]) : null, opt: Boolean(m[3]) };
    });
  }

  const STAPLES = new Set(window.INGREDIENTS.filter(i => i.staple).map(i => i.id));
  const ING = Object.fromEntries(window.INGREDIENTS.map(i => [i.id, i]));
  const OIL_PER_SERVING = 7; // ml, used when a recipe just says "oil"

  // Nutrition per serving from the ingredients (optional extras not included)
  function nutrition(ingredients, servings) {
    const t = [0, 0, 0, 0];
    ingredients.forEach(i => {
      if (i.opt) return;
      const grams = i.qty == null ? (i.id === 'oil' ? OIL_PER_SERVING * servings : 0) : window.ingredientGrams(ING[i.id], i.qty);
      window.NUTRITION[i.id].forEach((v, k) => { t[k] += v * grams / 100; });
    });
    const [kcal, protein, fat, carbs] = t.map(v => v / servings);
    return { kcal: Math.round(kcal / 10) * 10, protein: Math.round(protein), fat: Math.round(fat), carbs: Math.round(carbs) };
  }

  // R(id, name, emoji, category, cuisine, minutes, difficulty, servings, rough kcal estimate, ingredients, steps)
  // The kcal argument is only a hand-written estimate; the shown nutrition is calculated from the ingredients.
  const R = (id, name, emoji, category, cuisine, time, difficulty, servings, kcalEstimate, ing, steps) => {
    const ingredients = parse(id, ing);
    const mainCount = ingredients.filter(i => !i.opt && !STAPLES.has(i.id)).length;
    const n = nutrition(ingredients, servings);
    return {
      id, name, emoji, category, cuisine, time, difficulty, servings, ingredients, steps, kcalEstimate,
      kcal: n.kcal, protein: n.protein, fat: n.fat, carbs: n.carbs,
      vegetarian: !ingredients.some(i => MEAT.has(i.id)),
      // Student-friendly: quick, easy and only a few things to buy
      simple: time <= 20 && difficulty === 'Easy' && mainCount <= 4
    };
  };

  window.RECIPES = [
    /* ===================== SOUPS ===================== */
    R('chicken-noodle-soup', 'Chicken noodle soup', '🍲', 'Soup', 'International', 50, 'Easy', 4, 220,
      'chicken 300, potato 2, carrot 1, onion 1, pasta 60, herbs 20?, salt, pepper, water 2000', [
        'Put the chicken in a pot with 2 L of water, bring to a boil and skim off the foam.',
        'Simmer for 25–30 minutes, then take the chicken out and shred it.',
        'Add diced potato, chopped carrot and onion to the broth and cook for 15 minutes.',
        'Add the noodles and the chicken back and cook 7–8 minutes more.',
        'Season with salt and pepper and serve with chopped herbs.']),
    R('red-lentil-soup', 'Red lentil soup', '🥣', 'Soup', 'Turkish', 40, 'Easy', 4, 240,
      'lentils 200, onion 1, carrot 1, potato 1?, butter 30, tomato_paste 20?, lemon 0.5?, salt, spices, water 1500', [
        'Rinse the lentils several times.',
        'Melt the butter, sauté chopped onion and carrot for 5 minutes, then stir in the tomato paste.',
        'Add the lentils, diced potato and 1.5 L of water; simmer for 25–30 minutes.',
        'Season with salt, cumin and paprika, then blend until smooth.',
        'Serve with a lemon wedge and toasted bread.']),
    R('dovga', 'Dovga (yogurt & herb soup)', '🥣', 'Soup', 'Azerbaijani', 40, 'Medium', 4, 150,
      'yogurt 1000, rice 50, egg 1, flour 20, herbs 150, chickpeas 50?, salt, water 500', [
        'Whisk the yogurt with the egg and flour in a pot, then add the water.',
        'Add the rinsed rice and bring to a boil over medium heat, stirring constantly in one direction so the yogurt does not split.',
        'Once boiling, add finely chopped herbs (dill, coriander, mint, spinach).',
        'Simmer on low heat for 10 minutes and add salt. Serve hot or chilled.']),
    R('bozbash', 'Bozbash (lamb & chickpea soup)', '🍲', 'Soup', 'Azerbaijani', 120, 'Medium', 4, 430,
      'lamb 500, chickpeas 150, potato 3, onion 1, tomato_paste 20?, salt, spices, water 2000', [
        'Soak the chickpeas overnight.',
        'Put the lamb and chickpeas in a pot with the water; skim the foam as it comes to a boil.',
        'Simmer on low heat for 1–1.5 hours.',
        'Add whole potatoes, chopped onion and tomato paste and cook until the potatoes are soft (about 20 min).',
        'Season with salt, turmeric and dried mint.']),
    R('kufta-bozbash', 'Kufta bozbash (meatball soup)', '🍲', 'Soup', 'Azerbaijani', 90, 'Medium', 4, 460,
      'ground_meat 400, rice 50, chickpeas 150, potato 3, onion 2, dried_fruit 40?, salt, spices, water 2000', [
        'Soak the chickpeas overnight, then boil them in the water for about 1 hour.',
        'Mix the ground meat with grated onion, rice, salt and pepper.',
        'Shape large meatballs, hiding a dried apricot or plum inside each one if you have them.',
        'Drop the meatballs and whole potatoes into the boiling broth and cook for 30 minutes on low heat.',
        'Season with turmeric and dried mint before serving.']),
    R('vegetable-soup', 'Vegetable soup', '🥕', 'Soup', 'International', 35, 'Easy', 4, 140,
      'potato 2, carrot 1, onion 1, cabbage 200?, tomato 1?, bell_pepper 1?, herbs 15?, oil, salt, water 1500', [
        'Sauté the onion and carrot in oil for 5 minutes.',
        'Add the water, bring to a boil and add diced potato.',
        'After 10 minutes add chopped cabbage, pepper and tomato.',
        'Cook until the vegetables are soft (about 15 min), season and serve with herbs.']),
    R('tomato-soup', 'Creamy tomato soup', '🍅', 'Soup', 'International', 35, 'Easy', 4, 180,
      'tomato 6, onion 1, garlic 2, cream 100?, butter 20, bread 60?, salt, pepper, sugar, water 500', [
        'Melt the butter and cook the chopped onion and garlic until soft.',
        'Add chopped tomatoes, a pinch of sugar and the water; simmer for 20 minutes.',
        'Blend until smooth, stir in the cream and season.',
        'Serve with toasted bread cubes.']),
    R('mushroom-soup', 'Cream of mushroom soup', '🍄', 'Soup', 'French', 35, 'Easy', 4, 230,
      'mushroom 400, onion 1, potato 1, cream 150, butter 30, salt, pepper, water 800', [
        'Slice the mushrooms and chop the onion.',
        'Fry the onion and mushrooms in butter for 8–10 minutes.',
        'Add diced potato and the water; simmer for 15 minutes.',
        'Blend, stir in the cream, season and warm through.']),
    R('pumpkin-soup', 'Pumpkin soup', '🎃', 'Soup', 'International', 40, 'Easy', 4, 170,
      'pumpkin 800, onion 1, carrot 1, garlic 2, cream 100?, ginger 10?, oil, salt, spices, water 800', [
        'Peel and cube the pumpkin and carrot.',
        'Sauté onion, garlic and ginger in oil for 3 minutes.',
        'Add the pumpkin, carrot and water; simmer 20–25 minutes until soft.',
        'Blend until silky, stir in the cream and season with salt and nutmeg.']),
    R('borscht', 'Borscht', '🍲', 'Soup', 'Russian', 90, 'Medium', 6, 280,
      'beef 400, beetroot 2, cabbage 300, potato 2, carrot 1, onion 1, tomato_paste 30, garlic 2, sour_cream 100?, herbs 15?, oil, salt, vinegar, water 2500', [
        'Boil the beef in the water for 1 hour to make a broth, skimming off the foam.',
        'Grate the beetroot and carrot and chop the onion; fry them in oil with the tomato paste and a splash of vinegar for 10 minutes.',
        'Add diced potato to the broth, then shredded cabbage 10 minutes later.',
        'Add the fried vegetables and garlic and simmer for 10 more minutes.',
        'Serve with a spoon of sour cream and dill.']),
    R('kharcho', 'Kharcho (beef & rice soup)', '🍲', 'Soup', 'Georgian', 100, 'Medium', 5, 350,
      'beef 400, rice 80, onion 2, tomato_paste 40, garlic 3, walnuts 50?, herbs 30, salt, spices, water 2000', [
        'Simmer the beef in the water for 1 hour, then cut it into small pieces.',
        'Fry the chopped onion with the tomato paste.',
        'Add the rice and fried onion to the broth and cook for 15 minutes.',
        'Add crushed walnuts, garlic, herbs and spices (coriander, chili flakes); cook 5 minutes and let it rest.']),
    R('yayla-soup', 'Yayla soup (yogurt & rice)', '🥣', 'Soup', 'Turkish', 30, 'Easy', 4, 190,
      'yogurt 500, rice 80, egg 1, flour 20, butter 30, salt, spices, water 1000', [
        'Cook the rice in the water until soft.',
        'Whisk the yogurt, egg and flour, then slowly stir in a ladle of the hot broth.',
        'Pour the mixture into the pot and stir constantly until it boils.',
        'Sizzle dried mint in butter and pour it over the soup. Add salt to taste.']),
    R('minestrone', 'Minestrone', '🥣', 'Soup', 'Italian', 45, 'Easy', 5, 230,
      'zucchini 1, carrot 1, onion 1, potato 1, tomato 3, beans 200, pasta 80, garlic 2, cheese 30?, oil, salt, water 1500', [
        'Sauté the onion, carrot and garlic in olive oil.',
        'Add diced potato, zucchini and tomatoes and cook for 5 minutes.',
        'Add the water and beans and simmer for 20 minutes.',
        'Add small pasta and cook until tender. Serve with grated cheese.']),
    R('chicken-corn-soup', 'Chicken & sweetcorn soup', '🌽', 'Soup', 'Chinese', 30, 'Easy', 4, 210,
      'chicken 250, corn 300, egg 2, soy_sauce 20, ginger 10?, herbs 15?, flour 15, salt, water 1200', [
        'Boil the chicken with the ginger in the water for 15 minutes, then shred it.',
        'Return the chicken and add the corn and soy sauce.',
        'Mix the flour (or cornstarch) with a little cold water and stir it in to thicken.',
        'Slowly pour in the beaten eggs while stirring to make ribbons. Top with green onion.']),
    R('white-bean-soup', 'White bean soup', '🫘', 'Soup', 'Turkish', 40, 'Easy', 4, 260,
      'beans 300, onion 1, carrot 1, tomato_paste 30, garlic 2, sausage 150?, oil, salt, spices, water 1500', [
        'Sauté the onion, carrot and garlic in oil, then add the tomato paste.',
        'Add sliced sausage if using and fry for 2 minutes.',
        'Add cooked or canned beans and the water; simmer for 25 minutes.',
        'Season with salt and chili flakes and serve with bread.']),
    R('gazpacho', 'Gazpacho (cold tomato soup)', '🍅', 'Soup', 'Spanish', 15, 'Easy', 4, 130,
      'tomato 6, cucumber 1, bell_pepper 1, onion 0.5, garlic 1, bread 50?, oil, vinegar, salt', [
        'Roughly chop all the vegetables.',
        'Blend with soaked bread, olive oil, vinegar and salt until smooth.',
        'Chill for at least 1 hour and serve cold.']),

    /* ===================== CHICKEN ===================== */
    R('chicken-stir-fry', 'Chicken, onion & pepper stir-fry', '🍗', 'Main', 'International', 25, 'Easy', 2, 380,
      'chicken 400, onion 2, bell_pepper 1?, garlic 2?, oil, salt, pepper, spices', [
        'Cut the chicken into strips and season with salt, pepper and spices.',
        'Heat oil in a pan and fry the chicken on high heat for 6–7 minutes until golden.',
        'Add sliced onion and pepper and cook for another 5–6 minutes.',
        'Stir in crushed garlic for 1 minute and serve hot.']),
    R('chicken-pilaf', 'Chicken pilaf', '🍛', 'Main', 'Azerbaijani', 45, 'Medium', 4, 450,
      'chicken 350, rice 300, onion 1, carrot 1, butter 30?, oil, salt, spices, water 600', [
        'Rinse the rice until the water runs clear and soak it in warm water for 20 minutes.',
        'Brown the chicken pieces in oil in a heavy pot.',
        'Add the onion and carrot strips, fry for 5 minutes and season with salt and spices.',
        'Spread the drained rice on top and pour in 600 ml of hot water.',
        'Once boiling, cover and cook on the lowest heat for 20 minutes. Finish with butter.']),
    R('chicken-chighirtma', 'Chicken chighirtma', '🍳', 'Main', 'Azerbaijani', 40, 'Medium', 4, 360,
      'chicken 500, tomato 3, onion 2, egg 4, butter 40?, salt, pepper', [
        'Cut the chicken into pieces and simmer in a little water for 15 minutes, then drain.',
        'Fry sliced onion in butter, add the chicken and fry for 5 minutes.',
        'Add chopped tomatoes, season and cook for 10 minutes.',
        'Pour the beaten eggs over the top, cover and cook until set (3–4 minutes).']),
    R('yogurt-lemon-chicken', 'Baked yogurt & lemon chicken', '🍗', 'Main', 'Middle Eastern', 60, 'Easy', 4, 330,
      'chicken 600, yogurt 150, garlic 3, lemon 1?, oil, salt, spices', [
        'Mix the yogurt, crushed garlic, lemon juice, oil, salt and spices.',
        'Coat the chicken and marinate for at least 30 minutes (overnight is best).',
        'Preheat the oven to 200 °C and arrange the chicken in a baking dish.',
        'Bake for 35–40 minutes until golden. Serve with salad or rice.']),
    R('creamy-chicken-pasta', 'Creamy chicken pasta', '🍝', 'Main', 'Italian', 30, 'Easy', 3, 620,
      'chicken 250, pasta 250, cream 200, garlic 2, cheese 50?, mushroom 150?, oil, salt, pepper', [
        'Cook the pasta in salted water and drain, saving a cup of the water.',
        'Fry bite-size chicken pieces in oil; add the mushrooms if using.',
        'Add crushed garlic and the cream, simmer for 3 minutes and season.',
        'Toss the pasta in the sauce, loosening with pasta water if needed. Top with grated cheese.']),
    R('chicken-curry', 'Chicken curry', '🍛', 'Main', 'Indian', 45, 'Medium', 4, 420,
      'chicken 500, onion 2, tomato 2, garlic 3, ginger 15, yogurt 100?, cream 100?, rice 300?, oil, salt, spices', [
        'Fry the chopped onion in oil until deep golden (about 10 minutes).',
        'Add the garlic, ginger and spices (curry powder or cumin, turmeric, paprika) and cook for 1 minute.',
        'Add chopped tomatoes and cook down to a thick sauce.',
        'Add the chicken pieces, yogurt and a splash of water; simmer for 20 minutes.',
        'Stir in the cream and serve with rice.']),
    R('teriyaki-chicken', 'Teriyaki chicken', '🍱', 'Main', 'Japanese', 25, 'Easy', 3, 450,
      'chicken 500, soy_sauce 60, honey 30, garlic 2, ginger 10?, rice 250?, oil', [
        'Mix the soy sauce, honey, crushed garlic and grated ginger.',
        'Fry the chicken pieces in oil until cooked through.',
        'Pour in the sauce and cook until it thickens and coats the chicken.',
        'Serve over steamed rice.']),
    R('chicken-fajitas', 'Chicken fajitas', '🌮', 'Main', 'Mexican', 30, 'Easy', 3, 520,
      'chicken 400, bell_pepper 2, onion 1, tortilla 6, lemon 1?, sour_cream 100?, cheese 60?, oil, salt, spices', [
        'Slice the chicken, peppers and onion into strips.',
        'Season the chicken with paprika, cumin, salt and lime juice.',
        'Fry the chicken in a very hot pan, then add the vegetables and cook until slightly charred.',
        'Serve in warm tortillas with sour cream and cheese.']),
    R('chicken-shawarma', 'Chicken shawarma wrap', '🌯', 'Main', 'Middle Eastern', 40, 'Medium', 4, 540,
      'chicken 500, tortilla 4, yogurt 150, garlic 3, tomato 2, cucumber 1, onion 1?, lemon 1?, oil, salt, spices', [
        'Marinate the chicken with half the yogurt, lemon juice, spices and salt for 20 minutes.',
        'Fry or grill the chicken, then slice it thinly.',
        'Make a sauce from the remaining yogurt, crushed garlic and salt.',
        'Fill the wraps with chicken, tomato, cucumber, onion and sauce, then roll up tightly.']),
    R('chicken-schnitzel', 'Crispy chicken schnitzel', '🍗', 'Main', 'German', 30, 'Easy', 4, 430,
      'chicken 500, egg 2, flour 60, bread 100, lemon 1?, oil, salt, pepper', [
        'Pound the chicken breasts thin and season them.',
        'Dip each piece in flour, then beaten egg, then breadcrumbs.',
        'Fry in hot oil for 3–4 minutes per side until golden.',
        'Serve with lemon wedges and potatoes or salad.']),
    R('chicken-mushroom-julienne', 'Chicken & mushroom julienne', '🍄', 'Main', 'Russian', 40, 'Easy', 4, 410,
      'chicken 400, mushroom 300, onion 1, cream 200, cheese 100?, butter 30, salt, pepper', [
        'Cut the chicken into thin strips and slice the mushrooms and onion.',
        'Fry everything in butter for 10 minutes.',
        'Add the cream, season and simmer for 5 minutes.',
        'Spoon into small dishes, top with cheese and bake at 200 °C for 10 minutes.']),
    R('roast-chicken-potatoes', 'Roast chicken with potatoes', '🍗', 'Main', 'International', 70, 'Easy', 4, 560,
      'chicken 800, potato 6, garlic 4, onion 1, lemon 1?, oil, salt, spices', [
        'Preheat the oven to 200 °C.',
        'Cut the potatoes into chunks and the onion into wedges; toss with oil, salt and spices.',
        'Rub the chicken with oil, crushed garlic, lemon juice, salt and spices.',
        'Put everything in a tray and roast for 50–60 minutes, turning the potatoes halfway.']),
    R('chicken-fried-rice', 'Chicken fried rice', '🍚', 'Main', 'Chinese', 25, 'Easy', 3, 480,
      'rice 120, chicken 250, egg 2, carrot 1, peas 100?, corn 100?, soy_sauce 40, herbs 15?, oil', [
        'Use cooked, cooled rice — about 330 g cooked from 120 g dry (leftover rice from yesterday works best).',
        'Fry diced chicken in oil, then add the diced carrot, peas and corn.',
        'Push everything aside, scramble the eggs in the pan, then mix.',
        'Add the rice and soy sauce and stir-fry on high heat for 3–4 minutes. Top with green onion.']),
    R('chicken-lavangi', 'Chicken lavangi (walnut-stuffed)', '🍗', 'Main', 'Azerbaijani', 90, 'Hard', 5, 520,
      'chicken 1200, walnuts 200, onion 3, dried_fruit 100?, lemon 1?, oil, salt, spices', [
        'Grate the onions, squeeze out the juice and mix with ground walnuts, chopped dried fruit, salt and pepper.',
        'Rub the chicken inside and out with salt and lemon juice.',
        'Stuff the chicken with the filling and spread some on the outside too.',
        'Roast at 180 °C for about 1 hour 15 minutes, basting occasionally, until golden.']),
    R('chicken-kebab', 'Chicken kebab skewers', '🍢', 'Main', 'Turkish', 40, 'Easy', 4, 340,
      'chicken 600, onion 2, yogurt 100?, tomato 2?, bell_pepper 1?, oil, salt, spices', [
        'Cut the chicken into cubes and mix with grated onion, yogurt, oil, salt and spices.',
        'Marinate for at least 30 minutes.',
        'Thread onto skewers, alternating with pepper and tomato pieces.',
        'Grill or bake at 220 °C for 15–20 minutes, turning once.']),

    /* ===================== BEEF, LAMB & GROUND MEAT ===================== */
    R('beef-stroganoff', 'Beef stroganoff', '🥩', 'Main', 'Russian', 40, 'Medium', 4, 450,
      'beef 500, mushroom 200?, onion 1, sour_cream 200, flour 15?, butter 30, salt, pepper', [
        'Cut the beef into thin strips across the grain.',
        'Sear the beef in butter on high heat for 4–5 minutes, then set aside.',
        'In the same pan fry the onion and mushrooms, then sprinkle in the flour.',
        'Add the sour cream and the beef, season and simmer for 10 minutes. Serve with mash or rice.']),
    R('beef-potato-qovurma', 'Beef & potato qovurma', '🍖', 'Main', 'Azerbaijani', 60, 'Medium', 4, 520,
      'beef 500, potato 4, onion 2, tomato 2?, oil, salt, spices', [
        'Cook the beef pieces in a pot until their juices evaporate, then add oil and brown them.',
        'Add a little water, cover and simmer for 30 minutes until tender.',
        'Meanwhile fry the cubed potatoes in a separate pan.',
        'Add the onion and tomatoes to the meat, then the potatoes; season and steam for 10 minutes.']),
    R('cutlets', 'Homemade cutlets (kotlet)', '🍔', 'Main', 'Azerbaijani', 35, 'Medium', 4, 350,
      'ground_meat 500, onion 1, bread 60, egg 1, garlic 2?, milk 80?, oil, salt, pepper', [
        'Soak the bread in milk or water and squeeze it out.',
        'Mix the meat with grated onion, garlic, bread, egg, salt and pepper and knead well.',
        'Shape into patties with wet hands.',
        'Fry for 4–5 minutes per side, then add a splash of water, cover and steam for 10 minutes.']),
    R('bolognese', 'Spaghetti bolognese', '🍝', 'Main', 'Italian', 35, 'Easy', 4, 560,
      'ground_meat 300, pasta 300, onion 1, tomato 3, tomato_paste 30?, garlic 2, cheese 40?, oil, salt, spices', [
        'Fry the finely chopped onion and garlic in oil.',
        'Add the meat and fry until it changes colour.',
        'Add grated tomatoes and tomato paste, season and simmer for 15 minutes.',
        'Cook the pasta in salted water, drain and toss with the sauce. Top with cheese.']),
    R('stuffed-peppers', 'Stuffed peppers (bibər dolması)', '🫑', 'Main', 'Azerbaijani', 70, 'Medium', 4, 390,
      'bell_pepper 6, ground_meat 400, rice 80, onion 1, tomato 2, herbs 30?, yogurt 200?, salt, pepper, water 400', [
        'Parboil the rinsed rice for 5 minutes.',
        'Mix the meat, chopped onion, rice, herbs, salt and pepper.',
        'Cut the tops off the peppers, remove the seeds and fill them with the mixture.',
        'Stand them in a pot, cover with tomato slices and pour water halfway up.',
        'Cover and simmer on low heat for 45 minutes. Serve with garlic yogurt.']),
    R('yarpaq-dolma', 'Grape leaf dolma', '🍃', 'Main', 'Azerbaijani', 100, 'Hard', 5, 420,
      'grape_leaves 250, ground_meat 500, rice 80, onion 2, herbs 40, yogurt 300?, garlic 2?, salt, pepper, water 500', [
        'Blanch the grape leaves in boiling water for 2 minutes and cut off the stems.',
        'Mix the meat, grated onion, rinsed rice, chopped herbs (mint, dill, coriander), salt and pepper.',
        'Put a teaspoon of filling on each leaf and roll it up tightly into a small parcel.',
        'Pack the dolma in a pot, weigh down with a plate, add water and simmer on low heat for 1 hour.',
        'Serve with yogurt mixed with crushed garlic.']),
    R('cabbage-dolma', 'Cabbage dolma', '🥬', 'Main', 'Azerbaijani', 100, 'Hard', 5, 400,
      'cabbage 1200, ground_meat 500, rice 80, onion 2, tomato_paste 30?, herbs 30?, dried_fruit 50?, salt, pepper, water 500', [
        'Boil the whole cabbage for 5–7 minutes and separate the soft leaves.',
        'Mix the meat, grated onion, rice, herbs, salt and pepper.',
        'Wrap the filling in the leaves and pack them in a pot with the dried fruit between them.',
        'Dilute the tomato paste in the water, pour over and simmer covered for 1 hour.']),
    R('plov', 'Azerbaijani plov with lamb & dried fruit', '🍚', 'Main', 'Azerbaijani', 120, 'Hard', 6, 640,
      'rice 500, lamb 500, onion 2, dried_fruit 150, butter 100, salt, spices, water 3000', [
        'Soak the rice in salted water for 2 hours.',
        'Boil the rice in plenty of salted water for 6–8 minutes, then drain.',
        'Melt half the butter in a pot, add the rice in a mound, pour over the rest of the butter with saffron water; wrap the lid in a towel and steam on low heat for 40 minutes.',
        'Meanwhile fry the lamb with the onion until tender, adding the dried fruit for the last 10 minutes.',
        'Serve the rice topped with the meat and fruit.']),
    R('lula-kebab', 'Lula kebab', '🍢', 'Main', 'Azerbaijani', 40, 'Medium', 4, 480,
      'ground_meat 800, onion 2, tortilla 2?, tomato 3?, herbs 30?, salt, pepper, spices', [
        'Grate the onion and squeeze out the juice.',
        'Mix with the meat, salt and pepper, and knead for 5 minutes until sticky; chill for 30 minutes.',
        'With wet hands, shape long kebabs around flat skewers.',
        'Grill or bake at 230 °C for 12–15 minutes. Serve on lavash with tomatoes, onion and herbs.']),
    R('meat-qutab', 'Qutab with meat', '🫓', 'Main', 'Azerbaijani', 60, 'Medium', 4, 420,
      'flour 400, ground_meat 300, onion 1, butter 50, salt, spices, water 200', [
        'Knead the flour, water and salt into a firm dough and rest for 20 minutes.',
        'Mix the meat with grated onion, salt, pepper and a pinch of sumac.',
        'Roll out thin circles, spread filling on one half and fold into a half-moon.',
        'Cook on a dry hot pan for 2 minutes per side and brush generously with butter.']),
    R('moussaka', 'Moussaka', '🍆', 'Main', 'Greek', 90, 'Hard', 6, 520,
      'eggplant 3, ground_meat 500, onion 1, tomato 3, milk 500, butter 50, flour 50, cheese 80, egg 1, oil, salt, spices', [
        'Slice the eggplants, salt them, then fry or roast until golden.',
        'Fry the meat with onion, add chopped tomatoes and cinnamon, and simmer for 15 minutes.',
        'For the sauce, melt butter, stir in the flour, whisk in the milk until thick, then add the egg and half the cheese.',
        'Layer eggplant and meat in a dish, pour the sauce over and top with the remaining cheese.',
        'Bake at 180 °C for 40 minutes and rest 15 minutes before cutting.']),
    R('lasagna', 'Lasagna', '🍝', 'Main', 'Italian', 90, 'Hard', 6, 600,
      'pasta 250, ground_meat 500, onion 1, tomato 4, tomato_paste 30, milk 600, butter 50, flour 50, cheese 200, garlic 2, salt, spices', [
        'Make a meat sauce: fry onion and garlic, add the meat, tomatoes and tomato paste; simmer 20 minutes.',
        'Make a white sauce: melt butter, stir in the flour, whisk in the milk and cook until thick.',
        'Layer lasagna sheets, meat sauce, white sauce and cheese; repeat 3–4 times.',
        'Finish with white sauce and cheese and bake at 180 °C for 40 minutes.']),
    R('chili-con-carne', 'Chili con carne', '🌶️', 'Main', 'Mexican', 50, 'Easy', 4, 480,
      'ground_meat 500, beans 400, tomato 4, onion 1, bell_pepper 1, garlic 2, chili 1?, tomato_paste 30?, rice 250?, oil, salt, spices', [
        'Fry the onion, pepper, garlic and chili in oil.',
        'Add the meat and brown it, then add cumin and paprika.',
        'Add the chopped tomatoes, tomato paste and beans; simmer for 30 minutes.',
        'Season and serve with rice or bread.']),
    R('beef-tacos', 'Beef tacos', '🌮', 'Main', 'Mexican', 25, 'Easy', 4, 500,
      'ground_meat 400, tortilla 8, tomato 2, lettuce 100, cheese 100, onion 1, sour_cream 100?, avocado 1?, oil, salt, spices', [
        'Fry the chopped onion and meat with cumin, paprika and salt.',
        'Dice the tomatoes and avocado and shred the lettuce.',
        'Warm the tortillas in a dry pan.',
        'Fill with meat, vegetables, cheese and sour cream.']),
    R('beef-stew', 'Beef & vegetable stew', '🍲', 'Main', 'International', 120, 'Medium', 5, 470,
      'beef 700, potato 4, carrot 2, onion 2, tomato_paste 40, garlic 2, flour 20?, oil, salt, spices, water 1000', [
        'Toss the beef cubes in flour and brown them in oil in batches.',
        'Add the onion, garlic and tomato paste and fry for 3 minutes.',
        'Add the water and a bay leaf, cover and simmer for 1 hour.',
        'Add chunks of potato and carrot and cook for 30–40 minutes more until tender.']),
    R('beef-broccoli', 'Beef & broccoli', '🥦', 'Main', 'Chinese', 25, 'Easy', 3, 430,
      'beef 400, broccoli 400, garlic 3, ginger 10?, soy_sauce 50, honey 15?, flour 10, rice 250?, oil', [
        'Slice the beef thinly and toss with 1 tsp of the flour (or cornstarch).',
        'Blanch the broccoli florets for 2 minutes.',
        'Stir-fry the beef on very high heat, then add garlic and ginger.',
        'Add the broccoli, soy sauce, honey and the rest of the flour mixed with water; cook until glossy. Serve with rice.']),
    R('burger', 'Homemade burgers', '🍔', 'Main', 'American', 30, 'Easy', 4, 620,
      'ground_meat 500, bread 300, tomato 1, lettuce 50, onion 1, cheese 80?, cucumber 1?, oil, salt, pepper', [
        'Shape the meat into 4 patties slightly wider than the buns and season well.',
        'Fry or grill for 3–4 minutes per side; add a cheese slice at the end.',
        'Toast the buns cut-side down.',
        'Assemble with lettuce, tomato, onion and pickles.']),
    R('eggplant-kebab', 'Eggplant kebab (patlıcan kebabı)', '🍆', 'Main', 'Turkish', 60, 'Medium', 4, 450,
      'ground_meat 500, eggplant 3, tomato 3, bell_pepper 2, onion 1, oil, salt, spices', [
        'Mix the meat with grated onion, salt and spices and shape into small patties.',
        'Cut the eggplants into thick rounds.',
        'Arrange eggplant slices and patties alternately in a baking dish with pepper and tomato slices.',
        'Drizzle with oil and bake at 200 °C for 40 minutes.']),
    R('saj-ichi', 'Saj ichi (meat & vegetable pan)', '🥘', 'Main', 'Azerbaijani', 60, 'Medium', 4, 560,
      'lamb 600, potato 4, eggplant 2, tomato 3, bell_pepper 2, onion 2, oil, salt, spices', [
        'Fry the potato, eggplant and pepper pieces separately until golden and set aside.',
        'Fry the lamb cubes in the same pan until browned and cooked through.',
        'Add the onion and tomatoes and cook for 5 minutes.',
        'Return all the vegetables, season and heat together. Serve straight from the pan.']),
    R('lamb-chops', 'Garlic & herb lamb chops', '🍖', 'Main', 'International', 30, 'Easy', 4, 520,
      'lamb 800, garlic 3, lemon 1?, herbs 20?, oil, salt, spices', [
        'Rub the chops with oil, crushed garlic, chopped herbs, salt and pepper; leave for 20 minutes.',
        'Sear in a very hot pan for 3–4 minutes per side.',
        'Rest for 5 minutes and squeeze lemon over before serving.']),
    R('meat-potato-bake', 'Ground meat & potato bake', '🥘', 'Main', 'International', 60, 'Medium', 4, 480,
      'ground_meat 400, potato 5, onion 1, tomato 2, cheese 80?, sour_cream 100?, oil, salt, pepper', [
        'Fry the meat with the onion for 7–8 minutes and season.',
        'Layer thin potato slices, the meat and tomato slices in a baking dish, finishing with potato.',
        'Mix the sour cream with a little water and pour over; cover with foil.',
        'Bake at 190 °C for 35 minutes, then uncover, add cheese and bake 10 minutes more.']),
    R('sausage-pasta', 'Sausage & tomato pasta', '🍝', 'Main', 'Italian', 25, 'Easy', 4, 560,
      'pasta 300, sausage 250, tomato 3, onion 1, garlic 2, cheese 40?, oil, salt', [
        'Cook the pasta in salted water.',
        'Fry sliced sausage until browned, add the onion and garlic.',
        'Add chopped tomatoes and simmer for 10 minutes.',
        'Toss with the drained pasta and top with cheese.']),

    /* ===================== FISH & SEAFOOD ===================== */
    R('baked-lemon-fish', 'Baked lemon & garlic fish', '🐟', 'Main', 'International', 35, 'Easy', 3, 290,
      'fish 600, lemon 1, garlic 2?, herbs 20?, oil, salt, pepper', [
        'Clean and dry the fish and make a few cuts in the skin.',
        'Rub with salt, pepper, crushed garlic and oil; put lemon slices and herbs inside.',
        'Wrap in foil and bake at 200 °C for 20–25 minutes.',
        'Open the foil for the last 5 minutes to brown the top.']),
    R('fried-fish', 'Pan-fried fish', '🐟', 'Main', 'Azerbaijani', 25, 'Easy', 3, 330,
      'fish 600, flour 60, lemon 1?, oil, salt, pepper', [
        'Cut the fish into portions, season with salt and pepper.',
        'Dust each piece in flour.',
        'Fry in hot oil for 4–5 minutes per side until golden.',
        'Serve with lemon and a fresh salad.']),
    R('garlic-butter-shrimp', 'Garlic butter shrimp', '🍤', 'Main', 'International', 15, 'Easy', 3, 260,
      'shrimp 400, garlic 4, butter 50, lemon 1?, herbs 15?, chili 1?, salt', [
        'Melt the butter and gently cook the garlic and chili for 1 minute.',
        'Add the shrimp and cook for 2 minutes per side until pink.',
        'Finish with lemon juice, salt and chopped parsley. Serve with bread.']),
    R('shrimp-pasta', 'Shrimp pasta', '🍤', 'Main', 'Italian', 25, 'Easy', 3, 560,
      'pasta 300, shrimp 300, garlic 3, cream 200?, tomato 2?, cheese 30?, oil, salt, pepper', [
        'Cook the pasta in salted water.',
        'Fry the garlic in oil, add the shrimp and cook for 2–3 minutes.',
        'Add chopped tomatoes or cream and simmer for 3 minutes.',
        'Toss with the pasta and serve with grated cheese.']),
    R('salmon-teriyaki', 'Teriyaki salmon', '🍣', 'Main', 'Japanese', 25, 'Easy', 3, 460,
      'fish 500, soy_sauce 50, honey 30, garlic 2, ginger 10?, rice 250?, oil', [
        'Mix the soy sauce, honey, garlic and ginger.',
        'Fry the fish skin-side down for 4 minutes, flip and cook 2 minutes.',
        'Pour in the sauce and spoon it over until thick and glossy.',
        'Serve with rice.']),
    R('fish-lavangi', 'Fish lavangi (walnut-stuffed)', '🐟', 'Main', 'Azerbaijani', 60, 'Medium', 4, 420,
      'fish 1000, walnuts 150, onion 2, lemon 1, dried_fruit 50?, oil, salt, spices', [
        'Grate the onion, squeeze out the juice, and mix with ground walnuts, chopped dried fruit, salt and pepper.',
        'Clean the fish, rub with salt and lemon juice and fill with the walnut mixture.',
        'Brush with oil and bake at 190 °C for 35–40 minutes.']),

    /* ===================== VEGETARIAN MAINS ===================== */
    R('ajapsandal', 'Ajapsandal (vegetable stew)', '🍆', 'Main', 'Azerbaijani', 50, 'Medium', 4, 260,
      'eggplant 2, tomato 3, bell_pepper 2, potato 2?, onion 1, garlic 3, herbs 20?, oil, salt', [
        'Cube the eggplant, soak in salted water for 15 minutes and squeeze dry.',
        'Fry the potato and eggplant separately in oil.',
        'Fry the onion and pepper, add chopped tomatoes and cook for 5 minutes.',
        'Combine everything, add garlic and salt, cover and steam for 15 minutes.',
        'Sprinkle with herbs and serve warm or cold.']),
    R('mushroom-potatoes', 'Potatoes with mushrooms', '🍄', 'Main', 'Russian', 30, 'Easy', 3, 300,
      'mushroom 300, potato 4, onion 1, sour_cream 80?, herbs 15?, oil, salt', [
        'Fry potato strips in oil until half-cooked.',
        'Fry sliced mushrooms with the onion in a separate pan.',
        'Combine, season, cover and cook for 10 minutes.',
        'Serve with sour cream and herbs.']),
    R('imam-bayildi', 'Imam bayildi (stuffed eggplant)', '🍆', 'Main', 'Turkish', 60, 'Medium', 4, 280,
      'eggplant 3, onion 2, tomato 3, garlic 4, herbs 20?, oil, salt, sugar', [
        'Peel the eggplants in stripes, cut a slit along each and fry whole until soft.',
        'Fry sliced onion and garlic slowly in olive oil, add chopped tomatoes, a pinch of sugar and salt.',
        'Stuff the eggplants with the filling and place in a dish.',
        'Add a little water and bake at 180 °C for 30 minutes. Best served at room temperature.']),
    R('ratatouille', 'Ratatouille', '🍆', 'Main', 'French', 60, 'Medium', 4, 210,
      'eggplant 1, zucchini 2, bell_pepper 2, tomato 4, onion 1, garlic 3, oil, salt, spices', [
        'Dice all the vegetables into similar-sized pieces.',
        'Fry the onion and garlic in olive oil, then add the peppers.',
        'Add the eggplant and zucchini and cook for 10 minutes.',
        'Add the tomatoes and herbs (thyme, oregano), cover and simmer for 25 minutes.']),
    R('veg-noodles', 'Vegetable stir-fry noodles', '🍜', 'Main', 'Chinese', 20, 'Easy', 3, 420,
      'pasta 250, carrot 1, bell_pepper 1, cabbage 200, mushroom 150?, soy_sauce 40, garlic 2, ginger 10?, oil', [
        'Cook the noodles and drain.',
        'Stir-fry thin strips of carrot, pepper, cabbage and mushrooms on high heat for 4 minutes.',
        'Add garlic and ginger, then the noodles and soy sauce.',
        'Toss for 2 minutes and serve immediately.']),
    R('chana-masala', 'Chickpea curry (chana masala)', '🍛', 'Main', 'Indian', 35, 'Easy', 4, 380,
      'chickpeas 400, onion 1, tomato 3, garlic 3, ginger 10, spinach 100?, rice 250?, oil, salt, spices', [
        'Fry the onion until golden, add garlic, ginger and spices (cumin, turmeric, garam masala).',
        'Add chopped tomatoes and cook until saucy.',
        'Add cooked chickpeas and a little water; simmer for 15 minutes.',
        'Stir in the spinach until wilted. Serve with rice.']),
    R('pasta-pomodoro', 'Pasta pomodoro', '🍝', 'Main', 'Italian', 25, 'Easy', 3, 450,
      'pasta 300, tomato 5, garlic 3, cheese 40?, herbs 15?, oil, salt, sugar', [
        'Cook the pasta in salted water.',
        'Gently fry the garlic in olive oil, add chopped tomatoes, salt and a pinch of sugar.',
        'Simmer for 10–15 minutes until thick.',
        'Toss with the pasta and finish with basil and cheese.']),
    R('aglio-olio', 'Spaghetti aglio e olio', '🍝', 'Main', 'Italian', 15, 'Easy', 3, 470,
      'pasta 300, garlic 5, chili 1?, herbs 15?, cheese 30?, oil, salt', [
        'Cook the spaghetti in well-salted water.',
        'Slowly fry thinly sliced garlic and chili in plenty of olive oil until just golden.',
        'Add the drained pasta with a splash of pasta water and toss well.',
        'Finish with parsley and cheese.']),
    R('pizza-margherita', 'Pizza margherita', '🍕', 'Main', 'Italian', 90, 'Medium', 3, 700,
      'flour 300, yeast 7, tomato 3, cheese 200, herbs 10?, oil, salt, sugar 5, water 180', [
        'Mix the flour, yeast, salt, sugar, warm water and a spoon of oil into a soft dough; knead for 10 minutes.',
        'Let it rise in a warm place for 1 hour.',
        'Blend the tomatoes with salt and a little oil for the sauce.',
        'Stretch the dough on a tray, spread the sauce and top with cheese.',
        'Bake at the highest oven temperature (240–250 °C) for 10–12 minutes. Add basil.']),
    R('green-bean-eggs', 'Green beans with eggs (lobya chighirtma)', '🫛', 'Main', 'Azerbaijani', 25, 'Easy', 3, 240,
      'green_beans 400, egg 3, onion 1, tomato 2?, butter 30, salt', [
        'Boil the green beans for 8 minutes and drain.',
        'Fry the onion in butter, add the beans and tomatoes and cook for 5 minutes.',
        'Pour the beaten eggs over, cover and cook until set.']),
    R('spinach-borek', 'Spinach & feta börek', '🥧', 'Main', 'Turkish', 60, 'Medium', 6, 380,
      'tortilla 4, spinach 400, feta 200, egg 2, milk 150, butter 50, onion 1?, oil, salt', [
        'Wilt the spinach with the onion in a pan and mix with crumbled feta.',
        'Whisk the eggs, milk and melted butter.',
        'Layer the yufka/lavash sheets in a dish, brushing each with the egg mixture and adding filling between layers.',
        'Pour the remaining mixture on top and bake at 190 °C for 35 minutes until golden.']),
    R('mushroom-risotto', 'Mushroom risotto', '🍚', 'Main', 'Italian', 40, 'Medium', 4, 450,
      'rice 300, mushroom 300, onion 1, butter 40, cheese 60, cream 50?, salt, pepper, water 1000', [
        'Fry the mushrooms in half the butter and set aside.',
        'Soften the onion in the rest of the butter, add the rice and stir for 2 minutes.',
        'Add hot water (or stock) a ladle at a time, stirring, until the rice is creamy (about 20 minutes).',
        'Stir in the mushrooms, cheese and cream, and season.']),
    R('potato-pancakes', 'Potato pancakes (draniki)', '🥔', 'Main', 'Russian', 30, 'Easy', 4, 300,
      'potato 6, onion 1, egg 1, flour 40, sour_cream 100?, oil, salt', [
        'Grate the potatoes and onion and squeeze out the liquid.',
        'Mix with the egg, flour and salt.',
        'Fry spoonfuls in hot oil for 3 minutes per side until crisp.',
        'Serve with sour cream.']),
    R('mac-and-cheese', 'Mac and cheese', '🧀', 'Main', 'American', 30, 'Easy', 4, 560,
      'pasta 300, cheese 200, milk 500, butter 40, flour 30, salt, pepper', [
        'Cook the macaroni in salted water.',
        'Melt the butter, stir in the flour, then whisk in the milk and cook until thick.',
        'Stir in most of the cheese until melted and season.',
        'Mix with the pasta, top with the remaining cheese and bake or grill until bubbly.']),

    /* ===================== SIDES ===================== */
    R('fried-potatoes', 'Fried potatoes with onion', '🥔', 'Side', 'International', 25, 'Easy', 3, 290,
      'potato 5, onion 1, herbs 15?, oil, salt', [
        'Peel and slice the potatoes, rinse and pat dry.',
        'Heat oil in a wide pan and lay the potatoes in one layer.',
        'Turn when golden underneath and cook for 15 minutes in total.',
        'Add the sliced onion and fry 5 minutes more. Season and add herbs.']),
    R('mashed-potatoes', 'Mashed potatoes', '🥔', 'Side', 'International', 30, 'Easy', 4, 230,
      'potato 6, milk 150, butter 40, salt', [
        'Peel and cut the potatoes, boil in salted water until soft (20 min).',
        'Drain and add hot milk and butter.',
        'Mash until smooth.']),
    R('bulgur-pilaf', 'Bulgur pilaf', '🌾', 'Side', 'Turkish', 30, 'Easy', 4, 280,
      'bulgur 250, onion 1, tomato 1?, tomato_paste 20?, bell_pepper 1?, butter 30, salt, water 500', [
        'Fry the onion and pepper in butter, then add tomato and tomato paste.',
        'Add the bulgur and stir for 2 minutes.',
        'Add hot water and salt; when it boils, cover and cook on low heat for 15 minutes.',
        'Turn off the heat, cover with a towel and rest for 10 minutes.']),
    R('plain-rice', 'Fluffy buttered rice', '🍚', 'Side', 'International', 25, 'Easy', 4, 260,
      'rice 300, butter 20, salt, water 600', [
        'Rinse the rice until the water runs clear.',
        'Bring the water with salt and butter to a boil, add the rice.',
        'Cover and cook on the lowest heat for 15 minutes.',
        'Rest covered for 10 minutes and fluff with a fork.']),
    R('potato-wedges', 'Baked potato wedges', '🥔', 'Side', 'American', 40, 'Easy', 4, 230,
      'potato 6, garlic 2?, oil, salt, spices', [
        'Cut the potatoes into wedges (no need to peel).',
        'Toss with oil, crushed garlic, salt and paprika.',
        'Spread on a tray and bake at 220 °C for 30–35 minutes, turning once.']),
    R('fried-cauliflower', 'Crispy cauliflower with garlic yogurt', '🥦', 'Side', 'Middle Eastern', 30, 'Easy', 4, 210,
      'cauliflower 800, egg 2, flour 50, yogurt 150?, garlic 1?, oil, salt', [
        'Boil the cauliflower florets for 5 minutes and drain.',
        'Dip in beaten egg, then flour.',
        'Fry in oil until golden.',
        'Serve with yogurt mixed with crushed garlic and salt.']),

    /* ===================== SALADS ===================== */
    R('shepherd-salad', 'Shepherd salad', '🥗', 'Salad', 'Azerbaijani', 10, 'Easy', 2, 120,
      'tomato 3, cucumber 2, onion 1?, herbs 30?, lemon 0.5?, oil, salt', [
        'Dice the tomatoes and cucumbers and slice the onion thinly.',
        'Chop the herbs.',
        'Mix and dress with oil, lemon juice and salt just before serving.']),
    R('cabbage-carrot-salad', 'Cabbage & carrot salad', '🥬', 'Salad', 'Russian', 10, 'Easy', 3, 90,
      'cabbage 400, carrot 1, herbs 15?, lemon 0.5?, oil, salt, sugar', [
        'Shred the cabbage finely, add salt and squeeze it with your hands to soften.',
        'Grate the carrot and chop the herbs.',
        'Mix and dress with oil, lemon juice and a pinch of sugar.']),
    R('chicken-veg-salad', 'Chicken & vegetable salad', '🥗', 'Salad', 'International', 25, 'Easy', 2, 310,
      'chicken 250, tomato 2, cucumber 1, egg 2?, cheese 40?, bread 60?, lemon 0.5?, oil, salt', [
        'Boil or pan-fry the chicken, cool and slice.',
        'Hard-boil the eggs (10 min), cool and quarter.',
        'Chop the tomatoes and cucumber; toast cubed bread in a dry pan for croutons.',
        'Toss everything with oil, lemon juice and salt and top with cheese.']),
    R('greek-salad', 'Greek salad', '🥗', 'Salad', 'Greek', 10, 'Easy', 3, 240,
      'tomato 3, cucumber 1, bell_pepper 1, onion 1, olives 60, feta 150, oil, salt, spices', [
        'Cut the tomatoes, cucumber and pepper into chunks and slice the onion.',
        'Add the olives and a block of feta on top.',
        'Drizzle with olive oil and sprinkle with oregano and salt.']),
    R('caesar-salad', 'Chicken Caesar salad', '🥗', 'Salad', 'American', 30, 'Medium', 3, 420,
      'chicken 300, lettuce 250, bread 100, cheese 40, egg 1, garlic 1, lemon 0.5, oil, salt', [
        'Season and pan-fry the chicken, then slice.',
        'Toss bread cubes with oil and garlic and toast until crisp.',
        'Whisk the egg yolk, crushed garlic, lemon juice, grated cheese and oil into a dressing (or use mayo).',
        'Toss the lettuce with the dressing and top with chicken, croutons and more cheese.']),
    R('olivier', 'Olivier salad', '🥗', 'Salad', 'Russian', 45, 'Easy', 6, 330,
      'potato 3, carrot 2, egg 4, peas 150, cucumber 2, sour_cream 200, sausage 250?, chicken 250?, salt', [
        'Boil the potatoes and carrots in their skins, and hard-boil the eggs; cool everything.',
        'Peel and dice the vegetables, eggs, pickles and sausage or chicken into small cubes.',
        'Add the peas and mix with mayonnaise; season with salt.',
        'Chill for 1 hour before serving.']),
    R('beet-salad', 'Garlic beet salad with walnuts', '🟣', 'Salad', 'Azerbaijani', 15, 'Easy', 4, 180,
      'beetroot 2, garlic 2, walnuts 50, sour_cream 100, dried_fruit 30?, salt', [
        'Boil or bake the beetroot until tender (or use cooked beets), then grate.',
        'Add crushed garlic, chopped walnuts and raisins.',
        'Mix with mayonnaise or sour cream and salt.']),
    R('tuna-salad', 'Tuna salad', '🥗', 'Salad', 'International', 15, 'Easy', 2, 300,
      'tuna 160, lettuce 150, tomato 2, cucumber 1, corn 100?, egg 2?, lemon 0.5?, oil, salt', [
        'Hard-boil the eggs and cut them into quarters.',
        'Tear the lettuce and chop the tomato and cucumber.',
        'Add the drained tuna and corn.',
        'Dress with oil, lemon juice and salt.']),
    R('bean-salad', 'Bean salad (piyaz)', '🫘', 'Salad', 'Turkish', 15, 'Easy', 4, 220,
      'beans 400, onion 1, tomato 2, herbs 30, lemon 1?, egg 2?, oil, salt, spices', [
        'Rinse the cooked beans.',
        'Slice the onion thinly and rub with salt and sumac; dice the tomatoes.',
        'Mix with the herbs, oil and lemon juice.',
        'Top with egg wedges.']),
    R('tabbouleh', 'Tabbouleh', '🌿', 'Salad', 'Middle Eastern', 25, 'Easy', 4, 170,
      'bulgur 100, tomato 3, cucumber 1, herbs 150, lemon 2, oil, salt', [
        'Pour boiling water over the fine bulgur, cover and leave for 15 minutes; drain.',
        'Chop the parsley and mint very finely, and dice the tomato and cucumber.',
        'Mix everything with lemon juice, olive oil and salt.']),
    R('mangal-salad', 'Mangal salad (smoky grilled vegetables)', '🍆', 'Salad', 'Azerbaijani', 30, 'Easy', 4, 120,
      'eggplant 2, tomato 3, bell_pepper 2, onion 1, garlic 2?, herbs 20?, oil, salt', [
        'Grill or roast the eggplants, peppers and tomatoes whole until the skins are charred.',
        'Peel them while warm and chop finely.',
        'Add the chopped raw onion, garlic and herbs.',
        'Season with oil and salt.']),
    R('cacik', 'Cucumber yogurt (cacık)', '🥒', 'Salad', 'Turkish', 10, 'Easy', 4, 90,
      'yogurt 400, cucumber 2, garlic 2, herbs 15, oil, salt', [
        'Grate or finely dice the cucumbers.',
        'Mix with yogurt, crushed garlic, chopped dill or mint and salt.',
        'Thin with a little cold water if you like, and drizzle with olive oil.']),

    /* ===================== SNACKS & STARTERS ===================== */
    R('herb-kuku', 'Herb kuku (herb frittata)', '🌿', 'Snack', 'Azerbaijani', 35, 'Easy', 4, 210,
      'egg 5, herbs 200, walnuts 30?, flour 20?, butter 40, salt, spices', [
        'Wash, dry and very finely chop the herbs.',
        'Beat the eggs and mix with the herbs, crushed walnuts, flour, salt and turmeric.',
        'Melt the butter in a pan or baking dish and pour in the mixture.',
        'Cook covered on low heat for 10–12 minutes, flip and cook 5 minutes more.',
        'Serve warm or cold with yogurt.']),
    R('greens-qutab', 'Qutab with greens', '🫓', 'Snack', 'Azerbaijani', 50, 'Medium', 4, 330,
      'flour 400, herbs 400, butter 50, yogurt 200?, salt, water 200', [
        'Knead the flour, water and salt into a firm dough and rest for 20 minutes.',
        'Chop the greens (spinach, sorrel, coriander, dill, green onion) and season with salt.',
        'Roll out thin circles, put filling on one half and fold into a half-moon.',
        'Cook on a dry hot pan for 2 minutes per side, brush with butter and serve with yogurt.']),
    R('eggplant-yogurt', 'Fried eggplant with garlic yogurt', '🍆', 'Snack', 'Azerbaijani', 25, 'Easy', 3, 180,
      'eggplant 2, yogurt 200, garlic 2, herbs 10?, walnuts 20?, oil, salt', [
        'Slice the eggplant lengthwise, salt it for 10 minutes and pat dry.',
        'Fry the slices on both sides until golden; drain on paper towels.',
        'Mix the yogurt with crushed garlic and salt.',
        'Top the eggplant with the yogurt, herbs and chopped walnuts.']),
    R('lentil-kofte', 'Lentil kofte (mercimek köftesi)', '🫘', 'Snack', 'Turkish', 45, 'Medium', 6, 260,
      'lentils 200, bulgur 150, onion 1, tomato_paste 30, herbs 40, lemon 1?, lettuce 100?, oil, salt, spices, water 600', [
        'Cook the red lentils in the water until soft, then stir in the bulgur, cover and rest 20 minutes.',
        'Fry the onion with the tomato paste and add to the lentils.',
        'Add chopped herbs, spices, salt and lemon juice and knead well.',
        'Shape into small oval patties and serve on lettuce leaves.']),
    R('zucchini-fritters', 'Zucchini fritters (mücver)', '🥒', 'Snack', 'Turkish', 30, 'Easy', 4, 220,
      'zucchini 2, egg 2, flour 80, feta 100?, herbs 30?, onion 1?, oil, salt, pepper', [
        'Grate the zucchini, salt it and squeeze out the water.',
        'Mix with the eggs, flour, crumbled feta, herbs and grated onion.',
        'Fry spoonfuls in oil for 3 minutes per side.',
        'Serve with yogurt.']),
    R('hummus', 'Hummus', '🫘', 'Snack', 'Middle Eastern', 15, 'Easy', 4, 220,
      'chickpeas 400, lemon 1, garlic 2, oil, salt, spices', [
        'Blend the cooked chickpeas with the lemon juice, garlic, salt and a few spoons of cold water.',
        'Drizzle in olive oil while blending until very smooth (add tahini if you have it).',
        'Serve with olive oil, paprika and warm bread.']),
    R('guacamole', 'Guacamole', '🥑', 'Snack', 'Mexican', 10, 'Easy', 3, 160,
      'avocado 2, tomato 1, onion 0.5, lemon 1, chili 1?, herbs 10?, salt', [
        'Mash the avocados with a fork.',
        'Add finely diced tomato, onion, chili and coriander.',
        'Season with lime or lemon juice and salt. Serve with tortilla chips.']),
    R('garlic-bread', 'Garlic bread', '🥖', 'Snack', 'Italian', 15, 'Easy', 4, 260,
      'bread 300, butter 80, garlic 4, herbs 15?, cheese 50?', [
        'Mix the soft butter with crushed garlic and chopped parsley.',
        'Slice the bread and spread with garlic butter; add cheese if you like.',
        'Bake at 200 °C for 8–10 minutes until crisp.']),
    R('quesadilla', 'Cheese quesadilla', '🫓', 'Snack', 'Mexican', 15, 'Easy', 2, 480,
      'tortilla 4, cheese 200, chicken 200?, bell_pepper 1?, sour_cream 60?, oil', [
        'Sprinkle cheese (and cooked chicken or pepper) over half of each tortilla.',
        'Fold and cook in a lightly oiled pan for 2–3 minutes per side until the cheese melts.',
        'Cut into wedges and serve with sour cream.']),
    R('deviled-eggs', 'Stuffed eggs', '🥚', 'Snack', 'International', 20, 'Easy', 4, 160,
      'egg 6, sour_cream 60, garlic 1?, cheese 30?, herbs 10?, salt', [
        'Hard-boil the eggs, cool and halve them.',
        'Mash the yolks with mayonnaise, crushed garlic, grated cheese and salt.',
        'Pipe or spoon the filling back into the whites and garnish with herbs.']),
    R('bruschetta', 'Tomato bruschetta', '🍅', 'Snack', 'Italian', 15, 'Easy', 4, 180,
      'bread 200, tomato 3, garlic 2, herbs 10, oil, salt', [
        'Toast slices of bread and rub them with a cut garlic clove.',
        'Dice the tomatoes and mix with basil, olive oil and salt.',
        'Spoon onto the toast just before serving.']),
    R('tuna-sandwich', 'Tuna sandwich', '🥪', 'Snack', 'American', 10, 'Easy', 2, 380,
      'tuna 160, bread 120, sour_cream 50, egg 2?, cucumber 1?, lettuce 30?, salt, pepper', [
        'Mix the drained tuna with mayonnaise, chopped boiled egg, salt and pepper.',
        'Spread onto bread with lettuce and cucumber slices.',
        'Close the sandwiches and cut in half.']),
    R('cheese-toast', 'Grilled cheese toast', '🧀', 'Snack', 'American', 10, 'Easy', 2, 390,
      'bread 150, cheese 100, butter 20, tomato 1?', [
        'Butter the outsides of the bread slices.',
        'Fill with cheese (and tomato slices).',
        'Cook in a pan on medium heat for 3 minutes per side until golden and melted.']),

    /* ===================== BREAKFAST ===================== */
    R('tomato-eggs', 'Tomato eggs (pomidor-yumurta)', '🍳', 'Breakfast', 'Azerbaijani', 15, 'Easy', 2, 230,
      'egg 4, tomato 3, onion 1?, butter 20?, oil, salt, pepper', [
        'Fry the chopped onion in oil until soft.',
        'Add peeled, chopped tomatoes and cook for 5–6 minutes until the liquid reduces.',
        'Season, then crack the eggs into the pan.',
        'Stir (or leave whole) and cook for 2–3 minutes. Serve with bread.']),
    R('cheese-omelet', 'Cheese omelet', '🧀', 'Breakfast', 'French', 10, 'Easy', 1, 340,
      'egg 3, milk 50?, cheese 40, herbs 10?, butter 10, salt', [
        'Beat the eggs with the milk and salt.',
        'Melt the butter in a pan and pour in the eggs; cook on medium heat.',
        'When the edges set, sprinkle the cheese and herbs on top.',
        'Fold in half and serve once the cheese melts.']),
    R('spinach-eggs', 'Spinach with eggs', '🥬', 'Breakfast', 'Azerbaijani', 15, 'Easy', 2, 200,
      'spinach 300, egg 3, onion 1?, garlic 1?, butter 20, salt', [
        'Wash and roughly chop the spinach.',
        'Fry the onion and garlic in butter for 3 minutes.',
        'Add the spinach and cook until wilted; season.',
        'Crack the eggs on top, cover and cook for 3–4 minutes. Serve with yogurt.']),
    R('banana-oatmeal', 'Banana oatmeal', '🥣', 'Breakfast', 'International', 10, 'Easy', 1, 380,
      'oats 70, milk 250, banana 1?, apple 0.5?, honey 15?, walnuts 15?', [
        'Bring the milk to a boil and add the oats.',
        'Simmer for 4–5 minutes, stirring.',
        'Top with sliced banana or apple, honey and walnuts.']),
    R('menemen', 'Menemen (Turkish scrambled eggs)', '🍳', 'Breakfast', 'Turkish', 15, 'Easy', 2, 260,
      'egg 4, tomato 3, bell_pepper 2, onion 1?, butter 20, oil, salt, spices', [
        'Fry the chopped peppers (and onion) in butter and oil until soft.',
        'Add grated tomatoes and cook until thick.',
        'Add the eggs and gently stir until just set. Season with salt and chili flakes.']),
    R('shakshuka', 'Shakshuka', '🍳', 'Breakfast', 'Middle Eastern', 25, 'Easy', 2, 300,
      'egg 4, tomato 4, bell_pepper 1, onion 1, garlic 2, feta 50?, herbs 10?, oil, salt, spices', [
        'Fry the onion, pepper and garlic in oil.',
        'Add chopped tomatoes, cumin and paprika and simmer for 10 minutes.',
        'Make small wells and crack the eggs into them.',
        'Cover and cook until the whites set. Top with feta and herbs.']),
    R('french-toast', 'French toast', '🍞', 'Breakfast', 'French', 15, 'Easy', 2, 380,
      'bread 200, egg 2, milk 150, butter 20, honey 30?, sugar 10, spices', [
        'Whisk the eggs, milk, a little sugar and cinnamon.',
        'Soak each slice of bread for a few seconds.',
        'Fry in butter until golden on both sides.',
        'Serve with honey or fruit.']),
    R('avocado-toast', 'Avocado toast', '🥑', 'Breakfast', 'American', 10, 'Easy', 2, 320,
      'bread 120, avocado 1, egg 2?, lemon 0.5?, salt, pepper', [
        'Toast the bread.',
        'Mash the avocado with lemon juice, salt and pepper and spread on the toast.',
        'Top with a fried or poached egg.']),
    R('pancakes', 'Fluffy pancakes', '🥞', 'Breakfast', 'American', 25, 'Easy', 3, 360,
      'flour 200, milk 250, egg 1, butter 30, honey 40?, sugar 20, baking, salt', [
        'Mix the flour, sugar, baking powder and salt.',
        'Whisk in the milk, egg and melted butter until just combined.',
        'Cook small ladles of batter in a lightly oiled pan until bubbles appear, then flip.',
        'Serve with honey or berries.']),
    R('syrniki', 'Syrniki (cottage cheese pancakes)', '🥞', 'Breakfast', 'Russian', 25, 'Easy', 3, 310,
      'cottage_cheese 400, egg 1, flour 60, sour_cream 100?, sugar 30, oil', [
        'Mash the cottage cheese with a fork and mix with the egg and sugar.',
        'Add the flour and form a soft dough.',
        'Shape small thick rounds with floured hands.',
        'Fry in a little oil on medium heat until golden. Serve with sour cream or honey.']),
    R('eggs-sausage', 'Eggs with sausage', '🍳', 'Breakfast', 'International', 10, 'Easy', 2, 410,
      'egg 4, sausage 150, tomato 1?, butter 15, salt, pepper', [
        'Slice the sausage and fry in butter until browned.',
        'Add tomato slices if using.',
        'Crack in the eggs and cook to your liking. Season and serve.']),
    R('rice-porridge', 'Sweet milk rice porridge (südlü sıyıq)', '🥣', 'Breakfast', 'Azerbaijani', 40, 'Easy', 4, 300,
      'rice 150, milk 1000, butter 30, sugar 60, salt, water 300', [
        'Boil the rice in the water until it is absorbed.',
        'Add the milk and simmer on low heat for 25 minutes, stirring often.',
        'Add sugar and a pinch of salt.',
        'Serve with a knob of butter and cinnamon.']),
    R('yogurt-parfait', 'Yogurt parfait', '🍓', 'Breakfast', 'International', 5, 'Easy', 2, 280,
      'yogurt 300, oats 50, berries 100?, honey 20?, banana 1?, walnuts 20?', [
        'Layer yogurt, oats (or granola) and fruit in glasses.',
        'Drizzle with honey and top with walnuts.']),

    /* ===================== DESSERTS ===================== */
    R('crepes', 'Thin crepes (blinchik)', '🥞', 'Dessert', 'French', 30, 'Medium', 4, 260,
      'flour 200, milk 500, egg 2, honey 50?, oil, salt, sugar 25', [
        'Whisk the eggs, sugar and salt, then add half the milk.',
        'Sift in the flour gradually, whisk until smooth, then add the rest of the milk and 2 tbsp oil.',
        'Rest the batter for 15 minutes.',
        'Pour a thin layer into a hot pan and cook for 1 minute per side. Serve with honey or jam.']),
    R('apple-charlotte', 'Apple charlotte (simple apple cake)', '🍎', 'Dessert', 'Russian', 50, 'Easy', 6, 240,
      'apple 3, egg 3, flour 150, butter 10?, sugar 150', [
        'Preheat the oven to 180 °C and butter a cake tin.',
        'Beat the eggs with 150 g sugar for 5–7 minutes until pale and fluffy.',
        'Gently fold in the sifted flour.',
        'Arrange sliced apples in the tin and pour the batter over.',
        'Bake for 35–40 minutes (check with a toothpick).']),
    R('banana-bread', 'Banana bread', '🍌', 'Dessert', 'American', 70, 'Easy', 8, 280,
      'banana 3, flour 250, egg 2, butter 80, walnuts 50?, sugar 120, baking', [
        'Mash the ripe bananas and mix with melted butter, eggs and 120 g sugar.',
        'Stir in the flour and 1 tsp baking soda until just combined; add walnuts.',
        'Pour into a lined loaf tin.',
        'Bake at 175 °C for 55–60 minutes.']),
    R('rice-pudding', 'Rice pudding (sütlaç)', '🍮', 'Dessert', 'Turkish', 50, 'Easy', 6, 220,
      'rice 100, milk 1000, flour 20, sugar 150, spices, water 300', [
        'Boil the rice in the water until soft.',
        'Add the milk and 150 g sugar and simmer for 20 minutes.',
        'Mix the flour (or starch) with a little cold milk and stir in to thicken.',
        'Pour into bowls, chill and dust with cinnamon.']),
    R('brownies', 'Chocolate brownies', '🍫', 'Dessert', 'American', 40, 'Easy', 9, 330,
      'chocolate 200, butter 150, egg 3, flour 100, walnuts 60?, sugar 200', [
        'Melt the chocolate and butter together.',
        'Whisk the eggs with 200 g sugar, then mix in the chocolate.',
        'Fold in the flour and walnuts.',
        'Bake in a lined tin at 180 °C for 22–25 minutes — the middle should still be fudgy.']),
    R('baked-apples', 'Baked apples with honey & walnuts', '🍎', 'Dessert', 'International', 35, 'Easy', 4, 190,
      'apple 4, honey 40, walnuts 40?, dried_fruit 40?, butter 20?, spices', [
        'Core the apples without cutting through the bottom.',
        'Fill with chopped walnuts, raisins, honey and cinnamon, and top with butter.',
        'Bake at 180 °C for 25–30 minutes until soft.']),
    R('halva', 'Flour halva (un halvası)', '🍯', 'Dessert', 'Azerbaijani', 30, 'Medium', 6, 380,
      'flour 200, butter 150, sugar 200, spices, water 250', [
        'Make a syrup from the water and 200 g sugar with a pinch of saffron or cardamom.',
        'Melt the butter and roast the flour in it on low heat, stirring constantly, until golden-brown and nutty (15–20 min).',
        'Carefully pour in the hot syrup while stirring — it will steam.',
        'Stir until thick, then press into a dish and cut into diamonds.']),
    R('fruit-salad', 'Fruit salad with yogurt', '🍓', 'Dessert', 'International', 10, 'Easy', 3, 170,
      'banana 2, apple 1, orange 2, berries 150?, yogurt 200?, honey 20?', [
        'Chop all the fruit into bite-size pieces.',
        'Mix gently and drizzle with honey.',
        'Serve with yogurt.']),
    R('cottage-cheese-bake', 'Cottage cheese bake (zapekanka)', '🥧', 'Dessert', 'Russian', 50, 'Easy', 6, 250,
      'cottage_cheese 500, egg 2, sour_cream 100, flour 40, dried_fruit 50?, butter 10, sugar 80', [
        'Mix the cottage cheese, eggs, sour cream, flour (or semolina) and 80 g sugar until smooth.',
        'Fold in the raisins.',
        'Pour into a buttered dish and bake at 180 °C for 35–40 minutes until golden.']),

    /* ===================== TUNA ===================== */
    R('tuna-melt', 'Tuna melt', '🧀', 'Snack', 'American', 10, 'Easy', 2, 420,
      'bread 120, tuna 160, cheese 60, sour_cream 30, onion 0.5?, pepper', [
        'Mix the drained tuna with mayo, finely chopped onion and pepper.',
        'Spread on the bread slices and cover with cheese.',
        'Bake at 200 °C for 6–8 minutes (or microwave 1 minute) until the cheese melts.']),
    R('tuna-patties', 'Tuna patties', '🐟', 'Main', 'International', 20, 'Easy', 2, 380,
      'tuna 320, egg 1, bread 40, onion 0.5, herbs 10?, lemon 0.5?, oil, salt, pepper', [
        'Drain the tuna well and mash with the egg, breadcrumbs (or crumbled bread), grated onion, herbs, salt and pepper.',
        'Shape into 6 small patties.',
        'Fry in a little oil for 3 minutes per side until golden. Serve with lemon, salad or rice.']),
    R('tuna-bean-salad', 'Tuna & bean salad', '🥗', 'Salad', 'Italian', 10, 'Easy', 2, 330,
      'tuna 160, beans 240, onion 0.5, lemon 0.5, herbs 15?, tomato 1?, oil, salt, pepper', [
        'Rinse the canned beans and drain the tuna.',
        'Mix with thinly sliced onion, chopped parsley and tomato.',
        'Dress with olive oil, lemon juice, salt and pepper.']),
    R('tuna-omelette', 'Tuna omelette', '🍳', 'Breakfast', 'International', 10, 'Easy', 1, 380,
      'egg 3, tuna 80, cheese 20?, herbs 5?, butter 10, salt', [
        'Beat the eggs with salt.',
        'Pour into melted butter in a pan; when the edges set, scatter the drained tuna, cheese and herbs over half.',
        'Fold over and cook 1 more minute.']),
    R('tuna-wrap', 'Tuna mayo wrap', '🌯', 'Snack', 'Everyday', 5, 'Easy', 1, 450,
      'tortilla 1, tuna 80, sour_cream 20, lettuce 30, cucumber 0.5?, tomato 0.5?, corn 40?', [
        'Mix the drained tuna with mayo.',
        'Lay lettuce, tuna and sliced vegetables on the lavash or tortilla.',
        'Roll up tightly and cut in half.']),
    R('tuna-pasta-salad', 'Tuna pasta salad', '🥗', 'Salad', 'International', 20, 'Easy', 3, 430,
      'pasta 150, tuna 160, corn 100, cucumber 1, sour_cream 60, herbs 10?, salt, pepper', [
        'Cook the pasta, rinse with cold water and drain.',
        'Add the drained tuna, corn and diced cucumber.',
        'Mix with mayo or sour cream, herbs, salt and pepper. Chill before serving.']),
    R('tuna-avocado', 'Tuna-stuffed avocado', '🥑', 'Snack', 'International', 5, 'Easy', 2, 290,
      'avocado 1, tuna 80, lemon 0.5, onion 0.25?, salt, pepper', [
        'Halve the avocado and remove the stone.',
        'Mix the tuna with lemon juice, finely chopped onion, salt and pepper.',
        'Pile it into the avocado halves.']),

    /* ===================== YOGURT ===================== */
    R('yogurt-flatbread', '2-ingredient yogurt flatbread', '🫓', 'Side', 'Everyday', 20, 'Easy', 4, 260,
      'flour 250, yogurt 250, baking, salt', [
        'Mix the flour, yogurt, 1 tsp baking powder and a pinch of salt into a soft dough.',
        'Divide into 4 and roll each one thin.',
        'Cook in a dry hot pan for 1–2 minutes per side until puffed and spotted.']),
    R('yogurt-pasta', 'Pasta with garlic yogurt (yoğurtlu makarna)', '🍝', 'Main', 'Turkish', 15, 'Easy', 2, 560,
      'pasta 200, yogurt 250, garlic 2, butter 30, salt, spices', [
        'Cook the pasta in salted water and drain.',
        'Mix the yogurt with crushed garlic and salt, and toss with the warm pasta.',
        'Sizzle the butter with chili flakes and dried mint and pour over.']),
    R('spinach-borani', 'Spinach borani (yogurt & spinach dip)', '🥬', 'Snack', 'Azerbaijani', 20, 'Easy', 4, 150,
      'spinach 300, yogurt 300, garlic 2, onion 1?, walnuts 30?, oil, salt', [
        'Fry the onion in oil, add the spinach and cook until wilted; squeeze out the liquid and chop.',
        'Cool, then mix with the yogurt, crushed garlic and salt.',
        'Top with chopped walnuts. Serve with bread.']),
    R('labneh', 'Labneh (strained yogurt, süzmə)', '🥣', 'Snack', 'Middle Eastern', 15, 'Easy', 4, 130,
      'yogurt 1000, herbs 10?, oil, salt', [
        'Mix the yogurt with 1 tsp salt and put it in a cheesecloth (or a clean towel) over a bowl.',
        'Leave in the fridge for 12–24 hours to drain until thick.',
        'Spread on a plate, drizzle with olive oil and sprinkle with mint or za\'atar. Eat with bread.']),
    R('yogurt-cake', 'Yogurt cake (yoğurtlu kek)', '🍰', 'Dessert', 'Turkish', 50, 'Easy', 10, 290,
      'yogurt 200, egg 3, flour 300, sugar 200, lemon 0.5?, oil 100, baking', [
        'Whisk the eggs and sugar until pale, then add the yogurt, oil and lemon zest.',
        'Fold in the flour and 1 packet of baking powder.',
        'Pour into an oiled tin and bake at 175 °C for 35–40 minutes.']),
    R('lassi', 'Sweet banana lassi', '🥛', 'Drink', 'Indian', 5, 'Easy', 2, 200,
      'yogurt 300, milk 100, banana 1?, honey 20?, spices', [
        'Blend the yogurt, milk, banana and honey until frothy.',
        'Add a pinch of cardamom and serve chilled.']),
    R('frozen-yogurt-bark', 'Frozen yogurt bark', '🍓', 'Dessert', 'Everyday', 10, 'Easy', 4, 140,
      'yogurt 300, honey 30, berries 100, walnuts 30?', [
        'Mix the yogurt with the honey and spread 1 cm thick on a tray lined with baking paper.',
        'Scatter berries and chopped walnuts on top.',
        'Freeze for 3 hours, then break into pieces.']),

    /* ===================== PEANUT BUTTER ===================== */
    R('pb-oatmeal', 'Peanut butter banana oatmeal', '🥜', 'Breakfast', 'Everyday', 10, 'Easy', 1, 520,
      'oats 60, milk 250, peanut_butter 20, banana 1?, honey 10?', [
        'Cook the oats in the milk for 4–5 minutes, stirring.',
        'Stir in the peanut butter.',
        'Top with banana slices and a drizzle of honey.']),
    R('pb-smoothie', 'Peanut butter banana smoothie', '🥤', 'Drink', 'Everyday', 5, 'Easy', 1, 420,
      'banana 1, milk 250, peanut_butter 25, oats 20?, honey 10?', [
        'Put everything in a blender with a few ice cubes.',
        'Blend until smooth.']),
    R('peanut-noodles', 'Peanut noodles', '🍜', 'Main', 'Chinese', 15, 'Easy', 2, 620,
      'pasta 200, peanut_butter 50, soy_sauce 30, garlic 1, honey 10, chili 1?, cucumber 1?, herbs 10?, water 50', [
        'Cook the noodles or spaghetti and drain.',
        'Whisk the peanut butter, soy sauce, crushed garlic, honey and warm water into a smooth sauce.',
        'Toss the noodles with the sauce; top with sliced cucumber, chili and green onion. Good hot or cold.']),
    R('chicken-satay', 'Chicken satay with peanut sauce', '🍢', 'Main', 'Indonesian', 30, 'Easy', 3, 480,
      'chicken 500, peanut_butter 80, soy_sauce 30, garlic 2, honey 15, lemon 0.5?, ginger 5?, oil, water 80', [
        'Cut the chicken into strips and marinate with half the soy sauce, garlic and a little oil for 15 minutes.',
        'Thread onto skewers and grill or pan-fry for 8–10 minutes.',
        'Warm the peanut butter with the water, honey, the rest of the soy sauce, ginger and lemon juice until smooth.',
        'Serve the skewers with the peanut sauce and rice.']),
    R('energy-balls', 'Peanut butter oat energy balls', '⚡', 'Snack', 'Everyday', 10, 'Easy', 6, 210,
      'oats 100, peanut_butter 100, honey 50, chocolate 30?', [
        'Mix the oats, peanut butter, honey and chopped chocolate.',
        'Roll into 12 small balls.',
        'Chill for 30 minutes. They keep in the fridge for a week.']),
    R('pb-cookies', '3-ingredient peanut butter cookies', '🍪', 'Dessert', 'American', 20, 'Easy', 6, 290,
      'peanut_butter 250, egg 1, sugar 150', [
        'Mix the peanut butter, egg and sugar until smooth.',
        'Roll into 12 balls, place on a lined tray and press with a fork to make a cross pattern.',
        'Bake at 180 °C for 10–12 minutes. Let them cool — they firm up as they cool.']),
    R('pbj-sandwich', 'Peanut butter & jam sandwich', '🥪', 'Breakfast', 'American', 3, 'Easy', 1, 380,
      'bread 60, peanut_butter 30, jam 20', [
        'Spread one slice of bread with peanut butter and the other with jam.',
        'Press together and cut in half.']),
    R('apple-pb', 'Apple slices with peanut butter', '🍎', 'Snack', 'Everyday', 3, 'Easy', 1, 270,
      'apple 1, peanut_butter 30, honey 5?', [
        'Core and slice the apple.',
        'Dip the slices in peanut butter (drizzle with honey if you like).']),

    /* ===================== MORE AZERBAIJANI ===================== */
    R('piti', 'Sheki piti', '🍲', 'Soup', 'Azerbaijani', 180, 'Medium', 3, 520,
      'lamb 450, chickpeas 100, potato 2, onion 1, dried_fruit 30?, butter 20?, salt, spices, water 1500', [
        'Soak the chickpeas overnight.',
        'Put the lamb pieces and chickpeas in clay pots (or one heavy pot), cover with water and bring to a boil; skim the foam.',
        'Add the chopped onion and dried sour plums (alycha), cover and simmer on very low heat for 2–2.5 hours.',
        'Add the potatoes and saffron water and cook 30 minutes more; season.',
        'Serve in two courses: first pour the broth over torn bread, then eat the meat and chickpeas with sumac and onion.']),
    R('dushbara', 'Dushbara (tiny dumpling soup)', '🥟', 'Soup', 'Azerbaijani', 100, 'Hard', 5, 420,
      'flour 300, ground_meat 300, onion 1, egg 1, garlic 2?, herbs 10?, vinegar, salt, spices, water 1600', [
        'Knead the flour, egg, salt and about 100 ml water into a firm dough; rest 20 minutes.',
        'Mix the meat with grated onion, salt and pepper.',
        'Roll the dough very thin, cut into 2–3 cm squares, put a tiny bit of filling on each, fold into a triangle and pinch the corners together.',
        'Make a broth (bones or water with salt), drop in the dumplings and cook 8–10 minutes after they float.',
        'Serve with dried mint, and garlic mixed with vinegar on the side.']),
    R('khingal', 'Khingal (pasta with fried meat & garlic yogurt)', '🍝', 'Main', 'Azerbaijani', 70, 'Medium', 4, 640,
      'flour 400, egg 1, ground_meat 400, onion 2, butter 50, yogurt 300, garlic 2, salt, spices, water 2000', [
        'Knead the flour, egg, salt and about 150 ml water into a firm dough; rest 20 minutes.',
        'Fry the meat with the sliced onions in half the butter until golden; season.',
        'Roll the dough thin and cut into 5 cm diamonds; boil in salted water for 5–7 minutes and drain.',
        'Layer the pasta on a plate, drizzle with melted butter and top with the fried meat and onions.',
        'Serve with yogurt mixed with crushed garlic, and sprinkle with dried mint or sumac.']),
    R('tava-kebab', 'Tava kebab', '🍳', 'Main', 'Azerbaijani', 50, 'Medium', 4, 470,
      'ground_meat 500, eggplant 2, onion 1, egg 2, tomato 2, oil, salt, spices', [
        'Mix the meat with grated onion, salt and pepper; shape into small round patties.',
        'Slice the eggplants into rounds and the tomatoes into slices.',
        'Brown the patties and the eggplant slices in a pan (tava), then arrange them alternately with the tomato.',
        'Pour the beaten eggs over the top, cover and cook on low heat until set (10 min).']),
    R('turshu-qovurma', 'Turshu qovurma (lamb with sour fruit)', '🍖', 'Main', 'Azerbaijani', 80, 'Medium', 4, 560,
      'lamb 600, onion 2, dried_fruit 120, butter 50, salt, spices, water 300', [
        'Cut the lamb into pieces and cook in a pot until the juices evaporate, then add butter and brown.',
        'Add the sliced onions and fry until golden.',
        'Add the dried fruit (alycha, dried apricots, prunes), saffron water and the water.',
        'Cover and simmer on low heat for 45 minutes until the meat is tender. Serve with plov.']),
    R('sabzi-qovurma', 'Sabzi qovurma (lamb with herbs)', '🌿', 'Main', 'Azerbaijani', 90, 'Medium', 4, 520,
      'lamb 500, herbs 300, onion 2, beans 150?, lemon 0.5?, oil, salt, spices, water 500', [
        'Fry the lamb pieces in oil until browned, add the sliced onions and fry until golden.',
        'Add turmeric and the water, cover and simmer for 40 minutes.',
        'Finely chop a big bunch of herbs (spinach, sorrel, coriander, dill, green onion) and fry them in a little oil for 10 minutes.',
        'Add the herbs and beans to the meat and cook 20 more minutes; finish with lemon juice. Serve with plov.']),
    R('three-sisters-dolma', 'Three sisters dolma (eggplant, pepper & tomato)', '🍆', 'Main', 'Azerbaijani', 90, 'Hard', 4, 450,
      'eggplant 2, tomato 3, bell_pepper 3, ground_meat 500, rice 60, onion 1, herbs 30, yogurt 200?, salt, pepper, water 300', [
        'Mix the meat, grated onion, rinsed rice, chopped herbs (mint, dill, coriander), salt and pepper.',
        'Cut the tops off the tomatoes and peppers and scoop them out; cut the eggplants in half lengthwise and hollow them out (keep the tops as lids).',
        'Fill all the vegetables with the meat mixture and cover with their lids.',
        'Pack them tightly in a pot, add the water and the chopped tomato flesh, cover and simmer for 50–60 minutes.',
        'Serve with garlic yogurt.']),
    R('pumpkin-qutab', 'Pumpkin qutab', '🫓', 'Snack', 'Azerbaijani', 60, 'Medium', 4, 340,
      'flour 400, pumpkin 500, onion 1, butter 50, pomegranate 0.5?, sugar, salt, spices, water 200', [
        'Knead the flour, water and salt into a firm dough and rest for 20 minutes.',
        'Grate the pumpkin and cook it with the chopped onion in a little butter until soft and dry; add a pinch of sugar, salt and cinnamon.',
        'Roll out thin circles, put the filling on half, fold into half-moons and press the edges.',
        'Cook on a dry hot pan 2 minutes per side, brush with butter and sprinkle with pomegranate seeds.']),
    R('arishta-ashi', 'Arishta ashi (noodle, bean & meat soup)', '🍜', 'Soup', 'Azerbaijani', 90, 'Medium', 5, 380,
      'flour 200, egg 1, beans 150, beef 300, onion 1, herbs 20?, salt, spices, water 2000', [
        'Simmer the beef in the water for 1 hour; add the soaked or canned beans.',
        'Knead the flour, egg and a little water into a stiff dough, roll thin and cut into thin noodles (arishta).',
        'Fry the chopped onion and add it to the soup with the noodles; cook 10 minutes.',
        'Season with salt, pepper and dried mint; add herbs before serving.']),
    R('narsharab-chicken', 'Chicken with narsharab (pomegranate sauce)', '🍗', 'Main', 'Azerbaijani', 45, 'Easy', 4, 420,
      'chicken 700, pomegranate 1, onion 2, oil, salt, spices', [
        'Cut the chicken into pieces, season and brown in oil.',
        'Add the sliced onions and fry until soft.',
        'Pour in 3–4 tbsp narsharab (or the juice of a pomegranate), add a little water, cover and simmer 25 minutes.',
        'Serve sprinkled with pomegranate seeds and sumac.']),
    R('sturgeon-kebab', 'Fish kebab with narsharab', '🍢', 'Main', 'Azerbaijani', 35, 'Easy', 4, 330,
      'fish 700, lemon 1, onion 1, pomegranate 0.5?, butter 30?, salt, spices', [
        'Cut the fish (sturgeon is classic) into large cubes and marinate with grated onion, lemon juice, salt and pepper for 20 minutes.',
        'Thread onto skewers.',
        'Grill or bake at 220 °C for 10–15 minutes, brushing with butter.',
        'Serve with narsharab, lemon and onion rings.']),
    R('fisinjan', 'Fisinjan (chicken in walnut & pomegranate sauce)', '🍗', 'Main', 'Azerbaijani', 70, 'Medium', 4, 590,
      'chicken 600, walnuts 250, pomegranate 1, onion 1, sugar 10, salt, spices, water 400', [
        'Grind the walnuts and toast them in a dry pot for 5 minutes until fragrant.',
        'Add the water and simmer on low heat for 20 minutes until the walnut oil appears.',
        'Fry the chicken with the chopped onion until golden, then add it to the walnuts.',
        'Stir in narsharab (or pomegranate juice), a little sugar, salt and cinnamon; simmer 25 minutes until thick. Serve with plov.']),
    R('shah-plov', 'Shah plov (plov in a lavash crown)', '👑', 'Main', 'Azerbaijani', 150, 'Hard', 8, 720,
      'rice 600, lamb 500, tortilla 4, dried_fruit 200, butter 200, onion 2, walnuts 50?, salt, spices, water 3000', [
        'Soak the rice in salted water for 2 hours, then parboil for 6–8 minutes and drain.',
        'Fry the lamb with the onions; add the dried fruit and walnuts for the last 10 minutes.',
        'Brush a deep pot generously with melted butter and line it with overlapping lavash so it hangs over the edges.',
        'Fill with layers of rice and the meat mixture, drizzle with butter and saffron water, and fold the lavash over the top.',
        'Bake at 180 °C for 50–60 minutes until the lavash is golden and crisp. Turn out onto a plate and cut open at the table.']),
    R('shekerbura', 'Shekerbura', '🥟', 'Dessert', 'Azerbaijani', 120, 'Hard', 10, 260,
      'flour 400, butter 150, egg 1, sour_cream 100, walnuts 200, sugar 200, spices, baking', [
        'Rub the cold butter into the flour, add the egg, sour cream and a pinch of baking powder and knead a soft dough; chill 30 minutes.',
        'Mix the ground walnuts with 200 g powdered sugar and ground cardamom.',
        'Roll out small circles, fill with a spoon of the walnut mixture and seal into half-moons.',
        'Pinch a herringbone pattern on top with tweezers (maggash) or a fork.',
        'Bake at 180 °C for 20–25 minutes until pale golden on the bottom.']),
    R('pakhlava', 'Pakhlava', '🍯', 'Dessert', 'Azerbaijani', 180, 'Hard', 20, 330,
      'flour 500, butter 250, walnuts 300, honey 200, egg 2, milk 200, yeast 7, sugar 200, spices', [
        'Knead the flour, warm milk, yeast, egg and 50 g melted butter into a smooth dough; rest 1 hour.',
        'Mix the ground walnuts with 200 g sugar and cardamom.',
        'Divide the dough into 10–12 balls and roll each as thin as paper; layer them in a buttered tray, sprinkling walnut mixture between layers.',
        'Cut into diamonds, brush with egg yolk mixed with saffron and place half a walnut on each.',
        'Bake at 170 °C for about 50 minutes, pouring the rest of the melted butter over halfway; pour the warm honey over when it comes out.']),
    R('kata', 'Kata (sweet layered bread)', '🥐', 'Dessert', 'Azerbaijani', 90, 'Medium', 8, 340,
      'flour 400, butter 150, milk 200, egg 1, yeast 7, sugar 125, spices', [
        'Make a dough with 350 g flour, warm milk, yeast, egg and 2 tbsp sugar; rest 40 minutes.',
        'For the filling (khasha), rub the remaining flour with 100 g soft butter, 100 g sugar and a pinch of vanilla or cardamom.',
        'Roll out the dough, spread with the filling, roll it up and form a flat round cake.',
        'Brush with egg and bake at 180 °C for 30–35 minutes.']),
    R('sherbet', 'Saffron & lemon sherbet', '🍋', 'Drink', 'Azerbaijani', 10, 'Easy', 6, 80,
      'lemon 2, herbs 5?, sugar 100, spices, water 1500', [
        'Steep a pinch of saffron in a cup of hot water for 10 minutes.',
        'Dissolve 100 g sugar in it, then add the lemon juice and cold water.',
        'Add mint leaves (or rose water and basil seeds) and serve well chilled.']),

    /* ===================== GEORGIAN ===================== */
    R('adjaruli-khachapuri', 'Adjarian khachapuri (cheese boat with egg)', '🧀', 'Main', 'Georgian', 90, 'Medium', 3, 780,
      'flour 400, yeast 7, milk 200, cheese 300, feta 100?, egg 4, butter 40, sugar 10, salt', [
        'Knead the flour, warm milk, yeast, 1 egg, sugar and salt into a soft dough; let it rise for 1 hour.',
        'Mix the grated cheese (suluguni + imeruli, or mozzarella + feta) with a splash of water.',
        'Divide the dough into 3, roll into ovals, roll the long edges inward and twist the ends to make boats.',
        'Fill with cheese and bake at 230 °C for 12–15 minutes.',
        'Make a well in the cheese, drop in an egg yolk and a knob of butter and bake 2 more minutes. Stir at the table and eat with the crust.']),
    R('imeruli-khachapuri', 'Imeruli khachapuri (cheese-filled bread)', '🧀', 'Main', 'Georgian', 60, 'Medium', 4, 620,
      'flour 400, yogurt 250, cheese 400, egg 1, butter 20, baking, salt', [
        'Knead the flour, yogurt (matsoni), baking soda and salt into a soft dough; rest 20 minutes.',
        'Mix the grated cheese with the egg.',
        'Flatten a ball of dough, put a ball of cheese in the middle, gather the edges and pinch closed, then gently roll into a flat round.',
        'Cook in a covered dry pan on medium-low heat for 5–6 minutes per side. Brush with butter.']),
    R('khinkali', 'Khinkali (Georgian dumplings)', '🥟', 'Main', 'Georgian', 120, 'Hard', 5, 560,
      'flour 500, ground_meat 600, onion 2, herbs 20?, salt, pepper, spices, water 450', [
        'Knead the flour with 250 ml water and salt into a firm dough; rest 30 minutes.',
        'Mix the meat with finely chopped onion, coriander, pepper, cumin, salt and about 200 ml cold water until juicy.',
        'Roll out circles about 12 cm wide, put a spoon of filling in the middle and pleat the edges upward, twisting them into a knot on top.',
        'Boil in plenty of salted water for 10–12 minutes after they float.',
        'Eat by hand: hold the knot, bite a small hole, sip the broth and then eat the rest (leave the knot!). Sprinkle with black pepper.']),
    R('chakhokhbili', 'Chakhokhbili (chicken & tomato stew)', '🍅', 'Main', 'Georgian', 60, 'Medium', 4, 420,
      'chicken 800, onion 3, tomato 5, garlic 3, herbs 40, butter 30, chili 1?, salt, spices', [
        'Brown the chicken pieces in a dry pot, then add the butter and sliced onions and fry until soft.',
        'Add the peeled, chopped tomatoes, cover and simmer for 25 minutes.',
        'Add crushed garlic, chili, khmeli-suneli and plenty of chopped coriander, basil and parsley.',
        'Cook 5 more minutes and let it rest before serving.']),
    R('satsivi', 'Satsivi (chicken in walnut sauce)', '🌰', 'Main', 'Georgian', 90, 'Hard', 6, 560,
      'chicken 800, walnuts 300, onion 2, garlic 4, vinegar, salt, spices, water 1000', [
        'Simmer the chicken in the water for 40 minutes, then roast it at 200 °C until golden; keep the broth.',
        'Fry the chopped onions in a little chicken fat until soft.',
        'Grind the walnuts with garlic and spices (khmeli-suneli, coriander, fenugreek, cinnamon, saffron) into a paste.',
        'Gradually stir in warm broth to make a creamy sauce, add the onions and vinegar and simmer for 10 minutes.',
        'Pour over the chicken pieces and chill. Serve cold.']),
    R('chkmeruli', 'Chkmeruli (chicken in garlic cream)', '🧄', 'Main', 'Georgian', 50, 'Medium', 4, 560,
      'chicken 800, garlic 6, cream 300, butter 30, herbs 15?, salt', [
        'Flatten the chicken (or use thighs), season with salt and fry skin-side down under a weight until crisp.',
        'Turn and cook through, then transfer to a clay or oven dish.',
        'Warm the cream (or milk) with lots of crushed garlic, salt and the butter.',
        'Pour over the chicken and bake at 200 °C for 10–15 minutes. Serve with bread for the sauce.']),
    R('lobio', 'Lobio (spiced bean stew)', '🫘', 'Main', 'Georgian', 30, 'Easy', 4, 330,
      'beans 400, onion 2, garlic 2, herbs 30, walnuts 50?, vinegar, oil, salt, spices', [
        'Fry the chopped onions in oil until golden.',
        'Add the cooked or canned red beans with a little of their liquid and roughly mash some of them.',
        'Stir in crushed garlic, ground walnuts, khmeli-suneli, chili flakes and a splash of vinegar; simmer 10 minutes.',
        'Add lots of chopped coriander. Serve hot in a clay pot with bread and pickles.']),
    R('pkhali', 'Pkhali (spinach & walnut balls)', '🥬', 'Snack', 'Georgian', 30, 'Medium', 4, 230,
      'spinach 500, walnuts 150, garlic 2, herbs 30, pomegranate 0.5?, vinegar, salt, spices', [
        'Blanch the spinach for 2 minutes, cool and squeeze out all the water.',
        'Grind the walnuts with garlic, coriander, khmeli-suneli and salt into a paste.',
        'Chop the spinach finely and mix with the walnut paste and a splash of vinegar.',
        'Shape into small balls, press a dent in the top and decorate with pomegranate seeds.']),
    R('badrijani', 'Badrijani nigvzit (eggplant rolls with walnuts)', '🍆', 'Snack', 'Georgian', 40, 'Medium', 4, 280,
      'eggplant 3, walnuts 150, garlic 2, herbs 20, pomegranate 0.5?, oil, vinegar, salt, spices', [
        'Slice the eggplants lengthwise 5 mm thick, salt them for 15 minutes and fry until golden and soft.',
        'Grind the walnuts with garlic, coriander, khmeli-suneli, salt, vinegar and a little water into a paste.',
        'Spread the paste on each slice and roll up.',
        'Garnish with pomegranate seeds and coriander.']),
    R('mtsvadi', 'Mtsvadi (Georgian skewers)', '🍢', 'Main', 'Georgian', 40, 'Easy', 4, 560,
      'lamb 800, onion 2, pomegranate 1?, vinegar, salt, pepper', [
        'Cut the meat into large cubes and mix with salt, pepper and lots of sliced onion; leave 1 hour (no other marinade needed).',
        'Thread onto skewers and grill over hot coals (or under the oven grill) for 12–15 minutes, turning often.',
        'Serve with raw onion rings sprinkled with vinegar and pomegranate juice.']),
    R('ojakhuri', 'Ojakhuri (family-style meat & potatoes)', '🥔', 'Main', 'Georgian', 45, 'Easy', 4, 560,
      'beef 500, potato 5, onion 2, garlic 2?, herbs 15?, oil, salt, spices', [
        'Fry the meat pieces in a little oil until browned and cooked through.',
        'Fry the potato wedges separately until golden.',
        'Add the onion rings to the meat and fry until soft, then mix in the potatoes.',
        'Season with garlic, khmeli-suneli and coriander. Serve straight from the pan.']),
    R('chashushuli', 'Chashushuli (spicy beef & tomato stew)', '🌶️', 'Main', 'Georgian', 60, 'Medium', 4, 450,
      'beef 600, tomato 4, onion 2, bell_pepper 2, garlic 3, chili 1?, herbs 30, oil, salt, spices', [
        'Brown the beef cubes in oil, add the onions and fry until soft.',
        'Add the peppers and chopped tomatoes, cover and simmer 35–40 minutes until the meat is tender.',
        'Add garlic, chili, khmeli-suneli and plenty of coriander; cook 5 more minutes.']),
    R('chikhirtma', 'Chikhirtma (Georgian chicken & egg soup)', '🍲', 'Soup', 'Georgian', 60, 'Medium', 4, 280,
      'chicken 500, onion 2, egg 2, flour 20, butter 20, vinegar, herbs 15, salt, spices, water 2000', [
        'Simmer the chicken in the water for 40 minutes, then take it out and shred.',
        'Fry the chopped onions in butter, stir in the flour and add to the broth.',
        'Whisk the egg yolks with a tablespoon of vinegar, then slowly add a ladle of hot broth.',
        'Take the pot off the heat and stir in the egg mixture (do not boil again). Add the chicken, coriander and saffron.']),
    R('georgian-salad', 'Georgian tomato & cucumber salad with walnuts', '🥗', 'Salad', 'Georgian', 15, 'Easy', 3, 220,
      'tomato 3, cucumber 2, onion 1, walnuts 60, garlic 1, herbs 20, vinegar, oil, salt', [
        'Chop the tomatoes and cucumbers and slice the onion thinly.',
        'Grind the walnuts with the garlic, salt, a splash of vinegar and a little water into a creamy dressing.',
        'Toss the vegetables with the dressing and chopped coriander and basil.']),
    R('lobiani', 'Lobiani (bean-filled bread)', '🫓', 'Main', 'Georgian', 90, 'Medium', 4, 520,
      'flour 400, yeast 7, milk 200, beans 400, onion 1, butter 40, salt, spices', [
        'Knead the flour, warm milk, yeast and salt into a soft dough; let it rise for 1 hour.',
        'Mash the cooked beans and mix with the onion fried in butter, salt, pepper and coriander.',
        'Flatten a ball of dough, put the bean filling inside, seal and roll gently into a flat round.',
        'Bake at 220 °C for 15–18 minutes (or cook in a covered pan), brush with butter.']),
    R('gozinaki', 'Gozinaki (walnut & honey brittle)', '🍯', 'Dessert', 'Georgian', 30, 'Easy', 8, 290,
      'walnuts 300, honey 150, sugar 15', [
        'Toast the walnuts lightly in a dry pan and chop roughly.',
        'Heat the honey with 1 tbsp sugar until it boils and darkens slightly (3–4 minutes).',
        'Stir in the walnuts and cook 3–4 more minutes.',
        'Spread on a wet board, flatten with a wet knife and cut into diamonds before it hardens.']),

    /* ===================== MORE TURKISH ===================== */
    R('lahmacun', 'Lahmacun (Turkish meat flatbread)', '🫓', 'Main', 'Turkish', 90, 'Medium', 4, 520,
      'flour 300, yeast 5, ground_meat 250, onion 1, tomato 2, bell_pepper 1, herbs 30, tomato_paste 20, lemon 1?, salt, spices, water 180', [
        'Knead the flour, yeast, salt and warm water into a soft dough; let it rise for 1 hour.',
        'Finely chop (or blend) the onion, tomatoes, pepper and parsley; mix with the meat, tomato paste, chili flakes and salt.',
        'Divide the dough into 6–8 balls and roll each very thin.',
        'Spread a thin layer of topping to the edges and bake at the highest temperature for 6–8 minutes.',
        'Serve with lemon, parsley and onion with sumac — roll it up and eat.']),
    R('pide', 'Turkish cheese & meat pide', '🫓', 'Main', 'Turkish', 90, 'Medium', 4, 620,
      'flour 400, yeast 7, milk 100, cheese 200, ground_meat 250?, egg 1, butter 20, salt, sugar 5, water 150', [
        'Knead the flour, yeast, warm milk, water, sugar and salt into a soft dough; let it rise for 1 hour.',
        'Fry the meat with salt and pepper if using.',
        'Roll the dough into long ovals, fill with cheese (and meat), fold the long edges in and pinch the ends to make boats.',
        'Brush the edges with egg and bake at 230 °C for 12–15 minutes. Brush with butter.']),
    R('iskender', 'İskender kebab', '🥩', 'Main', 'Turkish', 45, 'Medium', 4, 690,
      'beef 500, bread 200, tomato_paste 40, butter 60, yogurt 300, tomato 2?, salt, spices', [
        'Slice the beef paper-thin and fry quickly on high heat; season.',
        'Cut the bread (pide) into cubes and lay on plates.',
        'Make a sauce from the tomato paste, a little water and 1 tbsp butter; spoon some over the bread.',
        'Top with the meat, add yogurt on the side and pour sizzling melted butter over everything at the table.']),
    R('adana-kebab', 'Adana kebab', '🍢', 'Main', 'Turkish', 40, 'Medium', 4, 520,
      'ground_meat 800, chili 2?, onion 1?, tortilla 4?, tomato 2?, salt, spices', [
        'Mix the minced lamb with finely chopped red pepper, salt, chili flakes and paprika; knead well and chill 30 minutes.',
        'With wet hands press the meat onto flat skewers.',
        'Grill over hot coals or under a very hot oven grill for 8–10 minutes, turning once.',
        'Serve on lavash with grilled tomatoes, peppers and onion with sumac.']),
    R('kofte', 'Turkish köfte', '🍡', 'Main', 'Turkish', 30, 'Easy', 4, 430,
      'ground_meat 500, onion 1, bread 50, egg 1?, herbs 15?, oil, salt, spices', [
        'Grate the onion and soak the bread in water, then squeeze.',
        'Knead the meat with the onion, bread, egg, parsley, cumin, salt and pepper for 5 minutes; chill 20 minutes.',
        'Shape into small oval patties.',
        'Fry or grill for 3–4 minutes per side. Serve with rice, salad and pickles.']),
    R('karniyarik', 'Karnıyarık (stuffed eggplant with meat)', '🍆', 'Main', 'Turkish', 60, 'Medium', 4, 450,
      'eggplant 4, ground_meat 300, onion 1, tomato 2, bell_pepper 2, garlic 2, oil, salt, spices', [
        'Peel the eggplants in stripes and fry them whole until soft; cut a slit along each.',
        'Fry the onion, garlic and peppers, add the meat and cook, then add one chopped tomato; season.',
        'Open the eggplants, stuff with the meat filling and top with tomato and pepper slices.',
        'Pour a little water into the dish and bake at 180 °C for 25 minutes.']),
    R('manti', 'Mantı (Turkish dumplings with yogurt)', '🥟', 'Main', 'Turkish', 120, 'Hard', 4, 590,
      'flour 300, egg 1, ground_meat 250, onion 1, yogurt 300, garlic 2, butter 40, tomato_paste 15?, salt, spices, water 100', [
        'Knead the flour, egg, salt and water into a firm dough; rest 30 minutes.',
        'Mix the meat with grated onion, salt and pepper.',
        'Roll the dough thin, cut into 3 cm squares, put a tiny bit of filling on each and pinch the 4 corners together.',
        'Boil in salted water for 10 minutes and drain.',
        'Top with garlic yogurt and drizzle with butter sizzled with tomato paste, chili flakes and dried mint.']),
    R('ezogelin', 'Ezogelin soup', '🥣', 'Soup', 'Turkish', 45, 'Easy', 5, 230,
      'lentils 150, bulgur 40, rice 40, onion 1, tomato_paste 30, butter 30, salt, spices, water 1500', [
        'Fry the onion in butter and stir in the tomato paste.',
        'Add the rinsed lentils, bulgur, rice and water; simmer for 35 minutes, stirring occasionally.',
        'Season with salt, dried mint and chili flakes. Serve with lemon.']),
    R('tavuk-sote', 'Tavuk sote (chicken & pepper sauté)', '🍗', 'Main', 'Turkish', 30, 'Easy', 3, 360,
      'chicken 500, bell_pepper 2, tomato 2, onion 1, garlic 2, tomato_paste 15?, oil, salt, spices', [
        'Fry the chicken cubes in oil until they release and then lose their juices.',
        'Add the onion, garlic and peppers and fry for 5 minutes.',
        'Add the chopped tomatoes and tomato paste, season and cook 10 minutes. Serve with rice pilaf.']),
    R('sigara-boregi', 'Sigara böreği (cheese rolls)', '🥟', 'Snack', 'Turkish', 25, 'Easy', 4, 330,
      'tortilla 4, feta 200, herbs 20, egg 1?, oil', [
        'Mix the crumbled feta with chopped parsley (and the egg).',
        'Cut the yufka (or lavash) into triangles, put filling on the wide end, fold in the sides and roll up tightly like a cigar; seal the tip with water.',
        'Fry in hot oil until golden, or brush with oil and bake at 200 °C for 15 minutes.']),
    R('gozleme', 'Gözleme (stuffed flatbread)', '🫓', 'Snack', 'Turkish', 45, 'Medium', 4, 420,
      'flour 300, spinach 200, feta 150, butter 30, yogurt 50?, salt, water 150', [
        'Knead the flour, water, yogurt and salt into a soft dough; rest 20 minutes.',
        'Chop the spinach and mix with the crumbled feta.',
        'Roll each ball of dough very thin, put the filling on one half and fold over (or fold into an envelope).',
        'Cook on a hot dry pan for 2–3 minutes per side, brushing with butter.']),
    R('cilbir', 'Çılbır (poached eggs on garlic yogurt)', '🍳', 'Breakfast', 'Turkish', 15, 'Easy', 2, 310,
      'egg 4, yogurt 300, garlic 1, butter 30, salt, spices', [
        'Mix the yogurt with crushed garlic and salt and spread on plates.',
        'Poach the eggs in simmering water with a splash of vinegar for 3 minutes; place on the yogurt.',
        'Melt the butter with chili flakes (pul biber) until it sizzles and pour over. Eat with bread.']),
    R('sucuklu-yumurta', 'Sucuklu yumurta (eggs with sucuk)', '🍳', 'Breakfast', 'Turkish', 10, 'Easy', 2, 420,
      'egg 4, sausage 100, butter 10?', [
        'Slice the sucuk (or any spicy sausage) and fry it in a small pan in its own fat (add butter if needed).',
        'Crack the eggs over it and cook until the whites set. Serve in the pan with bread.']),
    R('kisir', 'Kısır (spicy bulgur salad)', '🌾', 'Salad', 'Turkish', 30, 'Easy', 4, 260,
      'bulgur 200, tomato_paste 30, tomato 2, cucumber 1, herbs 60, lemon 1, pomegranate 0.5?, oil, salt, spices, water 250', [
        'Pour the boiling water over the fine bulgur, cover and leave for 15 minutes.',
        'Knead in the tomato paste (and pepper paste), olive oil and chili flakes while still warm.',
        'Add the finely chopped tomatoes, cucumber, parsley, mint and green onion.',
        'Season with lemon juice, narsharab and salt. Serve in lettuce leaves.']),
    R('hunkar-begendi', 'Hünkar beğendi (lamb on smoky eggplant purée)', '🍆', 'Main', 'Turkish', 90, 'Hard', 4, 640,
      'lamb 500, onion 1, tomato 2, eggplant 4, milk 300, flour 30, butter 50, cheese 50, salt, spices, water 300', [
        'Brown the lamb cubes, add the onion and chopped tomatoes and the water; simmer covered for 1 hour.',
        'Char the eggplants over a flame or under the grill until soft, peel and mash.',
        'Melt the butter, stir in the flour, whisk in the milk until thick, then add the eggplant and grated cheese.',
        'Spread the smoky purée on plates and spoon the lamb stew on top.']),
    R('sehriyeli-pilav', 'Turkish rice pilaf with orzo', '🍚', 'Side', 'Turkish', 25, 'Easy', 4, 300,
      'rice 300, pasta 50, butter 40, salt, water 500', [
        'Soak the rice in warm salted water for 15 minutes and drain.',
        'Fry the orzo (şehriye) in butter until golden, then add the rice and stir for 2 minutes.',
        'Add the hot water and salt, cover and cook on low heat for 15 minutes.',
        'Rest covered with a towel for 10 minutes and fluff.']),
    R('revani', 'Revani (semolina syrup cake)', '🍰', 'Dessert', 'Turkish', 60, 'Medium', 12, 300,
      'semolina 200, flour 100, yogurt 150, egg 3, lemon 0.5?, oil, sugar 450, baking, water 400', [
        'Make a syrup: boil the water with 300 g sugar and lemon juice for 10 minutes, then cool.',
        'Whisk the eggs with 150 g sugar, add the yogurt and 100 ml oil.',
        'Fold in the semolina, flour and baking powder; pour into a tray.',
        'Bake at 180 °C for 30 minutes, then pour the cool syrup over the hot cake and let it soak for 1 hour.']),
    R('irmik-helvasi', 'İrmik helvası (semolina halva)', '🍮', 'Dessert', 'Turkish', 30, 'Easy', 6, 380,
      'semolina 250, butter 100, milk 500, walnuts 50?, sugar 200', [
        'Heat the milk with 200 g sugar until dissolved.',
        'Roast the semolina and walnuts in the butter on low heat, stirring constantly, until golden (15 minutes).',
        'Carefully pour in the hot milk, stir, cover and leave off the heat for 10 minutes.',
        'Shape with a spoon and serve warm with cinnamon.']),

    /* ===================== STUDENT KITCHEN — quick, cheap, few ingredients ===================== */
    R('upgraded-noodles', 'Upgraded instant noodles', '🍜', 'Main', 'Everyday', 5, 'Easy', 1, 450,
      'instant_noodles 1, egg 1, herbs 10?, cheese 20?, soy_sauce 10?, water 400', [
        'Boil the water and cook the noodles with the flavour sachet for 2 minutes.',
        'Crack the egg straight into the pot and stir gently — or leave it whole and cover for 2 minutes for a soft-poached egg.',
        'Top with chopped green onion, a slice of cheese or a splash of soy sauce.']),
    R('noodle-stir-fry', 'Instant noodle stir-fry with sausage', '🍜', 'Main', 'Everyday', 10, 'Easy', 2, 510,
      'instant_noodles 2, sausage 100, onion 0.5?, frozen_veg 100?, soy_sauce 15?, oil', [
        'Cook the noodles for 2 minutes without the sachet and drain.',
        'Fry sliced sausage, onion and frozen vegetables in a little oil for 3–4 minutes.',
        'Add the noodles, half the flavour sachet (or soy sauce) and toss for 1 minute.']),
    R('butter-cheese-pasta', 'Butter & cheese pasta', '🧀', 'Main', 'Everyday', 12, 'Easy', 1, 560,
      'pasta 120, butter 20, cheese 40, pepper, salt', [
        'Cook the pasta in salted water and drain, keeping a few spoons of the water.',
        'Toss with the butter, grated cheese and a splash of pasta water until creamy.',
        'Finish with black pepper.']),
    R('ketchup-sausage-pasta', 'Pasta with sausages & ketchup', '🌭', 'Main', 'Everyday', 15, 'Easy', 2, 580,
      'pasta 200, sausage 150, ketchup 50, onion 0.5?, cheese 30?, oil, salt', [
        'Cook the pasta in salted water.',
        'Slice the sausages and fry them (with the onion) for 3 minutes.',
        'Add the drained pasta and ketchup, toss for 1 minute and top with cheese.']),
    R('tuna-pasta', 'Quick tuna pasta', '🐟', 'Main', 'Everyday', 15, 'Easy', 2, 520,
      'pasta 200, tuna 160, tomato_paste 30?, garlic 1?, oil, salt, pepper', [
        'Cook the pasta in salted water.',
        'Warm the garlic and tomato paste in oil with a splash of pasta water.',
        'Add the drained tuna and pasta, mix well and season.']),
    R('tomato-paste-pasta', 'Cheap tomato & garlic pasta', '🍝', 'Main', 'Everyday', 15, 'Easy', 2, 470,
      'pasta 200, tomato_paste 40, garlic 2, cheese 20?, oil, salt, sugar', [
        'Cook the pasta in salted water.',
        'Fry the sliced garlic in oil for 1 minute, add the tomato paste, a pinch of sugar and half a cup of pasta water.',
        'Simmer for 2 minutes, add the pasta and toss. Top with cheese.']),
    R('navy-pasta', 'Navy-style pasta (ground meat & pasta)', '🍝', 'Main', 'Everyday', 20, 'Easy', 2, 640,
      'pasta 200, ground_meat 200, onion 1, oil, salt, pepper', [
        'Cook the pasta in salted water.',
        'Fry the chopped onion and ground meat until browned and cooked through; season well.',
        'Mix in the drained pasta and fry together for 2 minutes.']),
    R('fried-eggs', 'Fried eggs on toast', '🍳', 'Breakfast', 'Everyday', 5, 'Easy', 1, 300,
      'egg 2, bread 60, butter 10, salt, pepper', [
        'Melt the butter in a pan on medium heat.',
        'Crack in the eggs and cook until the whites are set (cover for runny yolks that are still warm on top).',
        'Season and serve on toast.']),
    R('egg-in-hole', 'Egg in a hole', '🍞', 'Breakfast', 'Everyday', 7, 'Easy', 1, 290,
      'bread 60, egg 2, butter 10, salt', [
        'Cut a circle out of the middle of each bread slice with a glass.',
        'Fry the bread in butter, crack an egg into each hole.',
        'Cook for 2 minutes, flip carefully and cook 1 more minute.']),
    R('scrambled-egg-toast', 'Scrambled eggs on toast', '🍳', 'Breakfast', 'Everyday', 7, 'Easy', 1, 380,
      'egg 3, bread 60, butter 10, milk 30?, salt, pepper', [
        'Whisk the eggs with the milk and a pinch of salt.',
        'Cook in butter on low heat, stirring slowly, until just set and creamy.',
        'Pile onto toast and add pepper.']),
    R('mug-omelette', 'Microwave mug omelette', '☕', 'Breakfast', 'Everyday', 3, 'Easy', 1, 260,
      'egg 2, milk 30, cheese 20?, sausage 30?, salt', [
        'Whisk the eggs, milk and salt in a large mug.',
        'Add grated cheese or chopped sausage.',
        'Microwave for 1 minute, stir, then 30–45 seconds more until set.']),
    R('lavash-egg-wrap', 'Lavash egg & cheese wrap', '🌯', 'Breakfast', 'Everyday', 8, 'Easy', 1, 420,
      'tortilla 1, egg 2, cheese 30, herbs 5?, oil, salt', [
        'Beat the eggs with salt and pour into a lightly oiled pan.',
        'Immediately press the lavash on top; after 1 minute flip it so the egg is facing up.',
        'Sprinkle cheese on top, fold in half and cook until the cheese melts.']),
    R('lazy-khachapuri', 'Lazy pan khachapuri', '🧀', 'Main', 'Everyday', 15, 'Easy', 2, 480,
      'cheese 150, egg 2, yogurt 100, flour 60, butter 10, salt, baking', [
        'Mix the grated cheese, eggs, yogurt, flour, a pinch of salt and baking soda into a thick batter.',
        'Pour into a buttered pan, cover and cook on low heat for 6–7 minutes.',
        'Flip (slide onto a plate and turn it over) and cook 4 more minutes.']),
    R('pelmeni', 'Boiled pelmeni with sour cream', '🥟', 'Main', 'Everyday', 12, 'Easy', 1, 540,
      'pelmeni 250, sour_cream 40?, butter 10?, salt, water 1500', [
        'Bring salted water to a boil (add a bay leaf if you have one).',
        'Drop in the frozen dumplings and stir so they do not stick.',
        'Cook 3–5 minutes after they float, drain and serve with butter or sour cream.']),
    R('fried-pelmeni', 'Pan-fried pelmeni', '🥟', 'Main', 'Everyday', 15, 'Easy', 1, 620,
      'pelmeni 250, onion 0.5?, cheese 30?, sour_cream 40?, oil, water 100', [
        'Fry the frozen dumplings in oil for 3 minutes until golden underneath.',
        'Pour in the water, cover and steam for 7–8 minutes until it evaporates.',
        'Uncover, fry 1–2 more minutes, add cheese on top and serve with sour cream.']),
    R('buckwheat', 'Buttered buckwheat', '🌾', 'Side', 'Everyday', 20, 'Easy', 2, 250,
      'buckwheat 150, butter 15, salt, water 300', [
        'Rinse the buckwheat and put it in a pot with the water and salt.',
        'Bring to a boil, cover and cook on low heat for 15 minutes until the water is absorbed.',
        'Stir in the butter and let it rest for 5 minutes.']),
    R('buckwheat-sausage', 'Buckwheat with fried onion & sausage', '🌾', 'Main', 'Everyday', 20, 'Easy', 2, 480,
      'buckwheat 150, onion 1, sausage 100?, egg 1?, oil, salt, water 300', [
        'Cook the buckwheat in salted water for 15 minutes.',
        'Meanwhile fry the onion and sliced sausage until golden.',
        'Mix everything together (add a fried egg on top if you like).']),
    R('egg-fried-rice', 'Egg fried rice', '🍚', 'Main', 'Everyday', 10, 'Easy', 1, 480,
      'rice 60, egg 2, soy_sauce 15, frozen_veg 100?, herbs 10?, oil', [
        'Use cooked, cold rice — about 170 g cooked from 60 g dry (leftovers are perfect).',
        'Scramble the eggs in hot oil, then add the frozen vegetables for 2 minutes.',
        'Add the rice and soy sauce and stir-fry on high heat for 3 minutes.']),
    R('tuna-rice-bowl', 'Tuna mayo rice bowl', '🍚', 'Main', 'Everyday', 5, 'Easy', 1, 520,
      'rice 60, tuna 80, sour_cream 20, soy_sauce 10?, cucumber 0.5?', [
        'Warm up cooked rice — about 170 g, from 60 g dry (1–2 minutes in the microwave).',
        'Mix the tuna with the mayo.',
        'Put it on the rice with cucumber slices and a splash of soy sauce.']),
    R('jacket-potato', 'Microwave jacket potato', '🥔', 'Main', 'Everyday', 12, 'Easy', 1, 330,
      'potato 2, butter 15, cheese 30?, tuna 80?, salt', [
        'Wash the potatoes and prick them all over with a fork.',
        'Microwave on high for 8–10 minutes, turning halfway, until soft.',
        'Cut open, add butter, salt and cheese or tuna.']),
    R('herb-potatoes', 'Boiled potatoes with butter & herbs', '🥔', 'Side', 'Everyday', 20, 'Easy', 2, 260,
      'potato 4, butter 20, herbs 10?, garlic 1?, salt', [
        'Peel and halve the potatoes, boil in salted water for 15–18 minutes.',
        'Drain and toss with butter, crushed garlic and chopped dill.']),
    R('spanish-omelette', 'Lazy potato omelette', '🍳', 'Main', 'Everyday', 20, 'Easy', 2, 380,
      'potato 2, egg 3, onion 1?, oil, salt', [
        'Slice the potatoes thinly and fry them (with the onion) in oil until soft, about 10 minutes.',
        'Pour the beaten, salted eggs over them.',
        'Cover and cook on low heat until set, 5–6 minutes.']),
    R('cabbage-egg', 'Fried cabbage with egg', '🥬', 'Main', 'Everyday', 15, 'Easy', 2, 200,
      'cabbage 300, egg 2, onion 0.5?, oil, salt, pepper', [
        'Shred the cabbage and fry it (with the onion) in oil for 8–10 minutes until soft and slightly golden.',
        'Push it aside, scramble the eggs in the pan, then mix everything and season.']),
    R('veg-rice', 'Rice with frozen vegetables', '🍚', 'Main', 'Everyday', 20, 'Easy', 2, 340,
      'rice 150, frozen_veg 200, soy_sauce 15?, butter 15, salt, water 300', [
        'Bring the water with salt to a boil, add the rice and cook covered on low heat for 12 minutes.',
        'Add the frozen vegetables on top, cover and cook 5 more minutes.',
        'Stir in the butter (and soy sauce).']),
    R('mujaddara', 'Lentils & rice with crispy onion', '🫘', 'Main', 'Middle Eastern', 30, 'Easy', 3, 380,
      'lentils 100, rice 100, onion 2, oil, salt, spices, water 600', [
        'Boil the lentils in the water for 10 minutes.',
        'Add the rice and salt and cook covered on low heat for 15 minutes.',
        'Meanwhile fry the sliced onions in oil until dark golden and crispy.',
        'Serve the lentil rice topped with the onions (and yogurt if you have it).']),
    R('beans-on-toast', 'Beans on toast', '🫘', 'Breakfast', 'Everyday', 10, 'Easy', 1, 380,
      'beans 200, bread 60, ketchup 30, cheese 20?, butter 10?', [
        'Warm the beans with the ketchup (or tomato paste and a splash of water) for 3–4 minutes.',
        'Toast and butter the bread.',
        'Spoon the beans on top and add grated cheese.']),
    R('chickpea-tomato', 'Quick chickpea & tomato stew', '🫘', 'Main', 'Everyday', 15, 'Easy', 2, 330,
      'chickpeas 240, tomato 2, onion 1, oil, salt, spices', [
        'Fry the chopped onion in oil until soft.',
        'Add the chopped tomatoes and spices (cumin, paprika) and cook for 5 minutes.',
        'Add the drained canned chickpeas, simmer for 5 minutes and season. Eat with bread.']),
    R('pizza-toast', 'Oven pizza toast', '🍕', 'Snack', 'Everyday', 10, 'Easy', 2, 300,
      'bread 120, ketchup 30, cheese 60, sausage 60?, tomato 1?', [
        'Spread ketchup on the bread slices.',
        'Top with sliced sausage or tomato and grated cheese.',
        'Bake at 200 °C for 6–8 minutes, or microwave for 1 minute until the cheese melts.']),
    R('lavash-pizza', 'Pan lavash pizza', '🍕', 'Main', 'Everyday', 10, 'Easy', 1, 520,
      'tortilla 1, ketchup 30, cheese 80, sausage 60?, tomato 1?', [
        'Put the lavash in a dry pan and spread ketchup over it.',
        'Add sliced sausage or tomato and cover with grated cheese.',
        'Cover with a lid and cook on low heat for 4–5 minutes until the cheese melts and the bottom is crisp.']),
    R('hot-sandwich', 'Hot sausage & cheese sandwich', '🥪', 'Snack', 'Everyday', 7, 'Easy', 1, 450,
      'bread 60, sausage 50, cheese 40, ketchup 15?, butter 10?', [
        'Make a sandwich with sliced sausage and cheese (and a bit of ketchup).',
        'Butter the outside and fry in a pan for 2–3 minutes per side, pressing it down with a spatula.']),
    R('pan-chicken', 'Simple pan-fried chicken', '🍗', 'Main', 'Everyday', 20, 'Easy', 2, 330,
      'chicken 300, garlic 1?, oil, salt, pepper, spices', [
        'Cut the chicken into pieces and season with salt, pepper and paprika.',
        'Fry in hot oil for 6–8 minutes per side (thighs) or 4–5 (breast) until cooked through.',
        'Add crushed garlic for the last minute. Serve with rice, pasta or bread.']),
    R('egg-drop-soup', 'Egg drop soup', '🥣', 'Soup', 'Chinese', 10, 'Easy', 2, 110,
      'egg 2, soy_sauce 15, herbs 10?, flour 10?, salt, water 800', [
        'Bring the water to a boil with the soy sauce and salt (stir in the flour mixed with cold water to thicken).',
        'Slowly pour in the beaten eggs while stirring to make ribbons.',
        'Top with chopped green onion.']),
    R('banana-pancakes', '2-ingredient banana pancakes', '🍌', 'Breakfast', 'Everyday', 10, 'Easy', 1, 260,
      'banana 1, egg 2, honey 15?, oil', [
        'Mash the banana with a fork and whisk in the eggs.',
        'Fry small spoonfuls in a lightly oiled pan for 1–2 minutes per side.',
        'Serve with honey.']),
    R('overnight-oats', 'Overnight oats (no cooking)', '🥣', 'Breakfast', 'Everyday', 5, 'Easy', 1, 330,
      'oats 50, milk 150, yogurt 50?, honey 10?, banana 1?', [
        'Mix the oats, milk and yogurt in a jar.',
        'Close it and leave in the fridge overnight.',
        'In the morning add honey and sliced banana.']),
    R('pb-banana-toast', 'Peanut butter banana toast', '🥜', 'Breakfast', 'Everyday', 3, 'Easy', 1, 390,
      'bread 60, peanut_butter 30, banana 1, honey 10?', [
        'Toast the bread.',
        'Spread with peanut butter and top with banana slices.',
        'Drizzle with honey.']),
    R('mug-cake', 'Microwave chocolate mug cake', '🍫', 'Dessert', 'Everyday', 5, 'Easy', 1, 420,
      'flour 40, milk 45, chocolate 15, egg 1?, oil, sugar 25, baking', [
        'In a large mug mix the flour, 2 tbsp sugar, cocoa and a pinch of baking powder.',
        'Add the milk, 1 tbsp oil (and the egg) and stir until smooth.',
        'Microwave for 70–90 seconds. Let it cool for a minute before eating.']),

    /* ===================== DRINKS ===================== */
    R('ayran', 'Ayran', '🥛', 'Drink', 'Azerbaijani', 5, 'Easy', 2, 70,
      'yogurt 500, herbs 5?, salt, water 300', [
        'Whisk the yogurt with cold water and a pinch of salt until frothy.',
        'Add chopped mint if you like and serve chilled.']),
    R('smoothie', 'Berry banana smoothie', '🍓', 'Drink', 'International', 5, 'Easy', 2, 190,
      'banana 1, berries 150, yogurt 200, honey 15?', [
        'Put everything in a blender.',
        'Blend until smooth and serve immediately.']),
    R('milkshake', 'Banana chocolate milkshake', '🥤', 'Drink', 'American', 5, 'Easy', 2, 260,
      'milk 400, banana 2, chocolate 20?, honey 20?', [
        'Blend the cold milk, bananas, cocoa and honey until frothy.',
        'Serve right away.']),
    R('lemonade', 'Homemade mint lemonade', '🍋', 'Drink', 'International', 10, 'Easy', 6, 90,
      'lemon 4, herbs 10?, sugar 120, water 1500', [
        'Dissolve 120 g sugar in a little hot water.',
        'Add the lemon juice and cold water.',
        'Add mint leaves and ice and serve.'])
  ];

  // Each dish's name in its own language (shown first; the English name appears on tap)
  const NATIVE = {
    // Azerbaijani
    'dovga': 'Dovğa', 'bozbash': 'Bozbaş', 'kufta-bozbash': 'Küftə bozbaş', 'chicken-pilaf': 'Toyuq plovu',
    'chicken-chighirtma': 'Toyuq çığırtması', 'chicken-lavangi': 'Toyuq ləvəngisi', 'beef-potato-qovurma': 'Kartoflu ət qovurması',
    'cutlets': 'Kotlet', 'stuffed-peppers': 'Bibər dolması', 'yarpaq-dolma': 'Yarpaq dolması', 'cabbage-dolma': 'Kələm dolması',
    'plov': 'Plov', 'lula-kebab': 'Lülə kabab', 'meat-qutab': 'Ətli qutab', 'saj-ichi': 'Sac içi', 'fried-fish': 'Balıq qızartması',
    'fish-lavangi': 'Balıq ləvəngisi', 'ajapsandal': 'Ajapsandal', 'green-bean-eggs': 'Lobya çığırtması', 'shepherd-salad': 'Çoban salatı',
    'beet-salad': 'Çuğundur salatı', 'mangal-salad': 'Mangal salatı', 'herb-kuku': 'Göyərti kükü', 'greens-qutab': 'Göyərti qutabı',
    'eggplant-yogurt': 'Qatıqlı badımcan', 'tomato-eggs': 'Pomidor-yumurta', 'spinach-eggs': 'İspanaqlı yumurta',
    'rice-porridge': 'Südlü düyü sıyığı', 'halva': 'Un halvası', 'spinach-borani': 'İspanaq boranisi', 'piti': 'Şəki pitisi',
    'dushbara': 'Düşbərə', 'khingal': 'Xəngəl', 'tava-kebab': 'Tava kababı', 'turshu-qovurma': 'Turşu qovurma',
    'sabzi-qovurma': 'Sabzı qovurma', 'three-sisters-dolma': 'Üç bacı dolması', 'pumpkin-qutab': 'Balqabaq qutabı',
    'arishta-ashi': 'Əriştə aşı', 'narsharab-chicken': 'Narşərablı toyuq', 'sturgeon-kebab': 'Balıq kababı', 'fisinjan': 'Fisincan',
    'shah-plov': 'Şah plov', 'shekerbura': 'Şəkərbura', 'pakhlava': 'Paxlava', 'kata': 'Kətə', 'sherbet': 'Zəfəranlı şərbət', 'ayran': 'Ayran',
    // Turkish
    'red-lentil-soup': 'Mercimek çorbası', 'yayla-soup': 'Yayla çorbası', 'white-bean-soup': 'Kuru fasulye çorbası',
    'chicken-kebab': 'Tavuk şiş', 'eggplant-kebab': 'Patlıcan kebabı', 'imam-bayildi': 'İmam bayıldı', 'spinach-borek': 'Ispanaklı börek',
    'bulgur-pilaf': 'Bulgur pilavı', 'bean-salad': 'Piyaz', 'cacik': 'Cacık', 'lentil-kofte': 'Mercimek köftesi', 'zucchini-fritters': 'Mücver',
    'menemen': 'Menemen', 'rice-pudding': 'Sütlaç', 'yogurt-pasta': 'Yoğurtlu makarna', 'yogurt-cake': 'Yoğurtlu kek',
    'lahmacun': 'Lahmacun', 'pide': 'Kıymalı kaşarlı pide', 'iskender': 'İskender kebap', 'adana-kebab': 'Adana kebap',
    'kofte': 'Izgara köfte', 'karniyarik': 'Karnıyarık', 'manti': 'Mantı', 'ezogelin': 'Ezogelin çorbası', 'tavuk-sote': 'Tavuk sote',
    'sigara-boregi': 'Sigara böreği', 'gozleme': 'Gözleme', 'cilbir': 'Çılbır', 'sucuklu-yumurta': 'Sucuklu yumurta', 'kisir': 'Kısır',
    'hunkar-begendi': 'Hünkâr beğendi', 'sehriyeli-pilav': 'Şehriyeli pilav', 'revani': 'Revani', 'irmik-helvasi': 'İrmik helvası',
    // Georgian
    'kharcho': 'ხარჩო', 'adjaruli-khachapuri': 'აჭარული ხაჭაპური', 'imeruli-khachapuri': 'იმერული ხაჭაპური', 'khinkali': 'ხინკალი',
    'chakhokhbili': 'ჩახოხბილი', 'satsivi': 'საცივი', 'chkmeruli': 'შქმერული', 'lobio': 'ლობიო', 'pkhali': 'ფხალი',
    'badrijani': 'ბადრიჯანი ნიგვზით', 'mtsvadi': 'მწვადი', 'ojakhuri': 'ოჯახური', 'chashushuli': 'ჩაშუშული', 'chikhirtma': 'ჩიხირთმა',
    'georgian-salad': 'ქართული სალათი ნიგვზით', 'lobiani': 'ლობიანი', 'gozinaki': 'გოზინაყი',
    // Russian
    'borscht': 'Борщ', 'chicken-mushroom-julienne': 'Жюльен с курицей и грибами', 'beef-stroganoff': 'Бефстроганов',
    'mushroom-potatoes': 'Картошка с грибами', 'potato-pancakes': 'Драники', 'cabbage-carrot-salad': 'Салат из капусты с морковью',
    'olivier': 'Салат Оливье', 'syrniki': 'Сырники', 'apple-charlotte': 'Шарлотка', 'cottage-cheese-bake': 'Творожная запеканка',
    // French
    'mushroom-soup': 'Velouté de champignons', 'ratatouille': 'Ratatouille', 'cheese-omelet': 'Omelette au fromage',
    'french-toast': 'Pain perdu', 'crepes': 'Crêpes',
    // Italian
    'minestrone': 'Minestrone', 'creamy-chicken-pasta': 'Pasta al pollo con panna', 'bolognese': 'Spaghetti alla bolognese',
    'lasagna': 'Lasagne alla bolognese', 'sausage-pasta': 'Pasta salsiccia e pomodoro', 'shrimp-pasta': 'Pasta con gamberi',
    'pasta-pomodoro': 'Pasta al pomodoro', 'aglio-olio': 'Spaghetti aglio, olio e peperoncino', 'pizza-margherita': 'Pizza Margherita',
    'mushroom-risotto': 'Risotto ai funghi', 'garlic-bread': "Pane all'aglio", 'bruschetta': 'Bruschetta al pomodoro',
    'tuna-bean-salad': 'Insalata di tonno e fagioli',
    // Chinese & Japanese
    'chicken-corn-soup': '鸡肉玉米羹', 'chicken-fried-rice': '鸡肉炒饭', 'beef-broccoli': '西兰花炒牛肉', 'veg-noodles': '素炒面',
    'peanut-noodles': '花生酱拌面', 'egg-drop-soup': '蛋花汤', 'teriyaki-chicken': '鶏の照り焼き', 'salmon-teriyaki': '鮭の照り焼き',
    // Middle Eastern
    'yogurt-lemon-chicken': 'دجاج باللبن والليمون', 'chicken-shawarma': 'شاورما دجاج', 'fried-cauliflower': 'قرنبيط مقلي',
    'tabbouleh': 'تبولة', 'hummus': 'حمص', 'shakshuka': 'شكشوكة', 'labneh': 'لبنة', 'mujaddara': 'مجدرة',
    // Indian
    'chicken-curry': 'मुर्ग़ करी', 'chana-masala': 'चना मसाला', 'lassi': 'लस्सी',
    // Others
    'gazpacho': 'Gazpacho andaluz', 'chicken-fajitas': 'Fajitas de pollo', 'chili-con-carne': 'Chili con carne',
    'beef-tacos': 'Tacos de carne molida', 'guacamole': 'Guacamole', 'quesadilla': 'Quesadilla de queso',
    'chicken-schnitzel': 'Hähnchenschnitzel', 'moussaka': 'Μουσακάς', 'greek-salad': 'Χωριάτικη σαλάτα', 'chicken-satay': 'Sate ayam'
  };
  window.RECIPES.forEach(r => { r.native = NATIVE[r.id] || r.name; });
})();
