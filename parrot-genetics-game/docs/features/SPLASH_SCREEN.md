# Splash Screen Feature

**Purpose**: Engaging welcome experience that introduces the game concept before entering the main interface.

**Related docs**: [Visual Indicators](VISUAL_INDICATORS.md)

## Overview

The Splash Screen is an animated introduction screen that appears when the game first loads. It provides branding, sets expectations, and creates a polished first impression.

## User Requirements

### Display Conditions

**When Shown**:
- On initial page load
- Before game interface appears
- Can be manually triggered (for testing/demo)

**When Hidden**:
- User clicks "Start Playing" button
- Automatic after timeout (optional, not currently implemented)

**Frequency**: Shows every time page loads (no "don't show again" option currently)

### Visual Design

**Layout**: Full-screen overlay
- Covers entire viewport
- No scrolling
- Centered content
- Dark background with gradient

**Background**:
- Color: Purple/pink gradient matching game theme
- Angle: 135deg diagonal
- Start color: #667eea (purple)
- End color: #764ba2 (violet)
- Opacity: Can be semi-transparent to show game behind

**Container**:
- Centered card/panel
- White or light background
- Rounded corners (8-12px)
- Drop shadow for depth
- Max-width for readability on large screens

### Content Structure

**Order (top to bottom)**:
1. Game logo/title
2. Tagline/description
3. Key features or selling points (optional)
4. "Start Playing" button

### Title Section

**Text**: "ChromaWing" or "🦜 ChromaWing"
- Font: Large, bold, eye-catching
- Size: 3-4em
- Color: Gradient or solid matching theme
- Animation: Bounce-in or fade-in

**Animation Requirements**:
- Smooth entrance (not jarring)
- Duration: 0.6-1 second
- Delay: 0-0.2s from screen appearance
- Easing: ease-out or bounce

### Description Section

**Content**: Brief game introduction
- Example: "A genetics-based parrot breeding simulation"
- Or: "Breed beautiful parrots, explore genetics, compete in contests"
- Font: Medium size (1.2-1.5em)
- Color: Slightly muted (not pure black)
- Animation: Fade-in after title

**Animation Requirements**:
- Delay: 0.3-0.5s (after title starts)
- Duration: 0.8s
- Easing: ease-in

### Feature List (Optional)

**Content**: 3-5 bullet points or icons highlighting game features
- Example: "🧬 Realistic Genetics", "🎨 Beauty Contests", "🔬 Laboratory"
- Layout: Vertical list or horizontal icons
- Animation: Sequential fade-in

**Animation Requirements**:
- Stagger: 0.1-0.2s between items
- Duration: 0.5s each
- Easing: ease-in

### Call-to-Action Button

**Text**: "Start Playing" or "Enter Game"
- Font: Bold, readable
- Size: 1.2-1.5em
- Color: White text on colored background

**Visual Design**:
- Background: Gradient matching game theme (purple/pink)
- Padding: Generous (12-16px vertical, 24-32px horizontal)
- Border-radius: 8px
- Shadow: Medium depth
- Cursor: Pointer

**States**:
- Default: Full opacity, base scale
- Hover: Scale 1.05, enhanced shadow
- Active/Click: Scale 0.95, reduced shadow

**Animation Requirements**:
- Entrance: Fade-in + scale
- Delay: After all other content
- Duration: 0.6s
- Hover transition: 0.3s

## Animation Specifications

### Fade-In Animation

**Keyframes**:
- 0%: opacity 0
- 100%: opacity 1

**Application**: Description text, feature list, button

### Bounce-In Animation

**Keyframes**:
- 0%, 20%, 50%, 80%, 100%: translateY(0)
- 40%: translateY(-20px)
- 60%: translateY(-10px)

**Application**: Title/logo

**Alternative**: Scale-based bounce
- 0%: scale(0)
- 50%: scale(1.1)
- 100%: scale(1)

### Sequential Timing

**Timeline** (example):
- 0s: Background appears (instant)
- 0s: Title starts bounce-in (0.6s)
- 0.3s: Description starts fade-in (0.8s)
- 0.5s: Features start staggered fade-in (0.5s each, 0.15s apart)
- 1.0s: Button starts fade-in (0.6s)
- 1.6s: All animations complete, user can interact

