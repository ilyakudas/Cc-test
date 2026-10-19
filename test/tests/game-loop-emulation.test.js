/**
 * Game Loop Emulation Tests
 * Simulates actual gameplay loops: buying, breeding, selling, examining
 */

import { initializeMocks, resetMocks } from '../mocks/browser-mocks.js';
import { assert, assertEqual, assertInRange, runTestSuite, StatsCollector } from '../helpers/test-utils.js';
import { Parrot } from '../../public/js/core/parrot.js';
import { breedParrotGenes } from '../../public/js/core/genetics.js';
import { createParrotWithPurity, getRandomName } from '../../public/js/lib/utils.js';
import * as GameState from '../../public/js/core/gameState.js';

// Initialize mocks
initializeMocks();

/**
 * Helper: Initialize game with starter parrots
 */
function initializeGame() {
    GameState.resetGameState();
    GameState.setCoins(500);
    GameState.setMutationsEnabled(true);
    GameState.setMutationRate(0.05);

    // Add two starter parrots
    const genes1 = createParrotWithPurity('medium');
    const genes2 = createParrotWithPurity('medium');

    const parrot1 = new Parrot('Starter1', genes1, 1, GameState.getAndIncrementParrotIdCounter());
    const parrot2 = new Parrot('Starter2', genes2, 1, GameState.getAndIncrementParrotIdCounter());

    GameState.addParrot(parrot1);
    GameState.addParrot(parrot2);

    return { parrot1, parrot2 };
}

/**
 * Helper: Simulate breeding two parrots
 */
function simulateBreeding(parent1, parent2) {
    const BREEDING_COST = 50;
    const coins = GameState.getCoins();

    if (coins < BREEDING_COST) {
        throw new Error('Not enough coins to breed');
    }

    GameState.subtractCoins(BREEDING_COST);

    const offspring = [];
    for (let i = 0; i < 4; i++) {
        const childGenes = breedParrotGenes(parent1.genes, parent2.genes);
        const childGen = Math.max(parent1.generation, parent2.generation) + 1;
        const child = new Parrot(
            getRandomName(),
            childGenes,
            childGen,
            GameState.getAndIncrementParrotIdCounter()
        );
        offspring.push(child);

        // Update global generation tracker
        const currentGen = GameState.getGeneration();
        if (childGen > currentGen) {
            GameState.setGeneration(childGen);
        }
    }

    return offspring;
}

/**
 * Helper: Simulate selling a parrot
 */
function simulateSelling(parrot) {
    const value = parrot.getValue();
    GameState.addCoins(value);
    return value;
}

/**
 * Helper: Simulate examining a parrot
 */
function simulateExamine(parrot) {
    const EXAM_COST = 100;
    const coins = GameState.getCoins();

    if (coins < EXAM_COST) {
        throw new Error('Not enough coins to examine');
    }

    if (GameState.hasExaminedParrot(parrot.id)) {
        throw new Error('Parrot already examined');
    }

    GameState.subtractCoins(EXAM_COST);
    GameState.addExaminedParrot(parrot.id);

    return parrot.calculateBeauty();
}

/**
 * Test: Basic breeding cycle
 */
async function testBasicBreedingCycle() {
    const { parrot1, parrot2 } = initializeGame();

    const initialCoins = GameState.getCoins();
    const offspring = simulateBreeding(parrot1, parrot2);

    assertEqual(offspring.length, 4, 'Should produce 4 offspring');
    assertEqual(GameState.getCoins(), initialCoins - 50, 'Should deduct 50 coins');

    // All offspring should be valid parrots
    for (const child of offspring) {
        assert(child instanceof Parrot, 'Offspring should be Parrot instance');
        assert(child.generation === 2, 'Offspring should be generation 2');
        assert(child.name !== '', 'Offspring should have name');
    }
}

/**
 * Test: Multiple breeding cycles
 */
async function testMultipleBreedingCycles() {
    const { parrot1, parrot2 } = initializeGame();

    const allOffspring = [];

    for (let i = 0; i < 5; i++) {
        const offspring = simulateBreeding(parrot1, parrot2);
        allOffspring.push(...offspring);
    }

    assertEqual(allOffspring.length, 20, 'Should produce 20 offspring total');
    assertEqual(GameState.getCoins(), 500 - (50 * 5), 'Should deduct 250 coins');
}

