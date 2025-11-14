# Auto-Examine Feature

**Purpose**: Automatically examine newly bred offspring during breeding operation, saving clicks for power users.

**Related docs**: [Breeding Lab](BREEDING_LAB.md), [Offspring Management](OFFSPRING.md)

## Overview

Auto-Examine is an optional feature that automatically performs laboratory examinations on newly bred offspring, revealing their genetic makeup without requiring manual examination of each parrot.

## User Requirements

### Toggle Control

**Location**: Stats bar at top of screen
- Position: After mutation toggle, before heart button
- Icon: Microscope emoji (🔬)
- Label: "Auto-Exam"

**Visual States**:
- **OFF**: Gray badge, muted appearance
- **ON**: Blue/teal gradient, brighter appearance
- Active state saved across game sessions

**Interaction**: Click to toggle on/off

### Behavior

**When Enabled**:
1. User breeds parrots (costs 50 coins)
2. Offspring are created (typically 4)
3. System automatically examines as many as coins allow
4. Examination cost: 100 coins per offspring
5. Examined offspring show microscope badge
6. User sees clear feedback in toast notification

**When Disabled**:
- Breeding proceeds normally
- No automatic examination
- User must manually examine each offspring

### Economic Constraints

**Budget Calculation**:
- Total available: Player's coin balance AFTER breeding cost
- Max examinations: floor(available_coins / 100)
- Example: 350 coins available → can examine 3 offspring

**Priority**: Examines offspring in order created
- Examines first X offspring where X = min(offspring_count, max_examinations)

**Feedback Examples**:
- Full examination (400+ coins): "4 new chicks born! 4 examined (-400 coins)."
- Partial examination (150 coins): "4 new chicks born! 1 examined (-100 coins)."
- No examination (< 100 coins): "4 new chicks born! Auto-exam: Need 100 coins per chick."

## Benefits

### For Power Users
- **Speed**: Eliminate repetitive clicking
- **Efficiency**: Streamline breeding workflow
- **Focus**: Concentrate on breeding decisions, not manual examination

### For All Users
- **Optional**: Can be disabled if player prefers manual control
- **Transparent**: Clear feedback on what happened
- **Economical**: Only uses coins player can afford

## User Experience

### Enable Workflow
1. User clicks Auto-Exam badge
2. Badge changes to active state (blue gradient)
3. Toast notification: "Auto-examination enabled"
4. Future breedings will auto-examine

### Disable Workflow
1. User clicks Auto-Exam badge
2. Badge changes to inactive state (gray)
3. Toast notification: "Auto-examination disabled"
4. Future breedings require manual examination

### Breeding with Auto-Exam
1. User breeds parrots
2. Breeding cost deducted (50 coins)
3. Offspring created (4 parrots)
4. Auto-exam calculates budget (remaining coins / 100)
5. Examines as many offspring as possible
6. Toast shows: "4 new chicks born! X examined (-Y coins). Z total waiting."
7. Examined offspring show microscope badge

## Edge Cases

### Insufficient Coins for Any Examination

**Scenario**: Player has 50-149 coins (enough to breed, not enough to examine)

**Behavior**:
- Breeding succeeds
- No offspring examined
- Toast: "4 new chicks born! Auto-exam: Need 100 coins per chick. 4 total waiting."

**User Recovery**: Earn more coins, then manually examine valuable offspring

### Insufficient Coins for Full Examination

**Scenario**: Player has 250 coins (can examine 2 of 4 offspring)

**Behavior**:
- First 2 offspring examined
- Last 2 remain unexamined
- Toast: "4 new chicks born! 2 examined (-200 coins). 4 total waiting."

**User Visibility**: Examined offspring have microscope badge, others don't

### Zero Offspring (Edge Case)

**Scenario**: Breeding produces 0 offspring (shouldn't happen in normal game)

**Behavior**:
- No examination attempted
- Toast shows breeding result without examination message

## Design Rationale

### Why Optional?

**Player Choice**: Some players enjoy manual examination as part of the experience
- Strategic decision: which offspring to examine?
- Resource management: save coins for other purposes
- Surprise element: discover genes one at a time

**Economic Trade-off**: Auto-exam convenience vs coin preservation
- Power users value time savings
- New players may prefer manual control and cost savings

### Why Badge Toggle (Not Settings Menu)?

**Accessibility**: Frequently toggled option should be easily accessible
- No navigation to settings screen
- One click to toggle
- Immediate visual feedback

**Context**: Related to breeding workflow
- Positioned near breeding controls
- Visible when making breeding decisions
- Reminds user of current state

### Why Per-Offspring Cost (Not Bulk Discount)?

**Consistency**: Same examination cost whether manual or automatic
- 100 coins per examination in laboratory
- 100 coins per examination via auto-exam
- Predictable economics

**Fairness**: Auto-exam provides convenience, not economic advantage

## Visual Design Requirements

### Badge Appearance

**Inactive State**:
- Background: Light gray (#e0e0e0)
- Text: Dark gray
- Opacity: ~0.7
- No animation

**Active State**:
- Background: Teal/cyan gradient (matching laboratory theme)
- Text: White
- Opacity: 1.0
- Optional subtle pulse or glow

**Hover State**:
- Slight scale increase (1.05)
- Cursor: pointer
- Shadow enhancement

### Toast Notification Format

**Structure**: "[Breeding result] [Examination info] [Total waiting]"

**Examples**:
- "4 new chicks born! 4 examined (-400 coins). 4 total waiting in Breeding Lab."
- "4 new chicks born! 2 examined (-200 coins). 8 total waiting in Breeding Lab."
- "4 new chicks born! Auto-exam: Need 100 coins per chick. 4 total waiting in Breeding Lab."

**Timing**: 6 seconds (longer to read multi-part message)

## State Persistence

**Saved**: Auto-exam enabled/disabled state
- Stored in game save data
- Persists across sessions
- Reset on new game (defaults to OFF)

**Not Saved**: Which specific offspring were examined
- Examination state saved per parrot
- Auto-exam preference saved globally

## Future Enhancements

Potential additions:
- **Selective Auto-Exam**: Only examine offspring meeting criteria (e.g., rarity > rare)
- **Budget Limit**: Set max coins to spend on auto-exam per breeding
- **Priority Rules**: Examine highest beauty/rarity first
- **Notification Detail**: Breakdown of which offspring examined
- **Partial Refund**: Return coins if examination reveals nothing new
