# Wild Mate Finding System

## Overview

The **Wild Mate Finding System** allows players to release parrots into the wild, building a communal gene pool that can later be accessed to find mates for their breeding program. This creates a strategic investment system where players must balance keeping parrots versus releasing them to improve future breeding opportunities.

## Core Philosophy

**"You can't release garbage and expect treasure."**

The quality of wild mates depends on:
1. **What genes players have released** - Build the gene pool through releases
2. **The beauty/quality of the searching parrot** - Better parrots attract better mates
3. **Investment over time** - The gene pool is a long-term strategic resource

## Key Mechanics

### 1. Release System

#### Releasing a Parrot
When a player releases a parrot to the wild:

1. **Genes Added to Wild Pool**
   - All 65 genes (5 body parts × 13 genes each) are tracked
   - Each dominant allele increases that gene's frequency in the pool
   - Recessive alleles also contribute (but less impact)

2. **Conservation Credits Earned**
   - New resource: **🌿 Conservation Credits**
   - Used exclusively for finding mates in the wild
   - Amount earned based on parrot quality:
     ```
     Credits = Base (10) +
               (Rarity Multiplier × 5) +
               (Average Star Rating × 3) +
               (Genetic Diversity Bonus × 2)
     ```

**Example Release Rewards:**
- Common 2-star parrot: ~15 Conservation Credits
- Rare 4-star parrot: ~30 Conservation Credits
- Legendary 5-star parrot: ~50 Conservation Credits

3. **Gene Pool Impact**
   - Each gene's frequency is tracked separately
   - Dominant alleles: +2 points to gene frequency
   - Recessive alleles: +1 point to gene frequency
   - Pool totals determine available gene quality

#### Strategic Choice: Sell vs. Release

| Action | Immediate Reward | Long-term Value |
|--------|------------------|-----------------|
| **Sell** | Credits (currency) | None |
| **Release** | Conservation Credits | Improves gene pool |

Players must decide:
- Sell offspring for immediate money
- Release for future breeding opportunities
- Keep for current breeding program

### 2. Wild Gene Pool

#### Gene Pool Data Structure

The wild gene pool tracks **all 65 genes** across 5 body parts:

```javascript
wildGenePool = {
  wings: {
    red: { dominant: 120, recessive: 80, frequency: 0.60 },    // 120/(120+80)
    green: { dominant: 40, recessive: 160, frequency: 0.20 },
    blue: { dominant: 100, recessive: 100, frequency: 0.50 },
    // ... (all 13 genes for wings)
  },
  body: {
    red: { dominant: 200, recessive: 50, frequency: 0.80 },
    // ... (all 13 genes for body)
  },
  head: { /* 13 genes */ },
  tail: { /* 13 genes */ },
  accents: { /* 13 genes */ }
}
```

#### Gene Pool Metrics

**Frequency Calculation:**
```
Gene Frequency = dominant / (dominant + recessive)

0.0 - 0.2 = Very Rare (🔴 Red indicator)
0.2 - 0.4 = Rare (🟠 Orange indicator)
0.4 - 0.6 = Common (🟡 Yellow indicator)
0.6 - 0.8 = Abundant (🟢 Green indicator)
0.8 - 1.0 = Dominant (🔵 Blue indicator)
```

**Diversity Score:**
```
Diversity = (Number of genes with frequency 0.3-0.7) / 65 × 100

High Diversity (>60%): Balanced pool, many possibilities
Medium Diversity (30-60%): Some specialization
Low Diversity (<30%): Inbred pool, limited options
```

**Pool Quality Score:**
```
Quality = Average of all gene frequencies across all 65 genes

High Quality (>0.6): Many dominant genes available
Medium Quality (0.4-0.6): Mixed gene pool
Low Quality (<0.4): Mostly recessive genes, poor mates
```

#### Gene Pool Decay/Evolution

The gene pool is **dynamic** to encourage continuous investment:

**Decay Mechanics:**
- **Natural Drift**: Each week, gene frequencies drift 5% toward 0.5 (regression to mean)
- **Entropy**: Unused genes slowly decrease by 2% per week
- **Seasonal Reset**: Optional: Major events that partially reset the pool

**Why Decay?**
- Prevents "set it and forget it" gameplay
- Rewards active players
- Creates ongoing need to release parrots
- Simulates natural population dynamics

