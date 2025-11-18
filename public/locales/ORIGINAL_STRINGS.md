# Original Hardcoded Strings (Pre-Localization)

This file preserves the original English text that was hardcoded in the game before the i18n system was implemented. It serves as a reference to ensure translations maintain the original meaning and tone.

**Date Created**: 2025-11-18
**Purpose**: Historical reference and translation accuracy verification

---

## Splash Screen

**Title**: ChromaWing *(brand name - not translated)*

**Subtitle**: A Genetics Breeding Game

**Descriptions**:
- Breed beautiful parrots and explore the fascinating world of genetics.
- Create unique color combinations, compete in contests, and discover rare mutations!

**Buttons**:
- Start Playing
- New Game

**Features**:
- 78 Genes Per Parrot
- Vibrant Color Genetics
- Multiple Contest Types

---

## Language Selector

**Label**: Select Language *(added during localization)*

**Language Names**:
- English
- Español
- Français
- Русский
- Українська

---

## Stats Bar (Header)

- Coins
- Parrots
- Generation
- Mutations
- Auto-Exam
- ON
- OFF

---

## Navigation Tabs

- Collection
- Store
- Breeding
- Contests
- Gallery
- Color Lab

---

## Panel Headers & Hints

**Collection Panel**:
- Your Parrots
- Select 2 to breed

**Preview Panel**:
- Selected Parrot
- Click a parrot to view details

**Breeding Tab**:
- Select Parents
- Left Parent
- Right Parent
- Empty

---

## Parrot Cards

**Labels**:
- Gen {number}
- Beauty: {score}

**Rarity Levels**:
- Common
- Uncommon
- Rare
- Epic
- Legendary

**Beauty Levels**:
- Plain
- Decent
- Pretty
- Beautiful
- Stunning

**Body Parts**:
- Wings
- Special Wing
- Body
- Head
- Tail
- Accents

**Other**:
- Has Gradients
- Gradient

---

## Action Buttons

**Preview Panel Buttons**:
- Buy for {price} coins
- Examine in Laboratory
- Lock Parrot
- Unlock Parrot
- Breed on Left
- Breed on Right
- Enter Beauty Contest
- Hold to Sell ({value} coins)
- Release to Wild

**Tooltips**:
- Go to Breeding Lab
- Select both parents first
- Lab Examined
- Locked

**Hints**:
- Use "Move All to Collection" to enable breeding and contests

---

## Breeding Interface

**Slot Labels**:
- Left Parent
- Right Parent
- Empty
- Select from Collection

**Buttons**:
- Breed Parrots
- Cost: 50 coins *(also: "Cost: {cost} coins")*
- Breed Parrots (Cost: 50 coins) *(combined format)*

**Parrot Info**:
- Gen {number} • {rarity}

---

## Toast Notifications

### Breeding
- **Success**: Breeding successful!
- **Message**: 4 new chicks born!{examInfo} {total} total waiting in Breeding Lab.
- **Auto-exam info**: {count} examined (-{totalCost} coins).
- **Auto-exam need**: Auto-exam: Need {cost} coins per chick.
- **Error**: Not enough coins!
- **Error detail**: Breeding costs {cost} coins. You have {current}.

### Trading (Buy/Sell)
- **Buy success**: {name} joined your collection!
- **Buy detail**: {rarity} • Gen {generation} • -{price} coins
- **Sell success**: {name} sold
- **Sell detail**: +{value} coins
- **Locked error**: {name} is locked
- **Locked detail**: Unlock the parrot first to sell it

### Laboratory
- **Exam success**: Laboratory analysis complete
- **Exam detail**: {name} examined • -{cost} coins
- **Exam error**: Not enough coins!
- **Exam error detail**: Laboratory examination costs {cost} coins. You have {current}.

### Settings
- **Mutations on**: Mutations Enabled
- **Mutations on detail**: Breeding can introduce new genes
- **Mutations off**: Mutations Disabled
- **Mutations off detail**: Breeding will preserve pure genes
- **Auto-exam on**: Auto-Examine Enabled
- **Auto-exam on detail**: New offspring will be automatically examined if you have enough coins
- **Auto-exam off**: Auto-Examine Disabled
- **Auto-exam off detail**: You must manually examine offspring

### Offspring
- **Moved**: Offspring moved!
- **Moved detail**: {count} offspring moved to collection • +{examCount} examined
- **Sold**: Offspring sold!
- **Sold detail**: {count} offspring sold for {coins} coins (70% value)
- **Dismissed**: Offspring dismissed
- **Dismissed detail**: {count} offspring removed from breeding lab

### Contests
- **No selection**: No parrot selected
- **No selection detail**: Go to collection first
- **Requirements**: Does not meet requirements
- **Requirements detail**: {rule}
- **Not enough coins**: Not enough coins
- **Not enough detail**: Need {cost} coins

