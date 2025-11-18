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

// === WILD MATE SYSTEM ===
// Conservation credit rewards for releasing parrots
export const RELEASE_BASE_CREDITS = 10;
export const RELEASE_RARITY_MULTIPLIER = 5;
export const RELEASE_STAR_MULTIPLIER = 3;
export const RELEASE_DIVERSITY_MULTIPLIER = 2;

// Wild mate finding costs
export const MATE_SEARCH_BASE_COST = 20;
export const MATE_SEARCH_INCREMENT = 10;

// Gene pool decay
export const DECAY_RATE_PER_WEEK = 0.05;
export const DRIFT_TARGET = 0.5;

// Quality calculations
export const BEAUTY_WEIGHT = 0.6;
export const POOL_WEIGHT = 0.4;
export const BEAUTY_BONUS_MAX = 0.4;
export const RANDOMNESS_VARIANCE = 0.2;

// Performance gene effects on mate finding
export const AGILITY_MATE_BONUS = {
    low: 0,    // 3 mates
    medium: 1, // 4 mates
    high: 2    // 5 mates
};

export const INTELLIGENCE_RETRY_MULTIPLIER = {
    low: 2.0,    // 2× cost on retry
    medium: 1.5, // 1.5× cost on retry
    high: 1.0    // 1× cost on retry (no increase)
};

export const STAMINA_QUALITY_MODIFIER = {
    low: -0.10,   // -10% to mate quality
    medium: 0,    // No modifier
    high: 0.10    // +10% to mate quality
};

export const STAMINA_BONUS_MATE_CHANCE = {
    low: 0,       // 0% chance of bonus mate
    medium: 0.10, // 10% chance of bonus mate
    high: 0.25    // 25% chance of bonus mate
};

export const SPEED_COST_MODIFIER = {
    low: 5,      // +5 credits (25 total)
    medium: 0,   // Standard cost (20)
    high: -5     // -5 credits (15 total)
};
