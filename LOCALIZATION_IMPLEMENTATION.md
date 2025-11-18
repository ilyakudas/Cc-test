# ChromaWing Localization Implementation Guide

## ✅ What Has Been Implemented

The localization system for ChromaWing is now **functional and ready to use**. Here's what has been completed:

### Core Infrastructure

1. **i18n Module** (`public/js/lib/i18n.js`)
   - Automatic browser language detection
   - Translation file loading system
   - Nested key support with dot notation
   - Parameter substitution (e.g., `{name}`, `{cost}`)
   - Fallback to English for missing translations

2. **Game State Integration**
   - Language preference stored in `gameState.js`
   - Saved/loaded with game progress in `storage.js`
   - Persists across sessions in localStorage

3. **Initialization**
   - Language auto-detection on first load
   - i18n system loads before game starts
   - Available globally via `window.i18n`

4. **Alpine.js Integration**
   - `$t('key')` magic helper for use in HTML templates
   - Access to translations in Alpine components
   - Example: `x-text="$t('common.buy')"`

### Translation Files

1. **English (Complete)** - `public/locales/en.json`
   - 150+ translation keys covering entire game
   - Comprehensive context for each string
   - Character length limits specified
   - Parameter placeholders documented

2. **Spanish (Sample)** - `public/locales/es.json`
   - Partial translation demonstrating the system
   - Ready to be completed using LLM translation

3. **Translation Guide** - `public/locales/TRANSLATION_GUIDE.md`
   - Complete LLM prompt for generating translations
   - Language-specific notes
   - Validation instructions
   - Best practices

### Code Examples

**Updated File**: `public/js/actions/settings.js`
- Demonstrates how to use `t()` function in JavaScript
- Shows parameter substitution
- Example of migrating existing hardcoded strings

## 🚧 What Needs To Be Done

### 1. Complete Translations

Generate complete translations for all supported languages:

#### Spanish (es.json) - Partially Done
```bash
# Use the LLM prompt in TRANSLATION_GUIDE.md
# Current: ~20% complete
# Needed: Complete remaining sections
```

#### French (fr.json) - Not Started
```bash
# Create using LLM prompt from TRANSLATION_GUIDE.md
```

#### Russian (ru.json) - Not Started
```bash
# Create using LLM prompt from TRANSLATION_GUIDE.md
# Note: Pay attention to plural forms with numbers
```

#### Ukrainian (uk.json) - Not Started
```bash
# Create using LLM prompt from TRANSLATION_GUIDE.md
# Note: Similar to Russian but with Ukrainian specifics
```

### 2. Integrate Translations Into Codebase

**Priority Files** (high user visibility):

#### Action Files
- [ ] `public/js/actions/breeding.js` - Breeding toast messages
- [ ] `public/js/actions/trading.js` - Buy/sell notifications
- [ ] `public/js/actions/laboratory.js` - Examination messages
- [ ] `public/js/actions/offspring.js` - Offspring management toasts
- [x] `public/js/actions/settings.js` - **DONE** (example)

#### UI Files
- [ ] `public/js/ui/stats.js` - Header stats labels
- [ ] `public/js/ui/tabs.js` - Tab switching text
- [ ] `public/js/ui/parrotCard.js` - Card button labels
- [ ] `public/js/lib/contests.js` - Contest names and descriptions
- [ ] `public/js/lib/notifications.js` - Notification panel text

#### HTML File
- [ ] `public/breeding-game-modular.html` - Static text labels
  - Splash screen text
  - Tab labels
  - Panel headers
  - Button text
  - Tooltips

### 3. Update Storage.js for Language Detection on Load

The current implementation loads the language after loading the game. This needs a minor adjustment to handle the first load better (already functional but could be optimized).

## 📖 How to Integrate Translations

### In JavaScript Files

