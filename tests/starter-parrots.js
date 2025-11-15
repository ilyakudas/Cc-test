/**
 * Starter Parrots Definitions
 * The predefined parrots that come with the game for early gameplay
 */

/**
 * Twilight - Starting parrot in player's collection
 * Designed to be beautiful and breed-worthy for early game
 */
export const TWILIGHT_GENES = {
    wings: {
        red: [false, false, true, true],
        green: [false, false, false, false],
        blue: [true, true, true, true],
        gradient: true
    },
    special_wing: {
        red: [true, true, true, true],
        green: [true, false, false, false],
        blue: [false, false, false, false],
        gradient: false
    },
    body: {
        red: [true, true, true, true],
        green: [true, true, false, false],
        blue: [false, false, false, false],
        gradient: false
    },
    head: {
        red: [true, true, true, false],
        green: [true, true, true, false],
        blue: [false, false, false, false],
        gradient: false
    },
    tail: {
        red: [false, false, true, true],
        green: [true, true, true, true],
        blue: [false, false, true, true],
        gradient: true
    },
    accents: {
        red: [true, false, true, false],
        green: [false, false, true, true],
        blue: [true, true, false, false],
        gradient: false
    }
};

/**
 * Prism - Starting parrot in the shop
 * Designed to complement Twilight for early breeding
 */
export const PRISM_GENES = {
    wings: {
        red: [true, true, false, false],
        green: [false, false, true, true],
        blue: [true, true, true, true],
        gradient: true
    },
    special_wing: {
        red: [false, false, false, false],
        green: [true, true, true, true],
        blue: [true, true, true, true],
        gradient: false
    },
    body: {
        red: [true, true, true, true],
        green: [true, true, true, false],
        blue: [false, false, false, false],
        gradient: false
    },
    head: {
        red: [false, false, false, false],
        green: [true, true, true, true],
        blue: [true, true, true, true],
        gradient: false
    },
    tail: {
        red: [true, true, true, true],
        green: [true, true, false, false],
        blue: [false, false, true, true],
        gradient: true
    },
    accents: {
        red: [true, true, true, false],
        green: [false, false, false, false],
        blue: [true, true, true, true],
        gradient: false
    }
};
