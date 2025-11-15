# Adding Features Guide

**Purpose**: Step-by-step instructions for common development tasks and feature additions.

**Related docs**: [Architecture Overview](../architecture/OVERVIEW.md), [Module Structure](../MODULE_STRUCTURE.md)

## Before You Start

### Understand the Architecture

1. Read [Architecture Overview](../architecture/OVERVIEW.md)
2. Review [Module Structure](../MODULE_STRUCTURE.md)
3. Understand which modules handle what

### Key Principles

**Separation of Concerns**:
- State in `core/gameState.js`
- UI in `ui/` modules
- Actions in `actions/` modules
- Utilities in `lib/` modules

**State Management**:
- Never modify state directly
- Use gameState getters/setters
- Save after state changes

**UI Updates**:
- Update state first
- Then update UI
- Use async/await for rendering

## Common Workflows

### Adding a New Contest Tier

**Files to modify**:
- `public/js/lib/constants.js` - Add tier definition
- Test the feature

**Steps**:

1. **Define the tier** in `constants.js`:
```javascript
{
  name: '🌟 Elite Championship',
  description: 'For only the most exceptional specimens',
  entryCost: 500,
  minBeautyRange: [90, 100],
  rewards: {
    1: {coins: 1000, badge: '🥇'},
    2: {coins: 700, badge: '🥈'},
    3: {coins: 500, badge: '🥉'}
  },
  specialRules: null,  // or add custom validation
  unlocked: false  // unlocked by achievement or level
}
```

2. **Add unlock condition** (if needed):
- In `contests.js` or achievement system
- Example: Unlock after winning 5 contests

3. **Test the new tier**:
- Manually unlock in code
- Enter contest
- Verify rewards
- Check placement logic

### Adding a New Badge Type

**Files to modify**:
- `public/js/ui/parrotCard.js` - Badge rendering
- `public/breeding-game.css` - Badge styles

**Steps**:

1. **Determine badge purpose and position**:
- Top-left: Breeding selection
- Top-right: Examination
- Top-center: Lock
- Bottom-left: Available
- Bottom-right: Available

2. **Add badge rendering logic**:
```javascript
// In createParrotCard or similar
if (parrot.hasNewProperty) {
  const badge = document.createElement('div');
  badge.className = 'new-badge-type';
  badge.textContent = '✨';  // or appropriate icon
  card.appendChild(badge);
}
```

3. **Add CSS styling**:
```css
.new-badge-type {
  position: absolute;
  top: 8px;
  left: 50px;  /* adjust position */
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #colorA 0%, #colorB 100%);
  /* ... rest of badge styles ... */
}
```

4. **Test visual appearance**:
- Check all card contexts (collection, breeding lab, etc.)
- Verify doesn't overlap other badges
- Test on different screen sizes

### Adding a New Parrot Body Part

**Impact**: Major change affecting genetics, rendering, breeding

**Files to modify**:
- `public/js/core/parrot.js` - Parrot class
- `public/js/core/genetics.js` - Breeding logic
- `public/js/lib/svg.js` - SVG rendering
- `public/Parrot-1-recolored.svg` - SVG template (if needed)

**Steps**:

1. **Update Parrot class constructor**:
```javascript
// In parrot.js
constructor(name, genes, generation, id) {
  this.genes = {
    wings: genes.wings,
    special_wing: genes.special_wing,
    body: genes.body,
    head: genes.head,
    tail: genes.tail,
    accents: genes.accents,
    newPart: genes.newPart  // ADD THIS
  };
}
```

2. **Update breeding logic**:
```javascript
// In genetics.js breedParrotGenes()
return {
  wings: breedBodyPart(parent1Genes.wings, parent2Genes.wings),
  // ... other parts ...
  newPart: breedBodyPart(parent1Genes.newPart, parent2Genes.newPart)  // ADD THIS
};
```

3. **Update SVG rendering**:
- Add feather group IDs to SVG template
- Update color application logic in `svg.js`
- Map genes to SVG elements

4. **Update parrot creation**:
- All places creating new parrots need newPart genes
- Store generation, random parrots, etc.

5. **Update beauty/rarity calculation**:
- Include new part in scoring
- Maintain balance with existing parts

### Adding a New Game Setting

**Example**: Toggle for sound effects

