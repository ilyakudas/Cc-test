# Contest System Documentation

## Overview

The Contest System is the primary competitive gameplay mode in the Parrot Genetics Game, where players enter their parrots into beauty competitions against AI opponents. The system features five progressive tiers, each with increasing difficulty, entry costs, and rewards. Success depends on the parrot's beauty score (see [BEAUTY_SYSTEM.md](BEAUTY_SYSTEM.md) for scoring details).

**Implementation Files:**
- `public/js/contests.js` (379 lines) - Main contest module
- `public/js/constants.js` (lines 1-157) - Contest tier configurations and rare parrot templates

## Architecture

### Contest Flow
```
Player Selection
    ↓
Tier Validation (beauty score + coins)
    ↓
AI Opponent Generation
    ↓
Beauty Score Comparison
    ↓
Placement Determination (1st-6th)
    ↓
Reward Selection (coins or rare parrot)
    ↓
Achievement Check
```

### Key Functions

**`renderContestsTab()`** - `contests.js:10-64`
- Renders the contest selection UI
- Displays all 5 contest tiers with their requirements
- Shows lock status based on previous tier completion
- Updates dynamically when coins or beauty scores change

**`enterContest(tierIndex, saveGameFn, updateStatsFn, checkAchievementsFn)`** - `contests.js:70-135`
- Main contest entry point
- Validates entry requirements (coins, beauty score, tier unlock)
- Generates 5 AI opponents
- Calculates placement based on beauty scores
- Handles reward distribution
- Unlocks next tier on first-place victory
- Calls achievement checking after contest completion

**`generateAIOpponents(tier, count)`** - `contests.js:141-163`
- Creates mock beauty scores for AI competitors
- Uses weighted random distribution within tier's beauty range
- Biases toward lower end of range for competitive balance
- Returns array of opponent objects with scores and traits

**`showContestResults(placement, tier, rewards, parrotBeauty, opponents, onRewardChoice)`** - `contests.js:169-317`
- Displays contest results modal
- Shows final standings with all competitors
- Presents reward options (coins or rare parrot if top 3)
- Handles rare parrot integration into game state
- Provides feedback for failure cases (4th-6th place)

**`createRareParrot(tierIndex, placement, baseStats)`** - `contests.js:323-371`
- Generates rare parrot with special genetics
- Copies genetics from RARE_CONTEST_PARROTS template
- Sets name, rarity, and unlock date
- Adds to player's parrot collection

## Contest Tier System

The game features 5 progressive tiers, each with unique requirements and rewards.

### Tier Configuration Structure

From `constants.js:1-86`:

```javascript
{
    name: string,           // Display name with emoji
    entryCost: number,      // Coin cost to enter
    minBeautyRange: [min, max], // AI opponent beauty score range
    rewards: {              // Rewards by placement
        1: {coins, badge},
        2: {coins, badge},
        3: {coins, badge}
    },
    specialRules: string | null,  // Additional tier rules
    unlocked: boolean       // Initial unlock status
}
```

### Tier 0: Beginner Beauty Show

**Requirements:**
- Entry Cost: 50 coins
- Recommended Beauty Score: 40-60

**AI Opponents:**
- Beauty Range: 40-60
- Difficulty: Entry-level

**Rewards:**
- 1st Place: 150 coins + 🥇 badge OR rare parrot
- 2nd Place: 100 coins + 🥈 badge OR rare parrot
- 3rd Place: 75 coins + 🥉 badge OR rare parrot

**Special Rules:** None

**Status:** Always unlocked

### Tier 1: Amateur Avian Competition

**Requirements:**
- Entry Cost: 100 coins
- Recommended Beauty Score: 70-100
- Must win 1st place in Tier 0 to unlock

**AI Opponents:**
- Beauty Range: 70-100
- Difficulty: Moderate

**Rewards:**
- 1st Place: 350 coins + 🥇 badge OR rare parrot
- 2nd Place: 225 coins + 🥈 badge OR rare parrot
- 3rd Place: 150 coins + 🥉 badge OR rare parrot

**Special Rules:** None

**Status:** Locked initially

### Tier 2: Professional Parrot Pageant

**Requirements:**
- Entry Cost: 200 coins
- Recommended Beauty Score: 110-140
- Must win 1st place in Tier 1 to unlock

**AI Opponents:**
- Beauty Range: 110-140
- Difficulty: Challenging

