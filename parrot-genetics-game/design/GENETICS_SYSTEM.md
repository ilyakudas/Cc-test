# Genetics System Design

## Overview

The genetics system in ChromaWing simulates Mendelian inheritance with multiple genes controlling different traits. Each parrot has a genome consisting of gene pairs (alleles) that determine their appearance and abilities.

**Current Implementation**: The system has evolved to use a **body-part-specific RGB genetics model** where each body part has its own independent set of 25 genes (6 red, 6 green, 6 blue, and 5 pattern genes). This creates natural color variation, complex gradient patterns, and animated effects while preventing the "gray averaging" problem and maintaining realistic binomial distribution of traits.

---

## CURRENT SYSTEM: Body-Part RGB Genetics with Patterns & Animation (v3.0)

### Core Principle

Each of the 5 major body parts has **25 independent genes**:
- **6 Red genes** (R1, R2, R3, R4, R5, R6)
- **6 Green genes** (G1, G2, G3, G4, G5, G6)
- **6 Blue genes** (B1, B2, B3, B4, B5, B6)
- **3 Pattern genes** (P1, P2, P3) - Control pattern type
- **2 Animation genes** (P4, P5) - Control animation type

**Total: 125 genes per parrot** (25 genes × 5 body parts)

### Body Parts

1. **🪽 Wings** - wing-blue feather group
2. **🦜 Body** - body-yellow, body-gold feather groups
3. **👑 Head/Crest** - accent-blue, covert-yellow feather groups
4. **✨ Tail** - accent-white, accent-brown feather groups
5. **💎 Accents** - accent-green, detail-gray feather groups

### Color Calculation: Position-Independent Counting

**The revolutionary feature**: Position doesn't matter, only the COUNT of dominant alleles!

#### Examples for Red Channel (6 genes):
- `rrrrrr` = 0 dominant = 0% red = rgb(0, ?, ?)
- `Rrrrr` = 1 dominant = 17% red = rgb(43, ?, ?)
- `RRrrrr` = 2 dominant = 33% red = rgb(85, ?, ?)
- `RRRrrr` = 3 dominant = 50% red = rgb(128, ?, ?)
- `RRRRrr` = 4 dominant = 67% red = rgb(170, ?, ?)
- `RRRRRr` = 5 dominant = 83% red = rgb(213, ?, ?)
- `RRRRRR` = 6 dominant = 100% red = rgb(255, ?, ?)

#### Binomial Distribution (Normal Distribution)

With 6 genes per color channel:

| Dominant Count | Combinations | Probability | Phenotype |
|----------------|--------------|-------------|-----------|
| 0 (rrrrrr) | 1 | 1.6% | No color |
| 1 (Rrrrr) | 6 | 9.4% | 17% intensity |
| 2 (RRrrrr) | 15 | 23.4% | 33% intensity |
| **3 (RRRrrr)** | **20** | **31.3%** | **50% intensity** ⭐ |
| 4 (RRRRrr) | 15 | 23.4% | 67% intensity |
| 5 (RRRRRr) | 6 | 9.4% | 83% intensity |
| 6 (RRRRRR) | 1 | 1.6% | 100% intensity |

**Result**: Most offspring naturally have medium colors (~50%), creating realistic variation!

### Pattern & Animation System

The 5 pattern genes control both the visual pattern and animation of each body part.

#### Pattern Genes (P1, P2, P3) - 8 Pattern Types

The first 3 pattern genes determine how the 6 color genes are split and displayed:

| P1 P2 P3 | Pattern | Gene Split | Description |
|----------|---------|------------|-------------|
| **000** | Solid | All 6 genes | Uniform color across entire part |
| **001** | Horizontal 2-Color | 0-2, 3-5 | Left to right gradient |
| **010** | Vertical 2-Color | 0-2, 3-5 | Top to bottom gradient |
| **011** | Radial 2-Color | 0-2, 3-5 | Center to edge gradient |
| **100** | Horizontal 3-Color | 0-1, 2-3, 4-5 | Three horizontal bands |
| **101** | Vertical 3-Color | 0-1, 2-3, 4-5 | Three vertical bands |
| **110** | Diagonal | 0-2, 3-5 | Top-left to bottom-right |
| **111** | Bilateral Mirror | 0-2, 3-5 | Edge-center-edge (mirrored) |

