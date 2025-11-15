# Gallery Feature

**Purpose**: Showcase beautiful parrots designed with RYB color wheel harmony, providing inspiration and demonstrating the game's color genetics system.

**Related docs**: [Visual Indicators](VISUAL_INDICATORS.md), [UI Rendering](../systems/UI_RENDERING.md)

## Overview

The Gallery is a curated collection of 12 stunning parrots, each designed using the RYB (Red-Yellow-Blue) color wheel model. Each parrot represents a unique color theme with creative names that reflect natural phenomena, precious gems, and artistic concepts. The gallery serves as both inspiration for breeding and a demonstration of the game's genetic color system capabilities.

## User Requirements

### Display Conditions

**Access**: Gallery tab in main navigation
- Located after Contests tab
- Icon: 🎨 Gallery
- Always available (no unlock required)
- Independent of player progress

**Tab Behavior**:
- Shows when Gallery tab clicked
- Hides other tabs (Collection, Store, Breeding, Contests)
- Updates panel title to "Parrot Gallery"
- No impact on game state when viewing

### Visual Design

**Layout**: Responsive grid
- Grid template: `repeat(auto-fill, minmax(200px, 1fr))`
- Minimum card width: 200px
- Maximum columns: Fills available width
- Gap between cards: 20px
- Padding: 10px around grid

