# 🥗 Pantry Chef

A small website that works out your daily water goal and suggests recipes based on what you have in your kitchen.

- **First launch:** enter age, sex, weight, height, activity level and typical weather. The site shows your daily water goal, BMI, calorie needs and a drinking schedule.
- **Water tracker:** tap "+1 glass" or "+1 bottle" during the day. It resets every day. You can switch today's weather on the water card and the goal updates. The tab also explains what happens when you don't drink enough water, with a short TED-Ed video.
- **My kitchen:** add what you have, e.g. "Chicken: 200 g", "Onion: 1 pcs".
- **Recipes:** 239 recipes — 48 Azerbaijani, 34 Turkish, 17 Georgian, plus Italian, Russian, Mexican, Indian, Chinese and more. Each one has a photo, a YouTube video button and step-by-step instructions.
  - Includes a set of **student-kitchen** recipes: quick, cheap dishes with few ingredients, made with one pan, a pot or a microwave (instant noodles, pelmeni, buckwheat, lavash pizza, mug omelette, mug cake…).
  - Recipes are sorted by how well they match your ingredients.
  - Each recipe shows what's missing and how many servings your amounts make.
  - Changing the number of servings rescales all quantities.
  - Each recipe shows calories, protein, fat and carbs per serving, worked out from its ingredients, and what share of your daily needs that is.
  - You can filter by category, cuisine, vegetarian, **🎓 student-friendly** (20 minutes or less, easy, at most 4 main ingredients), or "only what I can cook now".

- **My meals:** log what you ate for breakfast, lunch, dinner or snacks: a recipe (in servings) or a single food (in g, ml or pcs).
  - The app totals calories, protein, fat and carbs and compares them with your daily needs.
  - It tells you when a meal was too small, low in protein or too fatty, explains how to improve it, and suggests recipes for your next meal.
  - It keeps a 7-day history.
- **Welcome screen:** right after the profile is filled in, a short 5-second welcome screen sets everything up.
- **Original dish names:** each dish shows its name in its own language (Dovğa, Mercimek çorbası, ხინკალი, Борщ…). The small **EN** button next to it shows the English name.
- **Difficulty filter & sorting:** filter by Easy / Medium / Hard, and sort easy → hard, hard → easy, quickest, most protein or fewest calories.
- **Daily note:** a different note pops up once a day (60 notes in `js/love-notes.js`).

It needs no server, no installation and no internet, except for the YouTube videos. All personal data stays in that computer's browser.

---

## 📦 Setting it up on another computer

### Option 1: copy the folder (works offline)

1. Download or clone the repository, or copy the whole folder to the other computer.
2. Keep it somewhere permanent, e.g. `C:\Users\<name>\Documents\Food-receipts`.
3. Double-click `index.html` to open it in the browser, then press **Ctrl + D** to bookmark it.
4. Fill in the profile, and you're done ✅

### Option 2: put it online (open from any computer or phone)

Upload the folder to free hosting and open it with a link. This also enables **"Install app"**: you get an icon in the Start menu, and the site works offline after the first visit.

**Netlify (easiest):**
1. Go to <https://app.netlify.com/drop> (free sign-up).
2. Drag the `Food-receipts` folder onto the page.
3. Open the link you get (e.g. `https://pantry-chef-xxx.netlify.app`) in **Edge** or **Chrome** on that computer.
4. Click the **"Install app"** icon (⊕) at the right of the address bar.

**GitHub Pages (alternative):** push the folder to a GitHub repository, then go to *Settings → Pages → Branch: main* and open the link it gives you.

> 🔒 No personal data is ever sent to a server. Everyone who opens the link keeps their own data in their own browser.

### Good to know

- Data (profile, ingredients, water) is saved **in the browser**, so:
  - Always use **the same browser**. Data entered in Edge won't show up in Chrome.
  - Clearing browsing data / site data in the browser deletes it.
  - Private / Incognito windows don't keep anything.
- To change the profile later, click **👤** in the top-right corner.

### Updating to a new version

- **Option 1:** copy the new files over the old folder (keep the folder in the same place). Your data is kept.
- **Option 2:** upload the folder to Netlify again. Bump `VERSION` in `sw.js` (e.g. `mk-v3`) so installed copies refresh.

---

## 🛠 Files

```
index.html             Page structure
css/style.css          Styling (light/dark theme, mobile friendly)
js/config.js           Personal settings (note signature)
js/love-notes.js       The daily love notes
js/data.js             Ingredient catalogue, nutrition table, recipes and their original names
js/images.js           Photo list with author/license (generated)
js/app.js              Logic: water goal, kitchen list, recipe matching
images/                Recipe photos (from Wikimedia Commons)
tools/fetch-images.js  Downloads the recipe photos
manifest.webmanifest   For "Install app"
sw.js                  Offline cache (only used in Option 2)
```

### Personal settings

Open `js/config.js` and set:

- `fromName`: the signature under the daily notes.

To change the love notes, edit `js/love-notes.js` (one note per line).

### Adding a recipe

In `js/data.js`, add a line to `RECIPES`:

```js
R('my-dish', 'My dish', '🍲', 'Main', 'Azerbaijani', 30, 'Easy', 4, 350,
  'chicken 300, onion 1, herbs 20?, salt, oil', [
    'First step.',
    'Second step.'
  ]),
```

The fields are: id, name, emoji, category (`Main`, `Soup`, `Salad`, `Side`, `Snack`, `Breakfast`, `Dessert`, `Drink`), cuisine, minutes, difficulty, servings, kcal per serving, ingredients, steps.

In the ingredient string:
- The number is in the ingredient's own unit (g, ml or pcs).
- A trailing `?` marks an ingredient as optional.
- Staples such as salt and oil don't need an amount.

Ingredient ids must exist in `INGREDIENTS` at the top of the same file.

Nutrition is calculated automatically from the ingredient amounts:
- Per-100 g values are in `NUTRITION` in the same file.
- A new ingredient needs a line there too.
- When a recipe just says "oil", 7 ml per serving is assumed.

### Photos

Each photo comes from the matching Wikipedia article, and its author and license are shown under it in the recipe. To fetch a photo for a new recipe:

1. Add the recipe id and a Wikipedia article title to `TITLES` in `tools/fetch-images.js`.
2. Run this (needs internet and [Node.js](https://nodejs.org)):

```
node tools/fetch-images.js
```

Recipes without a photo show their emoji instead.

### Videos

The **Watch video recipes** button opens a YouTube search for the dish. That way it always shows current, available videos instead of a fixed link that may be deleted later.

### How the water goal is calculated

`weight × 33 ml` + activity (0–1000 ml) + weather (warm +300 ml, hot +600 ml) + pregnancy (+300 ml) or breastfeeding (+700 ml).
Calories use the Mifflin-St Jeor formula. These are general guidelines, not medical advice.