**Pattern Examples:**

**Horizontal 2-Color Gradient:**
```
Red:   r1 r2 r3 R4 R5 R6  (genes 0-2 = rrr = 0%, genes 3-5 = RRR = 100%)
Green: g1 g2 g3 g4 g5 g6  (all recessive)
Blue:  b1 b2 b3 b4 b5 b6  (all recessive)
Pattern: 001 (Horizontal 2-Color)

Result: Horizontal gradient from rgb(0,0,0) to rgb(255,0,0) (black to red)
```

**Horizontal 3-Color Gradient:**
```
Red:   r1 r2 R3 R4 R5 R6  (genes 0-1 = rr = 0%, genes 2-3 = RR = 100%, genes 4-5 = RR = 100%)
Green: g1 g2 G3 G4 g5 g6  (genes 0-1 = gg = 0%, genes 2-3 = GG = 100%, genes 4-5 = gg = 0%)
Blue:  b1 b2 b3 b4 b5 b6  (all recessive)
Pattern: 100 (Horizontal 3-Color)

Result: Three bands - rgb(0,0,0) → rgb(255,255,0) → rgb(255,0,0) (black → yellow → red)
```

**Bilateral Mirror:**
```
Red:   R1 R2 R3 r4 r5 r6  (genes 0-2 = RRR = 100%, genes 3-5 = rrr = 0%)
Green: g1 g2 g3 g4 g5 g6  (all recessive)
Blue:  b1 b2 b3 b4 b5 b6  (all recessive)
Pattern: 111 (Bilateral Mirror)

Result: Edge-center-edge pattern - rgb(255,0,0) → rgb(0,0,0) → rgb(255,0,0) (red → black → red)
```

#### Animation Genes (P4, P5) - 4 Animation Types

The last 2 pattern genes control SVG animations:

| P4 P5 | Animation | Description |
|-------|-----------|-------------|
| **00** | Still | No animation, static display |
| **01** | Color Shift | Subtle hue variations using 30% color blending |
| **10** | Slide | Gradient position moves across feathers (3s cycle) |
| **11** | Shimmer | Wave of brightening light sweeps across (+80 RGB, staggered) |

**Animation Implementation:**

**Color Shift (01):**
- Creates two subtle hue variations by adding 30% of adjacent RGB channels
- Example: Red (255,0,0) → Red-Orange (255,76,0) → Red-Pink (255,0,76) → Red
- Duration: 4 seconds
- Maintains original color recognizability while adding shimmer

**Slide (10):**
- Animates gradient x1/x2 positions to create flowing motion
- Only applies to linear gradients (not radial or solid)
- Duration: 3 seconds

**Shimmer (11):**
- Brightens each color stop by +80 RGB values
- Staggered timing creates wave effect
- Duration: 2.5 seconds with 0.3-0.4s delays between stops

### Why This Prevents "Gray Averaging"

**Problem with simple RGB**: If all parrots averaged to 50% red, 50% green, 50% blue, all parrots would be gray.

**Solution**: Each body part has independent genes!

**Example Multi-Colored Parrot:**
- **Wings**: `RRRRRR gggggg bbbbbb` + Solid = Pure red wings
- **Body**: `rrrrrr GGGGGG bbbbbb` + Solid = Pure green body
- **Head**: `rrrrrr gggggg BBBBBB` + Solid = Pure blue head
- **Tail**: `rrrRRR rrrGGG bbbbbb` + Horizontal 2-Color + Slide = Black-to-yellow flowing gradient
- **Accents**: `RRRRRR gggggg BBBBBB` + Solid + Shimmer = Shimmering purple

**Result**: A stunning animated multi-colored parrot, NOT gray! 🌈✨

### Inheritance Mechanics

When breeding two parrots, **each body part inherits independently**:

```javascript
// For each body part (wings, body, head, tail, accents):
//   For each color channel (red, green, blue):
//     For each of 6 genes:
//       - Randomly select one allele from Parent 1's gene
//       - Randomly select one allele from Parent 2's gene
//       - Offspring gets both alleles
//   For each of 5 pattern genes:
//     - 50% chance from Parent 1, 50% from Parent 2
```

