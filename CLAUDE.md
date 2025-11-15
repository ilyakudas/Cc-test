# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/claude-code) when working with code in this repository.

## Project Overview

**ChromaWing** - A genetics-based parrot breeding simulation game built with vanilla JavaScript, Alpine.js, and SVG rendering. Players breed parrots with RGB color genetics, compete in beauty contests, and explore Mendelian inheritance through gameplay.

**Live Site**: https://cc-test-e3ccf.web.app

## Quick Start

### Running Locally
```bash
# Using Firebase CLI
firebase serve

# Using Python
python -m http.server 8000

# Using Node
npx serve public
```

Access: `http://localhost:XXXX/public/breeding-game-modular.html`

### Deploying
```bash
firebase deploy
```
Auto-deploys on push to `main` branch via GitHub Actions.

## Documentation Structure

**Read [parrot-genetics-game/docs/INDEX.md](parrot-genetics-game/docs/INDEX.md) first** - it provides a complete navigation guide.

### Quick Navigation

**Understanding the System**:
- Architecture: `parrot-genetics-game/docs/architecture/OVERVIEW.md`
- Modules: `parrot-genetics-game/docs/MODULE_STRUCTURE.md`
- Genetics: `parrot-genetics-game/docs/systems/GENETICS.md`

**Working with Features**:
- Adding features: `parrot-genetics-game/docs/guides/ADDING_FEATURES.md`
- Debugging: `parrot-genetics-game/docs/guides/DEBUGGING.md`
- Testing: `parrot-genetics-game/docs/guides/TESTING.md`

**Feature Documentation**: `parrot-genetics-game/docs/features/`
- BREEDING_LAB.md - Dedicated breeding interface
- LOCK_SYSTEM.md - Parrot protection
- AUTO_EXAMINE.md - Automatic gene examination
- OFFSPRING.md - Managing bred parrots
- VISUAL_INDICATORS.md - Badges and animations
- SPLASH_SCREEN.md - Welcome experience

**System Documentation**: `parrot-genetics-game/docs/systems/`
- GENETICS.md - Breeding mechanics
- STORAGE.md - Save/load system
- UI_RENDERING.md - SVG and card rendering
- BEAUTY_SYSTEM.md - Beauty calculation
- CONTESTS_SYSTEM.md - Contest mechanics

## Architecture

### Module Organization

```
public/js/
├── main.js                # Entry point, initialization, window handlers
├── core/                  # Core systems
│   ├── gameState.js      # Centralized state (ALWAYS use getters/setters)
│   ├── parrot.js         # Parrot class
│   ├── genetics.js       # Breeding algorithms
│   └── storage.js        # localStorage save/load
├── actions/               # User actions (breeding, buying, selling, etc.)
├── ui/                    # UI rendering (cards, grids, stats, tabs, etc.)
└── lib/                   # Utilities (notifications, SVG, constants, etc.)
```

### Key Patterns

**State Management**:
```javascript
// ✅ CORRECT: Use gameState functions
import * as GameState from './core/gameState.js';
GameState.addCoins(100);
const parrots = GameState.getParrots();

// ❌ WRONG: Never access state directly
coins += 100;  // Don't do this!
```

**Standard Action Pattern**:
```javascript
export async function someAction(saveGameFn) {
  // 1. Validate
  if (!isValid) {
    showToast('Error message', 'Details', 'error');
    return;
  }

  // 2. Update state
  GameState.modifyState();

  // 3. Update UI
  await UI.updateUI();

  // 4. Save
  if (saveGameFn) saveGameFn();

  // 5. Feedback
  showToast('Success!', 'Details', 'success');
}
```

**Window Handler Pattern** (in main.js):
```javascript
window.actionHandler = (args) => Actions.someAction(args, saveGame);
```

## Critical Systems

### Genetics System

**RGB Color Genetics**:
- 6 body parts: wings, special_wing, body, head, tail, accents
- Each part: 4 alleles × 3 colors (R/G/B) + gradient flag
- Color calculation: `count_true(alleles) * 64` → 0-255
- Breeding: Random allele selection from each parent
- Mutations: 5% chance per allele to flip (if enabled)

