# Посібник з перекладу ChromaWing на українську мову
# ChromaWing Ukrainian Translation Guide

Ласкаво просимо! Цей посібник допоможе вам створити якісний український переклад гри ChromaWing.

Welcome! This guide will help you create a high-quality Ukrainian translation of ChromaWing.

[Read general guide first](TRANSLATOR_GUIDE.md) | [Спочатку прочитайте загальний посібник](TRANSLATOR_GUIDE.md)

---

## Особливості української мови / Ukrainian Language Specifics

### 1. Рід іменників (Gender)

**КРИТИЧНО ВАЖЛИВО**: У грі слово **"папуга"** — **жіночого роду** в українській мові.

**CRITICALLY IMPORTANT**: The word **"папуга"** (parrot) is **feminine** in Ukrainian.

Всі прикметники **повинні узгоджуватися за родом**:

All adjectives **must agree in gender**:

#### Правильно / Correct ✓

```json
"common": { "value": "Звичайна" }     // -а = feminine ending
"rare": { "value": "Рідкісна" }       // -а = feminine ending
"beautiful": { "value": "Красива" }   // -а = feminine ending
"locked": { "value": "Заблоковано" }  // Neuter past participle (acceptable)
```

#### Неправильно / Wrong ❌

```json
"common": { "value": "Звичайний" }    // -ий = masculine (WRONG!)
"rare": { "value": "Рідкісний" }      // -ий = masculine (WRONG!)
"beautiful": { "value": "Красивий" }  // -ий = masculine (WRONG!)
```

### 2. Дієслова (Verbs)

#### Наказова форма (Imperative Mood)

Для кнопок дій використовуйте **наказову форму** (друга особа однини):

For action buttons, use **imperative mood** (2nd person singular):

| English | Неправильно ❌ | Правильно ✓ | Пояснення |
|---------|---------------|-------------|-----------|
| Examine | Дослідження (noun) | **Дослідити** | Наказова форма |
| Lock | Замок (noun) | **Замкнути** | Наказова форма |
| Unlock | Розблокування (noun) | **Розблокувати** | Наказова форма |
| Free | Вільний (adj) | **Відпустити** | Наказова форма |
| Buy | Купівля (noun) | **Купити** | Наказова форма |
| Sell | Продаж (noun) | **Продати** | Наказова форма |

**Правило**: Якщо в контексті написано `"Imperative verb"`, використовуйте наказову форму.

**Rule**: If context says `"Imperative verb"`, use imperative mood.

### 3. Скорочення (Abbreviations)

Використовуйте українські скорочення, а не англійські:

Use Ukrainian abbreviations, not English ones:

| English | НЕ ❌ | ТАК ✓ |
|---------|------|-------|
| `{n}m ago` | `{n}m тому` | **`{n}хв тому`** |
| `{n}h ago` | `{n}h тому` | **`{n}год тому`** |
| `{n}d ago` | `{n}d тому` | **`{n}д тому`** |
| Auto-Exam | Auto-Exam | **Авто-Аналіз** |

### 4. Регістр літер (Case)

Дотримуйтесь українських правил щодо великих літер:

Follow Ukrainian capitalization rules:

#### Заголовки вкладок / Tab titles
```json
"collection": { "value": "Колекція" }    // Перша буква велика
"store": { "value": "Магазин" }
"breeding": { "value": "Розведення" }
```

#### Назви конкурсів / Contest names
```json
"tier1Name": { "value": "Початкове Шоу Краси" }  // Кожне слово з великої
```

#### Повідомлення / Messages
```json
"breedSuccess": {
  "title": "Успішне розведення!",     // Перша буква велика
  "message": "Народилося 4 пташенят!..."  // Перша буква велика
}
```

### 5. Термінологія (Terminology)

#### Ключові терміни гри / Core Game Terms

| English | Українська | Примітки |
|---------|-----------|----------|
| Parrot | **Папуга** | Жіночий рід! |
| Breed (verb) | **Розводити, Розвести** | Дієслово |
| Breeding (noun) | **Розведення** | Іменник |
| Offspring | **Нащадки** | Множина |
| Generation | **Покоління** | Не "генерація" |
| Gene | **Ген** | Мн. "гени" |
| Allele | **Алель** | Мн. "алелі" |
| Gradient | **Градієнт** | Не "деградація" |
| Solid (color) | **Суцільний (колір)** | Протилежність градієнту |
| Rarity | **Рідкість** / **Рідкісність** | Обидва варіанти прийнятні |
| Beauty | **Краса** | Не "красота" (довше) |
| Laboratory | **Лабораторія** | Можна скоротити до "Лаб" |
| Examine | **Дослідити** | Наказова форма |
| Lock | **Замкнути** | НЕ "Замок" (іменник!) |
| Unlock | **Розблокувати** | Наказова форма |
| Mutation | **Мутація** | Мн. "мутації" |
| Contest | **Конкурс** | Не "змагання" в цьому контексті |
| Store/Shop | **Магазин** | Обидва → "Магазин" |
| Collection | **Колекція** | Не "збірка" |

#### RGB кольори / RGB Colors

```json
"red": { "value": "Червоний" }
"green": { "value": "Зелений" }
"blue": { "value": "Синій" }

// Канали / Channels
"redChannel": { "value": "Червоний канал" }
"greenChannel": { "value": "Зелений канал" }
"blueChannel": { "value": "Синій канал" }
```

#### Частини тіла / Body Parts

```json
"wings": { "value": "Крила" }
"specialWing": { "value": "Особливі крила" }
"body": { "value": "Тіло" }
"head": { "value": "Голова" }
"tail": { "value": "Хвіст" }
"accents": { "value": "Акценти" }
```