**Rewards:**
- 1st Place: 700 coins + 🥇 badge OR rare parrot
- 2nd Place: 450 coins + 🥈 badge OR rare parrot
- 3rd Place: 300 coins + 🥉 badge OR rare parrot

**Special Rules:** "Judges favor color variety and gradients"

**Status:** Locked initially

### Tier 3: Elite Bird Championship

**Requirements:**
- Entry Cost: 400 coins
- Recommended Beauty Score: 150-170
- Must win 1st place in Tier 2 to unlock

**AI Opponents:**
- Beauty Range: 150-170
- Difficulty: Expert

**Rewards:**
- 1st Place: 1400 coins + 🥇 badge OR rare parrot
- 2nd Place: 900 coins + 🥈 badge OR rare parrot
- 3rd Place: 600 coins + 🥉 badge OR rare parrot

**Special Rules:** "Requires exceptional beauty traits"

**Status:** Locked initially

### Tier 4: Grand Master's Gala

**Requirements:**
- Entry Cost: 800 coins
- Recommended Beauty Score: 175-195
- Must win 1st place in Tier 3 to unlock

**AI Opponents:**
- Beauty Range: 175-195
- Difficulty: Master

**Rewards:**
- 1st Place: 2800 coins + 🥇 badge OR rare parrot
- 2nd Place: 1800 coins + 🥈 badge OR rare parrot
- 3rd Place: 1200 coins + 🥉 badge OR rare parrot

**Special Rules:** "Only the most magnificent parrots compete here"

**Status:** Locked initially

## Rare Parrot Rewards

Players finishing in the top 3 of any contest can choose between coin rewards or a rare parrot with exceptional genetics. Each tier and placement combination has a unique rare parrot template.

### Rare Parrot Template Structure

From `constants.js:91-157`:

```javascript
{
    name: string,           // Display name
    rarity: string,         // "rare", "epic", "legendary", etc.
    genetics: {
        wings: [[alleles], ...],      // 8 genes × 2 alleles each
        special_wing: [[alleles], ...],
        body: [[alleles], ...],
        head: [[alleles], ...],
        tail: [[alleles], ...],
        accents: [[alleles], ...]
    }
}
```

### Genetic Notation

Genetics use allele pairs:
- **`1`** = Dominant allele (contributes to color intensity)
- **`0`** = Recessive allele (minimal contribution)

Each body part has 8 genes:
- Genes 0-3: Red channel intensity
- Genes 4-7: Green channel intensity
- Gene 8: Blue channel intensity (first gene)
- Gene 12: Gradient gene (affects color transitions)

### Example: Tier 0, 1st Place - "Sunset Glory"

```javascript
{
    name: "Sunset Glory",
    rarity: "rare",
    genetics: {
        wings: [[1,1], [1,1], [1,1], [1,0], [1,0], [1,0], [0,0], [0,0], [0,0]],
        // High red, medium-low green, low blue = Orange/red tones
        // ...
    }
}
```

This parrot is bred for:
- High red dominance (wings: [1,1], [1,1], [1,1], [1,0])
- Medium green presence (genes 4-7: [1,0], [1,0], [0,0], [0,0])
- Minimal blue ([0,0])
- Result: Warm sunset colors (orange, red, amber)

### Rarity Progression

Rare parrots increase in value and genetic quality by tier:

**Tier 0-1: "Rare"**
- Focused color schemes
- 2-3 dominant color channels
- Moderate beauty scores (60-100)

**Tier 2-3: "Epic"** (implied by tier difficulty)
- Complex gradient patterns
- High color diversity
- Strong beauty scores (110-150)

**Tier 4: "Legendary"** (implied by tier difficulty)
- Near-perfect genetics
- Exceptional gradient and color harmony
- Elite beauty scores (175+)

### Notable Rare Parrot Examples

**"Azure Dream"** - Tier 1, 1st Place
- Pure blue genetics with gradient emphasis
- Wings and special_wing have high blue dominance
- Minimal red/green creates clean blue tones

**"Rainbow Monarch"** - Tier 2, 1st Place
- Balanced RGB across all body parts
- High gradient genes for smooth transitions
- Designed to score highly on color diversity

**"Prismatic Perfection"** - Tier 4, 1st Place (inferred name)
- Maximum genetic optimization
- Perfect gradient distribution
- Tuned for highest possible beauty scores

