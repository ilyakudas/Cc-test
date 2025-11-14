# Wild Mate Finding System - Implementation Task List

## Overview

This document outlines the gradual implementation of the Wild Mate Finding System for ChromaWing. The system allows players to release parrots to build a wild gene pool, then find wild mates using Conservation Credits.

## Reference Documentation

- **Design Spec**: [`design/WILD_MATE_SYSTEM.md`](../design/WILD_MATE_SYSTEM.md) - Complete system design
- **Genetics System**: [`design/GENETICS_SYSTEM.md`](../design/GENETICS_SYSTEM.md) - Gene structure and inheritance
- **Gameplay Mechanics**: [`design/GAMEPLAY_MECHANICS.md`](../design/GAMEPLAY_MECHANICS.md) - Overall game systems
- **Technical Spec**: [`docs/TECHNICAL_SPEC.md`](../docs/TECHNICAL_SPEC.md) - Implementation details

## Implementation Phases

### Phase 1: Foundation (Core Data Structures)
**Goal**: Set up data structures without UI

#### Task 1.1: Gene Pool Data Structure
- [ ] Create `WildGenePool` class/object
- [ ] Track all 70 genes (65 color + 4 performance + 1 fertility)
- [ ] Structure: `{ bodyPart: { geneName: { dominant: number, recessive: number } } }`
- [ ] Add frequency calculation: `frequency = dominant / (dominant + recessive)`
- [ ] Add quality score calculation (average of all frequencies)
- [ ] Add diversity score calculation (count of genes in 0.3-0.7 range)
- [ ] Write unit tests for gene pool calculations

**Files to create**:
- `src/systems/WildGenePool.js`
- `tests/WildGenePool.test.js`

**Reference**: See WILD_MATE_SYSTEM.md section "2. Wild Gene Pool"

---

#### Task 1.2: Conservation Credits Resource
- [ ] Add `conservationCredits` to player data structure
- [ ] Create credit earning calculation function
  - Base: 10 credits
  - Rarity multiplier: × 5
  - Star rating: × 3
  - Diversity bonus: × 2
- [ ] Add credit deduction for mate searches
- [ ] Add save/load for credits
- [ ] Write tests for credit calculations

**Files to modify**:
- `src/data/PlayerData.js` (or equivalent)
- `src/systems/Resources.js`

**Reference**: WILD_MATE_SYSTEM.md section "1. Release System"

---

#### Task 1.3: Fertility Gene Addition
- [ ] Add fertility gene (F/f) to parrot genetics
- [ ] Add to all 5 body parts OR as single gene (design decision)
- [ ] Update gene inheritance to include fertility
- [ ] Add fertility calculation functions:
  - `calculateOffspringCount(parent1Fertility, parent2Fertility)`
  - `calculateBreedingCooldown(fertility)`
  - `calculateOffspringQualityModifier(fertility)`
- [ ] Write tests for fertility mechanics

**Files to modify**:
- `src/genetics/GeneSystem.js`
- `src/genetics/Breeding.js`
- `tests/Fertility.test.js`

**Reference**: WILD_MATE_SYSTEM.md section "6C. Fertility Gene System"

---

#### Task 1.4: Parrot Enhancement
- [ ] Add `hasFoundWildMate: false` property to Parrot
- [ ] Add `wildMateAttempts: 0` counter
- [ ] Add performance genes if not already present (V, A, N, E)
- [ ] Update parrot serialization to include new properties

**Files to modify**:
- `src/entities/Parrot.js`
- `src/data/ParrotData.js`

**Reference**: WILD_MATE_SYSTEM.md section "3. Finding a Mate in the Wild"

---

### Phase 2: Release System
**Goal**: Players can release parrots and earn credits

#### Task 2.1: Release Function
- [ ] Create `releaseParrot(parrotId)` function
- [ ] Extract all genes from parrot (70 genes)
- [ ] Add genes to wild gene pool:
  - Dominant alleles: +2 points
  - Recessive alleles: +1 point
