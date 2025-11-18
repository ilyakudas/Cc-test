# Beauty Scoring System - Color Wheel Edition

**ChromaWing Breeding Simulator**
**Version:** 4.0 (Color Wheel Redesign)
**Last Updated:** November 18, 2025

---

## Overview

The Color Wheel Beauty System represents a fundamental redesign of ChromaWing's beauty scoring, shifting from RGB vector mathematics to traditional artist's color theory using the **RYB (Red-Yellow-Blue) color wheel model**.

**Key Philosophy:** Beauty emerges from harmonious color relationships as understood by artists for centuries - complementary pairs, triadic schemes, analogous harmonies, and balanced saturation. The system evaluates parrots based on classical color theory principles rather than computational color space geometry.

**Maximum Score:** 300 points (increased from 200 to accommodate richer harmony scoring)

---

## Why RYB Color Wheel?

### Traditional RGB Model Limitations

The current RGB-based system has conceptual mismatches with human color perception:

1. **RGB Complementary Pairs Don't Match Art Theory**
   - RGB says: Red complements Cyan
   - Artists say: Red complements Green
   - RGB says: Blue complements Yellow ✓ (this one matches!)
   - RGB says: Green complements Magenta

2. **RGB Is Additive Light, Not Subtractive Pigment**
   - RGB: Used in screens (light mixing)
   - RYB: Used in painting (pigment mixing)
   - Parrots have pigments (feathers), not glowing pixels

3. **Perceptual Color Wheel ≠ RGB Space**
   - Human perception organizes colors in a circular wheel
   - RGB organizes colors in a cube
   - Angles on the wheel feel more natural for "opposite" and "adjacent"

### RYB Color Wheel Advantages

1. **Matches Traditional Art Education**
   - Red, Yellow, Blue primary colors
   - Orange, Green, Purple secondary colors
   - Complementary pairs artists actually use

2. **Intuitive Color Relationships**
   - Complementary: Red-Green, Yellow-Purple, Blue-Orange
   - Triadic: Red-Yellow-Blue, Orange-Green-Purple
   - Analogous: Red-Orange-Yellow, Blue-Green-Cyan

3. **Rich Harmony Vocabulary**
   - Monochromatic, Analogous, Complementary
   - Split-complementary, Triadic, Tetradic
   - Double-complementary, Square schemes

4. **Saturation & Value Awareness**
   - Pure colors vs pastels vs muted tones
   - Light vs dark colors
   - Intensity and vibrancy scoring

---

## Architecture

### New Implementation Structure

**Primary Module:**
- `public/js/lib/colorWheel.js` - NEW module
  - `rgbToRYBWheel(r, g, b)` → `{ hue, saturation, value }`
  - `calculateHarmony(colors)` → harmony type and score
  - `getComplementaryHue(hue)` → opposite hue on RYB wheel
  - `getColorName(hue, saturation, value)` → human-readable color

**Updated Modules:**
- `public/js/parrot.js`
  - `Parrot.calculateBeauty()` - Refactored to use color wheel
  - Remove `classifyColor()` and `colorDotProduct()`
  - Add `getBodyPartHueData()` - Extract HSV data per part

**Unchanged:**
- `public/js/contests.js` - Still uses `parrot.calculateBeauty()`
- Contest tiers updated with new score ranges

---

## Core Concepts

### 1. RGB to RYB Color Wheel Conversion

#### Step 1: RGB → RYB Hue Mapping

The RYB color wheel maps colors to angles (0-360°):

```
RYB Wheel Position:
  0° = Red
 30° = Red-Orange
 60° = Orange
 90° = Yellow-Orange
120° = Yellow
150° = Yellow-Green
180° = Green
210° = Blue-Green
240° = Blue
270° = Blue-Purple
300° = Purple
330° = Red-Purple
360° = Red (wraps)
```

**Conversion Algorithm:**

