# Beauty Scoring System

**ChromaWing Breeding Simulator**
**Version:** 3.0
**Last Updated:** November 13, 2025

---

## Overview

The beauty scoring system is the core mechanism that evaluates the aesthetic quality of parrots in ChromaWing. It analyzes color combinations, gradients, and color relationships across all body parts to produce a numerical beauty score (0-200 points) with detailed breakdown.

**Key Philosophy:** Beauty is contextual and multifaceted - not just about having many colors, but about how colors work together through contrast, complementarity, and visual interest.

---

## Architecture

### Location in Codebase

**Main Implementation:**
- `public/js/parrot.js` - Lines 186-463
  - `Parrot.calculateBeauty()` - Primary beauty calculation method
  - `Parrot.classifyColor()` - Lines 128-172 - Color classification helper
  - `Parrot.colorDotProduct()` - Lines 175-183 - Color relationship calculator

**Usage in Contests:**
- `public/js/contests.js` - Lines 124, 244-245
  - `enterContest()` - Uses `parrot.calculateBeauty()` for contest scoring
  - `generateAIOpponents()` - Lines 170-193 - Creates AI competitors with target beauty ranges
  - Contest results display beauty scores

**Original Monolithic Version:**
- `public/breeding-game.js` - Contains same logic (pre-refactoring reference)

---

## Core Concepts

### 1. Color Classification

The system first classifies each RGB color into named categories to enable semantic beauty rules.

**Implementation:** `parrot.js:128-172`

```javascript
classifyColor(r, g, b) {
    // Normalize RGB values to 0-1 range
    const rn = r / 255;
    const gn = g / 255;
    const bn = b / 255;

    // Define intensity thresholds
    const full = 0.85;   // 255 or close (217+)
    const high = 0.6;    // 150+
    const half = 0.4;    // ~128
    const low = 0.2;     // 50 or less

    // Classification logic...
}
```

#### Color Categories

**Primary Full Colors** (high intensity, single dominant channel):
- `red` - (255, 0, 0)
- `green` - (0, 255, 0)
- `blue` - (0, 0, 255)
- `yellow` - (255, 255, 0)
- `cyan` - (0, 255, 255)
- `magenta` - (255, 0, 255)

**Dark Colors** (medium intensity, single channel):
- `dark-red` - (~128, 0, 0)
- `dark-green` - (0, ~128, 0)
- `dark-blue` - (0, 0, ~128)

**Two-Component Colors** (medium + high intensity):
- `orange` - (255, 128-153, 0)
- `lime` - (128, 255, 0)
- `amber` - (255, 128-153, 0)
- `sky` - (0, 128, 255)
- `teal` - (0, 255, 128)
- `purple` - (128, 0, 255)
- `rose` - (255, 0, 128)

**Light Colors** (two channels full, one medium):
- `light-yellow` - (255, 255, 128)
- `light-magenta` - (255, 128, 255)
- `light-cyan` - (128, 255, 255)

**Muddy/Undefined:**
- `mixed` - Any color that doesn't fit the above patterns

**Design Rationale:** Only "beautiful" pure colors contribute to beauty scores. Mixed/muddy colors (e.g., 100, 120, 110) are aesthetically unremarkable and score zero.

---

### 2. Color Relationship Scoring

Colors are compared pairwise using **dot product** in RGB color space to determine their relationship.

**Implementation:** `parrot.js:175-183`

```javascript
colorDotProduct(rgb1, rgb2) {
    // Normalize vectors to unit length
    const len1 = Math.sqrt(rgb1[0]*rgb1[0] + rgb1[1]*rgb1[1] + rgb1[2]*rgb1[2]);
    const len2 = Math.sqrt(rgb2[0]*rgb2[0] + rgb2[1]*rgb2[1] + rgb2[2]*rgb2[2]);
    if (len1 === 0 || len2 === 0) return 0;

    // Calculate normalized dot product
    const dot = rgb1[0]*rgb2[0] + rgb1[1]*rgb2[1] + rgb1[2]*rgb2[2];
    return dot / (len1 * len2);
}
```