## AI Opponent Generation

### Algorithm - `contests.js:141-163`

1. **Range Determination:**
   ```javascript
   const [minBeauty, maxBeauty] = tier.minBeautyRange;
   ```

2. **Weighted Random Distribution:**
   ```javascript
   const baseWeight = Math.random();
   const skewedWeight = Math.pow(baseWeight, 1.5); // Bias toward lower end
   const beautyScore = Math.floor(minBeauty + skewedWeight * (maxBeauty - minBeauty));
   ```

   The `Math.pow(baseWeight, 1.5)` creates a distribution favoring lower scores:
   - 50% of opponents will be in bottom 39% of range
   - 25% of opponents will be in top 39% of range
   - Gives player better chance while maintaining challenge

3. **Mock Beauty Breakdown:**
   ```javascript
   opponents.push({
       name: `Opponent ${i + 1}`,
       beautyScore: beautyScore,
       beautyTraits: ['Beautiful plumage', 'Striking colors', 'Well-proportioned']
   });
   ```

### Competitive Balance

The AI generation algorithm ensures:
- **Variability:** Each contest has different competition
- **Achievability:** Weighted distribution makes wins possible
- **Challenge:** Range spreads create occasional tough opponents
- **Progression:** Higher tiers require better parrots to compete

Example distribution for Tier 2 (range 110-140):
- Minimum opponent: ~110-115
- Typical opponents: 115-128
- Strong opponents: 128-140
- Player needs ~125-135 to reliably place top 3

## Placement and Scoring

### Placement Logic - `contests.js:85-110`

1. **Combine All Competitors:**
   ```javascript
   const allCompetitors = [
       { name: parrot.name, beautyScore: parrotBeauty.score, isPlayer: true },
       ...opponents
   ];
   ```

2. **Sort by Beauty Score (Descending):**
   ```javascript
   allCompetitors.sort((a, b) => b.beautyScore - a.beautyScore);
   ```

3. **Find Player Position:**
   ```javascript
   const placement = allCompetitors.findIndex(c => c.isPlayer) + 1;
   ```

4. **Tie Breaking:**
   - Currently: First in sorted order wins ties
   - Player advantage: Player is added first, so wins ties with equal AI scores

### Placement Outcomes

**1st Place (Victory):**
- Full reward choice (coins or rare parrot)
- Unlocks next tier on first win
- Achievement progress
- Profit: (reward - entry cost) typically 2-3.5x investment

**2nd Place:**
- Reward choice (coins or rare parrot)
- No tier unlock
- Profit: 1-2.5x investment

**3rd Place:**
- Reward choice (coins or rare parrot)
- No tier unlock
- Profit: 0.5-1.5x investment

**4th-6th Place (Loss):**
- No rewards
- Entry fee lost
- Feedback message: "Better luck next time!"
- Net loss: Entry cost

## Reward Economics

### Coin Reward Analysis

| Tier | Entry Cost | 1st Place | 2nd Place | 3rd Place | ROI (1st) |
|------|-----------|-----------|-----------|-----------|-----------|
| 0    | 50        | 150       | 100       | 75        | 200%      |
| 1    | 100       | 350       | 225       | 150       | 250%      |
| 2    | 200       | 700       | 450       | 300       | 250%      |
| 3    | 400       | 1400      | 900       | 600       | 250%      |
| 4    | 800       | 2800      | 1800      | 1200      | 250%      |

**Observations:**
- Tier 0 has lower ROI (200%) to encourage progression
- Tiers 1-4 have consistent 250% ROI on 1st place
- 2nd place: ~125-150% ROI
- 3rd place: ~50-75% ROI
- All tiers are profitable for top 3 finishes

### Rare Parrot vs Coin Decision

**Factors Favoring Coins:**
- Immediate purchasing power
- Can buy food, breeding, or enter more contests
- No maintenance cost
- Guaranteed value

**Factors Favoring Rare Parrot:**
- Superior genetics for breeding program
- Potential for higher beauty scores
- Collection completion
- Long-term genetic investment
- Emotional/aesthetic value

**Strategic Considerations:**
- Early game (Tier 0-1): Coins help build capital
- Mid game (Tier 2-3): Rare parrots improve breeding stock
- Late game (Tier 4): Rare parrots for completion/optimization
- Low coin count: Coins are safer choice
- Strong breeding program: Rare parrots accelerate progress

