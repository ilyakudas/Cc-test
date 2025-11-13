# ChromaWing Deployment Guide

## ✅ v2.0.0 MIGRATION COMPLETE

The game has been successfully migrated to Vite-based build system with full achievements and contests functionality. All v4.0 features from `/public/js/` have been integrated into the `src/` structure.

---

## Current Directory Structure

### Source Code (Development)
- **Location**: `parrot-genetics-game/src/`
- **Status**: ⚠️ OUTDATED - Contains v1.1.0 modular attempt (Vite-based)
- **Note**: Not currently used. The working modular code is in `/public/js/`

### Production Code (Working)
- **Location**: `/home/user/Cc-test/public/`
- **Contains**:
  - **Original monolithic game**: `breeding-game.html` + `breeding-game.js` (132KB)
  - **NEW modular game**: `breeding-game-modular.html` + `/js/` modules
  - **Assets**: `breeding-game.css`, `Parrot-1-recolored.svg`, etc.

---

## Modular Architecture (/public/js/)

| Module | Size | Purpose |
|--------|------|---------|
| `constants.js` | 20KB | Game constants, contest tiers, rare parrots |
| `gameState.js` | 7.4KB | Centralized state management |
| `utils.js` | 3.4KB | Utility functions (names, genes, purity) |
| `parrot.js` | 20KB | Parrot class with genetics system |
| `genetics.js` | 2.4KB | Breeding and gene inheritance |
| `svg.js` | 7.1KB | SVG loading and rendering |
| `notifications.js` | 5.0KB | Toast notification system |
| `storage.js` | 4.9KB | Save/load to cookies |
| `achievements.js` | 12KB | Achievement system with win conditions |
| `ui.js` | 13KB | UI rendering (grids, cards, previews) |
| `contests.js` | 16KB | Complete contest system |
| `actions.js` | 27KB | All user action handlers |
| `main.js` | 12KB | Initialization and integration |

**Total**: ~151KB (13 modules)

---

## Available Game Versions

### Option 1: Modular Version (RECOMMENDED) ✅
**File**: `/public/breeding-game-modular.html`

**Features**:
- ✅ Full modular architecture (13 ES6 modules)
- ✅ Save/Load system (cookies)
- ✅ Enhanced Laboratory with genetics analysis
- ✅ Toast notifications
- ✅ Contest system
- ✅ Achievement system
- ✅ Store replacement logic
- ✅ All original features

**Access**: Open `/home/user/Cc-test/public/breeding-game-modular.html`

### Option 2: Original Monolithic Version (BACKUP)
**File**: `/public/breeding-game.html`

**Features**:
- Original v3.0 game
- 132KB single file
- Working but not modular

**Access**: Open `/home/user/Cc-test/public/breeding-game.html`

---

## Development Workflow

### Working with Modules

All modules are in `/public/js/` and can be edited directly:

```bash
# Edit a module
nano /home/user/Cc-test/public/js/actions.js

# Test changes
# Open /public/breeding-game-modular.html in browser
# Check browser console for errors
```

### No Build Step Required

The modular version uses **native ES6 modules** loaded directly in the browser. No bundling/building needed:

```html
<script type="module" src="js/main.js"></script>
```

Changes are immediately visible on browser refresh.

### Testing Page

Use `/public/test-modules.html` to test modules independently before integration.

---

## Vite-Based Build (DEPRECATED)

The `parrot-genetics-game/src/` directory contains an earlier v1.1.0 refactoring attempt using Vite:
- ⚠️ **Status**: Outdated, incomplete
- ⚠️ **Build output**: Was `parrot-genetics-game/public/` (now deleted)
- ⚠️ **Do not use**: Use `/public/js/` modules instead

**If you want to revive the Vite build**:
1. Update `parrot-genetics-game/src/` to match `/public/js/` modules
2. Configure Vite to output to a different location (not `/public/`)
3. Keep both versions separate

---

## Version History

| Version | Date | Status | Location |
|---------|------|--------|----------|
| v3.0 | Earlier | Original working | `/public/breeding-game.js` |
| v1.1.0 | Nov 12 | Vite attempt (incomplete) | `parrot-genetics-game/src/` |
| **v4.0** | **Nov 13** | **Full modular (CURRENT)** | **`/public/js/`** |

---

## Migration Notes

### From v1.1.0 (parrot-genetics-game/src/) to v4.0 (/public/js/)

The current working modules in `/public/js/` are **different** from the Vite-based modules in `parrot-genetics-game/src/`:

**Key Differences**:
1. **Storage**: v4.0 uses cookies (storage.js), v1.1.0 used localStorage (saveLoad.js)
2. **Structure**: Different file organization and naming
3. **Completeness**: v4.0 has achievements and contests, v1.1.0 was incomplete
4. **Build**: v4.0 is native ESM, v1.1.0 needed Vite bundling

**Recommendation**: Treat them as separate codebases. Don't try to merge.

---

## Deployment Checklist

### Deploying Updates

✅ Edit modules in `/public/js/`
✅ Test in `/public/breeding-game-modular.html`
✅ Check browser console for errors
✅ Test all features (save/load, breeding, contests, achievements)
✅ Commit changes to git
✅ No build step required

### DO NOT

- ❌ Delete `/public/breeding-game.js` (original backup)
- ❌ Try to merge `parrot-genetics-game/src/` with `/public/js/`
- ❌ Run `npm run build` and expect it to update `/public/js/`
- ❌ Overwrite working modules without testing

---

## File Locations Quick Reference

```
/home/user/Cc-test/
├── public/                          # PRODUCTION CODE
│   ├── breeding-game-modular.html   # NEW modular game ✅
│   ├── breeding-game.html           # Original game (backup)
│   ├── breeding-game.js             # Original monolithic (132KB)
│   ├── breeding-game.css            # Styles
│   ├── Parrot-1-recolored.svg       # Assets
│   └── js/                          # MODULAR GAME CODE ✅
│       ├── main.js                  # Entry point
│       ├── constants.js
│       ├── gameState.js
│       ├── parrot.js
│       ├── genetics.js
│       ├── svg.js
│       ├── ui.js
│       ├── actions.js
│       ├── contests.js
│       ├── achievements.js
│       ├── notifications.js
│       ├── storage.js
│       └── utils.js
│
└── parrot-genetics-game/            # DEVELOPMENT AREA
    ├── src/                         # v1.1.0 Vite modules (outdated)
    ├── tasks/
    │   └── REFACTORING_COMPLETE.md  # Full refactoring details
    ├── DEPLOYMENT.md                # This file
    └── package.json                 # v1.1.0 (outdated)
```

---

## Next Steps

1. ✅ Use `/public/breeding-game-modular.html` as the main game
2. ⚠️ Decide what to do with `parrot-genetics-game/src/`:
   - Option A: Delete it (outdated)
   - Option B: Update it to match `/public/js/`
   - Option C: Keep as historical reference
3. 📝 Update main `/public/index.html` to link to modular version
4. 🧪 Add automated testing for modules
5. 📦 Consider future bundling for production (optional)

---

**Last Updated**: November 13, 2025
**Current Version**: v4.0 (Modular)
**Status**: ✅ Production Ready
**Primary File**: `/public/breeding-game-modular.html`
