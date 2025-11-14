# Module Structure Reference

## Overview

This document provides a detailed reference for every module in the ChromaWing codebase, including responsibilities, exports, dependencies, and usage examples.

## Directory Tree

```
public/js/
├── core/               # Core game logic and state (4 modules)
│   ├── gameState.js
│   ├── parrot.js
│   ├── genetics.js
│   └── storage.js
│
├── actions/            # User action handlers (7 modules)
│   ├── breeding.js
│   ├── selection.js
│   ├── trading.js
│   ├── collection.js
│   ├── laboratory.js
│   ├── offspring.js
│   └── settings.js
│
├── ui/                 # UI rendering (8 modules)
│   ├── core.js
│   ├── tabs.js
│   ├── stats.js
│   ├── parrotCard.js
│   ├── breedingSlots.js
│   ├── parrotGrid.js
│   ├── preview.js
│   └── mutations.js
│
├── lib/                # Shared utilities (6 modules)
│   ├── notifications.js
│   ├── svg.js
│   ├── utils.js
│   ├── constants.js
│   ├── achievements.js
│   └── contests.js
│
└── main.js             # Application entry point
```

---

## Core Modules

### core/gameState.js

**Purpose:** Centralized game state management. Single source of truth for all game data.

**Size:** ~402 lines

**Exports:**
```javascript
// Getters
export function getParrots()
export function getStoreParrots()
export function getRecentOffspring()
export function getCoins()
export function getBreedingPair()
export function getSelectedParrotId()
export function getCurrentTab()
export function getParrotIdCounter()
export function getExaminedParrots()
export function getLockedParrots()
export function getMutationsEnabled()
export function getAutoExamineEnabled()

// Setters
export function setParrots(parrots)
export function setStoreParrots(parrots)
export function setRecentOffspring(offspring)
export function addCoins(amount)
export function setCoins(amount)
export function setBreedingPair(pair)
export function setSelectedParrotId(id)
export function setCurrentTab(tab)
export function setParrotIdCounter(counter)
export function setExaminedParrots(set)
export function setLockedParrots(set)
export function setMutationsEnabled(enabled)
export function setAutoExamineEnabled(enabled)

// Mutations
export function addParrot(parrot)
export function removeParrot(id)
export function addStoreParrot(parrot)
export function clearStoreParrots()
export function addRecentOffspring(parrot)
export function removeRecentOffspring(id)
export function clearRecentOffspring()
export function addExaminedParrot(id)
export function isParrotExamined(id)
export function addLockedParrot(id)
export function removeLockedParrot(id)
export function isParrotLocked(id)
export function incrementParrotIdCounter()
```

**Dependencies:** None (pure state)

**Usage Example:**
```javascript
import * as GameState from '../core/gameState.js';

// Get data
const parrots = GameState.getParrots();
const coins = GameState.getCoins();

// Update data
GameState.addParrot(newParrot);
GameState.setCoins(100);
```

**State Structure:**
```javascript
{
  parrots: [],              // Player's collection
  storeParrots: [],         // Available for purchase
  recentOffspring: [],      // Recent breeding results
  coins: 100,
  breedingPair: { left: null, right: null },
  selectedParrotId: null,
  currentTab: 'collection',
  parrotIdCounter: 1,
  examinedParrots: Set,
  lockedParrots: Set,
  mutationsEnabled: true,
  autoExamineEnabled: false
}
```

---

### core/parrot.js

**Purpose:** Parrot class and parrot-specific methods.

**Size:** ~464 lines

**Exports:**
```javascript
export class Parrot {
  constructor(genes, id, name, generation)
  getValue()
  toJSON()
  static fromJSON(json)
}
```

**Dependencies:**
- `lib/constants.js`

**Usage Example:**
```javascript
import { Parrot } from '../core/parrot.js';

const parrot = new Parrot(genes, id, name, generation);
const value = parrot.getValue();
const json = parrot.toJSON();
```

---

### core/genetics.js

**Purpose:** Genetic breeding algorithms and gene manipulation.

**Size:** ~65 lines

