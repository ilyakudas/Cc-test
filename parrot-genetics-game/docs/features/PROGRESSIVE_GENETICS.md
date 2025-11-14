# Progressive Genetics System

**Purpose**: Gradually unlock genetic complexity to make breeding accessible for beginners while maintaining depth for advanced players.

**Related docs**: [Genetics System](../design/GENETICS_SYSTEM.md), [Breeding Lab](BREEDING_LAB.md)

## Problem Statement

**4 alleles × 3 colors × 6 body parts = 72 independent variables**
- Too complex for beginners
- Random breeding rarely produces contest-worthy parrots
- Frustrating to achieve specific colors
- Hard to understand genetics

## Solution: Progressive Unlocking

### Tier 1: Beginner Sanctuary (Start)

**Bound Body Parts** - 3 groups instead of 6:
- Group 1: Wings + Tail (same genes)
- Group 2: Body + Head (same genes)
- Group 3: Accents (independent)

**Grouped Alleles** - 2 pairs instead of 4:
- Red: [r1+r2] [r3+r4]
- Green: [g1+g2] [g3+g4]
- Blue: [b1+b2] [b3+b4]
- Inherits pairs, not individual alleles

**Result**: 3 groups × 2 pairs × 3 colors = **18 variables** (75% reduction)

**Benefits**:
- Predictable breeding outcomes
- Easy to create themed birds (blue bird, red bird)
- Can win local/regional contests
- Natural color harmony

### Tier 2: Enhanced Facility (First Unlock)

**Unlock**: Individual Alleles (keep bound body parts)
- Cost: 2,500 coins or achievement
- Unlocks: Full 4-allele recombination

**Result**: 3 groups × 4 alleles × 3 colors = **36 variables**

**New capability**: More color variation within same part

### Tier 3: Professional Center (Second Unlock)

**Unlock**: Independent Body Parts (keep grouped alleles if desired)
- Cost: 5,000 coins + achievement
- Unlocks: Each of 6 body parts can be different colors

**Result**: 6 parts × 2 pairs × 3 colors = **36 variables** (or 72 if combining with Tier 2)

**New capability**: Multi-color parrots, complex patterns

### Tier 4: Master Sanctuary (Full Unlock)

**Unlock**: Combined System
- Cost: 10,000 coins + Master Breeder achievement
- Full complexity: 6 parts × 4 alleles × 3 colors = **72 variables**

**New capability**: Maximum control for perfect specimens

## Breeding Examples

### Tier 1 (Bound + Grouped)
```
Parent A: Wings+Tail [RR][rr], Body+Head [rr][rr]
Parent B: Wings+Tail [Rr][Rr], Body+Head [RR][rr]

Offspring:
- Wings+Tail: 50% strong red, 50% medium red
- Body+Head: 50% medium red, 50% weak red

Simple, predictable!
```

### Tier 4 (Full System)
```
Parent A: Wings [R][R][r][r], Tail [r][r][r][r]
Parent B: Wings [R][r][R][r], Tail [R][R][R][R]

Offspring: Complex combinations possible
- Wings can be different from Tail
- Each allele inherits independently
- 16+ possible color combinations
```

## UI Requirements

### Breeding Lab Display

**Tier 1**:
```
Wings+Tail:  [🔵🔵] [⚪⚪]  🔗 Linked
Body+Head:   [🔴🔴] [🟡🟡]  🔗 Linked
Accents:     [⚪⚪] [⚪⚪]
```

**Tier 4**:
```
Wings:  [🔵][🔵][⚪][⚪]  🔓 Independent
Tail:   [🔵][⚪][⚪][⚪]  🔓 Independent
Body:   [🔴][🔴][🔴][⚪]  🔓 Independent
Head:   [🟡][🟡][🟡][🟡]  🔓 Independent
```

### Unlock Notifications

**When unlocking**:
- Toast: "Genetic Sequencing Unlocked!"
- Message: "You can now control individual alleles for more color variation"
- Visual: Show before/after breeding preview
- Tutorial: Brief explanation of new capability

### Visual Indicators

**In breeding interface**:
- Locked: Show 🔗 link icon between bound parts
- Unlocked: Show 🔓 independent icon
- Grouped alleles: Show as pairs [XX] instead of individual [X][X][X][X]

## Contest Alignment

**Local Contests** (Tier 1):
- Accept any genetics level
- Designed for grouped-allele simplicity

**Regional Contests** (Tier 2):
- Benefit from allele variation
- Still achievable with Tier 1

**National Contests** (Tier 3):
- Multi-color patterns rewarded
- Independent parts beneficial

**World Championships** (Tier 4):
- Maximum complexity rewarded
- Perfect specimens require full system

## Unlock Conditions

### Option A: Purchase-Based
- Tier 2: 2,500 coins
- Tier 3: 5,000 coins
- Tier 4: 10,000 coins

### Option B: Achievement-Based
- Tier 2: Win 5 local contests
- Tier 3: Win 3 regional contests
- Tier 4: Win 1 national contest + breed 50 parrots

### Option C: Hybrid (Recommended)
- Tier 2: 2,500 coins OR win 5 contests
- Tier 3: 5,000 coins AND win 3 regional
- Tier 4: 10,000 coins AND Master Breeder achievement

## Implementation Notes

### Genetic Storage

**Tier 1** - Store as pairs:
```javascript
genes: {
  wings_tail: {
    red: [[true, true], [false, false]],    // 2 pairs
    green: [[false, false], [true, true]],
    blue: [[true, false], [true, false]],
    gradient: false
  }
}
```

**Tier 4** - Store individually:
```javascript
genes: {
  wings: {
    red: [true, true, false, false],    // 4 individual
    green: [false, false, true, true],
    blue: [true, false, true, false],
    gradient: false
  },
  tail: { /* separate genes */ }
}
```

### Migration Strategy

When unlocking:
1. Check current tier
2. Copy genes to new structure
3. If unlocking individual alleles: Split pairs
4. If unlocking body parts: Duplicate bound genes to new parts
5. Update save data

### Backwards Compatibility

Old saves (if any):
- Detect missing tier data
- Default to Tier 1
- Allow instant upgrade via settings (free)

## Player Benefits

**New Players**:
- Not overwhelmed by complexity
- Can win contests within 1-2 hours
- Understand breeding outcomes
- Feel successful

**Advanced Players**:
- Clear progression goals
- Meaningful unlocks (not just cosmetic)
- Endgame complexity for perfect breeding
- Long-term engagement

## Future Expansion

**Potential additional tiers**:
- Mutation control unlocks
- Pattern gene complexity
- Animation genes
- Cross-breeding between species
