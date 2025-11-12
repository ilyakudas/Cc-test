# ChromaWing Breeding Game - Refactoring Task

**Date Started:** November 12, 2025
**Status:** In Progress
**Branch:** `claude/refactor-parrot-breading-game-011CV41eiFgRTm55R7FJwixN`

---

## Objective

Refactor the monolithic 3,208-line `breeding-game.js` file into logical, maintainable modules while preserving all existing functionality.

---

## Current State Analysis

### File Structure
- **Location:** `/public/breeding-game.html`, `/public/breeding-game.js`, `/public/breeding-game.css`
- **Size:** 3,208 lines of JavaScript in a single file
- **Dependencies:** SVG parrot template (`Parrot-1-recolored.svg`)

### Identified Code Sections

1. **Game State** (Lines 1-30)
   - Global variables for parrots, coins, generation, etc.
   - Contest progress and trophies
   - Achievement state
   - Mutation system state

2. **Constants** (Lines 30-132)
   - Contest tiers configuration
   - Parrot names pool
   - Rare contest parrots (Lines 2611-2812)
   - Achievement definitions (Lines 2875-3061)

3. **Parrot Class & Genetics** (Lines 135-588)
   - Parrot class with 78 genes (6 body parts × 13 genes)
   - Color calculation methods
   - Beauty scoring
   - Rarity calculation
   - Gene utility functions (Lines 589-602)

4. **SVG Rendering** (Lines 603-789)
   - SVG loading and caching
   - Parrot visualization generation
   - Color/gradient application

5. **UI Rendering** (Lines 1186-1463)
   - Parrot grid rendering
   - Card creation
   - Preview panel updates
   - Breeding slot display

6. **Game Actions** (Lines 1281-2071)
   - Select parrot
   - Add/remove breeding pairs
   - Buy/sell/free parrots
   - Breed parrots
   - Laboratory examination

7. **Contest System** (Lines 2342-2811)
   - Contest tab rendering
   - AI opponent generation
   - Contest results modal
   - Rare parrot rewards

8. **Achievement System** (Lines 2872-3171)
   - Achievement checking
   - Win condition modals
   - Mutation toggle

9. **Storage System** (Lines 2077-2160)
   - Save to cookies
   - Load from cookies

10. **Notification System** (Lines 2214-2339)
    - Toast notifications
    - Notification history

11. **Initialization** (Lines 790-1141, 2199-2212)
    - Game initialization
    - Store generation
    - Event listeners

---

## Refactoring Plan

### Module Structure

```
/public/
├── breeding-game.html           (updated with module imports)
├── breeding-game.css            (unchanged)
├── js/
│   ├── main.js                  (initialization & orchestration)
│   ├── gameState.js             (global state management)
│   ├── constants.js             (configuration constants)
│   ├── parrot.js                (Parrot class)
│   ├── genetics.js              (breeding & gene functions)
│   ├── svg.js                   (SVG loading & rendering)
│   ├── ui.js                    (UI rendering functions)
│   ├── actions.js               (user action handlers)
│   ├── contests.js              (contest system)
│   ├── achievements.js          (achievement system)
│   ├── storage.js               (save/load)
│   └── notifications.js         (toast system)
└── Parrot-1-recolored.svg      (unchanged)
```

### Module Dependencies

```
main.js
  ├─> gameState.js
  ├─> constants.js
  ├─> parrot.js ──> genetics.js
  ├─> svg.js
  ├─> ui.js ──> svg.js
  ├─> actions.js ──> [genetics, ui, storage, notifications]
  ├─> contests.js ──> [parrot, genetics, ui, notifications]
  ├─> achievements.js ──> [gameState, notifications]
  ├─> storage.js ──> [gameState, parrot]
  └─> notifications.js
```

---

## Implementation Steps

### Phase 1: Setup & Constants ✅
- [x] Create refactoring.md document
- [x] Create `/public/js/` directory
- [x] Extract `constants.js` (names, contest tiers, rare parrots)
  - Exported: PARROT_NAMES, TOAST_ICONS, CONTEST_TIERS, RARE_CONTEST_PARROTS
