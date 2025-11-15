# Storage System

**Purpose**: Persist game state across browser sessions using localStorage.

**Related docs**: [Architecture Overview](../architecture/OVERVIEW.md), [State Management](../architecture/STATE_MANAGEMENT.md)

## Overview

The storage system saves and loads complete game state to browser localStorage, allowing players to continue their game after closing the browser. It handles complex data types (Sets, nested objects) and provides automatic migration from legacy save formats.

## Requirements

### Save Triggers

**Automatic Save**: Game saves on every significant state change
- After breeding parrots
- After buying/selling parrots
- After examination
- After toggling settings (mutations, auto-examine)
- After locking/unlocking parrots
- After contest completion

**Manual Save**: Not currently implemented (could add "Save Game" button)

**Frequency**: Immediate (no debouncing/throttling currently)
- Every action triggers save
- Ensures minimal data loss
- May have performance implications with very large collections

### Save Location

**Storage Method**: Browser localStorage
- Key name: `chromawing_save`
- Capacity: 5-10MB (browser-dependent)
- Persists across sessions
- Tied to domain/origin

**Why localStorage (not cookies)**:
- Much larger capacity (cookies limited to 4KB)
- Save data can be 6-8KB+ with large collections
- No server transmission overhead
- Better performance for large data

### Data Completeness

**Saved State**:
- All parrots in collection (genes, names, IDs, generation)
- All store parrots (refreshed inventory)
- Coins and player resources
- Game settings (mutations enabled, auto-examine enabled)
- Parrot examination status (Set of examined IDs)
- Parrot lock status (Set of locked IDs)
- Contest progress per parrot
- Achievement progress
- Used parrot names (prevent duplicates)
- Counter values (next parrot ID, generation)

**Not Saved** (intentional):
- Recent offspring (breeding lab is temporary workspace)
- Selected parrot ID (selection state)
- Current tab (UI state)
- Breeding pair selection (temporary)
- Modal open state (UI state)
- Toast notifications (transient)

## Save Format

### Data Structure

**Top-Level Object**:
```
{
  parrots: [...],           // Array of parrot objects
  storeParrots: [...],      // Array of store parrot objects
  coins: number,
  parrotIdCounter: number,
  generation: number,
  examinedParrots: [...],   // Array (converted from Set)
  lockedParrots: [...],     // Array (converted from Set)
  contestProgress: {...},   // Object
  parrotTrophies: {...},    // Object
  achievements: {...},      // Object
  mutationsEnabled: boolean,
  autoExamineEnabled: boolean,
  usedNames: [...]          // Array (converted from Set)
}
```

### Parrot Serialization

**Each Parrot Object**:
```
{
  name: string,
  genes: {
    wings: { red: [...], green: [...], blue: [...], gradient: boolean },
    special_wing: { red: [...], green: [...], blue: [...], gradient: boolean },
    body: { red: [...], green: [...], blue: [...], gradient: boolean },
    head: { red: [...], green: [...], blue: [...], gradient: boolean },
    tail: { red: [...], green: [...], blue: [...], gradient: boolean },
    accents: { red: [...], green: [...], blue: [...], gradient: boolean }
  },
  generation: number,
  id: number
}
```

**Note**: No computed properties saved (beauty score, rarity) - recalculated on load

### Set Conversion

**Save**: Convert Set to Array
- `Array.from(setObject)`
- Preserves all values
- Compatible with JSON serialization

**Load**: Convert Array to Set
- `new Set(arrayObject)`
- Restores O(1) lookup performance
- Prevents duplicates

## Load Process

### Load Sequence

1. **Check for existing save**: Look for `chromawing_save` in localStorage
2. **Parse JSON**: Convert string to object
3. **Validate data**: Check for required fields
4. **Reconstruct state**: Create parrot objects from plain data
5. **Convert Sets**: Rebuild Set objects from arrays
6. **Set state**: Update all game state variables
7. **Conditional generation**: Generate store only if empty
8. **Update UI**: Refresh all displays

### Legacy Migration

**Cookie Migration**: Automatically detect and migrate old cookie-based saves
- Check for `chromawing_save` cookie
- Parse and convert to new format
- Save to localStorage
- Delete old cookie

**Backwards Compatibility**: Handle saves missing new fields
- Default values for new features
- Example: `autoExamineEnabled = gameStateData.autoExamineEnabled ?? false`
- Prevents errors when loading old saves

## Error Handling

### Save Failures

