# ChromaWing Game Simulation Tests

Automated gameplay testing system that runs the game logic headlessly in Node.js to validate mechanics, balance, and stability.

## Overview

This testing system allows you to:
- **Emulate full gameplay** without browser/UI
- **Test game mechanics** (breeding, genetics, economy)
- **Validate balance** (economy sustainability, rarity distribution)
- **Catch bugs** (state corruption, calculation errors)
- **Track statistics** (breeding chains, generation progression)

## Quick Start

```bash
# Install dependencies
npm install

# Run standard test suite
npm test

# Run quick tests (fast smoke test)
npm run test:quick

# Run stress tests (comprehensive)
npm run test:stress

# Run gameplay simulation (interactive)
npm run simulate
```

## Test Modes

### Quick Test (`npm run test:quick`)
Fast smoke test for rapid iteration during development.
- 5 gameplay cycles
- 50 parrot sample for rarity
- ~1-2 seconds

### Standard Test (`npm test`)
Comprehensive test suite for regular validation.
- 20 gameplay cycles
- 100 parrot sample
- Economy stress test (50 cycles)
- Breeding chains (5 generations)
- ~5-10 seconds

### Stress Test (`npm run test:stress`)
Extensive testing for release validation.
- 100 gameplay cycles
- 500 parrot sample
- Economy stress (500 cycles)
- Deep breeding chains (20 generations)
- ~30-60 seconds

## Test Scenarios

### 1. Basic Gameplay
**File**: `scenarios/basic-gameplay.js`

Tests the core game loop:
- Buying parrots from store
- Breeding parrots
- Managing collection
- Examining parrots
- Locking parrots
- Selling parrots

**Validations**:
- ✓ Expected breeding count achieved
- ✓ Coins never negative
- ✓ Error rate acceptable
- ✓ State integrity maintained

### 2. Economy Stress Test
**File**: `scenarios/economy-stress.js`

Tests economy sustainability:
- Coin management over many cycles
- Buy/sell balance
- Recovery from low coins
- Prevention of bankruptcy

**Validations**:
- ✓ No bankruptcies (unplayable states)
- ✓ Average coins > 100 (healthy economy)
- ✓ Sustainable breeding rate
- ✓ Positive long-term coin flow

### 3. Breeding Chains
**File**: `scenarios/breeding-chains.js`

Tests multi-generation breeding:
- Genetic inheritance across generations
- Generation tracking accuracy
- Genetic diversity maintenance
- Gene validity through generations

**Validations**:
- ✓ Target generation reached
- ✓ Generation distribution correct
- ✓ Genetic diversity maintained
- ✓ Gene structure valid at all generations

### 4. Rarity Distribution
**File**: `scenarios/rarity-distribution.js`

Tests genetic calculations and rarity:
- Rarity calculation correctness
- Distribution balance
- Value correlation with rarity
- Beauty score calculations

**Validations**:
- ✓ Reasonable rarity distribution
- ✓ Multiple rarity types present
- ✓ Higher rarity = higher value
- ✓ Valid parrot properties

## Architecture

### Components

```
tests/
├── mocks.js                 # Browser API mocks (localStorage, etc.)
├── headless-simulator.js    # Game simulator (no UI dependencies)
├── runner.js                # Test runner with reporting
├── simulate-gameplay.js     # Interactive simulation script
└── scenarios/               # Test scenarios
    ├── basic-gameplay.js
    ├── economy-stress.js
    ├── breeding-chains.js
    └── rarity-distribution.js
```

### Headless Simulator

The `HeadlessGameSimulator` class wraps game logic without browser dependencies:

```javascript
import HeadlessGameSimulator from './headless-simulator.js';

const sim = new HeadlessGameSimulator();
sim.reset();

// Buy parrots
const p1 = sim.buyParrot();
const p2 = sim.buyParrot();

// Breed
const offspring = sim.breedParrots(p1, p2);
sim.moveOffspringToCollection();

// Check state
const state = sim.getState();
console.log(`Parrots: ${state.parrotCount}, Coins: ${state.coins}`);

// Get statistics
const stats = sim.getStats();
console.log(`Total breedings: ${stats.totalBreedings}`);
```

### API Reference

#### HeadlessGameSimulator Methods

**State Management**:
- `reset()` - Reset to initial game state
- `getState()` - Get current game state snapshot
- `getStats()` - Get accumulated statistics
- `validateState()` - Check state integrity

**Actions**:
- `buyParrot()` - Purchase a random parrot
- `breedParrots(parent1, parent2)` - Breed two parrots
- `moveOffspringToCollection()` - Move offspring to main collection
- `sellParrot(parrot)` - Sell a parrot for coins
- `examineParrot(parrot)` - Examine parrot genes
- `lockParrot(parrot)` - Lock parrot from selling

