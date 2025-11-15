# Color Lab Feature

**Purpose**: Interactive genetic engineering tool allowing players to design custom parrots by directly manipulating genes, with real-time visual feedback and the ability to save creations to the gallery.

**Related docs**: [Gallery](GALLERY.md), [Genetics System](../systems/GENETICS.md), [Visual Indicators](VISUAL_INDICATORS.md)

## Overview

The Color Lab is an educational and creative sandbox where players can experiment with parrot genetics without breeding costs or randomness. By toggling individual alleles and gradient flags, users learn how genes translate to colors while designing custom parrots. Created parrots can be saved to the Gallery's "My Creations" section or discarded.

## User Requirements

### Access

**Location**: Color Lab tab in main navigation
- Positioned after Gallery tab
- Icon: 🎨 Color Lab
- Always available (no unlock required)
- Independent of game progress or resources

**Tab Behavior**:
- Shows when Color Lab tab clicked
- Hides other tabs
- Updates panel title to "Color Lab"
- No game state changes until user saves

### Visual Design

**Layout**: Two-panel split view
```
┌─────────────────────────────────────────────┐
│ Gene Editor (Left)  │  Preview (Right)      │
│ 60% width            │  40% width            │
│                      │                        │
│ [6 body parts]       │  [Live parrot SVG]    │
│ [78 gene toggles]    │  [Color palette]      │
│ [Gradient flags]     │  [Beauty score]       │
│                      │                        │
│ [Name input]         │  [Rarity display]     │
│ [Save button]        │                        │
└─────────────────────────────────────────────┘
```

**Gene Editor Panel (Left)**:

**Structure**: Accordion/expandable sections for 6 body parts
- Wings
- Special Wing
- Body
- Head
- Tail
- Accents

**Each Body Part Section**:
```
▼ Wings
  Red Alleles:    ☑ ☑ ☐ ☐
  Green Alleles:  ☐ ☐ ☐ ☐
  Blue Alleles:   ☑ ☑ ☑ ☑
  Gradient:       ☐
```

**Allele Controls**:
- Display: 4 checkboxes per color channel
- Labels: "Red Alleles", "Green Alleles", "Blue Alleles"
- Checkboxes: Standard HTML checkboxes (styled)
- Order: Left to right (allele 0, 1, 2, 3)
- Interaction: Click to toggle true/false

**Gradient Toggle**:
- Display: Single checkbox
- Label: "Gradient" or "Enable Gradient"
- Position: Below color alleles
- Effect: When enabled, colors blend across feathers

**Visual Feedback**:
- Color preview bar next to each part showing resulting RGB color
- Gradient preview if gradient enabled
- Live update as alleles change

**Preview Panel (Right)**:

**Parrot Display**:
- Large SVG rendering (300-400px height)
- Updates in real-time as genes change
- Background: Gradient or solid matching theme
- Centered in panel

**Color Palette**:
- Same 6-square display as parrot cards
- Shows colors for all 6 body parts
- Gradient boxes have animated borders
- Positioned below parrot SVG

**Calculated Stats**:
- Beauty Score: Display with color-coded badge
- Rarity: Display with color-coded badge
- Format: Same styling as parrot cards

**Bottom Controls**:

**Name Input**:
- Text field for parrot name
- Placeholder: "Enter parrot name..."
- Max length: 20-30 characters
- Validation: Non-empty when saving

**Action Buttons**:
- "Save to Gallery" - Primary action (purple button)
- "Randomize" - Secondary (blue button)
- "Reset" - Tertiary (gray button)

**Button Behaviors**:
- Save: Validates name, saves to localStorage, shows success toast
- Randomize: Generates random genes for all parts
- Reset: Clears all alleles (all false) or loads default state

### Initial State

**When Tab Opens**:
- Option 1: Blank parrot (all alleles false)
- Option 2: Random parrot (for inspiration)
- Option 3: Last edited parrot (if exists in session)

**Recommended**: Start with random parrot for immediate visual interest

### Interactions

**Toggling Alleles**:
- Click checkbox to toggle
- Preview updates instantly (< 100ms)
- No debouncing needed (Alpine.js reactivity)
- Visual confirmation: Checkbox state + color change

**Gradient Toggle**:
- Click to enable/disable
- Preview updates to show gradient or solid
- Color palette box gains/loses animated border

**Accordion Sections**:
- Click header to expand/collapse body part
- Only one section open at a time (optional)
- Arrow icon indicates expand/collapse state

**Saving to Gallery**:

**Validation**:
1. Check name is not empty
2. Trim whitespace
3. Check name length (max 30 chars)