#### Dot Product Interpretation

The dot product measures the angle between two color vectors:

| Dot Product | Relationship | Bonus | Description |
|-------------|--------------|-------|-------------|
| `< -0.7` | **Complementary** | +18 | Opposite colors (e.g., red ↔ cyan) |
| `-0.7 to -0.3` | **Contrasting** | +12 | Very different colors |
| `-0.3 to +0.3` | **Contrasting** | +12 | Maximally different hues |
| `+0.3 to +0.7` | **Varied** | +5 | Somewhat different |
| `> +0.9` | **Similar** | -3 | Nearly identical colors (penalty) |

**Mathematical Foundation:**
- Dot product of unit vectors = cosine of angle between them
- `cos(180°) = -1` → Complementary colors (opposite)
- `cos(90°) = 0` → Orthogonal colors (contrasting)
- `cos(0°) = +1` → Same color (similar)

**Design Rationale:** Color theory principles favor contrast and complementarity over similarity. Penalizing similar colors encourages genetic diversity.

---

## Beauty Calculation Algorithm

### Step-by-Step Process

**Implementation:** `parrot.js:186-463`

#### 1. Extract Body Part Colors

```javascript
const bodyParts = ['wings', 'special_wing', 'body', 'head', 'tail', 'accents'];
const bodyPartColors = {};
const bodyPartRGB = {};
const bodyPartGradientRGB = {};
```

For each body part:
- Call `calculateBodyPartColor(bodyPart)` to get RGB values
- If gradient: extract `startColor` and `endColor` RGB separately
- If solid: extract single RGB color
- Classify colors using `classifyColor()` → named categories

**Example:**
```javascript
bodyPartColors['wings'] = {
    type: 'gradient',
    startColor: 'red',      // rgb(255, 0, 0)
    endColor: 'yellow',     // rgb(255, 255, 0)
    displayColor: 'red→yellow'
};
```

#### 2. Score Gradients (+10 per beautiful gradient)

```javascript
// For each gradient body part:
if (partColor.type === 'gradient') {
    if (startColor !== 'mixed' && endColor !== 'mixed') {
        if (startColor !== endColor) {
            beautyScore += 10;
            beautyTraits.push(`Beautiful gradient: ${bodyPart} (+10)`);
        }
    }
}
```

**Rules:**
- Both start and end must be beautiful colors (not `mixed`)
- Start and end must be different colors
- Same-color gradients (e.g., `red→red`) score 0
- Mixed gradients (e.g., `mixed→blue`) score 0

**Max Contribution:** 6 body parts × 10 = **60 points**

#### 3. Score Solid Colors (+3 per beautiful solid)

```javascript
const beautifulSolidColors = solidParts.filter(bp =>
    bodyPartColors[bp].color !== 'mixed'
);

for (const part of beautifulSolidColors) {
    beautyScore += 3;
    beautyTraits.push(`Beautiful color: ${part} (+3)`);
}
```

**Max Contribution:** 6 body parts × 3 = **18 points**

#### 4. Score Color Diversity (bonus for variety)

```javascript
const uniqueBeautifulColors = new Set(
    beautifulSolidColors.map(bp => bodyPartColors[bp].color)
);

if (uniqueBeautifulColors.size >= 3) {
    beautyScore += 15;
    beautyTraits.push(`Color diversity: 3+ different colors (+15)`);
} else if (uniqueBeautifulColors.size === 2) {
    beautyScore += 8;
    beautyTraits.push(`Some diversity: 2 colors (+8)`);
}
```

**Rules:**
- Only counts solid beautiful colors (not gradients, not mixed)
- 3+ different colors: +15
- 2 different colors: +8
- 1 or 0 colors: +0

**Max Contribution:** **15 points**

#### 5. Pairwise Color Comparisons (the big one)

This is where most points come from. Every pair of body parts is compared.

**Total Comparisons:** 6 parts × 5 / 2 = **15 pairwise comparisons**

##### Case 1: Both Solid Colors

