# Alpine.js Migration Guide

## What is Alpine.js?

Alpine.js is a lightweight JavaScript framework (15KB) that provides Vue-like reactive behavior directly in your HTML. It's perfect for progressively enhancing existing applications.

## Why Alpine.js for ChromaWing?

### Problems We Were Solving

1. **State-Sync Bugs**
   ```javascript
   // We kept forgetting to update UI when state changed
   export async function breedOnLeft(parrotId) {
     GameState.setBreedingPair({ left: parrotId });
     await UI.renderBreedingSlots();  // Remember this!
     await UI.renderParrotGrid();     // And this!
     UI.updateBreedButton();           // And this!
     await UI.updatePreview();         // And this! (often forgot)
   }
   ```

2. **Manual Update Chains**
   - Change state → manually call 4+ update functions
   - Miss one call → bug (heart button not updating)
   - Hard to track all dependencies

3. **Reactive UI Updates**
   - User clicks → state changes → UI should update automatically
   - Alpine.js makes this trivial

### Alpine.js Benefits

✅ **Automatic UI Updates** - Change data, UI updates automatically
✅ **Small** - Only 15KB gzipped
✅ **No Build Step** - Works via CDN
✅ **Progressive** - Adopt one component at a time
✅ **Vue-like Syntax** - Easy to learn if you know Vue
✅ **Direct HTML** - No separate template files

## Installation

Add to `breeding-game-modular.html` before closing `</body>`:

```html
<!-- Alpine.js -->
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
```

That's it! No npm, no build step, no configuration.

## Basic Syntax

### Reactive Data (`x-data`)

Define reactive data on any element:

```html
<div x-data="{ count: 0 }">
  <button @click="count++">Increment</button>
  <span x-text="count">0</span>
</div>
```

### Directives

| Directive | Purpose | Example |
|-----------|---------|---------|
| `x-data` | Define reactive data | `x-data="{ open: false }"` |
| `x-show` | Toggle visibility | `x-show="open"` |
| `x-if` | Conditional rendering | `x-if="count > 5"` |
| `x-text` | Set text content | `x-text="message"` |
| `x-html` | Set HTML content | `x-html="content"` |
| `@click` | Click handler | `@click="open = !open"` |
| `:class` | Dynamic classes | `:class="{ 'active': isActive }"` |
| `:disabled` | Dynamic disabled | `:disabled="!canSubmit"` |

## ChromaWing Implementation

### Proof of Concept: Breeding Slots

This is our first Alpine.js component - a complete example.

#### Before (Vanilla JavaScript)

**HTML:**
```html
<div id="breeding-controls">
  <div class="breeding-slots" id="breeding-slots">
    <!-- Rendered by JavaScript -->
  </div>
</div>
```

**JavaScript:**
```javascript
// ui.js
export async function renderBreedingSlots() {
  const container = document.getElementById('breeding-slots');
  const breedingPair = GameState.getBreedingPair();

  container.innerHTML = `
    <div class="breeding-slot">
      ${breedingPair.left ? renderParrot(breedingPair.left) : '<p>Select left parent</p>'}
    </div>
    <div class="breeding-slot">
      ${breedingPair.right ? renderParrot(breedingPair.right) : '<p>Select right parent</p>'}
    </div>
  `;

  updateBreedButton(); // Manual call!
}

export function updateBreedButton() {
  const breedingPair = GameState.getBreedingPair();
  const canBreed = breedingPair.left && breedingPair.right;
  const button = document.querySelector('.btn-breed');

  if (canBreed) {
    button.classList.add('active');
    button.disabled = false;
  } else {
    button.classList.remove('active');
    button.disabled = true;
  }
}
```

**Problem:** Every time state changes, we must manually call `renderBreedingSlots()` and `updateBreedButton()`.

#### After (Alpine.js)

**HTML:**
```html
<div id="breeding-controls" x-data="breedingSlots">
  <div class="breeding-slots">
    <!-- Left slot -->
    <div class="breeding-slot">
      <template x-if="!pair.left">
        <div class="empty-slot">
          <p>Select left parent</p>
        </div>
      </template>
      <template x-if="pair.left">
        <div class="parrot-slot">
          <div x-html="getParrotSVG(pair.left)"></div>
          <button @click="removeSlot('left')" class="remove-btn">✕</button>
        </div>
      </template>
    </div>

    <!-- Heart button (automatically active when both selected) -->
    <button class="btn btn-breed"
            :class="{ 'active': canBreed }"
            :disabled="!canBreed"
            @click="goToBreeding"
            x-show="true">
      💕
    </button>

    <!-- Right slot -->
    <div class="breeding-slot">
      <template x-if="!pair.right">
        <div class="empty-slot">
          <p>Select right parent</p>
        </div>
      </template>
      <template x-if="pair.right">
        <div class="parrot-slot">
          <div x-html="getParrotSVG(pair.right)"></div>
          <button @click="removeSlot('right')" class="remove-btn">✕</button>
        </div>
      </template>
    </div>
  </div>
</div>
```