## Interaction Requirements

### Start Playing Button

**Click Action**:
1. Add CSS class to fade out splash screen
2. Transition duration: 0.4-0.6s
3. Once faded out, set display: none or remove from DOM
4. Game interface becomes visible/interactive

**Keyboard Support**:
- Enter key triggers button (accessibility)
- Escape key dismisses splash (optional)

### Background Click

**Behavior Options**:
1. Click anywhere to dismiss (quick access)
2. Only button dismisses (forces engagement)
3. Click outside card dismisses, inside requires button

**Recommendation**: Only button dismisses
- Prevents accidental dismissal
- Ensures user sees content
- Clearer interaction model

## Accessibility

**Focus Management**:
- Button receives focus when splash appears
- Enter key activates button
- Focus trap: Can't tab to game behind splash

**Screen Reader**:
- Title announced
- Description announced
- Button labeled clearly

**Motion Sensitivity**:
- Consider reduced-motion media query
- Fallback: Instant appearance, no animation
- Respects user preferences

## Design Rationale

### Why Splash Screen?

**First Impression**: Sets professional tone
- Shows polish and attention to detail
- Creates anticipation
- Establishes game's visual identity

**Context Setting**: Explains what game is
- New users understand concept
- Reduces confusion
- Marketing opportunity

**Loading Cover**: Hides initialization
- Game can load assets behind splash
- Smoother perceived performance
- No "loading..." spinner needed

### Why Animated?

**Engagement**: Static screen is boring
- Animation draws eye
- Creates sense of life
- More memorable experience

**Pacing**: Gives user moment to orient
- Not overwhelming with immediate full interface
- Smooth transition from outside world to game
- Natural pause before interaction

**Polish**: Shows quality
- Well-executed animation signals care
- Differentiates from amateur projects
- Builds trust in game quality

### Why Manual Dismissal (Not Auto)?

**User Control**: Player decides when ready
- Read at own pace
- No rushing
- Accessibility consideration

**Reliability**: No timing-based confusion
- Clear cause and effect
- Predictable behavior
- Works on slow devices

## Visual Design Requirements

### Colors

**Background Gradient**:
- Direction: 135deg (top-left to bottom-right)
- Color 1: #667eea at 0%
- Color 2: #764ba2 at 100%

**Content Card**:
- Background: #ffffff (white) or rgba(255,255,255,0.95)
- Border-radius: 12px
- Shadow: 0px 20px 60px rgba(0,0,0,0.3)

**Title**:
- Color: #667eea or gradient matching background
- Text-shadow: Optional subtle shadow for depth

**Description**:
- Color: #555555 or #333333

**Button**:
- Background: Linear gradient 135deg from #667eea to #764ba2
- Text: #ffffff
- Shadow: 0px 5px 15px rgba(102,126,234,0.4)
- Hover shadow: 0px 8px 20px rgba(102,126,234,0.5)

### Typography

**Title**:
- Font: Sans-serif (Segoe UI, Arial, system default)
- Size: 48-64px (3-4em)
- Weight: Bold
- Letter-spacing: -0.02em (slightly tight)

**Description**:
- Font: Same as title
- Size: 18-24px (1.2-1.5em)
- Weight: Normal
- Line-height: 1.6

**Button**:
- Font: Same as title
- Size: 18-22px (1.2-1.4em)
- Weight: 600 (semi-bold)

### Spacing

**Content Card**:
- Padding: 40-60px
- Max-width: 600px
- Margin: Auto (center)

**Element Gaps**:
- Title to description: 20px
- Description to features: 30px
- Features to button: 40px

## Future Enhancements

Potential additions:
- **Version number**: Show current game version
- **Update notes**: "What's new" for returning players
- **Credits**: Link to developer/artist credits
- **Don't show again**: Checkbox for returning players
- **Skip animation**: Button for quick access
- **Tutorial prompt**: "First time? Take the tutorial"
- **Language selection**: For internationalized versions
- **Sound toggle**: Preview audio before entering game
