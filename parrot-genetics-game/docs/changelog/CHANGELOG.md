# Changelog

**Purpose**: Summary of all versions and major changes.

**Note**: This project uses semantic versioning (major.minor.patch) to track releases.

## Version Overview

| Version | Date | Summary | Details |
|---------|------|---------|---------|
| Unreleased | Nov 2025 | Localization (5 languages), Wild Mate system, RYB color explorer | See below |
| v1.3 | Nov 2025 | Splash-screen version, mobile responsive layout | See below |
| v1.2 | Nov 2025 | Card color palettes, Gallery, Color Lab | See below |
| v1.1 | Nov 2025 | Architecture refactoring, Alpine.js integration | [v1.1 Details](v1.1.md) |
| v1.0 | Nov 2025 | Initial feature set with UI improvements | [v1.0 Details](v1.0.md) |

**Current in-game version**: `v1.3.3` (set by `VERSION` in `public/breeding-game-modular.html`). The Unreleased changes are live on `main` but have not had a version bump yet.

## Quick Reference

### Unreleased - Localization & Wild Mate
**Focus**: Reaching more players and adding a conservation loop

**Key Changes**:
- Localization system (`lib/i18n.js`) with English, Spanish, French, Russian and Ukrainian, a flag-based language selector on the splash screen, and a reactive Alpine `i18n` store (see `LOCALIZATION_IMPLEMENTATION.md` and `public/locales/TRANSLATION_GUIDE.md`)
- Wild Mate system: release parrots to a wild gene pool for conservation credits, then search the pool for a wild mate. Adds performance genes (agility, stamina, speed, etc.) and migrates old saves. Its UI text is English-only for now (see `WILD_MATE_IMPLEMENTATION.md`)
- Costs and coin values moved into a central economy module (`lib/economy.js`)
- Predictions panel converted to a reactive Alpine.js component
- RYB color wheel beauty design doc (`docs/BEAUTY_SYSTEM_COLOR_WHEEL.md`). It drives the Gallery showcase but not the beauty score yet
- Standalone RYB color explorer page (`public/ryb-color-explorer.html`)

**Status**: Live on `main`, no version bump yet

### v1.3 - Splash Version & Mobile
**Focus**: Release hygiene and phone-sized screens

**Key Changes**:
- Version moved to the splash screen with a single source of truth (`VERSION` constant) (v1.3.0)
- Mobile responsive layout: icon-only tabs and action buttons on portrait screens, smaller breeding slots with directional indicators, hidden Selected Parrot panel on portrait (v1.3.1)
- iPhone spacing fixes and smaller color squares and cards on mobile (v1.3.1 - v1.3.3)

**Status**: Current version (v1.3.3)

### v1.2 - Color Exploration
**Focus**: Seeing and experimenting with color

**Key Changes**:
- Color palette on parrot cards showing each body part's color (v1.2.0)
- Gallery tab with showcase parrots built on the RYB color wheel (v1.2.1)
- Color Lab gene editor with gradient visualization in the resulting color (v1.2.1)

**Status**: Superseded by v1.3

### v1.1 - Architecture Improvements
**Focus**: Code organization and reactive UI

**Key Changes**:
- Modular architecture (25 focused modules)
- Alpine.js reactive framework integration
- Fixed heart button state synchronization
- localStorage migration from cookies
- Improved performance and maintainability

**Status**: Superseded by v1.2

### v1.0 - Initial Release
**Focus**: Core features and UI polish

**Key Features**:
- Splash screen with animations
- Dedicated Breeding Lab tab
- Auto-Examine system
- Parrot lock system
- Visual indicator badges (L/R, examined, locked)
- Offspring management
- Contest system
- Beauty calculation
- Save/load system

**Status**: Superseded by v1.1

## Migration Notes

### Upgrading from v1.0 to v1.1

**Automatic**:
- Cookie saves automatically migrated to localStorage
- All features preserved
- No user action required

**Changes**:
- Saves now in localStorage (not cookies)
- Module structure reorganized (developers only)
- Alpine.js added for reactive components

## Future Versions

### Planned Features
- Additional contest tiers
- Breeding lineage tracking
- Achievement system expansion
- Trading system
- Seasonal events
- Mobile app version

### Potential Improvements
- Performance optimizations
- Additional parrot body parts
- More genetic complexity
- Multiplayer features
- User-generated content

## Version History

### 2025-11 (later)
- Unreleased: Localization, Wild Mate system, RYB color explorer
- v1.3.3: Smaller color squares and card width on mobile
- v1.3.1: Mobile responsive layout, iPhone color palette spacing fixes
- v1.3.0: Version on splash screen
- v1.2.1: Gallery tab and Color Lab gene editor
- v1.2.0: Color palette on parrot cards

### 2025-11 (earlier)
- v1.1.1: Minor fixes and documentation
- v1.1.0: Major refactoring to modular architecture
- v1.0.5: Heart button fixes
- v1.0.4: Lock system additions
- v1.0.3: Bug fixes and improvements
- v1.0.2: Breeding lab enhancements
- v1.0.1: Initial bug fixes
- v1.0.0: Initial release

## Deprecations

### Removed in v1.1
- Cookie-based save system (migrated to localStorage)
- Monolithic JavaScript file (split into modules)

### Legacy Support
- Old cookie saves automatically migrated
- Legacy `breeding-game.html` still available for reference
- Modular version recommended for all new development

## Breaking Changes

### v1.1
**For Players**: None (seamless migration)

**For Developers**:
- Module imports restructured
- Some function signatures changed
- Alpine.js dependency added
- Build process unchanged (still static)

## Documentation Changes

See [DOCUMENTATION_PLAN.md](../DOCUMENTATION_PLAN.md) for documentation reorganization.

**New Documentation Structure** (post-v1.1):
- Features documented separately
- Systems explained in detail
- Guides for common tasks
- Architecture documentation added
