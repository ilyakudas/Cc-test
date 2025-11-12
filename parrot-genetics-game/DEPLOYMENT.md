# ChromaWing Deployment Guide

## Directory Structure (CRITICAL)

### Build Output Directory
- **Location**: `parrot-genetics-game/public/`
- **Purpose**: Where Vite builds the modular game files
- **Contains**:
  - `breeding-game.js` (36KB) - NEW modular v1.1.0 build
  - `breeding-game.js.map` - Source map
  - `index.html` - Game HTML
  - `breeding-game.css` - Styles
  - `Parrot-1-recolored.svg` - Assets
- **Configuration**: Set in `vite.config.js` (`outDir: '../public'`)

### Shared Public Directory
- **Location**: `/home/user/Cc-test/public/`
- **Purpose**: SHARED between multiple projects - DO NOT OVERWRITE without backup
- **Contains**:
  - `breeding-game.js` (132KB) - ORIGINAL working game (v3.0)
  - `breeding-game.html` - Main game page
  - `breeding-game.css` - Styles
  - Other project files

## Current Status (v1.1.0)

### New Modular Build ✅
- **Location**: `parrot-genetics-game/public/breeding-game.js` (36KB)
- **Features**:
  - Save/Load system with auto-save every 30s
  - Enhanced Laboratory with full genetic analysis
  - Toast notifications
  - Store replacement logic
  - All previous features (4 offspring, 70% sell, etc.)

### Original Working Game ✅
- **Location**: `/home/user/Cc-test/public/breeding-game.js` (132KB)
- **Status**: PRESERVED - Still functional
- **Access**: `/home/user/Cc-test/public/breeding-game.html`

## Deployment Options

### Option 1: Side-by-Side Deployment (RECOMMENDED)
Deploy new version alongside old one:
```bash
# Copy new build with different name
cp parrot-genetics-game/public/breeding-game.js /home/user/Cc-test/public/breeding-game-v1.1.0.js
cp parrot-genetics-game/public/index.html /home/user/Cc-test/public/breeding-game-v1.1.0.html

# Edit breeding-game-v1.1.0.html to load breeding-game-v1.1.0.js
# Users can access both versions
```

### Option 2: Test First, Then Replace
Test the new build thoroughly, then replace:
```bash
# Backup original
cp /home/user/Cc-test/public/breeding-game.js /home/user/Cc-test/public/breeding-game.original.js

# Deploy new version
cp parrot-genetics-game/public/breeding-game.js /home/user/Cc-test/public/breeding-game.js

# If issues occur, restore:
# cp /home/user/Cc-test/public/breeding-game.original.js /home/user/Cc-test/public/breeding-game.js
```

### Option 3: Use Subdirectory
Keep new version in separate location:
```bash
# New version at /public/v1.1.0/
mkdir -p /home/user/Cc-test/public/v1.1.0/
cp parrot-genetics-game/public/* /home/user/Cc-test/public/v1.1.0/

# Access at: /public/v1.1.0/index.html
```

## Development Workflow

### Building the Game
```bash
cd parrot-genetics-game
npm run build
# Output: parrot-genetics-game/public/breeding-game.js
```

### Source Files
- **Source**: `parrot-genetics-game/src/`
- **Entry**: `src/main.js`
- **Modules**:
  - `game/` - Game logic, state, save/load
  - `ui/` - UI rendering, events, notifications
  - `models/` - Parrot class
  - `utils/` - Genetics, naming helpers
  - `rendering/` - SVG rendering
  - `data/` - Constants

### Version Numbers
- **package.json**: Currently `1.1.0`
- **Update before deploy**: Change version in `package.json` and HTML files

## Testing Checklist

Before deploying to shared /public/, test in `parrot-genetics-game/public/`:

- [ ] Game loads without errors
- [ ] Save/Load works (check localStorage)
- [ ] Auto-save functions (check console logs every 30s)
- [ ] Laboratory shows full analysis
- [ ] Breeding creates 4 offspring
- [ ] Store replacement works
- [ ] Toast notifications appear
- [ ] All modals work (Lab, Contests)
- [ ] No console errors

## Rollback Procedure

If new version has issues:
```bash
# New version is in git history at commit 30db59c
git show 30db59c:public/breeding-game.js > /home/user/Cc-test/public/breeding-game.js
```

## Git Commits

- `30db59c` - v1.1.0 features (Save/Load, Laboratory)
- `7f70160` - Toast notifications & store replacement
- `66d6a7f` - Critical gameplay fixes
- Earlier commits contain original working v3.0 game

## DO NOT

- ❌ Overwrite `/home/user/Cc-test/public/breeding-game.js` without backup
- ❌ Delete files from shared `/public/` directory
- ❌ Assume `parrot-genetics-game/public/` IS the public directory
- ❌ Deploy without testing first

## Next Steps

1. Test new build at `parrot-genetics-game/public/index.html`
2. Verify all features work
3. Choose deployment option (side-by-side recommended)
4. Create backup before any deployment
5. Deploy to shared `/public/` with proper naming
6. Update documentation

---

**Last Updated**: 2025-11-12
**Version**: 1.1.0
**Status**: Built but not deployed to shared /public/
