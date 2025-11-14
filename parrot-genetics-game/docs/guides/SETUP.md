# Development Setup Guide

**Purpose**: Instructions for setting up development environment and running the game locally.

**Related docs**: [Architecture Overview](../architecture/OVERVIEW.md)

## Prerequisites

### Required
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Text editor or IDE (VS Code, Sublime, etc.)
- Basic knowledge of HTML/CSS/JavaScript

### Optional (for deployment)
- Firebase CLI (`npm install -g firebase-tools`)
- Node.js and npm (for Firebase CLI)
- Git (for version control)

## Quick Start

**Simplest Method**: Open HTML file directly
```
1. Navigate to project folder
2. Open `public/breeding-game-modular.html` in browser
3. Start playing!
```

**Limitations**:
- No module loading in some browsers (CORS restrictions)
- May need to use alternative method

## Local Development Server

### Option 1: Python HTTP Server

**Python 3**:
```bash
cd project-root
python -m http.server 8000
```

**Python 2**:
```bash
cd project-root
python -m SimpleHTTPServer 8000
```

**Access**: Open browser to `http://localhost:8000/public/breeding-game-modular.html`

### Option 2: Node.js HTTP Server

**Install**:
```bash
npm install -g http-server
```

**Run**:
```bash
cd project-root
http-server -p 8000
```

**Access**: Same as Python method

### Option 3: Firebase Local Emulator

**Install Firebase CLI**:
```bash
npm install -g firebase-tools
```

**Login**:
```bash
firebase login
```

**Serve Locally**:
```bash
cd project-root
firebase serve
```

**Access**: Open browser to URL shown (usually `http://localhost:5000`)

**Benefits**:
- Tests production deployment configuration
- Matches live site behavior
- Includes caching headers

## Project Structure

```
cc-test/
├── index.html                     # Root landing page
├── firebase.json                  # Firebase hosting config
├── .firebaserc                    # Firebase project ID
│
├── public/                        # Deployed files
│   ├── index.html                # Public homepage
│   ├── breeding-game-modular.html # Main game (modular)
│   ├── breeding-game.html         # Main game (legacy monolithic)
│   ├── breeding-game.css          # Game styles
│   ├── Parrot-1-recolored.svg     # Parrot SVG template
│   │
│   └── js/                        # Modular JavaScript
│       ├── main.js                # Entry point
│       ├── core/                  # Core systems
│       ├── actions/               # User actions
│       ├── ui/                    # UI components
│       └── lib/                   # Utilities
│
└── parrot-genetics-game/          # Documentation & design
    ├── README.md
    ├── docs/
    └── design/
```

## Development Workflow

### Basic Workflow

1. Start local server
2. Open game in browser
3. Make code changes
4. Refresh browser to see changes
5. Test functionality
6. Repeat

### Hot Reload (Optional)

Use browser extension or tool for automatic refresh:
- Live Server (VS Code extension)
- BrowserSync
- Parcel/Webpack dev server

### Browser DevTools

**Essential Tools**:
- Console: View logs, errors
- Inspector: Examine DOM, styles
- Network: Check file loading
- Application: View localStorage saves

**Debugging**:
- Set breakpoints in JavaScript
- Inspect game state variables
- Monitor network requests (SVG loading)
- Check localStorage (game saves)

## Testing Changes

### Manual Testing Checklist

After making changes, verify:
- [ ] Game loads without errors (check console)
- [ ] Can select parrots
- [ ] Can breed parrots
- [ ] Can buy/sell parrots
- [ ] Can examine parrots
- [ ] Badges appear correctly
- [ ] Toasts show appropriate messages
- [ ] Game saves and loads

### Testing Specific Features

**Breeding System**:
1. Select two parrots
2. Click breed button
3. Verify offspring appear
4. Check genetics match expectations

**Lock System**:
1. Lock a parrot
2. Verify badge appears
3. Try to sell (should be blocked)
4. Unlock and retry (should work)

**Auto-Examine**:
1. Toggle auto-examine on
2. Breed parrots
3. Verify automatic examination
4. Check coin deduction correct