**Example Breeding:**

Parent 1 Wings: Red = `RRRrrr`, Pattern = `00100` (Horizontal 2-Color, Still)
Parent 2 Wings: Red = `rrrRRR`, Pattern = `00111` (Horizontal 2-Color, Shimmer)

Offspring Wings Red Possibilities:
- Most likely: Mix of R and r alleles, averaging around 3 dominant (50% red)
- Pattern possibilities: Any combination of parent pattern genes
- Could inherit: `00100` (still), `00111` (shimmer), or recombinations like `00110` (slide)

### Advantages of This System

✅ **Natural Distribution**: Binomial distribution ensures realistic variation
✅ **No Gray Problem**: Independent body parts can have distinct colors
✅ **8 Distinct Patterns**: Multiple gradient types from solid to complex 3-color
✅ **4 Animation Types**: Still, subtle shifting, flowing, or shimmering effects
✅ **Strategic Breeding**: Players can target specific patterns and animations
✅ **Visual Variety**: 8 patterns × 4 animations × RGB colors = millions of unique appearances
✅ **Scalable**: Easy to add more patterns or animation types
✅ **Realistic**: Mimics how real animal coloration works (different genes for different body regions)
✅ **Emergent Complexity**: Simple rules create extraordinary diversity

### Data Structure

```javascript
{
  genes: {
    wings: {
      red: [true, true, true, false, false, false],    // RRRrrr = 3 dominant = 50%
      green: [false, false, false, false, false, false], // gggggg = 0 dominant = 0%
      blue: [false, false, false, false, false, false],  // bbbbbb = 0 dominant = 0%
      pattern: [false, false, true, true, false]  // 00110 = Diagonal + Slide
    },
    body: {
      red: [false, false, false, false, false, false],   // rrrrrr = 0 dominant
      green: [true, true, true, true, true, true],       // GGGGGG = 6 dominant = 100%
      blue: [false, false, false, false, false, false],  // bbbbbb = 0 dominant
      pattern: [false, false, false, false, false]       // 00000 = Solid, Still
    },
    head: {
      red: [false, false, false, false, false, false],   // rrrrrr
      green: [false, false, false, false, false, false], // gggggg
      blue: [true, true, true, true, true, true],        // BBBBBB
      pattern: [false, false, false, false, true]        // 00001 = Solid, Color Shift
    },
    tail: {
      red: [false, false, false, true, true, true],      // rrrRRR
      green: [false, false, false, true, true, true],    // gggGGG
      blue: [false, false, false, false, false, false],  // bbbbbb
      pattern: [false, false, true, true, false]         // 00110 = Horizontal 2-Color, Slide
    },
    accents: {
      red: [true, true, true, true, true, true],         // RRRRRR
      green: [false, false, false, false, false, false], // gggggg
      blue: [true, true, true, true, true, true],        // BBBBBB
      pattern: [false, false, false, true, true]         // 00011 = Solid, Shimmer
    }
  },
  phenotype: {
    wings: {
      pattern: 'diagonal',
      patternName: 'Diagonal',
      animationType: 'Slide',
      stops: [
        { offset: '0%', color: 'rgb(128, 0, 0)' },
        { offset: '100%', color: 'rgb(0, 0, 0)' }
      ],
      gradientType: 'linear',
      rgb: 'linear-gradient(135deg, rgb(128, 0, 0), rgb(0, 0, 0))'
    },
    body: {
      pattern: 'solid',
      patternName: 'Solid',
      animationType: 'Still',
      r: 0, g: 255, b: 0,
      rgb: 'rgb(0, 255, 0)'
    },
    head: {
      pattern: 'solid',
      patternName: 'Solid',
      animationType: 'Color Shift',
      r: 0, g: 0, b: 255,
      rgb: 'rgb(0, 0, 255)'
    },
    tail: {
      pattern: 'horizontal2',
      patternName: 'Horizontal 2-Color',
      animationType: 'Slide',
      stops: [
        { offset: '0%', color: 'rgb(0, 0, 0)' },
        { offset: '100%', color: 'rgb(255, 255, 0)' }
      ],
      gradientType: 'linear',
      rgb: 'linear-gradient(90deg, rgb(0, 0, 0), rgb(255, 255, 0))'
    },
    accents: {
      pattern: 'solid',
      patternName: 'Solid',
      animationType: 'Shimmer',
      r: 255, g: 0, b: 255,
      rgb: 'rgb(255, 0, 255)'
    }
  }
}
```

