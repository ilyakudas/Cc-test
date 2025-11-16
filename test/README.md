# ChromaWing Test Suite

Programmatic game emulation tests for the ChromaWing parrot breeding game.

## Overview

This test suite runs **JavaScript-based simulations** that test:
- **Genetics System**: Breeding mechanics, inheritance, mutations
- **Game Loop**: Buying, breeding, selling, examining, complete gameplay cycles

## Structure

```
test/
├── run-tests.js              # Main test runner
├── mocks/
│   └── browser-mocks.js      # Mock browser APIs (localStorage, document)
├── helpers/
│   └── test-utils.js         # Test utilities and assertions
├── tests/
│   ├── genetics-simulation.test.js    # Genetics tests
│   └── game-loop-emulation.test.js    # Game loop tests
└── README.md                 # This file
```

## Running Tests

### Quick Start

```bash
# Run all tests
node test/run-tests.js
```

### Requirements

- Node.js (v14+ recommended)
- No additional dependencies needed!

## Test Suites

### 1. Genetics Simulation Tests

Tests core breeding mechanics:
- ✅ Body part breeding produces valid genes
- ✅ Mendelian inheritance works correctly
- ✅ Mutations work correctly
- ✅ Full parrot breeding works
- ✅ Color calculation produces valid RGB
- ✅ Beauty calculation is consistent
- ✅ Value calculation is reasonable
- ✅ Mass breeding simulation (1000 cycles)

### 2. Game Loop Emulation Tests

Tests complete gameplay scenarios:
- ✅ Basic breeding cycle
- ✅ Multiple breeding cycles
- ✅ Selling parrots
- ✅ Examining parrots
- ✅ Auto-examine simulation
- ✅ Complete gameplay loop
- ✅ Lock system
- ✅ Generation tracking
- ✅ 100-turn gameplay simulation
- ✅ Stress test: 500 rapid breeding cycles

## What Gets Tested

### Genetics Tests
- Validates that breeding produces valid gene structures
- Ensures each allele is inherited from one parent (Mendelian inheritance)
- Confirms mutations occur at expected rate
- Verifies RGB color calculations are in valid range (0-255)
- Tests beauty and value calculations

### Game Loop Tests
- Simulates complete breeding cycles
- Tests economy (coins, buying, selling)
- Validates examination system
- Tests lock system
- Runs multi-turn gameplay simulations
- Stress tests with 500 breeding cycles (2000 offspring)

## Example Output

```
╔═══════════════════════════════════════════════════════════╗
║     ChromaWing - Game Emulation Test Suite               ║
╚═══════════════════════════════════════════════════════════╝

============================================================
Running: Genetics Simulation Tests
============================================================
✅ PASS: Body part breeding produces valid genes
✅ PASS: Mendelian inheritance works correctly
✅ PASS: Mutations work correctly
✅ PASS: Full parrot breeding works
✅ PASS: Color calculation produces valid RGB
✅ PASS: Beauty calculation is consistent
✅ PASS: Value calculation is reasonable

  Running 1000 breeding simulations...
  Beauty scores: { count: 1000, min: 0, max: 157, mean: 42.15 }
  Values: { count: 1000, min: 147, max: 481, mean: 248.33 }

✅ PASS: Mass breeding simulation (1000 cycles)

------------------------------------------------------------
Results: 8/8 passed, 0 failed
------------------------------------------------------------

============================================================
Running: Game Loop Emulation Tests
============================================================
✅ PASS: Basic breeding cycle
✅ PASS: Multiple breeding cycles
✅ PASS: Selling parrots
✅ PASS: Examining parrots
✅ PASS: Auto-examine simulation
✅ PASS: Complete gameplay loop
✅ PASS: Lock system
✅ PASS: Generation tracking

  Running 100-turn gameplay simulation...
  Coins over 100 turns: { count: 100, min: 350, max: 2847, mean: 1205.43 }
  Final generation: 12
  Final parrot count: 10

✅ PASS: 100-turn gameplay simulation

  Stress test: 500 rapid breeding cycles...
  Offspring beauty scores: { count: 2000, min: 0, max: 168, mean: 39.87 }
  Offspring values: { count: 2000, min: 138, max: 512, mean: 245.21 }

✅ PASS: Stress test: 500 rapid breeding cycles

------------------------------------------------------------
Results: 10/10 passed, 0 failed
------------------------------------------------------------

╔═══════════════════════════════════════════════════════════╗
║                   OVERALL SUMMARY                         ║
╚═══════════════════════════════════════════════════════════╝

✅ Genetics Simulation Tests: 8/8 passed
✅ Game Loop Emulation Tests: 10/10 passed

------------------------------------------------------------
TOTAL: 18/18 tests passed
Time: 2.34s
------------------------------------------------------------

✅ All tests passed!
```

## Extending Tests

### Adding New Tests

1. Create test in `tests/` directory
2. Import test utilities:
   ```javascript
   import { assert, assertEqual, runTestSuite } from '../helpers/test-utils.js';
   ```
3. Write test function:
   ```javascript
   async function testSomething() {
       // Test code
       assert(condition, 'Message');
   }
   ```
4. Export test suite:
   ```javascript
   export async function runMyTests() {
       const tests = [
           { name: 'Test name', fn: testSomething }
       ];
       return await runTestSuite('My Test Suite', tests);
   }
   ```
5. Import in `run-tests.js` and add to runner

## Performance

- **Fast**: ~2-3 seconds for full suite
- **Lightweight**: No external dependencies
- **Scalable**: Can easily run 1000s of iterations

## Use Cases

### Development Workflow
```bash
# Run tests after making changes
node test/run-tests.js
```

### CI/CD Integration
```bash
# Add to GitHub Actions or other CI
npm run test  # (add script to package.json)
```

### Stress Testing
```bash
# Tests already include:
# - 1000 breeding cycles (genetics)
# - 100-turn gameplay simulation
# - 500 rapid breeding cycles (2000 offspring)
```

## Troubleshooting

**Error: Cannot find module**
- Ensure you're running from project root
- Check that all test files exist

**Import errors**
- Node.js v14+ required for ES modules
- Ensure files have `.js` extension in imports

**Tests fail**
- Check console output for specific failure
- Most tests include descriptive error messages

## Technical Details

### Mocking Strategy

Tests mock browser APIs:
- `localStorage`: Simple object-based mock
- `document`: Minimal DOM mock for element access
- No UI rendering (tests logic only)

### Test Coverage

**What IS tested:**
- ✅ Core breeding logic
- ✅ Genetics calculations
- ✅ Color and beauty calculations
- ✅ Economy (coins, values)
- ✅ Game state management
- ✅ Multi-turn gameplay

**What is NOT tested:**
- ❌ UI rendering (SVG, Alpine.js)
- ❌ User interactions (clicks, etc.)
- ❌ Browser-specific behavior
- ❌ Network/Firebase operations

For UI/integration testing, consider using Puppeteer or Playwright.

## Contributing

To add new test cases:
1. Follow existing patterns in test files
2. Use descriptive test names
3. Include console output for simulation tests
4. Document complex test scenarios
