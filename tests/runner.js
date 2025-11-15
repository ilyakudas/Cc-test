#!/usr/bin/env node

/**
 * Test Runner for ChromaWing Game Simulation
 * Executes gameplay scenarios and generates reports
 */

import HeadlessGameSimulator from './headless-simulator.js';
import * as basicGameplay from './scenarios/basic-gameplay.js';
import * as economyStress from './scenarios/economy-stress.js';
import * as breedingChains from './scenarios/breeding-chains.js';
import * as rarityDistribution from './scenarios/rarity-distribution.js';

// ANSI color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    gray: '\x1b[90m'
};

function colorize(text, color) {
    return `${colors[color]}${text}${colors.reset}`;
}

// Parse command line arguments
const args = process.argv.slice(2);
const mode = args.find(arg => ['--quick', '--stress', '--verbose'].includes(arg)) || '--normal';
const verbose = args.includes('--verbose');

// Test configurations
const configs = {
    '--quick': {
        name: 'Quick Test',
        scenarios: [
            { scenario: basicGameplay, options: { cycles: 5, verbose } },
            { scenario: rarityDistribution, options: { sampleSize: 50, verbose } }
        ]
    },
    '--normal': {
        name: 'Standard Test Suite',
        scenarios: [
            { scenario: basicGameplay, options: { cycles: 20, verbose } },
            { scenario: economyStress, options: { cycles: 50, verbose } },
            { scenario: breedingChains, options: { targetGeneration: 5, verbose } },
            { scenario: rarityDistribution, options: { sampleSize: 100, verbose } }
        ]
    },
    '--stress': {
        name: 'Stress Test Suite',
        scenarios: [
            { scenario: basicGameplay, options: { cycles: 100, verbose } },
            { scenario: economyStress, options: { cycles: 500, verbose } },
            { scenario: breedingChains, options: { targetGeneration: 20, verbose } },
            { scenario: rarityDistribution, options: { sampleSize: 500, verbose } }
        ]
    }
};

async function runTests() {
    const config = configs[mode] || configs['--normal'];
    const simulator = new HeadlessGameSimulator();

    console.log(colorize('\n╔═══════════════════════════════════════════════════════════╗', 'cyan'));
    console.log(colorize('║    ChromaWing Game Simulation Test Suite                 ║', 'cyan'));
    console.log(colorize('╚═══════════════════════════════════════════════════════════╝\n', 'cyan'));

    console.log(colorize(`Running: ${config.name}`, 'bright'));
    console.log(colorize(`Mode: ${mode.replace('--', '')}`, 'dim'));
    console.log(colorize(`Scenarios: ${config.scenarios.length}\n`, 'dim'));

    const results = [];
    const startTime = Date.now();

    for (let i = 0; i < config.scenarios.length; i++) {
        const { scenario, options } = config.scenarios[i];

        console.log(colorize(`\n[${ i + 1}/${config.scenarios.length}] ${scenario.name}`, 'blue'));
        console.log(colorize(`    ${scenario.description}`, 'gray'));
        console.log('');

        const scenarioStart = Date.now();
        const result = await scenario.run(simulator, options);
        const duration = Date.now() - scenarioStart;

        result.duration = duration;
        result.name = scenario.name;
        results.push(result);

        // Print immediate result
        if (result.passed) {
            console.log(colorize(`    ✓ PASSED`, 'green') + colorize(` (${duration}ms)`, 'dim'));
        } else {
            console.log(colorize(`    ✗ FAILED`, 'red') + colorize(` (${duration}ms)`, 'dim'));
        }

        // Print errors if any
        if (result.errors.length > 0) {
            console.log(colorize(`    Errors:`, 'red'));
            result.errors.forEach(error => {
                console.log(colorize(`      • ${error}`, 'red'));
            });
        }

        // Print key metrics
        if (result.metrics && Object.keys(result.metrics).length > 0) {
            console.log(colorize(`    Metrics:`, 'dim'));
            printMetrics(result.metrics, '      ');
        }
    }

    const totalDuration = Date.now() - startTime;

    // Print summary
    printSummary(results, totalDuration);
}

function printMetrics(metrics, indent = '') {
    Object.entries(metrics).forEach(([key, value]) => {
        if (typeof value === 'object' && !Array.isArray(value)) {
            console.log(colorize(`${indent}${key}:`, 'dim'));
            printMetrics(value, indent + '  ');
        } else {
            const displayValue = typeof value === 'number' && !Number.isInteger(value)
                ? value.toFixed(2)
                : value;
            console.log(colorize(`${indent}${key}: ${displayValue}`, 'dim'));
        }
    });
}

function printSummary(results, totalDuration) {
    console.log(colorize('\n╔═══════════════════════════════════════════════════════════╗', 'cyan'));
    console.log(colorize('║                      TEST SUMMARY                         ║', 'cyan'));
    console.log(colorize('╚═══════════════════════════════════════════════════════════╝\n', 'cyan'));

    const passed = results.filter(r => r.passed).length;
    const failed = results.filter(r => !r.passed).length;
    const total = results.length;

    console.log(colorize(`Total Tests:     ${total}`, 'bright'));
    console.log(colorize(`Passed:          ${passed}`, passed === total ? 'green' : 'yellow'));
    console.log(colorize(`Failed:          ${failed}`, failed > 0 ? 'red' : 'green'));
    console.log(colorize(`Success Rate:    ${((passed / total) * 100).toFixed(1)}%`, passed === total ? 'green' : 'yellow'));
    console.log(colorize(`Total Duration:  ${totalDuration}ms (${(totalDuration / 1000).toFixed(2)}s)`, 'dim'));

    console.log(colorize('\nScenario Results:', 'bright'));
    results.forEach(result => {
        const icon = result.passed ? '✓' : '✗';
        const color = result.passed ? 'green' : 'red';
        const name = result.name.padEnd(30);
        const duration = `${result.duration}ms`.padStart(8);

        console.log(
            `  ${colorize(icon, color)} ${name} ${colorize(duration, 'dim')}`
        );
    });

    // Print detailed failures
    const failures = results.filter(r => !r.passed);
    if (failures.length > 0) {
        console.log(colorize('\nDetailed Failures:', 'red'));
        failures.forEach(result => {
            console.log(colorize(`\n  ${result.name}:`, 'red'));
            result.errors.forEach(error => {
                console.log(colorize(`    • ${error}`, 'red'));
            });
        });
    }

    console.log('');

    // Exit with appropriate code
    process.exit(failed > 0 ? 1 : 0);
}

// Run the tests
runTests().catch(error => {
    console.error(colorize('\n✗ Fatal Error:', 'red'), error.message);
    console.error(error.stack);
    process.exit(1);
});