```javascript
function rgbToRYBWheel(r, g, b) {
    // Step 1: Normalize RGB to 0-1
    const rn = r / 255;
    const gn = g / 255;
    const bn = b / 255;

    // Step 2: Calculate RGB hue (standard HSV)
    const max = Math.max(rn, gn, bn);
    const min = Math.min(rn, gn, bn);
    const delta = max - min;

    let rgbHue = 0;
    if (delta !== 0) {
        if (max === rn) {
            rgbHue = 60 * (((gn - bn) / delta) % 6);
        } else if (max === gn) {
            rgbHue = 60 * (((bn - rn) / delta) + 2);
        } else {
            rgbHue = 60 * (((rn - gn) / delta) + 4);
        }
    }
    if (rgbHue < 0) rgbHue += 360;

    // Step 3: Map RGB hue to RYB hue using lookup table
    const rybHue = rgbHueToRYBHue(rgbHue);

    // Step 4: Calculate saturation and value (standard HSV)
    const saturation = max === 0 ? 0 : delta / max;
    const value = max;

    return { hue: rybHue, saturation, value };
}
```

**RGB to RYB Hue Mapping Table:**

This corrects RGB's color wheel to match traditional art theory:

| RGB Hue | RGB Color | RYB Hue | RYB Color |
|---------|-----------|---------|-----------|
| 0° | Red | 0° | Red |
| 60° | Yellow | 120° | Yellow |
| 120° | Green | 180° | Green |
| 180° | Cyan | 210° | Blue-Green |
| 240° | Blue | 240° | Blue |
| 300° | Magenta | 330° | Red-Purple |

**Implementation uses piecewise linear interpolation** between these anchor points.

#### Step 2: Saturation & Value Calculation

Standard HSV calculations:

- **Saturation (S):** How pure/intense the color is (0 = gray, 1 = pure)
- **Value (V):** How light/dark the color is (0 = black, 1 = full brightness)

```javascript
const saturation = max === 0 ? 0 : (max - min) / max;
const value = max;  // max of (r, g, b) normalized
```

#### Step 3: Color Classification

Colors are classified based on HSV values:

```javascript
function classifyColor(hue, saturation, value) {
    // Black/White/Gray (achromatic)
    if (saturation < 0.15) {
        if (value < 0.2) return { category: 'black', beauty: 2 };
        if (value > 0.8) return { category: 'white', beauty: 2 };
        return { category: 'gray', beauty: 0 };  // Gray is not beautiful
    }

    // Muddy/Muted (low saturation, medium value)
    if (saturation < 0.4 && value < 0.6) {
        return { category: 'muddy', beauty: 0 };
    }

    // Pastel (low saturation, high value)
    if (saturation < 0.5 && value > 0.7) {
        const colorName = getColorName(hue);
        return { category: 'pastel', name: `pastel-${colorName}`, beauty: 5 };
    }

    // Dark (high saturation, low value)
    if (saturation > 0.5 && value < 0.4) {
        const colorName = getColorName(hue);
        return { category: 'dark', name: `dark-${colorName}`, beauty: 6 };
    }

    // Pure/Vivid (high saturation, high value)
    if (saturation > 0.6 && value > 0.6) {
        const colorName = getColorName(hue);
        return { category: 'vivid', name: colorName, beauty: 10 };
    }

    // Medium (everything else)
    const colorName = getColorName(hue);
    return { category: 'medium', name: colorName, beauty: 4 };
}
```

**Beauty Value Hierarchy:**
- Vivid/Pure colors: 10 points (most beautiful)
- Dark colors: 6 points (rich and dramatic)
- Pastels: 5 points (soft and pleasing)
- Medium: 4 points (average)
- Black/White: 2 points (neutral)
- Gray/Muddy: 0 points (not beautiful)

---

### 2. Color Harmony Detection

The heart of the new system: detecting **color harmony schemes** across body parts.

#### Harmony Types & Scoring

##### 1. Monochromatic (Same Hue, Varied S/V)

**Definition:** All colors share the same hue (±15°) but differ in saturation/value

**Score:** +20 base + up to +15 for variety

