# Visual Concepts and Art Direction

## Art Style

### Overall Aesthetic
- **Vibrant and Colorful**: Celebrate the beauty of parrots with rich, saturated colors
- **Clean and Modern**: Minimalist UI that doesn't distract from the parrots
- **Approachable**: Friendly, welcoming art style (not hyper-realistic, not overly cartoonish)
- **Scientific Touch**: Genetics displays have a clinical, lab-like aesthetic

### Visual Inspirations
- **Pokemon**: Approachable creature design, clear stat visualization
- **Stardew Valley**: Cozy, pleasant UI and color palette
- **Monument Valley**: Clean geometric design principles
- **Scientific Diagrams**: Punnett squares, chromosome diagrams for genetics UI

## Parrot Design

### Base Parrot Model

A simplified, stylized parrot design that can be customized:

```
Anatomical Parts (customizable):
- Head (with eye, beak)
- Crest (size varies by gene)
- Body (main color area)
- Wings (2x, can have different shade)
- Tail (length varies by gene)
- Feet
```

### Procedural Generation Approach

Each parrot is generated from genetic data:

#### Color Application
1. **Base Color**: Primary body color from color genes
2. **Secondary Colors**: Wing/tail accents
3. **Patterns**: Overlay speckles, stripes, or gradients
4. **Shading**: Automatic gradient for 3D effect
5. **Highlights**: Glossy feather shine

#### Size Variations
- **Small (ss)**: 80% scale, lighter, more agile appearance
- **Medium (Ss)**: 100% scale, balanced proportions
- **Large (SS)**: 120% scale, more imposing presence

#### Feature Variations
- **Crest**: None → Small tuft → Large fan
- **Tail**: Short stub → Medium → Long flowing
- **Wing Shape**: Narrow → Standard → Broad

### Example Color Combinations

Visual references for genetics combinations:

**Scarlet Macaw Type**
- Genes: RR YY bb II PP
- Colors: Deep red body, yellow wing patches, orange blend areas
- Visual: Bold, primary colors, solid pattern

**Blue-and-Gold Type**
- Genes: Rr YY BB Ii Pp
- Colors: Rich blue back, golden yellow chest, slight speckles
- Visual: Complementary color scheme, elegant contrast

**Emerald Type**
- Genes: rr YY BB II PP
- Colors: Blue-green appearance from yellow+blue
- Visual: Cool, soothing palette

**Rainbow Type**
- Genes: RR YY BB II Pp
- Colors: Multi-colored with red, yellow, blue visible
- Visual: Vibrant, playful, speckled pattern

**Ghost Type**
- Genes: rr yy bb ii PP
- Colors: Pale white/cream, very light colors
- Visual: Ethereal, rare, elegant

**Sunset Type**
- Genes: RR Yy bb II pp
- Colors: Red-orange with striped pattern
- Visual: Warm gradient, dramatic stripes

## UI Design

### Color Palette

