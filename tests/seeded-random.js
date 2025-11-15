/**
 * Seedable Random Number Generator
 * Uses mulberry32 algorithm for deterministic pseudo-random numbers
 */

export class SeededRandom {
    constructor(seed = Date.now()) {
        this.seed = seed;
        this.state = seed;
    }

    /**
     * Get next random number between 0 and 1
     * @returns {number} Random number [0, 1)
     */
    next() {
        let t = (this.state += 0x6D2B79F5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }

    /**
     * Get random boolean
     * @returns {boolean}
     */
    boolean() {
        return this.next() < 0.5;
    }

    /**
     * Get random integer between min (inclusive) and max (exclusive)
     * @param {number} min
     * @param {number} max
     * @returns {number}
     */
    integer(min, max) {
        return Math.floor(this.next() * (max - min)) + min;
    }

    /**
     * Get random element from array
     * @param {Array} array
     * @returns {*}
     */
    choice(array) {
        return array[this.integer(0, array.length)];
    }

    /**
     * Reset to initial seed
     */
    reset() {
        this.state = this.seed;
    }
}

// Export singleton for global use (can be replaced)
export let random = new SeededRandom();

/**
 * Set global random seed
 * @param {number} seed
 */
export function setSeed(seed) {
    random = new SeededRandom(seed);
}

/**
 * Use default Math.random (unseeded)
 */
export function useDefaultRandom() {
    random = {
        next: () => Math.random(),
        boolean: () => Math.random() < 0.5,
        integer: (min, max) => Math.floor(Math.random() * (max - min)) + min,
        choice: (array) => array[Math.floor(Math.random() * array.length)]
    };
}