**Quota Exceeded**:
- localStorage full (rare with 5-10MB limit)
- Fallback: Show error toast, continue playing without saving
- Future: Implement compression or selective saving

**Serialization Errors**:
- Invalid data (circular references, functions)
- Validation before save
- Error logging for debugging

### Load Failures

**Corrupt Save Data**:
- Invalid JSON
- Missing required fields
- Fallback: Start new game, log error

**Missing Save**:
- First time playing
- Save deleted by user
- Browser cleared
- Behavior: Start new game (default initialization)

## Data Integrity

### Validation

**On Save**:
- Ensure all parrots have required properties
- Validate counter values (non-negative)
- Check Set conversions successful

**On Load**:
- Verify parrot objects well-formed
- Validate gene arrays correct length
- Ensure IDs unique
- Check counters logical (next ID > max existing ID)

### Consistency

**Parrot IDs**: Must be unique
- Enforced by counter increment
- Validation on load

**Referenced IDs**: Must exist
- Contest progress references parrot IDs
- Examined/locked Sets reference parrot IDs
- Cleanup orphaned references on load (optional)

## Performance Considerations

### Save Performance

**Serialization Cost**: JSON.stringify on every save
- Potentially expensive with 100+ parrots
- ~1-2ms typically (acceptable)
- Could add debouncing if problematic

**Storage Write**: localStorage.setItem synchronous
- Blocks main thread briefly
- Browser-dependent performance
- Usually < 5ms

**Optimization Opportunities**:
- Debounce saves (wait 500ms after last change)
- Differential saves (only changed data)
- Compression (LZ-string library)

### Load Performance

**Parsing Cost**: JSON.parse on page load
- Proportional to data size
- ~1-3ms typically
- Unavoidable cost

**Reconstruction Cost**: Creating parrot objects
- Loop through all parrots
- Calculate computed properties
- ~5-10ms for 50 parrots

**UI Update Cost**: Rendering loaded state
- SVG generation for all cards
- Potentially expensive
- Could show loading screen

## Future Enhancements

### Cloud Saves
- Sync across devices
- Backup protection
- Requires backend service

### Import/Export
- Download save file
- Share parrots with friends
- Backup to file system
- Import from file

### Save Slots
- Multiple save files
- Quick switch between games
- Named saves

### Auto-Save Indicator
- Visual confirmation of saves
- "Last saved: 5 seconds ago"
- Peace of mind for players

### Compression
- Reduce storage size
- Allow more parrots
- LZ-string or similar

### Differential Saves
- Track changed state
- Save only changes
- More efficient for large collections
- Complexity trade-off

## Technical Notes

### localStorage API

**Set Item**:
```
localStorage.setItem(key, value)
```
- `value` must be string (use JSON.stringify)
- Throws if quota exceeded
- Synchronous operation

**Get Item**:
```
const value = localStorage.getItem(key)
```
- Returns string or null
- Use JSON.parse to convert back
- Synchronous operation

**Remove Item**:
```
localStorage.removeItem(key)
```
- Deletes save
- Use for "Delete Save" feature

### Storage Limits

**Typical Limits** (browser-dependent):
- Chrome: 10MB
- Firefox: 10MB
- Safari: 5MB
- Edge: 10MB

**Current Usage**: ~6-8KB for medium collection
- 50 parrots: ~6KB
- 100 parrots: ~12KB
- 500 parrots: ~60KB
- Well within limits

### Cross-Browser Compatibility

**Support**: All modern browsers
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support

**Private Browsing**: May be disabled or cleared
- User choice
- Can't force enable
- Detect and warn user

## Design Rationale

### Why Not Server-Side Saves?

**No Backend**: Game is static HTML/JS
- Simpler deployment (Firebase Hosting)
- No server costs
- No account system needed
- Privacy (no data sent to server)

**Offline Play**: Works without internet
- localStorage available offline
- No connectivity required
- Faster (no network latency)

### Why Save Everything?

**Complete State**: Easier to reason about
- No complex differential logic
- Guaranteed consistency
- Simpler debugging

**Storage Not Constrained**: 10MB >> actual usage
- Room to grow
- No need to optimize early
- Can add more features

### Why Not Save Offspring?

**Temporary Workspace**: Breeding lab is staging area
- Encourages decision-making
- Reduces save data size
- Clear mental model (temporary vs permanent)

**Intentional Loss**: Forces player engagement
- Can't accumulate indefinitely
- Must manage breeding sessions
- Creates gameplay loop
