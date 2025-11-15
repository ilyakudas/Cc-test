# Testing Guide

**Purpose**: Testing procedures and checklists for verifying functionality.

**Related docs**: [Debugging Guide](DEBUGGING.md), [Setup Guide](SETUP.md)

## Testing Philosophy

### Goals

- **Verify functionality**: Features work as designed
- **Catch regressions**: Changes don't break existing features
- **Test edge cases**: Handle unusual inputs and states
- **Ensure persistence**: Save/load works correctly

### Levels of Testing

1. **Feature testing**: Does this specific feature work?
2. **Integration testing**: Do features work together?
3. **Edge case testing**: What happens in unusual situations?
4. **Persistence testing**: Does it survive page reload?

## Manual Testing Checklist

### Core Game Loop

**Collection Management**:
- [ ] Can select parrots from collection
- [ ] Selected parrot highlighted with border
- [ ] Preview panel shows selected parrot details
- [ ] Action buttons appear when parrot selected
- [ ] Can deselect parrot

**Store**:
- [ ] Store shows available parrots
- [ ] Each parrot shows correct price
- [ ] Can buy parrot with sufficient coins
- [ ] Cannot buy with insufficient coins (error toast)
- [ ] Purchased parrot moves to collection
- [ ] Store refreshes after purchase

**Breeding**:
- [ ] Can select left parent
- [ ] Can select right parent
- [ ] L/R badges appear immediately on cards
- [ ] Heart button activates when both parents selected
- [ ] Heart button pulses when active
- [ ] Clicking heart breeds parrots (costs 50 coins)
- [ ] 4 offspring appear in breeding lab
- [ ] Multiple breedings accumulate offspring
- [ ] Offspring show in grid layout (not vertical)

**Economy**:
- [ ] Coins displayed correctly at all times
- [ ] Breeding costs 50 coins
- [ ] Buying costs shown price
- [ ] Selling awards value based on parrot
- [ ] Examination costs 100 coins
- [ ] Cannot go negative (preventions in place)

### Feature Testing

**Breeding Lab**:
- [ ] Breeding tab accessible
- [ ] Large breeding slots show selected parents
- [ ] Compatibility display shows genetic overlap
- [ ] Predictions show example offspring
- [ ] Recent offspring section shows all accumulated offspring
- [ ] "Move All (X) to Collection" works
- [ ] "Sell All (X)" works for unlocked offspring
- [ ] "Dismiss All (X)" works for unlocked offspring
- [ ] Button counts update correctly

**Auto-Examine**:
- [ ] Auto-Exam badge toggles on/off
- [ ] Setting persists across page reload
- [ ] When ON: breeding auto-examines offspring
- [ ] Examination limited by available coins
- [ ] Toast shows examination count
- [ ] Examined offspring have microscope badge

**Lock System**:
- [ ] Can lock parrot from action buttons
- [ ] Lock badge appears immediately (top center)
- [ ] Can unlock locked parrot
- [ ] Cannot sell locked parrot (error toast)
- [ ] Cannot free locked parrot (error toast)
- [ ] Batch operations skip locked offspring
- [ ] Feedback shows "X locked offspring kept"
- [ ] Lock status persists across page reload

**Laboratory**:
- [ ] Click "Examine" opens laboratory modal
- [ ] Modal shows parrot details
- [ ] Un-examined: shows payment button (100 coins)
- [ ] Clicking payment examines parrot (costs 100 coins)
- [ ] Examined: shows full genetic breakdown
- [ ] Cannot examine if insufficient coins (error toast)
- [ ] Cannot examine same parrot twice (no double-charge)
- [ ] Works for parrots in collection
- [ ] Works for offspring in breeding lab

**Visual Indicators**:
- [ ] L badge: Blue, top-left, letter "L"
- [ ] R badge: Pink, top-left, letter "R"
- [ ] Examined badge: Green, top-right, microscope icon
- [ ] Lock badge: Orange, top-center, lock icon
- [ ] Multiple badges don't overlap
- [ ] Badges visible on all card instances
- [ ] Badges persist across tab switches