```javascript
// 1. Import the t function
import { t } from '../lib/i18n.js';

// 2. Replace hardcoded strings with t() calls

// Before:
showToast('Success!', 'Parrot purchased', 'success');

// After:
showToast(
    t('toasts.parrotJoined.title', { name: parrot.name }),
    t('toasts.parrotJoined.message', {
        rarity: parrot.calculateRarity(),
        generation: parrot.generation,
        price: price
    }),
    'success'
);

// Before:
statusEl.textContent = 'ON';

// After:
statusEl.textContent = t('common.on');
```

### In HTML Files (Static Content)

For static text that doesn't change:

```html
<!-- Before -->
<h2>Your Parrots</h2>

<!-- After - Use the t() function from window.i18n -->
<h2 id="panelTitle"></h2>
<script>
document.getElementById('panelTitle').textContent = window.i18n.t('panel.yourParrots');
</script>
```

Or initialize in main.js after i18n loads.

### In Alpine.js Templates

```html
<!-- Before -->
<button>Buy Parrot</button>

<!-- After -->
<button x-text="$t('common.buy')"></button>

<!-- With parameters -->
<span x-text="$t('breeding.breedCost', { cost: 50 })"></span>
```

## 🔧 Step-by-Step Migration Guide

### Phase 1: Generate All Translations (Priority)

1. **Complete Spanish** (es.json)
   ```bash
   # Use LLM with the prompt from TRANSLATION_GUIDE.md
   # Copy missing sections from en.json
   # Translate each "value" field
   ```

2. **Generate French** (fr.json)
   ```bash
   # Use full en.json with LLM prompt
   # Save output as fr.json
   ```

3. **Generate Russian** (ru.json)
   ```bash
   # Use full en.json with LLM prompt
   # Pay special attention to plural forms
   # Save output as ru.json
   ```

4. **Generate Ukrainian** (uk.json)
   ```bash
   # Use full en.json with LLM prompt
   # Save output as uk.json
   ```

5. **Validate All Files**
   ```bash
   # Check JSON validity
   node -e "require('./public/locales/es.json')"
   node -e "require('./public/locales/fr.json')"
   node -e "require('./public/locales/ru.json')"
   node -e "require('./public/locales/uk.json')"
   ```

### Phase 2: Migrate High-Priority Files

Start with the most visible user-facing strings:

1. **Toast Notifications** (breeding.js, trading.js)
   - High visibility
   - Easy to migrate
   - Clear translation keys already defined

2. **Action Buttons** (parrotCard.js, tabs.js)
   - Very visible
   - Simple strings
   - Good impact

3. **Contest System** (contests.js)
   - Moderate complexity
   - Important for gameplay
   - Already has translation keys

4. **Laboratory** (laboratory.js)
   - Complex but important
   - Lots of text content
   - Translation keys defined

### Phase 3: Migrate HTML Static Content

1. **Splash Screen**
   - Title, subtitle, descriptions
   - Feature highlights
   - Buttons

2. **Stats Bar**
   - Labels: Coins, Parrots, Generation, etc.
   - Initialize after i18n loads

3. **Tabs**
   - Tab labels
   - Can be done with Alpine.js `$t()`

## 🧪 Testing Localization

### Manual Testing

1. **Test English (default)**
   ```javascript
   // In browser console
   localStorage.setItem('chromawing_save', JSON.stringify({
       ...existingSave,
       language: 'en'
   }));
   location.reload();
   ```

2. **Test Spanish**
   ```javascript
   // Set language and reload
   localStorage.setItem('chromawing_save', JSON.stringify({
       ...existingSave,
       language: 'es'
   }));
   location.reload();
   ```

3. **Test Browser Language Detection**
   ```javascript
   // Clear save to trigger auto-detection
   localStorage.removeItem('chromawing_save');
   // Change browser language to Spanish
   // Reload page - should detect Spanish
   ```

### Automated Checks

1. **JSON Validation**
   ```bash
   for file in public/locales/*.json; do
       echo "Checking $file..."
       node -e "JSON.parse(require('fs').readFileSync('$file'))" || echo "INVALID JSON"
   done
   ```

