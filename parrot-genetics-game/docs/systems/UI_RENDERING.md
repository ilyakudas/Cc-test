# UI Rendering System

**Purpose**: Generate visual representations of parrots from genetic data using SVG manipulation and card-based layouts.

**Related docs**: [Genetics System](GENETICS.md), [Visual Indicators](../features/VISUAL_INDICATORS.md)

## Overview

The UI rendering system transforms abstract genetic data (arrays of booleans) into beautiful visual representations. It handles SVG generation, color calculation, gradient creation, and responsive card layouts.

## Parrot Visualization

### SVG-Based Rendering

**Source SVG**: Pre-designed parrot template
- File: `Parrot-1-recolored.svg`
- 119 individually controllable feather groups
- Each feather group has unique ID
- Scalable vector format

**Rendering Approach**: Clone and modify
- SVG template loaded once and cached
- Each parrot card gets cloned copy
- Feather groups recolored based on genes
- Efficient (no repeated parsing)

### Feather Group Structure

**6 Body Parts**:
1. Wings (main wing feathers)
2. Special Wing (accent wing feathers)
3. Body (torso feathers)
4. Head (head and crest feathers)
5. Tail (tail feathers)
6. Accents (small detail feathers)

**Each Part Has**:
- Multiple feather group IDs in SVG
- 4 alleles for red channel
- 4 alleles for green channel
- 4 alleles for blue channel
- 1 gradient flag

### Color Calculation

**From Genes to RGB**:
```
For each color channel (red, green, blue):
  1. Count TRUE alleles in 4-bit array
  2. Multiply count by 64
  3. Result is 0-255 value for that channel

Examples:
  [false, false, false, false] → 0
  [true, false, false, false] → 64
  [true, true, false, false] → 128
  [true, true, true, false] → 192
  [true, true, true, true] → 255
```

**RGB Combination**:
```
red_value = count_true(red_alleles) * 64
green_value = count_true(green_alleles) * 64
blue_value = count_true(blue_alleles) * 64

final_color = rgb(red_value, green_value, blue_value)
```

**Examples**:
- All red alleles true, others false: rgb(255, 0, 0) = Pure red
- All green alleles true, others false: rgb(0, 255, 0) = Pure green
- Red and green true, blue false: rgb(255, 255, 0) = Yellow
- All true: rgb(255, 255, 255) = White
- All false: rgb(0, 0, 0) = Black

### Gradient Rendering

**When Gradient Flag True**:
- Create linear gradient instead of solid color
- Gradient from body part color to lighter/darker variation
- Adds visual interest and depth
- Increases beauty score

**Gradient Generation**:
```
1. Calculate base color from genes
2. Create lighter variant (add 40 to each channel, max 255)
3. Create darker variant (subtract 40, min 0)
4. Generate linear gradient with unique ID
5. Apply gradient to feather group
6. Store gradient def in SVG <defs>
```

**Gradient Direction**: Varies by body part for natural look
- Wings: Top to bottom
- Tail: Left to right
- Body: Radial from center

**Unique IDs**: Each gradient needs unique ID to avoid conflicts
- Format: `gradient-{counter}`
- Global counter incremented
- Prevents overlapping definitions

## Card Layout System

### Parrot Card Components

**Card Structure**:
```
Card Container
├── SVG Container (parrot visualization)
├── Badge Layer (lock, examined, breeding indicators)
├── Info Section
│   ├── Name
│   ├── Rarity indicator
│   └── Generation (optional)
└── Interaction Layer (click handler)
```

### Card States

**Selectable Cards** (collection view):
- Click to select
- Selected state: highlighted border
- Action buttons appear
- Can interact with all features

**Store Cards** (marketplace):
- Shows price
- "Buy" button
- No selection
- No badges (except price)

**Preview Cards** (breeding predictions):
- No interaction
- No badges
- Smaller size
- Informational only

**Offspring Cards** (breeding lab):
- Fully selectable
- Shows all badges
- Action buttons available
- Temporary storage

### Responsive Grid

**Layout Algorithm**:
```
Grid Container:
  - Display: grid
  - Template columns: repeat(auto-fill, minmax(140px, 1fr))
  - Gap: 12px
  - Responsive: adjusts column count to fit width
```

**Breakpoints**:
- < 600px: 2 columns
- 600-900px: 3-4 columns
- 900-1200px: 5-6 columns
- > 1200px: 7+ columns

**Card Sizing**:
- Minimum width: 140px
- Aspect ratio: Maintained by SVG
- Padding: 8-12px inside card
- Gap between cards: 12px

### Empty States

