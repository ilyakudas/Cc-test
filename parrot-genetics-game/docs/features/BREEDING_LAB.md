# Breeding Lab Feature

**Purpose**: Dedicated interface for breeding parrots with enhanced functionality and visual feedback.

**Related docs**: [Offspring Management](OFFSPRING.md), [Visual Indicators](VISUAL_INDICATORS.md), [Genetics System](../systems/GENETICS.md)

## Overview

The Breeding Lab is a dedicated tab that provides a focused workspace for breeding operations. It replaces the small breeding slots on the main screen with a full-featured interface.

## User Requirements

### Layout & Navigation

**Tab Position**: Fourth tab after Collection, Store, and Laboratory
- Icon: Heart emoji (💕)
- Label: "Breeding"
- Direct navigation: "Go to Breeding Lab" button on main collection view

**Viewport**: Must fit entirely within viewport without scrolling the main container
- Individual sections scroll independently when content exceeds available space

### Breeding Pair Selection

**Visual Design**:
- Two large slots side-by-side: "Left Parent" and "Right Parent"
- Each slot shows full parrot card when selected
- Empty state shows "+ Select Parent" placeholder

**Selection Flow**:
1. User selects parrot from collection
2. Action buttons appear: "Breed on Left (L)" and "Breed on Right (R)"
3. Clicking button places parrot in corresponding slot
4. L/R badge appears on parrot card in collection view
5. Parrot card appears in breeding slot

**Badge Indicators**:
- Left parent: Blue badge with "L" in top-left corner
- Right parent: Pink/magenta badge with "R" in top-left corner
- Badges appear immediately when parrot is selected for breeding
- Badges persist across tab switches

### Breed Button (Heart Button)

**Location**: Stats bar at top of screen, between "Laboratory" badge and "New Game" button

**Visual States**:
- **Inactive**: Gray, semi-transparent (opacity ~0.3), no animation
- **Active**: Pink gradient background, full opacity, pulsing animation
- Cursor changes to pointer when active

**Activation Condition**: Both left AND right breeding slots filled

**Pulse Animation** (when active):
- Smooth scale from 1.0 to 1.1 and back
- Duration: 2 seconds
- Easing: ease-in-out
- Infinite loop

**Interaction**: Clicking triggers breeding action (costs 50 coins)

### Genetic Compatibility Display

**Purpose**: Show how many genes the selected parents have in common

**Position**: Below breeding pair slots

**Content**:
- Title: "Genetic Compatibility"
- Count display: "X out of 144 genes match"
- Percentage: "X% genetic similarity"
- Visual indicator: Progress bar or color-coded indicator

**Calculation**: Compare all 144 alleles (6 body parts × 4 alleles × 3 colors × 2 for gradient)

### Breeding Predictions

**Purpose**: Preview possible offspring appearance before breeding

**Position**: Below compatibility display

**Content**:
- Title: "Breeding Predictions"
- 2-4 example offspring variations
- Small parrot cards showing different possible outcomes
- Note: "These are examples - actual offspring will vary"

**Generation Method**:
- Run breeding algorithm multiple times with different random seeds
- Show diverse range of possibilities
- Helps user make informed breeding decisions

### Recent Offspring Section

**Purpose**: Display parrots from last breeding operation(s) before moving to collection

**Position**: Bottom section of breeding lab

**Behavior**:
- Offspring remain in breeding lab after breeding
- Multiple breedings accumulate (don't replace previous offspring)
- Display shows: "X chick(s) waiting"

**Layout**: Responsive grid (same as parrot collection grid)

**Management Actions** (3 buttons):
1. **Move All to Collection**: Adds all offspring to main collection, clears breeding lab
2. **Sell All**: Sells all unlocked offspring for coins, keeps locked ones
3. **Dismiss All**: Releases all unlocked offspring to the wild, keeps locked ones

**Button Requirements**:
- Show count in button text: "Move All (4) to Collection"
- All buttons same width for visual consistency
- Buttons disabled if no offspring present

**Lock Protection**:
- Locked offspring cannot be sold or dismissed via batch actions
- Feedback shows: "X sold. Y locked offspring kept."

## Costs & Economy

**Breeding Cost**: 50 coins per breeding operation
- Deducted when breed button is clicked
- Error toast if insufficient funds: "Breeding costs 50 coins. You have X."

**Offspring Value**: Each parrot has individual value based on rarity/beauty
- Used when selling via "Sell All" button

## User Feedback

### Toast Notifications

**Breeding Success**:
- Title: "Breeding successful!"
- Message: "4 new chicks born! [examination status] X total waiting in Breeding Lab."
- Duration: 6 seconds

**Breeding Failure** (insufficient coins):
- Type: Error
- Title: "Not enough coins!"
- Message: "Breeding costs 50 coins. You have X."
- Duration: 3 seconds

**Sell All**:
- Title: "Offspring sold!"
- Message: "X parrot(s) sold for Y coins" OR "X sold. Y locked offspring kept."
- Duration: 3 seconds

**Dismiss All**:
- Similar pattern to Sell All

### Visual Feedback

- Parent slots highlight when empty (pulsing border or glow)
- Smooth transitions when parrots added/removed
- Loading state during breeding operation
- Immediate badge updates when parents selected

## Integration Points

### With Collection Tab
- Breeding badges (L/R) shown on parrot cards
- Action buttons include breeding options
- Selecting parrot for breeding does NOT switch tabs

### With Auto-Examine Feature
- If auto-examine enabled, newly bred offspring are automatically examined
- Examination happens during breeding operation
- Costs 100 coins per offspring (deducted from player balance)
- Toast notification includes examination count

### With Lock System
- Locked offspring shown with lock badge
- Cannot be sold or dismissed via batch actions
- Can be individually selected and examined
- Can be unlocked before batch operations

## Design Rationale

### Why Dedicated Tab?
- **Focus**: Breeding is complex operation that benefits from dedicated space
- **Information**: Room for compatibility display and predictions
- **Workflow**: Keeps collection view uncluttered
- **Scalability**: Easy to add more breeding features in future

### Why Accumulate Offspring?
- **Flexibility**: User can breed multiple times before managing offspring
- **Efficiency**: Reduces interruptions during breeding sessions
- **Safety**: Prevents accidental loss of valuable offspring

### Why Heart Button in Stats Bar?
- **Visibility**: Always visible regardless of current tab
- **Accessibility**: Quick access from anywhere in game
- **Context**: Positioned near other global actions
- **Animation**: Pulsing draws attention when ready to breed

## Future Enhancements

Potential additions:
- Breeding history/lineage tracking
- Favorite breeding pairs (quick selection)
- Batch breeding (breed multiple pairs at once)
- Advanced predictions (probability distributions)
- Breeding goals/targets
- Genetic diversity warnings