/**
 * Test: Selling parrots
 */
async function testSellingParrots() {
    const { parrot1, parrot2 } = initializeGame();

    const offspring = simulateBreeding(parrot1, parrot2);
    const initialCoins = GameState.getCoins();

    // Sell all offspring
    let totalValue = 0;
    for (const child of offspring) {
        const value = simulateSelling(child);
        totalValue += value;
    }

    assertEqual(GameState.getCoins(), initialCoins + totalValue, 'Coins should increase by total value');
    assert(totalValue > 0, 'Total value should be positive');
}

/**
 * Test: Examining parrots
 */
async function testExaminingParrots() {
    const { parrot1, parrot2 } = initializeGame();

    const offspring = simulateBreeding(parrot1, parrot2);
    const initialCoins = GameState.getCoins();

    // Examine first offspring
    const beauty = simulateExamine(offspring[0]);

    assertEqual(GameState.getCoins(), initialCoins - 100, 'Should deduct 100 coins');
    assert(beauty.score >= 0, 'Beauty score should be non-negative');
    assert(GameState.hasExaminedParrot(offspring[0].id), 'Parrot should be marked examined');

    // Try examining same parrot again (should fail)
    let examineFailed = false;
    try {
        simulateExamine(offspring[0]);
    } catch (error) {
        examineFailed = true;
    }
    assert(examineFailed, 'Should not allow double examination');
}

/**
 * Test: Auto-examine simulation
 */
async function testAutoExamine() {
    const { parrot1, parrot2 } = initializeGame();
    GameState.setAutoExamineEnabled(true);

    const offspring = simulateBreeding(parrot1, parrot2);
    const coinsAfterBreeding = GameState.getCoins();

    // Simulate auto-examine
    const EXAM_COST = 100;
    const maxExaminations = Math.min(offspring.length, Math.floor(coinsAfterBreeding / EXAM_COST));

    for (let i = 0; i < maxExaminations; i++) {
        GameState.subtractCoins(EXAM_COST);
        GameState.addExaminedParrot(offspring[i].id);
    }

    assertEqual(GameState.getCoins(), coinsAfterBreeding - (maxExaminations * EXAM_COST), 'Should deduct exam costs');
    assert(maxExaminations >= 1, 'Should examine at least 1 parrot');
}

/**
 * Test: Complete gameplay loop
 */
async function testCompleteGameplayLoop() {
    initializeGame();

    const parrots = GameState.getParrots();
    assert(parrots.length === 2, 'Should start with 2 parrots');

    // Cycle 1: Breed
    const offspring1 = simulateBreeding(parrots[0], parrots[1]);
    assertEqual(offspring1.length, 4, 'First breeding should produce 4 offspring');

    // Cycle 2: Sell 3 offspring, keep 1
    for (let i = 0; i < 3; i++) {
        simulateSelling(offspring1[i]);
    }
    GameState.addParrot(offspring1[3]); // Keep one offspring

    // Cycle 3: Breed with new parrot
    const offspring2 = simulateBreeding(parrots[0], offspring1[3]);
    assertEqual(offspring2.length, 4, 'Second breeding should produce 4 offspring');

    // Verify coins are positive
    assert(GameState.getCoins() > 0, 'Should have positive coins');

    // Verify parrot count
    assertEqual(GameState.getParrots().length, 3, 'Should have 3 parrots in collection');
}

/**
 * Test: Lock system
 */
async function testLockSystem() {
    const { parrot1, parrot2 } = initializeGame();

    // Lock parrot1
    GameState.addLockedParrot(parrot1.id);

    assert(GameState.isParrotLocked(parrot1.id), 'Parrot should be locked');
    assert(!GameState.isParrotLocked(parrot2.id), 'Parrot should not be locked');

    // Unlock parrot1
    GameState.removeLockedParrot(parrot1.id);
    assert(!GameState.isParrotLocked(parrot1.id), 'Parrot should be unlocked');
}

/**
 * Test: Generation tracking
 */
