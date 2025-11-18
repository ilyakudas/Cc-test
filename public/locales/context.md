# Translation Context Guide

This file provides context and guidelines for translating ChromaWing game content.

## Translation Philosophy

### What Should Be Translated
- ✅ UI text (buttons, labels, messages)
- ✅ Game terminology (when culturally appropriate)
- ✅ Descriptions and instructions
- ✅ Error messages and notifications

### What Should NOT Be Translated
- ❌ Brand name: "ChromaWing"
- ❌ Technical terms: RGB, DNA, alleles (keep scientific)
- ❌ **Parrot names** (use language-specific name pools instead)
- ❌ Placeholder variables: `{name}`, `{cost}`, etc.

## Special Handling: Parrot Names

**IMPORTANT**: Parrot names should **NOT** be directly translated.

### Why Not Translate Names?

1. **Names are identifiers**, not descriptions
2. **Cultural context matters** - "Aurora" doesn't feel right as "Аврора"
3. **Mixed language is awkward** - "Вогонь has beautiful wings" feels wrong
4. **Loss of character** - names have personality that doesn't translate

### Solution: Language-Specific Name Pools

Each language has its own `names.{lang}.json` file with culturally appropriate names:

```
public/locales/names/
├── names.en.json      # English names (Aurora, Blaze, Crystal...)
├── names.uk.json      # Ukrainian names (Зоря, Вогонь, Кришталь...)
├── names.es.json      # Spanish names (Aurora, Llama, Cristal...)
├── names.fr.json      # French names (Aurore, Flamme, Cristal...)
└── names.ru.json      # Russian names (Заря, Пламя, Кристалл...)
```

### Name Selection Guidelines

When creating name pools for your language:

1. **Keep the theme**: Names should evoke color, light, nature, beauty
2. **Use meaningful words**: Not random syllables
3. **Mix literal and poetic**: Combine direct color words with evocative terms
4. **Consider gender**: Some languages need gender-appropriate names
5. **Avoid common human names**: Keep it mystical/nature-themed
6. **Aim for 50+ names**: Provides variety for players

### Name Categories (Inspiration)

**Colors**:
- English: Azure, Crimson, Indigo
- Ukrainian: Блакить (Azure), Багрянець (Crimson), Індиго
- Spanish: Azur, Carmesí, Índigo

**Light/Celestial**:
- English: Aurora, Starlight, Luna
- Ukrainian: Зоря (Star), Світанок (Dawn), Місяць (Moon)
- Spanish: Aurora, Luz Estelar, Luna

**Nature**:
- English: Breeze, Thunder, Cascade
- Ukrainian: Вітерець (Breeze), Грім (Thunder), Каскад
- Spanish: Brisa, Trueno, Cascada

**Mystical**:
- English: Phoenix, Oracle, Mystic
- Ukrainian: Фенікс, Віщун (Oracle), Містик
- Spanish: Fénix, Oráculo, Místico

**Gems/Materials**:
- English: Crystal, Opal, Velvet
- Ukrainian: Кришталь, Опал, Оксамит (Velvet)
- Spanish: Cristal, Ópalo, Terciopelo

## Grammar Considerations

### Gender Agreement

The word "parrot" has different genders in different languages:
- **English**: No grammatical gender
- **Ukrainian**: Папуга (feminine) → use feminine adjectives
- **Spanish**: Papagayo/Papagaya (masculine/feminine) → use feminine for game
- **French**: Perroquet (masculine) → use masculine adjectives
- **Russian**: Попугай (masculine) → use masculine adjectives

**All adjectives describing parrots must match the gender:**

```json
// Ukrainian (feminine)
"rare": { "value": "Рідкісна" }  // -а ending

// Russian (masculine)
"rare": { "value": "Редкий" }    // -ий ending

// Spanish (feminine in game)
"rare": { "value": "Rara" }      // -a ending
```

### Verb Forms

Action buttons should use **imperative mood** (commands):