**Files to modify**:
- `public/js/core/gameState.js` - State variable
- `public/js/core/storage.js` - Save/load
- `public/js/actions/settings.js` - Toggle action
- `public/breeding-game-modular.html` - Toggle badge
- `public/js/main.js` - Window handler

**Steps**:

1. **Add state variable** in `gameState.js`:
```javascript
export let soundEnabled = true;

export function setSoundEnabled(enabled) {
  soundEnabled = enabled;
}

export function toggleSoundEnabled() {
  soundEnabled = !soundEnabled;
  return soundEnabled;
}

export function getSoundEnabled() {
  return soundEnabled;
}
```

2. **Add to save/load** in `storage.js`:
```javascript
// In saveGame():
soundEnabled: GameState.getSoundEnabled()

// In loadGame():
GameState.setSoundEnabled(
  gameStateData.soundEnabled ?? true  // default value
);

// In resetGameState():
soundEnabled = true;
```

3. **Add toggle action** in `actions/settings.js`:
```javascript
export function toggleSound(saveGameFn) {
  const enabled = GameState.toggleSoundEnabled();

  // Update UI badge appearance
  updateSoundBadge();

  if (saveGameFn) saveGameFn();

  showToast(
    enabled ? 'Sound enabled' : 'Sound disabled',
    '',
    'info',
    2000
  );
}

function updateSoundBadge() {
  const badge = document.getElementById('soundBadge');
  if (GameState.getSoundEnabled()) {
    badge.classList.add('active');
  } else {
    badge.classList.remove('active');
  }
}
```

4. **Add badge to HTML**:
```html
<div id="soundBadge" class="setting-badge active" onclick="window.toggleSoundHandler()">
  🔊 Sound
</div>
```

5. **Add window handler** in `main.js`:
```javascript
window.toggleSoundHandler = () => Actions.toggleSound(saveGame);
```

6. **Add CSS styling**:
```css
.setting-badge {
  /* badge styles */
}

.setting-badge.active {
  background: linear-gradient(135deg, #colorA, #colorB);
}
```

### Adding a New Action Button

**Example**: "Rename Parrot" button

**Files to modify**:
- `public/js/ui/preview.js` - Add button to action buttons
- `public/js/actions/` - Create or update action module
- `public/js/main.js` - Window handler

**Steps**:

1. **Add button to action buttons** in `preview.js`:
```javascript
// In updatePreview() or renderActionButtons()
const renameBtn = `
  <button class="btn btn-secondary" onclick="window.renameParrotHandler(${parrotId})">
    ✏️ Rename Parrot
  </button>
`;
// Add to button container
```

2. **Create action function**:
```javascript
// In actions/collection.js or new file
export function renameParrot(parrotId, saveGameFn) {
  const parrot = GameState.getParrotById(parrotId);
  if (!parrot) return;

  const newName = prompt('Enter new name:', parrot.name);
  if (!newName || newName === parrot.name) return;

  parrot.name = newName;

  UI.updateUI();
  if (saveGameFn) saveGameFn();

  showToast(
    'Parrot renamed',
    `Now called "${newName}"`,
    'success',
    3000
  );
}
```

3. **Add window handler** in `main.js`:
```javascript
window.renameParrotHandler = (parrotId) => {
  Actions.renameParrot(parrotId, saveGame);
};
```

4. **Test the feature**:
- Select parrot
- Click rename button
- Enter new name
- Verify name updates everywhere
- Verify save persists

### Adding a New Toast Notification Type

**Example**: "achievement" toast style

**Files to modify**:
- `public/js/lib/notifications.js` - Add type
- `public/breeding-game.css` - Add styling

**Steps**:

1. **Add type to showToast** in `notifications.js`:
```javascript
// Update type validation or add new case
if (type === 'achievement') {
  toast.classList.add('toast-achievement');
}
```

2. **Add CSS styling**:
```css
.toast-achievement {
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  color: #333;
  border-left: 4px solid #ffa500;
}

.toast-achievement .toast-title {
  color: #d4af37;
  font-weight: bold;
}
```

3. **Use new type**:
```javascript
showToast(
  'Achievement Unlocked!',
  'Bred 100 parrots',
  'achievement',
  5000
);
```

## Best Practices

### State Management

