# Documentation Reorganization Plan

## Problem Statement

Current documentation structure has issues:
1. **UI_IMPROVEMENTS.md is 1,744 lines** - too long to be useful
2. **Mixed concerns** - features, bugs, architecture, commits all in one file
3. **Hard to navigate** - Claude Code must read entire file to find relevant info
4. **No clear hierarchy** - flat structure makes it hard to know where to look

## Proposed Structure

### Hierarchy Overview

```
parrot-genetics-game/
├── README.md                    # Project overview, quick start
├── docs/
│   ├── INDEX.md                # 📋 Navigation guide (read this first!)
│   │
│   ├── architecture/           # 🏗️ System architecture
│   │   ├── OVERVIEW.md        # High-level architecture (modules, patterns)
│   │   ├── MODULE_STRUCTURE.md # Detailed module reference (exists)
│   │   ├── STATE_MANAGEMENT.md # GameState patterns
│   │   └── ALPINE_INTEGRATION.md # Reactive UI with Alpine.js (exists)
│   │
│   ├── systems/               # ⚙️ Game systems (how things work)
│   │   ├── GENETICS.md       # Breeding, inheritance, mutations
│   │   ├── BEAUTY.md         # Beauty calculation (exists as BEAUTY_SYSTEM.md)
│   │   ├── CONTESTS.md       # Contest tiers, rewards (exists as CONTESTS_SYSTEM.md)
│   │   ├── STORAGE.md        # Save/load system
│   │   └── UI_RENDERING.md   # SVG generation, card rendering
│   │
│   ├── features/             # ✨ Feature documentation (what exists)
│   │   ├── BREEDING_LAB.md  # Breeding tab, slots, predictions
│   │   ├── OFFSPRING.md     # Offspring management, actions
│   │   ├── AUTO_EXAMINE.md  # Auto-examination system
│   │   ├── LOCK_SYSTEM.md   # Parrot locking
│   │   ├── SPLASH_SCREEN.md # Welcome screen
│   │   └── VISUAL_INDICATORS.md # Badges, animations
│   │
│   ├── guides/              # 📚 How-to guides
│   │   ├── SETUP.md        # Development environment setup
│   │   ├── ADDING_FEATURES.md # Step-by-step for common tasks
│   │   ├── DEBUGGING.md    # Common issues and solutions
│   │   └── TESTING.md      # Testing checklist
│   │
│   └── changelog/          # 📝 Version history
│       ├── CHANGELOG.md    # Summary of all versions
│       ├── v1.0.md        # Detailed v1.0 changes
│       └── v1.1.md        # Detailed v1.1 changes
│
├── design/                 # 🎨 Game design (what we want to build)
│   ├── GAMEPLAY_MECHANICS.md (exists)
│   ├── VISUAL_CONCEPTS.md (exists)
│   ├── GENETICS_DESIGN.md # Move from docs/, design-focused
│   └── QUICK_REFERENCE.md (exists)
│
└── tasks/                 # 📋 Active development tasks
    └── ACTIVE.md         # Current tasks only (not historical)
```

## Document Size Guidelines

**Target sizes for optimal readability:**
- Index/overview files: 50-150 lines
- Feature documentation: 100-300 lines
- System documentation: 200-400 lines
- Guides: 150-350 lines
- Changelog entries: 200-500 lines per version

## Documentation Principles

### 1. Single Responsibility
Each document covers ONE topic:
- ❌ Bad: "UI_IMPROVEMENTS.md" covering features, bugs, architecture, commits
- ✅ Good: "BREEDING_LAB.md" covering only the breeding lab feature

### 2. Clear Navigation
- INDEX.md provides navigation map
- Each doc starts with "Purpose" section
- Each doc links to related docs

### 3. Appropriate Detail Level
- **Features**: What it does, how to use it, key implementation details
- **Systems**: How it works internally, algorithms, data flow
- **Guides**: Step-by-step instructions with examples
- **Changelog**: What changed, why, impact

### 4. Easy to Find
Claude Code should be able to:
- Read INDEX.md to understand what exists
- Navigate directly to relevant doc
- Get answer in < 300 lines of reading

## Migration Plan

### Phase 1: Create Structure
1. Create `docs/INDEX.md` - navigation guide
2. Create directory structure
3. Create template files with "Purpose" sections

### Phase 2: Extract Features (from UI_IMPROVEMENTS.md)
1. `features/BREEDING_LAB.md` - Lines 86-143, 297-347
2. `features/OFFSPRING.md` - Lines 297-347, 906-971
3. `features/AUTO_EXAMINE.md` - Lines 144-183
4. `features/LOCK_SYSTEM.md` - Lines 1306-1468
5. `features/SPLASH_SCREEN.md` - Lines 17-43
6. `features/VISUAL_INDICATORS.md` - Lines 185-295

### Phase 3: Extract Systems
1. `systems/GENETICS.md` - From design/GENETICS_SYSTEM.md (already good)
2. `systems/STORAGE.md` - Lines 1050-1074, bug #13 info
3. `systems/UI_RENDERING.md` - SVG generation, card rendering logic

