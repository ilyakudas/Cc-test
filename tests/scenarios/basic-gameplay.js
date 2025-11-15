/**
 * Basic Gameplay Scenario
 * Tests the core game loop: buy, breed, manage collection
 */

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
            const state = simulator.getState();

            // Ensure we have at least 2 parrots
            while (state.parrots.length < 2) {
                const newParrot = simulator.buyParrot();
                if (!newParrot) {
                    // Out of coins, try selling
                    if (state.parrots.length > 0) {
                        simulator.sellParrot(state.parrots[0]);
                    } else {
                        throw new Error('Cannot continue - no coins and no parrots');
                    }
                }
            }

            // Select two random parents
            const parent1 = state.parrots[Math.floor(Math.random() * state.parrots.length)];
            const parent2 = state.parrots[Math.floor(Math.random() * state.parrots.length)];

            // Make sure they're different
            if (parent1.id === parent2.id && state.parrots.length > 1) {
                continue;
            }

            // Ensure we have enough coins
            if (state.coins < 50) {
                // Sell a random parrot (not a parent)
                const parrotToSell = state.parrots.find(p =>
                    p.id !== parent1.id && p.id !== parent2.id
                );
                if (parrotToSell) {
                    simulator.sellParrot(parrotToSell);
                }
            }

            // Breed
            const offspring = simulator.breedParrots(parent1, parent2);

            if (offspring.length !== 4) {
                throw new Error(`Expected 4 offspring, got ${offspring.length}`);
            }

            // Move offspring to collection
            simulator.moveOffspringToCollection();

            // Occasionally examine a parrot
            if (i % 3 === 0 && state.coins >= 100) {
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
        if (stats.totalBreedings < cycles * 0.8) {
            results.errors.push(`Expected at least ${cycles * 0.8} breedings, got ${stats.totalBreedings}`);
            results.passed = false;
        }

        if (finalState.coins < 0) {
            results.errors.push(`Negative coins: ${finalState.coins}`);
            results.passed = false;
        }

        if (stats.errors.length > cycles * 0.2) {
            results.errors.push(`Too many errors: ${stats.errors.length} (max: ${cycles * 0.2})`);
            results.passed = false;
        }

    } catch (error) {
        results.passed = false;
        results.errors.push(error.message);
    }

    return results;
}