### Browser Compatibility

Test in multiple browsers:
- Chrome/Edge (Chromium)
- Firefox
- Safari (if on Mac)

**Common Issues**:
- ES6 module support
- localStorage availability
- SVG rendering differences

## Common Development Tasks

### Adding New Feature

1. Determine which module(s) to modify
2. Update relevant files in `public/js/`
3. Test locally
4. Update documentation

See [Adding Features Guide](ADDING_FEATURES.md) for details

### Modifying Styles

1. Edit `public/breeding-game.css`
2. Refresh browser (no build step)
3. Verify responsive behavior

### Debugging Issues

1. Check browser console for errors
2. Add console.log() statements
3. Use breakpoints in DevTools
4. Check localStorage state

See [Debugging Guide](DEBUGGING.md) for common issues

### Testing Save/Load

**Clear Save**:
```javascript
// In browser console:
localStorage.removeItem('chromawing_save')
location.reload()
```

**Inspect Save**:
```javascript
// In browser console:
const save = localStorage.getItem('chromawing_save')
console.log(JSON.parse(save))
```

**Backup Save**:
```javascript
// In browser console:
const save = localStorage.getItem('chromawing_save')
console.log(save) // Copy this string to backup
```

## Deployment

### Firebase Hosting

**Prerequisites**:
- Firebase project created
- Firebase CLI installed
- Service account configured

**Deploy**:
```bash
firebase deploy
```

**Test Before Deploy**:
```bash
firebase serve
```

**Automatic Deployment**:
- Push to `main` branch
- GitHub Actions runs deployment
- Live site updates automatically

See `FIREBASE_SETUP.md` for initial setup

### Alternative Hosting

Game is static HTML/CSS/JS, can be hosted on:
- GitHub Pages
- Netlify
- Vercel
- Any static file host

**Requirements**:
- Serve `public/` directory
- Enable SPA routing (all routes → index.html)
- Set caching headers (optional)

## Troubleshooting

### Module Loading Errors

**Error**: "Cannot use import statement outside a module"

**Solution**:
- Ensure using local server (not file://)
- Check `<script type="module">` in HTML
- Verify file extensions (.js)

### CORS Errors

**Error**: "Cross-origin request blocked"

**Solution**:
- Use local server (not file://)
- Check browser security settings
- Ensure all files in same origin

### SVG Not Loading

**Error**: Parrot cards show empty or broken

**Solution**:
- Check `Parrot-1-recolored.svg` exists in `public/`
- Verify file path in code
- Check browser network tab for 404s
- Ensure SVG file not corrupted

### Save Not Persisting

**Error**: Game state lost on refresh

**Solution**:
- Check localStorage available (not private browsing)
- Inspect console for save errors
- Verify localStorage not full
- Check browser settings allow local data

### Performance Issues

**Problem**: Game laggy with many parrots

**Solutions**:
- Check browser DevTools performance tab
- Reduce number of parrots for testing
- Consider virtual scrolling implementation
- Profile JavaScript execution

## Development Tips

### Use Console Logging Strategically
```javascript
console.log('Breeding:', offspring.length, 'offspring created')
```
- Helps track flow
- Verify state changes
- Debug timing issues

### Leverage Browser DevTools
- Set breakpoints in breeding logic
- Watch variables change
- Step through code execution

### Test Edge Cases
- Empty collection
- Full collection
- Zero coins
- Maximum coins
- All offspring locked
- No offspring

### Keep Backups of Saves
- Copy localStorage before major changes
- Test with fresh save
- Restore if needed

## Resources

### Project Documentation
- [Architecture Overview](../architecture/OVERVIEW.md)
- [Module Structure](../MODULE_STRUCTURE.md)
- [Feature Docs](../features/)

### External Resources
- [MDN Web Docs](https://developer.mozilla.org/)
- [Firebase Hosting Docs](https://firebase.google.com/docs/hosting)
- [ES6 Modules Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)

### Tools
- [VS Code](https://code.visualstudio.com/)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [Firebase CLI](https://firebase.google.com/docs/cli)
