# Offspring Management Feature

**Purpose**: System for managing parrots created through breeding before moving them to main collection.

**Related docs**: [Breeding Lab](BREEDING_LAB.md), [Lock System](LOCK_SYSTEM.md), [Auto-Examine](AUTO_EXAMINE.md)

## Overview

When parrots breed, offspring are placed in a temporary holding area in the Breeding Lab. Players can examine, lock, and decide what to do with offspring before committing them to their main collection.

## Core Concepts

### Temporary Storage

**Behavior**:
- Offspring created by breeding appear in Breeding Lab
- Multiple breeding operations accumulate offspring (don't replace)
- Offspring persist until player takes action
- NOT saved across game sessions (intentional - temporary workspace)

**Capacity**: Unlimited (no hard cap on accumulation)

### State Transitions

Offspring can move through these states:

```
Breeding → Recent Offspring (Breeding Lab)
           ↓                  ↓              ↓
    Move to Collection    Sell All    Dismiss All
           ↓                  ↓              ↓
    Main Collection      Convert to Coins   Deleted
```

## Management Actions

### 1. Move All to Collection

**Purpose**: Transfer all offspring from Breeding Lab to main collection

**Requirements**:
- User must have sufficient collection space
- Action is immediate (no confirmation)

**Behavior**:
- All offspring added to main collection
- Recent offspring list cleared
- Toast notification: "X parrot(s) moved to collection"

**Use Cases**:
- Keeping all offspring from breeding
- Clearing breeding lab after examination
- Making room for next breeding session

### 2. Sell All Offspring

**Purpose**: Quickly monetize offspring without examining or moving to collection

**Requirements**:
- At least one unlocked offspring exists

**Calculation**:
- Each parrot has value based on: rarity, beauty score, generation
- Total = sum of all unlocked offspring values
- Locked offspring are NOT sold (remain in breeding lab)

**Behavior**:
- Calculates total value of unlocked offspring
- Adds coins to player balance
- Removes sold offspring from breeding lab
- Locked offspring remain

**Feedback**:
- If all sold: "X parrot(s) sold for Y coins"
- If some locked: "X sold for Y coins. Z locked offspring kept."

**Use Cases**:
- Quick cash when breeding for specific traits
- Clearing unwanted offspring
- Efficient workflow for power breeders

### 3. Dismiss All Offspring

**Purpose**: Release offspring to the wild (delete without selling)

**Requirements**:
- At least one unlocked offspring exists

**Behavior**:
- Removes unlocked offspring from game
- No coins awarded
- Locked offspring remain

**Feedback**:
- If all dismissed: "X parrot(s) released to the wild"
- If some locked: "X released. Y locked offspring kept."

**Use Cases**:
- Role-playing choice (ethical release vs selling)
- Clearing space without economic gain
- Alternative to selling

## Lock Integration

### Protection Rules

**Locked offspring**:
- Cannot be sold via "Sell All"
- Cannot be dismissed via "Dismiss All"
- CAN be moved to collection
- CAN be individually selected, examined, unlocked

**User Flow**:
1. Breed parrots → 4 offspring appear
2. Examine offspring to see genetics
3. Lock valuable ones (rare genes, high beauty)
4. Sell/dismiss the rest
5. Move locked ones to collection

### Visual Indicators

**Lock Badge**: Orange circle with lock icon (🔒)
- Position: Top center of parrot card
- Appears immediately when locked
- Persists across tab switches

**Button State**: Lock/unlock button in action menu
- Shows current state
- Toggles on click

## Display Requirements

### Header Section

**Content**: "X chick(s) waiting"
- Singular: "1 chick waiting"
- Plural: "4 chicks waiting"
- Updates immediately when offspring added/removed

### Grid Layout

**Arrangement**: Responsive grid matching collection view
- Minimum card width: 140px
- Auto-fill columns based on available width
- Gap between cards: 12px

**Card Content**:
- Full parrot visualization (SVG)
- Name
- Rarity indicator
- Lock badge (if locked)
- Examined badge (if examined)
- Breeding badges (L/R if selected for breeding)

**Selectability**: Offspring cards are fully interactive
- Click to select
- Action buttons appear
- Can be examined, locked, bred

### Action Buttons Section

**Layout**: Horizontal row below header, above grid

**Buttons** (left to right):
1. Move All (📦) - Blue/purple gradient
2. Sell All (💰) - Green gradient
3. Dismiss All (✖️) - Gray gradient

**Button Text Format**: "Action (count)"
- Example: "Move All (4) to Collection"
- Count updates dynamically

**Visual Consistency**:
- All buttons same height
- Similar width (content-based with padding)
- Same border-radius and shadow
- Consistent hover animation

## Edge Cases

### No Offspring Present

**Display**: Empty state message
- Text: "Breed parrots to see offspring here!"
- Centered in grid area
- Muted text color

**Buttons**: Not shown or disabled

### All Offspring Locked

**Sell All / Dismiss All**:
- Show error toast: "All offspring are locked. Unlock some first."
- Or disable buttons with tooltip

**Move All**: Still works (moves locked offspring to collection)

### Large Numbers

**Accumulation**: Grid layout should scale gracefully
- Test with 20+ offspring
- Scroll container if needed
- Maintain grid layout (not vertical column)

### Mixed Lock States

**Example**: 8 offspring, 3 locked
- "Sell All (5)" - only sells unlocked ones
- After selling: "5 sold for 450 coins. 3 locked offspring kept."
- Grid shows remaining 3 locked offspring

## User Experience Goals

### Informed Decisions
- Examine offspring before committing to collection
- Lock valuable ones for safety
- Flexibility in handling unwanted offspring

### Efficient Workflow
- Batch operations for speed
- Clear feedback on what's happening
- No accidental loss of valuable parrots

### Safety
- Lock system prevents mistakes
- Clear warnings when all locked
- Toast notifications confirm actions

## Technical Considerations

### State Management
- Separate array for recent offspring vs main collection
- Independent from main parrot array
- Lock status tracked per parrot ID

### Performance
- Grid rendering should be efficient for 20+ cards
- Batch operations should be instant
- No lag when moving large numbers to collection

### Data Persistence
- Recent offspring NOT saved (intentional design choice)
- Lock status IS saved (if offspring moved to collection)
- Breeding lab clears on game reload

## Future Enhancements

Potential additions:
- Individual offspring actions (sell one, dismiss one)
- Sorting/filtering offspring
- Comparison view (side-by-side offspring analysis)
- "Keep best X" automation
- Breeding lab capacity limit (optional)