**Drift Formula:**
```javascript
// Each week/cycle:
newFrequency = currentFrequency × 0.95 + 0.5 × 0.05

// Example:
// Week 0: 0.80 (abundant red)
// Week 1: 0.80 × 0.95 + 0.5 × 0.05 = 0.785
// Week 4: ~0.74
// Week 12: ~0.65
```

### 3. Finding a Mate in the Wild

#### One Mate Per Parrot

**Core Rule**: Each parrot can find **ONE mate** in its lifetime.

**Why This Limitation?**
- Makes mate finding special and strategic
- Prevents exploiting one high-beauty parrot repeatedly
- Encourages breeding diverse parrots
- Creates "retirement" storyline (parrot goes to wild after finding mate)

**Implementation:**
- Parrot gets `hasFoundWildMate: false` property
- After finding mate: `hasFoundWildMate: true`
- Cannot use this parrot to find mates again
- Can still breed with sanctuary parrots normally

#### Mate Finding Process

**Step 1: Select Parrot**
- Must be adult parrot (not egg/chick)
- Cannot have already found wild mate
- Display parrot's Beauty Score and relevant genes

**Step 2: Pay Conservation Credits**
```
Cost = 20 Credits (base)
       + (Attempt Number - 1) × 10

First attempt: 20 credits
Second attempt: 30 credits (if first rejected)
Third attempt: 40 credits
...
```

**Step 3: Wild Search**
- System generates 3-5 potential mates
- Quality based on:
  - Your parrot's beauty (60% weight)
  - Wild gene pool quality (40% weight)
- Player can see preview of each mate's genes

**Step 4: Selection**
- **Accept Mate**: Breed immediately, parrot marked as used
- **Reject All**: Lose credits, can try again (higher cost)
- **Cancel**: Refund 50% of credits

#### Mate Quality Calculation

**Overall Mate Quality Formula:**
```
Mate Quality Score =
  (Your Parrot Beauty × 0.6) +
  (Gene Pool Quality × 0.4)

This score (0-100) determines:
- Number of dominant genes in mate
- Chance of rare genes appearing
- Overall phenotype quality
```

**Beauty Score Calculation:**
```javascript
Beauty Score =
  Color Harmony (0-25) +
  Rarity (0-25) +
  Feature Appeal (0-25) +
  Genetic Quality (0-25)
```

**Per-Gene Generation:**
For each of the 65 genes in the potential mate:

```javascript
// 1. Check gene pool frequency
const geneFreq = wildGenePool[bodyPart][geneType].frequency;

// 2. Apply beauty modifier
const beautyBonus = (parrotBeauty / 100) × 0.4; // Up to +40%

// 3. Calculate dominant allele probability
const dominantChance = geneFreq + beautyBonus;

// 4. Generate alleles
const allele1 = Math.random() < dominantChance ? DOMINANT : recessive;
const allele2 = Math.random() < dominantChance ? DOMINANT : recessive;

// 5. Add some randomness (10% variance)
const randomFactor = (Math.random() - 0.5) × 0.2;
const finalChance = Math.max(0, Math.min(1, dominantChance + randomFactor));
```

**Example Scenarios:**

**Scenario A: High Beauty + Rich Gene Pool**
- Your Parrot Beauty: 85/100 ⭐⭐⭐⭐⭐
- Gene Pool Red Frequency: 0.75 (abundant)
- Dominant Red Chance: 0.75 + (0.85 × 0.4) = 0.75 + 0.34 = 1.09 → capped at 0.95
- **Result**: Very high chance of dominant red genes (RRRR or RRRr)

**Scenario B: High Beauty + Poor Gene Pool**
- Your Parrot Beauty: 85/100 ⭐⭐⭐⭐⭐
- Gene Pool Red Frequency: 0.15 (very rare)
- Dominant Red Chance: 0.15 + (0.85 × 0.4) = 0.15 + 0.34 = 0.49
- **Result**: Moderate chance only (~50%) despite high beauty

**Scenario C: Low Beauty + Rich Gene Pool**
- Your Parrot Beauty: 30/100 ⭐
- Gene Pool Red Frequency: 0.75 (abundant)
- Dominant Red Chance: 0.75 + (0.30 × 0.4) = 0.75 + 0.12 = 0.87
- **Result**: Good chance (pool carries you)

**Scenario D: Low Beauty + Poor Gene Pool**
- Your Parrot Beauty: 30/100 ⭐
- Gene Pool Red Frequency: 0.15 (very rare)
- Dominant Red Chance: 0.15 + (0.30 × 0.4) = 0.15 + 0.12 = 0.27
- **Result**: Poor chance - "garbage in, garbage out"

