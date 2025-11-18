/**
 * ChromaWing Breeding Simulator - Wild Mate System Module
 * Core algorithms for the wild mate finding system
 */

import {
    RELEASE_BASE_CREDITS,
    RELEASE_RARITY_MULTIPLIER,
    RELEASE_STAR_MULTIPLIER,
    RELEASE_DIVERSITY_MULTIPLIER,
    BEAUTY_WEIGHT,
    POOL_WEIGHT,
    BEAUTY_BONUS_MAX,
    RANDOMNESS_VARIANCE,
    AGILITY_MATE_BONUS,
    STAMINA_QUALITY_MODIFIER,
    STAMINA_BONUS_MATE_CHANCE
} from './economy.js';

/**
 * Initialize an empty wild gene pool
 * @returns {Object} Empty gene pool structure
 */
export function initializeGenePool() {
    const bodyParts = ['wings', 'special_wing', 'body', 'head', 'tail', 'accents'];
    const pool = {};

    for (const part of bodyParts) {
        pool[part] = {
            red: { dominant: 0, recessive: 0 },
            green: { dominant: 0, recessive: 0 },
            blue: { dominant: 0, recessive: 0 },
            gradient: { dominant: 0, recessive: 0 }
        };
    }

    // Add performance genes
    pool.agility = { dominant: 0, recessive: 0 };
    pool.intelligence = { dominant: 0, recessive: 0 };
    pool.stamina = { dominant: 0, recessive: 0 };
    pool.speed = { dominant: 0, recessive: 0 };
    pool.fertility = { dominant: 0, recessive: 0 };

    return pool;
}

/**
 * Add a parrot's genes to the wild gene pool
 * @param {Object} genePool - Current gene pool
 * @param {Object} parrotGenes - Parrot's genes to add
 * @returns {Object} Updated gene pool
 */
export function addGenesToPool(genePool, parrotGenes) {
    const pool = JSON.parse(JSON.stringify(genePool)); // Deep copy
    const bodyParts = ['wings', 'special_wing', 'body', 'head', 'tail', 'accents'];

    // Add color genes for each body part
    for (const part of bodyParts) {
        const partGenes = parrotGenes[part];

        // Count dominant/recessive alleles for each color
        for (const color of ['red', 'green', 'blue']) {
            const alleles = partGenes[color];
            for (const allele of alleles) {
                if (allele === true) {
                    pool[part][color].dominant += 2; // Dominant alleles worth 2 points
                } else {
                    pool[part][color].recessive += 1; // Recessive alleles worth 1 point
                }
            }
        }

        // Add gradient gene
        if (partGenes.gradient) {
            pool[part].gradient.dominant += 2;
        } else {
            pool[part].gradient.recessive += 1;
        }
    }

    // Add performance genes
    const performanceGenes = ['agility', 'intelligence', 'stamina', 'speed', 'fertility'];
    for (const gene of performanceGenes) {
        if (parrotGenes[gene]) {
            const alleles = parrotGenes[gene];
            for (const allele of alleles) {
                if (allele === true) {
                    pool[gene].dominant += 2;
                } else {
                    pool[gene].recessive += 1;
                }
            }
        }
    }

    return pool;
}

/**
 * Calculate gene frequency from dominant/recessive counts
 * @param {Object} geneData - Object with dominant and recessive counts
 * @returns {number} Frequency between 0 and 1
 */
export function calculateFrequency(geneData) {
    const total = geneData.dominant + geneData.recessive;
    if (total === 0) return 0.5; // Default to medium frequency if no data
    return geneData.dominant / total;
}

/**
 * Calculate overall gene pool quality
 * @param {Object} genePool - The gene pool
 * @returns {number} Quality score between 0 and 1
 */
export function calculatePoolQuality(genePool) {
    let totalFrequency = 0;
    let geneCount = 0;

    const bodyParts = ['wings', 'special_wing', 'body', 'head', 'tail', 'accents'];

    for (const part of bodyParts) {
        for (const color of ['red', 'green', 'blue', 'gradient']) {
            totalFrequency += calculateFrequency(genePool[part][color]);
            geneCount++;
        }
    }

    // Add performance genes
    const performanceGenes = ['agility', 'intelligence', 'stamina', 'speed', 'fertility'];
    for (const gene of performanceGenes) {
        totalFrequency += calculateFrequency(genePool[gene]);
        geneCount++;
    }

    return totalFrequency / geneCount;
}

