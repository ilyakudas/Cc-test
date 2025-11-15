# Game Simulation Testing Setup

## Overview

Automated gameplay testing system for ChromaWing using Node.js headless simulation. Tests run the full game logic without browser/UI dependencies to validate mechanics, balance, and stability.

## Quick Start

```bash
# Install dependencies
npm install

# Run tests
npm test                  # Standard test suite
npm run test:quick        # Quick smoke test
npm run test:stress       # Comprehensive stress test
npm run simulate          # Interactive gameplay simulation
```

## What's Included

### Core Infrastructure

- **`tests/mocks.js`** - Browser API mocks (localStorage, etc.)
- **`tests/headless-simulator.js`** - Headless game simulator
- **`tests/runner.js`** - Test runner with colored output
- **`tests/simulate-gameplay.js`** - Interactive simulation script

### Test Scenarios

1. **Basic Gameplay** (`tests/scenarios/basic-gameplay.js`)
   - Tests buy → breed → manage collection loop
   - Validates state integrity
   - Checks error handling

2. **Economy Stress Test** (`tests/scenarios/economy-stress.js`)
   - Tests coin sustainability over 50-500 cycles
   - Checks for bankruptcy scenarios
   - Validates breeding sustainability

3. **Breeding Chains** (`tests/scenarios/breeding-chains.js`)
   - Tests multi-generation breeding (up to 20 generations)
   - Validates genetic inheritance
   - Checks generation tracking

4. **Rarity Distribution** (`tests/scenarios/rarity-distribution.js`)
   - Tests genetic rarity calculations
   - Validates distribution balance
   - Checks value correlation with rarity

## Example Output

```
╔═══════════════════════════════════════════════════════════╗
║    ChromaWing Game Simulation Test Suite                 ║
╚═══════════════════════════════════════════════════════════╝

Running: Standard Test Suite
Mode: normal
Scenarios: 4

[1/4] Basic Gameplay
    Tests core game loop with buying, breeding, and collection management

    ✓ PASSED (234ms)
    Metrics:
      finalCoins: 450
      finalParrots: 12
      totalBreedings: 20
```

## Architecture

The simulator wraps core game modules:
- `core/gameState.js` - State management
- `core/genetics.js` - Breeding algorithms
- `core/parrot.js` - Parrot class with calculations
- `lib/utils.js` - Random generation utilities

Tests run game actions (buy, breed, examine, lock, sell) and collect statistics without any UI rendering.

## Benefits

✅ **Fast** - Tests run in seconds (no browser startup)
✅ **Automated** - Can run in CI/CD pipelines
✅ **Comprehensive** - Tests hundreds of breeding cycles
✅ **Deterministic** - Reproducible results for debugging
✅ **Statistics** - Tracks rarity distribution, economy, generations

## Use Cases

### Development
- Quick smoke tests during feature development
- Regression testing after changes
- Balance validation for game mechanics

### CI/CD
- Automated testing on every commit
- Pre-deployment validation
- Performance benchmarking

### Game Design
- Economy balance tuning
- Rarity distribution verification
- Generation progression analysis

## Documentation

See `tests/README.md` for detailed documentation including:
- API reference for HeadlessGameSimulator
- How to write custom test scenarios
- Interpreting test results
- Troubleshooting guide

## Next Steps

To add new tests:
1. Create a scenario file in `tests/scenarios/`
2. Export `name`, `description`, and `run(simulator, options)` function
3. Add to test runner in `tests/runner.js`

Example:
```javascript
// tests/scenarios/my-test.js
export const name = 'My Test';
export const description = 'Tests X feature';

export async function run(simulator, options = {}) {
    simulator.reset();
    // Test logic here
    return { passed: true, errors: [], metrics: {} };
}
```

## Current Status

✅ Core infrastructure complete
✅ 4 test scenarios implemented
✅ Test runner with colored output
✅ Interactive simulation mode
⚠️ Tests may need tuning for balance expectations

The testing system is **fully functional** and ready to use. Tests are currently exposing some game balance considerations (rarity distribution, economy tightness) which is valuable feedback for game design.