### 4. Mate Preview System

Before accepting, players see detailed mate information:

```
🔍 Wild Mate Found!

Your Parrot: "Crimson" (Beauty: ⭐⭐⭐⭐)

┌────────────────────────────────────┐
│ Wild Mate #1 - "Forest Wanderer"  │
├────────────────────────────────────┤
│ Overall Quality: ⭐⭐⭐⭐         │
│ Match Score: 82%                   │
│                                    │
│ WINGS:                             │
│   Red:   RRRr (75%) 🟢            │
│   Green: rrGG (50%) 🟡            │
│   Blue:  bbbb (0%)  🔴            │
│                                    │
│ BODY:                              │
│   Red:   RRrr (50%) 🟡            │
│   Green: GGGG (100%) 🔵           │
│   Blue:  Bbbb (25%) 🟠            │
│                                    │
│ Predicted Offspring:               │
│   - High chance of red wings       │
│   - Guaranteed green body          │
│   - Moderate color variety         │
│                                    │
│ Rarity: RARE                       │
└────────────────────────────────────┘

[Accept Mate] [Reject] [View Details]
```

## 5. Strategic Gameplay

### Early Game Strategy

**Problem**: Empty or poor gene pool, limited credits

**Strategy**:
1. Release some starter parrots to seed gene pool
2. Focus on releasing diverse genes (not just one color)
3. Save first 40-60 credits before attempting mate finding
4. Use low-beauty parrots for first wild mate attempts (test the pool)

### Mid Game Strategy

**Problem**: Pool established but unbalanced

**Strategy**:
1. Identify weak genes in pool (check dashboard)
2. Breed parrots specifically to release those genes
3. Balance quality releases (medium-high parrots)
4. Use wild mates to introduce new gene combinations
5. Build credit reserve for late game

### Late Game Strategy

**Problem**: Finding that perfect mate

**Strategy**:
1. Maintain pool quality with regular releases
2. Breed 5-star beauty parrots specifically for wild mating
3. Target specific gene combinations
4. Use multiple parrots (each gets one mate) for parallel breeding lines
5. Release legendary parrots to ensure pool stays elite

### Economic Loop

```
┌─────────────────────────────────────────────┐
│ Breed Parrots → Offspring Generated         │
│                                              │
│ Decision Point:                              │
│ ┌─────────────┬──────────────┬─────────────┐│
│ │    KEEP     │     SELL     │   RELEASE   ││
│ │  (Breed)    │  (Credits)   │  (Cons.Cr.) ││
│ └─────────────┴──────────────┴─────────────┘│
│                                              │
│ Conservation Credits → Find Wild Mates      │
│                                              │
│ Wild Mates → New Genetic Combinations       │
│                                              │
│ New Combos → Better Offspring → Repeat      │
└─────────────────────────────────────────────┘
```

## 6. UI/UX Design

### Gene Pool Dashboard

```
╔══════════════════════════════════════════════╗
║        🌳 WILD GENE POOL STATUS             ║
╚══════════════════════════════════════════════╝

Conservation Credits: 🌿 145
Total Parrots Released: 23
Pool Quality: ⭐⭐⭐⭐ (72/100)
Diversity Score: 64% (HEALTHY)

Last Release: 2 days ago
Decay Rate: -5% per week

┌─────────────────────────────────────────────┐
│ WINGS                                       │
├─────────────────────────────────────────────┤
│ Red Genes:   ████████░░ 0.78 🟢 Abundant   │
│ Green Genes: ████░░░░░░ 0.35 🟠 Rare       │
│ Blue Genes:  ██████░░░░ 0.58 🟡 Common     │
│ ... (10 more genes)                         │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ BODY                                        │
├─────────────────────────────────────────────┤
│ Red Genes:   ███░░░░░░░ 0.25 🟠 Rare       │
│ Green Genes: █████████░ 0.92 🔵 Dominant   │
│ Blue Genes:  █████░░░░░ 0.50 🟡 Common     │
│ ... (10 more genes)                         │
└─────────────────────────────────────────────┘

[View All Body Parts] [Release History]

⚠️ WARNING: Red genes in BODY are declining!
   Consider releasing red-bodied parrots soon.
```

### Mate Finding Interface