**Splash Screen**:
- [ ] Appears on initial page load
- [ ] Shows game title with animation
- [ ] Shows description
- [ ] "Start Playing" button visible
- [ ] Clicking button dismisses splash
- [ ] Game interface appears after dismissal

### Edge Cases

**Empty States**:
- [ ] Collection empty: shows "No parrots yet!" message
- [ ] Breeding lab empty: shows "Breed parrots to see offspring here!"
- [ ] All parrots sold: collection empties correctly
- [ ] Store after buying all: updates correctly

**Boundary Conditions**:
- [ ] 0 coins: cannot buy, breed, examine
- [ ] Large collection (50+ parrots): renders without lag
- [ ] Many offspring accumulated (20+): grid layout works
- [ ] All offspring locked: "Sell All" shows appropriate error/feedback

**Unusual Interactions**:
- [ ] Select parrot, switch tabs, come back: still selected
- [ ] Breed, switch tabs, come back: offspring still visible
- [ ] Lock parrot in breeding slot: still breedable
- [ ] Examine offspring, then move to collection: stays examined

**Concurrent Actions**:
- [ ] Double-click breed button: doesn't breed twice
- [ ] Rapid clicking: actions don't stack incorrectly
- [ ] Click during animation: doesn't break state

### Persistence Testing

**Save Functionality**:
- [ ] Breed parrots → refresh page → offspring lost (intended)
- [ ] Buy parrot → refresh page → parrot still in collection
- [ ] Lock parrot → refresh page → still locked
- [ ] Toggle auto-examine → refresh page → setting preserved
- [ ] Toggle mutations → refresh page → setting preserved
- [ ] Earn coins → refresh page → coins preserved

**localStorage Inspection**:
```javascript
// Check save exists
const save = localStorage.getItem('chromawing_save');
console.log('Save exists:', save !== null);

// Inspect contents
const data = JSON.parse(save);
console.log('Parrots:', data.parrots.length);
console.log('Coins:', data.coins);
console.log('Settings:', {
  mutations: data.mutationsEnabled,
  autoExamine: data.autoExamineEnabled
});
console.log('Locked:', data.lockedParrots);
console.log('Examined:', data.examinedParrots);
```

**Clear and Reload**:
```javascript
// Clear save, reload, verify fresh game
localStorage.removeItem('chromawing_save');
location.reload();
// Should show starter parrots, 500 coins, default settings
```

### Browser Compatibility

**Test in Multiple Browsers**:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if available)
- [ ] Mobile browser (responsive design)

**Common Browser Differences**:
- ES6 module support
- localStorage behavior
- SVG rendering
- CSS gradient rendering
- Animation performance

### Responsive Design

**Screen Sizes**:
- [ ] Desktop (1920x1080): optimal layout
- [ ] Laptop (1366x768): fits without scrolling
- [ ] Tablet (768x1024): readable, usable
- [ ] Mobile (375x667): grid adapts, text readable

**Viewport**:
- [ ] Game fits viewport without scrolling main container
- [ ] Individual sections scroll when content exceeds height
- [ ] Breeding tab scrolls properly

## Automated Testing (Future)

### Unit Tests (Not Yet Implemented)

**Potential tests**:
- Genetics: breedBodyPart produces valid offspring
- Economy: coin transactions calculate correctly
- Validation: input validation functions work
- State: gameState setters/getters work correctly

### Integration Tests (Not Yet Implemented)

**Potential tests**:
- Breeding flow: select parents → breed → offspring appear
- Purchase flow: select store parrot → buy → added to collection
- Lock flow: lock parrot → attempt sell → prevented

## Test Data Generation

### Creating Test Scenarios

**Many Parrots**:
```javascript
// Add parrots to collection for testing
for (let i = 0; i < 50; i++) {
  const genes = createParrotWithPurity('random');
  const parrot = new Parrot(`Test-${i}`, genes, 1, GameState.getAndIncrementParrotIdCounter());
  GameState.addParrot(parrot);
}
UI.updateUI();
```