```javascript
// Example: All red-based
// - Wings: Vivid Red (H:0°, S:0.9, V:0.9)
// - Body: Dark Red (H:5°, S:0.8, V:0.4)
// - Head: Pastel Red (H:358°, S:0.3, V:0.85)

if (hueRange < 15 && saturationRange > 0.3) {
    score += 20;
    traits.push("Monochromatic harmony (+20)");

    // Bonus for diverse saturation/value
    if (saturationRange > 0.5 || valueRange > 0.5) {
        score += 15;
        traits.push("Excellent tonal variety (+15)");
    }
}
```

**Best For:** Elegant, sophisticated parrots
**Example:** All shades of blue from navy to sky blue

---

##### 2. Analogous (Adjacent Colors, 30° Range)

**Definition:** Colors adjacent on wheel, typically 2-4 neighbors

**Score:** +35 base + up to +10 for smooth transitions

```javascript
// Example: Warm harmony
// - Wings: Red (0°)
// - Body: Orange (60°)
// - Head: Yellow (120°)

const hueRange = maxHue - minHue;
if (hueRange >= 30 && hueRange <= 90) {
    score += 35;
    traits.push("Analogous harmony (+35)");

    // Bonus for smooth progression
    if (hasSequentialHues(colors)) {
        score += 10;
        traits.push("Smooth color flow (+10)");
    }
}
```

**Best For:** Natural, harmonious parrots
**Examples:**
- Cool: Blue → Blue-Green → Green
- Warm: Red → Orange → Yellow

---

##### 3. Complementary (Opposite Colors, 180° Apart)

**Definition:** Two colors directly opposite on wheel

**Score:** +50 base + up to +20 for balance

```javascript
// Example: Classic complements
// - Wings, Body, Head: Red (0°)
// - Tail, Accents, Special: Green (180°)

const complement = (hue + 180) % 360;
if (hasColorPair(colors, hue, complement, tolerance=15)) {
    score += 50;
    traits.push("Complementary harmony: Red & Green (+50)");

    // Bonus for balanced distribution
    if (countInRange(hue) === countInRange(complement)) {
        score += 20;
        traits.push("Perfect complementary balance (+20)");
    }
}
```

**Best For:** Striking, high-contrast parrots
**Classic Pairs:**
- Red (0°) ↔ Green (180°)
- Yellow (120°) ↔ Purple (300°)
- Blue (240°) ↔ Orange (60°)

---

##### 4. Split-Complementary (Base + Two Adjacent to Complement)

**Definition:** One base color + the two colors adjacent to its complement

**Score:** +55

```javascript
// Example:
// - Wings: Red (0°)
// - Body: Yellow-Green (150°) [next to Green 180°]
// - Head: Blue-Green (210°) [next to Green 180°]

const complement = (baseHue + 180) % 360;
const splitA = (complement - 30 + 360) % 360;
const splitB = (complement + 30) % 360;

if (hasColorTriad(colors, baseHue, splitA, splitB)) {
    score += 55;
    traits.push("Split-complementary harmony (+55)");
}
```

**Best For:** Sophisticated contrast without jarring opposites
**Example:** Blue with Red-Orange and Yellow-Orange

---

##### 5. Triadic (Three Colors, 120° Apart)

**Definition:** Three colors evenly spaced around the wheel

**Score:** +60 base + up to +20 for primary/secondary triads

```javascript
// Example: Primary triad
// - Wings, Body: Red (0°)
// - Head, Tail: Yellow (120°)
// - Accents, Special: Blue (240°)

if (hasTriad(colors, 120)) {
    score += 60;
    traits.push("Triadic harmony (+60)");

    // Bonus for primary triad (R-Y-B)
    if (isPrimaryTriad(colors)) {
        score += 20;
        traits.push("Primary triad (R-Y-B) (+20)");
    }

    // Bonus for secondary triad (O-G-P)
    if (isSecondaryTriad(colors)) {
        score += 20;
        traits.push("Secondary triad (O-G-P) (+20)");
    }
}
```

**Best For:** Vibrant, balanced parrots
**Classic Triads:**
- Primary: Red, Yellow, Blue
- Secondary: Orange, Green, Purple

---