---

## Contests

**Header**: Beauty Contests for {name}

**Description**: Compete to win coins and badges. Beat each tier to unlock the next!

**Prompt**: Select a parrot from your collection to enter contests!

**Button**: Go to Collection

**Labels**:
- Entry
- Completed
- Complete
- Locked
- Enter
- Need {cost}

**Placements**:
- 1st place
- 2nd place
- 3rd place
- {n}th place

**Contest Tiers**:

1. **Beginner Beauty Show**
   - Description: A friendly local competition for budding beauties

2. **Rainbow Showcase**
   - Description: Celebrate diversity with colorful plumage
   - Rule: Must have at least 3 different beautiful colors

3. **Gradient Masters**
   - Description: Where smooth transitions steal the show
   - Rule: Must have at least 2 beautiful gradients

4. **Contrast Championship**
   - Description: Bold opposites make stunning statements
   - Rule: Must have at least one complementary color pair

5. **Elite Grand Prix**
   - Description: The ultimate test of chromatic perfection
   - Rule: Must have gradients AND complementary colors

**Generic Label**: Rule

---

## Laboratory Modal

**Title**: Laboratory Analysis

**Buttons**:
- Pay {cost} Coins & Examine
- Not Enough Coins

**Messages**:
- You need {amount} more coins

**Analysis Features**:
- Analysis Includes:
- 78 Gene Breakdown (6 body parts × 13 genes)
- Rarity Analysis with detailed scoring
- Beauty Assessment with color harmony
- RGB values for each body part
- One-time cost: {cost} coins per parrot

**Rarity Section**:
- Rarity Analysis
- Rarity Score
- Points by Body Part:
- Rarity Guide:
  - Pure (0 or 4 dominant): 2 pts per color
  - Nearly Pure (1 or 3): 1 pt per color
  - Mixed (2 dominant): 0 pts
  - Gradient: +4 pts (very rare!)

**Beauty Section**:
- Beauty Analysis
- Beauty Score
- Body Part Colors:
- Beauty Contribution by Part:
- Beauty Traits:
- Beauty Guide:
  - Different color gradients: +10 pts
  - Each beautiful solid color: +3 pts
  - Color diversity (3+ colors): +15 pts
  - Complementary colors: +18 pts
  - Contrasting colors: +12 pts
  - Different colors: +5 pts
  - Similar colors: -3 pts penalty

**DNA Section**:
- DNA Sequence
- Compact Genotype
- Format:
- Gradient
- Result
- Solid
- Red
- Green
- Blue

---

## Gallery

**Title**: Parrot Gallery

**Subtitle**: Explore curated parrots and your custom creations

**Loading**: Loading gallery...

**Sections**:
- Curated Collection
- Curated description: Beautiful parrots designed with RYB color wheel harmony
- My Creations
- My Creations description: Custom parrots you've designed in the Color Lab
- Empty state: No custom parrots yet!
- Empty prompt: Visit the Color Lab to create your first custom parrot

---

## Color Lab

**Title**: Color Lab - Gene Editor

**Subtitle**: Create custom parrots by controlling individual genes

**Input Placeholder**: Parrot name...

**Buttons**:
- Save to Gallery
- Randomize
- Reset

**Panel Header**: Gene Editor

**Channel Headers**:
- Red Channel
- Green Channel
- Blue Channel

**Quick Actions**:
- All
- None

**Gradient**:
- Enabled
- Disabled

**Other**:
- Resulting Color
- Live Preview
- Active Genes

---

## Notification Panel

**Header**: Notifications

**Button**: Clear All

**Empty State**: No notifications yet

**Confirmation**: Clear all notifications?

---

## Time Formats

- Just now
- {n}m ago
- {n}h ago
- {n}d ago

---

## Confirmation Dialogs

**New Game**: Start a new game? This will erase your current progress!

---

## Offspring Actions

**Buttons**:
- Move to Collection
- Sell All Offspring
- Dismiss All

---

## Notes

1. **Placeholders** are shown as `{variable}` - these are replaced with actual values at runtime
2. **Brand names** like "ChromaWing" and "RGB" should not be translated
3. **Toast messages** often have both a title and a message/detail component
4. **Button text** is typically short (10-20 chars) to fit UI constraints
5. **Descriptions** can be longer but should remain concise

---

## Translation Guidelines

When comparing translations to these originals:

1. **Tone**: Friendly, educational, encouraging
2. **Technical terms**: "RGB", "genes", "gradients" - use appropriate scientific terms
3. **Gaming terminology**: Use familiar gaming language (collection, store, contests, etc.)
4. **Casual language**: "budding beauties", "steal the show" - preserve playful tone
5. **Conciseness**: Keep translations similar in length to maintain UI layout

---

**Last Updated**: 2025-11-18
**Localization System Version**: 1.0.0