**If Valid**:
1. Create parrot object from genes
2. Add to customGalleryParrots array
3. Save to localStorage
4. Show success toast: "Saved '{name}' to Gallery!"
5. Option: Switch to Gallery tab to show creation
6. Option: Reset Color Lab for new design

**If Invalid**:
- Show error toast: "Please enter a name"
- Focus name input field
- Don't save

**Randomize**:
- Generates random boolean for each allele (78 total)
- Random gradient flags (0-3 body parts with gradients)
- Shows toast: "Randomized genes!"
- Instant preview update

**Reset**:
- Sets all alleles to false
- Disables all gradients
- Clears name input
- Shows toast: "Reset complete"

### Cloning from Gallery

**Entry Point**: "Clone to Color Lab" button on gallery cards

**Behavior**:
1. Switch to Color Lab tab
2. Load parrot's genes into editor
3. Set all 78 alleles to match parrot
4. Set gradient flags
5. Set name to "{original name} (Copy)"
6. Show toast: "Loaded '{name}' for editing"

**Advantages**:
- Start with known good design
- Tweak colors slightly
- Learn from examples
- Create variations

## Feature Integration

### With Gallery

**Data Flow**:
```
Color Lab → Save → Gallery (My Creations)
Gallery (any) → Clone → Color Lab
```

**Gallery Display**:
- Predefined parrots: Show "Clone" button only
- Custom parrots: Show "Clone" + "Delete" buttons
- See [Gallery](GALLERY.md) for details

**Storage Separation**:
- Predefined: Hardcoded in `galleryParrots.js`
- Custom: Stored in `localStorage.customGalleryParrots`
- Never mixed in storage

### With Genetics System

**Gene Structure**:
- Follows same 78-gene model as breeding
- 6 body parts × 13 genes each
- Red/green/blue alleles (4 each) + gradient flag
- See [Genetics System](../systems/GENETICS.md)

**Color Calculation**:
- Uses same `Parrot.calculateBodyPartColor()` method
- Allele count → RGB value (0-4 alleles → 0-255)
- Gradient flag determines blending

**Beauty Calculation**:
- Uses same `Parrot.calculateBeauty()` method
- Real-time update shows how genes affect beauty
- Educational: See what makes parrots beautiful

### With Collection

**No Direct Interaction**:
- Color Lab doesn't add to collection
- Gallery parrots are separate from collection
- Users can breed to try recreating gallery parrots

**Future Enhancement**:
- "Clone to Collection" button (costs coins)
- Adds copy of custom parrot to breeding collection

## Educational Value

### Learning Genetics

**Immediate Feedback**:
- Toggle allele → See color change
- Learn: More true alleles = brighter color
- Understand: 4 alleles = maximum (255)

**Color Mixing**:
- Red + Blue alleles = Purple/Magenta
- Red + Green alleles = Yellow/Orange
- All colors = White/Gray
- No colors = Black

**Gradient Mechanics**:
- Toggle gradient → See smooth color transitions
- Understand feather-by-feather blending
- Learn when gradients enhance beauty

### Experimentation

**Safe Sandbox**:
- No costs (coins, breeding cooldowns)
- Instant results
- Unlimited attempts
- No permanent consequences

**Creative Freedom**:
- Design dream parrots
- Test color theories
- Create themed collections
- Share designs (via screenshots)

**Goal Setting**:
- Create high-beauty parrot (180+ score)
- Match specific color schemes
- Recreate favorite real-world birds
- Design rainbow parrot (all gradients)

## Technical Implementation

### Alpine.js Component

**Component Name**: `colorLab`

**Reactive State**:
```javascript
{
  genes: {
    wings: { red: [f,f,f,f], green: [f,f,f,f], blue: [f,f,f,f], gradient: false },
    special_wing: { red: [f,f,f,f], green: [f,f,f,f], blue: [f,f,f,f], gradient: false },
    body: { red: [f,f,f,f], green: [f,f,f,f], blue: [f,f,f,f], gradient: false },
    head: { red: [f,f,f,f], green: [f,f,f,f], blue: [f,f,f,f], gradient: false },
    tail: { red: [f,f,f,f], green: [f,f,f,f], blue: [f,f,f,f], gradient: false },
    accents: { red: [f,f,f,f], green: [f,f,f,f], blue: [f,f,f,f], gradient: false }
  },
  parrotName: '',
  previewParrot: null,
  expandedPart: 'wings' // Currently open accordion
}
```