##### 6. Tetradic/Square (Four Colors, 90° Apart)

**Definition:** Four colors evenly spaced around the wheel

**Score:** +70

```javascript
// Example:
// - Wings: Red (0°)
// - Body: Yellow-Orange (90°)
// - Head: Green (180°)
// - Tail: Blue-Purple (270°)

if (hasTetrad(colors, 90)) {
    score += 70;
    traits.push("Square/Tetradic harmony (+70)");
}
```

**Best For:** Complex, bold parrots
**Example:** Red, Yellow-Orange, Green, Blue-Purple

---

##### 7. Double-Complementary (Two Complementary Pairs)

**Definition:** Two complementary pairs (rectangle on wheel)

**Score:** +65

```javascript
// Example:
// - Wings: Red (0°) & Body: Green (180°)
// - Head: Yellow (120°) & Tail: Purple (300°)

if (hasDoubleComplementary(colors)) {
    score += 65;
    traits.push("Double-complementary harmony (+65)");
}
```

**Best For:** Balanced complexity
**Example:** Red-Green + Yellow-Purple

---

### 3. Additional Scoring Factors

#### Saturation Coherence (+15 max)

Reward parrots with consistent saturation levels:

```javascript
const avgSaturation = mean(saturations);
const saturationVariance = variance(saturations);

if (saturationVariance < 0.05) {
    score += 15;
    traits.push("Consistent saturation (+15)");
} else if (saturationVariance < 0.1) {
    score += 8;
    traits.push("Fairly consistent saturation (+8)");
}
```

**Rationale:** Parrots with all vivid OR all pastel colors look more cohesive than random mix.

#### Value Contrast (+20 max)

Reward parrots with good light/dark contrast:

```javascript
const valueRange = max(values) - min(values);

if (valueRange > 0.6) {
    score += 20;
    traits.push("Excellent light/dark contrast (+20)");
} else if (valueRange > 0.4) {
    score += 10;
    traits.push("Good value contrast (+10)");
}
```

**Rationale:** Visual interest comes from contrast between light and dark areas.

#### Gradient Harmony Bonus (+15 per gradient)

Gradients that transition through harmonious hues:

```javascript
// For gradient from startHue to endHue
const hueDifference = angleDifference(startHue, endHue);

if (hueDifference >= 30 && hueDifference <= 90) {
    score += 15;
    traits.push(`Harmonious gradient: ${part} (+15)`);
} else if (hueDifference >= 150 && hueDifference <= 210) {
    score += 12;
    traits.push(`Complementary gradient: ${part} (+12)`);
} else if (hueDifference < 15) {
    score += 5;
    traits.push(`Subtle gradient: ${part} (+5)`);
}
```

**Types:**
- Analogous gradients (30-90°): +15 (e.g., red → orange)
- Complementary gradients (150-210°): +12 (e.g., red → green)
- Subtle gradients (<15°): +5 (e.g., red → dark red)
- Chaotic gradients (other): +0

#### Pure Color Bonus (+8 per vivid color)

Reward highly saturated, high-value colors:

```javascript
for (const color of colors) {
    if (color.saturation > 0.7 && color.value > 0.7) {
        score += 8;
        traits.push(`Vivid color: ${color.name} (+8)`);
    }
}
```

**Max Contribution:** 6 parts × 8 = 48 points

---

## Beauty Calculation Algorithm

### Complete Flow

