# Quick Reference Guide

## Project Structure

```
alien-survival-game/
├── README.md                    - Game overview and concept
├── docs/
│   ├── game-mechanics.md       - Complete mechanics breakdown
│   ├── technical-specs.md      - Technical requirements & systems
│   └── quick-reference.md      - This file
└── design/
    ├── world-design.md         - Planet, biomes, environments
    ├── creatures-and-flora.md  - All fauna and flora
    └── story-and-lore.md       - Narrative, characters, endings
```

## Core Gameplay Loop

```
Explore → Gather → Craft → Build → Survive → Discover → Repeat
```

## Key Features at a Glance

### Survival
- Health, Hunger, Thirst, Oxygen, Stamina
- Day/Night cycle (32 hours)
- Weather system with 6+ types
- Resource management

### Combat
- Melee, Ranged, Traps
- Stealth mechanics
- 12+ enemy types
- Taming system

### Crafting
- 4 tiers (Primitive → Exotic)
- Multiple crafting stations
- 100+ recipes
- Blueprint discovery

### Exploration
- 8 major biomes
- Seamless open world
- Ancient ruins
- Hidden secrets

### Story
- Main quest: Uncover crash mystery
- Side content: Exploration and discovery
- 5 different endings
- Environmental storytelling

## Biomes Quick Reference

| Biome | Difficulty | Key Resources | Main Threat |
|-------|-----------|---------------|-------------|
| Prismatic Plains | Easy | Food, Fiber | Razor-Maws |
| Crystalline Forest | Medium | Crystals, Wood | Crystal Golems |
| Bioluminescent Caves | Medium | Minerals, Fungi | Oxygen, Cave-ins |
| Toxic Marshlands | Hard | Chemicals, Medicine | Toxins, Predators |
| Crimson Dunes | Hard | Minerals, Fossils | Dune Wyrms, Heat |
| Floating Islands | Hard | Rare Tech | Falls, Flying enemies |
| Shattered Coast | Medium | Seafood, Salvage | Tides, Sea creatures |
| Ancient Ruins | Very Hard | Technology | Security, Anomalies |

## Creature Danger Levels

- **None**: Lumiskippers, Harmony Birds, Shell-Backs
- **Low**: Prismatic Striders (defensive only)
- **Medium**: Spine-Crawlers
- **High**: Razor-Maws, Plasma Jellies, Echo Wraiths
- **Extreme**: Void Stalkers, Dune Wyrms, Crystal Golems, Tide Leviathan

## Development Priorities

### Phase 1: Prototype (Months 1-6)
- [ ] Basic movement and survival
- [ ] Simple crafting
- [ ] 1-2 biomes
- [ ] Basic creatures
- [ ] Combat foundation

### Phase 2: Core Systems (Months 7-12)
- [ ] Full survival mechanics
- [ ] Complete crafting system
- [ ] 4-5 biomes
- [ ] AI behaviors
- [ ] Base building

### Phase 3: Content (Months 13-18)
- [ ] All biomes
- [ ] All creatures and plants
- [ ] Story implementation
- [ ] Advanced features
- [ ] Quest system

### Phase 4: Polish (Months 19-24)
- [ ] Performance optimization
- [ ] Balancing
- [ ] Bug fixing
- [ ] Audio/Visual polish
- [ ] Playtesting

## Technical Stack Summary

**Engine**: Unreal Engine 5 (recommended)
**Language**: C++ / Blueprint
**Platforms**: PC (launch), Consoles (later)
**Target**: 60 FPS @ 1080p minimum
**Storage**: 50 GB

## Team Roles Needed

- **Game Designer**: 1-2
- **Programmers**: 3-4
- **3D Artists**: 3-4
- **Concept Artists**: 1-2
- **Animators**: 2
- **Audio Designer**: 1
- **Writer**: 1
- **QA Testers**: 2-3

## Key Documents to Read First

1. **README.md** - Understand the vision
2. **game-mechanics.md** - Know how it plays
3. **world-design.md** - See the setting
4. **story-and-lore.md** - Grasp the narrative
5. **technical-specs.md** - Implementation details

## Important Design Principles

1. **Isolation First**: Player should feel alone but curious
2. **Earned Discovery**: Nothing handed to player, everything found
3. **Meaningful Choices**: Decisions have consequences
4. **Environmental Story**: Show, don't tell
5. **Alien Authenticity**: This is NOT Earth
6. **Survival with Purpose**: Not just survival sim, there's a mystery

## Unique Selling Points

1. Living alien ecosystem that functions independently
2. Bioluminescent nights with stunning visuals
3. Multiple meaningful endings based on player choices
4. Ancient alien mystery woven throughout
5. True sense of isolation and discovery

## Testing Priorities

### Gameplay
- Survival balance (not too easy/hard)
- Combat feel (responsive, fair)
- Progression pacing (rewarding)
- Exploration incentives (worthwhile)

### Technical
- Performance (60 FPS target)
- Load times (minimize)
- Bug frequency (minimize crashes)
- AI behavior (believable)

### Narrative
- Story clarity (understandable)
- Environmental storytelling (effective)
- Multiple endings (all satisfying)
- Pacing (not rushed)

## Marketing Angles

- "Subnautica meets The Martian"
- Beautiful alien world
- Mystery and discovery
- Hardcore survival
- Stunning bioluminescent visuals
- Your choices matter

## Stretch Goals (If Time/Budget Allows)

- Co-op multiplayer (2-4 players)
- VR support
- Mod support
- New Game+ mode
- Photo mode
- Additional biomes
- DLC: New areas, creatures, story

## Contact & Resources

- Design Docs: `/alien-survival-game/`
- Asset Guidelines: TBD
- Code Standards: TBD
- Bug Tracker: TBD
- Team Chat: TBD

---

**Last Updated**: 2025-11-08
**Version**: 0.1 - Initial Concept