### Implementation: genetics-explorer.html

The genetics explorer tool (`public/genetics-explorer.html`) provides:

- **Interactive gene toggles**: Click to switch between dominant/recessive for all 25 genes
- **Real-time SVG rendering**: See changes instantly with animations
- **Pattern display**: Shows pattern binary (000-111) and animation binary (00-11)
- **Collapsible body part sections**: Organized gene controls per body part
- **6-gene color controls**: Position-independent counting visualization
- **5-gene pattern controls**: P1-P3 for pattern, P4-P5 for animation
- **Gradient visualization**: Linear, radial, and multi-stop gradients
- **SVG Animations**: Live preview of Color Shift, Slide, and Shimmer effects
- **Randomization**: Per-body-part or全体 randomization
- **Preset examples**: Rainbow, Mixed Colors (with animations), Natural, etc.
- **Stay-open dropdowns**: Edit multiple genes without re-opening

### Technical Implementation Details

**SVG Gradient Rendering:**
- Linear gradients: `<linearGradient>` with x1, y1, x2, y2 coordinates
- Radial gradients: `<radialGradient>` with center and edge colors
- Multi-stop gradients: Up to 3 color stops for 3-color patterns

**Animation Implementation:**
- Uses SVG `<animate>` elements nested inside gradient `<stop>` tags
- Color Shift: Animates `stop-color` attribute with subtle hue variations
- Slide: Animates `x1` and `x2` attributes of `<linearGradient>`
- Shimmer: Animates `stop-color` with brightness increase, staggered timing

---

## PREVIOUS SYSTEM: Body-Part RGB Genetics (v2.0)

*This version used 13 genes per body part (4 red, 4 green, 4 blue, 1 gradient). Superseded by v3.0.*

### Core Principle

Each of the 5 major body parts has **13 independent genes**:
- **4 Red genes** (R1, R2, R3, R4)
- **4 Green genes** (G1, G2, G3, G4)
- **4 Blue genes** (B1, B2, B3, B4)
- **1 Gradient gene** (GRAD)

**Total: 65 genes per parrot** (13 genes × 5 body parts)

### Body Parts

1. **🪽 Wings** - wing-blue feather group
2. **🦜 Body** - body-yellow, body-gold feather groups
3. **👑 Head/Crest** - accent-blue, covert-yellow feather groups
4. **✨ Tail** - accent-white, accent-brown feather groups
5. **💎 Accents** - accent-green, detail-gray feather groups

### Color Calculation: Position-Independent Counting

**The revolutionary feature**: Position doesn't matter, only the COUNT of dominant alleles!

#### Examples for Red Channel:
- `rrrr` = 0 dominant = 0% red = rgb(0, ?, ?)
- `Rrrr`, `rRrr`, `rrRr`, `rrrR` = 1 dominant = 25% red = rgb(64, ?, ?)
- `RRrr`, `RrRr`, `rrRR`, `RrRr`, `rRRr`, `rRrR` = 2 dominant = 50% red = rgb(128, ?, ?)
- `RRRr`, `RRrR`, `RrRR`, `rRRR` = 3 dominant = 75% red = rgb(191, ?, ?)
- `RRRR` = 4 dominant = 100% red = rgb(255, ?, ?)

#### Binomial Distribution (Normal Distribution)

With 4 genes per color channel:

| Dominant Count | Combinations | Probability | Phenotype |
|----------------|--------------|-------------|-----------|
| 0 (rrrr) | 1 | 6.25% | No color |
| 1 (Rrrr) | 4 | 25% | 25% intensity |
| **2 (RRrr)** | **6** | **37.5%** | **50% intensity** ⭐ |
| 3 (RRRr) | 4 | 25% | 75% intensity |
| 4 (RRRR) | 1 | 6.25% | 100% intensity |

**Result**: Most offspring naturally have medium colors (~50%), creating realistic variation!

### Gradient Gene System