```javascript
calculateBeauty() {
    let beautyScore = 0;
    const traits = [];

    // Step 1: Extract HSV data for all body parts
    const bodyParts = ['wings', 'special_wing', 'body', 'head', 'tail', 'accents'];
    const colorData = [];

    for (const part of bodyParts) {
        const color = this.calculateBodyPartColor(part);
        const hsv = rgbToRYBWheel(color.r, color.g, color.b);
        const classification = classifyColor(hsv.hue, hsv.saturation, hsv.value);

        colorData.push({
            part,
            hue: hsv.hue,
            saturation: hsv.saturation,
            value: hsv.value,
            name: classification.name,
            category: classification.category,
            beautyValue: classification.beautyValue,
            isGradient: color.isGradient,
            gradientStart: color.isGradient ? rgbToRYBWheel(color.startR, color.startG, color.startB) : null,
            gradientEnd: color.isGradient ? rgbToRYBWheel(color.endR, color.endG, color.endB) : null
        });
    }

    // Step 2: Score individual colors
    for (const color of colorData) {
        beautyScore += color.beautyValue;
        if (color.beautyValue > 0) {
            traits.push(`${color.category} ${color.name}: ${color.part} (+${color.beautyValue})`);
        }
    }

    // Step 3: Detect and score harmony schemes
    const harmony = detectHarmony(colorData);
    beautyScore += harmony.score;
    traits.push(...harmony.traits);

    // Step 4: Score gradients
    for (const color of colorData.filter(c => c.isGradient)) {
        const gradientScore = scoreGradient(color.gradientStart, color.gradientEnd);
        beautyScore += gradientScore.score;
        traits.push(...gradientScore.traits);
    }

    // Step 5: Saturation coherence
    const saturations = colorData.map(c => c.saturation);
    const satScore = scoreSaturationCoherence(saturations);
    beautyScore += satScore.score;
    traits.push(...satScore.traits);

    // Step 6: Value contrast
    const values = colorData.map(c => c.value);
    const valueScore = scoreValueContrast(values);
    beautyScore += valueScore.score;
    traits.push(...valueScore.traits);

    // Step 7: Pure color bonus
    for (const color of colorData) {
        if (color.saturation > 0.7 && color.value > 0.7) {
            beautyScore += 8;
            traits.push(`Vivid color: ${color.part} (+8)`);
        }
    }

    // Step 8: Ensure non-negative
    beautyScore = Math.max(0, beautyScore);

    return {
        score: beautyScore,
        maxScore: 300,
        traits,
        harmony: harmony.type,
        colorData,
        breakdown: {
            individualColors: colorData.reduce((sum, c) => sum + c.beautyValue, 0),
            harmonyBonus: harmony.score,
            gradientBonus: /* calculated */,
            saturationBonus: satScore.score,
            valueBonus: valueScore.score,
            pureColorBonus: /* calculated */
        }
    };
}
```

---

## Scoring Examples

### Example 1: Perfect Triadic (Primary Colors)

**Genetics:**
- Wings, Body: Vivid Red (H:0°, S:0.9, V:0.9)
- Head, Tail: Vivid Yellow (H:120°, S:0.9, V:0.9)
- Accents, Special: Vivid Blue (H:240°, S:0.9, V:0.9)

**Scoring Breakdown:**

1. **Individual colors:** 6 × 10 (vivid) = **+60**
2. **Triadic harmony:** R-Y-B = **+60**
3. **Primary triad bonus:** = **+20**
4. **Pure color bonus:** 6 × 8 = **+48**
5. **Saturation coherence:** All ~0.9 = **+15**
6. **Value contrast:** All high ~0.9 = **+0** (no contrast)

**Total:** 60 + 60 + 20 + 48 + 15 = **203 points**

---

### Example 2: Complementary Excellence

**Genetics:**
- Wings, Body, Head: Vivid Red (H:0°, S:0.9, V:0.9)
- Tail, Accents, Special: Vivid Green (H:180°, S:0.9, V:0.8)

**Scoring Breakdown:**

1. **Individual colors:** 6 × 10 = **+60**
2. **Complementary harmony:** Red & Green = **+50**
3. **Perfect balance:** 3 vs 3 = **+20**
4. **Pure color bonus:** 6 × 8 = **+48**
5. **Saturation coherence:** All ~0.9 = **+15**

**Total:** 60 + 50 + 20 + 48 + 15 = **193 points**

---

### Example 3: Analogous Gradient Beauty

**Genetics:**
- Wings: Red → Orange gradient (0° → 60°)
- Body: Orange → Yellow gradient (60° → 120°)
- Head: Yellow solid (120°)
- Others: Muddy/mixed

**Scoring Breakdown:**

