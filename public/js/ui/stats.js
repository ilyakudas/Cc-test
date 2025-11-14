/**
 * ChromaWing Breeding Simulator - Stats Module
 * Stats display functionality
 */

import * as GameState from '../gameState.js';

/**
 * Update stats display (coins, parrot count, generation)
 */
export function updateStats() {
    document.getElementById('coinsDisplay').textContent = GameState.getCoins();
    document.getElementById('parrotCount').textContent = GameState.getParrots().length;
    document.getElementById('maxGen').textContent = GameState.getGeneration();
}