**Utilities**:
- `setVerbose(enabled)` - Enable/disable logging
- `log(message)` - Log if verbose enabled

## Writing Custom Tests

Create a new scenario in `scenarios/`:

```javascript
// scenarios/my-test.js

export const name = 'My Custom Test';
export const description = 'What this test does';

export async function run(simulator, options = {}) {
    const results = {
        passed: true,
        errors: [],
        metrics: {}
    };

    simulator.reset();
    simulator.setVerbose(options.verbose || false);

    try {
        // Your test logic here
        const p1 = simulator.buyParrot();
        const p2 = simulator.buyParrot();

        if (!p1 || !p2) {
            throw new Error('Failed to buy parrots');
        }

        const offspring = simulator.breedParrots(p1, p2);

        // Add metrics
        results.metrics.offspringCount = offspring.length;

        // Add assertions
        if (offspring.length !== 4) {
            results.errors.push(`Expected 4 offspring, got ${offspring.length}`);
            results.passed = false;
        }

    } catch (error) {
        results.passed = false;
        results.errors.push(error.message);
    }

    return results;
}
```

Then add to `runner.js`:

```javascript
import * as myTest from './scenarios/my-test.js';

// Add to config scenarios:
{ scenario: myTest, options: { verbose } }
```

## Output Format

### Test Runner Output

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
      ...

[2/4] Economy Stress Test
    ...
```

### Simulation Output

```
🦜 ChromaWing Gameplay Simulation

Starting game with 500 coins...

━━━ Buying Initial Parrots ━━━
  Bought parrot: Ruby (common) for 50 coins
  Bought parrot: Sky (uncommon) for 50 coins

━━━ Running 20 Breeding Cycles ━━━

--- Cycle 1/20 ---
  Collection: 2 parrots, Coins: 400
  Bred Ruby × Sky → 4 offspring (Gen 2)
  ...

━━━ Simulation Complete ━━━

Final State:
  Parrots in collection: 15
  Coins remaining: 350

Rarity Distribution:
  common        45 (45.0%) ██████████████████████
  uncommon      30 (30.0%) ███████████████
  rare          15 (15.0%) ███████
  epic           8  (8.0%) ████
  legendary      2  (2.0%) █
```

## Interpreting Results

### What Good Results Look Like

✅ **All tests passing**
✅ **Coins stay positive** (no bankruptcy)
✅ **Breeding sustainability > 50%** (can breed regularly)
✅ **Multiple rarity types** (3+)
✅ **No state validation errors**
✅ **Error rate < 20%** (mostly resource constraints)

### Warning Signs

⚠️ **Frequent bankruptcies** → Economy too harsh
⚠️ **Low breeding rate** → Actions too expensive
⚠️ **Single rarity dominates** → Genetics imbalanced
⚠️ **State validation fails** → Critical bugs
⚠️ **High error rate** → Logic problems

## Integration with CI/CD

Add to your CI pipeline:

```yaml
# .github/workflows/test.yml
- name: Install dependencies
  run: npm install

- name: Run game simulation tests
  run: npm test

- name: Run stress tests (optional)
  run: npm run test:stress
  if: github.ref == 'refs/heads/main'
```

## Troubleshooting

### "Cannot find module" errors
```bash
# Ensure you're using Node.js with ES module support
node --version  # Should be v14+

# Check package.json has "type": "module"
```

### Tests timing out
```bash
# Use quick mode for faster iteration
npm run test:quick

# Or reduce cycles in scenarios
```

### Unexpected failures
```bash
# Run with verbose logging
node tests/runner.js --verbose

# Run single simulation to see details
npm run simulate
```

## Performance

Typical execution times on modern hardware:

- **Quick test**: 1-2 seconds
- **Standard test**: 5-10 seconds
- **Stress test**: 30-60 seconds
- **Single simulation**: 2-3 seconds

## Future Enhancements

Potential additions:
- [ ] Contest system testing
- [ ] Achievement unlock testing
- [ ] Save/load persistence testing
- [ ] Beauty calculation validation
- [ ] Mutation rate verification
- [ ] Name uniqueness testing
- [ ] Performance benchmarking
- [ ] Visual snapshot testing (with Playwright)

## Contributing

When adding new features to the game:

1. **Add test scenario** for new mechanics
2. **Update existing tests** if behavior changes
3. **Run full test suite** before committing
4. **Document test expectations** in scenario comments

## License

Same as main project.