### Phase 4: Create Guides
1. `guides/SETUP.md` - Development commands, Firebase setup
2. `guides/ADDING_FEATURES.md` - Common workflows from UI_IMPROVEMENTS
3. `guides/DEBUGGING.md` - Bug patterns from UI_IMPROVEMENTS
4. `guides/TESTING.md` - Testing checklist from UI_IMPROVEMENTS

### Phase 5: Create Changelog
1. `changelog/CHANGELOG.md` - Summary table
2. `changelog/v1.0.md` - Extract features/bugs from sessions 1-3
3. `changelog/v1.1.md` - Extract refactoring, Alpine.js integration

### Phase 6: Cleanup
1. Archive `UI_IMPROVEMENTS.md` to `tasks/archive/`
2. Update CLAUDE.md to reference new structure
3. Add links between related docs

## Example: INDEX.md

```markdown
# ChromaWing Documentation Index

**Purpose**: Navigation guide for all documentation

## 🚀 Getting Started
- [README](../README.md) - Project overview
- [Setup Guide](guides/SETUP.md) - Development environment
- [Architecture Overview](architecture/OVERVIEW.md) - System design

## 📖 By Role

### I want to understand how it works
- [Architecture Overview](architecture/OVERVIEW.md)
- [Module Structure](architecture/MODULE_STRUCTURE.md)
- [State Management](architecture/STATE_MANAGEMENT.md)

### I want to add a feature
- [Adding Features Guide](guides/ADDING_FEATURES.md)
- [Module Structure](architecture/MODULE_STRUCTURE.md)
- Related system docs as needed

### I want to fix a bug
- [Debugging Guide](guides/DEBUGGING.md)
- [Testing Checklist](guides/TESTING.md)
- [Known Issues](changelog/CHANGELOG.md#known-issues)

### I want to understand a specific feature
- [Breeding Lab](features/BREEDING_LAB.md)
- [Lock System](features/LOCK_SYSTEM.md)
- [Auto-Examine](features/AUTO_EXAMINE.md)
- etc.

## 📁 By Category

### Architecture (How it's built)
- [Overview](architecture/OVERVIEW.md) - High-level design
- [Module Structure](architecture/MODULE_STRUCTURE.md) - All modules
- [State Management](architecture/STATE_MANAGEMENT.md) - GameState patterns
- [Alpine Integration](architecture/ALPINE_INTEGRATION.md) - Reactive UI

### Systems (How things work)
- [Genetics](systems/GENETICS.md) - Breeding, inheritance
- [Beauty](systems/BEAUTY.md) - Beauty calculation
- [Contests](systems/CONTESTS.md) - Contest system
- [Storage](systems/STORAGE.md) - Save/load
- [UI Rendering](systems/UI_RENDERING.md) - SVG, cards

### Features (What exists)
- [Breeding Lab](features/BREEDING_LAB.md)
- [Offspring Management](features/OFFSPRING.md)
- [Auto-Examine](features/AUTO_EXAMINE.md)
- [Lock System](features/LOCK_SYSTEM.md)
- [Splash Screen](features/SPLASH_SCREEN.md)
- [Visual Indicators](features/VISUAL_INDICATORS.md)

### Guides (How to do things)
- [Setup](guides/SETUP.md)
- [Adding Features](guides/ADDING_FEATURES.md)
- [Debugging](guides/DEBUGGING.md)
- [Testing](guides/TESTING.md)

### Changelog (What changed)
- [All Versions](changelog/CHANGELOG.md)
- [v1.0](changelog/v1.0.md) - Initial features
- [v1.1](changelog/v1.1.md) - Refactoring, Alpine.js
```

## Benefits

### For Claude Code
1. **Faster navigation** - Read INDEX.md (150 lines) instead of full task doc (1,744 lines)
2. **Targeted reading** - Only read relevant 200-300 line doc
3. **Clear context** - Each doc has clear purpose and scope
4. **Easy updates** - Update one feature doc without touching others

### For Developers
1. **Better organization** - Clear structure
2. **Easier maintenance** - Small files are easier to update
3. **Better understanding** - Focused docs are easier to read
4. **Better onboarding** - New developers know where to look

### For Future Work
1. **Easier to extend** - Add new feature docs without bloating existing ones
2. **Version tracking** - Changelog structure makes history clear
3. **Reference material** - Guides and system docs serve as reference
4. **Task focus** - Tasks file only contains active work

## Implementation Notes

1. **Keep existing good docs** - MODULE_STRUCTURE.md, BEAUTY_SYSTEM.md, etc. are already well-structured
2. **Extract, don't rewrite** - Pull content from UI_IMPROVEMENTS.md, clean up, organize
3. **Add navigation** - Each doc should link to related docs
4. **Use templates** - Consistent structure across similar doc types

## Next Steps

1. Review this plan
2. Create directory structure
3. Create INDEX.md
4. Start extracting content from UI_IMPROVEMENTS.md
5. Update CLAUDE.md to reference new structure