**Exports:**
```javascript
export function breedParrotGenes(parent1Genes, parent2Genes, mutationsEnabled)
```

**Dependencies:**
- `lib/constants.js`

**Usage Example:**
```javascript
import { breedParrotGenes } from '../core/genetics.js';

const offspringGenes = breedParrotGenes(
  parent1.genes,
  parent2.genes,
  mutationsEnabled
);
```

---

### core/storage.js

**Purpose:** Save/load game state using localStorage.

**Size:** ~252 lines

**Exports:**
```javascript
export function saveGame()
export function loadGame()
export function newGame()
```

**Dependencies:**
- `core/gameState.js`
- `core/parrot.js`

**Usage Example:**
```javascript
import { saveGame, loadGame } from '../core/storage.js';

// Save current state
saveGame();

// Load saved state
const loaded = loadGame(); // Returns true if save found

// Start new game
newGame();
```

**Features:**
- localStorage storage (5-10MB limit)
- Automatic migration from old cookie saves
- Validation and error handling
- Extensive logging for debugging

---

## Action Modules

### actions/breeding.js

**Purpose:** Breeding slot management and breeding logic.

**Size:** ~100 lines

**Exports:**
```javascript
export async function breedOnLeft(parrotId)
export async function breedOnRight(parrotId)
export async function removeFromSlot(slot)
export async function breedParrots(saveGameFn, checkAchievementsFn)
```

**Dependencies:**
- `core/gameState.js`
- `core/parrot.js`
- `core/genetics.js`
- `lib/notifications.js`
- `lib/utils.js`
- `ui/breedingSlots.js`
- `ui/parrotGrid.js`

**Usage Example:**
```javascript
import { breedOnLeft, breedParrots } from '../actions/breeding.js';

// Select breeding parents
await breedOnLeft(parrotId);
await breedOnRight(parrotId);

// Breed
await breedParrots(saveGame, checkAchievements);
```

---

### actions/selection.js

**Purpose:** Parrot selection handling.

**Size:** ~30 lines

**Exports:**
```javascript
export async function selectParrot(parrotId)
```

**Dependencies:**
- `core/gameState.js`
- `ui/core.js`
- `ui/preview.js`

**Usage Example:**
```javascript
import { selectParrot } from '../actions/selection.js';

await selectParrot(parrotId);
```

---

### actions/trading.js

**Purpose:** Buy/sell parrot actions with hold-to-sell mechanic.

**Size:** ~150 lines

**Exports:**
```javascript
export function buyParrot(parrotId, saveGameFn, checkAchievementsFn)
export function startSellHold(parrotId, event, saveGameFn)
export function cancelSellHold()
```

**Dependencies:**
- `core/gameState.js`
- `core/parrot.js`
- `lib/notifications.js`
- `ui/core.js`

**Usage Example:**
```javascript
import { buyParrot, startSellHold, cancelSellHold } from '../actions/trading.js';

// Buy from store
buyParrot(parrotId, saveGame, checkAchievements);

// Sell with hold mechanic
startSellHold(parrotId, event, saveGame);
cancelSellHold();
```

