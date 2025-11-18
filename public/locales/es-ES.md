# ChromaWing Spanish Translation Guide
# Guía de Traducción al Español de ChromaWing

[Read general guide first](TRANSLATOR_GUIDE.md) | [Lee primero la guía general](TRANSLATOR_GUIDE.md)

---

## Particularidades del Español / Spanish Language Specifics

### 1. Género (Gender)

**CRÍTICO**: La palabra **"papagayo/papagaya"** tiene **género femenino** en el contexto del juego.

**CRITICAL**: The word **"papagayo/papagaya"** (parrot) should use **feminine gender** in game context.

Usamos **"papagaya"** (femenino) en el juego, por lo tanto todos los adjetivos deben concordar:

We use **"papagaya"** (feminine) in the game, so all adjectives must agree:

#### Correcto / Correct ✓

```json
"common": { "value": "Común" }         // Works for both genders
"rare": { "value": "Rara" }            // Feminine -a ending
"beautiful": { "value": "Hermosa" }    // Feminine -a ending
"locked": { "value": "Bloqueada" }     // Feminine past participle
```

#### Incorrecto / Wrong ❌

```json
"rare": { "value": "Raro" }            // Masculine (WRONG!)
"beautiful": { "value": "Hermoso" }    // Masculine (WRONG!)
```

### 2. Verbos (Verbs)

Para botones de acción, usa el **infinitivo** o **imperativo**:

For action buttons, use **infinitive** or **imperative**:

| English | Español (Infinitivo) | Español (Imperativo) | Recomendado |
|---------|---------------------|---------------------|-------------|
| Examine | Examinar | Examina | **Examinar** |
| Lock | Bloquear | Bloquea | **Bloquear** |
| Free | Liberar | Libera | **Liberar** |
| Buy | Comprar | Compra | **Comprar** |

**Nota**: En español, el infinitivo en botones es más común y neutral.

**Note**: In Spanish, infinitive in buttons is more common and neutral.

### 3. Abreviaturas (Abbreviations)

Usa abreviaturas en español:

Use Spanish abbreviations:

| English | Español |
|---------|---------|
| `{n}m ago` | **`hace {n}min`** or **`{n}min`** |
| `{n}h ago` | **`hace {n}h`** |
| `{n}d ago` | **`hace {n}d`** |

### 4. Terminología Clave / Key Terminology

| English | Español | Notas |
|---------|---------|-------|
| Parrot | **Papagaya** | ¡Femenino! |
| Breed (verb) | **Criar** / **Cruzar** | Ambos aceptables |
| Breeding | **Cría** / **Cruce** | Sustantivo |
| Offspring | **Crías** | Plural |
| Generation | **Generación** | Gen {n} = Gen {n} |
| Gene | **Gen** | Plural "genes" |
| Gradient | **Degradado** | No "degradación" |
| Rarity | **Rareza** | |
| Beauty | **Belleza** | |
| Lock | **Bloquear** | NO "Cerradura" (noun) |

### 5. Ejemplos / Examples

```json
// Action button
"examine": {
  "value": "Examinar",
  "_context": "Button to examine parrot genes. Imperative verb. Max length: 15 chars."
}

// Rarity adjective
"legendary": {
  "value": "Legendaria",  // Feminine!
  "_context": "Rarity level: highest tier. Adjective modifies 'parrot' (feminine). Max length: 15 chars."
}
```

---

**¡Gracias por traducir!** 🦜