**JavaScript:**
```javascript
// ui/breedingSlots.js
import * as GameState from '../core/gameState.js';
import { generateParrotSVG } from '../lib/svg.js';

export function createBreedingSlotsComponent() {
  return {
    // Reactive getters - Alpine automatically tracks these
    get pair() {
      return GameState.getBreedingPair();
    },

    get canBreed() {
      return this.pair.left !== null && this.pair.right !== null;
    },

    // Methods
    getParrotSVG(parrotId) {
      if (!parrotId) return '';
      const parrots = GameState.getParrots();
      const parrot = parrots.find(p => p.id === parrotId);
      return parrot ? generateParrotSVG(parrot) : '';
    },

    async removeSlot(slot) {
      const pair = GameState.getBreedingPair();
      pair[slot] = null;
      GameState.setBreedingPair(pair);
      // UI updates automatically! No manual render calls!
    },

    goToBreeding() {
      window.switchTabHandler('breeding');
    }
  }
}

// Register globally for Alpine
window.breedingSlots = createBreedingSlotsComponent();
```

**Benefits:**
- ✅ Heart button activates **automatically** when both parents selected
- ✅ Slots update **automatically** when breeding pair changes
- ✅ No manual `renderBreedingSlots()` calls needed
- ✅ No manual `updateBreedButton()` calls needed
- ✅ Bug fixed: heart button updates immediately!

## Alpine.js Patterns for ChromaWing

### Pattern 1: Reactive State Getters

Always use getters to access GameState, so Alpine tracks changes:

```javascript
// ✅ GOOD - Alpine tracks this
get pair() {
  return GameState.getBreedingPair();
}

// ❌ BAD - Alpine won't track changes
pair: GameState.getBreedingPair()
```

### Pattern 2: Component Factory Functions

Create components with factory functions for better testability:

```javascript
// ui/breedingSlots.js
export function createBreedingSlotsComponent() {
  return {
    // Component definition
  }
}

// main.js
window.breedingSlots = createBreedingSlotsComponent();
```

### Pattern 3: Conditional Rendering

Use `x-if` for elements that should be added/removed from DOM:

```html
<!-- Shows/hides but stays in DOM -->
<div x-show="isVisible">Content</div>

<!-- Completely removed from DOM when false -->
<template x-if="isVisible">
  <div>Content</div>
</template>
```

### Pattern 4: Dynamic Classes

Use `:class` for conditional styling:

```html
<!-- Multiple conditions -->
<button :class="{
  'active': canBreed,
  'disabled': !canBreed,
  'pulsing': isBreeding
}">
  Breed
</button>
```

### Pattern 5: Event Handlers

```html
<!-- Simple expression -->
<button @click="count++">Increment</button>

<!-- Method call -->
<button @click="removeSlot('left')">Remove</button>

<!-- Prevent default -->
<form @submit.prevent="handleSubmit">...</form>

<!-- Stop propagation -->
<div @click.stop="handleClick">...</div>
```

## Migration Strategy

### Phase 1: Proof of Concept (v1.1.0) ✅
**Component:** Breeding Slots
**Status:** Complete
**Learning:** Validate Alpine.js works well for our use case

### Phase 2: Low-Hanging Fruit (v1.2.0)
**Components to Convert:**
1. **Lock Badges** - Simple show/hide based on lock state
2. **Stats Bar** - Auto-update when coins/counts change
3. **Mutation Toggle** - Simple boolean state

**Example: Lock Badge**
```html
<div x-data="{ locked: isLocked(parrot.id) }">
  <span x-show="locked" class="badge">🔒</span>
  <button @click="locked = !locked; toggleLock(parrot.id)">
    <span x-text="locked ? 'Unlock' : 'Lock'"></span>
  </button>
</div>
```

### Phase 3: Medium Components (v1.3.0)
**Components to Convert:**
1. **Parrot Grid** - Filtered list rendering
2. **Tab Navigation** - Active tab state
3. **Preview Panel** - Selected parrot details

### Phase 4: Complex Components (v1.4.0)
**Components to Convert:**
1. **Parrot Card** - Full card with all interactions
2. **Laboratory Modal** - Complex modal state
3. **Store** - Purchase flow

## Alpine.js + GameState Integration

### The Bridge Pattern

Alpine.js needs to react to GameState changes. Use this pattern:

```javascript
// ui/component.js
export function createComponent() {
  return {
    // Alpine reactive getter
    get data() {
      return GameState.getData();
    },

    // Method that updates GameState
    updateData(newValue) {
      GameState.setData(newValue);
      // Force Alpine to re-evaluate getters
      this.$nextTick(() => {
        // Any post-update logic
      });
    }
  }
}
```

### Handling External State Changes

When state changes from outside Alpine (e.g., save/load):

```javascript
// After loading game
GameState.loadGame();

// Notify Alpine to refresh
document.dispatchEvent(new Event('game-state-changed'));
```

```javascript
// In Alpine component
init() {
  document.addEventListener('game-state-changed', () => {
    // Force re-evaluation
    this.$nextTick(() => {});
  });
}
```

## Common Pitfalls

### ❌ Pitfall 1: Direct State Access

```javascript
// BAD - Alpine won't track changes
x-data="{ parrots: GameState.getParrots() }"
```

```javascript
// GOOD - Alpine tracks getter
x-data="{ get parrots() { return GameState.getParrots(); } }"
```

### ❌ Pitfall 2: Forgetting Reactivity

```javascript
// BAD - parrot is a copy, changes won't reflect
const parrot = GameState.getParrot(id);
parrot.name = 'New name';
```

```javascript
// GOOD - Update through GameState
GameState.updateParrot(id, { name: 'New name' });
```

### ❌ Pitfall 3: Overusing Alpine

Not everything needs Alpine.js:

```javascript
// BAD - Overkill for static content
<div x-data="{}">
  <p x-text="'Static text'">Static text</p>
</div>
```

```javascript
// GOOD - Just use regular HTML
<div>
  <p>Static text</p>
</div>
```

## Performance Considerations

### Alpine.js Overhead
- **Initial load**: +15KB (negligible)
- **Runtime**: Minimal - only tracks reactive data
- **DOM updates**: Efficient - only updates what changed

### Best Practices
1. ✅ Use `x-if` for expensive-to-render content
2. ✅ Use `x-show` for frequently toggled content
3. ✅ Avoid deeply nested reactive structures
4. ✅ Use getters for computed values (cached automatically)

## Debugging Alpine.js

### DevTools
Install Alpine.js DevTools extension for Chrome/Firefox:
- Inspect component data
- Track reactive dependencies
- Monitor updates in real-time

### Console Debugging

```javascript
// Access Alpine component from console
Alpine.data('breedingSlots')

// Inspect component state
$el.__x.$data

// Force update
$el.__x.updateElements()
```

### Common Issues

**Component not initializing:**
- Check Alpine.js CDN loaded (should be last script)
- Check `x-data` syntax
- Check component registered: `window.breedingSlots`

**Reactivity not working:**
- Use getters, not direct values
- Check state actually changed in GameState
- Use `$nextTick()` for post-update logic

**Infinite loops:**
- Don't mutate state in getters
- Don't call methods that trigger their own updates

## Testing Alpine Components

### Manual Testing
```javascript
// In browser console
const component = window.breedingSlots;
console.log(component.pair);     // Check current state
console.log(component.canBreed); // Check computed property
await component.removeSlot('left'); // Test methods
```

### Unit Testing (Future)
```javascript
import { createBreedingSlotsComponent } from '../ui/breedingSlots.js';

test('canBreed returns true when both slots filled', () => {
  const component = createBreedingSlotsComponent();
  GameState.setBreedingPair({ left: 1, right: 2 });
  expect(component.canBreed).toBe(true);
});
```

## Resources

### Official Documentation
- [Alpine.js Docs](https://alpinejs.dev/)
- [Alpine.js GitHub](https://github.com/alpinejs/alpine)

### Useful Guides
- [Alpine.js Tutorial](https://alpinejs.dev/start-here)
- [Alpine.js Cheat Sheet](https://alpinejs.dev/directives)

### Video Tutorials
- [Alpine.js Crash Course](https://www.youtube.com/results?search_query=alpinejs+crash+course)

## Next Steps

### Immediate
1. ✅ Test breeding slots POC thoroughly
2. Gather feedback on Alpine.js approach
3. Identify next component to convert

### Short-term
1. Convert lock badges to Alpine
2. Convert stats bar to Alpine
3. Document any new patterns discovered

### Long-term
1. Convert all UI components to Alpine
2. Consider Vue.js if Alpine limitations found
3. Add proper testing infrastructure

## Related Documentation

- [Architecture](./ARCHITECTURE.md) - Overall architecture
- [Refactoring v1.1](./REFACTORING_V1.1.md) - Refactoring details
- [Module Structure](./MODULE_STRUCTURE.md) - Module organization
