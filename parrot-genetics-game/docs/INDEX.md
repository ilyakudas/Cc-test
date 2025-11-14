# ChromaWing Documentation Index

**Purpose**: Navigation guide for all documentation. Read this first to understand what exists and where to find it.

## 🚀 Quick Start

- [Project README](../README.md) - Project overview and game concept
- [Setup Guide](guides/SETUP.md) - Development environment setup
- [Architecture Overview](architecture/OVERVIEW.md) - High-level system design

## 📖 Find What You Need

### Understanding the System

**"How is this built?"**
- [Architecture Overview](architecture/OVERVIEW.md) - System design, patterns, module organization
- [Module Structure](MODULE_STRUCTURE.md) - Detailed module reference with exports
- [State Management](architecture/STATE_MANAGEMENT.md) - Centralized state patterns

**"How does [X] work internally?"**
- [Genetics System](systems/GENETICS.md) - Breeding, inheritance, mutations
- [Beauty System](BEAUTY_SYSTEM.md) - Beauty score calculation algorithm
- [Contest System](CONTESTS_SYSTEM.md) - Contest tiers, judging, rewards
- [Storage System](systems/STORAGE.md) - Save/load persistence
- [UI Rendering](systems/UI_RENDERING.md) - SVG generation, card rendering

### Working with Features

**"What features exist?"**
- [Breeding Lab](features/BREEDING_LAB.md) - Dedicated breeding interface with predictions
- [Offspring Management](features/OFFSPRING.md) - Managing bred parrots
- [Progressive Genetics](features/PROGRESSIVE_GENETICS.md) - Gradual complexity unlocking
- [Auto-Examine](features/AUTO_EXAMINE.md) - Automatic gene examination
- [Lock System](features/LOCK_SYSTEM.md) - Protecting valuable parrots
- [Splash Screen](features/SPLASH_SCREEN.md) - Welcome experience
- [Visual Indicators](features/VISUAL_INDICATORS.md) - Badges, animations, feedback

**"How do I add a feature?"**
- [Adding Features Guide](guides/ADDING_FEATURES.md) - Step-by-step workflows
- [Module Structure](MODULE_STRUCTURE.md) - Where to add code

**"How do I fix a bug?"**
- [Debugging Guide](guides/DEBUGGING.md) - Common patterns and solutions
- [Testing Guide](guides/TESTING.md) - Testing checklist

### Version History

**"What changed?"**
- [Changelog Summary](changelog/CHANGELOG.md) - All versions at a glance
- [v1.0 Details](changelog/v1.0.md) - Initial feature set
- [v1.1 Details](changelog/v1.1.md) - Refactoring and Alpine.js integration

## 📁 All Documentation by Category

### Architecture (System Design)
| Document | Description |
|----------|-------------|
| [Overview](architecture/OVERVIEW.md) | High-level architecture, design patterns |
| [Module Structure](MODULE_STRUCTURE.md) | Complete module reference |
| [State Management](architecture/STATE_MANAGEMENT.md) | GameState patterns and usage |
| [Alpine Integration](ALPINE_MIGRATION.md) | Reactive UI framework integration |

### Systems (Internal Mechanics)
| Document | Description |
|----------|-------------|
| [Genetics](systems/GENETICS.md) | Breeding mechanics, inheritance rules |
| [Beauty](BEAUTY_SYSTEM.md) | Beauty score calculation |
| [Contests](CONTESTS_SYSTEM.md) | Contest system mechanics |
| [Storage](systems/STORAGE.md) | Save/load system |
| [UI Rendering](systems/UI_RENDERING.md) | Visual rendering pipeline |

### Features (User-Facing)
| Document | Description |
|----------|-------------|
| [Breeding Lab](features/BREEDING_LAB.md) | Enhanced breeding interface |
| [Offspring Management](features/OFFSPRING.md) | Handling bred parrots |
| [Progressive Genetics](features/PROGRESSIVE_GENETICS.md) | Gradual complexity unlocking |
| [Auto-Examine](features/AUTO_EXAMINE.md) | Automatic examination |
| [Lock System](features/LOCK_SYSTEM.md) | Parrot protection |
| [Splash Screen](features/SPLASH_SCREEN.md) | Welcome screen |
| [Visual Indicators](features/VISUAL_INDICATORS.md) | UI feedback system |

### Guides (How-To)
| Document | Description |
|----------|-------------|
| [Setup](guides/SETUP.md) | Development environment |
| [Adding Features](guides/ADDING_FEATURES.md) | Common development workflows |
| [Debugging](guides/DEBUGGING.md) | Troubleshooting guide |
| [Testing](guides/TESTING.md) | Testing procedures |

### Changelog (History)
| Document | Description |
|----------|-------------|
| [Summary](changelog/CHANGELOG.md) | All versions overview |
| [v1.0](changelog/v1.0.md) | Initial feature set |
| [v1.1](changelog/v1.1.md) | Architecture improvements |

### Design Documents (Planning)
| Document | Description |
|----------|-------------|
| [Game Design](GAME_DESIGN.md) | Core concept and philosophy |
| [Technical Spec](TECHNICAL_SPEC.md) | Implementation specifications |
| [Design Decisions](DESIGN_DECISIONS.md) | Rationale for key choices |
| [Development Roadmap](DEVELOPMENT_ROADMAP.md) | Future plans |

## 🔍 Common Questions

**Q: Where do I start to understand the codebase?**
A: Read [Architecture Overview](architecture/OVERVIEW.md) → [Module Structure](MODULE_STRUCTURE.md)

**Q: How do I add a new contest tier?**
A: Read [Contest System](CONTESTS_SYSTEM.md) → [Adding Features Guide](guides/ADDING_FEATURES.md)

**Q: How does breeding work?**
A: Read [Genetics System](systems/GENETICS.md)

**Q: What UI improvements have been made?**
A: Read [v1.0 Changelog](changelog/v1.0.md) and [v1.1 Changelog](changelog/v1.1.md)

**Q: How do I set up for development?**
A: Read [Setup Guide](guides/SETUP.md)

## 📝 Documentation Standards

- **Requirements-focused**: Describes WHAT and WHY, not implementation HOW
- **Tech-agnostic where possible**: Focus on concepts that apply across tech stacks
- **Design specifications**: UI/UX requirements (layout, colors, interactions)
- **Behavior descriptions**: How systems should work, not code details
- **Small and focused**: Each document covers one topic (100-400 lines)