**Lots of Coins**:
```javascript
GameState.setCoins(10000);
UI.updateStats();
saveGame();
```

**All Parrots Locked**:
```javascript
GameState.getParrots().forEach(p => GameState.addLockedParrot(p.id));
UI.updateUI();
saveGame();
```

**Clear Everything**:
```javascript
localStorage.removeItem('chromawing_save');
location.reload();
```

## Regression Testing

### After Making Changes

**Always test**:
1. The feature you changed (targeted testing)
2. Related features (integration testing)
3. Core game loop (regression testing)

**Example**: After adding lock system
- [ ] Lock feature works (targeted)
- [ ] Breeding/selling still work (integration)
- [ ] Buy/breed/examine work (regression)

### Critical Paths to Test

**After any change, verify**:
- [ ] Can buy parrot from store
- [ ] Can breed two parrots
- [ ] Offspring appear in breeding lab
- [ ] Can move offspring to collection
- [ ] Save and reload preserves state
- [ ] No console errors

## Bug Reporting

### Reporting Checklist

**Include**:
1. **Steps to reproduce**: Exact sequence of actions
2. **Expected behavior**: What should happen
3. **Actual behavior**: What actually happened
4. **Browser**: Chrome, Firefox, etc.
5. **Console errors**: Copy from DevTools console
6. **Save state**: localStorage contents if relevant

**Example**:
```
Bug: Lock badge not appearing immediately

Steps:
1. Select parrot from collection
2. Click "Lock Parrot" button
3. Observe card

Expected: Lock badge appears immediately
Actual: Badge only appears after deselecting/reselecting parrot

Browser: Chrome 120
Console: No errors
```

## Performance Testing

### Metrics to Check

**Rendering**:
- Time to render 50 parrot cards: < 500ms
- Time to update breeding lab: < 200ms
- Time to switch tabs: < 100ms

**Operations**:
- Save game: < 10ms
- Load game: < 50ms
- Breed parrots: < 100ms

**Measurement**:
```javascript
console.time('render-cards');
await renderParrotGrid();
console.timeEnd('render-cards');
```

### Performance Issues

**Signs**:
- Visible lag when interacting
- Slow page load
- Choppy animations
- Delayed responses

**Solutions**:
- Profile with DevTools
- Optimize hot paths
- Reduce DOM updates
- Use efficient algorithms

## Pre-Release Checklist

### Before Deploying

- [ ] All core features tested
- [ ] No console errors in any tab
- [ ] Save/load works correctly
- [ ] Tested in Chrome, Firefox, Safari
- [ ] Tested on mobile
- [ ] Performance acceptable (no lag)
- [ ] Visual polish (no broken layouts)
- [ ] Edge cases handled gracefully
- [ ] Regression tests pass
- [ ] Documentation updated

### Deployment Test

**After deploying**:
1. Visit live site
2. Run through core game loop
3. Test in multiple browsers
4. Check mobile responsiveness
5. Verify no console errors
6. Test save/load on live site

## Testing Tools

### Browser DevTools

**Console**: Errors, logging, state inspection
**Elements**: DOM inspection, CSS debugging
**Network**: File loading, timing
**Application**: localStorage inspection
**Performance**: Profiling, bottlenecks

### Manual Testing Tools

**Test Data Generation**: Console scripts to create scenarios
**localStorage Editor**: Manually edit save data
**Screen Recorder**: Record bugs for reporting
**Multiple Browsers**: Cross-browser testing

## Best Practices

### Test Early, Test Often

- Test feature as you build it
- Don't wait until "done" to test
- Catch issues early when easier to fix

### Test Like a User

- Don't just test happy path
- Try to break things
- Think of unusual interactions
- Test what you think might fail

### Document Test Cases

- Keep this checklist updated
- Add new tests for new features
- Remove obsolete tests

### Fix Bugs Immediately

- Don't let bugs accumulate
- Fix while context fresh
- Re-test after fixing