- [ ] Calculate and award conservation credits
- [ ] Remove parrot from player's collection
- [ ] Add release to history/statistics
- [ ] Write tests for release mechanics

**Files to create**:
- `src/systems/ReleaseSystem.js`
- `tests/ReleaseSystem.test.js`

**Reference**: WILD_MATE_SYSTEM.md section "1. Release System"

---

#### Task 2.2: Release UI - Basic
- [ ] Add "Release" button to parrot card
- [ ] Create release confirmation dialog
  - Show conservation credits to be earned
  - Show which genes will be added
  - Warn that this is permanent
- [ ] Show success message with credits earned
- [ ] Update player's credit display
- [ ] Add animation/visual feedback for release

**Files to create**:
- `src/ui/ReleaseButton.js`
- `src/ui/ReleaseDialog.js`

**Styling needed**:
- Release button styles
- Confirmation dialog modal
- Success notification

---

#### Task 2.3: Release History Tracking
- [ ] Create release history data structure
- [ ] Track: timestamp, parrot name, genes, credits earned
- [ ] Add "Release History" view (simple list)
- [ ] Show total parrots released stat
- [ ] Show total credits earned from releases

**Files to create**:
- `src/ui/ReleaseHistory.js`

---

### Phase 3: Gene Pool Visualization
**Goal**: Show gene pool as "Average Wild Parrot"

#### Task 3.1: Average Parrot Calculation
- [ ] Create `calculateAverageParrot()` function
- [ ] For each body part and color channel:
  - Get gene frequency (0.0 - 1.0)
  - Convert to RGB value (frequency × 255)
- [ ] Calculate if average has gradients
  - Gradient if gradient gene frequency > 0.5
  - Split into start/end colors if gradient
- [ ] Return full phenotype structure
- [ ] Write tests for average calculation

**Files to create**:
- `src/systems/AverageParrotCalculator.js`
- `tests/AverageParrot.test.js`

**Reference**: WILD_MATE_SYSTEM.md section "6. UI/UX Design - Visual Representation"

---

#### Task 3.2: Gene Pool Dashboard UI
- [ ] Create "Wild Gene Pool" page/view
- [ ] Display conservation credits prominently
- [ ] Render average parrot using existing SVG renderer
- [ ] Add labels describing what viewer sees
  - "Wings: Reddish (78% red dominant)"
  - "Body: Bright Green (92% green dominant)"
- [ ] Show pool quality stars (⭐⭐⭐⭐)
- [ ] Show diversity score percentage
- [ ] Show performance gene averages
- [ ] Add "Last Release" timestamp
- [ ] Add decay rate indicator

**Files to create**:
- `src/pages/GenePoolDashboard.js`
- `src/components/AverageParrotDisplay.js`

**Styling needed**:
- Dashboard layout
- Gene pool stats display
- Visual parrot container

---

#### Task 3.3: Interactive Gene Pool Stats
- [ ] Make body parts clickable on average parrot
- [ ] Create detailed stats popup for each body part
- [ ] Show all 13 genes for selected body part:
  - Color genes (R, G, B) with bar graphs
  - Gradient gene
  - Performance genes (if applicable)
- [ ] Add toggle between "Visual View" and "Stats View"
- [ ] Add color indicators (🔴🟠🟡🟢🔵) based on frequency

**Files to create**:
- `src/components/GeneDetailPopup.js`
- `src/components/GeneStatsView.js`

---

### Phase 4: Gene Pool Decay System
**Goal**: Gene pool evolves over time

#### Task 4.1: Decay Mechanics
- [ ] Create `applyGenePoolDecay()` function
- [ ] Run weekly (or on schedule)
- [ ] For each gene:
  - `newFreq = currentFreq × 0.95 + 0.5 × 0.05` (5% drift toward 0.5)
  - Entropy: -2% for unused genes
- [ ] Update pool quality and diversity scores
- [ ] Log decay events
- [ ] Write tests for decay calculations

