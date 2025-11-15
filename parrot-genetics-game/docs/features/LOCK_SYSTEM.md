# Lock System Feature

**Purpose**: Protect valuable parrots from accidental selling or releasing to the wild.

**Related docs**: [Offspring Management](OFFSPRING.md), [Breeding Lab](BREEDING_LAB.md)

## Overview

The Lock System allows players to mark specific parrots as "locked", preventing them from being sold or dismissed. This protects valuable breeding stock, contest winners, and rare genetic combinations from accidental loss.

## User Requirements

### Lock/Unlock Action

**Access**: Parrot action buttons panel (appears when parrot selected)
- Position: After "Enter Contest" button
- Available everywhere parrot can be selected (collection, breeding lab, offspring)

**Button States**:
- **When Unlocked**: Blue button, lock icon (🔒), text "Lock Parrot"
- **When Locked**: Gray button, unlock icon (🔓), text "Unlock Parrot"

**Interaction**: Single click toggles lock state

### Visual Indicator

**Lock Badge**: Shows on parrot card when locked
- Icon: Lock emoji (🔒)
- Position: Top center of card
- Size: 28px diameter circle
- Background: Orange gradient (from #ff9800 to #ff6f00)
- Text color: White
- Shadow: Subtle drop shadow for depth
- Z-index: High (above other elements)

**Visibility**: Badge appears on all instances of locked parrot
- Collection view cards
- Breeding lab offspring cards
- Breeding slot cards
- Preview panel
- Laboratory modal

**Update Timing**: Badge appears/disappears immediately when lock toggled

### Protection Behavior

**Prevented Actions**:
1. **Selling** (hold-to-sell gesture)
   - Error toast: "[Parrot Name] is locked. Unlock the parrot first to sell it."
   - Action blocked before hold timer starts

2. **Freeing** (release to wild button)
   - Error toast: "[Parrot Name] is locked. Unlock the parrot first to release it."
   - Action blocked immediately

3. **Batch Operations** (Sell All / Dismiss All in breeding lab)
   - Locked offspring skipped
   - Feedback: "X sold. Y locked offspring kept."
   - Locked offspring remain in breeding lab

**Allowed Actions**:
- Breeding (both as parent)
- Entering contests
- Laboratory examination
- Selecting for viewing
- Moving to collection (if in breeding lab)

## User Workflows

### Protecting a Valuable Parrot

1. User identifies valuable parrot (rare genes, high beauty, contest winner)
2. Selects parrot
3. Clicks "Lock Parrot" button
4. Lock badge appears immediately
5. Toast confirmation: "[Parrot Name] locked. Protected from selling and releasing."
6. Parrot now safe from accidental loss

### Using Protected Parrot

1. User can still select locked parrot
2. Can breed it (common use case for valuable breeding stock)
3. Can enter contests
4. Can examine in laboratory
5. Cannot sell or free

### Unlocking When Needed

1. User selects locked parrot
2. Clicks "Unlock Parrot" button
3. Lock badge disappears immediately
4. Toast confirmation: "[Parrot Name] unlocked. Can now be sold or released."
5. Parrot can be sold/freed

### Batch Operations with Mixed Lock States

**Scenario**: Breeding lab has 10 offspring, 3 are locked

1. User clicks "Sell All"
2. System checks each offspring
3. 7 unlocked offspring sold (total value calculated)
4. 3 locked offspring remain
5. Toast: "7 sold for 630 coins. 3 locked offspring kept."
6. Breeding lab shows remaining 3 locked offspring

## Use Cases

### Breeding Stock Protection
- Lock parrots with rare genetic combinations
- Prevents accidentally selling valuable parents
- Safe to sell other parrots without fear

### Contest Winner Protection
- Lock parrots that won contests
- Preserve trophy winners for future breeding
- Build collection of champions

### Collection Management
- Lock favorites or named parrots with emotional attachment
- Lock parrots being tracked for achievements
- Lock examples of each rarity tier

### Breeding Lab Workflow
- Breed multiple pairs
- Examine all offspring
- Lock valuable ones
- Sell/dismiss the rest
- Move locked ones to collection

## Design Rationale

### Why Lock (Not Delete Prevention)?

**Positive Framing**: "Protect this parrot" vs "Don't delete this parrot"
- More intuitive mental model
- Matches physical world metaphor (locking valuables)
- Clear visual indicator (lock icon universally understood)

### Why Top Center Position?

**Visibility**: Most prominent position for critical indicator
- Not hidden by other badges
- Clearly visible at all card sizes
- Distinguishable from L/R breeding badges (corners)
- Distinguishable from examined badge (top right)

**Priority**: Lock status is safety-critical
- More important than breeding selection (temporary state)
- More important than examination status (informational)

### Why Orange Color?

**Attention**: Orange is warning/caution color
- Not error (red)
- Not success (green)
- Not informational (blue)
- Stands out from other badge colors

**Association**: Orange often used for protection/security
- Matches "caution" mental model
- Distinct from game's purple/pink breeding theme

### Why Allow Breeding?

**Primary Use Case**: Locked parrots are often valuable breeding stock
- User locks BECAUSE parrot is good for breeding
- Preventing breeding would defeat primary purpose
- Breeding doesn't remove parrot from collection

### Why Block Batch Operations?

**Safety**: Batch operations are where mistakes happen
- "Sell All" might be clicked hastily
- Locked parrots are too valuable to risk
- Better to force unlocking for intentional sale

**Feedback**: Clear messages help user understand what happened
- "3 locked offspring kept" informs without blocking workflow
- User can unlock and sell individually if desired

## Edge Cases

### Locking Offspring in Breeding Lab

**Scenario**: User breeds, examines offspring, locks valuable one

**Behavior**:
- Lock badge appears on offspring card
- Offspring can be selected, examined, bred
- Cannot be sold/dismissed via batch buttons
- CAN be moved to collection (keeps lock status)

**User Benefit**: Protect valuable offspring before committing to collection

### All Offspring Locked

**Scenario**: All offspring in breeding lab are locked

**Sell All Behavior**:
- Show error toast: "All offspring are locked. Unlock some first to sell."
- No action taken
- Alternative: Disable button with tooltip

**Dismiss All Behavior**: Same as Sell All

**Move All Behavior**: Works normally (moves all to collection)

### Locked Parrot in Breeding Slot

**Scenario**: Locked parrot selected as breeding parent

**Behavior**:
- Works normally (breeding allowed)
- Lock badge visible in breeding slot
- Lock badge visible on collection card (with L/R badge)
- After breeding, parrot still locked

### Lock Status Persistence

**Saved**: Lock status persists across game sessions
- Stored in save data (Set of parrot IDs)
- Reloaded on game load
- Cleared on new game

**Not Saved**: Lock status of offspring not moved to collection
- Offspring cleared on reload (temporary storage)
- Lock only meaningful for collection parrots

## Visual Design Requirements

### Badge Design

**Dimensions**:
- Width: 28px
- Height: 28px
- Border-radius: 50% (perfect circle)

**Colors**:
- Background: Linear gradient, 135deg angle
  - Start: #ff9800 (Orange 500)
  - End: #ff6f00 (Orange 800)
- Icon: White (#ffffff)
- Shadow: 0px 2px 6px rgba(0, 0, 0, 0.3)

**Icon**:
- Emoji: 🔒 (lock)
- Size: ~16px (0.9em)
- Centered in circle

**Z-index**: 10 (above card content, below modals)

### Button Design

**Unlocked State** (blue):
- Background: Teal/cyan (laboratory theme)
- Icon: 🔒
- Text: "Lock Parrot"

**Locked State** (gray):
- Background: Gray (free/release theme)
- Icon: 🔓
- Text: "Unlock Parrot"

**Hover**: Standard button hover (scale, shadow)

### Toast Notifications

**Lock Success**:
- Title: "[Parrot Name] locked"
- Message: "Protected from selling and releasing"
- Type: Success (green)

**Unlock Success**:
- Title: "[Parrot Name] unlocked"
- Message: "Can now be sold or released"
- Type: Info (blue)

**Sell/Free Blocked**:
- Title: "[Parrot Name] is locked"
- Message: "Unlock the parrot first to [sell/release] it"
- Type: Error (red)
- Duration: 3 seconds

## State Management

**Data Structure**: Set of parrot IDs
- Efficient lookup (O(1))
- No duplicates
- Easy serialization (convert to array)

**Operations**:
- Add to set: Lock parrot
- Remove from set: Unlock parrot
- Check membership: Is parrot locked?
- Clear set: New game reset

**Persistence**:
- Save: Convert Set to Array
- Load: Convert Array to Set
- Default: Empty set (no parrots locked)

## Future Enhancements

Potential additions:
- **Lock Reason**: Notes on why parrot is locked
- **Auto-Lock**: Automatically lock parrots meeting criteria (rarity > legendary)
- **Lock Categories**: Different lock types (breeding, collection, contest)
- **Bulk Lock**: Select multiple parrots and lock all
- **Lock Filter**: View only locked parrots in collection
- **Lock Warning**: Confirm before unlocking high-value parrot