**Computed Properties**:
```javascript
get currentParrot() {
  return new Parrot(this.parrotName || 'Custom', this.genes, 1);
}

get beautyScore() {
  return this.currentParrot.calculateBeauty().score;
}

get rarity() {
  return this.currentParrot.calculateRarity();
}
```

**Methods**:
- `toggleAllele(bodyPart, color, index)` - Toggle specific allele
- `toggleGradient(bodyPart)` - Toggle gradient flag
- `randomizeGenes()` - Generate random genes
- `resetGenes()` - Clear all genes
- `saveToGallery()` - Save to custom gallery
- `loadFromGallery(parrot)` - Clone gallery parrot
- `getPreviewSVG()` - Generate SVG for preview
- `expandPart(partName)` - Accordion control

**Reactivity**:
- Gene changes → `currentParrot` updates → SVG regenerates
- Automatic: No manual `updateUI()` calls
- Alpine watches getters and updates templates

### Data Structures

**Gene Object** (per body part):
```javascript
{
  red: [boolean, boolean, boolean, boolean],    // 4 alleles
  green: [boolean, boolean, boolean, boolean],  // 4 alleles
  blue: [boolean, boolean, boolean, boolean],   // 4 alleles
  gradient: boolean                              // Gradient flag
}
```

**Complete Genes Object**:
```javascript
{
  wings: { red: [...], green: [...], blue: [...], gradient: false },
  special_wing: { red: [...], green: [...], blue: [...], gradient: false },
  body: { red: [...], green: [...], blue: [...], gradient: false },
  head: { red: [...], green: [...], blue: [...], gradient: false },
  tail: { red: [...], green: [...], blue: [...], gradient: false },
  accents: { red: [...], green: [...], blue: [...], gradient: false }
}
```

**Custom Gallery Parrot** (stored):
```javascript
{
  id: 'custom-{timestamp}',
  name: 'User Entered Name',
  genes: { /* complete genes object */ },
  createdAt: timestamp,
  isCustom: true // Flag for custom vs predefined
}
```

### LocalStorage

**Key**: `customGalleryParrots`

**Structure**: Array of custom parrot objects
```javascript
[
  {
    id: 'custom-1699123456789',
    name: 'Midnight Blue',
    genes: { /* genes */ },
    createdAt: 1699123456789,
    isCustom: true
  },
  // ... more custom parrots
]
```

**Operations**:
- **Load**: `JSON.parse(localStorage.getItem('customGalleryParrots') || '[]')`
- **Save**: `localStorage.setItem('customGalleryParrots', JSON.stringify(array))`
- **Add**: Push to array, save
- **Delete**: Filter array, save
- **Limit**: Optional max 50 custom parrots

### Module Location

**File**: `public/js/ui/colorLab.js`

**Exports**:
- `createColorLabComponent()` - Returns Alpine.js component
- `saveCustomParrot(parrot)` - Save to localStorage
- `loadCustomParrots()` - Load from localStorage
- `deleteCustomParrot(id)` - Remove from localStorage

**Dependencies**:
- `Parrot` class from `../core/parrot.js`
- `generateParrotSVG` from `../lib/svg.js`
- `showToast` from `../lib/notifications.js`

### HTML Structure

**Tab Container**: `#colorLabTab`
- Alpine directive: `x-data="colorLab"`
- Display: none (shown via tab switching)

