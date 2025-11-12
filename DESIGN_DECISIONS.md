# ChromaWing Breeding Simulator - Design Decisions
## v3.0 - November 2025

---

## Table of Contents
1. [Version & Cache Management](#version--cache-management)
2. [Achievement System & Win Conditions](#achievement-system--win-conditions)
3. [Full Genotype Achievement](#full-genotype-achievement)
4. [Mutation System](#mutation-system)
5. [Gene Source Limitations (Future)](#gene-source-limitations-future)
6. [Rare Contest Parrot System](#rare-contest-parrot-system)
7. [Beauty vs Rarity Color Schemes](#beauty-vs-rarity-color-schemes)
8. [DNA Display Format](#dna-display-format)

---

## Version & Cache Management

### Problem
Players experiencing cache issues - browser not loading new JavaScript updates.

### Solution
- **Updated version** from v2.1 to v3.0
- Version displayed in three places:
  - JavaScript file comment: `// ChromaWing Breeding Simulator - RGB Genetics v3.0`
  - HTML title: `<title>ChromaWing Breeding Simulator - RGB Genetics v3.0</title>`
  - HTML header: `<p>RGB Genetics v3.0 - Achievements, Contests & Mutations`

### Rationale
- Major version bump (2.1 → 3.0) reflects significant feature additions
- Multiple version displays ensure users know what version they're running
- Browser should recognize version change and invalidate cached files

---

## Achievement System & Win Conditions

### Problem
Game needed clear goals and "win" conditions for player satisfaction.

### Solution
Implemented **15+ achievements** across 5 categories with **4 win conditions**:

**Contest Achievements:**
- First Steps, Contest Master, Perfect Champion
- **Elite Champion** (WIN CONDITION): Win 1st place in Elite Grand Prix

**Breeding/Beauty Achievements:**
- Beauty Enthusiast (100+), Master Breeder (150+)
- **Perfection Achieved** (WIN CONDITION): 200 beauty score
- Gradient Collector (all 6 body parts)

**Collection Achievements:**
- Aviary Starter (10 parrots), Aviary Expert (25 parrots)
- Rarity Collector (one of each rarity)
- **Geneticist** (WIN CONDITION): Full Genotype collection

**Generation & Economic:**
- Lineage Builder (Gen 5), Dynasty Creator (Gen 10)
- Entrepreneur (1000 coins), Business Mogul (5000 coins)

**Ultimate:**
- **Ultimate Master** (WIN CONDITION): Unlock all other achievements

### Rationale
- Multiple win conditions cater to different play styles:
  - **Contest-focused**: Elite Champion
  - **Perfection-focused**: Perfect Parrot (200 beauty)
  - **Collection-focused**: Full Genotype
  - **Completionist**: All Achievements
- Players can "win" in multiple ways and continue playing
- Win modal celebrates achievements without forcing game end

---

## Full Genotype Achievement

### Problem (Identified by User)
Original implementation was too easy:
- Required only 4 different values (0-4) for each color/part
- Could be achieved with 2 extreme parrots:
  - One all-white (4,4,4 for R,G,B on all parts)
  - One all-black (0,0,0 for R,G,B on all parts)
  - Breeding them gives 1, 2, 3 dominant counts
  - Total: 2 parrots + offspring = achievement

### Solution
**Changed requirement from 4 to ALL 5 values (0, 1, 2, 3, 4)** for each RGB on each body part:
```javascript
// Old: if (values.size < 4) return false;
// New: if (values.size < 5) return false;
```

### Rationale
- Requires **18 complete sets** (6 body parts × 3 colors = 18 sets)
- Each set must have ALL 5 values (0, 1, 2, 3, 4 dominant alleles)
- **Cannot be cheesed** with just 2 extreme parrots:
  - Breeding white (4444) × black (0000) gives offspring with 2 dominant count on average
  - Getting reliable 1s and 3s requires intentional breeding strategies
  - Requires diverse gene pool and multiple breeding lines
- Achievable but challenging - true "Geneticist" accomplishment

---

## Mutation System

### Problem
Early game gene pool limitations:
- Store and starting parrots have limited gene diversity
- Players can't expand beyond initial gene combinations
- BUT late game needs gene purity preservation for "perfect specimens"

### Solution
**Mutation system with toggle**:

**Implementation:**
- `mutationsEnabled`: Boolean flag (default: true)
- `mutationRate`: 0.05 (5% chance per allele per breed)
- Applied in `breedBodyPart()` function after inheritance
- Each allele (red, green, blue) can flip: true ↔ false
- Gradient can also mutate

**User Control:**
- Clickable stat badge in header shows mutation status
- Icon changes: 🧪 (ON) / 🔒 (OFF)
- Color-coded: Green (ON) / Red (OFF)
- Toast notification on toggle
- Persists in save/load system

**Breeding Logic:**
```javascript
// After inheriting from parents
if (mutationsEnabled) {
    if (Math.random() < mutationRate) redAllele = !redAllele;
    if (Math.random() < mutationRate) greenAllele = !greenAllele;
    if (Math.random() < mutationRate) blueAllele = !blueAllele;
}
```

### Rationale
**Early Game (Mutations ON):**
- Expands gene pool beyond store offerings
- Introduces genetic diversity naturally
- Players can access gene combinations not available in shop/contests
- 5% rate is noticeable but not overwhelming

**Late Game (Mutations OFF):**
- Preserves "perfect specimen" purity
- Allows breeding of consistent lineages
- Prevents accidental corruption of prized genes
- Essential for achieving specific beauty scores or color patterns

### Future Considerations
- Could add achievement for discovering first mutation
- Could add mutation rate slider for advanced players
- Could track mutation count per parrot for genetics enthusiasts

---

## Gene Source Limitations (Future Feature)

### Design Concept
Limit which specific alleles can come from which sources to increase strategic depth.

### Examples (User-Provided)
- **Shop**: R4 (4th red allele position) in accents only available from store
- **Contests**: G1 (1st green allele position) in tail only from contest rewards
- **Mutations**: Can introduce any allele position

### Proposed Implementation

**Option A: Source-Restricted Gene Pools**
```javascript
const GENE_SOURCE_RULES = {
    store: {
        accents: { red: [0, 1, 2, 3] }  // Position 3 (R4) restricted to store
    },
    contest: {
        tail: { green: [0] }  // Position 0 (G1) restricted to contests
    },
    mutation: 'all'  // Mutations can affect any position
};
```

**Option B: Per-Parrot Source Tracking**
- Track source for each parrot: `{source: 'store' | 'bred' | 'contest_rare'}`
- Store parrots generated with specific patterns
- Contest parrots have different patterns
- Bred parrots inherit from parents
- Mutations can introduce restricted patterns

### Rationale
**Pros:**
- Adds strategic layer: "Need R4 on accents? Must buy from store"
- Makes different sources valuable throughout game
- Encourages diverse collection strategies
- Contests become necessary for specific genes

**Cons:**
- Complex to implement and communicate to players
- Could be frustrating if player doesn't understand why they can't get certain genes
- Requires careful balancing to avoid creating "impossible" breeding goals

**Decision: DEFERRED**
- System designed but not implemented
- Needs user testing and feedback
- Could be added as "Hard Mode" or "Geneticist Mode"
- Current open gene pool is more beginner-friendly

---

## Rare Contest Parrot System

### Design Philosophy
**Progression-Oriented Rewards**: Each tier's rewards should help meet NEXT tier's requirements.

### Tier Structure
- **Tier 0** (Beginner): Rewards have multiple SOLID COLORS
  → Helps meet Tier 1's "3+ colors" requirement

- **Tier 1** (Rainbow): Rewards have GRADIENTS
  → Helps meet Tier 2's "2+ gradients" requirement

- **Tier 2** (Gradient Masters): Rewards have COMPLEMENTARY COLORS
  → Helps meet Tier 3's "complementary colors" requirement

- **Tier 3** (Contrast): Rewards have GRADIENTS + COMPLEMENTARY
  → Helps meet Tier 4's combined requirement

- **Tier 4** (Elite): ULTIMATE PARROTS with perfect genes
  → Required for endgame, cannot be bred

### Choice System
Players choose: **Coins OR Rare Parrot**

**Design Rationale:**
- Same rare parrot given each time per tier/placement
- Makes choice meaningful: "I already have it, take coins instead"
- Sell value always less than coin reward
- Encourages taking parrot first time, coins after

### Example (User Correction)
**Original Tier 0 Design:** Had gradient on tail
**Corrected:** No gradients at all - only solid colors
**Reason:** Tier 0 rewards should NOT have what Tier 1 requires

---

## Beauty vs Rarity Color Schemes

### Problem
Beauty and Rarity badges used same/similar color schemes, causing confusion.

### Solution
**Rarity** (genetic purity) - Gray scale and traditional MMO colors:
- Common: Gray `#9e9e9e`
- Uncommon: Green `#4caf50`
- Rare: Blue `#2196f3`
- Epic: Purple `#9c27b0`
- Legendary: Orange/Gold `#ff9800`

**Beauty** (aesthetic score) - Cool to warm thermal spectrum:
- 0-40: Blue-gray (cold) `#607d8b`
- 40-80: Cyan `#00bcd4`
- 80-130: Amber/Yellow `#ffc107`
- 130-180: Deep Orange `#ff5722`
- 180+: Hot Pink `#e91e63`

### Rationale
- **Distinct visual identities**: Rarity is traditional MMO colors, Beauty is thermal spectrum
- **Intuitive meanings**: "Cold" colors for low beauty, "hot" colors for high beauty
- **No overlap**: No color appears in both systems
- **Accessibility**: Different hues aid colorblind players

---

## DNA Display Format

### Problem
Players wanted **concise, parseable** genotype format for external tools.

### Solution
**Two formats** in Laboratory display:

**1. Human-Readable:**
```
W:320* S:410 B:004 H:331 T:240* A:103
```
- Part abbreviations: W=Wings, S=Special, B=Body, H=Head, T=Tail, A=Accents
- Three digits: R/G/B dominant counts (0-4)
- Asterisk (*): Has gradient

**2. Machine-Parseable:**
```
3201-4100-0040-3310-2401-1030
```
- Four digits per part: RGBG
- RGB: Dominant counts (0-4)
- G: Gradient flag (0=no, 1=yes)
- Separated by hyphens for readability

### Rationale
- **Human format**: Easy to read, compare, discuss
- **Machine format**: Can be parsed programmatically
- **Concise**: Fits on one line
- **Complete**: Contains all genetic information
- **Lossless**: Can reconstruct full genotype from string

### Use Cases
- Sharing "breeding seeds" with friends
- External breeding calculators/simulators
- Tournament/competition verification
- Genetic lineage tracking tools

---

## Future Considerations

### Potential Features
1. **Gene Source Tracking**: As described above
2. **Breeding History**: Track parent lineages
3. **Genetic Heatmap**: Visual display of gene distribution
4. **Breeding Simulator**: Predict offspring before committing
5. **Achievement Tiers**: Bronze/Silver/Gold versions of achievements
6. **Contest Leaderboards**: Historical best placements
7. **Mutation Log**: Track when/where mutations occurred

### Balance Considerations
- Mutation rate (currently 5%) may need tuning based on player feedback
- Contest difficulty scaling based on player skill progression
- Rare parrot sell values vs. coin rewards needs monitoring
- Full Genotype achievement difficulty may be too hard for casual players

---

## Credits & Acknowledgments

**Design Team:**
- Core Concept: User (ilyakudas)
- Implementation: Claude (Anthropic)
- Version: 3.0 (November 2025)

**Key User Feedback Integrated:**
- Cache busting via version updates
- Full Genotype achievement difficulty fix
- Mutation system with late-game toggle
- Gene source limitation concept
- Beauty/Rarity color scheme distinction
- Concise DNA display format
- Rare parrot progression logic

---

**Document Version:** 1.0
**Last Updated:** November 12, 2025
**Next Review:** After user testing feedback