```
╔══════════════════════════════════════════════╗
║         🔍 FIND MATE IN THE WILD            ║
╚══════════════════════════════════════════════╝

Your Parrot: "Sapphire"
┌────────────────────────────────┐
│ [Parrot Visual]                │
│                                │
│ Beauty: ⭐⭐⭐⭐⭐ (91/100)    │
│ Genes: RRrr yyYY BBBB          │
│ Status: Ready to find mate     │
│                                │
│ Wild Mate Bonus: +36%          │
│ (Due to high beauty)           │
└────────────────────────────────┘

Cost: 🌿 20 Conservation Credits
(You have: 🌿 145)

Expected Mate Quality: ⭐⭐⭐⭐
(Based on beauty + gene pool)

[Search for Wild Mate]
[Cancel]

───────────────────────────────────

IMPORTANT: Each parrot can only find
ONE mate in their lifetime. Choose wisely!
```

### Mate Selection Interface

```
╔══════════════════════════════════════════════╗
║         WILD MATES FOUND (3)                ║
╚══════════════════════════════════════════════╝

Choose one mate for "Sapphire":

┌─────────────────┬─────────────────┬─────────────────┐
│ Mate #1         │ Mate #2         │ Mate #3         │
├─────────────────┼─────────────────┼─────────────────┤
│ [Visual]        │ [Visual]        │ [Visual]        │
│                 │                 │                 │
│ Quality: ⭐⭐⭐⭐│ Quality: ⭐⭐⭐  │ Quality: ⭐⭐⭐⭐⭐│
│ Match: 88%      │ Match: 72%      │ Match: 95%      │
│                 │                 │                 │
│ Strong red      │ Balanced colors │ Rainbow blend   │
│ High green      │ Good agility    │ Excellent genes │
│ Rare combo      │ Common          │ LEGENDARY       │
│                 │                 │                 │
│ [Select]        │ [Select]        │ [Select]        │
│ [Details]       │ [Details]       │ [Details]       │
└─────────────────┴─────────────────┴─────────────────┘

[Reject All & Search Again] (Cost: 🌿 30)
[Cancel] (Refund: 🌿 10)
```

## 7. Balance Considerations

### Conservation Credit Economy

**Earning Rate** (per game session):
- Early game: 30-50 credits/week (releasing 2-3 parrots)
- Mid game: 100-150 credits/week (more breeding, selective releases)
- Late game: 200-300 credits/week (high volume breeding)

**Spending Rate**:
- Wild mate search: 20-60 credits each (depending on attempts)
- Average successful mate: ~30 credits

**Balance Target**: Players should find 1-3 wild mates per week

### Gene Pool Targets

**Healthy Pool Thresholds**:
- Diversity: >50% (at least 33 genes with 0.3-0.7 frequency)
- Quality: >0.55 (average across all genes)
- Balance: No gene should be <0.1 or >0.9 for long

**Time to Build Pool**:
- Minimal viable: 10-15 releases (can find basic mates)
- Good quality: 30-40 releases (reliable mate finding)
- Excellent pool: 60+ releases (high-quality mates common)

### Mate Quality Distribution

Target probabilities for mate quality:

| Your Parrot Quality | Mate Quality Distribution |
|---------------------|--------------------------|
| ⭐ (Poor) | 60% ⭐, 30% ⭐⭐, 10% ⭐⭐⭐ |
| ⭐⭐⭐ (Good) | 20% ⭐⭐, 50% ⭐⭐⭐, 30% ⭐⭐⭐⭐ |
| ⭐⭐⭐⭐⭐ (Legendary) | 10% ⭐⭐⭐, 40% ⭐⭐⭐⭐, 50% ⭐⭐⭐⭐⭐ |

## 8. Future Expansion: Multiple Regions

**Concept**: Different biomes with separate gene pools

### Region Types

**🌲 Forest Region**
- Specializes in: Green body, brown accents
- Common genes: Green, yellow, earth tones
- Rare genes: Bright reds, blues
- Theme: Natural, camouflage colors

**🏔️ Mountain Region**
- Specializes in: Blues, whites, grays
- Common genes: Blue, white, cool tones
- Rare genes: Warm colors (red, yellow)
- Theme: Ice, sky, stone colors

**🌴 Tropical Region**
- Specializes in: Vibrant colors, rainbows
- Common genes: All colors balanced
- Rare genes: Solid colors (everything is mixed)
- Theme: Exotic, bright, diverse

**🏜️ Desert Region**
- Specializes in: Reds, oranges, yellows
- Common genes: Warm tones
- Rare genes: Blues, purples
- Theme: Sunset, sand colors

### Regional Mechanics