**Primary Colors** (UI Elements)
- Background: Soft cream (#F5F1E8)
- Primary: Teal (#2A9D8F)
- Secondary: Warm coral (#E76F51)
- Accent: Gold (#F4A261)
- Text: Charcoal (#264653)

**Semantic Colors**
- Success/Positive: Green (#06D6A0)
- Warning: Orange (#FF9F1C)
- Error: Red (#E63946)
- Info: Blue (#457B9D)

**Rarity Colors**
- Common: Gray (#95A3A6)
- Uncommon: Green (#52B788)
- Rare: Blue (#4895EF)
- Epic: Purple (#B388EB)
- Legendary: Gold (#FFD60A)

### Typography

**Headers**: Bold, clean sans-serif (e.g., Montserrat Bold)
**Body**: Readable sans-serif (e.g., Open Sans)
**Stats/Numbers**: Monospace for alignment (e.g., JetBrains Mono)
**Scientific**: Serif for genetics terms (e.g., Merriweather)

### Icon Design

- **Genes**: DNA helix symbol, color-coded
- **Stats**: Simple pictograms (lightning for speed, brain for intelligence)
- **Competitions**: Trophy, medal, ribbon icons
- **Resources**: Coin, energy bolt, star icons
- **Actions**: Breed (heart), Train (dumbbell), Compete (flag)

## Screen Layouts

### Aviary Screen

```
┌─────────────────────────────────────────────┐
│  🏠 ChromaWing Sanctuary        ⚡50  💰1250 │
├─────────────────────────────────────────────┤
│                                              │
│  [Filter: All ▾]  [Sort: Name ▾]  [🔍]     │
│                                              │
│  ┌───────┐  ┌───────┐  ┌───────┐           │
│  │ 🦜    │  │ 🦜    │  │ 🦜    │           │
│  │ Ruby  │  │ Sapphire│ │ Emerald│          │
│  │⭐⭐⭐⭐│  │⭐⭐⭐  │  │⭐⭐⭐⭐⭐│           │
│  │Speed 4│  │Beauty 3│  │Agility5│          │
│  └───────┘  └───────┘  └───────┘           │
│                                              │
│  ┌───────┐  ┌───────┐  [+ New Slot]        │
│  │ 🦜    │  │ 🦜    │   [Locked]           │
│  │ Topaz │  │ Amber │                       │
│  │⭐⭐⭐  │  │⭐⭐    │                       │
│  │Intel 3│  │Speed 2│                       │
│  └───────┘  └───────┘                       │
│                                              │
└─────────────────────────────────────────────┘
```

### Parrot Detail Card

```
┌─────────────────────────────────────────────┐
│  Ruby                          [Close ✕]     │
│  Generation 3 • Epic                         │
├─────────────────────────────────────────────┤
│                                              │
│         [Large Parrot Image]                 │
│            (Rendered)                        │
│                                              │
├─────────────────────────────────────────────┤
│  Stats:                    Genetics:         │
│  Speed    ⚡⚡⚡⚡☆ 85      RR Yy Bb         │
│  Agility  🎯🎯🎯☆☆ 65      VV Aa Nn         │
│  Intel    🧠🧠🧠🧠☆ 80      II Pp SS         │
│  Stamina  💪💪💪☆☆ 60                        │
├─────────────────────────────────────────────┤
│  Energy: ████████░░ 80/100                   │
│                                              │
│  [🏆 Compete] [💪 Train] [❤️ Breed]         │
└─────────────────────────────────────────────┘
```

### Breeding Lab

```
┌─────────────────────────────────────────────┐
│  Breeding Laboratory                         │
├─────────────────────────────────────────────┤
│                                              │
│  Parent 1          Parent 2                  │
│  ┌───────┐         ┌───────┐                │
│  │ 🦜    │    ❤️   │ 🦜    │                │
│  │ Ruby  │         │Emerald│                │
│  │RR Yy  │         │rr YY  │                │
│  └───────┘         └───────┘                │
│                                              │
│  Offspring Predictions:                      │
│  ┌─────────────────────────────────┐        │
│  │ Red Gene:  50% Rr, 50% rr       │        │
│  │ Yellow:    50% Yy, 50% YY       │        │
│  │                                  │        │
│  │ Possible Colors:                 │        │
│  │ 🟠 Orange/Red: 50%               │        │
│  │ 🟡 Yellow: 50%                   │        │
│  └─────────────────────────────────┘        │
│                                              │
│  Cost: 💰 200  ⚡ 40                         │
│                                              │
│  [Breed Parrots]                             │
└─────────────────────────────────────────────┘
```

### Competition Screen

```
┌─────────────────────────────────────────────┐
│  Competition Hall                            │
├─────────────────────────────────────────────┤
│                                              │
│  Available Events:                           │
│                                              │
│  🏆 Local Beauty Pageant        [Tier 1]    │
│     Entry: 💰50   Req: 1⭐ Beauty            │
│     Rewards: Up to 💰250, 🏅 reputation     │
│     [Enter Event]                            │
│  ────────────────────────────────────────    │
│  ⚡ Regional Speed Race          [Tier 2]    │
│     Entry: 💰150  Req: 2⭐ Speed             │
│     Rewards: Up to 💰1000, 🧬 genetic sample│
│     [Enter Event]                            │
│  ────────────────────────────────────────    │
│  🎯 National Agility Course     [Tier 3]    │
│     Entry: 💰500  Req: 3⭐ Agility           │
│     Rewards: Up to 💰5000, 🏆 trophy        │
│     [Locked - Unlock at Level 10]           │
│                                              │
└─────────────────────────────────────────────┘
```

### Genetics Lab (Advanced View)

```
┌─────────────────────────────────────────────┐
│  Genetics Laboratory                         │
├─────────────────────────────────────────────┤
│  Analyzing: Ruby                             │
│                                              │
│  Chromosome View:                            │
│  ┌─────────────────────────────────────┐   │
│  │ Color Genes:                         │   │
│  │  Red:    [R] [R]  ██ Homozygous Dom │   │
│  │  Yellow: [Y] [y]  █░ Heterozygous   │   │
│  │  Blue:   [B] [b]  █░ Heterozygous   │   │
│  │  Intensity: [I][I] ██ Homozygous    │   │
│  │                                      │   │
│  │ Performance Genes:                   │   │
│  │  Speed:  [V] [V]  ██ Homozygous Dom │   │
│  │  Agility:[A] [a]  █░ Heterozygous   │   │
│  │  Intel:  [N] [n]  █░ Heterozygous   │   │
│  └─────────────────────────────────────┘   │
│                                              │
│  Genetic Quality: ████████░░ 85/100          │
│  Purity Score: 7/14 dominant alleles         │
│                                              │
│  [View Breeding Calculator]                  │
└─────────────────────────────────────────────┘
```

## Animation Concepts

### Parrot Animations
- **Idle**: Gentle bobbing, occasional head turn, wing flutter
- **Selected**: Hop/jump, spread wings briefly
- **Happy** (after win): Excited wing flapping, dancing
- **Tired** (low energy): Slower movements, drooping posture
- **Breeding**: Hearts animation, fade to egg
- **Hatching**: Egg crack animation, reveal new parrot

### UI Animations
- **Stat Increase**: Number count-up, bar fill animation
- **Competition Win**: Trophy drop-in, confetti, sparkle effects
- **New Achievement**: Badge slide-in, glow effect
- **Breeding Reveal**: Egg shake → crack → reveal with sparkles

### Transition Effects
- **Screen Changes**: Smooth slide transitions
- **Card Reveals**: Flip or fade-in animations
- **Loading**: Animated DNA helix or flying parrot

## Accessibility Considerations

### Color Blindness Support
- Don't rely solely on color for critical information
- Use patterns, shapes, and text labels
- Offer color-blind friendly palette option

### Visual Clarity
- High contrast between text and background
- Large, readable fonts
- Clear iconography with labels

### UI Scaling
- Support for different screen sizes
- Zoom options for detail views
- Responsive layout

## Asset Requirements

### Sprites/Images Needed
- Base parrot body parts (layered for customization)
- UI icons (30+ icons)
- Background images (aviary, lab, competition venues)
- Decorative elements (plants, perches, equipment)
- Trophy/achievement badges

### Procedural Generation
- Color mixer algorithm
- Pattern overlay system
- Feature scaling system

### Sound Design (Future)
- Gentle background music (menu, aviary)
- Upbeat music (competitions)
- Parrot calls (different per size/type)
- UI sounds (click, success, failure)
- Breeding/hatching special sounds

## Visual Quality Tiers

### Minimum (MVP)
- Simple 2D sprite parrots with color swaps
- Basic UI with solid colors
- No animations beyond simple fades

### Standard (Target)
- Procedurally generated layered sprites
- Polished UI with gradients and depth
- Smooth animations for key interactions
- Particle effects for special moments

### Premium (Stretch Goals)
- 3D rendered parrots (Three.js)
- Advanced lighting and shading
- Complex particle systems
- Cinematic competition sequences
- Parallax backgrounds
