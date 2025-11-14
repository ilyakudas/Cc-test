# ChromaWing Breeding Simulator - Architecture

## Overview

ChromaWing is a browser-based parrot breeding simulation game built with vanilla JavaScript and Alpine.js for reactive UI components.

## Technology Stack

- **Frontend Framework**: Alpine.js (lightweight reactive framework)
- **Module System**: ES6 Modules
- **Storage**: localStorage (5-10MB limit)
- **Graphics**: SVG generation
- **Build**: None required (runs directly in browser)

## Core Architecture Principles

### 1. Modular Design
- Small, focused modules (50-200 lines each)
- Clear separation of concerns
- Easy to test and maintain

### 2. Reactive UI
- Alpine.js for automatic UI updates
- State changes automatically propagate to UI
- Eliminates manual update orchestration

### 3. Centralized State
- `core/gameState.js` is single source of truth
- All state mutations go through gameState module
- No direct state manipulation in UI

### 4. Functional Programming
- Pure functions where possible
- Immutable data patterns
- Predictable state changes

## Directory Structure

```
public/js/
├── core/           # Core game logic and state
├── actions/        # User action handlers (7 modules)
├── ui/             # UI rendering components (7 modules)
├── lib/            # Shared utilities and libraries
└── main.js         # Application entry point
```

## Module Categories

### Core Modules (`core/`)
- **gameState.js**: Centralized game state management
- **parrot.js**: Parrot class and parrot-specific logic
- **genetics.js**: Genetic breeding algorithms
- **storage.js**: Save/load game state (localStorage)

### Action Modules (`actions/`)
- **breeding.js**: Breeding slot management and breeding logic
- **selection.js**: Parrot selection handling
- **trading.js**: Buy/sell parrot actions
- **collection.js**: Collection management (free, lock)
- **laboratory.js**: Laboratory examination system
- **offspring.js**: Offspring management actions
- **settings.js**: Game settings (mutations, auto-examine)

### UI Modules (`ui/`)
- **tabs.js**: Tab navigation
- **stats.js**: Stats bar rendering
- **parrotCard.js**: Individual parrot card component
- **breedingSlots.js**: Breeding slots (Alpine.js reactive)
- **parrotGrid.js**: Parrot grid rendering
- **preview.js**: Parrot preview/details panel
- **mutations.js**: Mutation toggle display

### Library Modules (`lib/`)
- **notifications.js**: Toast notification system
- **svg.js**: SVG parrot generation
- **utils.js**: Shared utility functions
- **constants.js**: Game constants and configuration
- **achievements.js**: Achievement system
- **contests.js**: Contest system

## Data Flow

```
User Interaction
    ↓
Action Handler (actions/*)
    ↓
Game State Update (core/gameState.js)
    ↓
Alpine.js Reactivity / UI Update (ui/*)
    ↓
Visual Update
```

## State Management

### Game State Structure
```javascript
{
  parrots: [],              // Player's collection
  storeParrots: [],         // Available for purchase
  recentOffspring: [],      // Recent breeding results
  coins: 100,               // Player currency
  breedingPair: {           // Selected breeding pair
    left: null,
    right: null
  },
  selectedParrotId: null,   // Currently viewed parrot
  currentTab: 'collection', // Active tab
  parrotIdCounter: 1,       // ID generator
  examinedParrots: Set,     // Examined parrot IDs
  lockedParrots: Set,       // Locked parrot IDs
  mutationsEnabled: true,   // Settings
  autoExamineEnabled: false
}
```

### State Access Patterns
- ✅ Use getter functions: `GameState.getParrots()`
- ✅ Use setter functions: `GameState.addParrot(parrot)`
- ❌ Never access state directly: `GameState.parrots`

## Alpine.js Integration

### Why Alpine.js?
- Lightweight (15KB)
- Vue-like syntax
- No build step required
- Perfect for progressive enhancement
- Solves state-sync bugs automatically

### Alpine Components
Components using Alpine.js for reactivity:
- **Breeding Slots**: Auto-updates when breeding pair changes
- **Heart Button**: Auto-activates when both parents selected
- **Lock Badges**: Auto-updates when lock state changes

### Traditional vs Alpine Pattern

**Before (Manual Updates):**
```javascript
export async function breedOnLeft(parrotId) {
  GameState.setBreedingPair({ left: parrotId });
  await UI.renderBreedingSlots();
  await UI.renderParrotGrid();
  UI.updateBreedButton();
  await UI.updatePreview(); // Manual sync!
}
```

**After (Reactive):**
```javascript
export async function breedOnLeft(parrotId) {
  GameState.setBreedingPair({ left: parrotId });
  // UI updates automatically via Alpine.js ✨
}
```

## Save System

### Storage Technology
- **localStorage** (migrated from cookies in v1.0)
- 5-10MB storage limit (vs 4KB cookie limit)
- Automatic migration from old cookie saves

### What Gets Saved
- All parrots (collection, store, offspring)
- Game state (coins, counters, settings)
- Examined/locked parrot sets
- Breeding pair state

### Save Triggers
- After every significant action (buy, sell, breed, etc.)
- Explicit save via `saveGameFn()` callback

## Performance Considerations

### Optimization Strategies
- Lazy loading for parrot SVG generation
- Efficient Set data structure for lookups
- Minimal DOM manipulation with Alpine.js
- No unnecessary re-renders

### Known Limitations
- LocalStorage is synchronous (acceptable for game size)
- SVG generation is CPU-intensive for many parrots
- No web worker support currently

## Browser Compatibility

### Minimum Requirements
- ES6 module support
- localStorage API
- SVG support
- CSS Grid and Flexbox

### Tested Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Security Considerations

- No user authentication required
- No server-side communication
- No sensitive data stored
- XSS prevention via safe SVG generation
- No eval() or innerHTML for user content

## Future Architecture Plans

### Potential Enhancements
1. **Full Vue.js migration** - If game complexity grows
2. **Web Workers** - For genetics calculations
3. **IndexedDB** - For larger save files
4. **TypeScript** - For better type safety
5. **Vite/Webpack** - If build optimization needed

### Scalability Concerns
- Current architecture supports up to ~1000 parrots
- localStorage limit may require IndexedDB for large collections
- Consider pagination for very large collections

## Version History

- **v1.0.x**: Vanilla JavaScript, manual UI updates
- **v1.1.0**: Modular refactoring + Alpine.js integration
- **Future**: Full reactive framework migration

## Related Documentation

- [Module Structure](./MODULE_STRUCTURE.md) - Detailed module breakdown
- [Alpine.js Migration](./ALPINE_MIGRATION.md) - Alpine.js integration guide
- [Refactoring Guide](./REFACTORING_V1.1.md) - v1.1.0 refactoring details