### 6. Поширені помилки (Common Mistakes)

#### ❌ Помилка 1: Неправильний рід

```json
// НЕПРАВИЛЬНО
"rare": { "value": "Рідкісний" }  // Чоловічий рід

// ПРАВИЛЬНО
"rare": { "value": "Рідкісна" }   // Жіночий рід (папуга)
```

#### ❌ Помилка 2: Іменник замість дієслова

```json
// НЕПРАВИЛЬНО
"lock": { "value": "Замок" }  // Іменник (замок на дверях/фортеця)

// ПРАВИЛЬНО
"lock": { "value": "Замкнути" }  // Дієслово в наказовій формі
```

#### ❌ Помилка 3: Англійські скорочення

```json
// НЕПРАВИЛЬНО
"minutesAgo": { "value": "{n}m тому" }  // Англійське "m"

// ПРАВИЛЬНО
"minutesAgo": { "value": "{n}хв тому" }  // Українське "хв"
```

#### ❌ Помилка 4: Забуті змінні

```json
// НЕПРАВИЛЬНО
"breedCost": { "value": "Вартість: 50 монет" }  // Захардкоджено!

// ПРАВИЛЬНО
"breedCost": { "value": "Вартість: {cost} монет" }  // Динамічно
```

#### ❌ Помилка 5: Надто довгий текст

```json
// НЕПРАВИЛЬНО (12 символів, ліміт 10)
"lock": { "value": "Заблокувати" }

// ПРАВИЛЬНО (8 символів)
"lock": { "value": "Замкнути" }
```

### 7. Стиль і тон (Style & Tone)

#### Успішні повідомлення (Success Messages)

Використовуйте знак оклику для ентузіазму:

```json
"breedSuccess": {
  "title": "Успішне розведення!",  // Знак оклику!
  "message": "Народилося 4 пташенят!..."
}
```

#### Помилки (Error Messages)

Будьте інформативними та дружніми:

```json
"breedNotEnoughCoins": {
  "title": "Недостатньо монет!",
  "message": "Розведення коштує {cost} монет. У тебе є {current}."
}
```

#### Звертання до гравця (Addressing the Player)

Використовуйте **неформальне "ти"** (2-га особа однини):

```json
"clickToView": { "value": "Клікни на папугу для деталей" }  // "ти"
// НЕ: "Клікніть" (формальне "ви")
```

### 8. Приклади перекладів (Translation Examples)

#### Приклад 1: Кнопка дії

```json
// English
"examine": {
  "value": "Examine",
  "_context": "Button to examine parrot genes. Imperative verb. Max length: 15 chars."
}

// Українська
"examine": {
  "value": "Дослідити",
  "_context": "Button to examine parrot genes. Imperative verb. Max length: 15 chars."
}
```

**Пояснення**:
- ✓ Наказова форма: "Дослідити"
- ✓ Довжина: 10 символів (< 15)
- ✗ НЕ "Дослідження" (іменник)

#### Приклад 2: Рівень рідкості

```json
// English
"legendary": {
  "value": "Legendary",
  "_context": "Rarity level: highest tier. Adjective modifies 'parrot' (feminine). Max length: 15 chars."
}

// Українська
"legendary": {
  "value": "Легендарна",
  "_context": "Rarity level: highest tier. Adjective modifies 'parrot' (feminine). Max length: 15 chars."
}
```

**Пояснення**:
- ✓ Жіночий рід: "Легендарна" (-а)
- ✓ Узгоджується з "папуга"
- ✗ НЕ "Легендарний" (чоловічий рід)

#### Приклад 3: Повідомлення з плейсхолдерами

```json
// English
"parrotJoined": {
  "title": "{name} joined your collection!",
  "message": "{rarity} • Gen {generation} • -{price} coins"
}

// Українська
"parrotJoined": {
  "title": "{name} приєдналася до твоєї колекції!",
  "message": "{rarity} • Покоління {generation} • -{price} монет"
}
```

**Пояснення**:
- ✓ Збережені плейсхолдери: `{name}`, `{rarity}`, `{generation}`, `{price}`
- ✓ "Приєдналася" (жіночий рід - папуга приєдналася)
- ✓ Неформальне звертання: "твоєї" (не "вашої")

### 9. Контрольний список (Checklist)

Перед відправкою перекладу перевірте:

Before submitting your translation, verify:

- [ ] Всі прикметники узгоджені за родом (жіночий для "папуга")
- [ ] Дієслова в наказовій формі для кнопок
- [ ] Українські скорочення (хв, год, д)
- [ ] Збережені всі `{плейсхолдери}`
- [ ] Текст не перевищує ліміт символів
- [ ] Використовується неформальне "ти"
- [ ] Послідовна термінологія
- [ ] Знаки оклику в успішних повідомленнях
- [ ] JSON синтаксис валідний

### 10. Корисні ресурси (Useful Resources)

#### Словники

- [Словник термінів генетики](https://genetics.gov.ua/terminology) (якщо існує)
- [Український правопис](https://pravopys.net)

#### Інструменти перевірки

```bash
# Перевірити JSON на валідність
python3 -m json.tool uk.json

# Підрахувати символи
echo -n "Замкнути" | wc -m
```

### 11. Питання? (Questions?)

Якщо у вас виникли питання:

If you have questions:

1. Перевірте `original.json` для оригінального тексту
2. Подивіться на інші переклади (російський, англійський)
3. Протестуйте в грі
4. Відкрийте Issue на GitHub

## Дякуємо! / Thank You!

Ваш переклад допомагає зробити ChromaWing доступною для українськомовних гравців!

Your translation helps make ChromaWing accessible to Ukrainian-speaking players!

**Успіхів у перекладі!** 🦜