```javascript
const dotProduct = colorDotProduct(rgb1, rgb2);

if (dotProduct < -0.7) {
    beautyScore += 18;  // Complementary (+9 each)
} else if (Math.abs(dotProduct) < 0.3) {
    beautyScore += 12;  // Contrasting (+6 each)
} else if (Math.abs(dotProduct) > 0.3 && Math.abs(dotProduct) < 0.7) {
    beautyScore += 5;   // Varied (+2.5 each)
} else if (dotProduct > 0.9) {
    beautyScore -= 3;   // Similar (-1.5 each)
}
```

**Max Contribution:** 15 comparisons × 18 = **270 points** (theoretical max)

##### Case 2: Both Gradients (weighted 0.5x)

```javascript
// Compare all 4 combinations:
// - start1 vs start2
// - start1 vs end2
// - end1 vs start2
// - end1 vs end2

let totalBonus = 0;
for (const comp of comparisons) {
    const dotProduct = colorDotProduct(comp.rgb1, comp.rgb2);
    // Same scoring as solid-solid
    totalBonus += bonus;
}

const weightedBonus = totalBonus * 0.5;  // Weight at 50%
beautyScore += weightedBonus;
```

**Rationale:** Gradients already scored +10, so gradient-gradient comparisons are weighted down to avoid double-counting.

##### Case 3: One Gradient, One Solid (weighted 0.75x)

```javascript
// Compare solid with both gradient colors:
// - solid vs gradient.start
// - solid vs gradient.end

const weightedBonus = totalBonus * 0.75;  // Weight at 75%
beautyScore += weightedBonus;
```

**Rationale:** Mixed comparison gets intermediate weighting.

---

## Scoring Examples

### Example 1: Rainbow Parrot (High Score)

**Genetics:**
- Wings: Red solid
- Special Wing: Orange solid
- Body: Yellow solid
- Head: Green solid
- Tail: Blue solid
- Accents: Purple solid

**Scoring Breakdown:**

1. **Beautiful solid colors:** 6 × 3 = **+18**
2. **Color diversity:** 6 unique colors ≥ 3 = **+15**
3. **Pairwise comparisons:** 15 pairs
   - Red ↔ Green: Contrasting = +12
   - Red ↔ Blue: Contrasting = +12
   - Yellow ↔ Blue: Complementary = +18
   - Yellow ↔ Purple: Contrasting = +12
   - Green ↔ Purple: Varied = +5
   - ... (15 total comparisons)
   - Estimated total: **~120**

**Total:** ~153 points

### Example 2: Gradient Specialist (Medium-High Score)

**Genetics:**
- Wings: Black→Red gradient
- Body: Blue→Yellow gradient
- Head: Green→Cyan gradient
- Tail: Purple→Magenta gradient
- Others: Mixed colors

**Scoring Breakdown:**

1. **Beautiful gradients:** 4 × 10 = **+40**
2. **Gradient-gradient comparisons:** 6 pairs × 0.5x weighting
   - Estimated: **~60** (after weighting)

**Total:** ~100 points

### Example 3: Monochrome Parrot (Low Score)

**Genetics:**
- All parts: Red solid

**Scoring Breakdown:**

1. **Beautiful solid colors:** 6 × 3 = **+18**
2. **Color diversity:** 1 color = **+0**
3. **Pairwise comparisons:** 15 pairs
   - All similar (dotProduct > 0.9) = 15 × (-3) = **-45**

**Total:** max(0, 18 - 45) = **0 points** (floor enforced)

### Example 4: Muddy Mixed Colors (Zero Score)

**Genetics:**
- All parts: Mixed/muddy colors (e.g., rgb(100, 120, 110))

**Scoring Breakdown:**

1. **Beautiful solid colors:** 0 (all classified as `mixed`)
2. **Color diversity:** 0
3. **Pairwise comparisons:** 0 (mixed colors ignored)

**Total:** **0 points**

---

## Return Value Structure