The 13th gene for each body part controls whether that part displays a gradient or solid color.

#### When GRADIENT gene is recessive (grad/gg):
- All 4 genes work together
- Color = count of all 4 genes
- Result: **Solid color**

#### When GRADIENT gene is dominant (GRAD/GG):
- Genes split into two groups:
  - **Genes 1-2**: Control START color (left side)
  - **Genes 3-4**: Control END color (right side)
- Result: **Horizontal SVG gradient**

#### Gradient Examples

**Simple Gradient - Black to Red:**
```
Red:   r1 r2 R3 R4  (genes 1-2 = rr = 0%, genes 3-4 = RR = 100%)
Green: g1 g2 g3 g4  (all recessive)
Blue:  b1 b2 b3 b4  (all recessive)
Gradient: ON

Result: rgb(0,0,0) → rgb(255,0,0) (black to red gradient)
```

**Complex Gradient - Dark Red to Yellow-Green:**
```
Red:   R1 r2 R3 R4  (genes 1-2 = Rr = 50%, genes 3-4 = RR = 100%)
Green: g1 g2 G3 G4  (genes 1-2 = gg = 0%, genes 3-4 = GG = 100%)
Blue:  b1 b2 b3 b4  (all recessive)
Gradient: ON

Result: rgb(128,0,0) → rgb(255,255,0) (dark red to bright yellow)
```

**Reverse Gradient:**
```
Red:   R1 R2 r3 r4  (100% → 0%)
Green: G1 G2 g3 g4  (100% → 0%)
Blue:  B1 B2 b3 b4  (100% → 0%)
Gradient: ON

Result: rgb(255,255,255) → rgb(0,0,0) (white to black gradient)
```

### Why This Prevents "Gray Averaging"

**Problem with simple RGB**: If all parrots averaged to 50% red, 50% green, 50% blue, all parrots would be gray.

**Solution**: Each body part has independent genes!

**Example Multi-Colored Parrot:**
- **Wings**: `RRRR gggg bbbb` + no gradient = Pure red wings
- **Body**: `rrrr GGGG bbbb` + no gradient = Pure green body
- **Head**: `rrrr gggg BBBB` + no gradient = Pure blue head
- **Tail**: `RRRR GGGG bbbb` + gradient ON = Yellow gradient tail
- **Accents**: `RRRR gggg BBBB` + no gradient = Purple accents

**Result**: A stunning multi-colored parrot, NOT gray! 🌈

### Inheritance Mechanics

When breeding two parrots, **each body part inherits independently**:

```javascript
// For each body part (wings, body, head, tail, accents):
//   For each color channel (red, green, blue):
//     For each of 4 genes:
//       - Randomly select one allele from Parent 1's gene
//       - Randomly select one allele from Parent 2's gene
//       - Offspring gets both alleles
//   For gradient gene:
//     - 50% chance from Parent 1, 50% from Parent 2
```

**Example Breeding:**

Parent 1 Wings: Red = `RRrr`, Green = `gggg`, Blue = `bbbb`, Gradient = OFF
Parent 2 Wings: Red = `rrRR`, Green = `GGGG`, Blue = `bbbb`, Gradient = ON

Offspring Wings Red Possibilities:
- Gene 1: R or r from P1, r or R from P2 → Rr, RR, rr, or rR
- Gene 2: R or r from P1, r or R from P2 → combinations
- Gene 3: r or r from P1, R or R from P2 → rR
- Gene 4: r or r from P1, R or R from P2 → rR

Result: Diverse offspring with various red intensities (0-4 dominant alleles)

### Advantages of This System

✅ **Natural Distribution**: Binomial distribution ensures realistic variation
✅ **No Gray Problem**: Independent body parts can have distinct colors
✅ **Strategic Breeding**: Players can target specific body part colors
✅ **Gradient Variety**: Adds visual depth and breeding complexity
✅ **Scalable**: Easy to add more body parts or genes
✅ **Realistic**: Mimics how real animal coloration works (different genes for different body regions)
✅ **Emergent Complexity**: Simple rules create millions of unique combinations

### Data Structure