**Separate Gene Pools**:
- Each region tracks its own 65 genes
- Releasing in Forest only affects Forest pool
- Finding mates costs region-specific credits

**Regional Credits**:
- 🌿 Forest Credits
- ❄️ Mountain Credits
- 🌺 Tropical Credits
- 🏜️ Desert Credits

**Strategic Choices**:
- Focus on one region (specialize)
- Spread releases across regions (diversify)
- Trade regional mates back to other regions

**Migration System**:
- Convert credits between regions (exchange rate)
- Transfer genes between pools (rare feature)
- Unlock through late-game progression

## 9. Narrative/Thematic Elements

### Conservation Theme

**Story Integration**:
> "Your sanctuary partners with the Global Parrot Conservation Initiative. By releasing healthy, genetically diverse parrots, you help restore wild populations and earn credits toward conservation efforts."

### Ecological Education

**Messages When Releasing**:
- "Ruby joins the wild flock in the forest!"
- "Her vibrant red genes will strengthen future generations."
- "Thank you for contributing to genetic diversity!"

**Pool Status Narration**:
- High diversity: "The wild population is thriving!"
- Low diversity: "The wild flock needs genetic diversity."
- Declining genes: "Red genes are becoming rare in the wild."

### Ethical Gameplay

The system encourages:
- **Generosity**: Release good parrots, get good mates
- **Community**: Your releases help the ecosystem
- **Long-term thinking**: Investment over immediate gain
- **Diversity over perfection**: Balanced pools beat min-maxing

## 10. Technical Implementation Notes

### Data Persistence

```javascript
// Save to player data
playerData = {
  conservationCredits: 145,
  wildGenePool: { /* 65 genes tracked */ },
  releaseHistory: [
    { parrotId: 'abc', timestamp: Date, genes: {...} },
    // ...
  ],
  parrots: [
    {
      id: 'xyz',
      name: 'Sapphire',
      hasFoundWildMate: false,
      wildMateAttempts: 0,
      // ... other parrot data
    }
  ]
}
```

### Performance Considerations

**Gene Pool Updates**:
- Batch calculate frequency after release
- Cache quality/diversity scores
- Update UI asynchronously

**Mate Generation**:
- Pre-generate mate pool on load
- Generate 3-5 mates when search initiated
- Use deterministic random (seed-based) for consistency

### Testing Parameters

```javascript
const CONFIG = {
  // Credit rewards
  RELEASE_BASE_CREDITS: 10,
  RELEASE_RARITY_MULTIPLIER: 5,
  RELEASE_STAR_MULTIPLIER: 3,

  // Mate finding costs
  MATE_SEARCH_BASE_COST: 20,
  MATE_SEARCH_INCREMENT: 10,

  // Gene pool decay
  DECAY_RATE_PER_WEEK: 0.05,
  DRIFT_TARGET: 0.5,

  // Quality calculations
  BEAUTY_WEIGHT: 0.6,
  POOL_WEIGHT: 0.4,
  BEAUTY_BONUS_MAX: 0.4,
  RANDOMNESS_VARIANCE: 0.2,

  // Balance
  GENES_PER_BODY_PART: 13,
  BODY_PARTS: 5,
  TOTAL_GENES: 65
};
```

## 11. Success Metrics

### Player Engagement
- % of players who release at least 10 parrots
- Average conservation credits earned per session
- Wild mate searches per week

### System Health
- Average gene pool quality across all players
- Distribution of gene frequencies (want bell curve)
- % of successful mate searches (target: 80-90%)

### Balance Indicators
- Credit earn/spend ratio (target: 1.2-1.5 earn per spend)
- Average mate quality vs. parrot beauty correlation
- Player sentiment: "feels fair" vs "too grindy"

## Summary

The Wild Mate Finding System creates a virtuous cycle:

1. **Breed parrots** → Generate offspring
2. **Release quality parrots** → Earn credits + improve pool
3. **Build gene pool** → Better genes available
4. **Find wild mates** → Access unique combinations
5. **Breed with mates** → Create new lines
6. **Repeat** → Continuous progression

**Key Principles**:
- 🎯 **Strategic Investment**: Release quality to get quality
- 🔄 **Dynamic System**: Pool evolves, requires maintenance
- ⚖️ **Fair Rewards**: Beauty + pool both matter
- 🎲 **Controlled Randomness**: Better inputs = better odds
- 🌱 **Long-term Play**: Build something meaningful over time

This system adds depth, replay value, and strategic decision-making while maintaining the educational genetics focus of ChromaWing.