**Files to create**:
- `src/systems/GenePoolDecay.js`
- `tests/GenePoolDecay.test.js`

**Reference**: WILD_MATE_SYSTEM.md section "2. Wild Gene Pool - Gene Pool Decay/Evolution"

---

#### Task 4.2: Time-based Triggers
- [ ] Decide on time system: real-time or in-game time
- [ ] Add last decay timestamp to gene pool
- [ ] Check on game load if decay should apply
- [ ] Apply decay for time passed
- [ ] Show notification if significant decay occurred
- [ ] Add manual "Advance Time" button for testing

**Files to modify**:
- `src/systems/TimeSystem.js` (create if needed)
- `src/systems/WildGenePool.js`

---

### Phase 5: Mate Finding - Basic
**Goal**: Find wild mates without performance bonuses

#### Task 5.1: Mate Generation Algorithm
- [ ] Create `generateWildMate(parrotBeauty, genePool)` function
- [ ] For each of 70 genes:
  - Get gene frequency from pool
  - Calculate beauty bonus: `(parrotBeauty / 100) × 0.4`
  - Determine dominant chance: `geneFreq + beautyBonus + randomness`
  - Generate alleles based on probability
- [ ] Return complete mate genotype
- [ ] Calculate mate phenotype
- [ ] Assign mate quality rating (1-5 stars)
- [ ] Write extensive tests for mate generation

**Files to create**:
- `src/systems/MateGenerator.js`
- `tests/MateGenerator.test.js`

**Reference**: WILD_MATE_SYSTEM.md section "3. Finding a Mate - Mate Quality Calculation"

---

#### Task 5.2: Beauty Score Calculation
- [ ] Create `calculateBeautyScore(parrot)` function
- [ ] Components (each 0-25 points):
  - Color harmony
  - Rarity
  - Feature appeal
  - Genetic quality
- [ ] Total: 0-100
- [ ] Cache score on parrot object
- [ ] Write tests for beauty calculations

**Files to create**:
- `src/systems/BeautyCalculator.js`
- `tests/Beauty.test.js`

---

#### Task 5.3: Mate Finding UI - Basic
- [ ] Create "Find Wild Mate" button on parrot card
- [ ] Disable if parrot already found mate
- [ ] Show cost: 🌿 20 Conservation Credits (base)
- [ ] Create mate search dialog:
  - Show your parrot
  - Show beauty score
  - Show expected mate quality
  - Confirm button
- [ ] Generate 3 potential mates (base)
- [ ] Display mate selection screen
- [ ] Allow accept or reject all

**Files to create**:
- `src/ui/MateSearchDialog.js`
- `src/ui/MateSelectionScreen.js`
- `src/components/MateCard.js`

**Styling needed**:
- Mate search dialog
- Mate selection grid
- Mate preview cards

---

#### Task 5.4: Mate Selection and Breeding
- [ ] When mate accepted:
  - Mark parrot as `hasFoundWildMate = true`
  - Deduct conservation credits
  - Perform breeding immediately
  - Generate offspring
  - Add mate to temporary breeding partner slot
- [ ] Handle rejection:
  - Increment cost for retry
  - Allow new search attempt
- [ ] Handle cancel:
  - Refund 50% of credits
  - Close dialog
- [ ] Show offspring results

**Files to modify**:
- `src/systems/Breeding.js`
- `src/ui/MateSelectionScreen.js`

---

### Phase 6: Performance Gene Integration
**Goal**: Performance genes affect mate finding

#### Task 6.1: Agility - Mate Options
- [ ] Read parrot's agility gene
- [ ] Calculate mate count:
  - `aa`: 3 mates
  - `Aa`: 4 mates
  - `AA`: 5 mates
- [ ] Generate appropriate number of mates
- [ ] Show agility bonus in UI
  - "High Agility: Finding 5 potential mates!"