**No Parrots**:
- Centered message
- Helpful instruction
- Examples:
  - Collection: "No parrots yet! Buy one from the Store."
  - Breeding Lab: "Breed parrots to see offspring here!"
  - Store: "Store is currently empty."

**Visual Design**:
- Muted text color (#999)
- Larger font size (1.2em)
- Centered in grid area
- Optional icon/emoji

## Performance Optimization

### SVG Caching

**Template Caching**:
- Load SVG template once on initialization
- Store in memory (gameState.svgCache)
- Clone for each parrot card
- Avoid repeated fetch/parse

**Benefits**:
- Faster rendering
- Reduced memory (one template, many references)
- Reduced network (one fetch)

### Gradient Deduplication (Future)

**Current**: Each gradient unique
**Potential**: Reuse identical gradients
- Hash color combinations
- Map to existing gradient IDs
- Reduce SVG size

### Lazy Rendering (Future)

**Current**: Render all cards immediately
**Potential**: Virtual scrolling
- Only render visible cards
- Improves performance with 100+ parrots
- Libraries: react-window, vue-virtual-scroller

## Badge Rendering

**Badge Layer**: Positioned absolutely over SVG
- Z-index: 10 (above card, below modals)
- Pointer-events: none (don't block clicks)
- Multiple badges supported

**Badge Types**: See [Visual Indicators](../features/VISUAL_INDICATORS.md)

**Rendering Order**:
1. Render base card
2. Add SVG
3. Add badges (if applicable)
4. Add info section
5. Attach event handlers

## Animation and Transitions

### Hover Effects

**Card Hover**:
- Transform: translateY(-5px)
- Shadow: Enhanced depth
- Transition: 0.3s ease-out
- Cursor: pointer (if selectable)

**Button Hover**:
- Transform: scale(1.05)
- Shadow: Glow effect
- Transition: 0.3s ease-out

### Badge Transitions

**Appearance**:
- Instant (no fade-in currently)
- Could add: 0.2s fade-in for polish

**Removal**:
- Instant (no fade-out currently)
- Could add: 0.2s fade-out

### Card Entry

**On Load**:
- Instant appearance currently
- Could add: Staggered fade-in
- Sequential: 0.05s delay between cards
- Creates "dealing cards" effect

## Accessibility

### Screen Reader Support

**Card Labeling**:
- Parrot name announced
- Rarity announced
- Badge states announced
- Example: "Twilight, legendary parrot, locked, examined"

**Button Labels**:
- Clear action descriptions
- "Buy Twilight for 100 coins"
- "Select Twilight"

### Keyboard Navigation

**Tab Order**:
- Cards focusable
- Buttons focusable
- Logical order (left-to-right, top-to-bottom)

**Activation**:
- Enter: Select card
- Space: Activate button
- Escape: Close modal/deselect

### High Contrast

**Badge Visibility**:
- White icons on colored backgrounds
- Sufficient contrast ratios
- Shadows for definition

**Text Readability**:
- Dark text on light cards
- Adequate font size
- Clear font (sans-serif)

## Design Rationale

### Why SVG (Not Canvas)?

**Scalability**: SVG scales perfectly
- No pixelation at any size
- Retina display support
- Responsive without quality loss

**Manipulability**: Easy to recolor
- DOM-based, can target elements
- CSS styling available
- Gradient support built-in

**Accessibility**: SVG content readable
- Can add alt text
- Screen reader compatible
- Semantic structure

### Why Clone Template (Not Generate)?

**Performance**: Cloning faster than generation
- No path calculation
- No drawing operations
- Just data duplication

**Consistency**: Same parrot shape always
- Genetics affect color only
- Predictable appearance
- Easier to balance beauty system

**Artist Control**: Designer creates shape
- High-quality art
- Professional appearance
- Not limited by code

### Why Grid (Not List)?

**Visual Appeal**: Grid more engaging than list
- See multiple parrots at once
- Compare side-by-side
- Gallery feel

**Space Efficiency**: Better use of screen
- Horizontal space utilized
- More parrots visible
- Less scrolling

**Responsive**: Adapts to screen size
- Mobile: 2 columns
- Desktop: Many columns
- No manual breakpoint handling

## Future Enhancements

### Performance
- Virtual scrolling for 100+ parrots
- Gradient deduplication
- Webworker for color calculation
- Intersection observer for lazy rendering

### Visual
- Card flip animation to show genetic info
- Particle effects for rare parrots
- Animated backgrounds
- 3D parrot models (WebGL)

### Interaction
- Drag-and-drop for breeding
- Multi-select (shift-click)
- Zoom on hover
- Comparison view (side-by-side)

### Customization
- User-selected card themes
- Custom badge icons
- Alternate parrot poses
- Seasonal decorations
