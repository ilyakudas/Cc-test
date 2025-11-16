/**
 * Test Utilities
 * Helper functions for testing
 */

/**
 * Simple assertion helper
 */
export function assert(condition, message) {
    if (!condition) {
        throw new Error(`Assertion failed: ${message}`);
    }
}

/**
 * Assert equality
 */
export function assertEqual(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(`${message}\n  Expected: ${expected}\n  Actual: ${actual}`);
    }
}

/**
 * Assert range
 */
export function assertInRange(value, min, max, message) {
    if (value < min || value > max) {
        throw new Error(`${message}\n  Expected: ${min}-${max}\n  Actual: ${value}`);
    }
}

/**
 * Assert array contains
 */
export function assertContains(array, item, message) {
    if (!array.includes(item)) {
        throw new Error(`${message}\n  Array does not contain: ${item}`);
    }
}

/**
 * Run a test with error handling
 */
export async function runTest(testName, testFn) {
    try {
        await testFn();
        console.log(`✅ PASS: ${testName}`);
        return { passed: true, name: testName };
    } catch (error) {
        console.error(`❌ FAIL: ${testName}`);
        console.error(`   ${error.message}`);
        return { passed: false, name: testName, error: error.message };
    }
}

/**
 * Run a test suite
 */
export async function runTestSuite(suiteName, tests) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Running: ${suiteName}`);
    console.log('='.repeat(60));

    const results = [];
    for (const test of tests) {
        const result = await runTest(test.name, test.fn);
        results.push(result);
    }

    const passed = results.filter(r => r.passed).length;
    const failed = results.filter(r => !r.passed).length;
    const total = results.length;

    console.log(`\n${'-'.repeat(60)}`);
    console.log(`Results: ${passed}/${total} passed, ${failed} failed`);
    console.log('-'.repeat(60));

    return { suiteName, results, passed, failed, total };
}

/**
 * Generate random genes for testing
 */
export function randomGenes() {
    const randomBodyPart = () => ({
        red: [randomBool(), randomBool(), randomBool(), randomBool()],
        green: [randomBool(), randomBool(), randomBool(), randomBool()],
        blue: [randomBool(), randomBool(), randomBool(), randomBool()],
        gradient: randomBool()
    });

    return {
        wings: randomBodyPart(),
        special_wing: randomBodyPart(),
        body: randomBodyPart(),
        head: randomBodyPart(),
        tail: randomBodyPart(),
        accents: randomBodyPart()
    };
}

function randomBool() {
    return Math.random() < 0.5;
}

/**
 * Statistics helper
 */
export class StatsCollector {
    constructor() {
        this.values = [];
    }

    add(value) {
        this.values.push(value);
    }

    mean() {
        return this.values.reduce((a, b) => a + b, 0) / this.values.length;
    }

    min() {
        return Math.min(...this.values);
    }

    max() {
        return Math.max(...this.values);
    }

    count() {
        return this.values.length;
    }

    summary() {
        return {
            count: this.count(),
            min: this.min(),
            max: this.max(),
            mean: this.mean().toFixed(2)
        };
    }
}
