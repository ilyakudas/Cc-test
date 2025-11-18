# Ukrainian Translation Context
# Контекст перекладу українською

[Main Context Guide](context.md) | [Головний посібник](context.md)

---

## Quick Reference / Швидкий довідник

### Gender / Рід
- **Папуга** = feminine (жіночий рід)
- All adjectives → feminine endings (-а, -на)

```json
✓ "Рідкісна"  // feminine
✗ "Рідкісний" // masculine (WRONG)
```

### Verb Forms / Форми дієслів
- Action buttons → imperative mood (наказова форма)

```json
✓ "Дослідити"   // imperative: to examine
✗ "Дослідження" // noun: examination
```

### Abbreviations / Скорочення
```json
"{n}m ago"  → "{n}хв тому"  // хвилин
"{n}h ago"  → "{n}год тому" // годин
"{n}d ago"  → "{n}д тому"   // днів
```

### Addressing Player / Звертання до гравця
- Use informal **"ти"** (not "ви")

```json
✓ "Клікни на папугу"    // informal ти
✗ "Клікніть на папугу"  // formal ви
```

---

## Key Terms / Ключові терміни

| English | Українська | Notes |
|---------|-----------|-------|
| Parrot | **Папуга** | Жіночий рід! |
| Breed | **Розвести** | Дієслово |
| Breeding | **Розведення** | Іменник |
| Offspring | **Нащадки** | Множина |
| Generation | **Покоління** | Не "генерація" |
| Gene | **Ген** | Мн. "гени" |
| Gradient | **Градієнт** | |
| Solid | **Суцільний** | Протилежність градієнту |
| Rarity | **Рідкість** | |
| Beauty | **Краса** | Не "красота" (коротше) |
| Lock | **Замкнути** | НЕ "Замок" (іменник) |
| Unlock | **Розблокувати** | |
| Examine | **Дослідити** | |
| Contest | **Конкурс** | |

---

## Parrot Names / Імена папуг

**DO NOT translate parrot names directly!**
**НЕ перекладайте імена папуг напряму!**

❌ Wrong:
```
Aurora → Аврора
Blaze → Полум'я
Crystal → Кришталь
```

✓ Correct approach:
Create culturally appropriate Ukrainian names in `names.uk.json`:
```
Зоря (Star)
Вогонь (Fire)
Кришталь (Crystal)
Світанок (Dawn)
Місячко (Little Moon)
```

See [names/names.uk.json](names/names.uk.json) for the full list.

---

## Common Mistakes / Поширені помилки

### 1. Wrong Gender
```json
❌ "rare": { "value": "Рідкісний" }    // masculine
✓ "rare": { "value": "Рідкісна" }     // feminine
```

### 2. Noun Instead of Verb
```json
❌ "lock": { "value": "Замок" }        // noun
✓ "lock": { "value": "Замкнути" }     // imperative verb
```

### 3. English Abbreviations
```json
❌ "minutesAgo": { "value": "{n}m тому" }  // English "m"
✓ "minutesAgo": { "value": "{n}хв тому" } // Ukrainian "хв"
```

### 4. Formal Address
```json
❌ "clickToView": { "value": "Клікніть для перегляду" }  // formal
✓ "clickToView": { "value": "Клікни для перегляду" }    // informal
```

---

## Name Categories for Ukrainian / Категорії імен

When creating parrot names, use these themes:

**Кольори (Colors)**:
Блакить, Багрянець, Золото, Срібло, Бурштин

**Світло/Небесні (Light/Celestial)**:
Зоря, Зірка, Світанок, Місячко, Сяйво

**Природа (Nature)**:
Вітерець, Грім, Каскад, Джерело, Іскра

**Містичні (Mystical)**:
Фенікс, Віщун, Чарівник, Магія, Таємниця

**Коштовності (Gems)**:
Кришталь, Опал, Сапфір, Смарагд, Перлина

---

## Testing / Тестування

- [ ] Всі прикметники — жіночий рід
- [ ] Дієслова в наказовій формі
- [ ] Українські скорочення (хв, год, д)
- [ ] Неформальне звертання (ти)
- [ ] Збережені {плейсхолдери}
- [ ] Терміни узгоджені по всьому тексту

---

**Дякуємо за переклад!** 🦜