async function testGenerationTracking() {
    const { parrot1, parrot2 } = initializeGame();

    assertEqual(GameState.getGeneration(), 1, 'Should start at generation 1');

    const offspring1 = simulateBreeding(parrot1, parrot2);
    assertEqual(offspring1[0].generation, 2, 'First offspring should be generation 2');

    // Update global generation
    GameState.setGeneration(2);
    assertEqual(GameState.getGeneration(), 2, 'Global generation should be 2');

    const offspring2 = simulateBreeding(offspring1[0], offspring1[1]);
    assertEqual(offspring2[0].generation, 3, 'Second generation offspring should be generation 3');
}

/**
 * Simulation Test: 100-turn gameplay simulation
 */
async function test100TurnGameplaySimulation() {
    console.log('\n  Running 100-turn gameplay simulation...');

    initializeGame();

    const coinHistory = [];
    const parrotCountHistory = [];
    const generationHistory = [];

    for (let turn = 0; turn < 100; turn++) {
        const parrots = GameState.getParrots();
        const coins = GameState.getCoins();

        // Record stats
        coinHistory.push(coins);
        parrotCountHistory.push(parrots.length);
        generationHistory.push(GameState.getGeneration());

        // Ensure we have at least 2 parrots
        if (parrots.length < 2) {
            console.log(`  Turn ${turn}: Not enough parrots, skipping`);
            continue;
        }

        // Strategy: Breed if we can afford it
        if (coins >= 50) {
            const parent1 = parrots[0];
            const parent2 = parrots[1];
            const offspring = simulateBreeding(parent1, parent2);

            // Keep 1 offspring, sell the rest
            GameState.addParrot(offspring[0]);
            for (let i = 1; i < offspring.length; i++) {
                simulateSelling(offspring[i]);
            }
        }

        // Cull if too many parrots (keep top 10)
        if (parrots.length > 10) {
            const sorted = [...parrots].sort((a, b) => b.getValue() - a.getValue());
            const toKeep = sorted.slice(0, 10);
            const toSell = sorted.slice(10);

            GameState.setParrots(toKeep);
            for (const p of toSell) {
                simulateSelling(p);
            }
        }
    }

    const coinStats = new StatsCollector();
    coinHistory.forEach(c => coinStats.add(c));

    console.log('  Coins over 100 turns:', coinStats.summary());
    console.log(`  Final generation: ${GameState.getGeneration()}`);
    console.log(`  Final parrot count: ${GameState.getParrots().length}`);

    assert(coinHistory.length === 100, 'Should have 100 turns of data');
    assert(GameState.getGeneration() > 1, 'Should progress beyond generation 1');
}

/**
 * Simulation Test: Stress test with rapid breeding
 */
async function testStressRapidBreeding() {
    console.log('\n  Stress test: 500 rapid breeding cycles...');

    initializeGame();
    GameState.setCoins(100000); // Give lots of coins

    const parrots = GameState.getParrots();
    const parent1 = parrots[0];
    const parent2 = parrots[1];

    const beautyStats = new StatsCollector();
    const valueStats = new StatsCollector();

    for (let i = 0; i < 500; i++) {
        const offspring = simulateBreeding(parent1, parent2);

        for (const child of offspring) {
            beautyStats.add(child.calculateBeauty().score);
            valueStats.add(child.getValue());
        }
    }

    console.log('  Offspring beauty scores:', beautyStats.summary());
    console.log('  Offspring values:', valueStats.summary());

    assertEqual(beautyStats.count(), 2000, 'Should produce 2000 offspring (500 * 4)');
}

/**
 * Run all game loop tests
 */
export async function runGameLoopTests() {
    const tests = [
        { name: 'Basic breeding cycle', fn: testBasicBreedingCycle },
        { name: 'Multiple breeding cycles', fn: testMultipleBreedingCycles },
        { name: 'Selling parrots', fn: testSellingParrots },
        { name: 'Examining parrots', fn: testExaminingParrots },
        { name: 'Auto-examine simulation', fn: testAutoExamine },
        { name: 'Complete gameplay loop', fn: testCompleteGameplayLoop },
        { name: 'Lock system', fn: testLockSystem },
        { name: 'Generation tracking', fn: testGenerationTracking },
        { name: '100-turn gameplay simulation', fn: test100TurnGameplaySimulation },
        { name: 'Stress test: 500 rapid breeding cycles', fn: testStressRapidBreeding }
    ];

    return await runTestSuite('Game Loop Emulation Tests', tests);
}