- [x] Test: Ensure constants load correctly ✅

### Phase 2: Core Systems ✅ (Complete - 5/5 complete)
- [x] Extract `gameState.js` (global state management)
  - Exported: State getters/setters, parrot management, coins, generation, etc.
- [x] Extract `utils.js` (utility functions)
  - Exported: getRandomName, randomBoolean, randomBodyPartGenes
- [x] Extract `parrot.js` (Parrot class - 526 lines)
  - Exported: Parrot class with all genetics and beauty calculation methods
- [x] Extract `genetics.js` (breeding functions - 66 lines)
  - Exported: breedBodyPart, breedParrotGenes
- [x] Create `test-modules.html` for module verification (30 tests, all passing)
- [x] Test: Modules load and function correctly ✅

### Phase 3: Rendering
- [ ] Extract `svg.js` (SVG handling)
- [ ] Extract `ui.js` (UI rendering)
- [ ] Test: Ensure parrots display correctly

### Phase 4: Features
- [ ] Extract `notifications.js` (toast system)
- [ ] Extract `storage.js` (save/load)
- [ ] Extract `contests.js` (contest system)
- [ ] Extract `achievements.js` (achievement system)
- [ ] Test: Ensure all features work

### Phase 5: Integration
- [ ] Extract `actions.js` (action handlers)
- [ ] Create `main.js` (initialization)
- [ ] Update `breeding-game.html` to use modules
- [ ] Test: Full game functionality

### Phase 6: Cleanup
- [ ] Remove old `breeding-game.js`
- [ ] Update documentation
- [ ] Final testing

---

## Testing Checklist

After each phase, verify:
- [ ] Game loads without errors
- [ ] Parrots display correctly
- [ ] Breeding produces offspring
- [ ] Store functions work
- [ ] Contests can be entered
- [ ] Achievements unlock
- [ ] Save/load works
- [ ] Mutations toggle works
- [ ] Laboratory functions work
- [ ] All UI interactions respond

---

## Key Considerations

### Module Format
Using **ES6 modules** with `type="module"` in HTML:
```html
<script type="module" src="js/main.js"></script>
```

### Global State Strategy
- Centralize state in `gameState.js`
- Export state accessors/mutators
- Avoid direct state manipulation from modules

### Backward Compatibility
- Maintain same cookie/save format
- Preserve all function signatures initially
- Keep same HTML structure

### Code Quality
- Add JSDoc comments to exported functions
- Use `const`/`let` appropriately
- Maintain existing naming conventions
- No functional changes in first iteration

---

## Progress Log

### 2025-11-12 - Initial Setup & First Modules
- ✅ Created refactoring.md document
- ✅ Analyzed 3,208-line source file
- ✅ Identified 11 major code sections
- ✅ Planned 12-module structure
- ✅ Created `/public/js/` directory
- ✅ **Completed Modules:**
  - `constants.js` - All game constants (401 lines)
  - `gameState.js` - Centralized state management (238 lines)
  - `utils.js` - Utility functions (47 lines)
  - `parrot.js` - Parrot class with genetics (526 lines)
  - `genetics.js` - Breeding functions (66 lines)
  - `test-modules.html` - Test suite (30 tests, 100% pass rate)
- ✅ **Verified:** All modules load correctly via ES6 imports
- 📊 **Status:** 5 core modules complete (~1,278 lines extracted), original game still functional
- 🎯 **Next Step:** Extract remaining systems (SVG, UI, notifications, storage, etc.)

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Breaking game functionality | Incremental changes with testing after each step |
| Module import errors | Test in browser after each extraction |
| State management issues | Keep state centralized, test thoroughly |
| Performance degradation | Profile before/after, maintain same algorithms |

---

## Notes

- Original file is well-organized with clear comment sections
- Most code is already logically grouped
- Main challenge is managing global state across modules
- SVG rendering is performance-critical - keep optimized

---

**Last Updated:** 2025-11-12
