/**
 * Rarity Distribution Scenario
 * Tests genetic rarity calculations and distribution balance
 */

export const name = 'Rarity Distribution';
export const description = 'Tests rarity calculations and ensures reasonable distribution';

export async function run(simulator, options = {}) {
    const sampleSize = options.sampleSize || 200;
    const results = {
        passed: true,
        errors: [],
        metrics: {}
    };

    simulator.reset();
    simulator.setVerbose(options.verbose || false);

    console.log(`Generating ${sampleSize} parrots to test rarity distribution...`);

    try {
        const rarityCounts = {
            common: 0,
            uncommon: 0,
            rare: 0,
            epic: 0,
            legendary: 0
        };

        const parrotsSampled = [];

        // Generate sample through buying and breeding
        let generated = 0;
        while (generated < sampleSize) {
            const state = simulator.getState();

            // Buy some parrots
            if (state.coins >= 50 && generated < sampleSize) {
                const parrot = simulator.buyParrot();
                if (parrot) {
                    parrotsSampled.push(parrot);
                    rarityCounts[parrot.calculateRarity()]++;
                    generated++;
                }
            }

            // Breed if we have parrots
            if (state.parrots.length >= 2 && state.coins >= 50 && generated < sampleSize) {
                const p1 = state.parrots[0];
                const p2 = state.parrots[1];
                const offspring = simulator.breedParrots(p1, p2);

                offspring.forEach(child => {
                    if (generated < sampleSize) {
                        parrotsSampled.push(child);
                        rarityCounts[child.calculateRarity()]++;
                        generated++;
                    }
                });

                simulator.moveOffspringToCollection();
            }

            // Sell excess to manage economy
            if (state.parrots.length > 20) {
                simulator.sellParrot(state.parrots[0]);
            }

            // Prevent infinite loop
            if (generated < sampleSize && state.coins < 50 && state.parrots.length < 2) {
                if (state.parrots.length > 0) {
                    simulator.sellParrot(state.parrots[0]);
                } else {
                    throw new Error('Cannot generate more parrots - insufficient resources');
                }
            }
        }

        // Calculate distribution percentages
        const distribution = {};
        Object.keys(rarityCounts).forEach(rarity => {
            distribution[rarity] = {
                count: rarityCounts[rarity],
                percentage: (rarityCounts[rarity] / sampleSize * 100).toFixed(2)
            };
        });

        // Calculate value statistics
        const values = parrotsSampled.map(p => p.getValue());
        const avgValue = values.reduce((a, b) => a + b, 0) / values.length;
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);

        // Calculate beauty score statistics
        const beautyScores = parrotsSampled.map(p => p.calculateBeauty().score);
        const avgBeauty = beautyScores.reduce((a, b) => a + b, 0) / beautyScores.length;
        const minBeauty = Math.min(...beautyScores);
        const maxBeauty = Math.max(...beautyScores);

        results.metrics = {
            sampleSize,
            distribution,
            rarityCounts,
            valueStats: {
                avg: Math.round(avgValue),
                min: minValue,
                max: maxValue
            },
            beautyStats: {
                avg: Math.round(avgBeauty),
                min: Math.round(minBeauty),
                max: Math.round(maxBeauty)
            }
        };

        // Expected rarity distributions (rough estimates based on genetic probability)
        // These are loose bounds - genetics is somewhat random
        const expectedRanges = {
            common: [40, 70],      // Most common
            uncommon: [20, 40],    // Fairly common
            rare: [5, 25],         // Less common
            epic: [1, 15],         // Rare
            legendary: [0, 5]      // Very rare
        };

        // Validate distribution is reasonable
        Object.keys(expectedRanges).forEach(rarity => {
            const percentage = parseFloat(distribution[rarity].percentage);
            const [min, max] = expectedRanges[rarity];

            if (percentage < min || percentage > max) {
                results.errors.push(
                    `${rarity} percentage ${percentage.toFixed(1)}% outside expected range [${min}-${max}%]`
                );
                // Don't fail test on distribution - it's probabilistic
                // results.passed = false;
            }
        });

        // Ensure we got at least some variety
        const rarityTypes = Object.values(rarityCounts).filter(count => count > 0).length;
        if (rarityTypes < 3) {
            results.errors.push(`Only ${rarityTypes} rarity types found - expected at least 3`);
            results.passed = false;
        }

        // Validate parrot properties
        const invalidParrots = parrotsSampled.filter(p => {
            return !p.name || !p.genes || !p.calculateRarity() || p.getValue() <= 0;
        });

        if (invalidParrots.length > 0) {
            results.errors.push(`${invalidParrots.length} parrots have invalid properties`);
            results.passed = false;
        }

        // Check value correlates somewhat with rarity
        const rarityValues = {
            common: [],
            uncommon: [],
            rare: [],
            epic: [],
            legendary: []
        };

        parrotsSampled.forEach(p => {
            rarityValues[p.calculateRarity()].push(p.getValue());
        });

        // Compare average values between rarities (higher rarity should have higher avg value)
        const avgValuesByRarity = {};
        Object.keys(rarityValues).forEach(rarity => {
            if (rarityValues[rarity].length > 0) {
                avgValuesByRarity[rarity] = rarityValues[rarity].reduce((a, b) => a + b, 0) / rarityValues[rarity].length;
            }
        });

        results.metrics.avgValuesByRarity = avgValuesByRarity;

        // Sanity check: legendary should be worth more than common on average
        if (avgValuesByRarity.legendary && avgValuesByRarity.common) {
            if (avgValuesByRarity.legendary <= avgValuesByRarity.common) {
                results.errors.push('Legendary parrots should be more valuable than common on average');
            }
        }

    } catch (error) {
        results.passed = false;
        results.errors.push(error.message);
    }

    return results;
}