**Template Structure**:
```html
<div id="colorLabTab" x-data="colorLab">
  <div class="color-lab-container">
    <!-- Gene Editor (Left) -->
    <div class="gene-editor">
      <h3>Genetic Designer</h3>

      <!-- Body Parts Accordion -->
      <template x-for="part in bodyParts">
        <div class="gene-section">
          <div class="gene-header" @click="expandPart(part)">
            <span x-text="partLabels[part]"></span>
            <span class="expand-icon">▼</span>
          </div>

          <div x-show="expandedPart === part" class="gene-controls">
            <!-- Red Alleles -->
            <div class="allele-row">
              <label>Red Alleles:</label>
              <template x-for="i in [0,1,2,3]">
                <input type="checkbox"
                       x-model="genes[part].red[i]"
                       @change="updatePreview()">
              </template>
            </div>

            <!-- Green Alleles -->
            <div class="allele-row">
              <label>Green Alleles:</label>
              <template x-for="i in [0,1,2,3]">
                <input type="checkbox"
                       x-model="genes[part].green[i]"
                       @change="updatePreview()">
              </template>
            </div>

            <!-- Blue Alleles -->
            <div class="allele-row">
              <label>Blue Alleles:</label>
              <template x-for="i in [0,1,2,3]">
                <input type="checkbox"
                       x-model="genes[part].blue[i]"
                       @change="updatePreview()">
              </template>
            </div>

            <!-- Gradient Toggle -->
            <div class="gradient-row">
              <label>
                <input type="checkbox"
                       x-model="genes[part].gradient"
                       @change="updatePreview()">
                Enable Gradient
              </label>
            </div>
          </div>
        </div>
      </template>

      <!-- Bottom Controls -->
      <div class="lab-controls">
        <input type="text"
               x-model="parrotName"
               placeholder="Enter parrot name...">
        <button @click="saveToGallery()" class="btn btn-save">
          💾 Save to Gallery
        </button>
        <button @click="randomizeGenes()" class="btn btn-secondary">
          🎲 Randomize
        </button>
        <button @click="resetGenes()" class="btn btn-reset">
          ↺ Reset
        </button>
      </div>
    </div>

    <!-- Preview Panel (Right) -->
    <div class="preview-panel">
      <h3>Live Preview</h3>
      <div class="preview-display" x-html="getPreviewSVG()"></div>
      <div class="preview-palette" x-html="getColorPalette()"></div>
      <div class="preview-stats">
        <div class="stat-badge">
          <span>Beauty:</span>
          <span x-text="beautyScore"></span>
        </div>
        <div class="stat-badge">
          <span>Rarity:</span>
          <span x-text="rarity"></span>
        </div>
      </div>
    </div>
  </div>
</div>
```

### CSS Classes

**Container Classes**:
- `.color-lab-container` - Main two-panel layout
- `.gene-editor` - Left panel (60% width)
- `.preview-panel` - Right panel (40% width)

**Gene Editor Classes**:
- `.gene-section` - Each body part accordion
- `.gene-header` - Clickable header with expand icon
- `.gene-controls` - Collapsible content with checkboxes
- `.allele-row` - Row for one color channel (4 checkboxes)
- `.gradient-row` - Gradient toggle checkbox

**Control Classes**:
- `.lab-controls` - Bottom control section
- `.btn-save` - Primary save button (purple)
- `.btn-secondary` - Secondary buttons (blue)
- `.btn-reset` - Reset button (gray)

**Preview Classes**:
- `.preview-display` - SVG container
- `.preview-palette` - Color palette display
- `.preview-stats` - Beauty/rarity badges

## User Flow Examples

### Creating Custom Parrot

1. Click "🎨 Color Lab" tab
2. See random parrot (or blank)
3. Expand "Wings" section
4. Toggle red alleles: ☑☑☑☑ (4 true)
5. See wings turn bright red in preview
6. Toggle blue alleles: ☑☑☐☐ (2 true)
7. See wings turn purple
8. Enable gradient checkbox
9. See gradient border on wings palette square
10. Repeat for other body parts
11. Enter name: "Purple Sunset"
12. Click "Save to Gallery"
13. See success toast
14. Switch to Gallery to view

### Cloning from Gallery

1. In Gallery tab, click card
2. Click "Clone to Color Lab" button
3. Switch to Color Lab tab
4. See genes loaded
5. Name shows "{original} (Copy)"
6. Modify: Toggle some alleles
7. See preview update
8. Rename: "Sunset Variant"
9. Save to gallery
10. Now have original + variant in gallery

### Learning Exercise

1. Open Color Lab
2. Click "Reset" (all black parrot)
3. Expand "Wings"
4. Toggle red alleles one by one
5. Observe: 0→64→128→192→255 color progression
6. Learn: Each allele adds ~64 to RGB value
7. Try combinations: Red + Green = Yellow
8. Enable gradient
9. See smooth color transitions
10. Understand gradient mechanics

## Design Decisions

### Why Gene Toggles Not Color Pickers?

**Educational Value**:
- Players learn genetic system directly
- Understand allele → color mapping
- Aligns with game's genetics theme

**Consistency**:
- Same gene model as breeding
- No abstraction layer
- True to simulation

**Simplicity**:
- Checkboxes easier than RGB sliders
- Clear on/off states
- Mobile-friendly

**Breeding Connection**:
- Designs possible through breeding
- Players can attempt to recreate via genetics
- Sets realistic expectations

### Why Separate from Collection?

**Different Purpose**:
- Collection: Parrots for breeding/contests
- Gallery: Designs for inspiration/reference

**No Economy Impact**:
- Free creation doesn't undermine buying
- Can't use gallery parrots in gameplay
- Keeps progression balanced

**Clear Separation**:
- Gallery = showcase
- Collection = functional
- No confusion

### Why Save to Gallery Not Collection?

