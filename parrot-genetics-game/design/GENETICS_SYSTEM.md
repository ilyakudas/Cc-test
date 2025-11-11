# Genetics System Design

## Overview

The genetics system in ChromaWing simulates Mendelian inheritance with multiple genes controlling different traits. Each parrot has a genome consisting of gene pairs (alleles) that determine their appearance and abilities.

**Current Implementation**: The system has evolved to use a **body-part-specific RGB genetics model** where each body part has its own independent set of 13 genes (4 red, 4 green, 4 blue, and 1 gradient gene). This creates natural color variation and prevents the "gray averaging" problem while maintaining realistic binomial distribution of traits.

---

## NEW SYSTEM: Body-Part RGB Genetics (v2.0)

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