1. **Individual colors:**
   - 2 vivid colors in gradients: 4 × 10 = **+40**
   - 1 vivid solid: **+10**
2. **Analogous harmony:** Red-Orange-Yellow = **+35**
3. **Smooth flow:** = **+10**
4. **Gradient bonuses:** 2 × 15 (analogous) = **+30**
5. **Pure color bonus:** 5 colors × 8 = **+40**

**Total:** 40 + 10 + 35 + 10 + 30 + 40 = **165 points**

---

### Example 4: Monochromatic Elegance

**Genetics:**
- Wings: Dark Red (H:0°, S:0.8, V:0.3)
- Body: Vivid Red (H:5°, S:0.9, V:0.9)
- Head: Pastel Red (H:358°, S:0.4, V:0.85)
- Others: Mixed

**Scoring Breakdown:**

1. **Individual colors:**
   - Dark: **+6**
   - Vivid: **+10**
   - Pastel: **+5**
2. **Monochromatic harmony:** = **+20**
3. **Tonal variety:** S and V range > 0.5 = **+15**
4. **Value contrast:** 0.9 - 0.3 = 0.6 = **+20**
5. **Pure color bonus:** 1 vivid × 8 = **+8**

**Total:** 21 + 20 + 15 + 20 + 8 = **84 points**

---

### Example 5: Chaotic Mess (Low Score)

**Genetics:**
- All parts: Muddy/gray colors (low S, medium V)

**Scoring Breakdown:**

1. **Individual colors:** 6 × 0 = **+0**
2. **No harmony detected:** = **+0**
3. **No gradients:** = **+0**
4. **No coherence or contrast:** = **+0**

**Total:** **0 points**

---

## Theoretical Maximum Score

**Absolute Maximum:** ~300 points

**Breakdown:**

1. **Individual colors:** 6 × 10 (vivid) = **60**
2. **Harmony:** Tetradic = **70** (highest)
3. **Pure color bonus:** 6 × 8 = **48**
4. **Saturation coherence:** **15**
5. **Value contrast:** **20**
6. **Gradients:** 6 × 15 (analogous) = **90** *(theoretical, conflicts with harmony)*

**Realistic Maximum:** ~230-250 points

Achieving 300 is impossible because:
- Can't have both perfect tetrad AND all analogous gradients
- Some bonuses are mutually exclusive
- Random genetics rarely produces perfect harmony

**Achievable High Scores:**
- 200+: Excellent (top 5% of parrots)
- 180-200: Very good (top 15%)
- 150-180: Good (top 30%)
- 100-150: Average
- <100: Below average

---

## Implementation Checklist

### Phase 1: Core Color Wheel Module

- [ ] Create `public/js/lib/colorWheel.js`
- [ ] Implement `rgbToRYBWheel(r, g, b)`
- [ ] Build RGB→RYB hue mapping lookup table
- [ ] Implement `classifyColor(hue, sat, val)`
- [ ] Implement `getColorName(hue)` with 12-step wheel
- [ ] Write unit tests for color conversions

### Phase 2: Harmony Detection

- [ ] Implement `detectHarmony(colorData)`
- [ ] Add harmony detection functions:
  - [ ] `detectMonochromatic()`
  - [ ] `detectAnalogous()`
  - [ ] `detectComplementary()`
  - [ ] `detectSplitComplementary()`
  - [ ] `detectTriadic()`
  - [ ] `detectTetradic()`
  - [ ] `detectDoubleComplementary()`
- [ ] Add helper functions for angle calculations

### Phase 3: Refactor Parrot Beauty Calculation

- [ ] Update `public/js/parrot.js`
- [ ] Remove old `classifyColor()` and `colorDotProduct()`
- [ ] Implement new `calculateBeauty()` using color wheel
- [ ] Add `getBodyPartHueData()` helper
- [ ] Update gradient scoring logic
- [ ] Test with existing parrots

### Phase 4: Additional Scoring Features

- [ ] Implement `scoreSaturationCoherence()`
- [ ] Implement `scoreValueContrast()`
- [ ] Implement `scoreGradient()`
- [ ] Add pure color bonus calculation

