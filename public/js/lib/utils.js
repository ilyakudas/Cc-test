/**
 * ChromaWing Breeding Simulator - Utility Functions Module
 * General utility and helper functions
 */

import { PARROT_NAMES } from './constants.js';
import { getUsedNames, addUsedName, clearUsedNames } from '../core/gameState.js';

/**
 * Get a random unused parrot name
 * @returns {string} A random parrot name
 */
export function getRandomName() {
    const usedNames = getUsedNames();
    const availableNames = PARROT_NAMES.filter(name => !usedNames.has(name));

    if (availableNames.length === 0) {
        clearUsedNames();
        return PARROT_NAMES[Math.floor(Math.random() * PARROT_NAMES.length)];
    }

    const name = availableNames[Math.floor(Math.random() * availableNames.length)];
    addUsedName(name);
    return name;
}

/**
 * Generate a random boolean value
 * @returns {boolean}
 */
export function randomBoolean() {
    return Math.random() < 0.5;
}

/**
 * Create random genes for a body part
 * @returns {Object} Gene structure with red, green, blue arrays and gradient flag
 */
export function randomBodyPartGenes() {
    return {
        red: [randomBoolean(), randomBoolean(), randomBoolean(), randomBoolean()],
        green: [randomBoolean(), randomBoolean(), randomBoolean(), randomBoolean()],
        blue: [randomBoolean(), randomBoolean(), randomBoolean(), randomBoolean()],
        gradient: false
    };
}

/**
 * Create parrot genes with specified color purity
 * @param {string} targetPurity - 'high' (80% pure), 'medium' (50%), 'low' (20%), or 'random'
 * @returns {Object} Complete gene set for all body parts
 */
export function createParrotWithPurity(targetPurity) {
    const genes = {
        wings: null,
        special_wing: null,
        body: null,
        head: null,
        tail: null,
        accents: null
    };

    const bodyParts = ['wings', 'special_wing', 'body', 'head', 'tail', 'accents'];

    for (const part of bodyParts) {
        const partGenes = {
            red: [],
            green: [],
            blue: [],
            gradient: false
        };

        // Generate each color channel based on purity
        for (const color of ['red', 'green', 'blue']) {
            let alleles;
            if (targetPurity === 'high') {
                // 80% chance of pure (0000 or 1111)
                if (Math.random() < 0.8) {
                    const val = Math.random() < 0.5;
                    alleles = [val, val, val, val];
                } else {
                    // Nearly pure (0001 or 1110)
                    const base = Math.random() < 0.5;
                    alleles = [base, base, base, !base];
                }
            } else if (targetPurity === 'medium') {
                // 50% pure, 50% mixed
                if (Math.random() < 0.5) {
                    const val = Math.random() < 0.5;
                    alleles = [val, val, val, val];
                } else {
                    alleles = [randomBoolean(), randomBoolean(), randomBoolean(), randomBoolean()];
                }
            } else if (targetPurity === 'low') {
                // Mostly mixed
                alleles = [randomBoolean(), randomBoolean(), randomBoolean(), randomBoolean()];
            } else {
                // Random
                alleles = [randomBoolean(), randomBoolean(), randomBoolean(), randomBoolean()];
            }
            partGenes[color] = alleles;
        }

        genes[part] = partGenes;
    }

    return genes;
}