**Files to modify**:
- `src/systems/MateGenerator.js`
- `src/ui/MateSearchDialog.js`

**Reference**: WILD_MATE_SYSTEM.md section "6B. Performance Genes - Agility"

---

#### Task 6.2: Intelligence - Re-rolls
- [ ] Track free re-rolls used per parrot
- [ ] Calculate retry cost based on intelligence:
  - `nn`: 2.0× cost
  - `Nn`: 1.5× cost
  - `NN`: 1.0× cost (PLUS one free)
- [ ] Add "Free Re-roll Available" indicator for NN parrots
- [ ] Update cost display based on intelligence
- [ ] Handle free re-roll logic

**Files to modify**:
- `src/systems/MateGenerator.js`
- `src/ui/MateSelectionScreen.js`

**Reference**: WILD_MATE_SYSTEM.md section "6B. Performance Genes - Intelligence"

---

#### Task 6.3: Stamina - Quality Boost
- [ ] Read parrot's stamina gene
- [ ] Apply quality modifier to all mate genes:
  - `ee`: -10% to dominant chance
  - `Ee`: No modifier, 10% bonus mate chance
  - `EE`: +10% to dominant chance, 25% bonus mate chance
- [ ] Roll for bonus mate
- [ ] Show stamina bonus in UI
  - "High Stamina: +10% mate quality!"
  - "Bonus mate found!" if applicable

**Files to modify**:
- `src/systems/MateGenerator.js`
- `src/ui/MateSearchDialog.js`

**Reference**: WILD_MATE_SYSTEM.md section "6B. Performance Genes - Stamina"

---

#### Task 6.4: Speed - Cost Reduction
- [ ] Read parrot's speed gene
- [ ] Calculate search cost:
  - `vv`: +5 credits (25 total)
  - `Vv`: Base cost (20)
  - `VV`: -5 credits (15 total)
- [ ] Display actual cost based on speed
- [ ] Show speed bonus in UI
  - "Fast Parrot: Only 15 credits!"

**Files to modify**:
- `src/systems/MateGenerator.js`
- `src/ui/MateSearchDialog.js`

**Reference**: WILD_MATE_SYSTEM.md section "6B. Performance Genes - Speed"

---

### Phase 7: Fertility System Implementation
**Goal**: Fertility affects breeding outcomes

#### Task 7.1: Offspring Count Logic
- [ ] Update breeding function to check fertility
- [ ] Roll for offspring count based on parent fertility:
  - Use combined effects table from design doc
  - `FF × FF`: 80% → 2, 20% → 3
  - `Ff × Ff`: 90% → 1, 10% → 2
  - `ff × ff`: 60% → 0, 40% → 1
- [ ] Generate appropriate number of offspring
- [ ] Show expected count in breeding preview

**Files to modify**:
- `src/systems/Breeding.js`

**Reference**: WILD_MATE_SYSTEM.md section "6C. Fertility Gene System - Offspring Count"

---

#### Task 7.2: Breeding Cooldown
- [ ] Add `lastBredTimestamp` to parrot
- [ ] Add `breedingCooldown` based on fertility
- [ ] Check cooldown before allowing breeding
- [ ] Display remaining cooldown time
- [ ] Show fertility-based cooldown in parrot info

**Files to modify**:
- `src/entities/Parrot.js`
- `src/systems/Breeding.js`
- `src/ui/ParrotCard.js`

---

#### Task 7.3: Offspring Quality Modifier
- [ ] Apply fertility modifier to offspring stats:
  - `FF`: +5%
  - `Ff`: No modifier
  - `ff`: -5%
- [ ] Apply to calculated stats (speed, agility, etc.)
- [ ] Show modifier in breeding preview

**Files to modify**:
- `src/systems/Breeding.js`

---

#### Task 7.4: Fertility in Wild Mates
- [ ] When generating wild mate, check parrot fertility
- [ ] Adjust wild mate fertility gene probability:
  - `FF` parrot: +15% chance mate has F alleles
  - `Ff` parrot: Standard distribution
  - `ff` parrot: -15% chance mate has F alleles
