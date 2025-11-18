# ChromaWing French Translation Guide
# Guide de Traduction Française pour ChromaWing

[Read general guide first](TRANSLATOR_GUIDE.md) | [Lisez d'abord le guide général](TRANSLATOR_GUIDE.md)

---

## Particularités du Français / French Language Specifics

### 1. Genre (Gender)

**CRITIQUE** : Le mot **"perroquet"** est **masculin** en français.

**CRITICAL**: The word **"perroquet"** (parrot) is **masculine** in French.

Tous les adjectifs doivent s'accorder en genre :

All adjectives must agree in gender:

#### Correct ✓

```json
"common": { "value": "Commun" }        // Masculin
"rare": { "value": "Rare" }            // Masculin (same form)
"beautiful": { "value": "Magnifique" } // Masculin (same form)
"locked": { "value": "Verrouillé" }    // Masculin
```

#### Incorrect ❌

```json
"common": { "value": "Commune" }       // Féminin (WRONG!)
"locked": { "value": "Verrouillée" }   // Féminin (WRONG!)
```

### 2. Verbes (Verbs)

Pour les boutons d'action, utilisez **l'infinitif** :

For action buttons, use **infinitive**:

| English | Français (Infinitif) | Français (Impératif) | Recommandé |
|---------|---------------------|---------------------|------------|
| Examine | Examiner | Examinez | **Examiner** |
| Lock | Verrouiller | Verrouillez | **Verrouiller** |
| Free | Libérer | Libérez | **Libérer** |
| Buy | Acheter | Achetez | **Acheter** |

**Note** : En français, l'infinitif dans les boutons est plus courant.

**Note**: In French, infinitive in buttons is more common.

### 3. Abréviations (Abbreviations)

Utilisez des abréviations françaises :

Use French abbreviations:

| English | Français |
|---------|----------|
| `{n}m ago` | **`il y a {n}min`** |
| `{n}h ago` | **`il y a {n}h`** |
| `{n}d ago` | **`il y a {n}j`** |

### 4. Terminologie Clé / Key Terminology

| English | Français | Notes |
|---------|----------|-------|
| Parrot | **Perroquet** | Masculin ! |
| Breed (verb) | **Élever** / **Croiser** | Les deux acceptables |
| Breeding | **Élevage** / **Croisement** | Nom |
| Offspring | **Descendants** | Pluriel |
| Generation | **Génération** | |
| Gene | **Gène** | Pluriel "gènes" |
| Gradient | **Dégradé** | Pas "dégradation" |
| Rarity | **Rareté** | |
| Beauty | **Beauté** | |
| Lock | **Verrouiller** | PAS "Verrou" (nom) |

### 5. Exemples / Examples

```json
// Action button
"examine": {
  "value": "Examiner",
  "_context": "Button to examine parrot genes. Imperative verb. Max length: 15 chars."
}

// Rarity adjective
"legendary": {
  "value": "Légendaire",  // Same form for masculine/feminine
  "_context": "Rarity level: highest tier. Adjective modifies 'parrot' (feminine). Max length: 15 chars."
}
```

---

**Merci de traduire !** 🦜
