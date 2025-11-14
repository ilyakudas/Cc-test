# Visual Indicators Feature

**Purpose**: Provide immediate visual feedback about parrot state and available actions through badges, animations, and color coding.

**Related docs**: [Lock System](LOCK_SYSTEM.md), [Breeding Lab](BREEDING_LAB.md), [Auto-Examine](AUTO_EXAMINE.md)

## Overview

Visual indicators communicate important information about parrots and game state without requiring the user to click or read text. They use universally understood symbols (emojis/icons), color coding, and positioning to convey meaning instantly.

## Badge System

### Purpose

Badges are small circular indicators overlaid on parrot cards showing important state:
- Lock status
- Examination status
- Breeding selection
- Contest achievements (future)

### Design Principles

**Positioning**: Different badge types use different corners to avoid overlap
- Top-left: Breeding selection (L/R)
- Top-right: Examination status (🔬)
- Top-center: Lock status (🔒)
- Bottom-right: Reserved for future (achievements, mutations)

**Colors**: Each badge type uses distinct color palette
- Blue/purple: Breeding-related (left parent badge)
- Pink/magenta: Breeding-related (right parent badge)
- Green: Success/completion states (examined)
- Orange: Protection/warning (locked)
- Gold: Achievement/special (future)

**Size**: Consistent across all badge types
- Diameter: 28px
- Icon: ~16px (0.9em)
- Readable at all card sizes

**Z-index**: Layered appropriately
- Above card content
- Below modals and tooltips
- Consistent across badge types

## Badge Types

### 1. Breeding Selection Badges

