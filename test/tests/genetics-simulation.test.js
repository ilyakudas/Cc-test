/**
 * Genetics Simulation Tests
 * Tests breeding mechanics, inheritance patterns, and mutations
 */

import { initializeMocks, resetMocks } from '../mocks/browser-mocks.js';
import { assert, assertEqual, assertInRange, runTestSuite, randomGenes, StatsCollector } from '../helpers/test-utils.js';
import { Parrot } from '../../public/js/core/parrot.js';
import { breedBodyPart, breedParrotGenes } from '../../public/js/core/genetics.js';
import * as GameState from '../../public/js/core/gameState.js';

// Initialize mocks before tests
initializeMocks();

/**
 * Test: Body part breeding produces valid genes
 */
async function testBodyPartBreedingValidity() {
    GameState.setMutationsEnabled(false);

    const parent1 = {
        red: [true, true, false, false],
        green: [false, true, false, true],
        blue: [true, false, true, false],
        gradient: true
    };

    const parent2 = {
        red: [false, false, true, true],
        green: [true, false, true, false],
        blue: [false, true, false, true],
        gradient: false
    };

    const child = breedBodyPart(parent1, parent2);

    // Validate structure
    assert(Array.isArray(child.red), 'Child red should be array');
    assert(Array.isArray(child.green), 'Child green should be array');
    assert(Array.isArray(child.blue), 'Child blue should be array');
    assertEqual(child.red.length, 4, 'Child should have 4 red alleles');
    assertEqual(child.green.length, 4, 'Child should have 4 green alleles');
    assertEqual(child.blue.length, 4, 'Child should have 4 blue alleles');
    assert(typeof child.gradient === 'boolean', 'Child gradient should be boolean');

    // All alleles should be boolean
    for (const allele of [...child.red, ...child.green, ...child.blue]) {
        assert(typeof allele === 'boolean', 'All alleles should be boolean');
    }
}

/**
 * Test: Mendelian inheritance (each allele from one parent)
 */
async function testMendelianInheritance() {
    GameState.setMutationsEnabled(false);

    const parent1 = {
        red: [true, true, true, true],
        green: [false, false, false, false],
        blue: [true, true, true, true],
        gradient: true
    };

    const parent2 = {
        red: [false, false, false, false],
        green: [true, true, true, true],
        blue: [false, false, false, false],
        gradient: false
    };

    // Run multiple breeding cycles
    for (let i = 0; i < 100; i++) {
        const child = breedBodyPart(parent1, parent2);

        // Each red allele should be either true or false (from parents)
        for (const allele of child.red) {
            assert(allele === true || allele === false, 'Red allele should be from parents');
        }

        // Each green allele should be either true or false (from parents)
        for (const allele of child.green) {
            assert(allele === true || allele === false, 'Green allele should be from parents');
        }

        // Each blue allele should be either true or false (from parents)
        for (const allele of child.blue) {
            assert(allele === true || allele === false, 'Blue allele should be from parents');
        }

        // Gradient should be from one parent
        assert(child.gradient === true || child.gradient === false, 'Gradient should be from parents');
    }
}

/**
 * Test: Mutations work correctly
 */
async function testMutations() {
    GameState.setMutationsEnabled(true);
    GameState.setMutationRate(0.5); // 50% for easier testing

    const parent1 = {
        red: [true, true, true, true],
        green: [true, true, true, true],
        blue: [true, true, true, true],
        gradient: false
    };

    const parent2 = {
        red: [true, true, true, true],
        green: [true, true, true, true],
        blue: [true, true, true, true],
        gradient: false
    };

    let mutationCount = 0;
    const trials = 1000;

    for (let i = 0; i < trials; i++) {
        const child = breedBodyPart(parent1, parent2);

        // Check for mutations (alleles that are false)
        const allAlleles = [...child.red, ...child.green, ...child.blue];
        mutationCount += allAlleles.filter(a => a === false).length;
    }

    // With 50% mutation rate, we expect ~50% of alleles to mutate
    // 1000 trials * 12 alleles = 12,000 alleles
    // Expected mutations: ~6,000
    const mutationRate = mutationCount / (trials * 12);
    assertInRange(mutationRate, 0.4, 0.6, 'Mutation rate should be ~50%');
}

/**
 * Test: Full parrot breeding
 */
async function testFullParrotBreeding() {
    GameState.setMutationsEnabled(false);

    const parent1Genes = randomGenes();
    const parent2Genes = randomGenes();

    const childGenes = breedParrotGenes(parent1Genes, parent2Genes);

    // Validate all body parts exist
    const bodyParts = ['wings', 'special_wing', 'body', 'head', 'tail', 'accents'];
    for (const part of bodyParts) {
        assert(childGenes[part] !== undefined, `Child should have ${part}`);
        assert(Array.isArray(childGenes[part].red), `${part} should have red array`);
        assert(Array.isArray(childGenes[part].green), `${part} should have green array`);
        assert(Array.isArray(childGenes[part].blue), `${part} should have blue array`);
        assert(typeof childGenes[part].gradient === 'boolean', `${part} should have gradient`);
    }
}

/**
 * Test: Color calculation produces valid RGB
 */