**Features:**
- Hold-to-sell mechanic (prevent accidental sales)
- Lock check (can't sell locked parrots)
- Animated progress bar

---

### actions/collection.js

**Purpose:** Collection management (free, lock parrots).

**Size:** ~120 lines

**Exports:**
```javascript
export function freeParrot(parrotId, saveGameFn)
export async function toggleLockParrot(parrotId, saveGameFn)
```

**Dependencies:**
- `core/gameState.js`
- `lib/notifications.js`
- `ui/core.js`
- `ui/breedingSlots.js`

**Usage Example:**
```javascript
import { freeParrot, toggleLockParrot } from '../actions/collection.js';

// Release parrot
freeParrot(parrotId, saveGame);

// Lock/unlock parrot
await toggleLockParrot(parrotId, saveGame);
```

---

### actions/laboratory.js

**Purpose:** Laboratory examination system.

**Size:** ~400 lines

**Exports:**
```javascript
export async function openLaboratory(parrotId)
export async function performExamination(parrotId, saveGameFn)
export function closeModal()
```

**Dependencies:**
- `core/gameState.js`
- `core/parrot.js`
- `lib/notifications.js`
- `lib/svg.js`
- `lib/constants.js`

**Usage Example:**
```javascript
import { openLaboratory, performExamination, closeModal } from '../actions/laboratory.js';

// Open laboratory for parrot
await openLaboratory(parrotId);

// Perform examination (costs coins)
await performExamination(parrotId, saveGame);

// Close laboratory
closeModal();
```

**Features:**
- Gene examination (reveals hidden genes)
- Costs coins to examine
- Auto-examine option
- Detailed gene display

---

### actions/offspring.js

**Purpose:** Offspring management (move to collection, sell, dismiss).

**Size:** ~150 lines

**Exports:**
```javascript
export async function moveOffspringToCollection(saveGameFn)
export async function sellAllOffspring(saveGameFn)
export async function dismissOffspring(saveGameFn)
```

**Dependencies:**
- `core/gameState.js`
- `lib/notifications.js`
- `ui/core.js`

**Usage Example:**
```javascript
import { moveOffspringToCollection, sellAllOffspring, dismissOffspring } from '../actions/offspring.js';

// Move all offspring to collection
await moveOffspringToCollection(saveGame);

// Sell all unlocked offspring
await sellAllOffspring(saveGame);

// Dismiss all unlocked offspring
await dismissOffspring(saveGame);
```

**Features:**
- Lock protection (locked offspring safe from sell/dismiss)
- Informative toast messages
- Batch operations

---

### actions/settings.js

**Purpose:** Game settings toggles.

**Size:** ~75 lines

**Exports:**
```javascript
export function toggleMutations(saveGameFn)
export function toggleAutoExamine(saveGameFn)
```

**Dependencies:**
- `core/gameState.js`
- `ui/mutations.js`

**Usage Example:**
```javascript
import { toggleMutations, toggleAutoExamine } from '../actions/settings.js';

toggleMutations(saveGame);
toggleAutoExamine(saveGame);
```

---

## UI Modules

### ui/core.js

**Purpose:** Main UI orchestration and update coordination.

**Size:** ~20 lines

**Exports:**
```javascript
export async function updateUI()
```

**Dependencies:**
- `ui/stats.js`
- `ui/parrotGrid.js`
- `ui/breedingSlots.js`
- `ui/preview.js`

**Usage Example:**
```javascript
import { updateUI } from '../ui/core.js';

// Refresh entire UI
await updateUI();
```

**Note:** This is the main entry point for UI updates. Calls all sub-renderers.

---

### ui/tabs.js

**Purpose:** Tab navigation handling.

**Size:** ~50 lines

**Exports:**
```javascript
export function switchTab(tab, event, renderContestsFn)
```

**Dependencies:**
- `core/gameState.js`
- `ui/core.js`

**Usage Example:**
```javascript
import { switchTab } from '../ui/tabs.js';

switchTab('breeding', event, renderContests);
```

---

### ui/stats.js

**Purpose:** Stats bar rendering (coins, counts, version).

**Size:** ~20 lines

**Exports:**
```javascript
export function updateStats()
```

**Dependencies:**
- `core/gameState.js`

**Usage Example:**
```javascript
import { updateStats } from '../ui/stats.js';

updateStats(); // Updates coins, parrot count, etc.
```

---

### ui/parrotCard.js

**Purpose:** Individual parrot card rendering.

**Size:** ~150 lines

**Exports:**
```javascript
export async function createParrotCard(parrot, isStore)
```

**Dependencies:**
- `core/gameState.js`
- `lib/svg.js`

**Usage Example:**
```javascript
import { createParrotCard } from '../ui/parrotCard.js';

const card = await createParrotCard(parrot, false);
// Returns HTML element
```

**Features:**
- SVG parrot rendering
- Badges (L/R breeding slots, lock, examined)
- Store vs collection styling
- Click handling

---

### ui/breedingSlots.js ⭐

**Purpose:** Breeding slots component (Alpine.js reactive).

**Size:** ~100 lines

**Exports:**
```javascript
export function createBreedingSlotsComponent()
export async function renderBreedingSlots()
export function updateBreedButton()
```

**Dependencies:**
- `core/gameState.js`
- `lib/svg.js`

**Usage Example:**
```javascript
import { createBreedingSlotsComponent } from '../ui/breedingSlots.js';

// Register Alpine component
window.breedingSlots = createBreedingSlotsComponent();
```

**Alpine.js Features:**
- Reactive breeding pair display
- Auto-updating heart button
- No manual update calls needed

---

### ui/parrotGrid.js

**Purpose:** Parrot grid rendering (collection/store/offspring).

**Size:** ~30 lines

**Exports:**
```javascript
export async function renderParrotGrid()
```

**Dependencies:**
- `core/gameState.js`
- `ui/parrotCard.js`

**Usage Example:**
```javascript
import { renderParrotGrid } from '../ui/parrotGrid.js';

await renderParrotGrid(); // Renders current tab's grid
```

---

### ui/preview.js

**Purpose:** Parrot preview/details panel with action buttons.

**Size:** ~200 lines

**Exports:**
```javascript
export async function updatePreview()
```

**Dependencies:**
- `core/gameState.js`
- `lib/svg.js`

**Usage Example:**
```javascript
import { updatePreview } from '../ui/preview.js';

await updatePreview(); // Updates selected parrot details
```

**Features:**
- Detailed parrot information
- Action buttons (breed, sell, lock, examine, etc.)
- Heart button state management

---

### ui/mutations.js

**Purpose:** Mutation toggle display.

**Size:** ~30 lines

**Exports:**
```javascript
export function updateMutationDisplay()
```

**Dependencies:**
- `core/gameState.js`

**Usage Example:**
```javascript
import { updateMutationDisplay } from '../ui/mutations.js';

updateMutationDisplay(); // Updates ON/OFF indicator
```

---

## Library Modules

### lib/notifications.js

**Purpose:** Toast notification system.

**Size:** ~169 lines

**Exports:**
```javascript
export function showToast(title, message, type, duration)
```

**Dependencies:** None

**Usage Example:**
```javascript
import { showToast } from '../lib/notifications.js';

showToast('Success', 'Parrot purchased!', 'success', 3000);
showToast('Error', 'Not enough coins', 'error', 3000);
showToast('Info', 'Parrot unlocked', 'info', 3000);
```

---

### lib/svg.js

**Purpose:** SVG parrot generation from genes.

**Size:** ~201 lines

**Exports:**
```javascript
export function generateParrotSVG(parrot, size, examined)
```

**Dependencies:**
- `lib/constants.js`

**Usage Example:**
```javascript
import { generateParrotSVG } from '../lib/svg.js';

const svg = generateParrotSVG(parrot, 200, true);
// Returns SVG string
```

---

### lib/utils.js

**Purpose:** Shared utility functions.

**Size:** ~108 lines

**Exports:**
```javascript
export function getRandomName()
export function createParrotWithPurity(purity, genes, id, name)
export function calculatePurity(parrot)
```

**Dependencies:**
- `core/parrot.js`
- `lib/constants.js`

**Usage Example:**
```javascript
import { getRandomName, createParrotWithPurity } from '../lib/utils.js';

const name = getRandomName();
const parrot = createParrotWithPurity(0.8, genes, id, name);
```

---

### lib/constants.js

**Purpose:** Game constants and configuration.

**Size:** ~307 lines

**Exports:**
```javascript
export const GENES
export const PARROT_NAMES
export const EXAMINATION_COST
// ... many more constants
```

**Dependencies:** None

**Usage Example:**
```javascript
import { GENES, EXAMINATION_COST } from '../lib/constants.js';

const bodyColor = GENES.bodyColor[gene];
const cost = EXAMINATION_COST;
```

---

### lib/achievements.js

**Purpose:** Achievement system.

**Size:** ~334 lines

**Exports:**
```javascript
export function checkAchievements()
export function displayAchievements()
// ... achievement-related functions
```

**Dependencies:**
- `core/gameState.js`
- `lib/notifications.js`

---

### lib/contests.js

**Purpose:** Contest system.

**Size:** ~378 lines

**Exports:**
```javascript
export function renderContests()
export function submitToContest(parrotId, contestId)
// ... contest-related functions
```

**Dependencies:**
- `core/gameState.js`
- `lib/notifications.js`

---

## main.js

**Purpose:** Application entry point and window handlers.

**Size:** ~385 lines

**Responsibilities:**
- Initialize game on load
- Register window event handlers
- Set up Alpine.js components
- Coordinate initial render

**Dependencies:** All modules

**Structure:**
```javascript
// Import all modules
import * as GameState from './core/gameState.js';
import * as Actions from './actions/*.js';
import * as UI from './ui/*.js';

// Window handlers
window.selectParrotHandler = Actions.selectParrot;
window.breedOnLeftHandler = Actions.breedOnLeft;
// ... many more handlers

// Alpine.js components
window.breedingSlots = UI.createBreedingSlotsComponent();

// Initialize on load
window.addEventListener('load', async () => {
  const loaded = loadGame();
  if (!loaded) await initGame();
  await UI.updateUI();
});
```

---

## Import Path Patterns

### From Actions
```javascript
// Core
import * as GameState from '../core/gameState.js';
import { Parrot } from '../core/parrot.js';

// UI
import { updateUI } from '../ui/core.js';
import { updatePreview } from '../ui/preview.js';

// Lib
import { showToast } from '../lib/notifications.js';
```

### From UI
```javascript
// Core
import * as GameState from '../core/gameState.js';

// Lib
import { generateParrotSVG } from '../lib/svg.js';
```

### From main.js
```javascript
// Core
import * as GameState from './core/gameState.js';
import { loadGame, saveGame } from './core/storage.js';

// Actions
import { selectParrot } from './actions/selection.js';
import { breedOnLeft } from './actions/breeding.js';

// UI
import { updateUI } from './ui/core.js';
import { createBreedingSlotsComponent } from './ui/breedingSlots.js';
```

---

## Dependency Graph

```
main.js
  ├── core/*
  ├── actions/*
  │     ├── core/*
  │     ├── ui/*
  │     └── lib/*
  ├── ui/*
  │     ├── core/*
  │     └── lib/*
  └── lib/*
        └── core/* (some)

Allowed dependencies:
✅ main.js → anything
✅ actions/* → core/*, ui/*, lib/*
✅ ui/* → core/*, lib/*
✅ lib/* → core/* (minimal)
❌ core/* → anything (should be dependency-free except core/*)
```

---

## Module Size Guidelines

- **Small:** 20-50 lines (utilities, simple components)
- **Medium:** 50-200 lines (most modules)
- **Large:** 200-400 lines (complex components, parrot.js, laboratory.js)
- **Too Large:** 400+ lines (consider splitting)

**Current Status:**
- ✅ All action modules: 30-400 lines (acceptable)
- ✅ All UI modules: 20-200 lines (excellent)
- ✅ Core modules: 65-464 lines (acceptable, hard to split further)
- ✅ Lib modules: 108-378 lines (acceptable)

---

## Adding New Modules

### 1. Determine Category
- **Core?** Fundamental game logic/state
- **Action?** User interaction handler
- **UI?** Rendering/display
- **Lib?** Reusable utility

### 2. Create File
```bash
touch public/js/{category}/{name}.js
```

### 3. Define Exports
```javascript
/**
 * Description of module purpose
 */

// Imports
import * as GameState from '../core/gameState.js';

// Exports
export function myFunction() {
  // ...
}
```

### 4. Update main.js
```javascript
import { myFunction } from './{category}/{name}.js';

window.myFunctionHandler = myFunction;
```

### 5. Document
Add section to this file under appropriate category.

---

## Related Documentation

- [Architecture](./ARCHITECTURE.md) - Overall architecture
- [Refactoring v1.1](./REFACTORING_V1.1.md) - Refactoring details
- [Alpine.js Migration](./ALPINE_MIGRATION.md) - Alpine.js guide