- [ ] Show fertility outlook in mate preview
  - "Fertility Match: EXCELLENT" (FF × FF)
  - "Fertility Match: POOR" (ff × ff)

**Files to modify**:
- `src/systems/MateGenerator.js`
- `src/ui/MateCard.js`

---

#### Task 7.5: Fertility UI Indicators
- [ ] Add fertility display to parrot card
  - 🥚🥚🥚 (FF) / 🥚🥚 (Ff) / 🥚 (ff)
- [ ] Show fertility in breeding preview
- [ ] Show expected offspring count
- [ ] Add fertility to gene pool dashboard

**Files to modify**:
- `src/ui/ParrotCard.js`
- `src/ui/BreedingDialog.js`
- `src/components/GenePoolDashboard.js`

---

### Phase 8: UI Polish and Testing
**Goal**: Refined user experience

#### Task 8.1: Detailed Mate Preview
- [ ] Create expandable mate details view
- [ ] Show all genes in organized sections:
  - Wings (13 genes)
  - Body (13 genes)
  - Head (13 genes)
  - Tail (13 genes)
  - Accents (13 genes)
  - Performance (4 genes)
  - Fertility (1 gene)
- [ ] Show predicted offspring combinations
- [ ] Add "Compare to My Parrot" feature
- [ ] Visual diff highlighting

**Files to create**:
- `src/components/MateDetailView.js`

---

#### Task 8.2: Tutorial and Onboarding
- [ ] Create tutorial for release system
  - "Release parrots to build the wild gene pool"
  - Show first release walkthrough
- [ ] Create tutorial for mate finding
  - "Use conservation credits to find wild mates"
  - Explain performance gene bonuses
  - Show mate selection process
- [ ] Add help tooltips throughout
- [ ] Create FAQ section

**Files to create**:
- `src/tutorials/ReleaseTutorial.js`
- `src/tutorials/MateFindingTutorial.js`

---

#### Task 8.3: Statistics and Achievements
- [ ] Track release statistics:
  - Total parrots released
  - Total credits earned
  - Gene pool milestones
- [ ] Track mate finding statistics:
  - Total mates found
  - Best mate quality
  - Credits spent
- [ ] Add achievements:
  - "First Release" - Release your first parrot
  - "Conservationist" - Release 10 parrots
  - "Gene Pool Builder" - Reach 60% diversity
  - "Perfect Pool" - All genes above 0.3 frequency
  - "Scout Master" - Find mate with AA/NN/EE/VV parrot
  - "Fertility Expert" - Breed FF × FF for 3 offspring

**Files to create**:
- `src/systems/Statistics.js`
- `src/systems/Achievements.js`

---

#### Task 8.4: Balance Testing
- [ ] Test credit earn rates across game phases
  - Early: Should earn 30-50 credits/week
  - Mid: 100-150 credits/week
  - Late: 200-300 credits/week
- [ ] Test mate quality distribution
  - Poor parrot (⭐): 60% ⭐ mates
  - Great parrot (⭐⭐⭐⭐⭐): 50% ⭐⭐⭐⭐⭐ mates
- [ ] Test gene pool decay feels right
  - Not too fast (frustrating)
  - Not too slow (no maintenance needed)
- [ ] Adjust constants as needed

**Reference**: WILD_MATE_SYSTEM.md section "7. Balance Considerations"

---

### Phase 9: Advanced Features (Optional)
**Goal**: Extra polish and depth

#### Task 9.1: Compare to Average Parrot
- [ ] Add "Compare to Wild Average" button on parrot card
- [ ] Show side-by-side comparison:
  - Your parrot vs. average parrot
  - Highlight genes that are rarer/more common
  - "Your parrot is 23% more colorful than average"
  - "Your parrot has rare blue wings (only 15% frequency)"
- [ ] Visual highlighting of differences

