#!/usr/bin/env node

/**
 * Simple Gameplay Simulation
 * Run a full gameplay session and see statistics
 */

import HeadlessGameSimulator from './headless-simulator.js';

const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    yellow: '\x1b[33m',
    gray: '\x1b[90m'
};

function colorize(text, color) {
    return `${colors[color]}${text}${colors.reset}`;
}

async function simulate() {
    console.log(colorize('\n🦜 ChromaWing Gameplay Simulation\n', 'cyan'));

    const simulator = new HeadlessGameSimulator();
    simulator.reset();
    simulator.setVerbose(true);

    console.log(colorize('Starting game with 500 coins...\n', 'bright'));

    // Buy two starter parrots
    console.log(colorize('━━━ Buying Initial Parrots ━━━', 'blue'));
    const p1 = simulator.buyParrot();
    const p2 = simulator.buyParrot();

    // Run 20 breeding cycles
    const cycles = 20;
    console.log(colorize(`\n━━━ Running ${cycles} Breeding Cycles ━━━`, 'blue'));

    for (let i = 0; i < cycles; i++) {
        const state = simulator.getState();

        console.log(colorize(`\n--- Cycle ${i + 1}/${cycles} ---`, 'yellow'));
        console.log(colorize(`  Collection: ${state.parrotCount} parrots, Coins: ${state.coins}`, 'gray'));

        // Ensure we have parrots
        if (state.parrots.length < 2) {
            if (state.coins >= 50) {
                simulator.buyParrot();
            } else {
                console.log(colorize('  ⚠ Not enough parrots or coins to continue', 'yellow'));
                break;
            }
        }

        // Select parents
        const parent1 = state.parrots[0];
        const parent2 = state.parrots[Math.min(1, state.parrots.length - 1)];

        // Ensure coins
        if (state.coins < 50) {
            if (state.parrots.length > 2) {
                simulator.sellParrot(state.parrots[state.parrots.length - 1]);
            }
        }

        // Breed
        if (state.coins >= 50) {
            const offspring = simulator.breedParrots(parent1, parent2);
            simulator.moveOffspringToCollection();

            // Occasionally examine
            if (i % 5 === 0 && state.coins >= 100) {
                simulator.examineParrot(offspring[0]);
            }

            // Occasionally lock
            if (i % 7 === 0) {
                simulator.lockParrot(offspring[0]);
            }

            // Manage collection size
            if (state.parrots.length > 15) {
                const toSell = state.parrots.find(p =>
                    !simulator.getState().parrots.some(locked =>
                        // Simple check - just sell first non-locked
                        false
                    )
                );
                if (state.parrots.length > 15) {
                    simulator.sellParrot(state.parrots[0]);
                }
            }
        }
    }

    // Print final statistics
    console.log(colorize('\n━━━ Simulation Complete ━━━\n', 'cyan'));

    const finalState = simulator.getState();
    const stats = simulator.getStats();

    console.log(colorize('Final State:', 'bright'));
    console.log(`  Parrots in collection: ${finalState.parrotCount}`);
    console.log(`  Coins remaining: ${finalState.coins}`);
    console.log(`  Current generation: ${finalState.generation}`);
    console.log('');

    console.log(colorize('Statistics:', 'bright'));
    console.log(`  Total breedings: ${stats.totalBreedings}`);
    console.log(`  Total parrots born: ${stats.totalParrotsBorn}`);
    console.log(`  Total parrots bought: ${stats.totalParrotsBought}`);
    console.log(`  Total parrots sold: ${stats.totalParrotsSold}`);
    console.log(`  Total examinations: ${stats.totalExaminations}`);
    console.log('');

    console.log(colorize('Economy:', 'bright'));
    console.log(`  Total spent: ${stats.totalCoinsSpent} coins`);
    console.log(`  Total earned: ${stats.totalCoinsEarned} coins`);
    console.log(`  Net coins: ${stats.netCoins} coins`);
    console.log('');

    console.log(colorize('Rarity Distribution:', 'bright'));
    const totalParrots = Object.values(stats.rarityDistribution).reduce((a, b) => a + b, 0);
    Object.entries(stats.rarityDistribution).forEach(([rarity, count]) => {
        const percentage = ((count / totalParrots) * 100).toFixed(1);
        const bar = '█'.repeat(Math.floor(percentage / 2));
        console.log(`  ${rarity.padEnd(12)} ${count.toString().padStart(3)} (${percentage.padStart(5)}%) ${colorize(bar, 'green')}`);
    });
    console.log('');

    console.log(colorize('Generation Distribution:', 'bright'));
    Object.entries(stats.generationDistribution)
        .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
        .forEach(([gen, count]) => {
            const bar = '█'.repeat(Math.min(count, 50));
            console.log(`  Gen ${gen.toString().padStart(2)}: ${count.toString().padStart(3)} ${colorize(bar, 'blue')}`);
        });
    console.log('');

    if (stats.errors.length > 0) {
        console.log(colorize('Errors/Warnings:', 'yellow'));
        stats.errors.forEach(error => {
            console.log(`  • ${error}`);
        });
        console.log('');
    }

    // Validate state
    const issues = simulator.validateState();
    if (issues.length > 0) {
        console.log(colorize('State Validation Issues:', 'yellow'));
        issues.forEach(issue => {
            console.log(`  ⚠ ${issue}`);
        });
    } else {
        console.log(colorize('✓ State validation passed\n', 'green'));
    }
}

simulate().catch(error => {
    console.error(colorize('\n✗ Simulation failed:', 'red'), error.message);
    console.error(error.stack);
    process.exit(1);
});
