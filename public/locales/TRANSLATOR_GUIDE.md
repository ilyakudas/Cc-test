# ChromaWing Translation Guide

Welcome, translator! This guide will help you create high-quality translations for ChromaWing, a parrot breeding genetics game. Thank you for helping make this game accessible to players in your language!

## Table of Contents

1. [Quick Start](#quick-start)
2. [Game Overview](#game-overview)
3. [Translation Files](#translation-files)
4. [Context Fields](#context-fields)
5. [Grammar & Gender](#grammar--gender)
6. [Verb Forms](#verb-forms)
7. [Abbreviations](#abbreviations)
8. [Tone & Style](#tone--style)
9. [Game Terminology](#game-terminology)
10. [Parrot Names](#parrot-names)
11. [Common Pitfalls](#common-pitfalls)
12. [Language-Specific Guides](#language-specific-guides)

---

## Quick Start

1. **Copy the template**: Use `en.json` as your starting point
2. **Update `_meta`**: Change language name and code
3. **Translate `value` fields**: Keep `_context` fields in English for reference
4. **Check `original.json`**: See the original hardcoded English text
5. **Test in-game**: Load your translation and verify it looks good

## Game Overview

**ChromaWing** is a genetics-based parrot breeding simulation where:
- Players breed parrots with RGB color genetics (red, green, blue)
- Each parrot has 78 genes controlling 6 body parts
- Players compete in beauty contests
- The game teaches Mendelian inheritance through gameplay

**Key concepts to understand:**
- **Parrot**: The main game object (note: feminine in many languages!)
- **Breeding**: Combining two parent parrots to create offspring
- **Genes/Alleles**: DNA that determines color traits
- **Gradient**: Smooth color transitions on feathers (vs solid colors)
- **Rarity**: How uncommon a parrot's gene combination is
- **Beauty**: How visually appealing color combinations are

## Translation Files

### File Structure

```
public/locales/
├── original.json    # Original hardcoded English strings (reference only)
├── en.json          # Polished English (use as template)
├── es.json          # Spanish
├── fr.json          # French
├── ru.json          # Russian
├── uk.json          # Ukrainian
└── [your-language].json
```

### JSON Format

Each translatable string has this structure:

```json
"key": {
  "value": "Translated text here",
  "_context": "English explanation for translators"
}
```

**Important**:
- Only translate the `value` fields
- Keep `_context` fields in English (they're not displayed to players)
- Preserve all `{placeholder}` variables (like `{name}`, `{cost}`)

## Context Fields

Every string includes a `_context` field with important information:

### What Context Tells You

1. **Where it's used**: "Button text", "Tab name", "Modal title", etc.
2. **Max length**: Character limits (e.g., "Max length: 15 chars")
3. **Grammar hints**: "Adjective modifies 'parrot'", "Imperative verb"
4. **Placeholders**: What `{variables}` represent
5. **Special notes**: Tone, synonyms, or usage details

### Example

```json
"lock": {
  "value": "Lock",
  "_context": "Button to lock parrot (prevent selling). Imperative verb. Max length: 10 chars."
}
```

This tells you:
- ✓ It's a **button** (so be concise)
- ✓ Use **imperative mood** (command form of verb)
- ✓ Keep it under **10 characters**
- ✓ It means "to lock" not "a lock" (noun vs verb)

## Grammar & Gender

### Gender Agreement ⚠️ CRITICAL for gendered languages

The word **"parrot"** is **feminine** in many languages:
- Spanish: *papagayo* (m) / **papagaya** (f) - use feminine
- French: **perroquet** (m) - use masculine
- Russian: **попугай** (m) - use masculine
- Ukrainian: **папуга** (f) - use feminine

**All rarity and beauty adjectives modify "parrot"**, so use the correct gender:

```json
// Spanish (parrot = papagaya, feminine)
"common": {
  "value": "Común",  // Not "Común" (could be either)
  "_context": "...Adjective modifies 'parrot' (feminine)..."
}

// Ukrainian (parrot = папуга, feminine)
"common": {
  "value": "Звичайна",  // Feminine ending -а
  "_context": "...Adjective modifies 'parrot' (feminine)..."
}
```

### Where Gender Matters

Look for this in context: `"Adjective modifies 'parrot' (feminine in many languages)"`

Affected sections:
- **rarity.*** (common, uncommon, rare, epic, legendary)
- **beauty.*** (plain, decent, pretty, beautiful, stunning)
- **common.locked** (status indicator)

## Verb Forms

### Imperative Mood for Actions

All action buttons use **imperative verb form** (commands):

Look for: `"Imperative verb"` in context

**Examples:**

| English | Spanish | French | Ukrainian | Russian |
|---------|---------|--------|-----------|---------|
| Examine | Examinar | Examiner | Дослідити | Исследовать |
| Lock | Bloquear | Verrouiller | Замкнути | Закрепить |
| Free | Liberar | Libérer | Відпустити | Освободить |

### Common Mistakes

❌ **Don't use nouns**:
- Ukrainian: "Замок" (lock as noun/castle)
- ✓ Correct: "Замкнути" (to lock, imperative)

❌ **Don't use infinitives** (when imperative is needed):
- Spanish: "Examinar" might work, but check if command form is clearer
- Context will specify if imperative is required

## Abbreviations

### Time Units

Look for: `"Abbreviated form - use appropriate abbreviation for your language"`

These strings use English abbreviations that **must be adapted**:

```json
// English
"minutesAgo": { "value": "{n}m ago" }  // "5m ago"

// Ukrainian - use your abbreviation
"minutesAgo": { "value": "{n}хв тому" }  // "5хв тому"

// Spanish
"minutesAgo": { "value": "hace {n}min" }  // "hace 5min"
```

**Guidelines:**
- Use standard abbreviations in your language
- Keep it short (max 15 chars total)
- Make sure it's clear to players

### Other Abbreviations

- **Auto-Exam**: Can be abbreviated or kept as two words
- **Gen** (Generation): Adapt as needed for your language

## Tone & Style

### Overall Tone

ChromaWing is **friendly, educational, and slightly playful**:
- ✓ Welcoming and encouraging
- ✓ Clear and informative
- ✗ Not overly formal or technical
- ✗ Not too casual or silly

### Success Messages

Use **enthusiastic tone** with exclamation marks:

```json
"breedSuccess": {
  "title": "Breeding successful!",  // Keep the excitement!
  "message": "4 new chicks born!..."
}
```

### Error Messages

Be **informative but friendly**:

```json
"breedNotEnoughCoins": {
  "title": "Not enough coins!",  // Clear and direct
  "message": "Breeding costs {cost} coins. You have {current}."  // Helpful
}
```

### Button Text

Keep it **short and action-oriented**:
- ✓ "Lock", "Unlock", "Examine"
- ✗ "Click here to lock", "Please examine"

## Game Terminology

### Core Terms Glossary

| English | Description | Notes |
|---------|-------------|-------|
| **Parrot** | Main game entity | Check gender in your language! |
| **Breed/Breeding** | Combining two parrots | Not "reproduction" |
| **Offspring** | Baby parrots from breeding | Plural form |
| **Generation** | Breeding lineage number | "Gen 5" = 5th generation |
| **Gene/Allele** | DNA unit | Singular gene vs genes (plural) |
| **Gradient** | Smooth color blend | Not "degradation" |
| **Rarity** | How uncommon | Not "scarcity" |
| **Beauty** | Aesthetic appeal | Not "prettiness" |
| **Laboratory/Lab** | Where you examine genes | Can abbreviate |
| **Examine** | View detailed genetics | Not "inspect" |
| **Lock** | Protect from selling | Not "freeze" or "secure" |
| **Mutation** | Random gene change | Genetic term |
| **Contest** | Beauty competition | Not "contest" as in "dispute" |
| **Store/Shop** | Where you buy parrots | Either term is fine |

### RGB Color Terms

Keep these **technical and consistent**:

- **Red channel** / **Green channel** / **Blue channel**
- **Gradient** (not "gradation" or "fade")
- **Solid color** (vs gradient)
- **Dominant/Recessive** (genetic terms - translate carefully)

### UI Terms

- **Tab**: Navigation element (Collection, Store, Breeding, etc.)
- **Panel**: Side area showing details
- **Modal**: Popup window
- **Button**: Clickable action
- **Badge**: Visual indicator icon

## Parrot Names

### How Names Work

**IMPORTANT**: Parrot names are **NOT translated** in the JSON files. Instead, each language has its own **name pool** with culturally appropriate names.

### Name Pool System

Names are stored in language-specific files:

```
public/locales/names/
├── names.en.json    # 52 English names (Aurora, Blaze, Crystal...)
├── names.es.json    # 52 Spanish names (Aurora, Llama, Cristal...)
├── names.fr.json    # 52 French names (Aurore, Flamme, Cristal...)
├── names.uk.json    # 52 Ukrainian names (Зоря, Вогонь, Кришталь...)
└── names.ru.json    # 52 Russian names (Заря, Пламя, Кристалл...)
```

### Why Not Direct Translation?

**Direct translation doesn't work** for parrot names:

```
❌ BAD: Translate literally
"Aurora" → "Аврора" (sounds foreign in Ukrainian)
"Blaze" → "Блейз" (sounds English in Russian)

✓ GOOD: Use culturally appropriate names
"Aurora" → "Зоря" (Ukrainian for "Star")
"Blaze" → "Вогонь" (Ukrainian for "Fire")
```

### Name Selection Guidelines

When creating names for your language:

1. **Theme**: Color, light, nature, and celestial themes
2. **Length**: 3-15 characters (short enough for UI)
3. **Cultural fit**: Names that feel natural in your language
4. **Uniqueness**: Each name should be distinct
5. **Pronunciation**: Easy to say in your language

**Examples by category:**

- **Colors**: Azure, Crimson, Indigo → Блакить, Багрянець, Індиго
- **Light**: Starlight, Dawn, Twilight → Зірка, Світанок, Сутінки
- **Nature**: Breeze, Thunder, Frost → Вітерець, Грім, Іній
- **Mystical**: Phoenix, Nova, Oracle → Фенікс, Нова, Віщун

### How to Create Name Pool

See detailed guidelines in [`names/README.md`](names/README.md).

**Key points:**

- Don't mechanically translate English names
- Use names that sound natural in your language
- Mix literal translations with poetic alternatives
- Maintain thematic consistency (color/light/nature)
- Test that names fit in the UI

### For Translators

**You don't need to translate parrot names in the JSON files.** The name system is separate. If you want to contribute names for your language, see the name pool files in `public/locales/names/`.

## Common Pitfalls

### 1. Gender Disagreement ❌

**Problem**: Using wrong gender for adjectives

```json
// Ukrainian - WRONG
"common": { "value": "Звичайний" }  // Masculine

// Ukrainian - CORRECT
"common": { "value": "Звичайна" }  // Feminine (matches папуга)
```

### 2. Noun vs Verb Confusion ❌

**Problem**: Using noun when verb is needed

```json
// Ukrainian - WRONG
"lock": { "value": "Замок" }  // "Lock" as noun

// Ukrainian - CORRECT
"lock": { "value": "Замкнути" }  // "To lock" as imperative verb
```

### 3. Forgetting Placeholders ❌

**Problem**: Removing or translating `{variables}`

```json
// WRONG
"breedCost": { "value": "Costo: 50 monedas" }  // Hardcoded number!

// CORRECT
"breedCost": { "value": "Costo: {cost} monedas" }  // Dynamic
```

### 4. Exceeding Character Limits ❌

**Problem**: Translation too long for UI

```json
// Context says: "Max length: 10 chars"

// TOO LONG (14 chars)
"lock": { "value": "Заблокировать" }

// BETTER (8 chars)
"lock": { "value": "Замкнути" }
```

### 5. Wrong Abbreviations ❌

**Problem**: Keeping English abbreviations

```json
// WRONG (English "m" in Ukrainian)
"minutesAgo": { "value": "{n}m тому" }

// CORRECT (Ukrainian abbreviation)
"minutesAgo": { "value": "{n}хв тому" }
```

### 6. Inconsistent Terminology ❌

**Problem**: Using different words for same concept

```
Tab 1: "Tienda" (store)
Tab 2: "Almacén" (store)  // Inconsistent!
```

**Solution**: Pick one term and stick with it throughout

## Language-Specific Guides

For detailed guidance specific to your language, see:

- **Ukrainian**: [`uk-UA.md`](uk-UA.md)
- **Russian**: [`ru-RU.md`](ru-RU.md)
- **Spanish**: [`es-ES.md`](es-ES.md)
- **French**: [`fr-FR.md`](fr-FR.md)

These guides include:
- Grammar rules specific to your language
- Example translations
- Common mistakes to avoid
- Cultural adaptation tips

## Testing Your Translation

1. **Load the game** with your language selected
2. **Check every tab** (Collection, Store, Breeding, Contests, Gallery, Color Lab)
3. **Test all actions**: Buy, sell, breed, examine, lock, contest
4. **Verify text fits**: No overflow or cut-off text
5. **Check consistency**: Same term used everywhere
6. **Test placeholders**: Make sure `{variables}` are replaced correctly

### Test Checklist

- [ ] Splash screen loads in your language
- [ ] All tabs are translated
- [ ] Button text fits in buttons
- [ ] Toast notifications appear correctly
- [ ] Modal dialogs are fully translated
- [ ] Placeholders show actual values (not `{name}`)
- [ ] Gender agreement is correct
- [ ] No English text remains (except brand name "ChromaWing")

## Getting Help

If you need clarification:

1. **Check `original.json`**: See the original hardcoded text
2. **Check context**: Read the `_context` field carefully
3. **Look at other languages**: See how they handled it
4. **Test in-game**: See it in context
5. **Ask**: Open an issue on GitHub with questions

## Thank You!

Your translation helps make ChromaWing accessible to more players around the world. Quality translations preserve the game's educational value while making it feel natural in your language.

**Happy translating!** 🦜
