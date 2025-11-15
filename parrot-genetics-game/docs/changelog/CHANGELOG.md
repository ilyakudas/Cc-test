# Changelog

**Purpose**: Summary of all versions and major changes.

**Note**: This project uses semantic versioning (major.minor.patch) to track releases.

## Version Overview

| Version | Date | Summary | Details |
|---------|------|---------|---------|
| v1.1 | Nov 2024 | Architecture refactoring, Alpine.js integration | [v1.1 Details](v1.1.md) |
| v1.0 | Nov 2024 | Initial feature set with UI improvements | [v1.0 Details](v1.0.md) |

## Quick Reference

### v1.1 - Architecture Improvements
**Focus**: Code organization and reactive UI

**Key Changes**:
- Modular architecture (25 focused modules)
- Alpine.js reactive framework integration
- Fixed heart button state synchronization
- localStorage migration from cookies
- Improved performance and maintainability

**Status**: Current version

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

### 2024-11
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