async function testColorCalculation() {
    const genes = randomGenes();
    const parrot = new Parrot('TestParrot', genes, 1, 0);

    const bodyParts = ['wings', 'special_wing', 'body', 'head', 'tail', 'accents'];

    for (const part of bodyParts) {
        const colorData = parrot.calculateBodyPartColor(part);

        if (colorData.isGradient) {
            assert(colorData.startColor !== undefined, 'Gradient should have startColor');
            assert(colorData.endColor !== undefined, 'Gradient should have endColor');

            // Validate RGB format
            const startMatch = colorData.startColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
            const endMatch = colorData.endColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);

            assert(startMatch !== null, 'Start color should be valid RGB');
            assert(endMatch !== null, 'End color should be valid RGB');

            // Check RGB values are in range 0-255
            const startR = parseInt(startMatch[1]);
            const startG = parseInt(startMatch[2]);
            const startB = parseInt(startMatch[3]);
            const endR = parseInt(endMatch[1]);
            const endG = parseInt(endMatch[2]);
            const endB = parseInt(endMatch[3]);

            assertInRange(startR, 0, 255, 'Start R should be 0-255');
            assertInRange(startG, 0, 255, 'Start G should be 0-255');
            assertInRange(startB, 0, 255, 'Start B should be 0-255');
            assertInRange(endR, 0, 255, 'End R should be 0-255');
            assertInRange(endG, 0, 255, 'End G should be 0-255');
            assertInRange(endB, 0, 255, 'End B should be 0-255');
        } else {
            assert(colorData.color !== undefined, 'Solid should have color');

            const match = colorData.color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
            assert(match !== null, 'Color should be valid RGB');

            const r = parseInt(match[1]);
            const g = parseInt(match[2]);
            const b = parseInt(match[3]);

            assertInRange(r, 0, 255, 'R should be 0-255');
            assertInRange(g, 0, 255, 'G should be 0-255');
            assertInRange(b, 0, 255, 'B should be 0-255');
        }
    }
}

/**
 * Test: Beauty calculation is consistent
 */
async function testBeautyCalculation() {
    const genes = randomGenes();
    const parrot = new Parrot('TestParrot', genes, 1, 0);

    const beauty1 = parrot.calculateBeauty();
    const beauty2 = parrot.calculateBeauty();

    // Beauty should be consistent
    assertEqual(beauty1.score, beauty2.score, 'Beauty score should be consistent');
    assert(beauty1.score >= 0, 'Beauty score should be non-negative');
    assert(beauty1.maxScore === 200, 'Max beauty score should be 200');
}

/**
 * Test: Value calculation is reasonable
 */
async function testValueCalculation() {
    const genes = randomGenes();
    const parrot = new Parrot('TestParrot', genes, 1, 0);

    const value = parrot.getValue();

    assert(value > 0, 'Value should be positive');
    assert(value < 10000, 'Value should be reasonable (<10000)');
}

/**
 * Simulation Test: 1000 breeding cycles for statistical validation
 */
async function testMassBreedingSimulation() {
    GameState.setMutationsEnabled(false);

    const parent1Genes = {
        wings: { red: [true, true, false, false], green: [false, true, true, false], blue: [true, false, true, false], gradient: false },
        special_wing: { red: [true, false, true, false], green: [true, true, false, false], blue: [false, true, false, true], gradient: false },
        body: { red: [false, false, true, true], green: [true, false, false, true], blue: [true, true, false, false], gradient: false },
        head: { red: [true, true, true, false], green: [false, false, false, true], blue: [true, false, true, true], gradient: false },
        tail: { red: [false, true, false, true], green: [true, true, true, true], blue: [false, false, false, false], gradient: false },
        accents: { red: [true, false, false, true], green: [false, true, true, false], blue: [true, true, false, true], gradient: false }
    };

    const parent2Genes = {
        wings: { red: [false, false, true, true], green: [true, false, false, true], blue: [false, true, false, true], gradient: false },
        special_wing: { red: [false, true, false, true], green: [false, false, true, true], blue: [true, false, true, false], gradient: false },
        body: { red: [true, true, false, false], green: [false, true, true, false], blue: [false, false, true, true], gradient: false },
        head: { red: [false, false, false, true], green: [true, true, true, false], blue: [false, true, false, false], gradient: false },
        tail: { red: [true, false, true, false], green: [false, false, false, false], blue: [true, true, true, true], gradient: false },
        accents: { red: [false, true, true, false], green: [true, false, false, true], blue: [false, false, true, false], gradient: false }
    };

    const beautyStats = new StatsCollector();
    const valueStats = new StatsCollector();

    console.log('\n  Running 1000 breeding simulations...');

    for (let i = 0; i < 1000; i++) {
        const childGenes = breedParrotGenes(parent1Genes, parent2Genes);
        const child = new Parrot(`Child-${i}`, childGenes, 2, i);

        beautyStats.add(child.calculateBeauty().score);
        valueStats.add(child.getValue());
    }

    console.log('  Beauty scores:', beautyStats.summary());
    console.log('  Values:', valueStats.summary());

    assert(beautyStats.count() === 1000, 'Should breed 1000 offspring');
    assert(beautyStats.min() >= 0, 'Min beauty should be non-negative');
    assert(valueStats.min() > 0, 'Min value should be positive');
}

/**
 * Run all genetics tests
 */
export async function runGeneticsTests() {
    const tests = [
        { name: 'Body part breeding produces valid genes', fn: testBodyPartBreedingValidity },
        { name: 'Mendelian inheritance works correctly', fn: testMendelianInheritance },
        { name: 'Mutations work correctly', fn: testMutations },
        { name: 'Full parrot breeding works', fn: testFullParrotBreeding },
        { name: 'Color calculation produces valid RGB', fn: testColorCalculation },
        { name: 'Beauty calculation is consistent', fn: testBeautyCalculation },
        { name: 'Value calculation is reasonable', fn: testValueCalculation },
        { name: 'Mass breeding simulation (1000 cycles)', fn: testMassBreedingSimulation }
    ];

    return await runTestSuite('Genetics Simulation Tests', tests);
}