**See**: `parrot-genetics-game/docs/systems/GENETICS.md`

### State Management

All state lives in `core/gameState.js`:
- Parrots (collection, store, recent offspring)
- Resources (coins, counters)
- Settings (mutations, auto-examine)
- Status (examined parrots, locked parrots)

**Always**:
- Import and use gameState functions
- Never modify state variables directly
- Call save after meaningful changes

### SVG Rendering

- Template: `public/Parrot-1-recolored.svg` (cached)
- 119 feather groups recolored per parrot
- Gradients generated dynamically
- Cards rendered in responsive grid

### Save System

- Storage: localStorage (5-10MB capacity)
- Key: `chromawing_save`
- Saves: After every significant action
- Migration: Automatic from legacy cookie saves

## Common Tasks

### Adding a New Feature

1. Read relevant feature/system docs
2. Determine affected modules
3. Follow standard patterns (state → UI → save)
4. Test thoroughly (see testing guide)
5. Document if substantial

**See**: `parrot-genetics-game/docs/guides/ADDING_FEATURES.md`

### Debugging an Issue

1. Check browser console for errors
2. Inspect state with DevTools
3. Review debugging guide for common patterns
4. Add logging to track execution
5. Test fix thoroughly

**See**: `parrot-genetics-game/docs/guides/DEBUGGING.md`

### Understanding a Feature

**Look up feature documentation**:
- INDEX.md → Find relevant feature doc
- Read 200-400 lines vs 1,744 lines of mixed content
- Get requirements, rationale, edge cases

## Development Workflow

### Standard Flow

1. Start local server
2. Make changes
3. Refresh browser (no build step)
4. Test functionality
5. Commit changes

### Testing Checklist

**Core loop**:
- Buy parrot → works
- Breed parrots → offspring appear
- Examine parrot → shows genes
- Lock parrot → protected from selling
- Save/reload → state persists

**See**: `parrot-genetics-game/docs/guides/TESTING.md`

## Important Notes

### What to Avoid

- ❌ Modifying state directly (use gameState functions)
- ❌ Forgetting to save after state changes
- ❌ Not updating UI after state changes
- ❌ Copying code snippets without understanding patterns
- ❌ Assuming variables are non-null

### What to Do

- ✅ Read relevant documentation first
- ✅ Follow established patterns
- ✅ Validate input and check for null
- ✅ Test edge cases
- ✅ Use browser DevTools
- ✅ Update documentation for substantial changes

## File Naming & Conventions

- HTML files: `kebab-case.html`
- JavaScript files: `camelCase.js`
- Module imports: Always include `.js` extension
- Functions: camelCase
- Constants: SCREAMING_SNAKE_CASE

## Key Technologies

- **Language**: Vanilla JavaScript (ES6 modules)
- **Reactive UI**: Alpine.js v3.13.3 (lightweight, 15KB)
- **Graphics**: SVG manipulation
- **Storage**: localStorage
- **Hosting**: Firebase Hosting (static)
- **Deployment**: GitHub Actions (auto on main push)

## Resources

**Primary Documentation**:
- Start here: `parrot-genetics-game/docs/INDEX.md`
- Architecture: `parrot-genetics-game/docs/architecture/OVERVIEW.md`
- All features: `parrot-genetics-game/docs/features/`
- All systems: `parrot-genetics-game/docs/systems/`
- All guides: `parrot-genetics-game/docs/guides/`

**Firebase**:
- Configuration: `firebase.json`, `.firebaserc`
- Setup guide: `FIREBASE_SETUP.md`

**Design Documentation**:
- Game design: `parrot-genetics-game/docs/GAME_DESIGN.md`
- Technical spec: `parrot-genetics-game/docs/TECHNICAL_SPEC.md`
- Gameplay mechanics: `parrot-genetics-game/design/GAMEPLAY_MECHANICS.md`

## Version

**Current**: v1.1.1

**See**: `parrot-genetics-game/docs/changelog/CHANGELOG.md`