2. **Placeholder Consistency**
   ```bash
   # Extract placeholders from English
   grep -o '{[a-z]*}' public/locales/en.json | sort -u > /tmp/en_placeholders.txt

   # Compare with other languages
   grep -o '{[a-z]*}' public/locales/es.json | sort -u > /tmp/es_placeholders.txt
   diff /tmp/en_placeholders.txt /tmp/es_placeholders.txt
   ```

3. **Missing Keys Check**
   ```javascript
   // Run in browser console after loading game
   const en = await fetch('/locales/en.json').then(r => r.json());
   const es = await fetch('/locales/es.json').then(r => r.json());

   // Compare key structures
   // (implement deep key comparison)
   ```

## 📋 Migration Checklist

Use this checklist to track translation integration progress:

### Core Files
- [x] i18n.js - Translation engine
- [x] gameState.js - Language storage
- [x] storage.js - Save/load language
- [x] main.js - i18n initialization
- [x] breeding-game-modular.html - Alpine.js magic helper

### Translation Files
- [x] en.json - English (complete)
- [ ] es.json - Spanish (complete all sections)
- [ ] fr.json - French (generate)
- [ ] ru.json - Russian (generate)
- [ ] uk.json - Ukrainian (generate)

### Action Files
- [x] settings.js - Settings toasts (example done)
- [ ] breeding.js - Breeding toasts
- [ ] trading.js - Buy/sell toasts
- [ ] laboratory.js - Examination toasts
- [ ] offspring.js - Offspring management toasts
- [ ] selection.js - Selection messages
- [ ] collection.js - Collection messages

### UI Files
- [ ] stats.js - Header labels
- [ ] tabs.js - Tab labels
- [ ] parrotCard.js - Button labels
- [ ] parrotGrid.js - Grid messages
- [ ] preview.js - Preview panel
- [ ] mutations.js - Mutation display

### Lib Files
- [ ] contests.js - Contest names/descriptions
- [ ] notifications.js - Notification panel
- [ ] achievements.js - Achievement messages

### HTML Static Content
- [ ] Splash screen
- [ ] Stats bar
- [ ] Tab labels
- [ ] Panel headers
- [ ] Empty states
- [ ] Tooltips

## 🎯 Quick Win: Minimum Viable Localization

For a quick demonstration, focus on these high-impact areas:

1. **Complete Spanish Translation** (es.json)
2. **Migrate Toast Notifications** (breeding.js, trading.js, settings.js)
3. **Translate Static Headers** (HTML file - splash, tabs, stats)

This gives you:
- One complete language to test
- Most visible user-facing strings translated
- Clear demonstration of the system working

## 💡 Tips and Best Practices

### Translation Quality
- Always test in-game to see how translations look in context
- Check character lengths - some languages are more verbose
- Maintain consistent terminology throughout
- Get native speaker review when possible

### Code Quality
- Always import `{ t }` at the top of files
- Use descriptive keys (e.g., `toasts.breedSuccess.title`)
- Pass parameters as object: `t('key', { param: value })`
- Don't concatenate translated strings

### Performance
- Translations load once at startup
- No runtime performance impact
- Cached in memory for fast access

### Maintenance
- Add new keys to en.json first
- Update all language files when adding keys
- Document context for translators
- Keep TRANSLATION_GUIDE.md updated

## 🐛 Troubleshooting

### Translation doesn't appear
1. Check browser console for warnings
2. Verify key exists in translation file
3. Confirm JSON is valid
4. Check language is loaded correctly

### Wrong language loads
1. Check localStorage `chromawing_save` language field
2. Verify language code matches filename (en.json → 'en')
3. Check browser language detection

### Placeholder not replaced
1. Ensure placeholder uses exact syntax: `{name}`
2. Pass parameters to t(): `t('key', { name: 'value' })`
3. Check parameter names match in translation file

## 📞 Next Steps

1. **Generate remaining translations** using the LLM prompt
2. **Migrate action files** following the settings.js example
3. **Update HTML** static content
4. **Test thoroughly** in all languages
5. **Commit and push** to repository

The foundation is solid and working. The remaining work is systematic translation and migration following the established patterns.

Good luck with the localization! 🌍🦜