```javascript
{
  genes: {
    wings: {
      red: [true, true, false, false],    // RRrr = 2 dominant
      green: [false, false, false, false], // gggg = 0 dominant
      blue: [false, false, false, false],  // bbbb = 0 dominant
      gradient: false                      // Solid color
    },
    body: {
      red: [false, false, false, false],   // rrrr = 0 dominant
      green: [true, true, true, true],     // GGGG = 4 dominant
      blue: [false, false, false, false],  // bbbb = 0 dominant
      gradient: false                      // Solid color
    },
    head: {
      red: [false, false, false, false],   // rrrr
      green: [false, false, false, false], // gggg
      blue: [true, true, true, true],      // BBBB
      gradient: false
    },
    tail: {
      red: [false, false, true, true],     // rrRR
      green: [false, false, true, true],   // ggGG
      blue: [false, false, false, false],  // bbbb
      gradient: true                       // Gradient: black → yellow
    },
    accents: {
      red: [true, true, true, true],       // RRRR
      green: [false, false, false, false], // gggg
      blue: [true, true, true, true],      // BBBB
      gradient: false
    }
  },
  phenotype: {
    wings: { color: 'rgb(128, 0, 0)', isGradient: false },      // 50% red
    body: { color: 'rgb(0, 255, 0)', isGradient: false },       // 100% green
    head: { color: 'rgb(0, 0, 255)', isGradient: false },       // 100% blue
    tail: {
      startColor: 'rgb(0, 0, 0)',                               // black
      endColor: 'rgb(255, 255, 0)',                             // yellow
      isGradient: true
    },
    accents: { color: 'rgb(255, 0, 255)', isGradient: false }   // purple
  }
}
```

### Implementation: genetics-explorer.html

The genetics explorer tool (`public/genetics-explorer.html`) provides:

- **Interactive gene toggles**: Click to switch between dominant/recessive
- **Real-time SVG rendering**: See changes instantly
- **Collapsible body part sections**: Organized gene controls
- **Gradient visualization**: CSS gradients in color swatches
- **Randomization**: Per-body-part or全体 randomization
- **Preset examples**: Rainbow, Mixed Colors, Natural, etc.
- **Stay-open dropdowns**: Edit multiple genes without re-opening

---

## LEGACY SYSTEM: 6-Gene Color Model (v1.0)

*The original system is documented below for reference. The new body-part RGB system supersedes this.*

## Genetic Traits

### 1. Color Genetics

Colors are controlled by multiple genes working together:

#### Primary Color Genes (Body)
- **RED gene** (R/r)
  - RR = Deep crimson
  - Rr = Bright red
  - rr = No red pigment

- **YELLOW gene** (Y/y)
  - YY = Golden yellow
  - Yy = Bright yellow
  - yy = No yellow pigment

- **BLUE gene** (B/b)
  - BB = Deep blue
  - Bb = Sky blue
  - bb = No blue pigment

#### Color Modifiers
- **INTENSITY gene** (I/i)
  - II = Vibrant, saturated colors
  - Ii = Normal saturation
  - ii = Pale, washed-out colors

- **PATTERN gene** (P/p)
  - PP = Solid color
  - Pp = Speckled pattern
  - pp = Striped pattern

#### Secondary Features
- **CREST gene** (C/c)
  - CC = Large elaborate crest
  - Cc = Small crest
  - cc = No crest

- **TAIL LENGTH gene** (T/t)
  - TT = Long flowing tail
  - Tt = Medium tail
  - tt = Short tail

### 2. Physical Traits (Affecting Gameplay)

#### Size Gene (S/s)
- **SS** = Large (15% slower, 20% more presence in beauty contests)
- **Ss** = Medium (balanced)
- **ss** = Small (10% faster, 15% more agile)

#### Wing Shape (W/w)
- **WW** = Broad wings (better endurance, slower acceleration)
- **Ww** = Standard wings (balanced)
- **ww** = Narrow wings (faster acceleration, less endurance)

### 3. Performance Traits

#### Speed Gene (V/v) - "Velocity"
- **VV** = Fast (base speed +20%)
- **Vv** = Normal speed
- **vv** = Slow (base speed -15%)

#### Agility Gene (A/a)
- **AA** = Highly agile (sharp turns, obstacle navigation +25%)
- **Aa** = Normal agility
- **aa** = Less agile (-15% turning speed)