**Always**:
- Use gameState getters/setters
- Never access state variables directly from outside module
- Save after meaningful changes

**Example**:
```javascript
// GOOD
GameState.addCoins(100);
saveGame();

// BAD
coins += 100;  // direct access to state
```

### UI Updates

**Always**:
- Update state first
- Then update UI
- Use await for async rendering

**Example**:
```javascript
// GOOD
GameState.addParrot(newParrot);
await UI.updateUI();
saveGame();

// BAD
await UI.updateUI();
GameState.addParrot(newParrot);  // state after UI
```

### Error Handling

**Always**:
- Validate input
- Check for null/undefined
- Provide user feedback

**Example**:
```javascript
export function buyParrot(parrotId, saveGameFn) {
  const parrot = GameState.getStoreParrotById(parrotId);
  if (!parrot) {
    console.error('Parrot not found:', parrotId);
    return;  // Early return
  }

  const coins = GameState.getCoins();
  if (coins < parrot.price) {
    showToast('Not enough coins!', `Need ${parrot.price}, have ${coins}`, 'error');
    return;  // Early return
  }

  // ... proceed with purchase
}
```

### Alpine.js Components

**Always**:
- Use `Alpine.data()` as factory functions (return NEW instances)
- Use custom events for cross-component communication
- Use `Alpine.store()` for shared state
- Never reuse component instances

**Component Registration**:
```javascript
// WRONG - Reusing same instance breaks reactivity
window.myComponent = createMyComponent();
Alpine.data('myComponent', () => window.myComponent);

// RIGHT - Create new instance each time
Alpine.data('myComponent', () => createMyComponent());
```

**Cross-Component Communication**:
```javascript
// WRONG - Direct method calls break reactivity
window.componentA.loadData(data);

// RIGHT - Use custom events
const event = new CustomEvent('load-data', {
  detail: { myData: data }
});
window.dispatchEvent(event);

// In receiving component's init()
window.addEventListener('load-data', (event) => {
  this.handleLoadData(event.detail);  // Runs in Alpine context
});
```

**Shared State**:
```javascript
// Use Alpine.store() for state shared across components
Alpine.store('gameData', {
  items: [],
  selectedItem: null,
  selectItem(item) {
    this.selectedItem = item;
  }
});

// Access in any component
x-text="$store.gameData.items.length"
@click="$store.gameData.selectItem(item)"
```

**Why This Matters**:
- Alpine.js uses Proxies for reactivity
- Reusing instances prevents proper proxy setup
- Direct method calls run outside Alpine's reactive context
- Updates while components are hidden (tab switching) compound issues

**See Also**: [Debugging Guide - Alpine.js Reactivity Issues](DEBUGGING.md#alpinejs-ui-not-updating-after-programmatic-data-changes)

### Testing

**Always test**:
- Happy path (normal use)
- Edge cases (empty collection, max coins, etc.)
- Error conditions (insufficient funds, null values)
- State persistence (save/load)

## Debugging New Features

### Common Issues

**State not persisting**:
- Forgot to call saveGame()
- Not saving new property in storage.js
- localStorage disabled

**UI not updating**:
- Forgot to call updateUI()
- Async/await issues
- Wrong UI update function called

**Feature not working**:
- Window handler not registered
- Typo in function name
- Module not imported

### Debugging Steps

1. Check browser console for errors
2. Add console.log() to track execution
3. Verify state changes with DevTools
4. Test save/load cycle
5. Check all file modifications made

## Documentation

### After Adding Feature

**Update docs**:
1. Add feature doc in `docs/features/` if major
2. Update INDEX.md if needed
3. Add to CHANGELOG.md
4. Update CLAUDE.md if affects common workflows

**Document**:
- What the feature does (requirements)
- Why design choices made (rationale)
- How to use it (user perspective)
- Not: Implementation code details

## Getting Help

### Resources

- [Architecture Overview](../architecture/OVERVIEW.md) - System design
- [Module Structure](../MODULE_STRUCTURE.md) - Where code lives
- [Debugging Guide](DEBUGGING.md) - Common issues
- Feature docs - Similar feature examples

### When Stuck

1. Review related feature docs for similar patterns
2. Check module structure to find right file
3. Look at existing code for examples
4. Use browser DevTools to inspect state
5. Start with small test, then expand
