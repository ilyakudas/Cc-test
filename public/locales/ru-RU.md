# ChromaWing Russian Translation Guide
# Руководство по переводу ChromaWing на русский язык

[Read general guide first](TRANSLATOR_GUIDE.md) | [Сначала прочитайте общее руководство](TRANSLATOR_GUIDE.md)

---

## Особенности русского языка / Russian Language Specifics

### 1. Род существительных (Gender)

**ВАЖНО**: Слово **"попугай"** — **мужского рода** в русском языке.

**IMPORTANT**: The word **"попугай"** (parrot) is **masculine** in Russian.

Все прилагательные должны согласоваться по роду:

All adjectives must agree in gender:

#### Правильно / Correct ✓

```json
"common": { "value": "Обычный" }        // Мужской род -ый
"rare": { "value": "Редкий" }           // Мужской род -ий
"beautiful": { "value": "Красивый" }    // Мужской род -ый
"locked": { "value": "Закреплён" }      // Мужской род
```

#### Неправильно / Wrong ❌

```json
"common": { "value": "Обычная" }        // Женский род (WRONG!)
"rare": { "value": "Редкая" }           // Женский род (WRONG!)
```

### 2. Глаголы (Verbs)

Для кнопок действий используйте **форму инфинитива** или **повелительное наклонение**:

For action buttons, use **infinitive** or **imperative mood**:

| English | Инфинитив | Повелительная | Рекомендуется |
|---------|-----------|--------------|---------------|
| Examine | Исследовать | Исследуй | **Исследовать** |
| Lock | Закрепить | Закрепи | **Закрепить** |
| Free | Освободить | Освободи | **Освободить** |
| Buy | Купить | Купи | **Купить** |

### 3. Сокращения (Abbreviations)

Используйте русские сокращения:

Use Russian abbreviations:

| English | Русский |
|---------|---------|
| `{n}m ago` | **`{n}мин назад`** |
| `{n}h ago` | **`{n}ч назад`** |
| `{n}d ago` | **`{n}д назад`** |

### 4. Ключевая терминология / Key Terminology

| English | Русский | Примечания |
|---------|---------|------------|
| Parrot | **Попугай** | Мужской род! |
| Breed (verb) | **Разводить** | Глагол |
| Breeding | **Разведение** | Существительное |
| Offspring | **Потомство** | Собирательное |
| Generation | **Поколение** | Не "генерация" |
| Gene | **Ген** | Мн. "гены" |
| Gradient | **Градиент** | Не "деградация" |
| Rarity | **Редкость** | |
| Beauty | **Красота** | |
| Lock | **Закрепить** | НЕ "Замок" (существительное) |

### 5. Примеры / Examples

```json
// Action button
"examine": {
  "value": "Исследовать",
  "_context": "Button to examine parrot genes. Imperative verb. Max length: 15 chars."
}

// Rarity adjective
"legendary": {
  "value": "Легендарный",  // Masculine!
  "_context": "Rarity level: highest tier. Adjective modifies 'parrot' (feminine). Max length: 15 chars."
}
```

---

**Спасибо за перевод!** 🦜
