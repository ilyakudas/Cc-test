/**
 * Economy Stress Test Scenario
 * Tests economy balance, coin management, and sustainable gameplay
 */

export const name = 'Economy Stress Test';
export const description = 'Tests economy balance and coin sustainability over many cycles';

export async function run(simulator, options = {}) {
    const cycles = options.cycles || 100;
    const results = {
        passed: true,
        errors: [],
        metrics: {}
    };

    simulator.reset();
    simulator.setVerbose(options.verbose || false);

    console.log(`Running ${cycles} economy cycles...`);

    const coinHistory = [];
    let bankruptcies = 0;
    let recoveries = 0;

    try {
        // Buy two starter parrots
        simulator.buyParrot();
        simulator.buyParrot();

        for (let i = 0; i < cycles; i++) {
            const state = simulator.getState();
            coinHistory.push(state.coins);

            // Check for bankruptcy
            if (state.coins < 50 && state.parrots.length === 0) {
                bankruptcies++;
                results.errors.push(`Bankruptcy at cycle ${i}: ${state.coins} coins, 0 parrots`);

                // Try to recover by generating coins
                if (state.parrots.length === 0) {
                    // This is a dead end - game is unplayable
                    throw new Error('Unrecoverable bankruptcy - no parrots and insufficient coins');
                }
            }

            // Track recovery from low coins
            if (state.coins < 100 && state.parrots.length > 0) {
                // Sell parrots to recover
                const parrotsToSell = Math.min(2, state.parrots.length - 2);
                for (let j = 0; j < parrotsToSell; j++) {
                    if (state.parrots.length > 2) {
                        simulator.sellParrot(state.parrots[0]);
                        recoveries++;
                    }
                }
            }

            // Maintain breeding if possible
            if (state.coins >= 50 && state.parrots.length >= 2) {
                const parent1 = state.parrots[0];
                const parent2 = state.parrots[1];
                simulator.breedParrots(parent1, parent2);
                simulator.moveOffspringToCollection();
            }

            // Buy when wealthy
            if (state.coins > 500 && state.parrots.length < 10) {
                simulator.buyParrot();
            }

            // Sell when overcrowded
            if (state.parrots.length > 15) {
                simulator.sellParrot(state.parrots[0]);
            }

            // Examine occasionally
            if (state.coins > 300 && i % 10 === 0) {
                const randomParrot = state.parrots[Math.floor(Math.random() * state.parrots.length)];
                simulator.examineParrot(randomParrot);
            }
        }

        // Calculate economy metrics
        const finalState = simulator.getState();
        const stats = simulator.getStats();

        const avgCoins = coinHistory.reduce((a, b) => a + b, 0) / coinHistory.length;
        const minCoins = Math.min(...coinHistory);
        const maxCoins = Math.max(...coinHistory);
        const coinVolatility = Math.sqrt(
            coinHistory.reduce((sum, coins) => sum + Math.pow(coins - avgCoins, 2), 0) / coinHistory.length
        );

        results.metrics = {
            finalCoins: finalState.coins,
            avgCoins: Math.round(avgCoins),
            minCoins,
            maxCoins,
            coinVolatility: Math.round(coinVolatility),
            bankruptcies,
            recoveries,
            netCoins: stats.netCoins,
            totalSpent: stats.totalCoinsSpent,
            totalEarned: stats.totalCoinsEarned,
            breedings: stats.totalBreedings,
            purchases: stats.totalParrotsBought,
            sales: stats.totalParrotsSold,
            economyHealth: avgCoins > 100 && minCoins >= 0 ? 'Healthy' : 'Stressed'
        };

        // Economy health checks
        if (bankruptcies > 0) {
            results.errors.push(`Economy too harsh: ${bankruptcies} bankruptcies`);
            results.passed = false;
        }

        if (avgCoins < 100) {
            results.errors.push(`Economy too tight: avg coins ${Math.round(avgCoins)}`);
            results.passed = false;
        }

        if (minCoins < 0) {
            results.errors.push(`Negative coins reached: ${minCoins}`);
            results.passed = false;
        }

        // Should be possible to maintain sustainable breeding
        const sustainableRate = stats.totalBreedings / cycles;
        if (sustainableRate < 0.5) {
            results.errors.push(`Low breeding sustainability: ${(sustainableRate * 100).toFixed(1)}%`);
        }

    } catch (error) {
        results.passed = false;
        results.errors.push(error.message);
    }

    return results;
}