```javascript
{
    score: 127,           // Final beauty score (0-200)
    maxScore: 200,        // Maximum possible score
    traits: [             // Detailed breakdown (human-readable)
        "Beautiful gradient: wings (+10)",
        "Beautiful color: body (+3)",
        "Color diversity: 3 different colors (+15)",
        "Complementary: wings & tail (+9 each)",
        "Contrasting: body & head (+6 each)",
        "Similar: head & accents (-1.5 each)"
    ],
    bodyPartColors: {     // Color classifications per part
        wings: { type: 'gradient', startColor: 'red', endColor: 'yellow' },
        body: { type: 'solid', color: 'blue' },
        // ... etc
    },
    partContributions: {  // Points contributed by each body part
        wings: 25.5,
        body: 18.0,
        head: 12.3,
        // ... etc
    }
}
```

---

## Design Philosophy

### Why This Approach?

1. **Color Theory Foundations**
   - Based on real color theory (complementary colors, contrast)
   - Dot product in RGB space approximates perceptual color relationships
   - Encourages aesthetically pleasing combinations

2. **Genetic Diversity Incentive**
   - Penalizes monochrome parrots (-3 for similar colors)
   - Rewards diverse gene pools (+15 diversity bonus)
   - Makes "perfect" context-dependent

3. **Gradient Support**
   - Gradients add visual complexity (+10 per beautiful gradient)
   - Weighted comparisons prevent double-counting
   - Encourages use of gradient gene

4. **Scalability**
   - Works with any number of body parts
   - Easy to adjust weights and thresholds
   - Extensible to new color relationships

5. **Transparency**
   - Returns detailed breakdown (`traits` array)
   - Per-part contribution tracking
   - Players can understand why scores are what they are

### Theoretical Maximum Score

**Maximum Possible:** ~200 points

**Breakdown:**
- Gradients: 6 × 10 = 60
- OR Solid colors: 6 × 3 = 18
- Diversity bonus: 15
- Pairwise comparisons: ~120-150 (15 pairs, mostly complementary)

**Achieving 200:** Requires perfect complementary colors across all pairs with gradients - extremely rare and difficult to breed.

---

## Usage in Contests

**Location:** `public/js/contests.js`

### Contest Scoring

```javascript
// Line 124
const parrotBeauty = parrot.calculateBeauty();
const opponents = generateAIOpponents(tier, 5);

const competitors = [
    { parrot, beauty: parrotBeauty, isPlayer: true },
    ...opponents
];

competitors.sort((a, b) => b.beauty.score - a.beauty.score);
```

**Process:**
1. Calculate player parrot's beauty score
2. Generate 5 AI opponents with scores in tier's range
3. Sort all competitors by beauty score (descending)
4. Determine placement and rewards

### Contest Tiers

Each tier has a target beauty range for difficulty:

| Tier | Name | Min-Max Beauty Range | Entry Cost |
|------|------|---------------------|------------|
| 0 | Beginner | 0-40 | 10 coins |
| 1 | Rainbow | 30-80 | 50 coins |
| 2 | Gradient Masters | 70-130 | 200 coins |
| 3 | Contrast Kings | 110-170 | 500 coins |
| 4 | Elite Grand Prix | 150-200 | 1000 coins |

**AI Opponent Generation:** `contests.js:170-193`

```javascript
const targetBeauty = minBeauty + Math.random() * (maxBeauty - minBeauty);
const mockBeauty = {
    score: Math.round(targetBeauty + (Math.random() - 0.5) * 15),
    maxScore: 200,
    // ... mock structure
};
```

**Design:** AI scores are randomly distributed within tier range ± 7.5 points for variability.

---

## Performance Considerations

### Complexity Analysis

- **Color Classification:** O(1) - Fixed number of threshold checks
- **Gradient Extraction:** O(1) - Regex match on fixed string
- **Body Part Iteration:** O(n) where n = 6 body parts
- **Pairwise Comparisons:** O(n²) where n = 6 → 15 comparisons
  - For gradient-gradient: 4 sub-comparisons → 60 total max
- **Overall:** O(n²) = O(36) = **Constant time** for fixed 6 body parts