## Integration with Game Systems

### Beauty Score System

Contests directly depend on the beauty scoring system documented in [BEAUTY_SYSTEM.md](BEAUTY_SYSTEM.md):

1. **Player Score Calculation:**
   ```javascript
   const parrotBeauty = parrot.calculateBeauty(); // From parrot.js
   ```

   Uses the full beauty algorithm including:
   - Gradient scoring
   - Solid color bonus
   - Color diversity
   - Color relationships
   - Maximum possible: 200 points

2. **AI Score Simulation:**
   - AI scores are abstract numbers, not calculated from genetics
   - Allows flexible difficulty tuning per tier
   - Avoids computational overhead of generating full genetics

3. **Score Comparison:**
   - Direct numerical comparison
   - Ties broken by order (player advantage)

### Breeding System

Rare contest parrots significantly impact breeding:

1. **Genetic Diversity:**
   - Rare parrots introduce optimized allele combinations
   - Increases chance of high-beauty offspring
   - Adds genetic material not easily achieved through random breeding

2. **Breeding Strategy:**
   - Cross rare parrot with existing stock
   - Offspring inherit 50% from each parent
   - Multiple generations can stabilize rare genetics

3. **Example Breeding Chain:**
   ```
   Tier 2 Rare Parrot (140 beauty) × Player Parrot (110 beauty)
   → Offspring (120-135 beauty range expected)
   → Breed best offspring together
   → Second generation (130-145 beauty potential)
   → Competitive in Tier 3+
   ```

### Achievement System

Contests trigger achievement checks (`contests.js:131`):

```javascript
checkAchievementsFn(placement, tierIndex);
```

**Potential Achievements (inferred):**
- "First Victory" - Win first contest
- "Grand Champion" - Win all tier 4 contests
- "Rare Collector" - Collect all rare parrots
- "Perfectionist" - Win with 190+ beauty score
- "Tier Master" - Win X contests in specific tier

### Economy Balance

Contest system serves as primary coin source:

1. **Income Stream:**
   - Reliable profit from skilled play
   - Scales with player progression
   - Higher tiers = higher rewards

2. **Risk/Reward:**
   - Entry fee creates risk
   - Better parrots reduce risk
   - Tier choice allows risk management

3. **Economy Sink:**
   - Failed contests remove coins
   - Entry fees consumed
   - Encourages breeding/training investment

4. **Breeding Incentive:**
   - Need better parrots for higher tiers
   - Drives engagement with genetics system
   - Creates progression loop

## Implementation Details

### Contest State Management

From `contests.js:10-64`, contest state is managed through:

1. **Tier Unlock Tracking:**
   ```javascript
   CONTEST_TIERS[tierIndex].unlocked
   ```
   - Modified when player wins 1st place
   - Persisted in game save
   - UI updates dynamically

2. **Validation Checks:**
   ```javascript
   if (gameState.coins < tier.entryCost) {
       alert(`Need ${tier.entryCost} coins to enter`);
       return;
   }

   if (parrotBeauty.score < tier.minBeautyRange[0]) {
       alert(`Beauty score too low (need ${tier.minBeautyRange[0]}+)`);
       return;
   }
   ```

3. **Save State Integration:**
   ```javascript
   gameState.coins -= tier.entryCost; // Deduct entry fee
   // ... contest logic ...
   gameState.coins += reward; // Add winnings
   saveGameFn(); // Persist changes
   ```

### UI Rendering

Contest UI elements (`contests.js:10-64`):

1. **Tier Cards:**
   - Display name, cost, requirements
   - Lock icon for locked tiers
   - Color coding by unlock status
   - "Enter Contest" buttons

2. **Entry Validation Visual Feedback:**
   - Disabled buttons when requirements not met
   - Tooltip showing specific requirements
   - Current player stats display

3. **Results Modal:**
   - Standings table with all competitors
   - Player row highlighted
   - Placement badge and rewards
   - Reward selection buttons (if top 3)
   - Rare parrot preview card

### Rare Parrot Creation

From `contests.js:323-371`, rare parrot instantiation:

```javascript
function createRareParrot(tierIndex, placement, baseStats) {
    const template = RARE_CONTEST_PARROTS[tierIndex][placement];

    return {
        name: template.name,
        genetics: JSON.parse(JSON.stringify(template.genetics)), // Deep copy
        rarity: template.rarity,
        birthDate: Date.now(),
        source: 'contest',
        tier: tierIndex,
        placement: placement,
        happiness: 100,
        hunger: 0,
        ...baseStats
    };
}
```