**Header Section**:
- Title: "🎨 Beautiful Parrot Gallery"
- Subtitle: "Explore stunning parrots designed with RYB color wheel harmony"
- Centered alignment
- Bottom border separator (2px, #e0e0e0)
- Margin below: 20px

**Gallery Card Design**:

Each card contains:
1. Parrot SVG display area (180px height)
2. Parrot name with emoji icon
3. Theme description (italic, muted)
4. Beauty score badge

**Card Container**:
- Background: White
- Border radius: 12px
- Padding: 15px
- Box shadow: `0 4px 12px rgba(0,0,0,0.1)`
- Border: 2px solid transparent

**Card Interactions**:
- Cursor: pointer (clickable)
- Hover effect:
  - Translate up 5px (`translateY(-5px)`)
  - Enhanced shadow: `0 8px 20px rgba(0,0,0,0.15)`
  - Border color changes to `#667eea` (theme purple)
  - Transition: all 0.3s ease

**Parrot Display Area**:
- Height: 180px
- Background: Linear gradient from `#f5f7fa` to `#c3cfe2`
- Border radius: 8px
- Centered SVG (flexbox)
- Overflow: hidden

**Parrot Name**:
- Font size: 1.1em
- Font weight: bold
- Color: #333 (dark gray)
- Margin bottom: 6px
- Includes emoji icon (🌅, 🌊, 🌲, etc.)

**Theme Description**:
- Font size: 0.85em
- Color: #666 (medium gray)
- Font style: italic
- Margin bottom: 8px
- Examples: "Warm sunset gradient", "Cool ocean blues"

**Beauty Score Badge**:
- Display: flex (centered with icon)
- Background: Linear gradient purple (`#667eea` to `#764ba2`)
- Color: white
- Border radius: 6px
- Padding: 6px 12px
- Font weight: 600
- Sparkle icon: ✨ (1.2em size)
- Format: "Beauty: {score}"

### Loading State

**Initial Load**:
- Display: "Loading gallery..."
- Text align: center
- Padding: 40px
- Color: #999 (light gray)
- Font size: 1.1em

**Load Completion**:
- Loading message disappears
- Gallery grid fades in
- Parrots render with SVGs

## RYB Color Wheel Model

### Color Theory

**Primary Colors** (angles 0°, 120°, 240°):
- Red (#FF0000)
- Yellow (#FFFF00)
- Blue (#0000FF)

**Secondary Colors** (angles 60°, 180°, 300°):
- Orange (#FF8000) - Red + Yellow
- Green (#00FF00) - Yellow + Blue
- Violet (#8000FF) - Blue + Red

**Tertiary Colors** (angles 30°, 90°, 150°, 210°, 270°, 330°):
- Vermilion (#FF4000) - Red + Orange
- Amber (#FFBF00) - Yellow + Orange
- Chartreuse (#80FF00) - Yellow + Green
- Teal (#00FF80) - Green + Blue
- Indigo (#4000FF) - Blue + Violet
- Magenta (#FF00FF) - Violet + Red

### Color Wheel Position
Each color has:
- Name (e.g., "red", "amber")
- Hex code (RGB representation)
- Angle (0-360 degrees on wheel)
- Display name (capitalized)

## Gallery Parrot Collection

### 1. Sunset Serenade 🌅
**Theme**: Warm sunset gradient
**Color Palette**:
- Wings: Orange (gradient)
- Special Wing: Vermilion
- Body: Amber (gradient)
- Head: Yellow
- Tail: Orange (gradient)
- Accents: Vermilion

**Design Rationale**: Captures warm sunset colors transitioning from golden yellows to deep oranges

### 2. Ocean Depths 🌊
**Theme**: Cool ocean blues
**Color Palette**:
- Wings: Teal (gradient)
- Special Wing: Blue (gradient)
- Body: Teal
- Head: Indigo
- Tail: Blue (gradient)
- Accents: Teal

**Design Rationale**: Evokes deep ocean waters with cool blue-green tones

### 3. Forest Canopy 🌲
**Theme**: Lush forest greens
**Color Palette**:
- Wings: Chartreuse
- Special Wing: Green
- Body: Green (gradient)
- Head: Chartreuse
- Tail: Green (gradient)
- Accents: Teal

**Design Rationale**: Represents vibrant forest foliage

### 4. Royal Majesty 👑
**Theme**: Regal purples and violets
**Color Palette**:
- Wings: Violet (gradient)
- Special Wing: Indigo (gradient)
- Body: Violet (gradient)
- Head: Magenta
- Tail: Violet
- Accents: Indigo

**Design Rationale**: Royal purple theme evoking nobility and elegance

### 5. Phoenix Flame 🔥
**Theme**: Fiery reds and oranges
**Color Palette**:
- Wings: Red (gradient)
- Special Wing: Vermilion
- Body: Orange (gradient)
- Head: Vermilion
- Tail: Red (gradient)
- Accents: Orange

**Design Rationale**: Intense fire colors suggesting mythical phoenix

### 6. Golden Sunshine ☀️
**Theme**: Bright yellows and golds
**Color Palette**:
- Wings: Yellow (gradient)
- Special Wing: Amber
- Body: Amber (gradient)
- Head: Yellow
- Tail: Amber
- Accents: Orange

**Design Rationale**: Radiant golden tones like sunlight

### 7. Twilight Dreams 🌆
**Theme**: Magical purple-orange contrast
**Color Palette**:
- Wings: Violet (gradient)
- Special Wing: Magenta (gradient)
- Body: Orange
- Head: Amber
- Tail: Indigo (gradient)
- Accents: Vermilion

**Design Rationale**: Complementary colors creating dramatic twilight effect

### 8. Spring Blossom 🌸
**Theme**: Soft magenta and chartreuse
**Color Palette**:
- Wings: Magenta (gradient)
- Special Wing: Vermilion
- Body: Chartreuse (gradient)
- Head: Yellow
- Tail: Magenta
- Accents: Amber

**Design Rationale**: Spring garden colors with pink flowers and green foliage

### 9. Aurora Borealis ✨
**Theme**: Northern lights spectrum
**Color Palette**:
- Wings: Teal (gradient)
- Special Wing: Green (gradient)
- Body: Violet (gradient)
- Head: Indigo
- Tail: Magenta (gradient)
- Accents: Blue

**Design Rationale**: Full spectrum of aurora colors dancing across the sky

### 10. Ruby Radiance 💎
**Theme**: Deep crimson reds
**Color Palette**:
- Wings: Red
- Special Wing: Vermilion (gradient)
- Body: Red
- Head: Magenta
- Tail: Red (gradient)
- Accents: Vermilion

**Design Rationale**: Rich red gemstone tones

### 11. Emerald Garden 💚
**Theme**: Rich emerald greens
**Color Palette**:
- Wings: Green (gradient)
- Special Wing: Teal
- Body: Chartreuse
- Head: Green
- Tail: Green (gradient)
- Accents: Teal

**Design Rationale**: Lush green gemstone hues

### 12. Sapphire Sky 💙
**Theme**: Deep sapphire blues
**Color Palette**:
- Wings: Blue (gradient)
- Special Wing: Indigo
- Body: Blue (gradient)
- Head: Teal
- Tail: Indigo (gradient)
- Accents: Blue

**Design Rationale**: Deep blue gemstone colors like precious sapphires

## Technical Implementation

### Alpine.js Component

**Component Name**: `galleryParrots`

**Reactive State**:
```javascript
{
  parrots: [],           // Array of gallery parrot instances
  loading: true,         // Loading state boolean
  selectedGalleryParrot: null  // Currently selected parrot
}
```

**Methods**:
- `init()` - Initialize component, load parrots
- `loadGalleryParrots()` - Generate parrot instances from definitions
- `getParrotSVG(parrot)` - Async SVG generation
- `selectParrot(parrot)` - Handle parrot selection

**Component Registration**:
```javascript
Alpine.data('galleryParrots', () => window.galleryComponent);
```

### Parrot Generation

**Color Conversion Process**:

1. **Hex to RGB**: Convert hex color codes to RGB values (0-255)
   ```javascript
   { r: 255, g: 128, b: 0 } // Orange
   ```

2. **RGB to Genes**: Convert RGB values to genetic representation
   - Each color channel (R, G, B) maps to 4 alleles
   - Value 255 → 4 true alleles
   - Value 128 → 2 true alleles
   - Value 0 → 0 true alleles
   ```javascript
   {
     r: [true, true, true, true],  // 255 → 4 alleles
     g: [true, true, false, false], // 128 → 2 alleles
     b: [false, false, false, false] // 0 → 0 alleles
   }
   ```

3. **Gradient Flags**: Apply gradient flags based on definition
   ```javascript
   genes.wings.gradient = true;  // Wings have gradient
   genes.body.gradient = false;  // Body is solid
   ```

4. **Parrot Creation**: Instantiate Parrot with generated genes
   ```javascript
   const parrot = new Parrot(id, name, genes, 1, 'gallery');
   parrot.galleryTheme = theme;
   ```

### Data Structure

**Gallery Parrot Definition**:
```javascript
{
  id: 'gallery-sunset',           // Unique identifier
  name: '🌅 Sunset Serenade',     // Display name with emoji
  theme: 'Warm sunset gradient',   // Theme description
  colors: {                        // Color assignments per body part
    wings: 'orange',
    special_wing: 'vermilion',
    body: 'amber',
    head: 'yellow',
    tail: 'orange',
    accents: 'vermilion'
  },
  gradient: {                      // Gradient flags per part
    wings: true,
    body: true,
    tail: true
  }
}
```

### Module Location

**File**: `public/js/ui/galleryParrots.js`

**Exports**:
- `getGalleryParrots()` - Returns array of gallery parrot instances
- `createGalleryComponent()` - Returns Alpine.js component definition

**Dependencies**:
- `Parrot` class from `../core/parrot.js`
- `generateParrotSVG` from `../lib/svg.js`

### HTML Structure

**Tab Container**: `#galleryTab`
- Alpine directive: `x-data="galleryParrots"`
- Display: none (shown via tab switching)

**Template Structure**:
```html
<div x-data="galleryParrots">
  <div class="gallery-header">...</div>

  <template x-if="loading">
    <div>Loading...</div>
  </template>

  <template x-if="!loading">
    <div class="gallery-grid">
      <template x-for="parrot in parrots">
        <div class="gallery-card" @click="selectParrot">
          <div x-html="await getParrotSVG(parrot)"></div>
          <div x-text="parrot.name"></div>
          <div x-text="parrot.galleryTheme"></div>
          <div x-text="'Beauty: ' + parrot.calculateBeauty().score"></div>
        </div>
      </template>
    </div>
  </template>
</div>
```

### CSS Classes

**Container Classes**:
- `.gallery-container` - Main container with padding/overflow
- `.gallery-header` - Header section with title/subtitle
- `.gallery-loading` - Loading state display
- `.gallery-grid` - Responsive grid layout

**Card Classes**:
- `.gallery-card` - Individual parrot card
- `.gallery-parrot-display` - SVG display area
- `.gallery-card-info` - Card text content container
- `.gallery-parrot-name` - Parrot name styling
- `.gallery-parrot-theme` - Theme description styling
- `.gallery-parrot-beauty` - Beauty score badge

## User Interactions

### Viewing Gallery

**Action**: Click Gallery tab
**Result**:
1. Hide current tab
2. Show gallery tab
3. Update panel title to "Parrot Gallery"
4. Alpine.js initializes if first visit
5. Parrots load and render

**No Selection Required**: Gallery can be viewed without selecting parrots

### Clicking Gallery Parrot

**Current Behavior**:
- `selectParrot(parrot)` method called
- Selected parrot stored in component state
- Console logs selection

**Future Enhancement Opportunities**:
- Display parrot in preview panel
- Show detailed genetics information
- Allow "cloning" to collection (for a price)
- Enable comparison with owned parrots

### Navigation

**Tab Switching**:
- Gallery tab button clickable from any tab
- Switching away from gallery preserves state
- Re-entering gallery shows same parrots (no reload)

## Benefits & Use Cases

### Inspiration
- Players can browse beautiful color combinations
- Demonstrates what's possible with breeding
- Encourages experimentation with colors

### Education
- Shows RYB color wheel relationships
- Illustrates gradient vs solid colors
- Demonstrates beauty score variations

### Reference
- Quick access to harmonious color schemes
- Named themes provide breeding goals
- Visual examples of genetic diversity

### Marketing
- Showcases game's visual capabilities
- Attractive feature for new players
- Demonstrates polish and quality

## Design Decisions

### Why RYB Instead of RGB?

**Artistic Tradition**: RYB color wheel is traditional in art/design
**Harmonious Combinations**: Creates aesthetically pleasing color schemes
**Conceptual Clarity**: Easier for players to understand color relationships
**Distinct from Gameplay**: Gallery uses artistic model while breeding uses scientific RGB

**Implementation Note**: RYB colors are converted to RGB for genetic representation

### Why 12 Parrots?

**Complete Wheel**: 3 primaries + 3 secondaries + 6 tertiaries = 12 colors
**Visual Balance**: 12 cards fill screen nicely on various sizes
**Not Overwhelming**: Curated selection vs exhaustive list
**Room for Expansion**: Could add seasonal/special galleries later

### Why Static vs Generated?

**Consistency**: Same beautiful parrots for all players
**Curation**: Hand-picked color combinations for maximum beauty
**Performance**: Generated once on tab open vs real-time
**Intentional Design**: Each parrot tells a color story

## Future Enhancements

### Potential Features

**Interactive Preview**:
- Click to show in preview panel
- Full genetics breakdown
- Color breakdown by body part

**Gallery Categories**:
- Separate galleries by theme (Nature, Gems, Seasons)
- Filter by color family
- Sort by beauty score

**Unlockable Galleries**:
- Special galleries unlock with achievements
- Rare color combinations
- Mythical/legendary themes

**Clone to Collection**:
- Purchase gallery parrot for coins
- Adds exact copy to collection
- Higher price than store (premium)

**Breeding Inspiration**:
- "Breed to Match" feature
- Shows required parent colors
- Tracks breeding progress toward gallery parrot

**Customization**:
- Players can save favorite combinations to personal gallery
- Share custom parrots via export code
- Community gallery voting

### Technical Improvements

**Lazy Loading**:
- Load SVGs as cards scroll into view
- Improve initial render performance
- Better for large galleries

**SVG Caching**:
- Cache gallery parrot SVGs in localStorage
- Instant display on return visits
- Reduce regeneration overhead

**Animation**:
- Stagger card entrance animations
- Smooth fade-in on load
- Parallax hover effects

## Related Systems

**Genetics System**: Gallery parrots use same genetic model as player parrots

**Beauty System**: Gallery parrot beauty scores calculated identically

**SVG Rendering**: Same rendering pipeline as regular parrots

**Alpine.js Framework**: Reactive UI updates without manual DOM manipulation

## Version History

**v1.2.1** - Initial gallery implementation
- 12 RYB color wheel parrots
- Alpine.js reactive component
- Responsive grid layout
- Theme-based naming system
- Beauty score display

## Testing Considerations

### Visual Testing

**Color Accuracy**:
- Verify each parrot matches RYB color definition
- Check gradient smoothness
- Confirm hex-to-RGB conversion accuracy

**Layout Testing**:
- Test responsive grid at various widths
- Verify card spacing and alignment
- Check hover effects on all cards

**Cross-browser**:
- Test SVG rendering in Chrome, Firefox, Safari
- Verify Alpine.js reactivity across browsers
- Check CSS grid support

### Functional Testing

**Tab Navigation**:
- Gallery tab shows correct content
- Switching tabs doesn't break gallery
- Re-entering gallery preserves state

**Alpine.js Component**:
- Component initializes on first visit
- Parrots array populates correctly
- Loading state toggles properly

**Performance**:
- 12 SVG renders complete in reasonable time (< 1s)
- No memory leaks on repeated visits
- Smooth hover animations

### Edge Cases

**Empty State**: If parrot generation fails, show error message

**Slow Network**: Loading indicator displays during initialization

**Alpine.js Not Loaded**: Graceful degradation or error message

**Invalid Color Definitions**: Fallback to default colors or skip parrot

## Accessibility

### Current Implementation

**Keyboard Navigation**:
- Tab button keyboard accessible
- Gallery cards clickable via keyboard (potential)

**Screen Readers**:
- Parrot names read aloud
- Theme descriptions provide context
- Beauty scores announced

### Future Improvements

**Focus Management**:
- Clear focus indicators on cards
- Logical tab order through gallery

**ARIA Labels**:
- Gallery region labeled
- Card roles defined
- Interactive elements announced

**Reduced Motion**:
- Respect prefers-reduced-motion
- Disable hover animations if requested
- Instant transitions for accessibility

## Documentation

**Feature Doc**: `parrot-genetics-game/docs/features/GALLERY.md` (this file)

**Related Guides**:
- [Adding Features](../guides/ADDING_FEATURES.md)
- [UI Rendering](../systems/UI_RENDERING.md)

**Code References**:
- Module: `public/js/ui/galleryParrots.js`
- Tab Handler: `public/js/ui/tabs.js:51-54`
- HTML: `public/breeding-game-modular.html:168-201`
- CSS: `public/breeding-game.css` (gallery section)