**Optimization:** All calculations performed in-memory with no I/O. Typical execution time: <1ms.

### Caching Strategy

Beauty is **not cached** - recalculated on demand because:
- Calculation is fast (<1ms)
- Genetics can change (mutations toggle)
- Parrot object may be recreated on load
- Simplifies code (no cache invalidation)

---

## Future Enhancements

### Potential Improvements

1. **Perceptual Color Space**
   - Use LAB or HSL color space instead of RGB
   - Better alignment with human color perception
   - More accurate complementary color detection

2. **Pattern Bonuses**
   - Reward specific color patterns (e.g., split complementary)
   - Triadic color schemes
   - Analogous color schemes

3. **Rarity Integration**
   - Higher beauty for rare color combinations
   - Bonus for unlikely genetic patterns

4. **Player Customization**
   - Allow players to define "beauty standards"
   - Multiple contest types with different beauty criteria
   - Cultural/aesthetic preference modifiers

5. **Machine Learning**
   - Train model on player preferences
   - Predict "beautiful" combinations
   - Adaptive scoring based on community feedback

---

## Testing

### Unit Tests

**Location:** `public/test-modules.html`

The beauty calculation is tested through the Parrot class tests:

```javascript
// Test Case: Beauty calculation exists
const beauty = parrot.calculateBeauty();
console.assert(beauty.score >= 0, 'Beauty score should be non-negative');
console.assert(beauty.maxScore === 200, 'Max score should be 200');
console.assert(Array.isArray(beauty.traits), 'Should return traits array');
```

### Manual Testing Scenarios

1. **Monochrome Test:** All red → Should score low or 0
2. **Rainbow Test:** All different colors → Should score high (>100)
3. **Gradient Test:** All gradients → Should score medium-high (~80-100)
4. **Mixed Test:** All muddy colors → Should score 0
5. **Complementary Test:** Red + Cyan → Should get +18 bonus

---

## Common Questions

### Q: Why do some parrots with many colors score low?

**A:** Colors must be "beautiful" (pure, not mixed) AND work well together. Many similar colors get penalized. A parrot with 6 slightly different shades of brown will score lower than a parrot with 3 well-contrasted pure colors.

### Q: What's the highest possible beauty score?

**A:** Theoretical maximum is ~200, but practically achieving >180 is extremely rare and requires:
- Multiple beautiful gradients OR perfect complementary solid colors
- All 6 body parts with beautiful colors
- No similar color pairs
- High diversity bonus

### Q: Why do gradients score differently than solids?

**A:** Gradients get +10 immediately but are weighted down (0.5x-0.75x) in comparisons to avoid double-counting. The gradient gene adds visual complexity and breeding challenge.

### Q: Can a parrot have negative beauty?

**A:** No. The final score is `Math.max(0, beautyScore)`, so the floor is 0. However, internal calculations can go negative if many similar colors are present.

### Q: How do I breed high-beauty parrots?

**A:** Focus on:
1. Get pure colors (avoid mixed/muddy RGB values)
2. Aim for contrasting or complementary combinations
3. Use gradients for bonus points
4. Avoid breeding parrots with similar colors together
5. Diversity is rewarded - more unique colors is better

---

## Changelog

### Version 3.0 (November 2025)
- Implemented body-part RGB genetics system
- Added gradient support in beauty calculation
- Weighted comparisons for gradient pairs
- Per-part contribution tracking
- Maximum score increased to 200

### Version 2.x (Earlier)
- Original 6-gene color model
- Basic beauty calculation

---

## References

- **Main Implementation:** `public/js/parrot.js:186-463`
- **Contest Usage:** `public/js/contests.js:124`
- **Color Theory:** RGB dot product for color relationships
- **Genetics System:** See `/parrot-genetics-game/design/GENETICS_SYSTEM.md`
- **Contest System:** See `/parrot-genetics-game/design/GAMEPLAY_MECHANICS.md`

---

**Document Version:** 1.0
**Author:** Claude (based on codebase analysis)
**Last Updated:** November 13, 2025
