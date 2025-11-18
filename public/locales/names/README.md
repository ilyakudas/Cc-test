# Parrot Name Lists

This directory contains culturally appropriate parrot names for each language.

## Philosophy

**Parrot names should NOT be directly translated.** Instead, each language has its own pool of culturally appropriate names that match the game's theme.

### Why Not Translate Names?

1. **Names are identifiers**, not descriptions
2. **Cultural context matters** - Translation loses personality
3. **Mixed language is awkward** - English UI with translated names feels wrong
4. **Character is lost** - "Aurora" ≠ "Аврора" in feel

## Name Themes

All parrot names should evoke:
- ✨ **Color and light**
- 🌟 **Celestial and nature**
- 💎 **Gems and materials**
- 🔮 **Mystical and magical**
- 🌈 **Beautiful and poetic**

### Avoid
- ❌ Common human names (John, Maria, etc.)
- ❌ Random syllables without meaning
- ❌ Technical or scientific terms
- ❌ Pop culture references

## File Format

Each language has a JSON file:

```json
{
  "_meta": {
    "language": "Language Name",
    "code": "xx",
    "count": 50,
    "notes": "Any special notes about these names"
  },
  "names": [
    "Name1",
    "Name2",
    ...
  ]
}
```

## Name Categories

### Colors
Evoke specific colors or color concepts
- English: Azure, Crimson, Indigo
- Ukrainian: Блакить, Багрянець, Індиго
- Spanish: Azur, Carmesí, Índigo

### Light/Celestial
Sun, moon, stars, dawn, twilight
- English: Aurora, Starlight, Luna
- Ukrainian: Зоря, Світанок, Місяць
- Spanish: Aurora, Luz Estelar, Luna

### Nature
Weather, elements, natural phenomena
- English: Breeze, Thunder, Cascade
- Ukrainian: Вітерець, Грім, Каскад
- Spanish: Brisa, Trueno, Cascada

### Mystical
Magic, mystery, mythology
- English: Phoenix, Oracle, Mystic
- Ukrainian: Фенікс, Віщун, Містик
- Spanish: Fénix, Oráculo, Místico

### Gems/Materials
Precious stones, beautiful materials
- English: Crystal, Opal, Velvet
- Ukrainian: Кришталь, Опал, Оксамит
- Spanish: Cristal, Ópalo, Terciopelo

## Guidelines for Creating Name Lists

### 1. Aim for 50+ Names
Provides variety for players without repetition

### 2. Mix Literal and Poetic
Combine direct translations with evocative terms

**Example (Ukrainian):**
- Literal: Вогонь (Fire), Крижина (Ice)
- Poetic: Світанок (Dawn), Чарівність (Magic)

### 3. Consider Gender (if applicable)
In languages with grammatical gender, you can:
- Use gender-neutral names
- Mix masculine and feminine
- Note gender in _meta if important

### 4. Keep Cultural Appropriateness
Names should feel natural in your language

### 5. Test Pronunciation
Make sure names are easy to say and remember

### 6. Check for Conflicts
Avoid names that:
- Sound like swear words
- Have negative connotations
- Are too similar to each other

## Language-Specific Guides

- [English Names](names.en.json) - Original English name pool
- [Ukrainian Names](names.uk.json) - Українські імена
- [Spanish Names](names.es.json) - Nombres españoles
- [French Names](names.fr.json) - Noms français
- [Russian Names](names.ru.json) - Русские имена

## Implementation

Names are loaded dynamically based on the current game language. See `public/js/lib/i18n.js` for implementation details.

## Contributing

When adding a new language, create `names.{lang}.json` following the format above. Aim for at least 50 names to match the English pool.

---

**Thank you for helping make ChromaWing feel natural in every language!** 🦜