**Key Operations:**
1. **Template Lookup:** `RARE_CONTEST_PARROTS[tierIndex][placement]`
2. **Deep Copy:** Prevents template mutation
3. **Metadata Addition:** Source tracking, timestamps
4. **Stat Initialization:** Starting happiness/hunger
5. **Integration:** Added to `gameState.parrots[]`

### Performance Considerations

1. **AI Generation:**
   - O(n) complexity for n opponents
   - Lightweight calculation (no full genetics)
   - 5 opponents generated per contest
   - Negligible performance impact

2. **Sorting:**
   - O(n log n) for 6 competitors
   - Trivial dataset size
   - No optimization needed

3. **Beauty Calculation:**
   - Called once per contest entry
   - Primary performance cost
   - See [BEAUTY_SYSTEM.md](BEAUTY_SYSTEM.md) for analysis
   - Typical: <5ms per calculation

4. **UI Updates:**
   - Contest tab re-renders on state change
   - Event-driven updates (coin change, parrot change)
   - Minimal DOM manipulation

## Special Rules and Validators

### Current Implementation

**Tier 2:** "Judges favor color variety and gradients"
- **Status:** Flavor text only
- **Validation:** None implemented
- **Effect:** Provides player guidance

**Tier 3:** "Requires exceptional beauty traits"
- **Status:** Flavor text only
- **Validation:** Beauty score minimum (150+)
- **Effect:** Sets expectation of difficulty

**Tier 4:** "Only the most magnificent parrots compete here"
- **Status:** Flavor text only
- **Validation:** Beauty score minimum (175+)
- **Effect:** Establishes elite status

### Potential Future Validators

These special rules could be implemented as actual gameplay mechanics:

1. **Color Variety Validator (Tier 2+):**
   ```javascript
   if (tier.requiresColorVariety) {
       const uniqueColors = new Set(Object.values(parrotBeauty.bodyPartColors));
       if (uniqueColors.size < 3) {
           alert("Judges require at least 3 different colors");
           return;
       }
   }
   ```

2. **Gradient Validator (Tier 2+):**
   ```javascript
   if (tier.requiresGradients) {
       const gradientTraits = parrotBeauty.traits.filter(t =>
           t.includes('gradient') || t.includes('transition')
       );
       if (gradientTraits.length < 2) {
           alert("Judges require gradient patterns");
           return;
       }
   }
   ```

3. **Minimum Trait Count (Tier 3+):**
   ```javascript
   if (tier.minTraitCount && parrotBeauty.traits.length < tier.minTraitCount) {
       alert(`Requires at least ${tier.minTraitCount} beauty traits`);
       return;
   }
   ```

4. **Specific Color Requirements:**
   ```javascript
   if (tier.requiredColors) {
       const colors = Object.values(parrotBeauty.bodyPartColors);
       const hasRequired = tier.requiredColors.every(req => colors.includes(req));
       if (!hasRequired) {
           alert(`Must have: ${tier.requiredColors.join(', ')}`);
           return;
       }
   }
   ```

## Design Philosophy

### Progressive Difficulty

The tier system creates natural progression:

1. **Skill-Based Gating:**
   - Must win to unlock next tier
   - Prevents premature advancement
   - Ensures player readiness

2. **Resource Management:**
   - Entry costs scale with rewards
   - Risk increases with tier
   - Encourages strategic tier selection

3. **Beauty Score Requirements:**
   - Indirect skill gate
   - Requires breeding knowledge
   - Rewards genetic optimization

### Player Agency

Multiple decision points preserve player choice:

1. **Tier Selection:**
   - Choose appropriate difficulty
   - Balance risk vs reward
   - Can replay lower tiers

2. **Reward Choice:**
   - Coins for immediate needs
   - Rare parrot for long-term investment
   - No "correct" choice

3. **Breeding Strategy:**
   - Use rare parrots or not
   - How to integrate genetics
   - Multiple paths to success

### Risk and Reward Balance

Contest economics carefully balanced:

1. **Positive Expected Value:**
   - Top 3 finishes are profitable
   - Skilled play is rewarded
   - Sustainable income source