```json
// English
"examine": { "value": "Examine" }

// Ukrainian
"examine": { "value": "Дослідити" }  // Imperative

// Spanish
"examine": { "value": "Examinar" }   // Infinitive (acceptable in Spanish)

// French
"examine": { "value": "Examiner" }   // Infinitive (standard for French UI)
```

### Abbreviations

Always adapt abbreviations to your language:

```json
// English
"minutesAgo": { "value": "{n}m ago" }

// Ukrainian
"minutesAgo": { "value": "{n}хв тому" }  // хв = хвилин (minutes)

// Spanish
"minutesAgo": { "value": "hace {n}min" }

// French
"minutesAgo": { "value": "il y a {n}min" }
```

## Tone and Style

### Addressing the Player

- **English**: No formal/informal distinction
- **Ukrainian**: Use informal "ти" (you singular)
- **Spanish**: Use informal "tú"
- **French**: Use formal "vous" or informal "tu" (recommend informal for game)
- **Russian**: Use informal "ты"

### Exclamations

Success messages should be enthusiastic:

```json
"breedSuccess": {
  "title": "Breeding successful!",  // Keep excitement with "!"
}
```

### Error Messages

Be clear and helpful, not harsh:

```json
"notEnoughCoins": {
  "title": "Not enough coins!",
  "message": "Breeding costs {cost} coins. You have {current}."  // Informative
}
```

## Technical Terms

### Keep Scientific Terms

These should remain consistent across languages:

- **RGB**: Keep as "RGB" (red, green, blue)
- **DNA**: Keep as "DNA"
- **Genes/Alleles**: Use local scientific term
- **Gradient**: Translate to mathematical/graphics term

### Game-Specific Terms

Translate consistently throughout:

| English | Concept | Translation Approach |
|---------|---------|---------------------|
| Breeding | Combining parrots | Use standard biological term |
| Offspring | Baby parrots | Use appropriate term |
| Generation | Lineage number | Use lineage/generation term |
| Rarity | Uncommonness | Translate directly |
| Beauty | Aesthetic value | Translate directly |
| Contest | Competition | Use competition/contest term |

## Character Length Constraints

Always respect max length specified in `_context`:

```json
"lock": {
  "value": "Lock",
  "_context": "... Max length: 10 chars."
}
```

If your translation is too long:
1. Use shorter synonym
2. Use abbreviation (with context note)
3. Restructure the phrase
4. Ask for guidance if unsure

## Placeholders

Never translate or remove placeholders:

```json
// WRONG
"cost": { "value": "Costo: 50 monedas" }  // Hardcoded!

// CORRECT
"cost": { "value": "Costo: {cost} monedas" }  // Dynamic
```

Common placeholders:
- `{name}`: Parrot name
- `{cost}`: Price/cost amount
- `{count}`: Number of items
- `{n}`: Generic number
- `{placement}`: Contest placement (1st, 2nd, etc.)

## Testing Checklist

Before submitting translations:

- [ ] All `value` fields translated
- [ ] All `_context` fields kept in English
- [ ] Gender agreement correct
- [ ] Verb forms appropriate
- [ ] Abbreviations adapted
- [ ] Placeholders preserved
- [ ] Character limits respected
- [ ] Consistent terminology
- [ ] Tone matches English
- [ ] JSON syntax valid

## Language-Specific Context

For detailed language-specific rules, see:
- [Ukrainian Context](context.uk.md)
- [Spanish Context](context.es.md)
- [French Context](context.fr.md)
- [Russian Context](context.ru.md)

## Name Lists

For creating name pools, see:
- [Name List Guide](names/README.md)
- [English Names](names/names.en.json)
- [Ukrainian Names](names/names.uk.json)
- [Spanish Names](names/names.es.json)
- [French Names](names/names.fr.json)
- [Russian Names](names/names.ru.json)

## Questions?

If you're unsure about:
1. Check `original.json` for the original hardcoded text
2. Read the language-specific context file
3. Look at how other languages handled it
4. Test it in-game
5. Open an issue on GitHub

---

**Thank you for contributing translations to ChromaWing!** 🦜
