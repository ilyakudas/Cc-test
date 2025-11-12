// ChromaWing - Helper Utilities
// v3.0

import { RARITY_COLORS, RARITY_LABELS } from '../data/constants.js';

export function getRarityInfo(rarity) {
    return {
        color: RARITY_COLORS[rarity],
        label: RARITY_LABELS[rarity]
    };
}

export function formatNumber(num) {
    return num.toLocaleString();
}

export function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
