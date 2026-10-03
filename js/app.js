(function () {
  'use strict';

  const INGREDIENTS = window.INGREDIENTS;
  const RECIPES = window.RECIPES;
  const IMAGES = window.RECIPE_IMAGES || {};
  const ING = Object.fromEntries(INGREDIENTS.map(i => [i.id, i]));
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ================= Storage (localStorage) ================= */
  const store = {
    get(key, fallback) {
      try {
        const v = localStorage.getItem('mk.' + key);
        return v == null ? fallback : JSON.parse(v);
      } catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem('mk.' + key, JSON.stringify(value)); } catch { /* storage unavailable */ }
    }
  };

  const dateKey = (d = new Date()) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const todayKey = () => 'water.' + dateKey();

  /* ================= Migration from the first (Azerbaijani) version ================= */
  const OLD_IDS = {
    toyuq: 'chicken', mal: 'beef', qoyun: 'lamb', qiyme: 'ground_meat', baliq: 'fish', yumurta: 'egg',
    sogan: 'onion', sarimsaq: 'garlic', kartof: 'potato', pomidor: 'tomato', xiyar: 'cucumber', biber: 'bell_pepper',
    badimcan: 'eggplant', yerkoku: 'carrot', kelem: 'cabbage', ispanaq: 'spinach', gobelek: 'mushroom', goyerti: 'herbs',
    limon: 'lemon', alma: 'apple', banan: 'banana', duyu: 'rice', makaron: 'pasta', bulqur: 'bulgur', merci: 'lentils',
    noxud: 'chickpeas', yulaf: 'oats', un: 'flour', corek: 'bread', sud: 'milk', qatiq: 'yogurt', xama: 'sour_cream',
    pendir: 'cheese', kesmik: 'cottage_cheese', kere: 'butter', tomat: 'tomato_paste', qoz: 'walnuts', bal: 'honey'
  };

  const profile0 = store.get('profile', null);
  if (profile0 && !['cold', 'mild', 'warm', 'hot'].includes(profile0.climate)) {
    profile0.climate = profile0.climate === 'hot' ? 'hot' : 'mild';
    store.set('profile', profile0);
  }
  const pantry0 = store.get('pantry', []).map(p => {
    if (p.id && OLD_IDS[p.id]) return { ...p, id: OLD_IDS[p.id], name: ING[OLD_IDS[p.id]].name };
    return p;
  }).filter(p => !p.id || ING[p.id]);

  const state = {
    profile: profile0,
    pantry: pantry0,
    staples: store.get('staples', true),
    water: store.get(todayKey(), 0),
    category: 'All',
    cuisine: 'All',
    search: '',
    onlyReady: false,
    onlyVeg: false,
    onlySimple: false,
    level: 'All',
    sort: 'match'
  };
  store.set('pantry', state.pantry);

  /* ================= Helpers ================= */
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmtNum = (n, digits = 1) => Number(n).toLocaleString('en-US', { maximumFractionDigits: digits });

  // Lower-case and fold Azerbaijani/Turkish letters so "sogan" matches "soğan", "borek" matches "börek"
  const norm = s => String(s).trim().toLocaleLowerCase('en')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/ə/g, 'e').replace(/ı/g, 'i').replace(/\s+/g, ' ');

  const lookup = new Map();
  INGREDIENTS.forEach(i => [i.name, i.id.replace(/_/g, ' '), ...i.aliases].forEach(n => {
    const k = norm(n);
    if (!lookup.has(k)) lookup.set(k, i.id);
  }));

  function findIngredient(text) {
    let q = norm(text);
    if (!q) return null;
    if (lookup.has(q)) return lookup.get(q);
    if (q.endsWith('s') && lookup.has(q.slice(0, -1))) return lookup.get(q.slice(0, -1));
    // Shortest name starting with the text ("tom" → tomatoes), else longest name inside it ("fresh chicken breast" → chicken)
    let prefix = null, prefixLen = Infinity, inner = null, innerLen = 0;
    for (const [k, id] of lookup) {
      if (q.length >= 3 && k.startsWith(q) && k.length < prefixLen) { prefix = id; prefixLen = k.length; }
      if (k.length >= 3 && q.includes(k) && k.length > innerLen) { inner = id; innerLen = k.length; }
    }
    return prefix || inner;
  }

  const UNIT_LABEL = { g: 'g', kg: 'kg', ml: 'ml', l: 'L', pcs: 'pcs' };

  // Converts the user's amount into the ingredient's base unit (g, ml or pcs); null if unknown
  function toBase(ing, qty, unit) {
    if (qty == null || !(qty > 0)) return null;
    const grams = { g: 1, kg: 1000, ml: 1, l: 1000 }[unit];
    if (ing.unit === 'pcs') {
      if (unit === 'pcs') return qty;
      return ing.piece ? (qty * grams) / ing.piece : null;
    }
    if (unit === 'pcs') return ing.piece ? qty * ing.piece : null;
    return qty * grams;
  }

  function fmtQty(ing, value) {
    if (value == null || ['salt', 'pepper', 'spices'].includes(ing.id)) return 'to taste';
    if (ing.unit === 'pcs') {
      const v = Math.max(0.5, Math.round(value * 2) / 2);
      const [one, many] = ing.label || ['pc', 'pcs'];
      return `${fmtNum(v)} ${v <= 1 ? one : many}`;
    }
    const big = ing.unit === 'ml' ? 'L' : 'kg';
    const small = ing.unit === 'ml' ? 'ml' : 'g';
    if (value >= 1000) return `${fmtNum(value / 1000)} ${big}`;
    const r = value >= 50 ? Math.round(value / 5) * 5 : Math.max(1, Math.round(value));
    return `${r} ${small}`;
  }

  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove('show'), 2200);
  }

  /* ================= Health calculations ================= */
  const ACTIVITY = {
    sedentary: { water: 0, factor: 1.2, label: 'Sedentary' },
    light: { water: 350, factor: 1.375, label: 'Light' },
    moderate: { water: 500, factor: 1.55, label: 'Moderate' },
    active: { water: 750, factor: 1.725, label: 'Active' },
    athlete: { water: 1000, factor: 1.9, label: 'Very active' }
  };

  const WEATHER = {
    cold: { emoji: '❄️', label: 'Cold', range: 'below 10 °C', water: 0 },
    mild: { emoji: '🌤️', label: 'Mild', range: '10–24 °C', water: 0 },
    warm: { emoji: '☀️', label: 'Warm', range: '25–30 °C', water: 300 },
    hot: { emoji: '🔥', label: 'Hot', range: 'above 30 °C', water: 600 }
  };
  const weatherExtra = w => w.water ? `+${w.water} ml / day` : 'no extra water';

  function calc(p) {
    const act = ACTIVITY[p.activity] || ACTIVITY.light;
    const weather = WEATHER[p.climate] || WEATHER.mild;
    let water = p.weight * 33 + act.water + weather.water;
    if (p.sex === 'female' && p.pregnancy === 'pregnant') water += 300;
    if (p.sex === 'female' && p.pregnancy === 'breastfeeding') water += 700;
    water = Math.max(1500, Math.round(water / 50) * 50);

    const h = p.height / 100;
    const bmi = p.weight / (h * h);
    const bmiCat = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Healthy' : bmi < 30 ? 'Overweight' : 'Obese';
    const bmr = 10 * p.weight + 6.25 * p.height - 5 * p.age + (p.sex === 'male' ? 5 : -161);
    const pregnant = p.sex === 'female' && p.pregnancy === 'pregnant';
    const nursing = p.sex === 'female' && p.pregnancy === 'breastfeeding';
    const kcal = Math.round((bmr * act.factor + (pregnant ? 300 : nursing ? 450 : 0)) / 10) * 10;
    // Protein 0.8–1.6 g per kg depending on activity; fat ≈ 30% of calories; carbs the rest
    const perKg = { sedentary: 0.8, light: 1.0, moderate: 1.2, active: 1.4, athlete: 1.6 }[p.activity] || 1;
    const protein = Math.round(p.weight * perKg + (pregnant ? 25 : nursing ? 20 : 0));
    const fat = Math.round(kcal * 0.3 / 9);
    const carbs = Math.round((kcal - protein * 4 - fat * 9) / 4);
    return { water, bmi, bmiCat, kcal, protein, fat, carbs, idealMin: 18.5 * h * h, idealMax: 24.9 * h * h, act, weather };
  }

  /* ================= Profile / onboarding ================= */
  const form = $('#profile-form');

  $('#weather-options').innerHTML = Object.entries(WEATHER).map(([key, w]) => `
    <label class="weather-option">
      <input type="radio" name="climate" value="${key}" ${key === 'mild' ? 'checked' : ''}>
      <span class="wo-card">
        <span class="wo-emoji">${w.emoji}</span>
        <strong>${w.label}</strong>
        <span class="wo-range">${w.range}</span>
        <span class="wo-extra">${weatherExtra(w)}</span>
      </span>
    </label>`).join('');

  function showOnboarding(editing) {
    $('#app').hidden = true;
    $('#onboarding').hidden = false;
    $('#profile-cancel').hidden = !editing;
    $('#onb-title').textContent = editing ? 'Update your profile' : 'Welcome! Tell us a little about yourself';
    $('#profile-error').textContent = '';
    if (state.profile) {
      const p = state.profile;
      form.name.value = p.name || '';
      form.age.value = p.age; form.weight.value = p.weight; form.height.value = p.height;
      form.activity.value = p.activity;
      form.pregnancy.value = p.pregnancy || 'none';
      $$('input[name="sex"]', form).forEach(r => { r.checked = r.value === p.sex; });
      $$('input[name="climate"]', form).forEach(r => { r.checked = r.value === p.climate; });
    }
    syncPregnancy();
    (editing ? form.weight : form.name).focus();
  }

  function syncPregnancy() {
    $('#pregnancy-field').hidden = form.querySelector('input[name="sex"]:checked').value !== 'female';
  }
  $$('input[name="sex"]', form).forEach(r => r.addEventListener('change', syncPregnancy));

  form.addEventListener('submit', e => {
    e.preventDefault();
    const p = {
      name: form.name.value.trim(),
      sex: form.querySelector('input[name="sex"]:checked').value,
      age: Number(form.age.value),
      weight: Number(form.weight.value),
      height: Number(form.height.value),
      activity: form.activity.value,
      climate: form.querySelector('input[name="climate"]:checked').value,
      pregnancy: form.pregnancy.value
    };
    const err = !(p.age >= 10 && p.age <= 110) ? 'Please enter a valid age (10–110).'
      : !(p.weight >= 25 && p.weight <= 300) ? 'Please enter your weight in kilograms (25–300).'
      : !(p.height >= 100 && p.height <= 250) ? 'Please enter your height in centimetres (100–250).'
      : '';
    if (err) { $('#profile-error').textContent = err; return; }
    const first = !state.profile;
    state.profile = p;
    store.set('profile', p);
    showApp();
    setTab('health');
    if (first) toast(`Your daily water goal: ${fmtNum(calc(p).water / 1000)} litres 💧`);
    if (first) showWelcome(p.name);
  });

  $('#profile-cancel').addEventListener('click', showApp);
  $('#edit-profile').addEventListener('click', () => showOnboarding(true));

  function showApp() {
    $('#onboarding').hidden = true;
    $('#app').hidden = false;
  }

  /* ================= Tabs ================= */
  const TABS = ['health', 'pantry', 'recipes', 'meals'];
  function setTab(name, push = true) {
    if (!TABS.includes(name)) name = 'health';
    $$('.tab').forEach(t => t.setAttribute('aria-selected', String(t.dataset.tab === name)));
    TABS.forEach(t => { $('#tab-' + t).hidden = t !== name; });
    if (name === 'recipes') renderRecipes();
    if (name === 'meals') renderMeals();
    if (name === 'health') renderHealth();
    if (push && location.hash !== '#' + name) history.pushState(null, '', '#' + name);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  $$('.tab').forEach(t => t.addEventListener('click', () => setTab(t.dataset.tab)));
  document.addEventListener('click', e => {
    const g = e.target.closest('[data-goto]');
    if (g) setTab(g.dataset.goto);
  });
  window.addEventListener('popstate', () => setTab(location.hash.slice(1), false));

  /* ================= Theme ================= */
  function applyTheme(t) {
    if (t) document.documentElement.dataset.theme = t;
    else delete document.documentElement.dataset.theme;
  }
  applyTheme(store.get('theme', null));
  $('#theme-toggle').addEventListener('click', () => {
    const current = document.documentElement.dataset.theme
      || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    store.set('theme', next);
  });

  /* ================= Water & health ================= */
  const RING_LEN = 2 * Math.PI * 52;
  $('#ring-fg').style.strokeDasharray = RING_LEN;

  function renderHealth() {
    const p = state.profile;
    if (!p) return;
    const c = calc(p);
    const hour = new Date().getHours();
    const hello = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    $('#greeting').textContent = `${hello}${p.name ? ', ' + p.name : ''} 👋`;
    $('#today-eyebrow').textContent = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

    // Re-read so the counter resets automatically on a new day
    state.water = store.get(todayKey(), 0);
    const drunk = state.water;
    const pct = Math.min(1, drunk / c.water);
    $('#ring-fg').style.strokeDashoffset = RING_LEN * (1 - pct);
    $('#water-ring').classList.toggle('done', pct >= 1);
    $('#water-drunk').textContent = fmtNum(drunk, 0);
    $('#water-of').textContent = `/ ${fmtNum(c.water, 0)} ml`;
    $('#water-goal-chip').textContent = `💧 ${fmtNum(c.water / 1000)} L / day`;
    $('#water-ring').setAttribute('aria-label', `${drunk} ml of ${c.water} ml drunk`);

    const left = c.water - drunk;
    const glassesTotal = Math.ceil(c.water / 250);
    $('#water-hint').innerHTML = left > 0
      ? `<b>${fmtNum(left, 0)} ml</b> to go — about <b>${Math.ceil(left / 250)} glasses</b>.`
      : '🎉 You reached today\'s water goal. Well done!';

    $('#glasses').innerHTML = Array.from({ length: glassesTotal }, (_, i) =>
      `<span class="${i < Math.floor(drunk / 250) ? 'full' : ''}">💧</span>`).join('');

    $('#weather-mini').innerHTML = Object.entries(WEATHER).map(([key, w]) =>
      `<button type="button" role="radio" aria-checked="${key === p.climate}" data-weather="${key}" title="${w.label} (${w.range}) — ${weatherExtra(w)}">${w.emoji} ${w.label}</button>`).join('');

    $('#stats').innerHTML = `
      <div><dt>Water goal</dt><dd>${fmtNum(c.water / 1000)} L<small>≈ ${glassesTotal} glasses · ${c.weather.emoji} ${c.weather.label.toLowerCase()} weather</small></dd></div>
      <div><dt>Body mass index</dt><dd>${fmtNum(c.bmi)}<small>${c.bmiCat}</small></dd></div>
      <div><dt>Daily calories</dt><dd>${fmtNum(c.kcal, 0)} kcal<small>Activity: ${c.act.label}</small></dd></div>
      <div><dt>Healthy weight range</dt><dd>${fmtNum(c.idealMin, 0)}–${fmtNum(c.idealMax, 0)} kg<small>For your height</small></dd></div>
      <div><dt>Daily protein</dt><dd>${c.protein} g<small>Keeps you full &amp; strong</small></dd></div>
      <div><dt>Daily fat · carbs</dt><dd>${c.fat} g · ${c.carbs} g<small>≈ 30% fat, rest carbs</small></dd></div>`;

    // Glasses spread evenly between 08:00 and 22:00
    const n = glassesTotal;
    const start = 8 * 60, end = 22 * 60;
    const step = n > 1 ? (end - start) / (n - 1) : 0;
    const nowMin = new Date().getHours() * 60 + new Date().getMinutes();
    let nextMarked = false;
    $('#schedule').innerHTML = Array.from({ length: n }, (_, i) => {
      const m = Math.round(start + i * step);
      const time = `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
      let cls = '';
      if (i < Math.floor(drunk / 250)) cls = 'past';
      else if (!nextMarked) { cls = 'next'; nextMarked = true; }
      const late = cls === 'next' && m < nowMin ? ' ⏰' : '';
      return `<li class="${cls}"><span>${time}${late}</span><span>🥛 250 ml</span></li>`;
    }).join('');
  }

  $('#weather-mini').addEventListener('click', e => {
    const b = e.target.closest('[data-weather]');
    if (!b || b.dataset.weather === state.profile.climate) return;
    const before = calc(state.profile).water;
    state.profile.climate = b.dataset.weather;
    store.set('profile', state.profile);
    renderHealth();
    const diff = calc(state.profile).water - before;
    toast(diff ? `Water goal ${diff > 0 ? 'increased' : 'decreased'} by ${Math.abs(diff)} ml` : 'Water goal unchanged');
  });

  function addWater(ml) {
    state.water = Math.max(0, store.get(todayKey(), 0) + ml);
    store.set(todayKey(), state.water);
    renderHealth();
    const goal = calc(state.profile).water;
    if (ml > 0 && state.water >= goal && state.water - ml < goal) toast('🎉 Daily water goal reached!');
  }
  $$('[data-water]').forEach(b => b.addEventListener('click', () => addWater(Number(b.dataset.water))));
  $('#water-reset').addEventListener('click', () => {
    if (confirm('Reset today\'s water counter?')) { store.set(todayKey(), 0); renderHealth(); }
  });

  /* ================= My kitchen ================= */
  const nameInput = $('#ing-name'), qtyInput = $('#ing-qty'), unitSelect = $('#ing-unit');

  $('#ing-list').innerHTML = INGREDIENTS.filter(i => !i.staple)
    .map(i => `<option value="${esc(i.name)}"></option>`).join('');

  const QUICK = ['chicken', 'ground_meat', 'sausage', 'egg', 'instant_noodles', 'pelmeni', 'bread', 'onion', 'garlic', 'potato', 'tomato', 'cucumber',
    'carrot', 'bell_pepper', 'rice', 'pasta', 'buckwheat', 'flour', 'milk', 'yogurt', 'cheese', 'butter', 'ketchup', 'herbs'];

  function renderQuick() {
    const have = new Set(state.pantry.map(p => p.id));
    $('#quick-list').innerHTML = QUICK.map(id =>
      `<button type="button" data-quick="${id}" class="${have.has(id) ? 'added' : ''}">${ING[id].emoji} ${esc(ING[id].name)}</button>`).join('');
  }

  $('#quick-list').addEventListener('click', e => {
    const b = e.target.closest('[data-quick]');
    if (!b) return;
    const ing = ING[b.dataset.quick];
    nameInput.value = ing.name;
    unitSelect.value = ing.unit;
    qtyInput.value = '';
    qtyInput.focus();
  });

  nameInput.addEventListener('change', () => {
    const id = findIngredient(nameInput.value);
    if (id) unitSelect.value = ING[id].unit;
  });

  $('#add-form').addEventListener('submit', e => {
    e.preventDefault();
    const raw = nameInput.value.trim();
    const err = $('#add-error');
    if (!raw) { err.textContent = 'Please type an ingredient.'; return; }
    const qty = qtyInput.value === '' ? null : Number(qtyInput.value);
    if (qty != null && !(qty > 0)) { err.textContent = 'The amount must be a positive number.'; return; }
    err.textContent = '';

    const id = findIngredient(raw);
    const unit = unitSelect.value;
    const existing = id && state.pantry.find(p => p.id === id);

    if (existing) {
      // Adding the same ingredient again sums the amounts when possible
      const a = toBase(ING[id], existing.qty, existing.unit);
      const b = toBase(ING[id], qty, unit);
      if (a != null && b != null) {
        existing.qty = a + b;
        existing.unit = ING[id].unit;
      } else {
        existing.qty = qty; existing.unit = unit;
      }
      toast(`${ING[id].name} updated`);
    } else {
      state.pantry.push({ key: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), id, name: id ? ING[id].name : raw, qty, unit });
      toast(id ? `${ING[id].emoji} ${ING[id].name} added` : `“${raw}” added (not recognised in recipes)`);
    }
    savePantry();
    nameInput.value = ''; qtyInput.value = '';
    nameInput.focus();
  });

  function fmtPantryAmount(item) {
    if (item.qty == null) return 'amount not set';
    if (item.id) {
      const ing = ING[item.id];
      if (item.unit === ing.unit) return fmtQty({ ...ing, id: '' }, item.qty);
    }
    return `${fmtNum(item.qty)} ${UNIT_LABEL[item.unit]}`;
  }

  function renderPantry() {
    $('#pantry-list').innerHTML = state.pantry.map(item => {
      const ing = item.id && ING[item.id];
      return `<li>
        <span class="emoji">${ing ? ing.emoji : '❔'}</span>
        <div class="info">
          <div class="name">${esc(item.name)}</div>
          <div class="amount">${esc(fmtPantryAmount(item))}</div>
          ${ing ? '' : '<div class="unknown">Not used in any recipe</div>'}
        </div>
        <button class="remove" data-remove="${item.key}" aria-label="Remove ${esc(item.name)}" title="Remove">✕</button>
      </li>`;
    }).join('');
    const n = state.pantry.length;
    $('#pantry-empty').hidden = n > 0;
    $('#pantry-clear').hidden = n === 0;
    const badge = $('#pantry-count');
    badge.hidden = n === 0;
    badge.textContent = n;
    const ready = n ? RECIPES.map(r => evaluate(r)).filter(e => e.relevant && e.ready).length : 0;
    $('#pantry-cta-title').textContent = n ? `You can cook ${ready} recipe${ready === 1 ? '' : 's'} right now` : 'Browse recipes';
    $('#pantry-cta-text').textContent = n
      ? 'For the others, we show exactly which ingredients are missing.'
      : `You can browse all ${RECIPES.length} recipes even without adding ingredients.`;
    renderQuick();
  }

  $('#pantry-list').addEventListener('click', e => {
    const b = e.target.closest('[data-remove]');
    if (!b) return;
    state.pantry = state.pantry.filter(p => p.key !== b.dataset.remove);
    savePantry();
  });
  $('#pantry-clear').addEventListener('click', () => {
    if (confirm('Remove all ingredients?')) { state.pantry = []; savePantry(); }
  });

  const staplesToggle = $('#staples-toggle');
  staplesToggle.checked = state.staples;
  staplesToggle.addEventListener('change', () => {
    state.staples = staplesToggle.checked;
    store.set('staples', state.staples);
    renderPantry();
  });

  function savePantry() {
    store.set('pantry', state.pantry);
    renderPantry();
  }

  /* ================= Recipe matching ================= */
  function pantryMap() {
    const m = new Map();
    state.pantry.forEach(p => { if (p.id) m.set(p.id, toBase(ING[p.id], p.qty, p.unit)); });
    return m;
  }

  // Status per ingredient: staple | ok | partial | missing | opt-missing
  function evaluate(recipe, servings = recipe.servings) {
    const have = pantryMap();
    const factor = servings / recipe.servings;
    let relevant = false;
    const rows = recipe.ingredients.map(ri => {
      const ing = ING[ri.id];
      const need = ri.qty == null ? null : ri.qty * factor;
      let status, haveQty = null;
      if (have.has(ri.id)) {
        haveQty = have.get(ri.id);
        status = haveQty == null || need == null || haveQty >= need * 0.95 ? 'ok' : 'partial';
        if (!ing.staple) relevant = true;
      } else if (ing.staple && state.staples) {
        status = 'staple';
      } else {
        status = ri.opt ? 'opt-missing' : 'missing';
      }
      return { ri, ing, need, status, haveQty };
    });

    const required = rows.filter(r => !r.ri.opt && r.status !== 'staple');
    const matched = required.filter(r => r.status === 'ok' || r.status === 'partial');
    const missing = required.filter(r => r.status === 'missing');
    const optHave = rows.filter(r => r.ri.opt && r.status === 'ok').length;

    // How many servings the available amounts are enough for
    let maxServings = null;
    required.forEach(r => {
      if (r.haveQty == null || r.ri.qty == null || r.status === 'missing') return;
      const s = r.haveQty / (r.ri.qty / recipe.servings);
      maxServings = maxServings == null ? s : Math.min(maxServings, s);
    });

    return {
      recipe, rows, required, matched, missing, optHave, maxServings, relevant,
      ratio: required.length ? matched.length / required.length : 1,
      ready: missing.length === 0
    };
  }

  const CATEGORY_ORDER = ['Main', 'Soup', 'Salad', 'Side', 'Snack', 'Breakfast', 'Dessert', 'Drink'];
  const CATEGORIES = ['All', ...CATEGORY_ORDER.filter(c => RECIPES.some(r => r.category === c))];
  const CUISINES = [...new Set(RECIPES.map(r => r.cuisine))].sort();
  $('#recipes-sub').textContent = `${RECIPES.length} dishes from ${CUISINES.length} cuisines, each with a photo, video and nutrition.`;

  $('#category-chips').innerHTML = CATEGORIES.map(c => {
    const n = c === 'All' ? RECIPES.length : RECIPES.filter(r => r.category === c).length;
    return `<button type="button" data-cat="${esc(c)}" aria-pressed="${c === state.category}">${esc(c)} <span class="count">${n}</span></button>`;
  }).join('');
  $('#cuisine-filter').innerHTML = `<option value="All">🌍 All cuisines</option>` +
    CUISINES.map(c => `<option value="${esc(c)}">${esc(c)} (${RECIPES.filter(r => r.cuisine === c).length})</option>`).join('');

  $('#category-chips').addEventListener('click', e => {
    const b = e.target.closest('[data-cat]');
    if (!b) return;
    state.category = b.dataset.cat;
    $$('#category-chips button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    renderRecipes();
  });
  $('#cuisine-filter').addEventListener('change', e => { state.cuisine = e.target.value; renderRecipes(); });
  $('#recipe-search').addEventListener('input', e => { state.search = e.target.value; renderRecipes(); });
  $('#only-ready').addEventListener('change', e => { state.onlyReady = e.target.checked; renderRecipes(); });
  $('#only-veg').addEventListener('change', e => { state.onlyVeg = e.target.checked; renderRecipes(); });
  $('#only-simple').addEventListener('change', e => { state.onlySimple = e.target.checked; renderRecipes(); });
  $('#level-filter').addEventListener('change', e => { state.level = e.target.value; renderRecipes(); });
  $('#sort-by').addEventListener('change', e => { state.sort = e.target.value; renderRecipes(); });

  const LEVEL = { Easy: 1, Medium: 2, Hard: 3 };
  const LEVEL_ICON = { Easy: '🟢', Medium: '🟡', Hard: '🔴' };
  const hasEnglish = r => norm(r.native) !== norm(r.name);

  function renderRecipes() {
    const hasPantry = state.pantry.some(p => p.id);
    const q = norm(state.search);
    const list = RECIPES.map(r => evaluate(r))
      .filter(e => !hasPantry || e.relevant || q)
      .filter(e => state.category === 'All' || e.recipe.category === state.category)
      .filter(e => state.cuisine === 'All' || e.recipe.cuisine === state.cuisine)
      .filter(e => !state.onlyVeg || e.recipe.vegetarian)
      .filter(e => !state.onlySimple || e.recipe.simple)
      .filter(e => state.level === 'All' || e.recipe.difficulty === state.level)
      .filter(e => !q || norm(e.recipe.name).includes(q) || norm(e.recipe.native).includes(q) || norm(e.recipe.cuisine).includes(q)
        || e.recipe.ingredients.some(i => norm(ING[i.id].name).includes(q)))
      .filter(e => !state.onlyReady || (hasPantry && e.ready));

    const SORTS = {
      easy: (a, b) => LEVEL[a.recipe.difficulty] - LEVEL[b.recipe.difficulty] || a.recipe.time - b.recipe.time,
      hard: (a, b) => LEVEL[b.recipe.difficulty] - LEVEL[a.recipe.difficulty] || b.recipe.time - a.recipe.time,
      quick: (a, b) => a.recipe.time - b.recipe.time,
      protein: (a, b) => b.recipe.protein - a.recipe.protein,
      light: (a, b) => a.recipe.kcal - b.recipe.kcal
    };
    if (SORTS[state.sort]) {
      list.sort(SORTS[state.sort]);
    } else if (hasPantry) {
      list.sort((a, b) => (b.ready - a.ready) || (b.ratio - a.ratio) || (a.missing.length - b.missing.length)
        || (b.optHave - a.optHave) || (a.recipe.time - b.recipe.time));
    } else {
      list.sort((a, b) => a.recipe.name.localeCompare(b.recipe.name, 'en'));
    }

    const readyCount = list.filter(e => e.ready).length;
    $('#recipe-summary').textContent = hasPantry
      ? `${list.length} recipes use your ingredients — you can cook ${readyCount} of them right now.`
      : `${list.length} recipes. Add your ingredients in “My kitchen” and the best matches will come first.`;

    $('#recipe-grid').innerHTML = list.map(e => cardHtml(e, hasPantry)).join('');
    $('#recipe-empty').hidden = list.length > 0;
  }

  function mediaHtml(r, cls, extra = '') {
    const img = IMAGES[r.id];
    return `<div class="${cls}${img ? '' : ' noimg'}">
      ${img ? `<img src="${esc(img.src)}" alt="${esc(r.name)}" loading="lazy" decoding="async">` : ''}
      <span class="media-emoji" aria-hidden="true">${r.emoji}</span>${extra}
    </div>`;
  }

  // Original name, with an "EN" button that reveals the English name
  function nameHtml(r, tag) {
    const en = hasEnglish(r);
    return `<${tag} class="dish-name"${tag === 'h2' ? ' id="dlg-title"' : ''}><span dir="auto" title="${esc(r.name)}">${esc(r.native)}</span>${en
      ? '<span class="en-btn" role="button" tabindex="0" data-en aria-label="Show the English name" title="Show the English name">EN</span>' : ''}</${tag}>
      ${en ? `<p class="en-name" hidden>🇬🇧 ${esc(r.name)}</p>` : ''}`;
  }

  function toggleEnglish(btn) {
    const box = btn.closest('.recipe-body, .dialog-inner');
    const p = box && box.querySelector('.en-name');
    if (!p) return;
    p.hidden = !p.hidden;
    btn.classList.toggle('on', !p.hidden);
  }
  document.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-en]')) { e.preventDefault(); e.stopPropagation(); toggleEnglish(e.target); }
  }, true);

  function cardHtml(e, hasPantry) {
    const r = e.recipe;
    let match = '';
    if (hasPantry) {
      const pct = Math.round(e.ratio * 100);
      const label = e.ready ? '✅ You have everything' : `${e.matched.length}/${e.required.length} main ingredients`;
      const portion = e.ready && e.maxServings != null && e.maxServings < r.servings
        ? `<p class="missing">⚖️ Your amounts make ~${fmtNum(Math.max(e.maxServings, 0.5))} serving${e.maxServings > 1.05 ? 's' : ''}</p>` : '';
      match = `<div class="match">
          <div class="match-label"><span>${label}</span><span>${pct}%</span></div>
          <div class="bar"><i class="${e.ready ? 'full' : ''}" style="width:${pct}%"></i></div>
        </div>
        ${e.missing.length ? `<p class="missing">Missing: <b>${e.missing.map(m => esc(m.ing.name)).join(', ')}</b></p>` : ''}
        ${portion}`;
    }
    const badges = `<div class="media-badges">
        <span class="mb">⏱ ${r.time} min</span>
        <span class="mb">${LEVEL_ICON[r.difficulty]} ${r.difficulty}</span>
      </div>${hasPantry && e.ready ? '<span class="ready-ribbon">✅ Ready to cook</span>' : ''}
      ${r.vegetarian || r.simple ? `<div class="media-tags">${r.vegetarian ? '<span class="mt veg">🌱 Veg</span>' : ''}${r.simple ? '<span class="mt quick">🎓 Quick</span>' : ''}</div>` : ''}`;
    return `<button class="recipe" data-recipe="${r.id}">
      ${mediaHtml(r, 'recipe-media', badges)}
      <div class="recipe-body">
        <div class="recipe-kicker">${esc(r.cuisine)} · ${esc(r.category)}</div>
        ${nameHtml(r, 'h4')}
        <div class="nutri-line">
          <span>🔥 <b>${r.kcal}</b> kcal</span><span>💪 <b>${r.protein}</b> g protein</span><span>🍽 ${r.servings} servings</span>
        </div>
        ${match}
      </div>
    </button>`;
  }

  // Hide broken photos and fall back to the emoji
  document.addEventListener('error', e => {
    if (e.target.tagName === 'IMG' && e.target.parentElement) {
      e.target.parentElement.classList.add('noimg');
      e.target.remove();
    }
  }, true);

  /* ================= Recipe dialog ================= */
  const dialog = $('#recipe-dialog');
  let current = null;

  const videoUrl = r => {
    const dish = r.name.replace(/\s*\(.*?\)\s*/g, ' ').trim();
    const local = ['Azerbaijani', 'Turkish', 'Georgian', 'Russian'].includes(r.cuisine) ? ` ${r.cuisine}` : '';
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(`${dish}${local} recipe`)}`;
  };

  function openRecipe(id) {
    const recipe = RECIPES.find(r => r.id === id);
    if (!recipe) return;
    current = { recipe, servings: recipe.servings };
    renderDialog();
    dialog.showModal();
    dialog.scrollTop = 0;
  }

  $('#recipe-grid').addEventListener('click', e => {
    const en = e.target.closest('[data-en]');
    if (en) { toggleEnglish(en); return; }
    const b = e.target.closest('[data-recipe]');
    if (b) openRecipe(b.dataset.recipe);
  });

  dialog.addEventListener('click', e => {
    if (e.target === dialog) { dialog.close(); return; }
    const en = e.target.closest('[data-en]');
    if (en) { toggleEnglish(en); return; }
    const act = e.target.closest('[data-act]');
    if (!act) return;
    const a = act.dataset.act;
    if (a === 'close') { dialog.close(); return; }
    if (a === 'step') { act.classList.toggle('done'); return; }
    if (a === 'log') {
      const meal = $('#log-meal', dialog).value, qty = Number($('#log-qty', dialog).value);
      const problem = logFood(meal, { kind: 'recipe', item: current.recipe }, qty, 'serving');
      if (problem) { toast(problem); return; }
      toast(`${current.recipe.emoji} Logged as ${MEALS[meal].label.toLowerCase()}`);
      if (!$('#tab-meals').hidden) renderMeals();
      return;
    }
    if (a === 'minus') current.servings = Math.max(1, current.servings - 1);
    if (a === 'plus') current.servings = Math.min(20, current.servings + 1);
    if (a === 'fit') current.servings = Math.max(1, Math.floor(evaluate(current.recipe).maxServings));
    renderDialog();
  });

  function renderDialog() {
    const { recipe: r, servings } = current;
    const e = evaluate(r, servings);
    const hasPantry = state.pantry.some(p => p.id);
    const base = evaluate(r);
    const img = IMAGES[r.id];
    const daily = targets();

    const icon = { ok: '✅', partial: '⚠️', missing: '❌', 'opt-missing': '➖', staple: '🏠' };
    const items = e.rows.map(row => {
      const cls = row.status === 'missing' ? 'missing-row' : row.status === 'partial' ? 'partial-row' : '';
      let note = '';
      if (row.status === 'partial') note = `You have ${fmtQty({ ...row.ing, id: '' }, row.haveQty)}`;
      if (row.status === 'missing') note = 'Not in your kitchen';
      if (row.status === 'staple') note = 'Pantry staple';
      return `<li class="${cls}">
        <span class="st">${hasPantry || row.status === 'staple' ? icon[row.status] : row.ing.emoji}</span>
        <span>${esc(row.ing.name)}${row.ri.opt ? ' <span class="opt">(optional)</span>' : ''}
          ${note && hasPantry ? `<span class="note">${note}</span>` : ''}</span>
        <span class="q">${fmtQty(row.ing, row.need)}</span>
      </li>`;
    }).join('');

    let fit = '';
    if (hasPantry && base.ready && base.maxServings != null) {
      const ms = base.maxServings;
      fit = ms >= 1
        ? `<p class="fit-note">⚖️ Your ingredients are enough for about <b>${fmtNum(ms)}</b> servings.
            ${Math.floor(ms) !== servings ? `<button class="btn btn-ghost btn-sm" data-act="fit">Scale to ${Math.floor(ms)}</button>` : ''}</p>`
        : `<p class="fit-note">⚖️ Your amounts make less than 1 serving — you'll need a bit more of some ingredients.</p>`;
    }

    $('#dialog-content').innerHTML = `
      <div class="dlg-hero">
        ${mediaHtml(r, 'dlg-media')}
        <button class="icon-btn dlg-close" data-act="close" aria-label="Close">✕</button>
      </div>
      ${img ? `<p class="credit">Photo: ${esc(img.author)}${img.license ? ', ' + esc(img.license) : ''} · <a href="${esc(img.source)}" target="_blank" rel="noopener">Wikimedia Commons</a></p>` : ''}
      <div class="dialog-inner">
        ${nameHtml(r, 'h2')}
        <div class="meta">
          <span class="chip">${esc(r.category)}</span>
          <span class="chip">${esc(r.cuisine)}</span>
          ${r.vegetarian ? '<span class="chip veg">🌱 Vegetarian</span>' : ''}
          ${r.simple ? '<span class="chip quick">🎓 Student-friendly</span>' : ''}
          <span class="chip">⏱ ${r.time} min</span>
          <span class="chip">${LEVEL_ICON[r.difficulty]} ${r.difficulty}</span>
        </div>

        <div class="nutri-panel">
          <div class="np-title">Nutrition per serving <span class="muted small">(approx., without optional extras)</span></div>
          <div class="np-grid">
            ${[['🔥', 'Calories', r.kcal, 'kcal', 'kcal'], ['💪', 'Protein', r.protein, 'g', 'protein'], ['🧈', 'Fat', r.fat, 'g', 'fat'], ['🍞', 'Carbs', r.carbs, 'g', 'carbs']]
              .map(([i, l, v, u, k]) => `<div><span>${i} ${l}</span><b>${v} ${u}</b><small>${Math.round(v / daily[k] * 100)}% of your day</small></div>`).join('')}
          </div>
          <div class="log-row">
            <span>Ate this?</span>
            <select id="log-meal" aria-label="Meal">${Object.entries(MEALS).map(([k, M]) => `<option value="${k}" ${k === defaultMealType() ? 'selected' : ''}>${M.emoji} ${M.label}</option>`).join('')}</select>
            <input id="log-qty" type="number" min="0.5" step="0.5" value="1" aria-label="Servings eaten">
            <span class="muted small">serving(s)</span>
            <button class="btn btn-primary btn-sm" data-act="log">🍽️ Log it</button>
          </div>
        </div>

        <a class="video-btn" href="${videoUrl(r)}" target="_blank" rel="noopener">
          <span class="play">▶</span>
          <span><strong>Watch video recipes</strong><small>Opens YouTube with step-by-step videos for this dish</small></span>
        </a>

        <div class="servings">
          <strong>Servings:</strong>
          <div class="stepper">
            <button data-act="minus" aria-label="Fewer servings">−</button>
            <output aria-live="polite">${servings}</output>
            <button data-act="plus" aria-label="More servings">+</button>
          </div>
        </div>
        ${fit}

        <h3>Ingredients</h3>
        <ul class="ing-list">${items}</ul>

        <h3>Method</h3>
        <p class="muted small">Tap a step when you've finished it.</p>
        <ol class="steps">${r.steps.map(s => `<li data-act="step"><span>${esc(s)}</span></li>`).join('')}</ol>
      </div>`;
  }

  const CONFIG = window.APP_CONFIG || {};

  const fmtDate = (d, opts = { weekday: 'short', day: 'numeric', month: 'short' }) => d.toLocaleDateString('en-GB', opts);

  /* ================= Nutrition targets ================= */
  const MEALS = {
    breakfast: { emoji: '🌅', label: 'Breakfast', share: 0.25, by: 11 },
    lunch: { emoji: '☀️', label: 'Lunch', share: 0.35, by: 16 },
    dinner: { emoji: '🌙', label: 'Dinner', share: 0.30, by: 21 },
    snack: { emoji: '🍎', label: 'Snacks', share: 0.10 }
  };
  const MAIN_MEALS = ['breakfast', 'lunch', 'dinner'];

  function targets() {
    const c = calc(state.profile);
    return { kcal: c.kcal, protein: c.protein, fat: c.fat, carbs: c.carbs };
  }

  const defaultMealType = () => {
    const h = new Date().getHours();
    return h < 11 ? 'breakfast' : h < 16 ? 'lunch' : h < 18 ? 'snack' : h < 23 ? 'dinner' : 'snack';
  };

  /* ================= Meal log ================= */
  const mealsKey = key => 'meals.' + key;
  const getMeals = key => store.get(mealsKey(key), []);
  const setMeals = (key, list) => store.set(mealsKey(key), list);

  const RECIPE_BY_NAME = new Map([...RECIPES.map(r => [norm(r.native), r]), ...RECIPES.map(r => [norm(r.name), r])]);
  $('#food-list').innerHTML =
    RECIPES.map(r => `<option value="${esc(r.name)}">${hasEnglish(r) ? esc(r.native) + ' · ' : ''}Recipe · ${r.kcal} kcal / serving</option>`).join('') +
    INGREDIENTS.filter(i => !i.staple).map(i => `<option value="${esc(i.name)}">Food</option>`).join('');

  function findFood(text) {
    const q = norm(text);
    if (!q) return null;
    if (RECIPE_BY_NAME.has(q)) return { kind: 'recipe', item: RECIPE_BY_NAME.get(q) };
    const ingId = findIngredient(text);
    if (ingId && !ING[ingId].staple) return { kind: 'ingredient', item: ING[ingId] };
    const r = RECIPES.find(x => norm(x.name).startsWith(q)) || (q.length >= 4 && RECIPES.find(x => norm(x.name).includes(q)));
    return r ? { kind: 'recipe', item: r } : null;
  }

  // Nutrition of one logged amount → { kcal, protein, fat, carbs } or an error message
  function foodNutrition(food, qty, unit) {
    if (!(qty > 0)) return { error: 'Enter an amount.' };
    if (food.kind === 'recipe') {
      const r = food.item;
      return { kcal: r.kcal * qty, protein: r.protein * qty, fat: r.fat * qty, carbs: r.carbs * qty };
    }
    const ing = food.item;
    let grams = { g: 1, kg: 1000, ml: 1, l: 1000 }[unit] * qty;
    if (unit === 'pcs') {
      if (!ing.piece) return { error: `Please enter ${ing.name.toLowerCase()} in grams.` };
      grams = qty * ing.piece;
    }
    const [k, p, f, c] = window.NUTRITION[ing.id];
    return { kcal: k * grams / 100, protein: p * grams / 100, fat: f * grams / 100, carbs: c * grams / 100 };
  }

  const foodName = $('#food-name'), foodQty = $('#food-qty'), foodUnit = $('#food-unit'), mealType = $('#meal-type');
  let lastFoodKind; // undefined → first sync always fills the unit list

  function syncFoodUnits() {
    const food = findFood(foodName.value);
    const kind = food ? food.kind + (food.kind === 'ingredient' ? food.item.id : '') : null;
    if (kind !== lastFoodKind) {
      lastFoodKind = kind;
      if (food && food.kind === 'recipe') {
        foodUnit.innerHTML = '<option value="serving">serving(s)</option>';
        foodQty.value = 1; foodQty.step = 0.5;
      } else {
        const ing = food && food.item;
        const units = [['g', 'g'], ['kg', 'kg'], ['ml', 'ml'], ['l', 'L']];
        if (!ing || ing.piece) units.push(['pcs', ing && ing.label ? ing.label[1] : 'pcs']);
        foodUnit.innerHTML = units.map(([v, l]) => `<option value="${v}">${l}</option>`).join('');
        const def = ing ? (ing.unit === 'pcs' ? 'pcs' : ing.unit) : 'g';
        foodUnit.value = def;
        foodQty.value = def === 'pcs' ? 1 : 100; foodQty.step = 'any';
      }
    }
    renderFoodPreview();
  }

  function renderFoodPreview() {
    const food = findFood(foodName.value);
    const el = $('#food-preview');
    if (!foodName.value.trim()) { el.textContent = ''; return; }
    if (!food) { el.innerHTML = '🔎 Not found yet — pick something from the list.'; return; }
    const n = foodNutrition(food, Number(foodQty.value), foodUnit.value);
    el.innerHTML = n.error ? esc(n.error)
      : `${food.item.emoji} <b>${esc(food.item.name)}</b> → 🔥 ${fmtNum(n.kcal, 0)} kcal · 💪 ${fmtNum(n.protein, 0)} g protein · 🧈 ${fmtNum(n.fat, 0)} g fat · 🍞 ${fmtNum(n.carbs, 0)} g carbs`;
  }

  foodName.addEventListener('input', syncFoodUnits);
  foodQty.addEventListener('input', renderFoodPreview);
  foodUnit.addEventListener('change', renderFoodPreview);

  function logFood(meal, food, qty, unit) {
    const n = foodNutrition(food, qty, unit);
    if (n.error) return n.error;
    const unitLabel = unit === 'serving' ? (qty === 1 ? 'serving' : 'servings')
      : unit === 'pcs' ? (food.item.label ? food.item.label[qty === 1 ? 0 : 1] : 'pcs') : UNIT_LABEL[unit];
    const list = getMeals(dateKey());
    list.push({
      key: Date.now().toString(36) + Math.random().toString(36).slice(2, 5), meal, kind: food.kind, id: food.item.id,
      name: food.item.name, emoji: food.item.emoji, qty, unitLabel,
      kcal: Math.round(n.kcal), protein: Math.round(n.protein), fat: Math.round(n.fat), carbs: Math.round(n.carbs)
    });
    setMeals(dateKey(), list);
    return null;
  }

  $('#meal-form').addEventListener('submit', e => {
    e.preventDefault();
    const food = findFood(foodName.value);
    const err = $('#meal-error');
    if (!food) { err.textContent = 'Pick a recipe or food from the list (start typing to see suggestions).'; return; }
    const problem = logFood(mealType.value, food, Number(foodQty.value), foodUnit.value);
    if (problem) { err.textContent = problem; return; }
    err.textContent = '';
    toast(`${food.item.emoji} Added to ${MEALS[mealType.value].label.toLowerCase()}`);
    foodName.value = ''; lastFoodKind = null; syncFoodUnits();
    foodName.focus();
    renderMeals();
  });

  $('#meal-list').addEventListener('click', e => {
    const b = e.target.closest('[data-del-meal]');
    if (!b) return;
    setMeals(dateKey(), getMeals(dateKey()).filter(x => x.key !== b.dataset.delMeal));
    renderMeals();
  });

  /* ================= Day evaluation ================= */
  const sum = (list, k) => list.reduce((a, x) => a + (x[k] || 0), 0);

  function evaluateDay(list, t) {
    const meals = {};
    Object.keys(MEALS).forEach(m => {
      const items = list.filter(x => x.meal === m);
      const kcal = sum(items, 'kcal'), protein = sum(items, 'protein');
      const target = t.kcal * MEALS[m].share;
      let status = 'ok';
      if (!items.length) status = 'missing';
      else if (kcal < target * 0.6) status = 'small';
      else if (kcal > target * 1.7) status = 'big';
      const lowProtein = items.length && m !== 'snack' && protein < Math.max(15, t.protein * MEALS[m].share * 0.6);
      meals[m] = { items, kcal, protein, target, status, lowProtein };
    });
    const proper = MAIN_MEALS.filter(m => meals[m].status === 'ok' || meals[m].status === 'big').length;
    return {
      meals, proper, kept: proper >= 3,
      kcal: sum(list, 'kcal'), protein: sum(list, 'protein'), fat: sum(list, 'fat'), carbs: sum(list, 'carbs')
    };
  }

  // Full days before today, newest first
  function pastDays(limit) {
    const out = [];
    const d = new Date();
    for (let i = 1; i <= limit; i++) {
      const day = new Date(d.getFullYear(), d.getMonth(), d.getDate() - i);
      out.push({ key: dateKey(day), day });
    }
    return out;
  }

  /* ================= Meals rendering ================= */
  function verdictBadge(m, info, isToday) {
    const hour = new Date().getHours();
    if (info.status === 'missing') {
      if (m === 'snack') return '<span class="badge-v neutral">optional</span>';
      return isToday && hour < MEALS[m].by ? '<span class="badge-v neutral">not yet</span>' : '<span class="badge-v bad">skipped</span>';
    }
    if (m === 'snack') return '<span class="badge-v good">logged</span>';
    if (info.status === 'small') return '<span class="badge-v warn">too small</span>';
    if (info.status === 'big') return '<span class="badge-v info">very large</span>';
    return info.lowProtein ? '<span class="badge-v warn">low protein</span>' : '<span class="badge-v good">good</span>';
  }

  function bar(label, value, target, unit, icon, warnOver) {
    const pct = target ? Math.round(value / target * 100) : 0;
    const cls = warnOver && pct > 115 ? 'over' : pct >= 85 ? 'full' : '';
    return `<div class="nbar">
      <div class="nbar-label"><span>${icon} ${label}</span><span><b>${fmtNum(value, 0)}</b> / ${fmtNum(target, 0)} ${unit} · ${pct}%</span></div>
      <div class="bar"><i class="${cls}" style="width:${Math.min(100, pct)}%"></i></div>
    </div>`;
  }

  function feedbackFor(day, t) {
    const hour = new Date().getHours();
    const out = [];
    const all = Object.values(day.meals).every(m => !m.items.length);
    if (all) {
      out.push(['🌅', `Nothing logged yet today. ${hour < 11 ? 'Start with a good breakfast!' : 'Log what you have eaten so far.'}`]);
      return out;
    }
    MAIN_MEALS.forEach(m => {
      const info = day.meals[m], L = MEALS[m].label;
      if (info.status === 'missing') {
        if (hour >= MEALS[m].by) out.push(['❌', `You skipped <b>${L.toLowerCase()}</b>. Skipping meals makes you overeat later and lose energy. Even something quick counts: see the ideas below.`]);
      } else if (info.status === 'small') {
        out.push(['⚠️', `<b>${L}</b> was too small: ${fmtNum(info.kcal, 0)} kcal, while a normal portion for you is about ${fmtNum(info.target, 0)} kcal. Add a filling side (rice, bread, potatoes, pasta) and a protein (eggs, chicken, tuna, yogurt, beans).`]);
      } else if (info.status === 'big') {
        out.push(['ℹ️', `<b>${L}</b> was very large (${fmtNum(info.kcal, 0)} kcal). Fine once in a while, but spreading food more evenly over 3 meals keeps your energy steady.`]);
      } else {
        out.push(['✅', `<b>${L}</b> was a good, normal portion (${fmtNum(info.kcal, 0)} kcal).`]);
      }
      if (info.lowProtein && info.status !== 'missing') {
        out.push(['💪', `${L} had only ${fmtNum(info.protein, 0)} g protein. Aim for 20+ g per meal: 2–3 eggs, a bowl of yogurt, 100 g chicken or a can of tuna, cottage cheese, peanut butter or lentils.`]);
      }
    });

    const expected = hour < 11 ? 0.25 : hour < 16 ? 0.6 : hour < 21 ? 0.9 : 1;
    const dueKcal = t.kcal * expected;
    if (day.kcal < dueKcal * 0.7) {
      out.push(['📉', `So far you've had <b>${fmtNum(day.kcal, 0)} kcal</b>. By now it should be around ${fmtNum(dueKcal, 0)} kcal, so you're about ${fmtNum(dueKcal - day.kcal, 0)} kcal short. Eating too little leads to tiredness, dizziness and poor concentration.`]);
    } else if (day.kcal > t.kcal * 1.25) {
      out.push(['📈', `You're ${fmtNum(day.kcal - t.kcal, 0)} kcal over your daily need. Lighter options: soups, salads, grilled fish or chicken, vegetables.`]);
    }
    if (hour >= 16 && day.protein < t.protein * expected * 0.7) {
      out.push(['🥚', `Protein is low today: ${fmtNum(day.protein, 0)} of ${fmtNum(t.protein, 0)} g. Protein keeps you full and strong. Add eggs, yogurt, tuna, chicken, cheese, lentils or peanut butter to your next meal.`]);
    }
    if (day.kcal > 400) {
      const fatShare = day.fat * 9 / day.kcal, carbShare = day.carbs * 4 / day.kcal;
      if (fatShare > 0.42) out.push(['🧈', `${Math.round(fatShare * 100)}% of today's calories came from fat (ideal is 25–35%). Choose boiled, baked or grilled food over fried, and go easy on butter, mayo and oil.`]);
      if (carbShare > 0.65) out.push(['🍞', `Today was mostly carbs (${Math.round(carbShare * 100)}%). Balance your plate: ¼ protein, ¼ carbs, ½ vegetables.`]);
    }
    if (day.kept && out.every(([i]) => i === '✅')) out.push(['🌟', 'Great day: 3 proper meals. Keep it up!']);
    return out;
  }

  function suggestionsFor(day, t) {
    const hour = new Date().getHours();
    const next = MAIN_MEALS.find(m => day.meals[m].status === 'missing' && (hour < MEALS[m].by + 3))
      || MAIN_MEALS.find(m => day.meals[m].status === 'small');
    if (!next) return '';
    const target = t.kcal * MEALS[next].share * (day.meals[next].status === 'small' ? 0.6 : 1);
    const cats = next === 'breakfast' ? ['Breakfast', 'Snack'] : ['Main', 'Soup', 'Salad'];
    const picks = RECIPES
      .filter(r => cats.includes(r.category) && r.protein >= 12 && r.kcal >= target * 0.5 && r.kcal <= target * 1.4)
      .map(r => ({ r, ready: state.pantry.length && evaluate(r).ready }))
      .sort((a, b) => (b.ready - a.ready) || (b.r.simple - a.r.simple) || (b.r.protein / b.r.kcal - a.r.protein / a.r.kcal))
      .slice(0, 3);
    if (!picks.length) return '';
    return `<h4 class="sugg-title">💡 Ideas for ${day.meals[next].status === 'small' ? 'topping up' : 'your'} ${MEALS[next].label.toLowerCase()}${picks.some(p => p.ready) ? ' (✅ = you have everything)' : ''}</h4>
      <div class="sugg">${picks.map(({ r, ready }) => `
        <button class="sugg-item" data-open-recipe="${r.id}">
          ${mediaHtml(r, 'sugg-media')}
          <span><b dir="auto" title="${esc(r.name)}">${ready ? '✅ ' : ''}${esc(r.native)}</b><small>🔥 ${r.kcal} kcal · 💪 ${r.protein} g protein · ⏱ ${r.time} min</small></span>
        </button>`).join('')}</div>`;
  }

  function renderMeals() {
    if (!state.profile) return;
    const t = targets();
    const key = dateKey();
    const list = getMeals(key);
    const day = evaluateDay(list, t);
    const hour = new Date().getHours();

    $('#today-date').textContent = fmtDate(new Date(), { weekday: 'long', day: 'numeric', month: 'long' });
    $('#meal-list').innerHTML = Object.entries(MEALS).map(([m, M]) => {
      const info = day.meals[m];
      return `<div class="meal-block">
        <div class="meal-head">
          <span class="meal-name">${M.emoji} ${M.label}</span>
          ${verdictBadge(m, info, true)}
          <span class="meal-sum">${info.items.length ? `🔥 ${fmtNum(info.kcal, 0)} kcal · 💪 ${fmtNum(info.protein, 0)} g` : `aim ≈ ${fmtNum(info.target, 0)} kcal`}</span>
        </div>
        ${info.items.length ? `<ul class="meal-items">${info.items.map(x => `
          <li><span>${x.emoji} ${esc(x.name)} <small>· ${fmtNum(x.qty)} ${esc(x.unitLabel)}</small></span>
            <span class="mi-n">${x.kcal} kcal · ${x.protein} g P · ${x.fat} g F · ${x.carbs} g C</span>
            <button class="remove" data-del-meal="${x.key}" aria-label="Remove ${esc(x.name)}">✕</button></li>`).join('')}</ul>` : ''}
      </div>`;
    }).join('');

    $('#nutri-bars').innerHTML =
      bar('Calories', day.kcal, t.kcal, 'kcal', '🔥') +
      bar('Protein', day.protein, t.protein, 'g', '💪') +
      bar('Fat', day.fat, t.fat, 'g', '🧈', true) +
      bar('Carbs', day.carbs, t.carbs, 'g', '🍞', true);

    const fb = feedbackFor(day, t);
    if (hour >= 21 && !day.kept) fb.unshift(['🍽️', `Only ${day.proper}/3 proper meals today. There's still time for a proper ${MAIN_MEALS.filter(m => !(day.meals[m].status === 'ok' || day.meals[m].status === 'big')).map(m => MEALS[m].label.toLowerCase()).join(' and ')} now!`]);
    $('#feedback').innerHTML = fb.map(([i, txt]) => `<li><span>${i}</span><div>${txt}</div></li>`).join('');
    $('#suggestions').innerHTML = suggestionsFor(day, t);

    // History
    const rows = [{ key, day: new Date(), today: true }, ...pastDays(6).map(x => ({ ...x, today: false }))];
    $('#history').innerHTML = `<div class="hist-row hist-head"><span>Day</span><span>B · L · D</span><span>Calories</span><span>Protein</span><span>Status</span></div>` +
      rows.map(({ key: k, day: d, today }) => {
        const ev = evaluateDay(getMeals(k), t);
        const dots = MAIN_MEALS.map(m => {
          const s = ev.meals[m].status;
          return s === 'ok' || s === 'big' ? '✅' : s === 'small' ? '⚠️' : (today && hour < MEALS[m].by ? '⏳' : '❌');
        }).join(' ');
        const status = ev.kept ? '✅ 3 proper meals' : today && hour < 21 ? '<span class="muted">in progress</span>' : `${ev.proper}/3 proper meals`;
        return `<div class="hist-row${today ? ' today' : ''}">
          <span>${today ? 'Today' : fmtDate(d)}</span><span>${dots}</span>
          <span>${fmtNum(ev.kcal, 0)} kcal</span><span>${fmtNum(ev.protein, 0)} g</span><span>${status}</span></div>`;
      }).join('');
  }

  document.addEventListener('click', e => {
    const o = e.target.closest('[data-open-recipe]');
    if (o) openRecipe(o.dataset.openRecipe);
  });

  mealType.value = defaultMealType();
  syncFoodUnits();

  /* ================= Footer & daily love note ================= */
  const FROM = CONFIG.fromName || 'Your love';
  $('#footer-year').textContent = new Date().getFullYear();

  const noteDialog = $('#note-dialog');
  const NOTES = window.LOVE_NOTES || [];

  // Walk through the notes in a fixed shuffled order (a step that shares no factor with the
  // list length visits every note once before repeating)
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  let NOTE_STEP = 97;
  while (NOTES.length && gcd(NOTE_STEP, NOTES.length) !== 1) NOTE_STEP++;
  const dayNumber = () => { const d = new Date(); return Math.floor(new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() / 864e5); };
  const noteFor = (day, extra) => NOTES[(day * NOTE_STEP + (extra ? Math.floor(NOTES.length / 2) : 0)) % NOTES.length];

  function renderNote() {
    const extraUsed = store.get('note.extra', null) === dateKey();
    const note = noteFor(dayNumber(), extraUsed);
    const isQuote = typeof note === 'object';
    $('#note-text').textContent = isQuote ? `“${note.q}”` : note;
    $('#note-by').hidden = !isQuote;
    $('#note-by').textContent = isQuote ? `— ${note.by}` : '';
    $('#note-sign').textContent = isQuote ? `Thinking of you, ${FROM}` : `— ${FROM}`;
    const renew = $('#note-renew');
    renew.disabled = extraUsed;
    $('span', renew).textContent = extraUsed ? 'A new note arrives tomorrow 💌' : 'Another note for today (1 left)';
    $('#note-title').textContent = extraUsed ? '💌 A bonus note for today' : '💌 A little note for today';
  }

  function openNote() {
    if (!NOTES.length) return;
    renderNote();
    if (!noteDialog.open) noteDialog.showModal();
  }
  $('#note-renew').addEventListener('click', () => {
    if (store.get('note.extra', null) === dateKey()) return;
    store.set('note.extra', dateKey());
    const box = $('.note-inner', noteDialog);
    box.classList.remove('flip'); void box.offsetWidth; box.classList.add('flip');
    renderNote();
  });
  function maybeShowNote() {
    if (!state.profile || store.get('note.day', null) === dateKey()) return;
    setTimeout(openNote, 400);
  }
  noteDialog.addEventListener('close', () => store.set('note.day', dateKey()));
  noteDialog.addEventListener('click', e => {
    if (e.target === noteDialog || e.target.closest('[data-close-note]')) noteDialog.close();
  });

  /* ================= Welcome screen after the first sign-up ================= */
  function showWelcome(name) {
    const loader = $('#welcome-loader');
    $('#welcome-name').textContent = name ? `Welcome, ${name}!` : 'Welcome!';
    loader.hidden = false;
    requestAnimationFrame(() => loader.classList.add('run'));
    const steps = $$('.wl-step', loader);
    steps.forEach((s, i) => setTimeout(() => s.classList.add('done'), 900 + i * 1200));
    setTimeout(() => {
      loader.classList.add('leaving');
      setTimeout(() => {
        loader.hidden = true;
        loader.classList.remove('run', 'leaving');
        steps.forEach(s => s.classList.remove('done'));
        maybeShowNote();
      }, 350);
    }, 5000);
  }

  /* ================= Start ================= */
  renderPantry();
  if (!state.profile) {
    showOnboarding(false);
  } else {
    showApp();
    setTab(location.hash.slice(1) || 'health', false);
    maybeShowNote();
  }

  // Refresh the water counter when coming back to the page (e.g. after midnight)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden || !state.profile) return;
    renderHealth();
  });

  // Install-as-app + offline support when hosted online
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
})();
