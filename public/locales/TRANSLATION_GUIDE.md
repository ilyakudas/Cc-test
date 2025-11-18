# ChromaWing Translation Guide

This guide explains how to create new language translations for ChromaWing using LLM assistance.

## Overview

ChromaWing uses a JSON-based localization system where each language has its own JSON file in the `public/locales/` directory.

## Translation Files

- **en.json** - English (base/source language)
- **es.json** - Spanish
- **fr.json** - French
- **ru.json** - Russian
- **uk.json** - Ukrainian

## LLM Translation Prompt

Use this prompt template to generate translations:

```
You are translating the ChromaWing game localization file from English to [TARGET LANGUAGE].

GAME CONTEXT:
ChromaWing is a parrot breeding genetics game where players:
- Breed parrots with RGB (Red/Green/Blue) color genetics
- Compete in beauty contests
- Explore Mendelian inheritance through gameplay
- Manage a collection of parrots with different rarities
- Examine genetic makeup of parrots in a laboratory

TRANSLATION REQUIREMENTS:
1. Translate ONLY the "value" fields in the JSON
2. Keep ALL "_context" fields unchanged (they are for your reference)
3. Keep ALL placeholders like {name}, {cost}, {count} unchanged
4. Respect the max character length specified in _context
5. Maintain the gaming/casual tone
6. DO NOT translate:
   - "ChromaWing" (it's a brand name)
   - "RGB" (technical term)
   - Emoji icons (🦜, 💰, etc.)
   - Technical genetic terms unless culturally appropriate

7. Cultural adaptation:
   - Use appropriate formality level for the target language
   - Adapt idioms and expressions to feel natural
   - Maintain clarity for game mechanics

8. Special considerations:
   - Body part names should be scientifically accurate (wings, tail, head, body, accents)
   - Contest names can be creatively adapted while keeping the theme
   - Toast messages should be concise and clear

9. Output ONLY valid JSON in the exact same structure as the input

TARGET LANGUAGE: [Spanish/French/Russian/Ukrainian]

INPUT JSON:
[Paste en.json here]

Please provide the complete translated JSON file.
```

## Specific Language Notes

### Spanish (es.json)
- Use "tú" form (informal) for better engagement
- "Parrots" → "Loros"
- "Buy" → "Comprar"
- "Coins" → "Monedas"

### French (fr.json)
- Use "tu" form (informal)
- "Parrots" → "Perroquets"
- "Buy" → "Acheter"
- "Coins" → "Pièces"

### Russian (ru.json)
- Be mindful of cases (nominative, genitive, etc.)
- "Parrots" → "Попугаи"
- "Buy" → "Купить"
- "Coins" → "Монеты"
- Watch for plural forms with numbers

### Ukrainian (uk.json)
- Similar to Russian but with Ukrainian specifics
- "Parrots" → "Папуги"
- "Buy" → "Купити"
- "Coins" → "Монети"
- Watch for plural forms with numbers

## Validation

After generating a translation:

1. **JSON Validation**: Ensure the file is valid JSON
   ```bash
   node -e "console.log(JSON.parse(require('fs').readFileSync('./public/locales/es.json')))"
   ```

2. **Character Length**: Check that translations respect max length constraints
   - Longer languages (German, French) may need creative abbreviations
   - Shorter languages (Chinese) usually have room to spare

3. **Placeholder Check**: Verify all placeholders are preserved
   ```bash
   grep -o '{[a-z]*}' public/locales/en.json | sort -u
   grep -o '{[a-z]*}' public/locales/es.json | sort -u
   # These should match!
   ```

4. **Testing**: Load the game with the new language and verify:
   - All strings appear correctly
   - No untranslated keys show up
   - Character lengths fit in UI elements
   - Tone and clarity are appropriate

## Adding a New Language

To add support for a language not listed:

1. Add language code to `SUPPORTED_LANGUAGES` in `public/js/lib/i18n.js`:
   ```javascript
   const SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'ru', 'uk', 'de'];  // Added German
   ```

2. Create `public/locales/[code].json` using the LLM prompt above

3. Test thoroughly in-game

4. Update this guide with language-specific notes

## Common Translation Patterns

### Buttons and Actions
```json
"buy": {
  "value": "Buy",
  "_context": "Button text to purchase a parrot in the shop. Synonym: purchase. Max length: 10 chars."
}
```
- Keep button text short and action-oriented
- Use infinitive form (Buy, Sell) or imperative depending on language

### Toast Notifications
```json
"breedSuccess": {
  "title": "Breeding successful!",
  "message": "4 new chicks born!{examInfo} {total} total waiting in Breeding Lab.",
  "_context": "Success notification after breeding. {examInfo} and {total} are replaced with values."
}
```
- Title should be celebratory/informative
- Message can be longer but should still be concise
- Maintain the structure with placeholders

### Body Parts and Scientific Terms
```json
"wings": {
  "value": "Wings",
  "_context": "Body part name: wings of a bird. Displayed in genetics panel. Max length: 20 chars."
}
```
- Use scientifically accurate terms
- Consider both common and technical names
- Prioritize clarity over brevity

## Tips for Quality Translations

1. **Play the game first** in English to understand context
2. **Read all _context fields** before translating
3. **Test in the UI** to see how translations look
4. **Get native speaker review** if possible
5. **Maintain consistency** in terminology throughout
6. **Adapt, don't just translate** - make it feel native

## Troubleshooting

### Translation not appearing
- Check browser console for errors
- Verify JSON is valid
- Confirm language code matches filename
- Clear browser cache

### Text overflows UI
- Shorten translation
- Use abbreviations if appropriate
- Check _context for max length

### Placeholders not working
- Ensure {placeholder} syntax is exact
- Don't translate the placeholder names
- Don't add/remove spaces around placeholders

## Questions?

If you have questions about translation context or need clarification on any game terms, please ask in the project repository issues.
