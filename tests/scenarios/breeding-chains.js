/**
 * Breeding Chains Scenario
 * Tests multi-generation breeding, genetic inheritance, and generation tracking
 */

export const name = 'Breeding Chains';
export const description = 'Tests multi-generation breeding and genetic inheritance over many generations';

export async function run(simulator, options = {}) {
    const targetGeneration = options.targetGeneration || 10;
    const results = {
        passed: true,
        errors: [],
        metrics: {}
    };

    simulator.reset();
    simulator.setVerbose(options.verbose || false);

    console.log(`Breeding to generation ${targetGeneration}...`);

    try {
        // Start with two parrots
        const gen1_p1 = simulator.buyParrot();
        const gen1_p2 = simulator.buyParrot();

        if (!gen1_p1 || !gen1_p2) {
            throw new Error('Failed to create initial parrots');
        }

        let currentGeneration = 1;
        let maxGenReached = 1;
        const generationSizes = {};
        const geneticDiversity = {};

        // Keep breeding until we reach target generation
        while (currentGeneration < targetGeneration) {
            const state = simulator.getState();

            // Find the highest generation parrots
            const highestGen = Math.max(...state.parrots.map(p => p.generation));
            maxGenReached = Math.max(maxGenReached, highestGen);

            // Select two parrots from highest generation
            const candidates = state.parrots.filter(p => p.generation === highestGen);

            if (candidates.length < 2) {
                // Need to breed lower generation to get more
                if (state.parrots.length >= 2) {
                    const p1 = state.parrots[0];
                    const p2 = state.parrots[1];
                    simulator.breedParrots(p1, p2);
                    simulator.moveOffspringToCollection();
                } else {
                    throw new Error('Not enough parrots to continue breeding chain');
                }
                continue;
            }

            // Breed two from highest generation
            const parent1 = candidates[0];
            const parent2 = candidates[1];

            // Ensure we have coins
            if (state.coins < 50) {
                // Sell older generation parrots
                const oldGen = state.parrots.filter(p => p.generation < highestGen - 1);
                if (oldGen.length > 0) {
                    simulator.sellParrot(oldGen[0]);
                } else if (state.parrots.length > 2) {
                    simulator.sellParrot(state.parrots[0]);
                } else {
                    throw new Error('Insufficient coins and cannot sell parrots');
                }
            }

            const offspring = simulator.breedParrots(parent1, parent2);

            if (offspring.length > 0) {
                currentGeneration = offspring[0].generation;
                generationSizes[currentGeneration] = offspring.length;

                // Track genetic diversity (number of unique color patterns)
                const colorPatterns = new Set();
                offspring.forEach(child => {
                    const pattern = JSON.stringify({
                        wings: child.genes.wings.red.filter(Boolean).length,
                        body: child.genes.body.red.filter(Boolean).length,
                        head: child.genes.head.red.filter(Boolean).length
                    });
                    colorPatterns.add(pattern);
                });
                geneticDiversity[currentGeneration] = colorPatterns.size;
            }

            simulator.moveOffspringToCollection();

            // Keep collection manageable
            if (state.parrots.length > 30) {
                // Sell oldest generation parrots
                const oldestGen = Math.min(...state.parrots.map(p => p.generation));
                const toSell = state.parrots.filter(p => p.generation === oldestGen);
                if (toSell.length > 0) {
                    simulator.sellParrot(toSell[0]);
                }
            }
        }

        // Validate breeding chain results
        const finalState = simulator.getState();
        const stats = simulator.getStats();

        results.metrics = {
            maxGenerationReached: maxGenReached,
            targetGeneration,
            totalBreedings: stats.totalBreedings,
            totalParrotsBorn: stats.totalParrotsBorn,
            generationDistribution: stats.generationDistribution,
            generationSizes,
            geneticDiversity,
            avgDiversity: Object.values(geneticDiversity).reduce((a, b) => a + b, 0) / Object.keys(geneticDiversity).length,
            finalParrots: finalState.parrotCount,
            finalCoins: finalState.coins
        };

        // Assertions
        if (maxGenReached < targetGeneration) {
            results.errors.push(`Only reached generation ${maxGenReached}, target was ${targetGeneration}`);
            results.passed = false;
        }

        // Check that generations actually progressed
        const uniqueGenerations = Object.keys(stats.generationDistribution).length;
        if (uniqueGenerations < targetGeneration * 0.8) {
            results.errors.push(`Not enough generation diversity: ${uniqueGenerations} unique generations`);
        }

        // Genetic diversity should remain reasonable (not all identical)
        const avgDiversity = results.metrics.avgDiversity;
        if (avgDiversity < 1.5) {
            results.errors.push(`Low genetic diversity: ${avgDiversity.toFixed(2)} avg unique patterns per generation`);
        }

        // Check parrot validity in final generation
        const highestGenParrots = finalState.parrots.filter(p => p.generation === maxGenReached);
        if (highestGenParrots.length === 0) {
            results.errors.push('No parrots in highest generation remain in collection');
            results.passed = false;
        }

        // Validate genes of a high-gen parrot
        if (highestGenParrots.length > 0) {
            const testParrot = highestGenParrots[0];
            if (!testParrot.genes || !testParrot.genes.wings) {
                results.errors.push('High generation parrot has invalid genes');
                results.passed = false;
            }

            // Check all gene arrays have correct length
            ['wings', 'body', 'head', 'tail', 'accents', 'special_wing'].forEach(part => {
                if (!testParrot.genes[part]) {
                    results.errors.push(`Missing body part: ${part}`);
                    results.passed = false;
                } else {
                    ['red', 'green', 'blue'].forEach(color => {
                        if (testParrot.genes[part][color].length !== 4) {
                            results.errors.push(`Invalid ${color} alleles for ${part}: length ${testParrot.genes[part][color].length}`);
                            results.passed = false;
                        }
                    });
                }
            });
        }

    } catch (error) {
        results.passed = false;
        results.errors.push(error.message);
    }

    return results;
}
