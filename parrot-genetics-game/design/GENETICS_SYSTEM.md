# Genetics System Design

## Overview

The genetics system in ChromaWing simulates Mendelian inheritance with multiple genes controlling different traits. Each parrot has a genome consisting of gene pairs (alleles) that determine their appearance and abilities.

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