#### Intelligence Gene (N/n) - "Nous"
- **NN** = High intelligence (learns tricks faster, better in puzzle competitions)
- **Nn** = Normal intelligence
- **nn** = Lower intelligence (slower learning)

#### Stamina Gene (E/e) - "Endurance"
- **EE** = High stamina (can compete more frequently, +30% endurance)
- **Ee** = Normal stamina
- **ee** = Low stamina (-20% endurance)

## Inheritance Mechanics

### Basic Mendelian Inheritance
Each parent contributes one allele from each gene pair:
- Parent 1: Rr (can give R or r)
- Parent 2: Rr (can give R or r)
- Offspring possibilities: RR (25%), Rr (50%), rr (25%)

### Gene Interactions

#### Epistasis (Gene Masking)
- Some genes can mask others
- Example: A "color inhibitor" gene (if implemented) could suppress all color genes

#### Polygenic Traits
- Some visual traits result from multiple genes working together
- Example: Overall "beauty score" is calculated from color harmony, pattern balance, and feature proportions

### Mutation System

Rare random mutations can occur (0.5-2% chance per breeding):
- **Beneficial**: New color variant, enhanced trait
- **Neutral**: Cosmetic changes
- **Detrimental**: Reduced performance in one area

Mutations add:
- Excitement and unpredictability
- Rare collectible variations
- Strategic depth (do you breed it in or out?)

## Genetic Rating System

Each parrot receives ratings based on their genetics:

### Star Rating (1-5 stars per category)
- **Color**: Rarity and vibrancy of color combination
- **Pattern**: Uniqueness and balance of patterns
- **Size**: Optimal size for specific competitions
- **Speed**: Performance in racing events
- **Agility**: Performance in obstacle courses
- **Intelligence**: Performance in puzzle/trick competitions
- **Overall**: Weighted average based on gene quality

### Purity Score
- Tracks how many dominant alleles a parrot has
- 100% = All dominant alleles
- Used for "perfect specimen" achievements

### Rarity Score
- Based on color combinations and rare traits
- Common (50%+), Uncommon (25-50%), Rare (10-25%), Epic (2-10%), Legendary (<2%)

## Breeding Strategy Considerations

Players must balance:
1. **Trait Selection**: Focus on specific traits vs. balanced genetics
2. **Genetic Diversity**: Inbreeding risks vs. controlled breeding
3. **Generation Planning**: Short-term goals vs. long-term genetic projects
4. **Resource Management**: Best pairings cost more energy/resources

## Color Combination Examples

Here are some beautiful combinations possible:

- **Scarlet Macaw**: RR, YY, bb, II, PP (Red + Yellow = Orange/Red)
- **Blue-and-Gold**: Rr, YY, BB, Ii, Pp (Blue body, yellow chest)
- **Rainbow**: RR, YY, BB, II, Pp (Multi-colored with patterns)
- **Ghost**: rr, yy, bb, ii, PP (Albino/white variant)
- **Sunset**: RR, Yy, bb, II, pp (Red-orange with stripes)
- **Emerald**: rr, YY, BB, II, PP (Blue + Yellow = Green appearance)

## Implementation Notes

### Data Structure (Example)
```javascript
{
  genes: {
    color: {
      red: ['R', 'r'],      // Heterozygous
      yellow: ['Y', 'Y'],   // Homozygous dominant
      blue: ['b', 'b']      // Homozygous recessive
    },
    physical: {
      size: ['S', 's'],
      wing: ['W', 'w']
    },
    performance: {
      speed: ['V', 'V'],
      agility: ['A', 'a'],
      intelligence: ['N', 'n'],
      stamina: ['E', 'e']
    }
  },
  phenotype: {
    // Calculated from genes
    bodyColor: '#FF6B35',
    pattern: 'speckled',
    size: 'medium',
    // ... etc
  },
  stats: {
    speed: 75,
    agility: 60,
    intelligence: 80,
    stamina: 70
  }
}
```

### Breeding Algorithm
1. For each gene, randomly select one allele from each parent
2. Check for mutations (small random chance)
3. Calculate phenotype from genotype
4. Calculate stats based on genes and modifiers
5. Generate visual representation
6. Assign rarity and ratings
