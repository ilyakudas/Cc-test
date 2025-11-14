# Debugging Guide

**Purpose**: Solutions to common issues and debugging techniques.

**Related docs**: [Setup Guide](SETUP.md), [Testing Guide](TESTING.md)

## Common Issues

### Badges Not Appearing Immediately

**Symptoms**:
- Lock badge doesn't show after locking
- L/R breeding badges appear only after tab switch
- Examined badge delayed

**Root Cause**: UI not refreshed after state change

**Solutions**:
1. Add UI update call after state modification
2. Ensure async/await used correctly
3. Call specific update function (e.g., `updateBreedingLab()` when on breeding tab)

**Prevention**:
- Always update UI after state changes
- Use consistent pattern: modify state → update UI → save

### State Not Persisting Across Sessions

**Symptoms**:
- Game resets on browser refresh
- New parrots disappear
- Coins reset

**Possible Causes**:
1. **localStorage disabled** (private browsing)
2. **Save function not called** after state changes
3. **New property not in save data** (forgot to add to storage.js)
4. **localStorage quota exceeded** (rare)

**Debug Steps**:
```javascript
// Check if localStorage available
console.log('localStorage available:', typeof(Storage) !== 'undefined');

// Check if save exists
const save = localStorage.getItem('chromawing_save');
console.log('Save exists:', save !== null);
console.log('Save size:', save ? save.length : 0, 'characters');

// Inspect save contents
if (save) {
  const data = JSON.parse(save);
  console.log('Save data:', data);
  console.log('Parrot count:', data.parrots.length);
  console.log('Coins:', data.coins);
}
```

**Solutions**:
- Use standard browsing mode (not private/incognito)
- Add saveGame() call after state modifications
- Add new properties to saveGame() and loadGame() in storage.js
- Check browser console for quota errors

### Offspring Lost When Breeding Multiple Times

**Symptoms**:
- Breed parrots → 4 offspring appear
- Breed again → original 4 disappear, only new 4 remain

**Root Cause**: Setting offspring array instead of appending

**Solution**: Use append operation, not set
```javascript
// WRONG
GameState.setRecentOffspring(newOffspring);  // Replaces!

// RIGHT
newOffspring.forEach(parrot => GameState.addRecentOffspring(parrot));  // Appends
```

### Button Clicks Not Working on Text

**Symptoms**:
- Clicking button text does nothing
- Clicking button edges works
- Hover animation doesn't trigger

**Root Cause**: Child elements (text) blocking pointer events

**Solution**: Add CSS pointer-events management
```css
.btn {
  pointer-events: auto;  /* Button captures events */
}

.btn * {
  pointer-events: none;  /* Children don't block */
}
```

### Grid Layout Showing Vertical Column Instead

**Symptoms**:
- Parrot cards stack vertically
- Expected grid layout

**Root Cause**: Grid CSS applied to wrong element

**Solution**: Apply grid to direct parent of cards
- If creating container div, apply grid to that container
- Don't apply grid to wrapper containing header + cards

### Breeding Not Deducting Correct Coin Amount

**Symptoms**:
- Auto-examine budget calculation wrong
- Coins don't decrease by expected amount

**Root Cause**: Using stale coin value

**Solution**: Update coin variable after each deduction
```javascript
let coins = GameState.getCoins();
GameState.addCoins(-BREEDING_COST);
coins = GameState.getCoins();  // UPDATE HERE before auto-examine calculation
```

### Heart Button Not Activating

**Symptoms**:
- Both parents selected
- Heart button stays gray/inactive
- No pulse animation

**Possible Causes**:
1. **State not updated**: Breeding pair state not set correctly
2. **UI not refreshed**: Heart button update function not called
3. **Condition check wrong**: Logic checking wrong variable

**Debug Steps**:
```javascript
// Check breeding pair state
console.log('Breeding pair:', GameState.getBreedingPair());
// Should show: { left: X, right: Y } with both non-null

// Check if update function called
// Add log to updateHeartButton() function
console.log('Updating heart button, pair:', breedingPair);
```

**Solution**: Call heart button update after parent selection

### Laboratory Modal Not Opening

**Symptoms**:
- Click examine button
- Nothing happens
- No error in console

**Possible Causes**:
1. **Parrot not found**: Looking in wrong array (collection vs offspring)
2. **Modal not defined**: HTML element missing
3. **Event handler not attached**: onclick not registered

**Debug Steps**:
```javascript
// Check if parrot exists in both arrays
const parrot = GameState.getParrotById(parrotId) || GameState.getRecentOffspringById(parrotId);
console.log('Parrot found:', parrot !== null);

// Check if modal element exists
const modal = document.getElementById('laboratoryModal');
console.log('Modal exists:', modal !== null);
```

**Solution**: Check both parrot arrays
```javascript
const parrots = GameState.getParrots();
const offspring = GameState.getRecentOffspring();
const parrot = parrots.find(p => p.id === parrotId) ||
                offspring.find(p => p.id === parrotId);
```

### Locked Parrots Being Sold/Dismissed

**Symptoms**:
- "Sell All" sells locked parrots
- "Dismiss All" dismisses locked parrots

**Root Cause**: Batch operations not checking lock status

**Solution**: Filter by lock status before operating
```javascript
const unlockedOffspring = offspring.filter(p => !GameState.isParrotLocked(p.id));
// Operate only on unlockedOffspring
```

