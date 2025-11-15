/**
 * Headless Game Simulator
 * Runs the game logic without browser/UI dependencies for automated testing
 */

import { setupMockGlobals, cleanupMocks } from './mocks.js';
import * as GameState from '../public/js/core/gameState.js';
import { Parrot } from '../public/js/core/parrot.js';
import { breedParrotGenes } from '../public/js/core/genetics.js';
import { getRandomName, randomBodyPartGenes } from '../public/js/lib/utils.js';
import { SeededRandom } from './seeded-random.js';
import { TWILIGHT_GENES, PRISM_GENES } from './starter-parrots.js';

// Setup mocks before loading game modules
setupMockGlobals();

export class HeadlessGameSimulator {
    constructor(options = {}) {
        this.stats = {
            totalBreedings: 0,
            totalParrotsBorn: 0,
            totalCoinsSpent: 0,
            totalCoinsEarned: 0,
            totalParrotsBought: 0,
            totalParrotsSold: 0,
            totalExaminations: 0,
            rarityDistribution: {
                common: 0,
                uncommon: 0,
                rare: 0,
                epic: 0,
                legendary: 0
            },
            generationDistribution: {},
            errors: []
        };
        this.verbose = false;

        // Random number generator (seeded or unseeded)
        this.random = options.seed !== undefined
            ? new SeededRandom(options.seed)
            : null;

        // Whether to use starter parrots (default: false for backwards compatibility)
        this.useStarters = options.useStarters || false;
    }

    /**
     * Initialize a fresh game state
     */
    reset() {
        cleanupMocks();
        setupMockGlobals();

        // Reset game state to defaults
        GameState.setParrots([]);
        GameState.setStoreParrots([]);
        GameState.setRecentOffspring([]);
        GameState.setCoins(500);
        GameState.setParrotIdCounter(0);
        GameState.setGeneration(1);
        GameState.setMutationsEnabled(true);
        GameState.setAutoExamineEnabled(false);
        GameState.setExaminedParrots(new Set());
        GameState.setLockedParrots(new Set());
        GameState.clearUsedNames();

        // Reset stats
        this.stats = {
            totalBreedings: 0,
            totalParrotsBorn: 0,
            totalCoinsSpent: 0,
            totalCoinsEarned: 0,
            totalParrotsBought: 0,
            totalParrotsSold: 0,
            totalExaminations: 0,
            rarityDistribution: {
                common: 0,
                uncommon: 0,
                rare: 0,
                epic: 0,
                legendary: 0
            },
            generationDistribution: {},
            errors: []
        };

        this.log('Game state reset');

        // Add starter parrots if enabled
        if (this.useStarters) {
            this.addStarterParrots();
        }

        // Reset seeded random if using one
        if (this.random) {
            this.random.reset();
        }
    }

    /**
     * Add starter parrots (Twilight in collection, Prism ready to buy)
     */
    addStarterParrots() {
        // Add Twilight to collection
        const twilight = new Parrot(
            'Twilight',
            TWILIGHT_GENES,
            1,
            GameState.getAndIncrementParrotIdCounter()
        );
        GameState.addParrot(twilight);
        this.updateRarityStats(twilight);

        this.log('Added starter parrot: Twilight to collection');
    }

    /**
     * Get random boolean (using seeded random if available)
     */
    _randomBoolean() {
        return this.random ? this.random.boolean() : Math.random() < 0.5;
    }

    /**
     * Generate random body part genes (using seeded random if available)
     */
    _randomBodyPartGenes() {
        return {
            red: [this._randomBoolean(), this._randomBoolean(), this._randomBoolean(), this._randomBoolean()],
            green: [this._randomBoolean(), this._randomBoolean(), this._randomBoolean(), this._randomBoolean()],
            blue: [this._randomBoolean(), this._randomBoolean(), this._randomBoolean(), this._randomBoolean()],
            gradient: false
        };
    }

    /**
     * Buy a random parrot (simplified store logic)
     * Returns Prism if using starters and it's the first purchase, otherwise random
     */
    buyParrot() {
        const price = 50; // Standard parrot price
        const coins = GameState.getCoins();

        if (coins < price) {
            this.stats.errors.push('Insufficient coins to buy parrot');
            return null;
        }

        let genes;
        let name;

        // If using starters and this is the first purchase, give Prism
        if (this.useStarters && this.stats.totalParrotsBought === 0) {
            genes = PRISM_GENES;
            name = 'Prism';
        } else {
            // Generate random parrot
            genes = {
                wings: this._randomBodyPartGenes(),
                special_wing: this._randomBodyPartGenes(),
                body: this._randomBodyPartGenes(),
                head: this._randomBodyPartGenes(),
                tail: this._randomBodyPartGenes(),
                accents: this._randomBodyPartGenes()
            };
            name = getRandomName();
        }

        const parrot = new Parrot(
            name,
            genes,
            1,
            GameState.getAndIncrementParrotIdCounter()
        );

        GameState.addParrot(parrot);
        GameState.subtractCoins(price);

        this.stats.totalParrotsBought++;
        this.stats.totalCoinsSpent += price;
        this.updateRarityStats(parrot);

        this.log(`Bought parrot: ${parrot.name} (${parrot.rarity}) for ${price} coins`);
        return parrot;
    }

