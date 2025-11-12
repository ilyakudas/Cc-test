# ChromaWing - Refactored Version

## ✅ Status: Basic Game Working!

This is the modular, refactored version of ChromaWing built with **Vite** and **ES Modules**.

### ✅ What Works (v0.5 - MVP)

**Core Gameplay:**
- ✅ Game initialization with starter parrot
- ✅ Store with random parrots
- ✅ Buy parrots from store
- ✅ Breed two parrots (Mendelian inheritance)
- ✅ Select parrots for breeding
- ✅ Tab switching (Collection/Store)
- ✅ Coin economy
- ✅ Generation tracking
- ✅ SVG rendering with genetics
- ✅ Rarity and beauty calculations
- ✅ Mutation system
- ✅ New game function

**File Size:** 20KB minified (vs 132KB original)

### ⏳ What's Missing (Advanced Features)

These features from the original game aren't ported yet:
- Laboratory modal with genetic details
- Contest system
- Achievement system
- Save/load to localStorage
- Proper toast notifications (using alert for now)
- Sell parrot functionality
- Notification history
- DNA export strings

### 🎮 How to Play

1. Start with one beautiful starter parrot (Twilight)
2. Visit the Store tab to buy more parrots (500 starting coins)
3. Select two parrots from your collection
4. Click "Breed Parrots" (costs 50 coins)
5. Watch offspring inherit genetics via Mendelian inheritance
6. Build your collection!

### 🏗️ Architecture

**Modular Structure:**
```
src/
├── models/Parrot.js       - Genetics model
├── game/
│   ├── gameState.js       - State management
│   ├── init.js            - Game initialization
│   └── breeding.js        - Breeding logic
├── ui/
│   ├── renderer.js        - UI rendering
│   └── events.js          - Event handlers
├── rendering/
│   ├── svgRenderer.js     - SVG generation
│   └── colors.js          - Color utilities
├── data/constants.js      - Game constants
└── utils/                 - Helper functions
```

### 🔧 Development

Source: `/parrot-genetics-game/src/`
Build: `cd /parrot-genetics-game && npm run build`
Original: `/public/breeding-game.html`

### 📊 Progress

- ✅ 65% - Core gameplay working
- ⏳ 35% - Advanced features (pending)

**Next up:** Laboratory, Contests, Achievements, Save/Load