### Phase 5: UI Updates

- [ ] Update beauty score display to show harmony type
- [ ] Add color wheel visualization to parrot cards (optional)
- [ ] Update contest descriptions to mention harmonies
- [ ] Add "Learn about color harmony" help section

### Phase 6: Contest Tier Rebalancing

- [ ] Update contest tier score ranges for 0-300 scale:
  - Beginner: 0-60
  - Rainbow: 40-120
  - Gradient Masters: 100-180
  - Contrast Kings: 150-220
  - Elite Grand Prix: 200-280
- [ ] Test AI opponent generation with new ranges

### Phase 7: Testing & Validation

- [ ] Create test parrots for each harmony type
- [ ] Verify scoring consistency
- [ ] Compare old vs new system on existing parrots
- [ ] Document breaking changes
- [ ] Update all documentation

### Phase 8: Documentation

- [ ] Update `BEAUTY_SYSTEM.md` (or replace with this doc)
- [ ] Update `GAME_DESIGN.md`
- [ ] Add color wheel diagrams
- [ ] Update `CHANGELOG.md`
- [ ] Write migration guide for players

---

## Migration Notes

### Breaking Changes

1. **Score Scale:** 0-200 → 0-300
   - Existing high scores will feel relatively lower
   - Contest tiers must be rebalanced

2. **Color Perception:** RGB complements → RYB complements
   - Red-Cyan parrots (good in old system) → lower scores
   - Red-Green parrots (bad in old system) → higher scores

3. **Scoring Philosophy:** Vector math → Artistic harmony
   - Diverse random colors → lower scores (unless they form harmony)
   - Cohesive color schemes → much higher scores

### Migration Strategy

**Option A: Hard Cutover**
- Deploy new system all at once
- Accept that existing scores will change
- Communicate changes to players clearly

**Option B: Dual System (Recommended)**
- Run both systems for 1-2 weeks
- Show both scores: "Classic: 127 | Harmony: 156"
- Let players adjust breeding strategies
- Fully switch after transition period

**Option C: Score Conversion**
- Apply conversion factor: `newScore ≈ oldScore × 1.3`
- Attempt to preserve relative rankings
- Adjust harmony bonuses to match old score distribution

**Recommendation:** Use Option B for smoother player experience.

---

## Advantages Over Old System

### 1. Intuitive Color Relationships

Players familiar with art/design will immediately recognize:
- Red and green are opposites ✓
- Blue and orange are opposites ✓
- Red-orange-yellow are neighbors ✓

### 2. Named Harmony Schemes

Instead of vague "complementary" messages, players see:
- "Triadic harmony: Red-Yellow-Blue"
- "Split-complementary: Blue with Red-Orange & Yellow-Orange"
- "Analogous harmony: Cool blues and greens"

### 3. Educational Value

Players learn real color theory:
- Primary vs secondary colors
- Warm vs cool colors
- Saturation and value concepts

### 4. Strategic Depth

Breeding strategies become clearer:
- "I need a blue parrot to complete my triadic scheme"
- "I should breed for consistent saturation"
- "I want complementary colors with high value contrast"

### 5. Richer Feedback

Beauty traits explain scores better:
- "Analogous harmony: Red-Orange-Yellow (+35)"
- "Excellent light/dark contrast (+20)"
- "Consistent saturation (+15)"

### 6. Flexibility for Variants

Easy to add contest variants:
- "Pastel Paradise" - only pastels score
- "Vivid Victory" - only vivid colors score
- "Monochrome Masters" - monochromatic harmony only

---

## Performance Considerations

### Computational Complexity

- **RGB → RYB conversion:** O(1) lookup + interpolation
- **Harmony detection:** O(n²) pairwise comparisons (n=6 body parts)
- **Overall:** Still O(36) = **constant time**

### Optimization Opportunities

1. **Cache hue conversions:** RGB→RYB mapping can be memoized
2. **Precompute harmony templates:** Store angle patterns for each type
3. **Early exit:** Stop at first detected harmony (if only one needed)

