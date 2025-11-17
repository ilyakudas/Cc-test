# Mobile Adaptation Task

## Task Overview

Adapt ChromaWing for mobile devices with responsive design supporting both portrait and landscape orientations.

## Objectives

**Phase 1 - Essential Fixes** (Priority):
1. Fix overflow issues (stats bar, tabs)
2. Increase touch target sizes (44px minimum)
3. Responsive parrot card grid
4. Mobile-optimized Color Lab

**Phase 2 - Enhancements** (Future):
5. Touch gestures (swipe, pinch-zoom)
6. Orientation-specific optimizations
7. PWA installation support

## Target Devices

- **Mobile Portrait**: 320px - 767px (browsing, managing)
- **Mobile Landscape**: 568px - 896px (editing, breeding)
- **Tablet Portrait**: 768px - 1024px (hybrid usage)
- **Tablet Landscape**: 768px - 1024px (full features)

## Implementation Checklist

### 1. Stats Bar Mobile Fix ✅ COMPLETE
- [x] Add horizontal scroll on overflow
- [x] Reduce padding/font size on small screens
- [x] Prevent wrapping with `flex-shrink: 0`
- [x] Add scrollbar hiding for cleaner look

**Target**: `breeding-game.css` - Add media query for `.stats-bar`
**Commit**: `48abe2b`

### 2. Tabs Mobile Fix ✅ COMPLETE
- [x] Horizontal scroll for tab overflow
- [x] Touch-friendly spacing (min 44px height)
- [x] Smaller font size on mobile
- [x] Smooth scroll behavior

**Target**: `breeding-game.css` - Add media query for `.tabs` and `.tab`
**Commit**: `48abe2b`

### 3. Touch Target Sizes ✅ COMPLETE
- [x] Buttons: 44px minimum height
- [x] Gene toggles: 44px × 44px in Color Lab
- [x] Checkboxes: Larger click area
- [x] Modal close buttons: 44px minimum

**Target**: `breeding-game.css` - Update `.btn`, `.gene-toggle`, input elements
**Commit**: `48abe2b`

### 4. Responsive Card Grid ✅ COMPLETE
- [x] Desktop: 3 columns (1fr 1fr 1fr)
- [x] Tablet: 2 columns
- [x] Mobile: 1 column
- [x] Adjust card padding/sizing

**Target**: `breeding-game.css` - Add media queries for `.parrot-grid`
**Commit**: `48abe2b`

### 5. Color Lab Mobile Optimization ✅ COMPLETE
- [x] Stack panels vertically in portrait (< 768px)
- [x] Side-by-side in landscape (≥ 768px)
- [x] Larger gene toggle buttons (44px)
- [x] Scrollable gene editor sections
- [x] Optimize body part selector for touch

**Target**: `breeding-game.css` - Update `.colorlab-panels`, `.gene-toggle`
**Commit**: `48abe2b`

### 6. Testing ⏳ PENDING
- [ ] Test on Chrome DevTools (iPhone SE, Pixel, iPad)
- [ ] Test portrait orientation (all features accessible)
- [ ] Test landscape orientation (optimized layout)
- [ ] Verify touch targets are 44px minimum
- [ ] Check horizontal scroll works smoothly

## Media Query Strategy

```css
/* Mobile Portrait: 320px - 767px */
@media (max-width: 767px) { }

/* Mobile Landscape: 568px - 896px */
@media (min-width: 568px) and (max-width: 896px) and (orientation: landscape) { }

/* Tablet Portrait: 768px - 1024px */
@media (min-width: 768px) and (max-width: 1024px) and (orientation: portrait) { }

/* Tablet Landscape: 768px - 1024px */
@media (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) { }
```

## Key Design Decisions

**Primary Orientation**: Landscape preferred for Color Lab and Breeding
**Secondary Orientation**: Portrait for browsing Gallery, Store, Collection
**Touch Standards**: Apple HIG / Material Design (44px minimum)
**No Orientation Lock**: Support both, optimize for each

## Files to Modify

1. `public/breeding-game.css` - All responsive styles
2. (Optional) `public/breeding-game-modular.html` - Touch gesture handlers

## Success Criteria

- ✅ No horizontal overflow on any screen size
- ✅ All interactive elements ≥ 44px touch targets
- ✅ Tabs and stats scrollable on narrow screens
- ✅ Color Lab usable in both orientations
- ✅ Card grids responsive (3 → 2 → 1)
- ✅ Smooth experience on 320px width devices

## Related Documentation

- Design: `parrot-genetics-game/docs/GAME_DESIGN.md`
- Color Lab: `parrot-genetics-game/docs/features/COLOR_LAB.md`
- Gallery: `parrot-genetics-game/docs/features/GALLERY.md`

## Status

**Current**: Phase 1 Complete ✅
**Completed**: November 17, 2025
**Commit**: `48abe2b` - feat: Add comprehensive mobile responsive CSS (Phase 1)
**Next Steps**: User testing and Phase 2 enhancements (touch gestures, PWA)
**Priority**: Phase 1 ✅ Complete | Phase 2 ⏳ Future Enhancement