    /**
     * Breed two parrots
     */
    breedParrots(parent1, parent2) {
        const breedingCost = 50;
        const coins = GameState.getCoins();

        if (coins < breedingCost) {
            this.stats.errors.push('Insufficient coins to breed');
            return [];
        }

        if (!parent1 || !parent2) {
            this.stats.errors.push('Missing parent for breeding');
            return [];
        }

        const offspring = [];
        const generation = Math.max(parent1.generation, parent2.generation) + 1;

        // Generate 4 offspring
        for (let i = 0; i < 4; i++) {
            const childGenes = breedParrotGenes(parent1.genes, parent2.genes);
            const child = new Parrot(
                getRandomName(),
                childGenes,
                generation,
                GameState.getAndIncrementParrotIdCounter()
            );

            offspring.push(child);
            GameState.addRecentOffspring(child);
            this.updateRarityStats(child);
            this.updateGenerationStats(child);
        }

        GameState.subtractCoins(breedingCost);

        this.stats.totalBreedings++;
        this.stats.totalParrotsBorn += 4;
        this.stats.totalCoinsSpent += breedingCost;

        this.log(`Bred ${parent1.name} × ${parent2.name} → ${offspring.length} offspring (Gen ${generation})`);
        return offspring;
    }

    /**
     * Move offspring to collection
     */
    moveOffspringToCollection() {
        const offspring = GameState.getRecentOffspring();
        const count = offspring.length;

        offspring.forEach(parrot => {
            GameState.addParrot(parrot);
        });
        GameState.clearRecentOffspring();

        this.log(`Moved ${count} offspring to collection`);
        return count;
    }

    /**
     * Sell a parrot
     */
    sellParrot(parrot) {
        if (!parrot) {
            this.stats.errors.push('Cannot sell null parrot');
            return 0;
        }

        // Check if locked
        if (GameState.isParrotLocked(parrot.id)) {
            this.stats.errors.push(`Cannot sell locked parrot: ${parrot.name}`);
            return 0;
        }

        const value = parrot.getValue();
        GameState.addCoins(value);
        GameState.removeParrot(parrot.id);

        this.stats.totalParrotsSold++;
        this.stats.totalCoinsEarned += value;

        this.log(`Sold ${parrot.name} for ${value} coins`);
        return value;
    }

    /**
     * Examine a parrot (unlock genes)
     */
    examineParrot(parrot) {
        const examineCost = 100;
        const coins = GameState.getCoins();

        if (GameState.hasExaminedParrot(parrot.id)) {
            return true; // Already examined
        }

        if (coins < examineCost) {
            this.stats.errors.push('Insufficient coins to examine');
            return false;
        }

        GameState.addExaminedParrot(parrot.id);
        GameState.subtractCoins(examineCost);

        this.stats.totalExaminations++;
        this.stats.totalCoinsSpent += examineCost;

        this.log(`Examined ${parrot.name} for ${examineCost} coins`);
        return true;
    }

    /**
     * Lock a parrot
     */
    lockParrot(parrot) {
        GameState.addLockedParrot(parrot.id);
        this.log(`Locked ${parrot.name}`);
    }

    /**
     * Get current game state snapshot
     */
    getState() {
        return {
            parrots: GameState.getParrots(),
            offspring: GameState.getRecentOffspring(),
            coins: GameState.getCoins(),
            generation: GameState.getGeneration(),
            mutationsEnabled: GameState.getMutationsEnabled(),
            parrotCount: GameState.getParrots().length,
            offspringCount: GameState.getRecentOffspring().length
        };
    }

    /**
     * Update rarity statistics
     */
    updateRarityStats(parrot) {
        const rarity = parrot.calculateRarity();
        if (this.stats.rarityDistribution[rarity] !== undefined) {
            this.stats.rarityDistribution[rarity]++;
        }
    }

    /**
     * Update generation statistics
     */
    updateGenerationStats(parrot) {
        const gen = parrot.generation;
        this.stats.generationDistribution[gen] = (this.stats.generationDistribution[gen] || 0) + 1;
    }

    /**
     * Get simulation statistics
     */
    getStats() {
        const state = this.getState();
        return {
            ...this.stats,
            currentCoins: state.coins,
            currentParrots: state.parrotCount,
            currentOffspring: state.offspringCount,
            netCoins: this.stats.totalCoinsEarned - this.stats.totalCoinsSpent,
            avgBreedingCost: this.stats.totalBreedings > 0
                ? (this.stats.totalBreedings * 50) / this.stats.totalBreedings
                : 0
        };
    }

    /**
     * Enable/disable verbose logging
     */
    setVerbose(enabled) {
        this.verbose = enabled;
    }

    /**
     * Log message if verbose mode enabled
     */
    log(message) {
        if (this.verbose) {
            console.log(`  ${message}`);
        }
    }

    /**
     * Validate game state integrity
     */
    validateState() {
        const issues = [];
        const state = this.getState();

        // Check coins are not negative
        if (state.coins < 0) {
            issues.push(`Negative coins: ${state.coins}`);
        }

        // Check all parrots have valid IDs
        const allParrots = [...state.parrots, ...state.offspring];
        const ids = new Set();
        allParrots.forEach(p => {
            if (ids.has(p.id)) {
                issues.push(`Duplicate parrot ID: ${p.id}`);
            }
            ids.add(p.id);

            if (!p.name || p.name.trim() === '') {
                issues.push(`Parrot ${p.id} has no name`);
            }

            if (!p.genes || !p.genes.wings) {
                issues.push(`Parrot ${p.id} has invalid genes`);
            }
        });

        return issues;
    }
}

export default HeadlessGameSimulator;