**Expected Performance:** <2ms per calculation (vs <1ms in old system)

---

## Future Enhancements

### Contest Variants

1. **Monochrome Masters:** Only monochromatic harmony scores
2. **Complementary Clash:** Only complementary harmony scores
3. **Triadic Titans:** Only triadic harmony scores (bonus for primary/secondary)
4. **Pastel Perfection:** Only pastel colors score
5. **Vivid Victory:** Only vivid colors score, extra for saturated schemes

### Advanced Features

1. **Color Wheel Visualization:**
   - Show parrot's colors plotted on wheel
   - Draw lines connecting colors to show harmony

2. **Breeding Suggestions:**
   - "Breed with a green parrot to achieve complementary harmony"
   - "Add yellow to form a triadic scheme"

3. **Harmony Badges:**
   - Special badges for achieving specific harmonies
   - "Master of Triads" - breed 10 triadic parrots
   - "Complementary Champion" - win contest with complementary scheme

4. **Player Preferences:**
   - Let players favor certain harmonies
   - Custom scoring weights
   - "I prefer warm analogous schemes"

5. **Seasonal Events:**
   - "Autumn Harmony" - bonus for warm analogous (red-orange-yellow)
   - "Ocean Blues" - bonus for cool analogous (cyan-blue-purple)

---

## References

### Color Theory

- **RYB Color Model:** Traditional artist's color wheel (subtractive mixing)
- **Harmony Types:** Classical art theory (Itten, Munsell)
- **HSV Color Space:** Hue-Saturation-Value cylindrical model

### Implementation Resources

- RGB to RYB conversion: Based on Gossett & Chen (2004) paint mixing model
- Color harmony detection: Traditional art education principles
- Angle calculations: Circular distance on hue wheel

### External Reading

- "The Art of Color" by Johannes Itten
- "Color and Light: A Guide for the Realist Painter" by James Gurney
- "Interaction of Color" by Josef Albers

---

## Appendix: RYB Hue Lookup Table

Complete RGB→RYB mapping (interpolate between points):

| RGB Hue | RGB Color | → | RYB Hue | RYB Color |
|---------|-----------|---|---------|-----------|
| 0° | Pure Red | → | 0° | Red |
| 15° | Red-Orange | → | 8° | Red-Orange |
| 30° | Orange-Red | → | 17° | Red-Orange |
| 45° | Orange | → | 45° | Orange |
| 60° | Yellow (RGB) | → | 120° | Yellow (RYB) |
| 75° | Yellow-Green | → | 135° | Yellow-Green |
| 90° | Green-Yellow | → | 150° | Yellow-Green |
| 105° | Green-Yellow | → | 165° | Green-Yellow |
| 120° | Pure Green (RGB) | → | 180° | Green (RYB) |
| 135° | Green-Cyan | → | 195° | Green-Blue |
| 150° | Cyan-Green | → | 210° | Blue-Green |
| 165° | Cyan | → | 225° | Blue-Green |
| 180° | Pure Cyan (RGB) | → | 240° | Blue (RYB) |
| 195° | Cyan-Blue | → | 255° | Blue |
| 210° | Blue-Cyan | → | 270° | Blue-Purple |
| 225° | Blue | → | 285° | Blue-Purple |
| 240° | Pure Blue (RGB) | → | 240° | Blue (RYB) |
| 255° | Blue-Magenta | → | 285° | Blue-Purple |
| 270° | Purple-Blue | → | 300° | Purple |
| 285° | Purple | → | 315° | Red-Purple |
| 300° | Magenta (RGB) | → | 330° | Red-Purple |
| 315° | Magenta-Red | → | 345° | Red-Purple |
| 330° | Red-Magenta | → | 352° | Red |
| 345° | Red-Magenta | → | 356° | Red |
| 360° | Pure Red | → | 0° | Red |

**Usage:** For any RGB hue between two points, use linear interpolation to find the corresponding RYB hue.

---

**Document Version:** 1.0
**Author:** Claude
**Last Updated:** November 18, 2025