/**
 * Calculate gene pool diversity (how many genes are in the balanced range)
 * @param {Object} genePool - The gene pool
 * @returns {number} Diversity score between 0 and 1
 */
export function calculatePoolDiversity(genePool) {
    let balancedGenes = 0;
    let totalGenes = 0;

    const bodyParts = ['wings', 'special_wing', 'body', 'head', 'tail', 'accents'];

    for (const part of bodyParts) {
        for (const color of ['red', 'green', 'blue', 'gradient']) {
            const freq = calculateFrequency(genePool[part][color]);
            if (freq >= 0.3 && freq <= 0.7) {
                balancedGenes++;
            }
            totalGenes++;
        }
    }

    // Add performance genes
    const performanceGenes = ['agility', 'intelligence', 'stamina', 'speed', 'fertility'];
    for (const gene of performanceGenes) {
        const freq = calculateFrequency(genePool[gene]);
        if (freq >= 0.3 && freq <= 0.7) {
            balancedGenes++;
        }
        totalGenes++;
    }

    return balancedGenes / totalGenes;
}

/**
 * Calculate conservation credits earned for releasing a parrot
 * @param {Parrot} parrot - The parrot being released
 * @returns {number} Credits earned
 */
export function calculateReleaseCredits(parrot) {
    let credits = RELEASE_BASE_CREDITS;

    // Rarity bonus
    const rarity = parrot.calculateRarity();
    const rarityBonus = {
        'common': 0,
        'uncommon': 1,
        'rare': 2,
        'epic': 3,
        'legendary': 4
    }[rarity] || 0;
    credits += rarityBonus * RELEASE_RARITY_MULTIPLIER;

    // Beauty bonus (star rating)
    const beauty = parrot.calculateBeauty();
    const starRating = Math.floor((beauty.score / beauty.maxScore) * 5);
    credits += starRating * RELEASE_STAR_MULTIPLIER;

    // Genetic diversity bonus (how many different genes they have)
    const diversityScore = calculateParrotDiversity(parrot);
    credits += Math.floor(diversityScore * RELEASE_DIVERSITY_MULTIPLIER);

    return Math.floor(credits);
}

/**
 * Calculate genetic diversity of a single parrot
 * @param {Parrot} parrot - The parrot
 * @returns {number} Diversity score (0-10)
 */
function calculateParrotDiversity(parrot) {
    let diversityScore = 0;
    const bodyParts = ['wings', 'special_wing', 'body', 'head', 'tail', 'accents'];

    for (const part of bodyParts) {
        const partGenes = parrot.genes[part];

        // Check color diversity (not all same)
        const redCount = partGenes.red.filter(a => a).length;
        const greenCount = partGenes.green.filter(a => a).length;
        const blueCount = partGenes.blue.filter(a => a).length;

        // Reward mixed genotypes (1-3 dominant alleles, not 0 or 4)
        if (redCount >= 1 && redCount <= 3) diversityScore += 0.5;
        if (greenCount >= 1 && greenCount <= 3) diversityScore += 0.5;
        if (blueCount >= 1 && blueCount <= 3) diversityScore += 0.5;
    }

    return diversityScore;
}

/**
 * Generate a wild mate based on parrot beauty and gene pool
 * @param {Parrot} searchingParrot - The parrot searching for a mate
 * @param {Object} genePool - The wild gene pool
 * @param {Function} nameGenerator - Function to generate parrot name
 * @param {Function} idGenerator - Function to generate parrot ID
 * @returns {Object} Generated mate genes
 */
