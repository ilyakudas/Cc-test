/**
 * ChromaWing Breeding Simulator - Economy Constants
 * Central configuration for all game costs, prices, and money-related values
 */

// === PLAYER RESOURCES ===
export const INITIAL_COINS = 500;

// === ACTION COSTS ===
export const BREEDING_COST = 50;
export const EXAMINATION_COST = 100;

// === TRADING VALUES ===
// Base value calculation for parrots
export const PARROT_BASE_VALUE = 50;
export const PARROT_BEAUTY_MULTIPLIER = 2; // multiplied by beauty score
export const PARROT_GENERATION_VALUE = 10; // multiplied by generation number

// Sell price multiplier (70% of value)
export const SELL_VALUE_MULTIPLIER = 0.7;

// === RARITY MULTIPLIERS ===
// Applied to base parrot value based on rarity
export const RARITY_VALUE_MULTIPLIERS = {
    'common': 1.0,
    'uncommon': 1.3,
    'rare': 1.6,
    'epic': 2.0,
    'legendary': 2.5
};

// === CONTEST SYSTEM ===
// Contest entry costs by tier
export const CONTEST_ENTRY_COSTS = {
    BEGINNER: 50,
    RAINBOW: 100,
    GRADIENT: 200,
    CONTRAST: 300,
    ELITE: 500
};

// Contest rewards by tier and placement
export const CONTEST_REWARDS = {
    BEGINNER: {
        first: 150,
        second: 100,
        third: 75
    },
    RAINBOW: {
        first: 300,
        second: 200,
        third: 150
    },
    GRADIENT: {
        first: 500,
        second: 350,
        third: 250
    },
    CONTRAST: {
        first: 750,
        second: 500,
        third: 350
    },
    ELITE: {
        first: 1500,
        second: 1000,
        third: 750
    }
};

// === ACHIEVEMENT THRESHOLDS ===
export const ACHIEVEMENT_COIN_THRESHOLDS = {
    WEALTHY: 1000,
    VERY_WEALTHY: 5000
};

// === UI/UX CONSTANTS ===
// Hold duration for sell button (milliseconds)
export const SELL_HOLD_DURATION = 1000;