**Left Parent Badge**:
- Position: Top-left corner (8px from top, 8px from left)
- Icon: Letter "L"
- Background: Blue gradient (135deg, #667eea to #764ba2)
- Text color: White
- Shape: Circle (28px diameter)

**Right Parent Badge**:
- Position: Top-left corner (same as left)
- Icon: Letter "R"
- Background: Pink gradient (135deg, #f093fb to #f5576c)
- Text color: White
- Shape: Circle (28px diameter)

**Behavior**:
- Appears immediately when parrot selected for breeding slot
- Remains visible across tab switches
- Only one badge per parrot (L or R, not both)
- Removed when parrot removed from breeding slot

**Purpose**: Show which parrots are currently in breeding pair at a glance

### 2. Examination Badge

**Visual Design**:
- Position: Top-right corner (8px from top, 8px from right)
- Icon: Microscope emoji (🔬)
- Background: Green gradient (135deg, #4caf50 to #45a049)
- Shape: Circle (28px diameter)
- Shadow: 0px 2px 4px rgba(0,0,0,0.2)

**Behavior**:
- Appears immediately after laboratory examination
- Persists forever (examination cannot be undone)
- Saved across game sessions
- Shows on all instances of parrot (collection, breeding lab, etc.)

**Purpose**: Indicate which parrots have had their genetics examined

**Information Reveal**: Examined parrots show full genetic information in laboratory modal

### 3. Lock Badge

**Visual Design**:
- Position: Top-center (8px from top, centered horizontally)
- Icon: Lock emoji (🔒)
- Background: Orange gradient (135deg, #ff9800 to #ff6f00)
- Text color: White
- Shape: Circle (28px diameter)
- Shadow: 0px 2px 6px rgba(0,0,0,0.3)

**Behavior**:
- Appears immediately when lock action triggered
- Removed immediately when unlock action triggered
- Persists across game sessions
- Prevents selling and freeing

**Purpose**: Protect valuable parrots from accidental loss

**Details**: See [Lock System](LOCK_SYSTEM.md)

### 4. Multiple Badges

**Layout**: When parrot has multiple badges, they don't overlap
- Example: Locked parrot selected for breeding shows BOTH lock badge (top-center) AND L/R badge (top-left)
- Example: Examined locked parrot shows both badges in their respective positions

**Visual Hierarchy**: All badges same size, visual weight determined by color
- Orange lock badge naturally draws more attention (warning color)
- Green examined badge indicates completion
- Blue/pink breeding badges indicate temporary selection

## Animations

### Pulse Animation (Heart Button)

**Purpose**: Draw attention to breed button when both parents selected

**Keyframes**:
- 0%: scale(1)
- 50%: scale(1.1)
- 100%: scale(1)

**Timing**:
- Duration: 2 seconds
- Easing: ease-in-out
- Iteration: infinite
- Starts: When both breeding slots filled
- Stops: When either slot emptied

**Visual Effect**: Gentle breathing motion, not jarring

### Fade-In Transitions

**Purpose**: Smooth appearance of new elements

**Application**:
- Splash screen content
- Toast notifications
- Modal dialogs
- Badge appearance (optional)

**Timing**:
- Duration: 0.3-0.6s
- Easing: ease-in or ease-out
- Start: opacity 0
- End: opacity 1

### Hover Effects

**Button Hover**:
- Scale: 1.0 → 1.05
- Shadow: Enhanced depth
- Duration: 0.3s
- Easing: ease-out

**Card Hover**:
- Transform: translateY(0) → translateY(-5px)
- Shadow: 0 10px 20px rgba(0,0,0,0.15) → 0 15px 30px rgba(0,0,0,0.25)
- Duration: 0.3s
- Easing: ease-out

**Purpose**: Indicate interactivity and provide feedback

## Color Coding System

### Rarity Colors

Used for parrot rarity indicators:
- **Common**: Gray (#9e9e9e)
- **Uncommon**: Green (#4caf50)
- **Rare**: Blue (#2196f3)
- **Epic**: Purple (#9c27b0)
- **Legendary**: Orange/gold (#ff9800)

**Application**: Rarity badge, background tint, or border on parrot cards

### Button Colors

**Primary Actions**:
- Breed: Purple gradient (#667eea to #764ba2)
- Buy: Green gradient (#4caf50 to #45a049)

**Secondary Actions**:
- Laboratory: Teal/cyan (#17a2b8 to #117a8b)
- Selection: Blue (matching theme)

**Destructive Actions**:
- Sell: Green (money = positive in this context)
- Free/Dismiss: Gray (#6c757d)

**Toggle States**:
- Active: Colored (feature-specific)
- Inactive: Gray (#e0e0e0)

### Status Colors

**Toast Notifications**:
- Success: Green (#4caf50)
- Error: Red (#f44336)
- Info: Blue (#2196f3)
- Warning: Orange (#ff9800)

## Visual Feedback Timing

### Immediate Feedback (< 100ms)

**Requirements**: Changes visible within 1-2 frames
- Badge appearance/disappearance
- Button state changes
- Selection highlighting
- Hover effects

**Implementation**: Direct DOM updates or CSS transitions

### Quick Feedback (100-300ms)

**Requirements**: Smooth transitions, not instant
- Hover animations
- Card elevation changes
- Color transitions
- Scale effects

**Implementation**: CSS transitions with ease-out

### Delayed Feedback (300-1000ms)

**Requirements**: Noticeable but not slow
- Toast notifications appearing
- Modal fade-in
- Page transitions

**Implementation**: CSS animations or transitions with delays

### Persistent Feedback (> 1000ms)

**Requirements**: Stays visible until dismissed or completed
- Toast notifications (3-6 seconds)
- Success confirmations
- Error messages

**Implementation**: Timed removal or manual dismissal

## Design Rationale

### Why Badges (Not Text)?

**Space Efficiency**: Icons smaller than text labels
- More room for parrot visualization
- Cleaner card design
- Less visual clutter

**Language Independence**: Symbols understood internationally
- Lock icon universal
- Microscope = examination
- L/R letters minimal text

**Quick Recognition**: Shapes and colors faster to process than reading
- Color provides instant category (orange = locked)
- Position provides context (top-left = breeding)
- Icon confirms meaning

### Why Corner Positioning?

**Non-Overlapping**: Multiple badges can coexist
- Each corner reserved for specific purpose
- Predictable locations
- Easy to scan

**Non-Intrusive**: Doesn't cover parrot visualization
- Overlays edge, not center
- Key visual (parrot) remains clear
- Badges are extra information, not primary

**Conventional**: Matches common UI patterns
- Social media badges (notifications)
- App icons (update badges)
- Shopping carts (item count)

### Why Gradient Backgrounds?

**Visual Polish**: Flat colors look cheaper
- Gradients add depth
- More visually interesting
- Matches modern design trends

**Distinction**: Gradients easier to distinguish at a glance
- Different gradient angles/colors
- More variation than flat colors
- Harder to confuse

**Theme Consistency**: Matches game's overall gradient aesthetic
- Purple/pink theme throughout
- Professional appearance
- Cohesive visual identity

## Accessibility Considerations

### Color Blindness

**Not Color-Only**: Combine color with other indicators
- Lock: Orange color + lock icon + position
- Breeding: Color + letter (L/R) + position
- Examination: Color + microscope icon + position

**High Contrast**: Ensure badges readable
- White icons on colored backgrounds
- Shadow for definition
- Sufficient size

### Screen Readers

**Alt Text**: Provide text alternatives
- "Locked parrot"
- "Selected as left breeding parent"
- "Genetics examined"

**State Announcements**: When badges change
- "Parrot locked"
- "Parrot added to breeding slot"

### Motion Sensitivity

**Reduced Motion**: Respect user preferences
- Disable pulse animation
- Use instant transitions instead of fades
- Keep hover effects minimal

**Critical Information**: Don't rely solely on animation
- Pulsing heart supplemented by static color change
- Information still accessible without motion

## Future Enhancements

Potential additions:
- **Achievement Badges**: Show contest wins, milestones
- **Generation Badges**: Visual indicator of parrot's generation
- **Mutation Badges**: Indicate presence of rare mutations
- **Breeding Cooldown**: Visual timer if breeding has cooldown
- **Health/Energy**: If game adds stat degradation
- **Badge Stacking**: Smaller badges when multiple present
- **Tooltip Details**: Hover over badge for full information
- **Badge Animations**: Entrance animations for new badges
- **Custom Badge Colors**: User preferences or themes
