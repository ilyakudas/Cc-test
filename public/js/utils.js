/**
 * ChromaWing Breeding Simulator - Utility Functions Module
 * General utility and helper functions
 */

import { PARROT_NAMES } from './constants.js';
import { getUsedNames, addUsedName, clearUsedNames } from './gameState.js';

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