**Files to create**:
- `src/components/ParrotComparison.js`

---

#### Task 9.2: Gene Pool Warnings
- [ ] Monitor gene pool for issues:
  - Genes falling below 0.1 (endangered)
  - Genes above 0.9 (oversaturated)
  - Diversity dropping below 50%
- [ ] Show warnings on dashboard
  - "⚠️ Red genes in BODY are declining!"
  - "💡 Consider releasing red-bodied parrots"
- [ ] Suggest specific parrot types to release

**Files to modify**:
- `src/components/GenePoolDashboard.js`

---

#### Task 9.3: Release Recommendations
- [ ] Analyze player's parrots
- [ ] Identify which ones would help gene pool most
- [ ] Show "Recommended for Release" badge
  - "This parrot would add rare blue genes!"
  - "High fertility - helps wild population"
- [ ] Calculate optimal releases for diversity

**Files to create**:
- `src/systems/ReleaseRecommendations.js`

---

#### Task 9.4: Historical Gene Pool Chart
- [ ] Track gene pool metrics over time
- [ ] Create line chart showing:
  - Quality score history
  - Diversity score history
  - Specific gene trends
- [ ] Add to dashboard
- [ ] Show impact of player's releases

**Files to create**:
- `src/components/GenePoolHistory.js`

---

### Phase 10: Future - Multiple Regions
**Goal**: Different biomes (stretch goal)

#### Task 10.1: Region System
- [ ] Create separate gene pools for regions:
  - 🌲 Forest
  - 🏔️ Mountain
  - 🌴 Tropical
  - 🏜️ Desert
- [ ] Each tracks own 70 genes
- [ ] Different starting frequencies per region

**Reference**: WILD_MATE_SYSTEM.md section "8. Future Expansion: Multiple Regions"

---

#### Task 10.2: Regional Credits
- [ ] Separate credit types:
  - 🌿 Forest Credits
  - ❄️ Mountain Credits
  - 🌺 Tropical Credits
  - 🏜️ Desert Credits
- [ ] Release in specific region earns those credits
- [ ] Find mates in specific region costs those credits

---

#### Task 10.3: Migration System
- [ ] Convert credits between regions (exchange rate)
- [ ] Transfer genes between pools (expensive)
- [ ] Unlock through progression

---

## Testing Requirements

### Unit Tests Required
- [ ] Gene pool calculations (frequency, quality, diversity)
- [ ] Conservation credit calculations
- [ ] Fertility mechanics (offspring count, cooldown, quality)
- [ ] Mate generation algorithm
- [ ] Beauty score calculation
- [ ] Performance gene bonuses
- [ ] Gene pool decay

### Integration Tests Required
- [ ] Full release flow (parrot → gene pool → credits)
- [ ] Full mate finding flow (search → select → breed)
- [ ] Performance genes affecting mate finding
- [ ] Fertility affecting breeding outcomes
- [ ] Gene pool decay over time

### User Testing Focus
- [ ] Is release decision clear and meaningful?
- [ ] Is gene pool visualization intuitive?
- [ ] Does mate finding feel fair?
- [ ] Are performance genes valuable?
- [ ] Is fertility system understandable?
- [ ] Does decay feel right (not too fast/slow)?

---

## Performance Considerations

### Optimization Targets
- [ ] Gene pool calculations should be < 50ms
- [ ] Mate generation should be < 100ms
- [ ] Average parrot rendering should be instant (< 16ms)
- [ ] Gene pool should support 100+ releases without lag

### Caching Strategy
- [ ] Cache average parrot calculation
- [ ] Cache beauty scores on parrots
- [ ] Cache gene pool quality/diversity scores
- [ ] Only recalculate when pool changes

---

## Success Metrics

### Engagement
- Target: 80%+ of players release at least 5 parrots
- Target: 60%+ of players use wild mate finding
- Target: Average 2-3 wild mates found per player session