## Debugging Techniques

### Browser DevTools Console

**View State**:
```javascript
// Access game state (if in window scope or using module scope trick)
// Check specific values
console.log('Coins:', GameState.getCoins());
console.log('Parrots:', GameState.getParrots());
console.log('Breeding pair:', GameState.getBreedingPair());
```

**Monitor Function Calls**:
```javascript
// Add at start of function
export function breedParrots(saveGameFn, checkAchievementsFn) {
  console.log('breedParrots called');
  // ... rest of function
}
```

**Track Execution Flow**:
```javascript
export async function performExamination(parrotId, saveGameFn) {
  console.log('1. Starting examination for parrot:', parrotId);

  const parrot = getParrot(parrotId);
  console.log('2. Found parrot:', parrot !== null);

  if (alreadyExamined) {
    console.log('3. Already examined, opening lab');
    return;
  }

  console.log('4. Deducting coins and marking examined');
  // ... rest
}
```

### Breakpoint Debugging

**Set Breakpoints**:
1. Open DevTools → Sources tab
2. Navigate to file (e.g., `actions/breeding.js`)
3. Click line number to set breakpoint
4. Trigger action (e.g., click breed button)
5. Execution pauses at breakpoint
6. Inspect variables in Scope panel
7. Step through code with controls

**Conditional Breakpoints**:
- Right-click line number
- "Add conditional breakpoint"
- Enter condition (e.g., `parrotId === 5`)
- Breakpoint only triggers when condition true

### Network Tab Monitoring

**Check File Loading**:
- Open DevTools → Network tab
- Refresh page
- Verify all JS files load (200 status)
- Check for 404s (missing files)
- Verify SVG loads

**Common Issues**:
- 404 on module imports (wrong path)
- SVG not found (path error)
- CORS errors (not using local server)

### localStorage Inspection

**View Saves** (Application tab):
1. DevTools → Application tab
2. Storage → Local Storage
3. Select domain
4. Find `chromawing_save` key
5. View value (JSON string)

**Manually Edit**:
- Click value
- Edit JSON (careful!)
- Can modify coins, add parrots, etc.
- Reload page to load edited save

**Clear Save**:
```javascript
localStorage.removeItem('chromawing_save');
location.reload();
```

## Performance Debugging

### Laggy UI with Many Parrots

**Symptoms**:
- Slow card rendering
- Delayed interactions
- Choppy animations

**Debug**:
1. DevTools → Performance tab
2. Click record
3. Perform laggy action
4. Stop recording
5. Analyze flame graph

**Common Bottlenecks**:
- SVG cloning/manipulation
- Excessive DOM updates
- Inefficient loops
- Synchronous operations

**Solutions**:
- Virtual scrolling for large lists
- Debounce frequent updates
- Use document fragments for batch DOM updates
- Profile and optimize hot paths

### Slow Save Operations

**Symptoms**:
- Game freezes when saving
- Noticeable delay after actions

**Debug**:
```javascript
console.time('save');
saveGame();
console.timeEnd('save');
// Shows: save: X ms
```

**Solutions**:
- Debounce saves (wait 500ms after last change)
- Optimize save data structure
- Consider differential saves (only changes)

## Error Messages

### "Cannot read property 'X' of null/undefined"

**Cause**: Trying to access property on null/undefined object

**Debug**:
- Check which variable is null
- Add null check before access
- Ensure initialization happened

**Example Fix**:
```javascript
// Before
const parrot = GameState.getParrotById(id);
console.log(parrot.name);  // Error if parrot is null!

// After
const parrot = GameState.getParrotById(id);
if (!parrot) {
  console.error('Parrot not found:', id);
  return;
}
console.log(parrot.name);  // Safe
```

### "X is not a function"

**Cause**: Calling something that's not a function

**Common Reasons**:
- Typo in function name
- Module not imported
- Function not exported
- Calling property instead of method

**Debug**:
```javascript
console.log('Type of X:', typeof X);
console.log('X is:', X);
```

### "Unexpected token 'export'"

**Cause**: Browser trying to run module as regular script

**Solution**:
- Ensure `<script type="module">` in HTML
- Use local server (not file://)
- Check all imports have .js extension

## Testing Fixes

### Verify Fix Works

1. Reproduce original issue
2. Apply fix
3. Test that issue resolved
4. Test related functionality still works
5. Test edge cases

### Regression Testing

After fixing:
- [ ] Breeding still works
- [ ] Buying/selling works
- [ ] Examination works
- [ ] Save/load works
- [ ] Badges appear correctly
- [ ] No new console errors

## Prevention

### Code Review Checklist

Before committing changes:
- [ ] No console errors
- [ ] Tested happy path
- [ ] Tested edge cases
- [ ] Save/load works
- [ ] UI updates correctly
- [ ] Added necessary logging
- [ ] Removed debug logs

### Common Pitfalls

**Avoid**:
- Direct state access (use getters/setters)
- Forgetting to save after state changes
- Not updating UI after state changes
- Assuming variables non-null
- Setting arrays instead of appending
- Applying CSS to wrong element
- Using stale variable values

**Always**:
- Validate input
- Check for null/undefined
- Update state → update UI → save
- Test in multiple browsers
- Use console.log liberally during development