2. **Risk Mitigation:**
   - Lower tiers less risky
   - Can build capital safely
   - Progression not mandatory

3. **Loss Tolerance:**
   - 4th-6th place loses entry fee
   - Manageable loss (50-800 coins)
   - Encourages improvement

## Comparison with Beauty System

### Overlaps

Both systems share:

1. **Beauty Score Calculation:**
   - Contests use `parrot.calculateBeauty()` directly
   - Same scoring algorithm and components
   - See [BEAUTY_SYSTEM.md](BEAUTY_SYSTEM.md) for full details

2. **Color System:**
   - Same 28-color classification
   - Same RGB genetics basis
   - Same color relationship scoring

3. **Display Components:**
   - Both show beauty scores
   - Both show beauty trait lists
   - Both show color breakdowns

### Differences

**Beauty System:**
- **Focus:** How scores are calculated
- **Scope:** Individual parrot evaluation
- **Purpose:** Objective measurement
- **Users:** Player and contest system

**Contest System:**
- **Focus:** Competitive gameplay
- **Scope:** Multi-parrot comparison
- **Purpose:** Game progression and rewards
- **Users:** Player only

### Division of Concerns

**Beauty System Responsibilities:**
- Calculate beauty scores (0-200)
- Identify beauty traits
- Classify body part colors
- Measure color relationships
- Provide mathematical foundation

**Contest System Responsibilities:**
- Generate AI opponents
- Compare beauty scores
- Determine placement
- Distribute rewards
- Manage tier progression
- Integrate with economy

## Future Enhancements

### Potential Features

1. **Leaderboards:**
   - Track highest beauty scores per tier
   - All-time best placements
   - Seasonal competitions

2. **Special Events:**
   - Limited-time contests
   - Theme requirements (e.g., "All Blue Contest")
   - Exclusive rare parrots

3. **Multiplayer Contests:**
   - Real players as opponents
   - Asynchronous competition
   - Global rankings

4. **Judging Categories:**
   - Best Gradient
   - Most Colorful
   - Specific color awards
   - Multiple winners per contest

5. **Contest History:**
   - Track past performances
   - Replay results
   - Statistics tracking

6. **Training System:**
   - Practice rounds (no entry fee)
   - View AI ranges before entering
   - Training tips based on beauty analysis

7. **Badge System:**
   - Collectible badges beyond placement
   - Achievement-based unlocks
   - Display in parrot profiles

### Technical Improvements

1. **Validator Framework:**
   - Implement special rule validators
   - Make special rules functional, not just flavor
   - Add new validator types

2. **Dynamic AI Difficulty:**
   - Adjust opponent strength based on player success rate
   - Prevent farming of low tiers
   - Maintain challenge

3. **Beauty Score Breakdown in Results:**
   - Show why player won/lost
   - Compare component scores with AI
   - Educational feedback

4. **Rare Parrot Customization:**
   - Player names rare parrots
   - Visual customization options
   - Personality traits

## Summary

The Contest System is a well-balanced competitive mode that:

1. **Drives Progression:**
   - Five tiers create clear goals
   - Unlock system gates advancement
   - Beauty requirements encourage breeding

2. **Integrates Core Systems:**
   - Directly uses beauty scoring
   - Feeds into breeding program
   - Balances game economy

3. **Offers Strategic Depth:**
   - Tier selection based on readiness
   - Reward choice (coins vs genetics)
   - Risk management through entry costs

4. **Maintains Engagement:**
   - Repeatable content with variable outcomes
   - Rare parrot collection goals
   - Achievement integration

5. **Balances Economics:**
   - Profitable for skilled play
   - Reasonable risk levels
   - Sustainable income scaling

The system successfully combines genetics, strategy, and resource management into an engaging competitive loop that serves as the game's primary endgame content.

---

**Related Documentation:**
- [BEAUTY_SYSTEM.md](BEAUTY_SYSTEM.md) - Beauty score calculation details
- [GENETICS_SYSTEM.md](../design/GENETICS_SYSTEM.md) - RGB genetics foundation
- [GAMEPLAY_MECHANICS.md](../design/GAMEPLAY_MECHANICS.md) - Overall game systems

**Implementation Reference:**
- `public/js/contests.js:10-371` - Full contest module
- `public/js/constants.js:1-157` - Contest configurations
- `public/js/parrot.js:186-463` - Beauty calculation used by contests