export function generateWildMate(searchingParrot, genePool, nameGenerator, idGenerator) {
    // Calculate base quality from beauty and pool
    const beauty = searchingParrot.calculateBeauty();
    const beautyScore = beauty.score / beauty.maxScore; // Normalize to 0-1
    const poolQuality = calculatePoolQuality(genePool);

    // Calculate overall mate quality
    let mateQuality = (beautyScore * BEAUTY_WEIGHT) + (poolQuality * POOL_WEIGHT);

    // Apply stamina modifier
    const perfStats = searchingParrot.getPerformanceStats();
    const staminaModifier = STAMINA_QUALITY_MODIFIER[perfStats.stamina.category];
    mateQuality += staminaModifier;

    // Clamp between 0 and 1
    mateQuality = Math.max(0, Math.min(1, mateQuality));

    // Generate genes for the mate
    const mateGenes = {};
    const bodyParts = ['wings', 'special_wing', 'body', 'head', 'tail', 'accents'];

    for (const part of bodyParts) {
        mateGenes[part] = {
            red: [],
            green: [],
            blue: [],
            gradient: false
        };

        // Generate color alleles
        for (const color of ['red', 'green', 'blue']) {
            const geneFreq = calculateFrequency(genePool[part][color]);
            const beautyBonus = beautyScore * BEAUTY_BONUS_MAX;

            for (let i = 0; i < 4; i++) {
                let dominantChance = geneFreq + beautyBonus;

                // Add randomness
                const randomFactor = (Math.random() - 0.5) * RANDOMNESS_VARIANCE;
                dominantChance += randomFactor;

                // Clamp between 0.05 and 0.95
                dominantChance = Math.max(0.05, Math.min(0.95, dominantChance));

                mateGenes[part][color].push(Math.random() < dominantChance);
            }
        }

        // Generate gradient
        const gradientFreq = calculateFrequency(genePool[part].gradient);
        const gradientChance = gradientFreq + (beautyScore * BEAUTY_BONUS_MAX);
        mateGenes[part].gradient = Math.random() < Math.min(0.9, gradientChance);
    }

    // Generate performance genes
    const performanceGenes = ['agility', 'intelligence', 'stamina', 'speed', 'fertility'];
    for (const gene of performanceGenes) {
        mateGenes[gene] = [];
        const geneFreq = calculateFrequency(genePool[gene]);

        // Fertility genes are more likely if searching parrot has high fertility
        let adjustedFreq = geneFreq;
        if (gene === 'fertility') {
            const fertilityLevel = searchingParrot.getFertilityLevel();
            if (fertilityLevel >= 3) {
                adjustedFreq += 0.15; // High fertility attracts high fertility
            } else if (fertilityLevel <= 1) {
                adjustedFreq -= 0.15; // Low fertility repels high fertility
            }
        }

        for (let i = 0; i < 4; i++) {
            let dominantChance = adjustedFreq + (beautyScore * 0.2);
            dominantChance = Math.max(0.05, Math.min(0.95, dominantChance));
            mateGenes[gene].push(Math.random() < dominantChance);
        }
    }

    return mateGenes;
}

/**
 * Generate multiple wild mate options
 * @param {Parrot} searchingParrot - The parrot searching for a mate
 * @param {Object} genePool - The wild gene pool
 * @param {Function} nameGenerator - Function to generate parrot name
 * @param {Function} idGenerator - Function to generate parrot ID
 * @returns {Array} Array of generated mates (Parrot objects)
 */
export function generateWildMateOptions(searchingParrot, genePool, nameGenerator, idGenerator) {
    const perfStats = searchingParrot.getPerformanceStats();

    // Base number of mates: 3
    let numMates = 3;

    // Add agility bonus
    numMates += AGILITY_MATE_BONUS[perfStats.agility.category];

    // Check stamina for bonus mate
    const bonusMateChance = STAMINA_BONUS_MATE_CHANCE[perfStats.stamina.category];
    if (Math.random() < bonusMateChance) {
        numMates++;
    }

    // Generate mates
    const mates = [];
    for (let i = 0; i < numMates; i++) {
        const mateGenes = generateWildMate(searchingParrot, genePool, nameGenerator, idGenerator);
        mates.push({
            name: nameGenerator(),
            genes: mateGenes,
            generation: searchingParrot.generation,
            id: idGenerator()
        });
    }

    return mates;
}
