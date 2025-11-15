/**
 * Starter Parrots Validation Scenario
 * Tests if Twilight and Prism are good starter parrots for early game
 */

export const name = 'Starter Parrots Validation';
export const description = 'Validates that starter parrots (Twilight & Prism) provide good early game experience';

export async function run(simulator, options = {}) {
    const results = {
        passed: true,
        errors: [],
        metrics: {}
    };

    // Run with seeded random for reproducibility
    const testSeed = options.seed || 12345;
    console.log(`Testing with seed: ${testSeed}`);

    try {
        // Test 1: Validate starter parrots have good properties
        simulator.reset();

        const twilight = simulator.getState().parrots[0];
        const twilightBeauty = twilight.calculateBeauty();
        const twilightRarity = twilight.calculateRarity();
        const twilightValue = twilight.getValue();

        // Twilight should be at least uncommon and have decent beauty
        if (twilightRarity === 'common') {
            results.errors.push('Twilight is only common rarity - should be at least uncommon for starter');
        }

        if (twilightBeauty.score < 10) {
            results.errors.push(`Twilight beauty score too low: ${twilightBeauty.score} (should be >= 10)`);
        }

        // Buy Prism
        const prism = simulator.buyParrot();
        const prismBeauty = prism.calculateBeauty();
        const prismRarity = prism.calculateRarity();
        const prismValue = prism.getValue();

        if (prismRarity === 'common') {
            results.errors.push('Prism is only common rarity - should be at least uncommon for starter');
        }

        if (prismBeauty.score < 10) {
            results.errors.push(`Prism beauty score too low: ${prismBeauty.score} (should be >= 10)`);
        }

        // Test 2: Validate they breed well together
        const offspring = simulator.breedParrots(twilight, prism);

        if (offspring.length !== 4) {
            throw new Error(`Expected 4 offspring from starter breeding, got ${offspring.length}`);
        }

        // Calculate offspring stats
        const offspringBeautyScores = offspring.map(p => p.calculateBeauty().score);
        const offspringRarities = offspring.map(p => p.calculateRarity());
        const offspringValues = offspring.map(p => p.getValue());

        const avgOffspringBeauty = offspringBeautyScores.reduce((a, b) => a + b, 0) / 4;
        const avgOffspringValue = offspringValues.reduce((a, b) => a + b, 0) / 4;
        const uncommonOrBetter = offspringRarities.filter(r => r !== 'common').length;

        // At least one offspring should be uncommon or better
        if (uncommonOrBetter === 0) {
            results.errors.push('No uncommon+ offspring from starter breeding - too weak for early game');
        }

        // Average beauty should be reasonable
        if (avgOffspringBeauty < 5) {
            results.errors.push(`Offspring average beauty too low: ${avgOffspringBeauty.toFixed(1)} (should be >= 5)`);
        }

        // Test 3: Economic viability - can player afford second breeding?
        simulator.moveOffspringToCollection();
        const state = simulator.getState();

        // Player should have enough coins after first breeding to continue
        if (state.coins < 50) {
            results.errors.push(`Not enough coins after first breeding: ${state.coins} (need 50 for next breed)`);
        }

        // Test 4: Run full early game simulation (first 10 cycles)
        // Reset to fresh game with starters
        simulator.reset();

        // Buy Prism to have 2 parrots
        simulator.buyParrot();

        let totalValue = 0;
        let totalBreedings = 0;
        let bankruptcies = 0;

        for (let i = 0; i < 10; i++) {
            const gameState = simulator.getState();

            if (gameState.coins < 50 && gameState.parrots.length < 2) {
                bankruptcies++;
                break;
            }

            if (gameState.parrots.length >= 2 && gameState.coins >= 50) {
                const p1 = gameState.parrots[0];
                const p2 = gameState.parrots[Math.min(1, gameState.parrots.length - 1)];

                const children = simulator.breedParrots(p1, p2);
                simulator.moveOffspringToCollection();
                totalBreedings++;

                // Occasionally sell to test value generation
                if (i % 3 === 0 && gameState.parrots.length > 5) {
                    const toSell = gameState.parrots[gameState.parrots.length - 1];
                    const value = simulator.sellParrot(toSell);
                    totalValue += value;
                }
            }
        }

        if (bankruptcies > 0) {
            results.errors.push('Player went bankrupt in first 10 cycles - starters too weak');
            results.passed = false;
        }

        if (totalBreedings < 8) {
            results.errors.push(`Only ${totalBreedings} breedings in 10 cycles - should have at least 8`);
        }

        // Compile metrics
        const finalState = simulator.getState();
        results.metrics = {
            twilight: {
                rarity: twilightRarity,
                beauty: Math.round(twilightBeauty.score),
                value: twilightValue,
                beautyTraits: twilightBeauty.traits.length
            },
            prism: {
                rarity: prismRarity,
                beauty: Math.round(prismBeauty.score),
                value: prismValue,
                beautyTraits: prismBeauty.traits.length
            },
            firstBreeding: {
                offspringCount: offspring.length,
                avgBeauty: Math.round(avgOffspringBeauty),
                avgValue: Math.round(avgOffspringValue),
                uncommonOrBetter,
                rarityDistribution: {
                    common: offspringRarities.filter(r => r === 'common').length,
                    uncommon: offspringRarities.filter(r => r === 'uncommon').length,
                    rare: offspringRarities.filter(r => r === 'rare').length,
                    epic: offspringRarities.filter(r => r === 'epic').length,
                    legendary: offspringRarities.filter(r => r === 'legendary').length
                }
            },
            earlyGame: {
                totalBreedings,
                bankruptcies,
                finalCoins: finalState.coins,
                finalParrots: finalState.parrotCount,
                totalValueGenerated: totalValue
            },
            seed: testSeed
        };

    } catch (error) {
        results.passed = false;
        results.errors.push(error.message);
    }

    return results;
}
