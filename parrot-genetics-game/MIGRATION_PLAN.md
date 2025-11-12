# Migration Plan: /public/js/ → parrot-genetics-game/src/

## Objective

Port the complete working modular game from `/public/js/` (v4.0, 13 modules) into the Vite-based structure at `parrot-genetics-game/src/` for bundled deployment.

## Status: IN PROGRESS

**Completed**:
- ✅ Created `src/game/achievements.js` (334 lines) - Full achievement system with win conditions
- ✅ Existing v1.1.0 modules: Save/Load, Laboratory, Notifications, Core game logic

**Remaining**:
- ⏳ Create `src/game/contests.js` (378 lines) - Contest system with rewards and rare parrots
- ⏳ Update `src/main.js` to integrate achievements and contests
- ⏳ Add contest UI handlers to `src/ui/events.js`
- ⏳ Update `src/data/constants.js` to include RARE_CONTEST_PARROTS
- ⏳ Build and test complete game
- ⏳ Deploy to production

---

## Module Mapping

| /public/js/ | parrot-genetics-game/src/ | Status |
|-------------|---------------------------|---------|
| `constants.js` (20KB) | `data/constants.js` | ⚠️ Needs RARE_CONTEST_PARROTS |
| `gameState.js` (7.4KB) | `game/gameState.js` | ✅ Exists |
| `utils.js` (3.4KB) | `utils/naming.js + utils/genetics.js` | ✅ Split |
| `parrot.js` (20KB) | `models/Parrot.js` | ✅ Exists |
| `genetics.js` (2.4KB) | `utils/genetics.js` | ✅ Exists |
| `svg.js` (7.1KB) | `rendering/svgRenderer.js` | ✅ Exists |
| `notifications.js` (5KB) | `ui/notifications.js` | ✅ Exists |
| `storage.js` (5KB) | `game/saveLoad.js` | ✅ Exists (localStorage vs cookies) |
| **`achievements.js` (12KB)** | **`game/achievements.js`** | **✅ CREATED** |
| **`contests.js` (16KB)** | **`game/contests.js`** | **⏳ TODO** |
| `ui.js` (13KB) | `ui/renderer.js` | ✅ Exists |
| `actions.js` (27KB) | `ui/renderer.js + ui/events.js` | ✅ Split |
| `main.js` (12KB) | `main.js` | ⚠️ Needs updates |

---

## Contests Module Migration

The contests module (`/public/js/contests.js`, 378 lines) needs to be created at `src/game/contests.js` with these adaptations:

### Key Functions to Port:
1. `renderContestsTab()` - Render contest UI
2. `enterContest(tierIndex)` - Enter and run contest
3. `generateAIOpponents(tier, count)` - Generate competitors
4. `showContestResults()` - Display results modal
5. `createRareParrot(tierIndex, placement)` - Create rare parrot reward
6. `takeCoinsReward()` - Handle coins reward choice
7. `takeParrotReward()` - Handle parrot reward choice

### Import Changes Needed:
```javascript
// FROM (public/js):
import * as GameState from './gameState.js';
import { Parrot } from './parrot.js';
import { CONTEST_TIERS, RARE_CONTEST_PARROTS } from './constants.js';

// TO (src/):
import { state } from './gameState.js';
import { Parrot } from '../models/Parrot.js';
import { CONTEST_TIERS, RARE_CONTEST_PARROTS } from '../data/constants.js';
```

### State Access Changes:
```javascript
// FROM:
GameState.getSelectedParrotId()
GameState.getParrots()
GameState.getCoins()

// TO:
state.selectedParrotId
state.parrots
state.coins
```

---

## Constants Module Updates

Add to `src/data/constants.js`:

```javascript
export const RARE_CONTEST_PARROTS = {
    0: { // Beginner Beauty Show
        1: { name: '...', description: '...', genes: {...} },
        2: { name: '...', description: '...', genes: {...} },
        3: { name: '...', description: '...', genes: {...} }
    },
    1: { // Rainbow Showcase
        // ...
    },
    // ... tiers 2-4
};
```

Full rare parrot data is in `/public/js/constants.js` lines 200-700.

---

## Main.js Integration

Update `src/main.js` to:

1. Import achievements and contests:
```javascript
import { checkAchievements, closeWinModal } from './game/achievements.js';
import {
    renderContestsTab,
    enterContest,
    takeCoinsReward,
    takeParrotReward,
    closeContestModal
} from './game/contests.js';
```

2. Expose to window:
```javascript
window.checkAchievements = checkAchievements;
window.closeWinModal = closeWinModal;
window.enterContestHandler = (tierIndex) => enterContest(tierIndex, saveGame, updateStats, checkAchievements);
window.takeCoinsRewardHandler = (tier, place, coins) => takeCoinsReward(tier, place, coins, saveGame, updateStats, checkAchievements);
window.takeParrotRewardHandler = (tier, place) => takeParrotReward(tier, place, saveGame, updateStats, checkAchievements);
window.closeContestModalHandler = closeContestModal;
```

3. Call checkAchievements() after major actions:
   - After breeding
   - After buying parrot
   - After contest completion
   - On game load

---

## UI Events Updates

Update `src/ui/events.js`:

1. Import contests:
```javascript
import { renderContestsTab } from '../game/contests.js';
```

2. Update `switchTab()` to call `renderContestsTab()` when switching to contests tab

---

## Testing Checklist

After migration:

- [ ] Game loads without errors
- [ ] Achievements unlock correctly
- [ ] Contest entry works
- [ ] Contest rewards (coins/parrots) work
- [ ] Rare parrots generate correctly
- [ ] Win condition modals display
- [ ] Save/load preserves achievements and contest progress
- [ ] All 13 achievements can be unlocked
- [ ] All 5 contest tiers work
- [ ] Build succeeds with no errors

---

## Version Update

After successful migration:
- Update `package.json`: `1.1.0` → `2.0.0`
- Reason: Major feature additions (achievements, contests)

---

## Next Steps

1. Copy rare parrot definitions from `/public/js/constants.js` to `src/data/constants.js`
2. Create `src/game/contests.js` with adapted imports
3. Update `src/main.js` with integrations
4. Update `src/ui/events.js` for contest rendering
5. Build and test
6. Update version to 2.0.0
7. Commit and push

---

**Last Updated**: Nov 13, 2025
**Current Task**: Create contests module
**Blockers**: None
**ETA**: 1-2 hours for complete migration