**Resource Management**:
- Unlimited gallery saves = fine
- Unlimited collection parrots = broken economy
- Separation maintains balance

**Showcase Focus**:
- Gallery emphasizes aesthetics
- Collection emphasizes breeding utility
- Different metrics of value

**Future Expansion**:
- Could add "Purchase Copy" (500 coins)
- Adds gallery parrot to collection
- Optional monetization

## Future Enhancements

### Quality of Life

**Templates**:
- Pre-made gene templates (rainbow, monochrome, etc.)
- Load template as starting point
- Quick experimentation

**Undo/Redo**:
- Undo last gene change
- Redo if needed
- Prevent accidental changes

**Copy/Paste Genes**:
- Copy one body part's genes
- Paste to another part
- Symmetrical designs easier

**Lock Parts**:
- Lock certain parts while randomizing
- Preserve wings, randomize rest
- More control

### Social Features

**Share Codes**:
- Generate code for parrot genes
- Share code with friends
- Import others' designs

**Gallery Voting**:
- Users vote on custom parrots
- Popular designs highlighted
- Community engagement

**Design Challenges**:
- Weekly themes (e.g., "Ocean")
- Submit designs
- Voting + rewards

### Advanced Tools

**Color Harmony Helper**:
- Suggest complementary colors
- Show color wheel
- Educational tool

**Beauty Optimizer**:
- Suggest gene changes to increase beauty
- Show what changes would help
- Learning aid

**Breeding Simulator**:
- Show which parent combinations could create design
- Reverse-engineer breeding path
- Connect to actual gameplay

## Accessibility

### Current Implementation

**Keyboard Navigation**:
- Tab through checkboxes
- Space to toggle
- Enter on buttons

**Screen Readers**:
- Checkboxes properly labeled
- Allele counts announced
- Button purposes clear

### Future Improvements

**Visual Indicators**:
- Color-blind friendly gene indicators
- Patterns in addition to colors
- High contrast mode

**Alternative Inputs**:
- Sliders for allele counts (0-4)
- Number inputs
- Voice commands (experimental)

**Presets**:
- Named color presets
- "Bright Red Wings" button
- Faster for some users

## Testing Considerations

### Functional Testing

**Gene Manipulation**:
- Toggle each allele → Verify preview updates
- Enable gradient → Verify border appears
- Test all 6 body parts × 13 genes = 78 toggles

**Saving**:
- Save with valid name → Success
- Save with empty name → Error
- Save with long name (>30 chars) → Truncate or error
- Verify localStorage updated

**Cloning**:
- Clone predefined parrot → Genes match
- Clone custom parrot → Genes match
- Verify name has "(Copy)" suffix

**Randomize/Reset**:
- Randomize → All genes change
- Reset → All genes false
- Verify preview updates

### Performance Testing

**SVG Regeneration**:
- Toggle allele → SVG renders in <100ms
- Multiple rapid toggles → No lag
- Gradient toggle → Smooth transition

**Memory**:
- Open/close tab multiple times → No leaks
- Save many parrots → No slowdown
- Large localStorage → Handles gracefully

### Edge Cases

**Empty Name**:
- Show error toast
- Focus input field
- Don't save

**Storage Full**:
- localStorage quota exceeded
- Show friendly error
- Suggest deleting old parrots

**Invalid Genes**:
- Corrupted localStorage data
- Graceful fallback to defaults
- Don't crash

**Rapid Clicking**:
- Toggle checkboxes rapidly
- No race conditions
- Preview stays in sync

## Related Systems

**Genetics System**: Uses same gene model and calculations

**Gallery System**: Saves to and loads from gallery

**Storage System**: Persists custom parrots in localStorage

**Alpine.js Framework**: Reactive UI for instant feedback

**SVG Rendering**: Same pipeline as regular parrots

## Version History

**v1.2.2** (Planned) - Color Lab implementation
- Gene editor with 78 toggles
- Real-time preview
- Save to custom gallery
- Clone from gallery
- Randomize/reset functions

## Documentation

**Feature Doc**: `parrot-genetics-game/docs/features/COLOR_LAB.md` (this file)

**Related Docs**:
- [Gallery](GALLERY.md) - Custom parrot storage and display
- [Genetics System](../systems/GENETICS.md) - Gene mechanics
- [Storage System](../systems/STORAGE.md) - localStorage usage

**Code References** (Planned):
- Module: `public/js/ui/colorLab.js`
- Tab Handler: `public/js/ui/tabs.js` (add colorLab case)
- HTML: `public/breeding-game-modular.html` (colorLab tab section)
- CSS: `public/breeding-game.css` (color lab styles)