### Balance
- Target: Credit earn/spend ratio 1.2-1.5
- Target: 70%+ of mate searches feel "fair" (user testing)
- Target: Performance genes valued by 80%+ of players

### System Health
- Target: Average gene pool quality 0.5-0.7
- Target: Average diversity score 40-70%
- Target: No genes stuck at 0% or 100% for long

---

## Implementation Priority

**Must Have (MVP)**:
- ✅ Phase 1-3: Core systems, release, visualization
- ✅ Phase 5: Basic mate finding
- ✅ Phase 7: Fertility system

**Should Have (Beta)**:
- ✅ Phase 4: Gene pool decay
- ✅ Phase 6: Performance gene integration
- ✅ Phase 8: Polish and testing

**Nice to Have (v1.1+)**:
- ⭐ Phase 9: Advanced features
- ⭐ Phase 10: Multiple regions

---

## Estimated Timeline

**Phase 1-3**: 2-3 weeks (Foundation + Release + Visualization)
**Phase 4-7**: 2-3 weeks (Decay + Mate Finding + Performance + Fertility)
**Phase 8**: 1-2 weeks (Polish and Testing)
**Phase 9-10**: 2-3 weeks (Advanced features - optional)

**Total MVP**: ~5-6 weeks
**Total with Polish**: ~7-9 weeks
**Total with Advanced**: ~9-12 weeks

---

## Dependencies

### External Libraries Needed
- None beyond current stack (assuming React/Vue + SVG rendering)

### New Systems Required
- Time system (if not present)
- Statistics tracking system
- Achievement system (nice to have)

### Modified Systems
- Parrot genetics (add fertility)
- Breeding system (fertility + wild mates)
- Save/Load (new data structures)

---

## Notes for Developers

### Key Design Principles
1. **No garbage in, treasure out**: Mate quality depends on gene pool quality
2. **Every gene matters**: All 70 genes have immediate gameplay value
3. **Visual feedback**: Gene pool must be intuitive and beautiful
4. **Fair randomness**: Better inputs give better odds, not guarantees
5. **Long-term investment**: Gene pool is strategic resource, not instant gratification

### Common Pitfalls to Avoid
- Don't make mate finding too cheap (trivializes choice)
- Don't make decay too fast (feels punishing)
- Don't let gene pool become static (need ongoing releases)
- Don't hide performance gene bonuses (make them visible!)
- Don't make fertility too punishing (ff should be viable for rare lines)

### Testing Edge Cases
- Gene pool with 0 releases (all frequencies at 0.5)
- Gene pool with extreme imbalance (one gene at 1.0, others at 0)
- Mate finding with parrot that has all low performance genes
- Breeding with ff × ff (high failure rate)
- Multiple rapid releases (stress test gene pool updates)

---

## Questions for Design Review

Before starting implementation, confirm:
- [ ] Should fertility be per-body-part or global? (Suggest: **global**, simpler)
- [ ] Should gene pool start empty or pre-seeded? (Suggest: **empty**, forces early releases)
- [ ] Real-time decay or turn-based? (Suggest: **time-based**, more strategic)
- [ ] Should wild mates be keepable or auto-breed? (Suggest: **auto-breed**, simpler)
- [ ] Should performance genes affect gene pool? (Suggest: **yes**, track performance in pool)

---

## Completion Checklist

When this system is done:
- [ ] Players can release parrots and earn Conservation Credits
- [ ] Gene pool visualized as beautiful "Average Wild Parrot"
- [ ] Players can find wild mates using credits
- [ ] Performance genes affect mate finding (Agility/Intelligence/Stamina/Speed)
- [ ] Fertility affects breeding outcomes (offspring count, cooldown, quality)
- [ ] Gene pool decays over time (requires maintenance)
- [ ] All 70 genes tracked and have gameplay purpose
- [ ] System is balanced and fun
- [ ] Tutorial explains all features
- [ ] Tests cover core functionality

**When complete, this system will add 10+ hours of strategic depth to ChromaWing!** 🦜✨
