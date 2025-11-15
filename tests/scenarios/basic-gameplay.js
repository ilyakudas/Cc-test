/**
 * Basic Gameplay Scenario
 * Tests the core game loop: buy, breed, manage collection
 */

import * as GameState from '../../public/js/core/gameState.js';

export const name = 'Basic Gameplay';
export const description = 'Tests core game loop with buying, breeding, and collection management';

export async function run(simulator, options = {}) {
    const cycles = options.cycles || 10;
    const results = {
        passed: true,
        errors: [],
        metrics: {}
    };

    simulator.reset();
    simulator.setVerbose(options.verbose || false);

    console.log(`Running ${cycles} gameplay cycles...`);

    try {
        // Start with buying initial parrots
        const starter1 = simulator.buyParrot();
        const starter2 = simulator.buyParrot();

        if (!starter1 || !starter2) {
            throw new Error('Failed to buy initial parrots');
        }

        // Run breeding cycles
        for (let i = 0; i < cycles; i++) {
            let state = simulator.getState();

            // Ensure we have at least 2 parrots
            let attempts = 0;
            while (state.parrots.length < 2 && attempts < 10) {
                const newParrot = simulator.buyParrot();
                if (!newParrot) {
                    // Out of coins, try selling unlocked parrots
                    const unlocked = state.parrots.find(p => !GameState.isParrotLocked(p.id));
                    if (unlocked) {
                        const value = simulator.sellParrot(unlocked);
                        if (value === 0) {
                            // Failed to sell, break to avoid infinite loop
                            break;
                        }
                    } else {
                        // All parrots locked or no parrots, can't progress
                        break;
                    }
                }
                state = simulator.getState(); // Refresh after changes
                attempts++;
            }

            // Skip this cycle if we don't have enough parrots
            if (state.parrots.length < 2) {
                continue;
            }

            // Select two different parents
            let parent1 = state.parrots[Math.floor(Math.random() * state.parrots.length)];
            let parent2 = state.parrots[Math.floor(Math.random() * state.parrots.length)];

            // Make sure they're different (try up to 10 times)
            let selectionAttempts = 0;
            while (parent1.id === parent2.id && state.parrots.length > 1 && selectionAttempts < 10) {
                parent2 = state.parrots[Math.floor(Math.random() * state.parrots.length)];
                selectionAttempts++;
            }

            // If still same after attempts, skip this cycle
            if (parent1.id === parent2.id) {
                continue; // Skip this iteration
            }

            // Ensure we have enough coins for breeding
            state = simulator.getState(); // Refresh state
            let sellAttempts = 0;
            while (state.coins < 50 && state.parrots.length > 2 && sellAttempts < 10) {
                // Sell an unlocked parrot (not a parent)
                const parrotToSell = state.parrots.find(p =>
                    p.id !== parent1.id && p.id !== parent2.id && !GameState.isParrotLocked(p.id)
                );
                if (parrotToSell) {
                    const value = simulator.sellParrot(parrotToSell);
                    if (value === 0) {
                        // Failed to sell, break to avoid infinite loop
                        break;
                    }
                    state = simulator.getState(); // Refresh after selling
                } else {
                    // No unlocked parrots available to sell
                    break;
                }
                sellAttempts++;
            }

            // Final check - skip if still not enough coins
            if (state.coins < 50) {
                continue; // Skip this iteration
            }

            // Breed
            const offspring = simulator.breedParrots(parent1, parent2);

            if (offspring.length !== 4) {
                throw new Error(`Expected 4 offspring, got ${offspring.length}. Coins: ${state.coins}, Parents: ${parent1?.name}, ${parent2?.name}`);
            }

            // Move offspring to collection
            simulator.moveOffspringToCollection();

            // Refresh state after breeding
            state = simulator.getState();

            // Occasionally examine a parrot
            if (i % 3 === 0 && state.coins >= 100 && state.parrots.length > 0) {
                const randomParrot = state.parrots[Math.floor(Math.random() * state.parrots.length)];
                simulator.examineParrot(randomParrot);
            }

            // Occasionally lock a parrot
            if (i % 5 === 0 && state.parrots.length > 3) {
                const randomParrot = state.parrots[Math.floor(Math.random() * state.parrots.length)];
                simulator.lockParrot(randomParrot);
            }

            // Keep collection manageable (sell excess)
            if (state.parrots.length > 20) {
                // Try to sell first parrot (sellParrot handles lock check)
                simulator.sellParrot(state.parrots[0]);
            }

            // Validate state integrity
            const issues = simulator.validateState();
            if (issues.length > 0) {
                throw new Error(`State validation failed: ${issues.join(', ')}`);
            }
        }

        // Final validation
        const finalState = simulator.getState();
        const stats = simulator.getStats();

        results.metrics = {
            finalCoins: finalState.coins,
            finalParrots: finalState.parrotCount,
            totalBreedings: stats.totalBreedings,
            totalParrotsBorn: stats.totalParrotsBorn,
            rarityDistribution: stats.rarityDistribution,
            errors: stats.errors.length
        };

        // Check assertions
        // Allow for some failed cycles (expect at least 50% success rate)
        const expectedMinBreedings = Math.floor(cycles * 0.5);
        if (stats.totalBreedings < expectedMinBreedings) {
            results.errors.push(`Expected at least ${expectedMinBreedings} breedings, got ${stats.totalBreedings}`);
            results.passed = false;
        }

        if (finalState.coins < 0) {
            results.errors.push(`Negative coins: ${finalState.coins}`);
            results.passed = false;
        }

        // Allow for errors from locked parrots and other expected failures
        const maxErrors = Math.ceil(cycles); // Allow up to 1 error per cycle
        if (stats.errors.length > maxErrors) {
            results.errors.push(`Too many errors: ${stats.errors.length} (max: ${maxErrors})`);
            results.passed = false;
        }

    } catch (error) {
        results.passed = false;
        results.errors.push(error.message);
    }

    return results;
}
