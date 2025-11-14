# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**ChromaWing** - A genetics-based parrot breeding simulation game. Players breed parrots with RGB color genetics, compete in beauty contests, and explore Mendelian inheritance through gameplay. The project includes interactive SVG parrots with individually controllable feathers and a full breeding game implementation.

Live site: https://cc-test-e3ccf.web.app

## Development Commands

### Local Development
```bash
# Serve locally using Firebase CLI
firebase serve

# Alternative: Use any static file server
python -m http.server 8000
# or
npx serve public
```

### Deployment
```bash
# Deploy to Firebase Hosting
firebase deploy

# Test deployment (emulator)
firebase emulators:start --only hosting
```

Note: Pushing to `main` branch automatically deploys via GitHub Actions (see `.github/workflows/`).

## Project Structure

### Entry Points
- `index.html` - Root landing page with project gallery
- `public/index.html` - Public-facing game homepage
- `public/breeding-game-modular.html` - Main game (modular ES6)
- `public/breeding-game.html` - Main game (monolithic version)
- `public/genetics-explorer.html` - Genetics visualization tool
- `public/parrot-interactive.html` - Interactive SVG demo

### Code Organization (Modular Version)

The modular version (`public/js/`) uses ES6 modules with clear separation of concerns:

**Core Systems** (`public/js/core/`)
- `gameState.js` - Centralized state management (parrots, coins, breeding pairs, etc.)
- `genetics.js` - Mendelian breeding logic (RGB color inheritance, mutations)
- `parrot.js` - Parrot class definition and phenotype calculation
- `storage.js` - Cookie-based save/load system

**Game Logic** (`public/js/actions/`)
- `breeding.js` - Breeding slot management and offspring generation
- `collection.js` - Parrot selection and collection management
- `laboratory.js` - Gene examination system
- `offspring.js` - Offspring handling (move to collection, sell, dismiss)
- `selection.js` - Parrot selection state
- `settings.js` - Game settings (mutations, auto-examine)
- `trading.js` - Buy/sell mechanics

**UI Components** (`public/js/ui/`)
- `core.js` - Main UI update orchestration
- `parrotCard.js` - Parrot card rendering with SVG generation
- `parrotGrid.js` - Grid layout for parrot collections
- `breedingSlots.js` - Alpine.js component for breeding interface
- `preview.js` - Selected parrot preview panel
- `stats.js` - Coins and game statistics display
- `tabs.js` - Tab switching logic
- `mutations.js` - Mutation toggle UI

**Libraries** (`public/js/lib/`)
- `constants.js` - Contest tiers, achievement definitions, parrot names
- `svg.js` - SVG generation and parrot rendering
- `achievements.js` - Achievement tracking and unlocking
- `contests.js` - Beauty contest system
- `notifications.js` - Toast notification system
- `utils.js` - Helper functions (random name generation, genetics utilities)

**Main Module**
- `public/js/main.js` - Application initialization, window event handlers, new game setup

### Legacy Files
- `public/breeding-game.js` - Monolithic version of the entire game (137KB)
- Use this for reference but prefer modular version for new development

### Design Documentation
- `parrot-genetics-game/docs/` - Game design documents
- `parrot-genetics-game/design/` - System specifications

## Architecture Principles

### State Management
All game state lives in `gameState.js`. Other modules import state getters/setters:
- Use `getParrots()`, `addParrot()`, `removeParrot()` instead of direct state access
- Breeding pair stored separately from selected parrot for clear UX
- Recent offspring tracked separately before moving to collection

### Genetics System
RGB genetics with 4 alleles per color channel (red, green, blue) per body part:
- 6 body parts: wings, special_wing, body, head, tail, accents
- Each part has 4 boolean alleles for R, G, B (12 bits total)
- Gradient flag per body part (boolean)
- Breeding uses Mendelian inheritance: random selection from each parent
- Mutations can flip individual alleles based on `mutationRate` (default 5%)

### SVG Rendering
Parrot SVG is cached in `gameState.svgCache` and cloned for performance:
- Individual feather groups can be recolored based on genes
- Gradients generated dynamically with unique IDs
- Color calculation: RGB alleles determine color presence (0-255 per channel)
- Rarity based on gene purity and gradient count

### Event Handling
Window-level handlers in `main.js` bridge HTML onclick attributes to action modules:
- Example: `window.breedParrotsHandler = () => Actions.breedParrots(saveGame, checkAchievements)`
- Allows HTML templates to call game logic without globals
- Alpine.js components for reactive UI (breeding slots)

### Save System
Cookie-based persistence (no backend):
- Saves on every significant action (breed, buy, sell)
- Serializes entire game state including Sets and complex objects
- Auto-loads on page load if save cookie exists

## Common Workflows

### Adding a New Body Part
1. Update `Parrot` class constructor in `parrot.js` to include new part genes
2. Add breeding logic in `genetics.js` `breedParrotGenes()`
3. Update SVG generation in `svg.js` to render new part
4. Add to rarity calculation in `parrot.js` `calculateRarity()`

### Adding a New Contest Tier
1. Add tier definition to `CONTEST_TIERS` in `constants.js`
2. Define unlock condition (e.g., player level, achievement)
3. Add special validation rules if needed
4. Update rewards structure

### Adding a New Achievement
1. Define achievement in `ACHIEVEMENT_DEFINITIONS` in `constants.js`
2. Add checking logic in `achievements.js` `checkAchievements()`
3. Update UI notification in `notifications.js`

### Modifying Genetics Algorithm
- Core logic in `genetics.js` `breedBodyPart()`
- Mutation rate controlled by `gameState.mutationRate`
- Toggle mutations via `gameState.mutationsEnabled`

## SVG Asset Details

Main parrot SVG: `public/Parrot-1-recolored.svg` (59KB)
- 119 individually controllable feather groups
- Each feather has an ID like `detail-gray-1`, `detail-gray-2`, etc.
- Recoloring uses JavaScript to set fill/stroke attributes
- Gradient support via inline `<linearGradient>` elements

## Firebase Configuration

- Public directory: `public/`
- SPA routing: All paths rewrite to `/index.html`
- Caching: Images (2h), HTML/CSS/JS (1h)
- Auto-deploy on merge to main branch via GitHub Actions
- Service account secret: `FIREBASE_SERVICE_ACCOUNT` (GitHub secret)

## Testing & Debugging

No formal test suite. Debug features:
- Store includes test parrots: `[TEST-MAX-RARITY]`, `[TEST-MAX-BEAUTY]`, `[TEST-MAX-GRADIENT]`
- Console logging in `main.js` for save/load operations
- Browser devtools for state inspection via `window` handlers

## Known Patterns

### Module Import Style
```javascript
import * as GameState from './core/gameState.js';
import { Parrot } from './core/parrot.js';
```
- Use named imports for specific functions
- Use namespace imports (`* as`) for state modules

### Parrot Creation
```javascript
const parrot = new Parrot(name, genes, generation, id);
GameState.addParrot(parrot);
GameState.incrementParrotIdCounter();
```

### Save After State Change
```javascript
import { saveGame } from './core/storage.js';
// ... modify state ...
saveGame();
```

## File Naming Conventions
- `kebab-case.html` for HTML files
- `camelCase.js` for JavaScript files
- Component files named after their primary export
- UI components in `ui/`, business logic in `actions/` or `lib/`
