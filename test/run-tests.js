#!/usr/bin/env node

/**
 * Test Runner
 * Runs all test suites and reports results
 */

import { runGeneticsTests } from './tests/genetics-simulation.test.js';
import { runGameLoopTests } from './tests/game-loop-emulation.test.js';

/**
 * Main test runner
 */
async function runAllTests() {
    console.log('\n');
    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log('║     ChromaWing - Game Emulation Test Suite               ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');
    console.log('\n');

    const startTime = Date.now();
    const suiteResults = [];

    try {
        // Run genetics tests
        const geneticsResults = await runGeneticsTests();
        suiteResults.push(geneticsResults);

        // Run game loop tests
        const gameLoopResults = await runGameLoopTests();
        suiteResults.push(gameLoopResults);

        // Summary
        console.log('\n');
        console.log('╔═══════════════════════════════════════════════════════════╗');
        console.log('║                   OVERALL SUMMARY                         ║');
        console.log('╚═══════════════════════════════════════════════════════════╝');
        console.log('\n');

        let totalPassed = 0;
        let totalFailed = 0;

        for (const suite of suiteResults) {
            totalPassed += suite.passed;
            totalFailed += suite.failed;
            const status = suite.failed === 0 ? '✅' : '❌';
            console.log(`${status} ${suite.suiteName}: ${suite.passed}/${suite.total} passed`);
        }

        console.log('\n' + '─'.repeat(60));
        console.log(`TOTAL: ${totalPassed}/${totalPassed + totalFailed} tests passed`);
        console.log(`Time: ${((Date.now() - startTime) / 1000).toFixed(2)}s`);
        console.log('─'.repeat(60) + '\n');

        // Exit with appropriate code
        if (totalFailed > 0) {
            console.log('❌ Some tests failed!\n');
            process.exit(1);
        } else {
            console.log('✅ All tests passed!\n');
            process.exit(0);
        }

    } catch (error) {
        console.error('\n❌ Test runner error:', error);
        process.exit(1);
    }
}

// Run tests
runAllTests();
